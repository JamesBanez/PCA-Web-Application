import * as dotenv from "dotenv";
dotenv.config();

import chai from "chai";
import fs from "fs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";

import formAutoContent from "form-auto-content";
import { describe, it, after, before } from "mocha";

import fastify from "../server.js";
import Evaluation from "../src/models/Evaluations.js";
import Institution from "../src/models/Institutions.js";
import User from "../src/models/Users.js";
import fastifyMultipart from "@fastify/multipart";

const assert = chai.assert;

describe("User-Server Simulation", function () {
	// Test credentials
	const test_email = "test@example.com";
	const test_password = "password1234";

	let test_id;
	let test_accessToken;
	let test_refreshToken;
	let test_institutionEntry;
	let test_evaluationEntry;
	let test_fileEntry;

	before(async function () {
		// Clears all the users
		await User.deleteMany({});
		await Institution.deleteMany({});
		await Evaluation.deleteMany({});
	});

	after(async function () {
		// Delete all files in the uploads folder
		const directory = "./uploads";

		try {
			const files = await fs.promises.readdir(directory);

			for (const file of files) {
				const filePath = path.join(directory, file);
				const stats = await fs.promises.lstat(filePath);

				if (stats.isDirectory()) {
					await fs.promises.rm(filePath, { recursive: true });
				} else {
					await fs.promises.unlink(filePath);
				}
			}
			fastify.log.info("Files deleted successfully.");
		} catch (err) {
			fastify.log.error("Error deleting files:", err);
		}
	});

	describe("Testing the connection", async function () {
		it("OK, hello there!", async function () {
			const response = await fastify.inject({
				method: "GET",
				url: "/",
			});

			const body = response.json();
			assert.equal(body.hello, "world");
		});
	});

	describe("Authentication and Authorization Services", function () {
		it("OK, Registers the user in the database", async function () {
			const payload = {
				credentials: {
					email: test_email,
					password: test_password,
				},
				info: {
					name: {
						firstName: "Jason",
						lastName: "Derulo",
						middleName: "M",
						suffix: "Jr.",
					},
				},
			};

			// Sends the payload to the server
			let response;
			response = await fastify.inject({
				method: "POST",
				url: "/v1/users/register",
				payload: payload,
			});

			// Parses and checks
			const json = response.json();
			assert.equal(response.statusCode, 200);
			assert.isTrue(mongoose.isValidObjectId(json.id));

			test_id = json.id;
		});

		it("OK, can request verification code", async function () {
			const user = await User.findById(test_id);

			let response;
			response = await fastify.inject({
				method: "GET",
				url: `/v1/users/verify/${test_id}`,
			});

			// Parses and checks
			const json = response.json();
			assert.equal(response.statusCode, 200);
			assert.equal(json.verificationCode, user.code);
		});

		it("OK, can verify user account", async function () {
			const user = await User.findById(test_id);

			let response;
			response = await fastify.inject({
				method: "POST",
				url: `/v1/users/verify/${test_id}`,
				payload: { code: user.code },
			});

			// Parses and checks
			const json = response.json();
			assert.equal(response.statusCode, 200);
			assert.deepEqual(json, {
				status: "ACTIVE",
				message: "Verified.",
			});
		});

		it("OK, can login to account", async function () {
			let response;
			response = await fastify.inject({
				method: "POST",
				url: "/v1/users/login",
				payload: {
					credentials: {
						email: test_email,
						password: test_password,
					},
				},
			});

			// Parses and checks
			const json = response.json();
			assert.hasAllKeys(json, ["accessToken", "refreshToken", "tokenType"]);
			assert.isDefined(json["accessToken"]);
			assert.isDefined(json["refreshToken"]);
			assert.isDefined(json["tokenType"]);

			// Sets tokens for the next test
			test_accessToken = json["accessToken"];
			test_refreshToken = json["refreshToken"];

			// Display test tokens
			fastify.log.info(test_accessToken);
		});

		it("OK, verifies jwt tokens", function () {
			let result;

			// Verifies access token
			result = jwt.verify(test_accessToken, process.env.ACCESS_TOKEN_SECRET);
			assert.isDefined(result, "Result is defined");
			assert.equal(result.uid, test_id);

			// Verifies refresh token
			result = jwt.verify(test_refreshToken, process.env.REFRESH_TOKEN_SECRET);
			assert.isDefined(result, "Result is defined");
			assert.equal(result.uid, test_id);
		});
	});

	describe("CRUD Functions for Institutions", function () {
		describe("API /v1/institutions", function () {
			it("OK, creates an institution entry", async function () {
				// Test payload
				const payload = {
					institutionName: "Technological Institute of the Philippines",
					completeAddress: "938 Aurora Boulevard, Cubao",
					city: "Quezon City",
					region: "Metro Manila",
				};

				const response = await fastify.inject({
					method: "POST",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: "/v1/institutions",
					payload: payload,
				});

				const result = response.json();

				assert.equal(response.statusCode, 200);
				assert.isTrue(
					mongoose.isValidObjectId(result._id),
					"Is not a valid object ID"
				);
			});

			it("OK, reads all institution entries", async function () {
				const response = await fastify.inject({
					method: "GET",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: "/v1/institutions/",
				});

				// Select single entry from the list
				const result = response.json()[0];

				assert.equal(response.statusCode, 200);
				assert.isTrue(mongoose.isValidObjectId(result._id));
				assert.equal(
					result.institutionName,
					"Technological Institute of the Philippines"
				);

				test_institutionEntry = result;
			});

			it("OK, reads a single institution entry", async function () {
				const expected = {
					institutionName: "Technological Institute of the Philippines",
					completeAddress: "938 Aurora Boulevard, Cubao",
					city: "Quezon City",
					region: "Metro Manila",
				};

				const response = await fastify.inject({
					method: "GET",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/institutions/${test_institutionEntry._id}`,
				});

				// Select single entry from the list
				const result = response.json()[0];
				const received = {
					institutionName: result.institutionName,
					completeAddress: result.completeAddress,
					city: result.city,
					region: result.region,
				};

				assert.equal(response.statusCode, 200);
				assert.isTrue(mongoose.isValidObjectId(result._id));
				assert.deepEqual(received, expected);
			});

			it("OK, updates an institution entry", async function () {
				// Test payload
				let payload = test_institutionEntry;
				payload.institutionName = "University of the Philippines";

				const response = await fastify.inject({
					method: "PUT",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/institutions/${test_institutionEntry._id}`,
					payload,
				});

				const newDoc = response.json();

				assert.equal(response.statusCode, 200);
				assert.equal(newDoc.institutionName, "University of the Philippines");
			});

			it("OK, deletes an institution entry", async function () {
				const response = await fastify.inject({
					method: "DELETE",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/institutions/${test_institutionEntry._id}`,
				});

				const { message } = response.json();

				assert.equal(response.statusCode, 200);
				assert.equal(
					message,
					`Institution ${test_institutionEntry._id} deleted.`
				);
			});
		});
	});

	describe("CRUD Functions for Evaluations and File Entries", function () {
		describe("API /v1/evaluations/", function () {
			it("OK, create evaluation entry", async function () {
				const payload = {
					ownedBy: test_institutionEntry._id, // used to tell that this entry is under that instutition
					dateOfEvaluation: "2023-01-01",
					evaluator: "Kenny",
					governmentAuthority: "G.A. 12345",
					kindOfVisit: "evaluation",
					program: "Computer Engineering",
				};

				const response = await fastify.inject({
					method: "POST",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: "/v1/evaluations/",
					payload,
				});

				const result = response.json();

				assert.equal(response.statusCode, 200);
				assert.isTrue(
					mongoose.isValidObjectId(result._id),
					"Is not a valid object ID"
				);
				assert.equal(result.ownedBy, test_institutionEntry._id);
			});

			it("OK, retrieves all evaluation entries", async function () {
				const response = await fastify.inject({
					method: "GET",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/evaluations/${test_institutionEntry._id}/`,
				});

				// Get a single entry from the list
				const result = response.json()[0];

				assert.equal(response.statusCode, 200);
				assert.isTrue(mongoose.isValidObjectId(result._id));

				test_evaluationEntry = result;
			});

			it("OK, retrieve an evaluation entry", async function () {
				const expected = {
					ownedBy: test_institutionEntry._id,
					dateOfEvaluation: "2023-01-01",
					evaluator: "Kenny",
					governmentAuthority: "G.A. 12345",
					kindOfVisit: "evaluation",
					program: "Computer Engineering",
				};

				const response = await fastify.inject({
					method: "GET",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/evaluations/${test_institutionEntry._id}/${test_evaluationEntry._id}`,
				});

				// Get a single entry from the list
				const result = response.json()[0];
				const received = {
					ownedBy: result.ownedBy,
					dateOfEvaluation: result.dateOfEvaluation,
					evaluator: result.evaluator,
					governmentAuthority: result.governmentAuthority,
					kindOfVisit: result.kindOfVisit,
					program: result.program,
				};

				assert.equal(response.statusCode, 200);
				assert.isTrue(mongoose.isValidObjectId(result._id));
				assert.deepEqual(received, expected);
			});

			it("OK, updates an evaluation entry", async function () {
				// Test payload
				let payload = test_evaluationEntry;
				payload.program = "Chemical Engineering";

				const response = await fastify.inject({
					method: "PUT",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/evaluations/${test_institutionEntry._id}/${test_evaluationEntry._id}`,
					payload,
				});

				const newDoc = response.json();

				assert.equal(response.statusCode, 200);
				assert.equal(newDoc.program, "Chemical Engineering");
			});

			it("OK, deletes an evaluation entry", async function () {
				const response = await fastify.inject({
					method: "DELETE",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/evaluations/${test_institutionEntry._id}/${test_evaluationEntry._id}`,
				});

				const { message } = response.json();

				assert.equal(response.statusCode, 200);
				assert.equal(
					message,
					`Evaluation ${test_evaluationEntry._id} deleted.`
				);
			});
		});

		describe("API /v1/uploads", function () {
			it("OK, uploads file in the server", async function () {
				const testFilePath = ".\\test\\images";
				const testFilename = "doge.jpg";

				const expected = {
					ext: path.extname(testFilename).toLowerCase(),
					filename: testFilename,
					ownedBy: test_evaluationEntry._id,
					path: path.join("uploads", test_evaluationEntry._id, testFilename),
				};

				// Prepares formdata
				const pathToFile = path.join(testFilePath, testFilename);
				const formData = formAutoContent({
					file: fs.createReadStream(pathToFile),
				});

				let response = await fastify.inject({
					url: `/v1/files/${test_evaluationEntry._id}`,
					method: "POST",
					headers: {
						...formData.headers,
						authorization: `Bearer ${test_accessToken}`,
					},
					body: formData.payload,
				});

				// Get a single entry from the list
				const result = response.json()[0];
				const received = {
					ext: result.ext,
					filename: result.filename,
					ownedBy: result.ownedBy,
					path: result.path,
				};

				assert.equal(response.statusCode, 200);
				assert.deepEqual(received, expected);
			});

			it("OK, retrieves all file entries of an evaluation entry", async function () {
				const response = await fastify.inject({
					method: "GET",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/files/${test_evaluationEntry._id}/`,
				});

				// Get a single entry from the list
				const result = response.json()[0];

				assert.equal(response.statusCode, 200);
				assert.isTrue(mongoose.isValidObjectId(result._id));

				test_fileEntry = result;
			});

			it("OK, retrieve a file entry of an evaluation entry", async function () {
				const expected = {
					ext: ".jpg",
					filename: "doge.jpg",
					ownedBy: test_evaluationEntry._id,
					path: path.join("uploads", test_evaluationEntry._id, "doge.jpg"),
				};

				const response = await fastify.inject({
					method: "GET",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/files/${test_evaluationEntry._id}/${test_fileEntry._id}`,
				});

				// Get a single entry from the list
				const result = response.json()[0];
				const received = {
					ext: result.ext,
					filename: result.filename,
					ownedBy: result.ownedBy,
					path: result.path,
				};

				assert.equal(response.statusCode, 200);
				assert.isTrue(mongoose.isValidObjectId(result._id));
				assert.deepEqual(received, expected);
			});

			it("OK, updates an file entry of an evaluation entry", async function () {
				// Test payload
				let payload = test_fileEntry;
				payload.filename = "doge_meme.jpg";

				const response = await fastify.inject({
					method: "PUT",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/files/${test_evaluationEntry._id}/${test_fileEntry._id}`,
					payload,
				});

				const newDoc = response.json();

				assert.equal(response.statusCode, 200);
				assert.equal(newDoc.filename, "doge_meme.jpg");
			});

			it("OK, deletes a file entry of an evaluation entry", async function () {
				const response = await fastify.inject({
					method: "DELETE",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: `/v1/files/${test_evaluationEntry._id}/${test_fileEntry._id}`,
				});

				const { message } = response.json();

				assert.equal(response.statusCode, 200);
				assert.equal(message, `File ${test_fileEntry._id} deleted.`);
			});
		});
	});

	describe("CRUD Functions for Adding Evaluation Fields", function () {
		describe("API /v1/admin/fields", function () {
			it("OK, add new fields to the schema", async function () {
				// Preparing payload
				const payload = [
					{
						schemaName: "evaluation",
						newField: "testField",
						fieldType: "String",
						opts: {
							required: true,
						},
					},
				];

				// Send request to server
				const response = await fastify.inject({
					method: "POST",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: "/v1/admin/fields",
					payload: payload,
				});

				assert.equal(response.statusCode, 200);
				assert.equal(response.json().message, "Added new field.");
			});

			it("OK, retrieves the schemas", async function () {
				// Sending request to the server
				const response = await fastify.inject({
					method: "GET",
					headers: {
						authorization: `Bearer ${test_accessToken}`,
					},
					url: "/v1/admin/fields/evaluation",
				});

				assert.equal(response.statusCode, 200);

				// Shows the schema
				fastify.log.info(response.json());
			});
		});
	});
});
