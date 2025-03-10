export const optimizePythonCode = (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Basic optimization (just an example)
  const optimizedCode = optimizePython(code);

  // Send the optimized code as response
  res.json({ optimized_code: optimizedCode });
};

// Function to simulate basic Python code optimization
const optimizePython = (code: string): string => {
  let optimized = code.trim();

  // Remove extra newlines (more than one)
  optimized = optimized.replace(/\n{2,}/g, "\n");

  // Remove single-line comments (# ...)
  optimized = optimized.replace(/#.*$/gm, "");

  // Remove unused variable declarations (e.g., x = 0)
  optimized = optimized.replace(/\b\w+\s*=\s*0\b/g, "");

  // Remove trailing spaces from each line
  optimized = optimized.replace(/[ \t]+$/gm, "");

  // Return the optimized code
  return optimized;
};
