import mongoose from "mongoose";
import validator from "validator";
import Application from "./application.model.js";

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
 * @property {Array} - Array of ObjectIds referencing the Application model.
 * @property {Object} timestamps - Automatically adds createdAt and updatedAt timestamps to the schema.
 */
export const jobSchema = new mongoose.Schema(
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
 * Pre-delete hook for the jobSchema in Mongoose.
 * This hook is triggered before a single document is deleted from the collection.
 * It ensures that all applications associated with the job are deleted before the job itself is removed.
 *
 * @param {Function} next - The next middleware function in the stack.
 */
jobSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const jobId = this._id;

      // Delete all applications associated with this job
      await Application.deleteMany({ job: jobId });

      next();
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Pre-delete hook for the jobSchema in Mongoose.
 * This hook is triggered before multiple documents are deleted from the collection.
 * It ensures that all applications associated with the jobs are deleted before the jobs themselves are removed.
 *
 * @param {Function} next - The next middleware function in the stack.
 */
jobSchema.pre(
  "deleteMany",
  { document: true, query: false },
  async function (next) {
    try {
      const filter = this.getFilter();
      const jobs = await Job.find(filter).exec();
      const jobIds = jobs.map((job) => job._id);

      // Batch delete applications with one query
      await Application.deleteMany({ job: { $in: jobIds } });

      next();
    } catch (error) {
      next(error);
    }
  },
);

/**
 * The Job model based on the jobSchema.
 *
 * @type {mongoose.Model}
 */
const Job = new mongoose.model("Job", jobSchema);

export default Job;
