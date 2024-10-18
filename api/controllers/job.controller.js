import Job from "../models/job.model.js";

export const fetchJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json(jobs);
  } catch (error) {
    console.error(`GET all jobs Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
    res.status(400).json({ error: "Invalid Job ID" });
  }
};

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

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Job.deleteOne({ _id: id });
    if (result.deletedCount === 1)
      return res.status(204).json({ success: "Successfully Deleted Job" });
    else return res.status(400).json({ error: "Invalid Job ID" });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid Job ID" });
    console.error(`Delete Job Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

    job.title = title;
    job.type = type;
    job.description = description;
    job.country = country;
    job.location = location;
    job.company = company;
    job.salaryRange = salaryRange;

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
