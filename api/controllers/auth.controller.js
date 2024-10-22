import User from "../models/user.model.js";
import {
  checkPassword,
  generateTokenandSetCookie,
  hashPassword,
} from "../lib/utils.js";

export const signupUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Validate request data
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: `User with email ${email} already exists` });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      hashedPassword,
    });

    generateTokenandSetCookie(newUser._id, res);
    await newUser.save();

    // Remove hashedPassword from the returned user object
    const userResponse = newUser.toObject();
    delete userResponse.hashedPassword;

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.name === "ValidationError")
      return res
        .status(400)
        .json({ error: error.message.split(":")[2].trim() });
    console.error(`Signup Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid Login!" });

    const isPasswordValid = await checkPassword(password, user.hashedPassword);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid Login!" });

    generateTokenandSetCookie(user._id, res);
    res.status(200).json({ success: "Logged In!" });
  } catch (error) {
    console.error(`Login Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: "Logged Out!" });
  } catch {
    console.error(`Logout Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-hashedPassword");
    res.status(200).json(user);
  } catch (error) {
    console.error(`getMe Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
