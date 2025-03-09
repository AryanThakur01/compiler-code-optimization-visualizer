// src/routes/codeOptimizationRoutes.ts
import { Router } from 'express';
import { optimizeCode } from '../controllers/codeOptimizationController';

const router = Router();

// POST route for code optimization
router.post('/', optimizeCode);

export { router as codeOptimizationRouter };
