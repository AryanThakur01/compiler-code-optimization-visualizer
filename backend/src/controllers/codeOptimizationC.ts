import { execSync } from "child_process";

import { CParser } from "../services/CParser";

export const optimizeCCode = (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const parser = new CParser();
  const tree = parser.parse(code);
  const ir = parser.createIr(tree.rootNode);
  let originalCode = parser.generateCodeFromIR(ir);

  let optimizedCodeIr = parser.layer1Optimization(ir);
  if (typeof optimizedCodeIr.content !== "string") optimizedCodeIr = parser.constantPropagation(optimizedCodeIr);

  let optimizedCode = parser.generateCodeFromIR(optimizedCodeIr);

  // Code formatting
  optimizedCode = execSync("clang-format", { input: optimizedCode }).toString();
  originalCode = execSync("clang-format", { input: originalCode }).toString();

  res.json({ originalCode: originalCode, optimized_code: optimizedCode });
};

const optimizeCCodeLogic = (code: string): string => {
  let optimized = code.trim();

  // Ensure newlines after #include statements
  optimized = optimized.replace(/(#include\s*<.*?>)(\S)/g, "$1\n$2");

  // Ensure function definitions start on a new line
  optimized = optimized.replace(
    /(\bvoid\b|\bint\b|\bfloat\b|\bchar\b|\bdouble\b|\bstruct\b)\s+(\w+)\s*\(/g,
    "\n$1 $2("
  );

  // Preserve proper indentation (prevent everything from collapsing)
  optimized = optimized.replace(/;\s*(?!\n)/g, ";\n");

  // Remove comments
  optimized = optimized.replace(/\/\/.*$/gm, "");
  optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove unnecessary spaces around operators
  optimized = optimized.replace(/\s*([=+\-*/<>])\s*/g, " $1 ");

  // Ensure int is preserved in loops
  optimized = optimized.replace(
    /\bfor\s*\(\s*([a-zA-Z_]\w*)\s*=\s*0;/g,
    "for (int $1 = 0;"
  );

  // Ensure proper indentation using spaces
  optimized = optimized.replace(/\n(\s*)\}/g, "\n$1}\n");

  return optimized.trim();
};
