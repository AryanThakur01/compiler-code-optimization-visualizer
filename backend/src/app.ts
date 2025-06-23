import express from "express";
import setupMiddleware from "./middlewares/middleware"; // Import middleware setup
import { codeOptimizationRouter } from "./routes/codeOptimization";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

setupMiddleware(app);

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/optimize", codeOptimizationRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
