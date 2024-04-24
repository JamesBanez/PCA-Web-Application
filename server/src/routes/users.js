import * as dotenv from "dotenv";
dotenv.config();

import { login } from "../services/auth.js";

import { create } from "../controller/userController.js";
import { sendVerification, verifyUser } from "../services/verify.js";

export default function Route(fastify, opts, done) {
	/**
	 * Creates new user to the database
	 */
	fastify.route({
		method: "POST",
		url: "/register",
		handler: async function (request, reply) {
			const data = request.body;
			const _id = await create(data);
			return reply.send({ id: _id });
		},
	});

	/**
	 * Request from client to verify account. This sends an email
	 * to the new user.
	 */
	fastify.route({
		method: "GET",
		url: "/verify/:uid",
		handler: async function (request, reply) {
			const { uid } = request.params;
			const code = await sendVerification(uid);

			if (process.env.NODE_ENVIRONMENT === "development") {
				fastify.log.info(`Verification code: ${code}`);
				return reply.send({ verificationCode: code });
			}
		},
	});

	/**
	 * Request from client to verify account using the code. This
	 * checks if the user provided the correct code for verification.
	 */
	fastify.route({
		method: "POST",
		url: "/verify/:uid",
		handler: async function (request, reply) {
			const { uid } = request.params;
			const code = request.body.code;

			const result = await verifyUser(uid, code);
			return reply.send(result);
		},
	});

	/**
	 * Authenticates user to access resources
	 */
	fastify.route({
		method: "POST",
		url: "/login",
		handler: async function (request, reply) {
			const { email, password } = request.body.credentials;
			const { accessToken, refreshToken } = await login(email, password);

			// Display tokens
			if (process.env.NODE_ENVIRONMENT === "development") {
				fastify.log.info({ accessToken, refreshToken });
			}

			// Payload to send to client
			const payload = {
				accessToken: accessToken,
				refreshToken: refreshToken,
				tokenType: "Bearer",
			};

			return reply.send(payload);
		},
	});

	done();
}
