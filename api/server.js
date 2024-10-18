import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";

/** @typedef {Express} */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Its working");
});

app.use("/users", userRoutes);

export default app;
