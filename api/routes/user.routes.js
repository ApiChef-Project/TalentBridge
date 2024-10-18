import { Router } from "express";
import User from "../models/user.model.js";
import {
  deleteUser,
  fetchAllUsers,
  fetchUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";

const userRoutes = Router();

// Get all users
userRoutes.get("/", fetchAllUsers);

// Get user by ID
userRoutes.get("/:id", fetchUser);

// Create a new user (sign up)
userRoutes.post("/register", registerUser);

// Update user by ID
userRoutes.put("/:id", updateUser);

// Delete user by ID
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
