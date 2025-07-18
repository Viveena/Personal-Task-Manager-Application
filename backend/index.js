import express, { json } from "express";

import { connect } from "mongoose";

import { config } from "dotenv";

import cookieParser from "cookie-parser";

//import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";

import taskRoutes from "./routes/taskRoutes.js";

import "./middleware/authMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

config();

const app = express();

//app.use(helmet());

app.use(json());

app.use(cookieParser());

connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))

  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("MERN Task Manager API is running!");
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
