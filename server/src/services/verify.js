import * as dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import fs from "fs";
import handlebars from "handlebars";

import User from "../models/Users.js";
import ApiError from "../utils/errors.js";
import { sendMail } from "./email.js";

/**
 * Generates a random Hex string based on the number of bytes.
 * @param {number} bytes
 * @returns
 */
function _generateHex(bytes) {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Reads html file using fs library
 * @param {*} path
 * @param {*} callback
 */
function _readHTMLFile(path, callback) {
  fs.readFile(path, {
    encoding: "utf-8",
    function(err, html) {
      if (err) {
        callback(err);
      } else {
        callback(null, html);
      }
    },
  });
}

/**
 * Sends a verification email to the new user.
 */
export async function sendVerification(uid) {
  const user = await User.findById(uid);

  // Checks if the user is verified
  if (user.status === "ACTIVE") {
    throw new ApiError(400, "User is already verified.");
  }

  switch (process.env.NODE_ENVIRONMENT) {
    case "deployment":
      // Reads the verify template html
      _readHTMLFile("../templates/verify.html", function (err, html) {
        if (err) {
          throw err;
        }

        const template = handlebars.compile(html);
        const replacements = {
          firstName: user.info.name.firstName,
          code: user.code,
        };

        // Replaces all placeholders and sends the email
        const htmlToSend = template(replacements);
        sendMail(user.credentials.email, htmlToSend);
      });

      break;
    case "development":
      return user.code;
  }
}

/**
 * Verifies the user in the database
 * @param {*} uid
 */
export async function verifyUser(uid, code) {
  const user = await User.findById(uid);

  // Checks if the user is verified
  if (user.status === "ACTIVE") {
    throw new ApiError(400, "User is already verified.");
  }

  try {
    user.compareVerificationCode(code, async function (isMatch) {
      if (isMatch === false)
        throw new ApiError(400, "Incorrect verification code.");
      user.status = "ACTIVE";
      await user.save();
    });

    return { status: user.status, message: "Verified." };
  } catch (err) {
    throw err;
  }
}
