import { Router } from "express";
import Company from "../models/company.model.js";
import {
  deleteCompany,
  fetchCompanies,
  fetchCompany,
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

export default companyRoutes;
