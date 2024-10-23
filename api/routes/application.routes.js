import { Router } from "express";
import {
  createApplication,
  deleteApplication,
  fetchApplication,
  fetchApplications,
  updateApplication,
} from "../controllers/application.controller.js";

const applicationRoutes = Router();

// GET all applications
applicationRoutes.get("/", fetchApplications);

// GET application by id
applicationRoutes.get("/:id", fetchApplication);

// POST create a application
applicationRoutes.post("/", createApplication);

// PUT update an application
applicationRoutes.put("/:id", updateApplication);

// DELETE delete an application
applicationRoutes.delete("/:id", deleteApplication);

export default applicationRoutes;
