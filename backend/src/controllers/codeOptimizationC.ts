import { getOptimizedPattern } from "../optimizedPatterns";

export const optimizeCCode = (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Apply basic optimizations
  let optimizedCode = optimizeCCodeLogic(code);

  // Apply dataset-based optimizations
  optimizedCode = getOptimizedPattern(optimizedCode);

  // Send optimized code response
  res.json({ optimized_code: optimizedCode });
};

// Function for basic C code optimizations
const optimizeCCodeLogic = (code: string): string => {
  let optimized = code.trim();

  optimized = optimized.replace(/\n{2,}/g, "\n"); // Remove extra blank lines
  optimized = optimized.replace(/\/\/.*$/gm, ""); // Remove single-line comments
  optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove multi-line comments
  optimized = optimized.replace(/\s*([=+\-*/<>])\s*/g, "$1"); // Remove spaces around operators
  optimized = optimized.replace(/\b(\w+)\s*=\s*\1\s*\+\s*1;/g, "$1++;"); // x = x + 1 → x++
  optimized = optimized.replace(/\b(\w+)\s*=\s*\1\s*-\s*1;/g, "$1--;"); // x = x - 1 → x--
  optimized = optimized.replace(/\bint\s+[a-zA-Z_]\w*\s*=\s*0\s*;/g, ""); // Remove unused int variables

  return optimized;
};
