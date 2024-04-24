import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import pino from "pino";

import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";

import mailer from "fastify-mailer";

const logger = pino({
	transport: {
		target: "pino-pretty",
	},
});
const fastify = Fastify({
	logger: logger,
});

/**
 * Server plugins
 */
fastify.register(formbody);
fastify.register(helmet);
fastify.register(multipart);
fastify.register(cors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"],
});
fastify.register(mailer, {
	defaults: { from: "<noreply@ademix.com>", subject: "Verify your account" },
	transport: {
		host: "smtp.gmail.com",
		secure: true,
		port: 465,
		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASS,
		},
	},
});

/**
 * Server Routing
 */
import admin from "./src/routes/admin.js";
import evaluations from "./src/routes/evaluations.js";
import files from "./src/routes/files.js";
import institutions from "./src/routes/institutions.js";
import users from "./src/routes/users.js";

fastify.get("/", function (request, reply) {
	reply.send({ hello: "world" });
});

fastify.register(admin, { prefix: "/v1/admin/fields" });
fastify.register(evaluations, { prefix: "/v1/evaluations" });
fastify.register(files, { prefix: "/v1/files" });
fastify.register(institutions, { prefix: "/v1/institutions" });
fastify.register(users, { prefix: "/v1/users" });

/**
 * Database configurations
 */
let DB_URL, mongod;
if (process.env.NODE_ENVIRONMENT === "development") {
	mongod = await MongoMemoryServer.create();
	DB_URL = mongod.getUri();
} else {
	DB_URL = process.env.DB_URL;
}

const DB_OPTIONS = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

/**
 * Starts the server and the database.
 */

// Connects the server to the database
mongoose.connect(DB_URL, DB_OPTIONS).then(function () {
	fastify.listen(
		{ port: process.env.SERVER_PORT },
		async function (err, address) {
			// If error is encountered, logs error
			if (err) {
				fastify.log.error(err);
				await mongoose.connection.close();
				await fastify.close();
				if (mongod) {
					await mongod.stop();
				}

				process.exit(1);
			}
		}
	);
});

["SIGINT", "SIGTERM"].forEach(function (signal) {
	process.on(signal, async function () {
		await mongoose.connection.close();
		await fastify.close();
		if (mongod) {
			await mongod.stop();
		}

		process.exit(0);
	});
});

export default fastify;
