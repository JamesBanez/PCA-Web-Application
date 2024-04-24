import path from "path";
import fs from "fs";
import util from "util";
import { pipeline } from "stream";

import { authenticate } from "../middleware/jwt.js";
import {
	createFile,
	readFiles,
	updateFile,
	deleteFile,
} from "../controller/fileController.js";
import { create } from "domain";

const allowedExtensions = [
	".jpg",
	".jpeg",
	".png",
	".pdf",
	".doc",
	".docx",
	".xlsx",
	".xls",
	".csv",
	".txt",
];

export default function Route(fastify, opts, done) {
	const pump = util.promisify(pipeline);

	/**
	 * Uploads a file to the uploads folder
	 */
	fastify.route({
		method: "POST",
		url: "/:evalId",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const { evalId } = request.params;
			const files = request.files();

			if (!files) {
				return reply.code(404).send({ message: "No files uploaded." });
			}

			// Preps the parent directory
			const parentDir = path.join("uploads", evalId);
			if (!fs.existsSync(parentDir)) {
				fs.mkdirSync(parentDir);
			}

			// Saves the files and updates the database
			let results = [];
			for await (let part of files) {
				// Excludes all files not included in allowed extensions
				const ext = path.extname(part.filename).toLowerCase();
				if (!allowedExtensions.includes(ext)) {
					continue;
				}

				// Saves the file to storage
				const filepath = path.join(parentDir, part.filename);
				await pump(part.file, fs.createWriteStream(filepath));

				// Saves the file metadata in the database
				const result = await createFile({
					ext: ext,
					filename: part.filename,
					ownedBy: evalId,
					path: filepath,
				});

				results.push(result);
			}

			return reply.send(results);
		},
	});

	/**
	 * Retrieves file entries from specified evaluation entry
	 */
	fastify.route({
		method: "GET",
		url: "/:evalId/:fileId",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const { evalId, fileId } = request.params;
			if (evalId && fileId) {
				const result = await readFiles({ _id: fileId, ownedBy: evalId });
				return reply.send(result);
			} else if (evalId) {
				const result = await readFiles({ ownedBy: evalId });
				return reply.send(result);
			}
		},
	});

	/**
	 * Updates a file entry from the specified evaluation entry
	 */
	fastify.route({
		method: "PUT",
		url: "/:evalId/:fileId",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const { evalId, fileId } = request.params;
			const result = await updateFile(fileId, evalId, request.body);
			return reply.send(result);
		},
	});

	/**
	 * Deletes a file entry from the specified evaluation entry
	 */
	fastify.route({
		method: "DELETE",
		url: "/:evalId/:fileId",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const { evalId, fileId } = request.params;
			if (await deleteFile(fileId, evalId))
				return reply.send({ message: `File ${fileId} deleted.` });
			else return reply.code(400);
		},
	});

	done();
}
