import { Router } from "express";
import {
	deleteCompany,
	fetchCompanies,
	fetchCompany,
	fetchJobApplication,
	fetchJobApplications,
	processJobApplication,
	registerCompany,
	updateCompany,
} from "../controllers/company.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const companyRoutes = Router();

// GET all companies
companyRoutes.get("/", fetchCompanies);

// GET company by ID
companyRoutes.get("/:id", fetchCompany);

// POST create a new company
companyRoutes.post("/", protectRoute, registerCompany);

// PUT update company by ID
companyRoutes.put("/:id", protectRoute, updateCompany);

// DELETE company by ID
companyRoutes.delete("/:id", protectRoute, deleteCompany);

// GET all user applications to job listing
companyRoutes.get(
	"/:companyID/jobs/:jobID/applications",
	protectRoute,
	fetchJobApplications,
);

// GET User application by ID
companyRoutes.get(
	"/:companyID/jobs/:jobID/applications/:appID",
	protectRoute,
	fetchJobApplication,
);

companyRoutes.post(
	"/:companyID/jobs/:jobID/applications/:appID/:action",
	protectRoute,
	processJobApplication,
);

export default companyRoutes;
