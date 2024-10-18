import User from "../models/user.model.js";

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(`GET all users Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid user ID" });
    console.error(`GET user by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerUser = async (req, res) => {
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

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      // TODO: Add expirable refresh tokens while adding new user
      //
      // refreshToken,
      //TODO: Passwords need to be hashed
      hashedPassword: password,
    });

    await newUser.save();
    // NOTE: maybe return new access token too🤔
    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === "ValidationError")
      return res
        .status(400)
        .json({ error: error.message.split(":")[2].trim() });
    console.error(`Signup Controller Error: ${error.message}`);
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
      return res.status(404).json({ error: "User not found" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.hashedPassword = password;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid user ID" });
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
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid user ID" });
    console.error(`DELETE user by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
