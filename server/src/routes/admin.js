import {
	addNewFieldToSchema,
	getFieldsFromSchema,
} from "../controller/fieldController.js";
import { authenticate } from "../middleware/jwt.js";

export default function Route(fastify, opts, done) {
	fastify.route({
		method: "POST",
		url: "/",
		preHandler: authenticate,
		handler: function (request, reply) {
			/** FOR DEVELOPMENT ONLY */
			request.user.userType = "ADMIN";

			// Checks if the user is an admin
			if (!request.user || request.user.userType !== "ADMIN") {
				return reply
					.code(403)
					.send({ message: "You are forbidden to access beyond this point." });
			}

			// Get request
			const fields = request.body;

			// Adds field to the schema
			addNewFieldToSchema(fields);
			return reply.send({ message: "Added new field." });
		},
	});

	fastify.route({
		method: "GET",
		url: "/:schemaName",
		preHandler: authenticate,
		handler: function (request, reply) {
			const { schemaName } = request.params;

			// Gets fields from schema
			const schema = getFieldsFromSchema(schemaName);

			return reply.send(schema);
		},
	});

	done();
}
