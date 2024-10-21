import mongoose from "mongoose";
import validator from "validator";
import Application from "./application.model.js";

/**
 * Defines the schema for the User model.
 *
 * @type {mongoose.Schema}
 * @property {String} firstName - The first name of the user. It is required.
 * @property {String} lastName - The last name of the user. It is required.
 * @property {String} email - The email address of the user. It is required, unique, and must be a valid email format.
 * @property {String} phone - The phone number of the user. It defaults to an empty string and must be a valid phone number format.
 * @property {String} hashedPassword - The hashed password for the user's account. It is required.
 * @property {String} refreshToken - JWT refresh token for user. It is required.
 * @property {Array} - Array of ObjectIds referencing the Application model.
 * @property {Object} timestamps - Automatically adds createdAt and updatedAt timestamps to the schema.
 */
export const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },

    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    phone: {
      type: String,
      default: "",
      validate: {
        validator: validator.isMobilePhone,
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },

    hashedPassword: {
      type: String,
      required: [true, "password is required"],
    },

    applications: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Application",
      default: [],
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

/**
 * Pre-delete hook for the userSchema in Mongoose.
 * This hook is triggered before a single document is deleted from the collection.
 * It ensures that all applications associated with the user are deleted before the user itself is removed.
 *
 * @param {Function} next - The next middleware function in the stack.
 */
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const userId = this._id;

      // Delete all applications associated with this user
      await Application.deleteMany({ user: userId });

      next();
    } catch (error) {
      next(error);
    }
  },
);

/**
 * The User model based on the userSchema.
 *
 * @type {mongoose.Model}
 */
const User = new mongoose.model("User", userSchema);

export default User;
