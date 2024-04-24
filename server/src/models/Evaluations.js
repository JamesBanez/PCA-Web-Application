import mongoose from "mongoose";

/**
 * This is where the properties of the Evaluation Schema are defined.
 */
const evaluationSchema = new mongoose.Schema(
	{
		attachedFiles: [
			{
				type: String,
			},
		],
		dateOfEvaluation: {
			type: String,
			required: true,
		},
		evaluator: {
			type: String,
			required: true,
		},
		governmentAuthority: {
			type: String,
			required: true,
		},
		kindOfVisit: {
			type: String,
			required: true,
		},
		ownedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "institution",
			required: true,
		},
		program: {
			type: String,
			required: true,
		},
		remarks: {
			type: String,
		},
	},
	{ timestamps: true }
);

/**
 * Creates a model for the schema.
 */
const Evaluation = mongoose.model("evaluation", evaluationSchema);
export default Evaluation;
