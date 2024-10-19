import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";

/** @typedef {Express} */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/users", userRoutes);

app.use("/companies", companyRoutes);

app.use("/jobs", jobRoutes);

app.use("/applications", applicationRoutes);

export default app;
