import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";

/** @typedef {Express} */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/users", userRoutes);

app.use("/companies", companyRoutes);

export default app;
