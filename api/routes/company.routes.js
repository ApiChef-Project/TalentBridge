import { Router } from "express";
import Company from "../models/company.model.js";
import {
  deleteCompany,
  fetchCompanies,
  fetchCompany,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";

const companyRoutes = Router();

// GET all companies
companyRoutes.get("/", fetchCompanies);

// GET company by ID
companyRoutes.get("/:id", fetchCompany);

// POST create a new company
companyRoutes.post("/", registerCompany);

// PUT update company by ID
companyRoutes.put("/:id", updateCompany);

// DELETE company by ID
companyRoutes.delete("/:id", deleteCompany);

export default companyRoutes;
