import mongoose from "mongoose";

/**
 * This is where the properties of the Institution Schema are defined.
 */
const institutionSchema = new mongoose.Schema(
	{
		city: {
			type: String,
			required: true,
		},
		completeAddress: {
			type: String,
			required: true,
		},
		institutionName: {
			type: String,
			required: true,
		},
		region: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

/**
 * Creates a model for the schema.
 */
const Institution = mongoose.model("institution", institutionSchema);
export default Institution;
