import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import express, { Express } from "express";

const setupMiddleware = (app: Express) => {
  // Enable CORS
  app.use(cors({ origin: "*" }));

  // Security Headers
  app.use(helmet());

  // Gzip Compression
  app.use(compression());

  // Logging
  app.use(morgan("dev"));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later",
  });
  app.use(limiter);

  // Body Parser
  app.use(express.json());
};

export default setupMiddleware;
