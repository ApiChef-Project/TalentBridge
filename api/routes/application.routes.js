import { Router } from "express";
import Application from "../models/application.model.js";
import {
  createApplication,
  deleteApplication,
  fetchApplication,
  fetchApplications,
  updateApplication,
} from "../controllers/application.controller.js";

const applicationRoutes = Router();

applicationRoutes.get("/", fetchApplications);

applicationRoutes.get("/:id", fetchApplication);

applicationRoutes.post("/", createApplication);

applicationRoutes.put("/:id", updateApplication);

applicationRoutes.delete("/:id", deleteApplication);

export default applicationRoutes;
