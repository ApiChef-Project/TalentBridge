import { checkPassword, hashPassword } from "../lib/utils.js";
import User from "../models/user.model.js";

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-hashedPassword");
    res.status(200).json(users);
  } catch (error) {
    console.error(`GET all users Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-hashedPassword");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid User ID" });
    console.error(`GET user by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, password } = req.body;

    // Validate request data
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Check that the user passed valid password
    let isValidPassword = await checkPassword(password, user.hashedPassword);
	  if (!isValidPassword)
		  return res.status(403).json({ error: "Invalid Password!" });

    // const hashedPassword = await hashPassword(password);
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    // user.hashedPassword = hashedPassword;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.hashedPassword;

    res.status(200).json(userResponse);
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid User ID!" });
    if (error.name === "ValidationError")
      return res
        .status(400)
        .json({ error: error.message.split(":")[2].trim() });
    console.error(`PUT user by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    //Validate request data
    if (!password) {
      return res
        .status(400)
        .json({ error: "User password is required!" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Check that the user passed valid password
    let isValidPassword = await checkPassword(password, user.hashedPassword);
	  if (!isValidPassword)
		  return res.status(403).json({ error: "Invalid Password!" });

    await user.deleteOne();
    res.status(204).json({ success: "User deleted successfully" });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid User ID" });
    console.error(`DELETE user by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
