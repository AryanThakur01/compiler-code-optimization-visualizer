import { execSync } from "child_process";
import { CppParser } from "../services/CppParser";

export const optimizeCppCode = (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const parser = new CppParser();
  const tree = parser.parse(code);
  const ir = parser.createIr(tree.rootNode);

  let originalCode = parser.generateCodeFromIR(ir);
  const optimizedCodeIr = parser.optimizeCodeFromIR(ir);
  let optimizedCode = parser.generateCodeFromIR(optimizedCodeIr);

  try {
    optimizedCode = execSync("clang-format", {
      input: optimizedCode,
    }).toString();
    originalCode = execSync("clang-format", { input: originalCode }).toString();
  } catch (err) {
    return res.status(500).json({ error: "Clang formatting failed" });
  }

  res.json({
    originalCode,
    optimized_code: optimizedCode,
  });
};

// Optional fallback inline optimization (if parser not used)
const optimizeCppCodeLogic = (code: string): string => {
  let optimized = code.trim();

  // Newline after includes
  optimized = optimized.replace(/(#include\s*<.*?>)(\S)/g, "$1\n$2");

  // Function defs on new line
  optimized = optimized.replace(
    /(\bvoid\b|\bint\b|\bfloat\b|\bchar\b|\bdouble\b|\bstruct\b|\bclass\b)\s+(\w+)\s*\(/g,
    "\n$1 $2("
  );

  // Format semicolons
  optimized = optimized.replace(/;\s*(?!\n)/g, ";\n");

  // Remove single-line & multi-line comments
  optimized = optimized.replace(/\/\/.*$/gm, "");
  optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove extra spaces around operators
  optimized = optimized.replace(/\s*([=+\-*/<>])\s*/g, " $1 ");

  // Ensure loop var has `int` (simple cases)
  optimized = optimized.replace(
    /\bfor\s*\(\s*([a-zA-Z_]\w*)\s*=\s*0;/g,
    "for (int $1 = 0;"
  );

  // Add newline before closing braces
  optimized = optimized.replace(/\n(\s*)\}/g, "\n$1}\n");

  return optimized.trim();
};
