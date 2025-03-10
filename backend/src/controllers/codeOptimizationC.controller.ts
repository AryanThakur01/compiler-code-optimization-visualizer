export const optimizeCCode = (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Basic optimization (just an example)
  const optimizedCode = optimizeCCodeLogic(code);

  // Send the optimized code as response
  res.json({ optimized_code: optimizedCode });
};

// Function to simulate basic C code optimization
const optimizeCCodeLogic = (code: string): string => {
  let optimized = code.trim();

  // Remove extra newlines (more than one)
  optimized = optimized.replace(/\n{2,}/g, "\n");

  // Remove single-line comments (// ...)
  optimized = optimized.replace(/\/\/.*$/gm, "");

  // Remove multi-line comments (/* ... */)
  optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove unused int variables initialized to zero
  optimized = optimized.replace(/\bint\s+[a-zA-Z_]\w*\s*=\s*0\s*;/g, "");

  // Remove unnecessary spaces around operators
  optimized = optimized.replace(/\s*([=+\-*/<>])\s*/g, "$1");

  // Return the optimized code
  return optimized;
};
