import { execSync } from "child_process";
import { JavaParser } from "../services/JavaParser";

export const optimizeJavaCode = (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const parser = new JavaParser();
  const tree = parser.parse(code);
  const ir = parser.createIr(tree.rootNode);

  let originalCode = parser.generateCodeFromIR(ir);
  const optimizedCodeIr = parser.optimizeCodeFromIR(ir);
  let optimizedCode = parser.generateCodeFromIR(optimizedCodeIr);

  try {
    originalCode = execSync("clang-format", { input: originalCode }).toString();
    optimizedCode = execSync("clang-format", {
      input: optimizedCode,
    }).toString();
  } catch (err) {
    return res.status(500).json({ error: "Clang formatting failed" });
  }

  res.json({
    originalCode,
    optimized_code: optimizedCode,
  });
};

// Optional fallback inline optimization (if parser not used)
const optimizeJavaCodeLogic = (code: string): string => {
  let optimized = code.trim();

  // Newline after import and package
  optimized = optimized.replace(/(import\s+[\w\.]+;)(\S)/g, "$1\n$2");
  optimized = optimized.replace(/(package\s+[\w\.]+;)(\S)/g, "$1\n$2");

  // Class and method declarations on new line
  optimized = optimized.replace(
    /(\bpublic\b|\bprivate\b|\bprotected\b|\bstatic\b|\bclass\b|\bvoid\b|\bint\b|\bfloat\b|\bString\b)\s+(\w+)\s*\(/g,
    "\n$1 $2("
  );

  // Format semicolons
  optimized = optimized.replace(/;\s*(?!\n)/g, ";\n");

  // Remove comments
  optimized = optimized.replace(/\/\/.*$/gm, "");
  optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, "");

  // Normalize space around operators
  optimized = optimized.replace(/\s*([=+\-*/<>])\s*/g, " $1 ");

  // Ensure loop var has type (basic case)
  optimized = optimized.replace(
    /\bfor\s*\(\s*([a-zA-Z_]\w*)\s*=\s*0;/g,
    "for (int $1 = 0;"
  );

  // Newline before closing brace
  optimized = optimized.replace(/\n(\s*)\}/g, "\n$1}\n");

  return optimized.trim();
};
