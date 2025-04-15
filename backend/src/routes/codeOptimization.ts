import { Router } from "express";
import { optimizeCplusplusCode } from "../controllers/codeOptimizationC++";
import { optimizeCCode } from "../controllers/codeOptimizationC";
import { optimizeJavaCode } from "../controllers/codeOptimizationJava";
import { optimizePythonCode } from "../controllers/codeOptimizationPython";

const router = Router();

// Define routes for each language
router.post("/cpp", optimizeCplusplusCode);
router.post("/c", optimizeCCode);
router.post("/java", optimizeJavaCode);
router.post("/python", optimizePythonCode);

export { router as codeOptimizationRouter };
