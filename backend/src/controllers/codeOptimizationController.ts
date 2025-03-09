// src/controllers/codeOptimizationController.ts

export const optimizeCode = (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Basic optimization (just an example)
  const optimizedCode = optimizeCPlusPlusCode(code);

  // Send the optimized code as response
  res.json({ optimized_code: optimizedCode });
};

// Function to simulate basic C++ code optimization
const optimizeCPlusPlusCode = (code: string) => {

  // Trim extra spaces
  let optimized = code.trim();

  // Remove extra newlines
  optimized = optimized.replace(/\n{2,}/g, "\n");

  // Example: Remove comments from code (just for demonstration)
  optimized = optimized.replace(/\/\/.*$/gm, ""); // Removes single-line comments

  // Simulate other optimizations (like removing unused variables)
  optimized = optimized.replace(/int\s+[a-zA-Z_]\w*\s*=\s*0;/g, ""); // remove initialized zero int variables

  // Return the optimized code
  return optimized;
};
