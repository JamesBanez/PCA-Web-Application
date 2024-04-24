import * as dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

/**
 * Generates JWT token using provided token secrets
 * @param {*} payload
 * @param {String} type
 * @returns
 */
export function generateToken(payload, type = "access") {
	try {
		switch (type) {
			case "access":
				return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
					expiresIn: "24h",
				});
			case "refresh":
				return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
					expiresIn: "7d",
				});
			default:
				return null;
		}
	} catch (err) {
		throw err;
	}
}

/**
 * Verifies token using provided token secrets.
 * @param {*} token 
 * @param {*} type 
 * @returns 
 */
export function verifyToken(token, type = "access") {
	try {
		switch (type) {
			case "access":
				return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			case "refresh":
				return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
			default:
				return null;
		}
	} catch (err) {
		throw err;
	}
}
