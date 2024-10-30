import Job from "../models/job.model.js";
import Company from "../models/company.model.js";

/**
 * GET /jobs
 * Returns an array of all job listings.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const fetchJobs = async (req, res) => {
	try {
		const jobs = await Job.find({});
		res.status(200).json(jobs);
	} catch (error) {
		console.error(`GET all jobs Controller Error: ${error.message}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * GET /jobs/:id
 * Retrieves a job listing by its ID.
 * @param {Object} req - Express request object containing the job ID in params.
 * @param {Object} res - Express response object used to return the job data or an error.
 * @throws {Error} If job is not found or an invalid ID is provided, returns a 404 or 400 status respectively.
 */
export const fetchJob = async (req, res) => {
	try {
		const { id } = req.params;
		const job = await Job.findById(id);
		if (!job) {
			return res.status(404).json({ error: "Job not found" });
		}
		res.status(200).json(job);
	} catch (error) {
		if (error.name === "CastError")
			return res.status(400).json({ error: "Invalid Job ID" });
		console.error(`GET job by id Controller Error: ${error.message}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * POST /jobs
 * Creates a new job listing.
 * The user that makes the request must be logged in.
 * The user who makes the request must be authorized by the company.
 * The request body must contain all required fields.
 * Returns the newly created job listing.
 * @param {Object} req - Express request object containing the job data in the body.
 * @param {Object} res - Express response object used to return the job data or an error.
 * @throws {Error} If the request body is missing a required field, returns a 400 status.
 * @throws {Error} If the user is not authorized by the company, returns a 403 status.
 * @throws {Error} If an internal error occurs, returns a 500 status.
 */
export const createJob = async (req, res) => {
	try {
		const {
			title,
			salaryRange,
			type,
			description,
			country,
			location,
			company_id,
		} = req.body;

		// Validate request data
		if (
			!title ||
			!type ||
			!description ||
			!country ||
			!location ||
			!company_id
		) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const company = await Company.findById(company_id);
		if (!company) {
			return res.status(400).json({ error: "Company Not Found" });
		}

		// Check that user attached to session has authority to add job
		const user = req.user;
		if (!company.authorizedEmails.includes(user.email))
			return res.sendStatus(403);

		const newJob = new Job({
			title,
			type,
			description,
			country,
			location,
			company,
			salaryRange,
		});

		await newJob.save();
		res.status(201).json(newJob);
	} catch (error) {
		if (error.name === "ValidationError")
			return res
				.status(400)
				.json({ error: error.message.split(":")[2].trim() });
		if (error.name === "CastError")
			return res.status(400).json({ error: "Invalid Company ID" });
		console.error(`Post Jobs Controller Error: ${error.message}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * DELETE /jobs/:id
 * Deletes a job listing by its ID.
 * The user that makes the request must be logged in.
 * The user who makes the request must be authorized by the company.
 * Returns a success message if the job was deleted successfully.
 * @param {Object} req - Express request object containing the job ID in params.
 * @param {Object} res - Express response object used to return a success message or an error.
 * @throws {Error} If job is not found, returns a 400 status.
 * @throws {Error} If the user is not authorized by the company, returns a 403 status.
 * @throws {Error} If an invalid ID is provided, returns a 400 status.
 * @throws {Error} If an internal error occurs, returns a 500 status.
 */
export const deleteJob = async (req, res) => {
	try {
		const { id } = req.params;
		const job = await Job.findOne({ _id: id });
		if (!job) return res.status(400).json({ error: "Job Not Found" });

		// Check that user attached to session has authority to delete job
		const company = await Company.findById(job.company);
		const user = req.user;
		if (!company.authorizedEmails.includes(user.email))
			return res.sendStatus(403);

		await job.deleteOne({ _id: id });
		return res.status(204).json({ success: "Successfully Deleted Job" });
	} catch (error) {
		if (error.name === "CastError")
			return res.status(400).json({ error: "Invalid Job ID" });
		console.error(`Delete Job Controller Error: ${error.message}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * PUT /jobs/:id
 * Updates a job listing by its ID.
 * The user that makes the request must be logged in.
 * The user who makes the request must be authorized by the company.
 * The request body must contain all required fields.
 * Returns the updated job listing.
 * @param {Object} req - Express request object containing the job ID in params and the updated job data in the body.
 * @param {Object} res - Express response object used to return the job data or an error.
 * @throws {Error} If job is not found, returns a 404 status.
 * @throws {Error} If the user is not authorized by the company, returns a 403 status.
 * @throws {Error} If an invalid ID is provided, returns a 400 status.
 * @throws {Error} If an internal error occurs, returns a 500 status.
 */
export const updateJob = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			title,
			salaryRange,
			type,
			description,
			country,
			location,
			company_id,
		} = req.body;

		// Validate request data
		if (
			!title ||
			!type ||
			!description ||
			!salaryRange ||
			!country ||
			!location ||
			!company_id
		) {
			return res.status(400).json({ error: "All fields are required" });
		}
		const job = await Job.findById(id);
		if (!job) return res.status(404).json({ error: "Job Not Found" });

		const company = await Company.findById(company_id);
		if (!company) {
			return res.status(400).json({ error: "Company Not Found" });
		}

		// Check that user attached to session has authority to delete job
		const user = req.user;
		if (!company.authorizedEmails.includes(user.email))
			return res.sendStatus(403);

		job.title = title;
		job.type = type;
		job.description = description;
		job.country = country;
		job.location = location;
		job.salaryRange = salaryRange;
		job.company = company;

		await job.save();
		res.status(200).json(job);
	} catch (error) {
		if (error.name === "ValidationError")
			return res
				.status(400)
				.json({ error: error.message.split(":")[2].trim() });
		if (error.name === "CastError")
			return res.status(400).json({ error: "Invalid Job or Company ID" });
		console.error(`Update Job Controller Error: ${error.message}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
