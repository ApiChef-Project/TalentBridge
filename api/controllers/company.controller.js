import { checkPassword, hashPassword } from "../lib/utils.js";
import Company from "../models/company.model.js";

export const fetchCompanies = async (req, res) => {
  try {
    const companies = await Company.find({}).select("-hashedPassword");
    res.status(200).json(companies);
  } catch (error) {
    console.error(`GET all companies Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id).select("-hashedPassword");
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid Company ID" });
    console.error(`GET company by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerCompany = async (req, res) => {
  try {
    const { name, description, email, password, phone } = req.body;

    // Validation
    if (!name || !description || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res
        .status(400)
        .json({ error: `Company with email ${email} already exists` });
    }

    const hashedPassword = await hashPassword(password);

    const user = req.user;

    const newCompany = new Company({
      name,
      description,
      email,
      hashedPassword,
      authorizedEmails: [user.email],
      phone,
    });
    await newCompany.save();

    // Remove the hashed password from the response
    const userResponse = newCompany.toObject();
    delete userResponse.hashedPassword;

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.name === "ValidationError")
      return res
        .status(400)
        .json({ error: error.message.split(":")[2].trim() });
    console.error(`POST Company Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
		/**
		 * TODO: What if they've forgotten the password, how to reset?
		 ** They will request a new password, which will then be sent to their email
		 ** And we'll add a feature for users to change their passwords by old one.
		 */
    const { name, description, email, password, phone } = req.body;

    // Validate request data
    if (!name || !description || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Check that the user is authorized by company and passed valid password
    if (!company.authorizedEmails.includes(user.email))
      return res.status(403).json({ error: "User is not authorized by company" });
    // Check that the user passed valid company password
    let isValidPassword = await checkPassword(password, company.hashedPassword);
	  if (!isValidPassword)
		  return res.status(403).json({ error: "Invalid Password!" });

    // const hashedPassword = await hashPassword(password);
    company.name = name;
    company.description = description;
    company.email = email;
    // company.hashedPassword = hashedPassword;
    company.phone = phone;

    await company.save();

    const userResponse = company.toObject();
    delete userResponse.hashedPassword;

    res.status(200).json(userResponse);
  } catch (error) {
    if (error.name === "ValidationError")
      return res
        .status(400)
        .json({ error: error.message.split(":")[2].trim() });
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid Company ID" });
    console.error(`PUT company by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const user = req.user;

    //Validate request data
    if (!password) {
      return res
        .status(400)
        .json({ error: "Company password is required" });
    }

    const company = await Company.findById(id);
    if (!company) return res.status(400).json({ error: "Company Not Found" });

    // Check that the user is authorized by company
    if (!company.authorizedEmails.includes(user.email))
      return res.status(403).json({ error: "User is not authorized!" });
    // Check that the user passed valid company password
    let isValidPassword = await checkPassword(password, company.hashedPassword)
    if (!isValidPassword)
		return res.status(403).json({ error: "Invalid Password!" });

    await company.deleteOne();
    return res.status(204).json({ success: "Successfully Deleted Company" });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid Company ID" });
    console.error(`DELETE company by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
