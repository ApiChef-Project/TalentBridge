import express from "express";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

/** @typedef {Express} */
const app = express();

// morgan to log requests
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
	res.status(200).json({ status: "OK" });
});

// app.use("/users", userRoutes);

app.use("/auth", authRoutes);

app.use("/companies", companyRoutes);

app.use("/jobs", jobRoutes);

app.use("/applications", applicationRoutes);

export default app;
