import * as dotenv from "dotenv";
dotenv.config();

import User from "../models/Users.js";
import { generateToken } from "../utils/jwt.js";
import fastify from "../../server.js";

/**
 * Verifies authenticity of the user.
 */
export async function login(email, password) {
	try {
		const user = await User.findOne({ "credentials.email": email }).exec();
		if (!user) throw new Error("User not found.");

		// Compares the candidate password to the actual password from the database.
		user.comparePassword(password, function (err, isMatch) {
			try {
				if (err) {
					throw err;
				}

				if (!isMatch) throw new Error("Password is not matching.");
			} catch (err) {}
		});

		// Preps payload
		const payload = {
			userType: user.userType,
			uid: user._id,
			name: user.info?.name,
			status: user.status,
		};

		// Generates a new token
		const accessToken = generateToken(payload, "access");
		const refreshToken = generateToken(payload, "refresh");

		return { accessToken, refreshToken };
	} catch (err) {
		throw err;
	}
}
