import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * This is where the properties of the Users Schema are defined.
 */
const userSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			maxLength: 8,
		},
		status: {
			type: String,
			enum: ["ACTIVE", "INACTIVE"],
			default: "INACTIVE",
		},
		userType: {
			type: String,
			enum: ["USER", "ADMIN"],
			default: "USER",
		},
		credentials: {
			email: {
				type: String,
				required: true,
				unique: true,
			},
			password: {
				type: String,
				required: true,
			},
		},
		info: {
			name: {
				firstName: {
					type: String,
					required: true,
				},
				lastName: {
					type: String,
					required: true,
				},
				middleName: {
					type: String,
				},
				suffix: {
					type: String,
				},
			},
		},
	},
	{ timestamps: true }
);

/**
 * Generates code on save
 */
userSchema.pre("save", function (next) {
	let user = this;

	// Only generate code when user is INACTIVE
	if (user.status === "ACTIVE") return next();
	user.code = crypto.randomBytes(4).toString("hex");
	next();
});

/**
 * Adds password hashing
 */
userSchema.pre("save", function (next) {
	const user = this;

	// Generate a salt
	const SALT_WORK_FACTOR = 10;
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);

		// Hash the password using our new salt
		bcrypt.hash(user.credentials.password, salt, function (err, hash) {
			if (err) return next(err);
			// Override the cleartext password with the hashed one
			user.credentials.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(
		candidatePassword,
		this.credentials.password,
		function (err, isMatch) {
			if (err) return cb(err);
			cb(null, isMatch);
		}
	);
};

userSchema.methods.compareVerificationCode = function (candidateCode, cb) {
	const user = this;

	if (user.code !== candidateCode) return cb(false);
	cb(true);
};

/**
 * Creates a model for the schema.
 */
const User = mongoose.model("user", userSchema);
export default User;
