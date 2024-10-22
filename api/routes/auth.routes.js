import { Router } from "express";
import {
  getMe,
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.get("/me", protectRoute, getMe);

authRoutes.post("/signup", signupUser);

authRoutes.post("/login", loginUser);

authRoutes.post("/logout", logoutUser);

export default authRoutes;
