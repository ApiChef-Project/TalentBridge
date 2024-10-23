import mongoose from "mongoose";

/**
 * connects to MongoDB using mongoose
 * @param {string} uri - MongoDB connection string
 * @param {boolean} verbouse - to control logging
 */
async function connectMongoDB(uri, verbouse = true) {
	try {
		await mongoose.connect(uri);
		if (verbouse) {
			console.log("Successfully connected to db");
		}
	} catch (error) {
		console.error(`db connection error: ${error.message}`);
	}
}

export default connectMongoDB;
