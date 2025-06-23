import Parser, { SyntaxNode } from "tree-sitter";
import Java from "tree-sitter-java";
import { IRRepresentation } from "../interfaces/CParser"; // or a shared IR type

export class JavaParser {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
    this.parser.setLanguage(Java as Parser.Language);
  }

  parse(code: string) {
    return this.parser.parse(code);
  }

  createIr(node: SyntaxNode): IRRepresentation {
    const storeAsTextTypes = new Set([
      "import_declaration",
      "package_declaration",
      "modifiers",
      "class_declaration",
      "method_declaration",
      "identifier",
      "primitive_type",
      "variable_declarator",
      "argument_list",
      "string_literal",
      "number_literal",
      "annotation",
      "if_statement",
      "for_statement",
      "while_statement",
      "block",
      "{",
      "}",
      ";",
      "=",
      "+",
      "-",
      "*",
      "/",
      "<",
      ">",
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
    return ir;
  }
}
