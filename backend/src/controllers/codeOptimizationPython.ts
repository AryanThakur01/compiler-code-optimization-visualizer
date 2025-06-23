import { execSync } from "child_process";
import { PythonParser } from "../services/PythonParser";

export const optimizePythonCode = (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const parser = new PythonParser();
  const tree = parser.parse(code);
  const ir = parser.createIr(tree.rootNode);

  let originalCode = parser.generateCodeFromIR(ir);
  const optimizedCodeIr = parser.optimizeCodeFromIR(ir);
  let optimizedCode = parser.generateCodeFromIR(optimizedCodeIr);

  try {
    originalCode = execSync("black -q -", { input: originalCode }).toString();
    optimizedCode = execSync("black -q -", { input: optimizedCode }).toString();
  } catch (err) {
    return res.status(500).json({ error: "Python formatting failed" });
  }

  res.json({
    originalCode,
    optimized_code: optimizedCode,
  });
};

// Optional fallback inline optimization (if parser not used)
const optimizePythonCodeLogic = (code: string): string => {
  let optimized = code.trim();

  // Add newline after imports and def statements
  optimized = optimized.replace(/(import\s+\w+)(\S)/g, "$1\n$2");
  optimized = optimized.replace(/(from\s+\w+\s+import\s+\w+)(\S)/g, "$1\n$2");
  optimized = optimized.replace(/(def\s+\w+\s*\(.*\):)(\S)/g, "$1\n$2");

  // Add newline after each statement
  optimized = optimized.replace(/:\s*(?!\n)/g, ":\n");

  // Remove comments
  optimized = optimized.replace(/#.*$/gm, "");

  // Normalize spacing around operators
  optimized = optimized.replace(/\s*([=+\-*/<>])\s*/g, " $1 ");

  // Ensure correct indent for dedented blocks
  optimized = optimized.replace(/\n(\s*)return/g, "\n$1    return");

  return optimized.trim();
};
