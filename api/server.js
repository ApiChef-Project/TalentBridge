import { config } from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import app from "./app.js";
import connectMongoDB from "./config/connect.db.js";
import { resolveCurrentPath } from "./lib/utils.js";

const __dirname = resolveCurrentPath(import.meta.url);
config({
  path: path.join(__dirname, "..", "api", ".env"),
});

const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/TalentBridge";
const API_PORT = process.env.API_PORT || 3000;

connectMongoDB(DB_URI, app, API_PORT);
