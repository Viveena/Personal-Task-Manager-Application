import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"; // example route
//import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middleware
//app.use(express.json()); // for parsing JSON

// Routes
app.use("/api/users", userRoutes);

// Error handler middlewares (if made)

//app.use(notFound);
//app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
