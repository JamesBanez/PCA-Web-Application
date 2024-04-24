import {
	readEvaluations,
	createEvaluation,
	updateEvaluation,
	deleteEvaluation,
} from "../controller/evaluationController.js";
import { authenticate } from "../middleware/jwt.js";

export default function Route(fastify, opts, done) {
	/**
	 * Creates an evaluation entry to the database
	 */
	fastify.route({
		method: "POST",
		url: "/",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const result = await createEvaluation(request.body);
			return reply.send(result);
		},
	});

	/**
	 * Gets evaluation entries from the database
	 */
	fastify.route({
		method: "GET",
		url: "/:ownedBy/:evalId",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const { ownedBy, evalId } = request.params;

			if (ownedBy && evalId) {
				const result = await readEvaluations({ _id: evalId, ownedBy: ownedBy });
				return reply.send(result);
			} else if (ownedBy) {
				const result = await readEvaluations({ ownedBy: ownedBy });
				return reply.send(result);
			} else {
				return reply.status(400).send({ message: "Provide ownedBy ID" });
			}
		},
	});

	/**
	 * Update an evaluation entry in the database
	 */
	fastify.route({
		method: "PUT",
		url: "/:ownedBy/:evalId",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const { ownedBy, evalId } = request.params;
			const result = await updateEvaluation(
				{ ownedBy, _id: evalId },
				request.body
			);
			return reply.send(result);
		},
	});

	/**
	 * Delete an entry from the database
	 */
	fastify.route({
		method: "DELETE",
		url: "/:ownedBy/:evalId",
		preHandler: authenticate,
		handler: async function (request, reply) {
			const { ownedBy, evalId } = request.params;
			if (await deleteEvaluation({ ownedBy, _id: evalId }))
				return reply.send({ message: `Evaluation ${evalId} deleted.` });
			else return reply.code(400);
		},
	});

	done();
}
