import { Router } from "express";
import { optimizeCplusplusCode } from "../controllers/codeOptimizationC++.Controller";
import { optimizeCCode } from "../controllers/codeOptimizationC.controller";
import { optimizeJavaCode } from "../controllers/codeOptimizationJava.controller";
import { optimizePythonCode } from "../controllers/codeOptimizationPthon.controller";

const router = Router();

// Define routes for each language
router.post("/cpp", optimizeCplusplusCode);
router.post("/c", optimizeCCode);
router.post("/java", optimizeJavaCode);
router.post("/python", optimizePythonCode);

export { router as codeOptimizationRouter };
