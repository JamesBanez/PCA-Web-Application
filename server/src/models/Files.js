import mongoose from "mongoose";

/**
 * This is where the properties of the File Schema are defined.
 */
const fileSchema = new mongoose.Schema(
	{
		ext: String,
		filename: {
			type: String,
			required: true,
		},
		ownedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "evaluation",
			required: true,
		},
		path: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

/**
 * Creates a model for the schema.
 */
const File = mongoose.model("file", fileSchema);
export default File;
