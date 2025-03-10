export const optimizeJavaCode = (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Basic optimization (just an example)
  const optimizedCode = optimizeJava(code);

  // Send the optimized code as response
  res.json({ optimized_code: optimizedCode });
};

// Function to simulate basic Java code optimization
const optimizeJava = (code: string): string => {
  let optimized = code.trim();

  // Remove extra newlines
  optimized = optimized.replace(/\n{2,}/g, "\n");

  // Remove single-line comments (//...)
  optimized = optimized.replace(/\/\/.*$/gm, "");

  // Remove multi-line comments (/* ... */)
  optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove unused variable declarations (e.g., int x = 0;)
  optimized = optimized.replace(
    /\b(int|double|float|String|char|boolean)\s+\w+\s*=\s*0\s*;/g,
    ""
  );

  // Remove trailing spaces
  optimized = optimized.replace(/[ \t]+$/gm, "");

  return optimized;
};
