import { authenticate } from "../middleware/jwt.js";
import {
	createInstitution,
	readInstitutions,
	deleteInstitution,
	updateInstitution,
} from "../controller/institutionController.js";

export default function Route(fastify, opts, done) {
	/**
	 * Gets intitution entries from the database
	 */
	fastify.route({
		method: "GET",
		url: "/:institutionId",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const { institutionId } = request.params;
			if (institutionId) {
				const result = await readInstitutions({ _id: institutionId });
				return reply.send(result);
			} else {
				const result = await readInstitutions();
				return reply.send(result);
			}
		},
	});

	/**
	 * Creates an institution entry to the database
	 */
	fastify.route({
		method: "POST",
		url: "/",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const result = await createInstitution(request.body);
			return reply.send(result);
		},
	});

	/**
	 * Update an institution entry in the database
	 */
	fastify.route({
		method: "PUT",
		url: "/:institutionId",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const { institutionId } = request.params;
			const result = await updateInstitution(institutionId, request.body);
			return reply.send(result);
		},
	});

	/**
	 * Delete an entry from the database
	 */
	fastify.route({
		method: "DELETE",
		url: "/:institutionId",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const { institutionId } = request.params;
			if (await deleteInstitution(institutionId))
				return reply.send({ message: `Institution ${institutionId} deleted.` });
			else return reply.code(400);
		},
	});

	done();
}
