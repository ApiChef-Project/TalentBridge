import mongoose from "mongoose";
import validator from "validator";
// import Company from "./company.model";

/**
 * Defines the schema for the Job model.
 *
 * @type {mongoose.Schema}
 * @property {String} title - The title of the job. It is required.
 * @property {String} type - The type of the job. It is required and must be one of "Remote", "Onsite", "Hybrid", or "Full-Time".
 * @property {String} description - A description of the job. It is required.
 * @property {String} salaryRange - The salary range for the job. It defaults to "Not Specified" and must be one of the predefined ranges.
 * @property {String} country - The country where the job is located. It is required.
 * @property {String} location - The specific location of the job within the country. It is required.
 * @property {Date} expiresAt - The expiration date of the job posting. It defaults to one year from the current date and time.
 * @property {mongoose.Schema.Types.ObjectId} company - The reference to the Company model. It is required.
 * @property {Object} timestamps - Automatically adds createdAt and updatedAt timestamps to the schema.
 */
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Remote", "Part-Time", , "Full-Time", "Hybrid"],
    },

    description: {
      type: String,
      required: true,
    },

    salaryRange: {
      type: String,
      enum: [
        "Not Specified",
        "Under $50K",
        "$50K - 60K",
        "$60K - 70K",
        "$70K - 80K",
        "$80K - 90K",
        "$90K - 100K",
        "$100K - 125K",
        "$125K - 150K",
        "$150K - 175K",
        "$175K - 200K",
        "Over $200K",
      ],
      default: "Not Specified",
    },

    country: {
      type: String,
      required: true,
      index: true,
    },

    location: {
      type: String,
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    applications: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Application",
      default: [],
    },
  },
  { timestamps: true },
);

/**
 * The Job model based on the jobSchema.
 *
 * @type {mongoose.Model}
 */
const Job = new mongoose.model("Job", jobSchema);

export default Job;
