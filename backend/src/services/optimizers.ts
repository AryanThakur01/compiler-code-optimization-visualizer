import Parser from "tree-sitter";
import C from "tree-sitter-c";

export class CCodeOptimizer {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
    this.parser.setLanguage(C as unknown as Parser.Language);
  }

  parseCCodeToAST(code: string): Parser.SyntaxNode {
    const tree = this.parser.parse(code);
    return tree.rootNode; // AST root node
  }

  astToTAC(ast: Parser.SyntaxNode): string {
    const tac: string[] = [];

    ast.children.forEach((node) => {
      switch (node.type) {
        case "primitive_type":
          console.log("Primitive type: ", node.text);
          break;
        case "function_declarator":
          console.log("Function declarator: ", node.text);
          break;
        case "compound_statement":
          console.log("Compound statement: ", node.text);
          break;
        case "function_definition":
          this.astToTAC(node);
          break;
        default:
          console.warn("XXX -------->", node.type, node.text);
          break;
      }
    });

    return tac.join("\n");
  }

  preProcessCode(code: string): string {
    // Pre-process the code if needed (e.g., remove comments, format)
    const lines = code.split("\n");
    let processedCode = '';

    for (let line of lines) {
      line = line.trim(); // Remove leading/trailing whitespace
      line = line.replace(/\s+/g, ' ');  // Replace multiple spaces/tabs with a single space
      if (line.startsWith("#include")) {
        line = line.replace(/#include\s+<([^>]+)>/, (match, p1) => {
          return `#import "${p1}"`;
        });
      }

      processedCode += line + "\n";
    }

    return processedCode;
  }
}
