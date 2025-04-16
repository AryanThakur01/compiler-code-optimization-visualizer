import { CCodeOptimizer } from "../services/optimizers";

// Endpoint
export const optimizeCCode = (req: any, res: any) => {
  let { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const optimizer = new CCodeOptimizer()
  let optimizedCode = optimizer.preProcessCode(code);
  // const ast = optimizer.parseCCodeToAST(code);
  // const ir = optimizer.astToTAC(ast);
  // console.log("Intermediate Representation (IR):", ir);

  res.json({ optimized_code: optimizedCode });
};
// =========================
