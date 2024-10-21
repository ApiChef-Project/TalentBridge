// import { applicationSchema } from "../models/application.model.js";
//
// applicationSchema.pre(
//   "deleteOne",
//   { document: true, query: false },
//   async function (next) {
//     const applicationId = this._id;
//     const userId = this.user;
//     const jobId = this.job;
//
//     // Remove the application ID from User and Job
//     await User.updateOne(
//       { _id: userId },
//       { $pull: { applications: applicationId } },
//     );
//     await Job.updateOne(
//       { _id: jobId },
//       { $pull: { applications: applicationId } },
//     );
//
//     next();
//   },
// );
//
// applicationSchema.pre("deleteMany", async function (next) {
//   const filter = this.getFilter(); // Get the filter used for deleteMany
//
//   // Find all applications that match the filter to remove their references
//   const applications = await Application.find(filter);
//
//   const applicationIds = applications.map((app) => app._id);
//   const userIds = applications.map((app) => app.user);
//   const jobIds = applications.map((app) => app.job);
//
//   // Remove application IDs from the associated users and jobs
//   await User.updateMany(
//     { _id: { $in: userIds } },
//     { $pull: { applications: { $in: applicationIds } } },
//   );
//
//   await Job.updateMany(
//     { _id: { $in: jobIds } },
//     { $pull: { applications: { $in: applicationIds } } },
//   );
//
//   next();
// });
