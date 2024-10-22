import mongoose from "mongoose";

/**
 * connects to MongoDB using mongoose
 * @param {string} uri - MongoDB connection string
 */
async function connectMongoDB(uri, app, app_port) {
  try {
    await mongoose
      .connect(uri);
    console.log("Successfully connected to db");
  } catch (error) {
    console.error(`db connection error: ${error.message}`);
  }
};

export default connectMongoDB;
