import fastify from "../../server.js";

export async function sendMail(to, html) {
	try {
		const { mailer } = require(fastify);

		// Sends email
		const info = await mailer.sendMail({
			to: to,
			html: html,
		});

		return {
			status: "OK",
			message: "Email successfully sent.",
			info: {
				from: info.from,
				to: info.to,
			},
		};
	} catch (err) {
		throw err;
	}
}
