export const optimizeCppCode = (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const optimizedCode = optimizeCpp(code);

  res.json({ optimized_code: optimizedCode });
};

// Function to simulate basic C++ code optimization
const optimizeCpp = (code: string): string => {
  let optimized = code.trim();

  // Remove extra newlines
  optimized = optimized.replace(/\n{2,}/g, "\n");

  // Remove single-line comments (//...)
  optimized = optimized.replace(/\/\/.*$/gm, "");

  // Remove multi-line comments (/* ... */)
  optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove unused variable declarations like: int x = 0; or float y = 0.0;
  optimized = optimized.replace(
    /\b(int|float|double|char|bool|long)\s+\w+\s*=\s*0(\.0)?\s*;/g,
    ""
  );

  // Remove trailing whitespaces
  optimized = optimized.replace(/[ \t]+$/gm, "");

  return optimized;
};
