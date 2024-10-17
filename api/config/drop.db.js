import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
if (process.env.ENVIRONMENT === "dev") {
  const dropDatabase = async () => {
    try {
      const DB_URI = "mongodb://127.0.0.1:27017/TalentBridge";
      const client = await mongoose.connect(DB_URI);
      await client.connection.dropDatabase();
      console.log("Database dropped successfully");
    } catch (error) {
      console.log(`Error While Dropping DB: ${error.message}`);
    } finally {
      mongoose.connection.close();
    }
  };

  dropDatabase();
}
