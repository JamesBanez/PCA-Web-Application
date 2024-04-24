import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt.js";

export function authenticate(request, reply, next) {
	const authHeader = request.headers["authorization"];
	if (!authHeader) {
		reply.code(401).send({ message: "No authorization header found." });
	}

	// Get access token
	const token = authHeader.split(" ")[1];
	if (!token) {
		return reply.code(401).send({ message: "No JWT token found." });
	}

	// Verify token
	try {
		const user = verifyToken(token);
		request.user = user;
	} catch (err) {
		if (err instanceof jwt.JsonWebTokenError) {
			return reply.code(401).send({ message: "JWT token is invalid." });
		} else if (err instanceof jwt.TokenExpiredError) {
			return reply.code(403).send({ message: "JWT token is expired." });
		}
	}

	next();
}
