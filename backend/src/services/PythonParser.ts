import Parser, { SyntaxNode } from "tree-sitter";
import Python from "tree-sitter-python";
import { IRRepresentation } from "../interfaces/CParser"; // Same IR interface

export class PythonParser {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
    this.parser.setLanguage(Python as Parser.Language);
  }

  parse(code: string) {
    return this.parser.parse(code);
  }

  createIr(node: SyntaxNode): IRRepresentation {
    const storeAsTextTypes = new Set([
      "import_statement",
      "identifier",
      "string",
      "integer",
      "float",
      "parameters",
      "argument_list",
      "call",
      "if_statement",
      "elif_clause",
      "else_clause",
      "while_statement",
      "for_statement",
      "return_statement",
      "assignment",
      "expression_statement",
      "pass_statement",
      "block",
      "comment",
      ":",
      "=",
      "+",
      "-",
      "*",
      "/",
      ">",
      "<",
      "==",
    ]);

    if (node.childCount === 0 || storeAsTextTypes.has(node.type)) {
      return { type: node.type, content: node.text };
    }

    const children = node.children.map((child) => this.createIr(child));
    return { type: node.type, content: children };
  }

  generateCodeFromIR(ir: IRRepresentation): string {
    const walk = (n: IRRepresentation): string => {
      if (typeof n.content === "string") return n.content;
      return n.content.map(walk).join("");
    };
    return walk(ir);
  }

  optimizeCodeFromIR(ir: IRRepresentation): IRRepresentation {
    // Add constant folding, dead code elimination, etc.
    return ir;
  }
}
