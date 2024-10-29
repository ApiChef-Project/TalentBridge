import { Router } from "express";
import {
	deleteMe,
	getMe,
	loginUser,
	logoutUser,
	signupUser,
	updateMe,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.get("/me", protectRoute, getMe);

authRoutes.post("/signup", signupUser);

authRoutes.post("/login", loginUser);

authRoutes.post("/logout", logoutUser);

authRoutes.put("/updateMe", protectRoute, updateMe);

authRoutes.delete("/deleteMe", protectRoute, deleteMe);

export default authRoutes;
