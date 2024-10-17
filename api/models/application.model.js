import mongoose from "mongoose";
import validator from "validator";

/**
 * Defines the Schema for an Application model
 *
 * @typedef {mongoose.Schema}
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the User model
 * @property {string} resume - URL or path to the resume file
 * @property {string} [coverLetter] - URL or form data for the cover letter
 * @property {string} status - Status of the application, can be "pending", "accepted", "rejected", or "in-review"
 */
const applicationSchema = new mongoose.Schema(
  {
    // Reference to the User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Add index for performance
    },

    // URL or path to the resume file
    resume: {
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },

    // URL or form data for the cover letter
    coverLetter: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: (props) => `${props.value} is not a valid URL or text!`,
      },
    },

    // Status of the application
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "in-review"],
      default: "pending",
    },
  },
  { timestamps: true }, // Automatically add createdAt and updatedAt timestamps
);

/**
 * Application Model
 * @type {mongoose.Model<Application>}
 */
const Application = new mongoose.model("Application", applicationSchema);

export default Application;
