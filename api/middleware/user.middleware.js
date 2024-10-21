// import { userSchema } from "../models/user.model.js";
//
// userSchema.pre(
//   "deleteOne",
//   { document: true, query: false },
//   async function (next) {
//     const userId = this._id;
//     console.log("Delete Hook Fired For User", userId);
//
//     // Delete all applications associated with this user
//     await Application.deleteMany({ user: userId });
//
//     next();
//   },
// );
