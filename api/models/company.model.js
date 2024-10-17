import mongoose from "mongoose";
import validator from "validator";

/**
 * Defines the schema for the Company model.
 *
 * @type {mongoose.Schema}
 * @property {String} name - The name of the company. It is required and must be unique.
 * @property {String} description - A description of the company. It is required.
 * @property {String} email - The email address of the company. It is required, unique, and must be a valid email format.
 * @property {String} hashedPassword - The hashed password for the company's account. It is required and must be at least 8 characters long.
 * @property {String} phone - The phone number of the company. It must be a valid phone number format.
 * @property {Object} timestamps - Automatically adds createdAt and updatedAt timestamps to the schema.
 */
const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    //NOTE: superadmin authentication
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    hashedPassword: {
      type: String,
      minLength: 8,
      required: true,
    },

    //TODO: non-superadmin authentication

    phone: {
      type: String,
      validate: {
        validator: validator.isMobilePhone,
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  },
  { timestamps: true },
);

/**
 * The Company model based on the companySchema.
 *
 * @type {mongoose.Model}
 */
const Company = new mongoose.model("Company", companySchema);

export default Company;
