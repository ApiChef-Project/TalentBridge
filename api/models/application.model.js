import mongoose from "mongoose";
import validator from "validator";
import User from "./user.model.js";
import Job from "./job.model.js";

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

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
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

    //NOTE: URLs or consider form data?
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

applicationSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const applicationId = this._id;
    const userId = this.user;
    const jobId = this.job;
    console.log("Application preDelOne Hook Fired:", applicationId);

    // Remove the application ID from User and Job
    await User.updateOne(
      { _id: userId },
      { $pull: { applications: applicationId } },
    );
    await Job.updateOne(
      { _id: jobId },
      { $pull: { applications: applicationId } },
    );

    next();
  },
);

applicationSchema.pre("deleteMany", async function (next) {
  console.log("Application preDelMany Hook Fired");
  const filter = this.getFilter(); // Get the filter used for deleteMany

  // Find all applications that match the filter to remove their references
  const applications = await Application.find(filter);

  const applicationIds = applications.map((app) => app._id);
  const userIds = applications.map((app) => app.user);
  const jobIds = applications.map((app) => app.job);

  // Remove application IDs from the associated users and jobs
  await User.updateMany(
    { _id: { $in: userIds } },
    { $pull: { applications: { $in: applicationIds } } },
  );

  await Job.updateMany(
    { _id: { $in: jobIds } },
    { $pull: { applications: { $in: applicationIds } } },
  );

  next();
});

/**
 * Application Model
 * @type {mongoose.Model}
 */
const Application = new mongoose.model("Application", applicationSchema);

export default Application;
