import connectMongoDB from "./config/connect.db.js";
import app from "./app.js";

// ? i dont think this is necessary at least for now.
// import { config } from "dotenv";
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";
// import { resolveCurrentPath } from "./lib/utils.js";
// const __dirname = resolveCurrentPath(import.meta.url);
// config({
//   path: path.join(__dirname, "..", "api", ".env"),
// });

const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/TalentBridge";
const API_PORT = process.env.API_PORT || 3000;

// connecting to mongoDB
connectMongoDB(DB_URI).then(() => {
  // starting the express server
  app.listen(API_PORT, () => {
    console.log(`Server is listening on port ${API_PORT}`);
  });
})
