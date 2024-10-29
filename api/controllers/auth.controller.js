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

		if (!checkPassword(password, user.hashedPassword))
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
		const user = await User.findById(req.user._id).select(
			"-hashedPassword"
		);
		res.status(200).json(user);
	} catch (error) {
		console.error(`getMe Controller Error: ${error.message}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateMe = async (req, res) => {
	try {
		const { firstName, lastName, email, phone, password } = req.body;

		// Validate request data
		if (!firstName || !lastName || !email || !phone || !password) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const id = req.user._id;
		console.log(id);
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found!" });
		}

		const hashedPassword = await hashPassword(password);
		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;
		user.phone = phone;
		user.hashedPassword = hashedPassword;

		await user.save();

		const userResponse = user.toObject();
		delete userResponse.hashedPassword;

		res.status(200).json(userResponse);
	} catch (error) {
		if (error.name === "ValidationError")
			return res
				.status(400)
				.json({ error: error.message.split(":")[2].trim() });
		console.error(`PUT user by id Controller Error: ${error.message}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteMe = async (req, res) => {
	try {
		const id = req.user._id;
		const { password } = req.body;

		//Validate request data
		if (!password) {
			return res
				.status(400)
				.json({ error: "User password is required!" });
		}

		const user = await User.findById(id);

		// Check that the user passed valid password
		let isValidPassword = await checkPassword(
			password,
			user.hashedPassword
		);
		if (!isValidPassword)
			return res.status(403).json({ error: "Invalid Password!" });

		await user.deleteOne();
		res.status(204).json({ success: "User deleted successfully" });
	} catch (error) {
		console.error(`DELETE user by id Controller Error: ${error.message}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
