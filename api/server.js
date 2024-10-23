import connectMongoDB from "./config/connect.db.js";
import { config } from "dotenv";
import app from "./app.js";

// ? i dont think this is necessary at least for now.
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";
// import { resolveCurrentPath } from "./lib/utils.js";
// const __dirname = resolveCurrentPath(import.meta.url);

config();
const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/TalentBridge";
const API_PORT = process.env.API_PORT || 3000;

// connecting to mongoDB
connectMongoDB(DB_URI).then(() => {
  // starting the express server
  app.listen(API_PORT, () => {
    console.log(`Server is listening on http://localhost:${API_PORT}`);
  });
})
