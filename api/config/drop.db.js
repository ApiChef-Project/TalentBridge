import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/TalentBridge";

/**
 * drops a MongoDB database
 * @param {string} url - MongoDB connection string
 */
async function dropDatabase(url) {
	try {
		const client = await mongoose.connect(url);
		await client.connection.dropDatabase();
		console.log("Database dropped successfully");
	} catch (error) {
		console.log(`Error While Dropping DB: ${error.message}`);
	} finally {
		mongoose.connection.close();
	}
}

// When the module is run as a standalone script.
if (import.meta.url === new URL("", import.meta.url).href) {
	if (process.env.ENVIRONMENT === "dev") {
		dropDatabase(DB_URI);
	}
}

export default dropDatabase;
