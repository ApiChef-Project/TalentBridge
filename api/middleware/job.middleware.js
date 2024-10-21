// import { jobSchema } from "../models/job.model.js";
//
// jobSchema.pre(
//   "deleteOne",
//   { document: true, query: false },
//   async function (next) {
//     const jobId = this._id;
//
//     // Delete all applications associated with this job
//     await Application.deleteMany({ job: jobId });
//
//     next();
//   },
// );
