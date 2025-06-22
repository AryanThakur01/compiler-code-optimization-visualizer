import Parser, {SyntaxNode} from "tree-sitter";
import C from "tree-sitter-c";

import {IRRepresentation} from "../interfaces/CParser";

export class CParser {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
    this.parser.setLanguage(C as Parser.Language);
  }

  parse(code: string) {
    const tree = this.parser.parse(code);
    return tree;
  }

  printAST(tree: Parser.Tree) {
    const root = tree.rootNode;
    this.printNode(root, 0);
  }

  createIr(node: SyntaxNode, level = 0): IRRepresentation {
    const storeAsTextTypes = new Set([
      "preproc_include",
      "primitive_type",
      "function_declarator",
      "identifier",
      "parameter_list",
      "number_literal",
      "comment",
      "return",
      "(",
      ")",
      "{",
      "}",
      ";",
      "=",
      "+",
      "<",
      ">",
      "system_lib_string",
    ]);

    if (node.type !== 'comment') {
      if (node.childCount === 0 || storeAsTextTypes.has(node.type)) {
        return {
          type : node.type,
          content : node.text,
        };
      } else {
        const children: IRRepresentation[] =
            node.children.map(child => this.createIr(child, level + 1));
        return {
          type : node.type,
          content : children,
        };
      }
    }

    return {
      type : node.type,
      content : "",
    };
  }

  generateCodeFromIR(ir: IRRepresentation): string {
    function helper(node: IRRepresentation): string {
      if (typeof node.content === "string") {
        let result = node.content;
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(result) || result === "#" ||
            result === "return") {
          result += " ";
        }
        return result;
      } else {
        return node.content.map(child => helper(child)).join("");
      }
    }

    return helper(ir);
  }

  codeFolding(irNode: IRRepresentation): IRRepresentation {
    if (irNode.type === 'binary_expression' && Array.isArray(irNode.content) &&
        irNode.content.length >= 3) {
      let [arg1, op, arg2] = irNode.content;
      if (typeof arg1 === 'object' && arg1.type === 'binary_expression') {
        arg1 = this.codeFolding(arg1)
      }

      if (typeof arg1 !== 'string' && typeof op !== 'string' &&
          typeof arg2 !== 'string' && typeof arg1.content === 'string' &&
          typeof arg2.content === 'string' && typeof op.content === 'string') {
        const numArg1 = Number(arg1.content);
        const numArg2 = Number(arg2.content);
        const operator = op.content;

        if (!isNaN(numArg1) && !isNaN(numArg2)) {
          return {
            type : 'number_literal',
            content : String(eval(`${numArg1}${operator}${numArg2}`)),
          };
        }
      }
    }
    return irNode;
  }

  deadCodeElimination(irNode: IRRepresentation): IRRepresentation {
    if (!Array.isArray(irNode.content))
      return irNode;

    let newContent: string|IRRepresentation[] = [];
    let foundReturn = false;

    for (const item of irNode.content) {
      if (typeof item === "string") {
        // Always preserve symbols like '}' even after return
        if (!foundReturn || item === "}" || item === ";") {
          newContent.push(item);
        }
        continue;
      }

      const optimized = this.deadCodeElimination(item);

      if (foundReturn) {
        // Keep only syntax-critical elements (like closing braces)
        if (optimized.type === "}" || optimized.type === ";" ||
            (typeof optimized.content === "string" &&
             (optimized.content === "}" || optimized.content === ";"))) {
          newContent.push(optimized);
        }
        continue;
      }

      newContent.push(optimized);

      if (optimized.type === "return_statement") {
        foundReturn = true;
      }
    }

    return {
      type : irNode.type,
      content : newContent,
    };
  }

  constantPropagatin(contents: IRRepresentation['content']):
      IRRepresentation['content'] {
    if (typeof contents === 'string')
      return contents
      const isInitDeclarator = contents.find(c => c.type === 'init_declarator')
      if (!isInitDeclarator) {
        return contents
      }
    console.log(contents)
    return contents
  }

  optimizeCodeFromIR(ir: IRRepresentation): IRRepresentation {
    ir = this.codeFolding(ir);
    ir = this.deadCodeElimination(ir);
    ir.content = this.constantPropagatin(ir.content);

    if (typeof ir.content === 'string')
      return ir;

    for (let i = 0; i < ir.content.length; i++) {
      ir.content[i] = this.optimizeCodeFromIR(ir.content[i]);
    }

    return ir;
  }

  private printNode(node: Parser.SyntaxNode, indent: number) {
    const padding = "  ".repeat(indent);
    console.log(`${padding}${node.type} (${node.startPosition.row}:${
        node.startPosition.column})`);

    for (const child of node.namedChildren) {
      this.printNode(child, indent + 1);
    }
  }
}
