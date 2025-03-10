import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { codeOptimizationRouter } from "./routes/codeOptimization.routes";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/optimize", codeOptimizationRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
