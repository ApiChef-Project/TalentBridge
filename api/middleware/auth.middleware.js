import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Function: protectRoute
 * Middleware to protect routes by verifying JWT token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 *
 * @returns {void}
 */
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });

    const user = await User.findById(decoded.userID);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    } else {
      console.error(`protectRoute Error: ${error.message}`);
      next(error);
    }
  }
};
