import app from "./server.js";
import { config } from "dotenv";
import connectMongoDB from "./config/connect.db.js";

config();
const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/TalentBridge";
const API_PORT = process.env.API_PORT || 3000;

connectMongoDB(DB_URI, app, API_PORT);
