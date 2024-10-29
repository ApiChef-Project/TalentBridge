import { Router } from "express";
import {
  createApplication,
  deleteApplication,
  fetchApplication,
  fetchApplications,
  updateApplication,
} from "../controllers/application.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const applicationRoutes = Router();

// GET all applications
applicationRoutes.get("/", protectRoute, fetchApplications);

// GET application by id
applicationRoutes.get("/:id", protectRoute, fetchApplication);

// POST create a application
applicationRoutes.post("/", protectRoute, createApplication);

// PUT update an application
applicationRoutes.put("/:id", protectRoute, updateApplication);

// DELETE delete an application
applicationRoutes.delete("/:id", protectRoute, deleteApplication);

export default applicationRoutes;
