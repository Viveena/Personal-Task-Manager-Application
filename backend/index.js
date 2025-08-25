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

console.log('MONGO_URI:', process.env.MONGO_URI); // Add this line for debugging
connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))

  .catch((err) => {
    console.error("MongoDB connection error:", err); // Enhanced error logging
    process.exit(1); // Exit process on connection failure
  });

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("MERN Task Manager API is running!");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Backend is running",
    timestamp: new Date().toISOString()
  });
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
