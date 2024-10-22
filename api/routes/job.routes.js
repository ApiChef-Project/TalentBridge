import { Router } from "express";
import Job from "../models/job.model.js";
import Company from "../models/company.model.js";
import {
  createJob,
  deleteJob,
  fetchJob,
  fetchJobs,
  updateJob,
} from "../controllers/job.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const jobRoutes = Router();
// Get all jobs
jobRoutes.get("/", fetchJobs);

// Get job by ID
jobRoutes.get("/:id", fetchJob);

// Create a new job
jobRoutes.post("/", protectRoute, createJob);

// Delete a job
jobRoutes.delete("/:id", protectRoute, deleteJob);

// Update a job
jobRoutes.put("/:id", protectRoute, updateJob);

export default jobRoutes;
