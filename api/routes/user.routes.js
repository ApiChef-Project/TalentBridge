import { Router } from "express";
import {
  deleteUser,
  fetchAllUsers,
  fetchUser,
  updateUser,
} from "../controllers/user.controller.js";

const userRoutes = Router();

// Get all users
userRoutes.get("/", fetchAllUsers);

// Get user by ID
userRoutes.get("/:id", fetchUser);

// Update user by ID
userRoutes.put("/:id", updateUser);

// Delete user by ID
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
