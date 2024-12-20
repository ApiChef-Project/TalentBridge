import { checkPassword, hashPassword } from "../lib/utils.js";
import Company from "../models/company.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

/**
 * GET /companies
 * Returns all companies without hashed passwords.
 */
export const fetchCompanies = async (req, res) => {
	try {
		const companies = await Company.find({}).select("-hashedPassword");
		res.status(200).json(companies);
	} catch (error) {
		console.error(`GET all companies Controller Error: ${error.message}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * GET /companies/:id
 * Returns a company by id without hashed password.
 */
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

/**
 * POST /companies
 * Creates a new company if the email is not already taken.
 * The user that makes the request must be logged in.
 * The user who makes the request is automatically added to the authorized emails.
 * Returns a company object without the hashed password.
 */
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

/**
 * PUT /companies/:id
 * Updates a company by id, if the email is not already taken.
 * The user that makes the request must be logged in.
 * The user who makes the request must be authorized by the company.
 * The user who makes the request must pass the valid company password.
 * Returns a company object without the hashed password.
 */
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
			return res
				.status(403)
				.json({ error: "User is not authorized by company" });
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

/**
 * DELETE /companies/:id
 * Deletes a company by id, if the user is authorized and the user passed valid company password.
 * The user that makes the request must be logged in.
 * The user who makes the request must be authorized by the company.
 * The user who makes the request must pass the valid company password.
 * Returns a message of success if the company was deleted successfully.
 */
export const deleteCompany = async (req, res) => {
	try {
		const { id } = req.params;
		const { password } = req.body;
		const user = req.user;

		//Validate request data
		if (!password) {
			return res.status(400).json({ error: "Company password is required" });
		}

		const company = await Company.findById(id);
		if (!company) return res.status(400).json({ error: "Company Not Found" });

		// Check that the user is authorized by company
		if (!company.authorizedEmails.includes(user.email))
			return res.status(403).json({ error: "User is not authorized!" });
		// Check that the user passed valid company password
		let isValidPassword = await checkPassword(password, company.hashedPassword);
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

/**
 * GET /companies/:companyID/jobs/:jobID/applications
 * Returns all applications to a job listing by jobID in a company.
 * The user that makes the request must be logged in.
 * The user who makes the request must be authorized by the company.
 * Returns an array of application objects.
 */
export const fetchJobApplications = async (req, res) => {
	// "/:companyID/jobs/:jobID/applications",

	try {
		const { companyID, jobID } = req.params;
		const user = req.user;

		const company = await Company.findById(companyID);
		if (!company) return res.status(400).json({ error: "Company Not Found" });

		// Check that the user is authorized by company
		if (!company.authorizedEmails.includes(user.email))
			return res.status(403).json({ error: "User is not authorized!" });

		const job = await Job.findOne({ company, _id: jobID });
		if (!job) return res.status(400).json({ error: "Job Not Found" });

		const applications = await Application.find({ job: jobID });
		return res.status(200).json({ applications });
	} catch (error) {
		if (error.name === "CastError")
			return res.status(400).json({ error: "Invalid Company or Job ID" });
		console.error(
			`GET applications to Company Job Controller Error: ${error.message}`,
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * GET /companies/:companyID/jobs/:jobID/applications/:appID
 * Returns the application with ID appID to a job listing by jobID in a company.
 * The user that makes the request must be logged in.
 * The user who makes the request must be authorized by the company.
 * Returns the application object.
 */
export const fetchJobApplication = async (req, res) => {
	// "/:companyID/jobs/:jobID/applications/:appID",

	try {
		const { companyID, jobID, appID } = req.params;
		const user = req.user;

		const company = await Company.findById(companyID);
		if (!company) return res.status(400).json({ error: "Company Not Found" });

		// Check that the user is authorized by company
		if (!company.authorizedEmails.includes(user.email))
			return res.status(403).json({ error: "User is not authorized!" });

		const job = await Job.findOne({ company, _id: jobID });
		if (!job) return res.status(400).json({ error: "Job Not Found" });

		const application = await Application.find({ job: jobID, _id: appID });

		return res.status(200).json(application);
	} catch (error) {
		if (error.name === "CastError")
			return res
				.status(400)
				.json({ error: "Invalid Company or Job or Application ID" });
		console.error(
			`GET Application to Company Job Controller Error: ${error.message}`,
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * PATCH /companies/:companyID/jobs/:jobID/applications/:appID/:action
 * Updates the status of an application to a job listing by jobID in a company.
 * The user that makes the request must be logged in.
 * The user who makes the request must be authorized by the company.
 * The action parameter must be one of the allowed actions.
 * Returns a message of success and the updated application object if the application status was updated successfully.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const processJobApplication = async (req, res) => {
	// "/:companyID/jobs/:jobID/applications/:appID/:action",

	try {
		const { companyID, jobID, appID, action } = req.params;
		const user = req.user;

		const company = await Company.findById(companyID);
		if (!company) return res.status(400).json({ error: "Company Not Found" });

		// Check that the user is authorized by company
		if (!company.authorizedEmails.includes(user.email))
			return res.status(403).json({ error: "User is not authorized!" });

		const job = await Job.findOne({ company, _id: jobID });
		if (!job) return res.status(400).json({ error: "Job Not Found" });

		const app = await Application.findOne({ _id: appID });
		if (!app) return res.status(400).json({ error: "Application Not Found" });

		const enums = ["pending", "accepted", "rejected", "in-review"];
		const allowedActions = ["accept", "reject", "review"];

		if (!allowedActions.includes(action.toLowerCase())) {
			return res
				.status(400)
				.json({ error: "Invalid Action", "allowed actions": allowedActions });
		}

		let newStatus;
		switch (action.toLowerCase()) {
			case "accept":
				newStatus = "accepted";
				break;
			case "reject":
				newStatus = "rejected";
				break;
			case "review":
				newStatus = "in-review";
				break;
			default:
				newStatus = "pending";
		}

		const updatedApp = await Application.findOneAndUpdate(
			{ _id: appID, job: jobID },
			{ $set: { status: newStatus } },
			{ new: true },
		);
		res.status(200).json({
			message: "Application status updated successfully",
			application: updatedApp,
		});
	} catch (error) {
		if (error.name === "CastError")
			return res
				.status(400)
				.json({ error: "Invalid Company or Job or Application ID" });
		console.error(
			`PATCH Application to Company Job Controller Error: ${error.message}`,
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
