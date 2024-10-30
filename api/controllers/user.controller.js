import { checkPassword, hashPassword } from "../lib/utils.js";
import User from "../models/user.model.js";

/**
 * Handles a GET request to fetch all users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @throws {Error} If there is an issue retrieving all users.
 */
export const fetchAllUsers = async (req, res) => {
	try {
		const users = await User.find({}).select("-hashedPassword");
		res.status(200).json(users);
	} catch (error) {
		console.error(`GET all users Controller Error: ${error.message}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * GET /users/:id
 * Fetches a single user by ID without hashed password.
 *
 * @throws {Error} If the user is not found.
 * @throws {Error} If the given ID is invalid.
 * @throws {Error} If there is an unexpected error.
 */
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

/**
 * Handles a PUT request to update a user by ID.
 *
 * @param {Object} req - The request object.
 * @param {string} req.params.id - The ID of the user to be updated.
 * @param {Object} req.body - The body of the request that must contain the user's profile information.
 * @param {string} req.body.firstName - The first name of the user.
 * @param {string} req.body.lastName - The last name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.phone - The phone number of the user.
 * @param {string} req.body.password - The current password of the user.
 * @param {Object} res - The response object.
 *
 * @throws {Error} If the request data is invalid.
 * @throws {Error} If the user could not be found with the given ID.
 * @throws {Error} If the user could not be updated.
 */
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
		let isValidPassword = await checkPassword(
			password,
			user.hashedPassword
		);
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

/**
 * Handles a DELETE request to delete a user by its ID.
 *
 * @param {Object} req - The request object.
 * @param {string} req.user._id - The ID of the user to be deleted.
 * @param {Object} req.body - The body of the request that must contain the user's password.
 * @param {string} req.body.password - The password of the user to be deleted.
 * @param {Object} res - The response object.
 *
 * @throws {Error} If the request data is invalid.
 * @throws {Error} If the user could not be found with the given ID.
 * @throws {Error} If the user could not be deleted.
 */
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
		let isValidPassword = await checkPassword(
			password,
			user.hashedPassword
		);
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
