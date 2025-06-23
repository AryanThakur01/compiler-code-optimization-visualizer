import Parser, { SyntaxNode } from "tree-sitter";
import C from "tree-sitter-c";

import { IRRepresentation } from "../interfaces/CParser";

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

    if (node.type !== "comment") {
      if (node.childCount === 0 || storeAsTextTypes.has(node.type)) {
        return {
          type: node.type,
          content: node.text,
        };
      } else {
        const children: IRRepresentation[] = node.children.map((child) =>
          this.createIr(child, level + 1)
        );
        return {
          type: node.type,
          content: children,
        };
      }
    }

    return {
      type: node.type,
      content: "",
    };
  }

  generateCodeFromIR(ir: IRRepresentation): string {
    function helper(node: IRRepresentation): string {
      if (typeof node.content === "string") {
        let result = node.content;
        if (
          /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(result) ||
          result === "#" ||
          result === "return"
        ) {
          result += " ";
        }
        return result;
      } else {
        return node.content.map((child) => helper(child)).join("");
      }
    }

    return helper(ir);
  }


  deadCodeElimination(irNode: IRRepresentation): IRRepresentation {
    if (!Array.isArray(irNode.content)) return irNode;

    let newContent: string | IRRepresentation[] = [];
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
        if (
          optimized.type === "}" ||
          optimized.type === ";" ||
          (typeof optimized.content === "string" &&
            (optimized.content === "}" || optimized.content === ";"))
        ) {
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
      type: irNode.type,
      content: newContent,
    };
  }

  private replaceLoopVariable(
    nodes: IRRepresentation[],
    varName: string,
    value: string
  ): IRRepresentation[] {
    return nodes.map((node) => {
      if (typeof node === "string") return node;

      if (
        node.type === "identifier" &&
        typeof node.content === "string" &&
        node.content === varName
      ) {
        return { ...node, content: value };
      }

      if (Array.isArray(node.content)) {
        return {
          ...node,
          content: this.replaceLoopVariable(node.content, varName, value),
        };
      }

      return node;
    });
  }

  loopUnrolling(irNode: IRRepresentation): IRRepresentation {
    const tryUnroll = (loopNode: IRRepresentation): IRRepresentation | null => {
      if (!Array.isArray(loopNode.content)) return null;

      let init: IRRepresentation | undefined;
      let condition: IRRepresentation | undefined;
      let update: IRRepresentation | undefined;
      let body: IRRepresentation | undefined;
      let isWhile = false;

      if (loopNode.type === "for_statement" && loopNode.content.length >= 4) {
        [init, condition, update, body] = loopNode.content;
      } else if (
        loopNode.type === "while_statement" &&
        loopNode.content.length >= 2
      ) {
        condition = loopNode.content[0];
        body = loopNode.content[1];
        isWhile = true;
      } else {
        return null;
      }

      if (typeof body !== "string" && Array.isArray(body.content)) {
        let varName = "";
        let start = 0;
        let end = 0;
        let step = 1;

        try {
          if (!isWhile && typeof init !== "string") {
            const match = JSON.stringify(init).match(/int\s+(\w+)\s*=\s*(\d+)/);
            if (match) {
              varName = match[1];
              start = parseInt(match[2]);
            }
          }

          const condMatch = JSON.stringify(condition).match(
            /(\w+)\s*([<!=]+)\s*(\d+)/
          );
          if (condMatch) {
            varName ||= condMatch[1];
            const op = condMatch[2];
            end = parseInt(condMatch[3]);

            // We assume only <, <=, != conditions
            const cmp = op.includes("!")
              ? (a: number, b: number) => a !== b
              : op.includes("<=")
              ? (a: number, b: number) => a <= b
              : (a: number, b: number) => a < b;

            const updateText = isWhile
              ? JSON.stringify(body)
              : JSON.stringify(update);
            const stepMatch = updateText.match(
              /(\+\+|--|(\w+)\s*[\+\-]=\s*(\d+)|(\w+)\s*=\s*\w+\s*([\+\-])\s*(\d+))/
            );
            if (stepMatch) {
              if (stepMatch[1] === "++") step = 1;
              else if (stepMatch[1] === "--") step = -1;
              else if (stepMatch[3])
                step =
                  parseInt(stepMatch[3]) *
                  (stepMatch[2].includes("-") ? -1 : 1);
              else if (stepMatch[6])
                step = parseInt(stepMatch[6]) * (stepMatch[5] === "-" ? -1 : 1);
            }

            let unrolled: IRRepresentation[] = [];
            for (let i = start; cmp(i, end); i += step) {
              const cloned = JSON.parse(
                JSON.stringify(body.content)
              ) as IRRepresentation[];
              const replaced = this.replaceLoopVariable(
                cloned,
                varName,
                String(i)
              );
              unrolled.push(...replaced);
            }

            return {
              type: "compound_statement",
              content: unrolled,
            };
          }
        } catch (e) {
          return null;
        }
      }

      return null;
    };

    const unrolled = tryUnroll(irNode);
    if (unrolled) return unrolled;

    if (Array.isArray(irNode.content)) {
      return {
        type: irNode.type,
        content: irNode.content.map((child) =>
          typeof child === "string" ? child : this.loopUnrolling(child)
        ),
      };
    }

    return irNode;
  }

  codeFolding(irNode: IRRepresentation): IRRepresentation {
    if (
      irNode.type === "binary_expression" &&
      Array.isArray(irNode.content) &&
      irNode.content.length >= 3
    ) {
      let [arg1, op, arg2] = irNode.content;
      if (typeof arg1 === "object" && arg1.type === "binary_expression") {
        arg1 = this.codeFolding(arg1);
      }

      if (
        typeof arg1 !== "string" &&
        typeof op !== "string" &&
        typeof arg2 !== "string" &&
        typeof arg1.content === "string" &&
        typeof arg2.content === "string" &&
        typeof op.content === "string"
      ) {
        const numArg1 = Number(arg1.content);
        const numArg2 = Number(arg2.content);
        const operator = op.content;

        if (!isNaN(numArg1) && !isNaN(numArg2)) {
          return {
            type: "number_literal",
            content: String(eval(`${numArg1}${operator}${numArg2}`)),
          };
        }
      }
    }
    return irNode;
  }

  getConstantValue(
    variableName: string,
    knownConstants: Record<number, Record<string, string>>,
    currentLevel: number
  ) {
    if (knownConstants[currentLevel] && knownConstants[currentLevel][variableName]) {
      return knownConstants[currentLevel][variableName];
    }

    // Check in previous levels
    for (let i = currentLevel - 1; i >= 0; i--) {
      if (knownConstants[i] && knownConstants[i][variableName]) {
        return knownConstants[i][variableName];
      }
    }

    return null;
  }

  valueConstantSubstitution(
    irContent: IRRepresentation,
    knownConstants: Record<number, Record<string, string>>,
    currentLevel: number
  ): IRRepresentation {
    if (irContent.type !== "binary_expression") return irContent
    if (typeof irContent.content === "string") return irContent;
    let left = irContent.content[0];
    let right = irContent.content[2];

    if (left.type === "binary_expression") left = this.valueConstantSubstitution(left, knownConstants, currentLevel);
    else if (left.type === "identifier" && typeof left.content === 'string'){
        left = {content: this.getConstantValue(left.content, knownConstants, currentLevel) || left.content, type: 'number_literal'};
    }

    if (right.type === "binary_expression") right = this.valueConstantSubstitution(right, knownConstants, currentLevel);
    else if (right.type === "identifier" && typeof right.content === 'string') {
        right = {content: this.getConstantValue(right.content, knownConstants, currentLevel) || right.content, type: 'number_literal'};
    }

    irContent.content[0] = left;
    irContent.content[2] = right;

    return irContent
  }

  processConstantPropagation(irContent: IRRepresentation[], knownConstants: Record<number, Record<string, string>> = {}, level = 0): IRRepresentation[] {
    knownConstants[level] = {};

    return irContent.map((node) => {
      if (typeof node.content === "string") return node;
      else if (node.type === "compound_statement" || node.type === "if_statement") {
        const processedContent = this.processConstantPropagation(node.content, knownConstants, level + 1);
        delete knownConstants[level]
        return { ...node, content: processedContent };
      } else if (node.type === "declaration" || node.type === "expression_statement") {
        const declaratorIndex = node.content.findIndex(n => n.type === "init_declarator" || n.type === "assignment_expression");

        if (declaratorIndex !== -1) {
          const declarator = node.content[declaratorIndex];
          if (typeof declarator.content !== "string") {
            const identifierIndex = declarator.content.findIndex(n => n.type === "identifier");

            if (identifierIndex !== -1) {
                const identifier = declarator.content[identifierIndex];
                let right = declarator.content[2];

                if (right.type === "number_literal") knownConstants[level][String(identifier.content)] = String(right.content);
                else if (right.type === "binary_expression") {
                    right = this.valueConstantSubstitution(right, knownConstants, level);
                    right = this.codeFolding(right);
                    if (typeof right.content === "string") knownConstants[level][String(identifier.content)] = String(right.content);
                    declarator.content[2] = right;
                    node.content[declaratorIndex] = declarator;
                }

            }
          }
        }

        return node;
      } else {
        const processedContent = this.processConstantPropagation(node.content, knownConstants, level);
        return { type: node.type, content: processedContent }
      }
    });
  }

  constantPropagation(ir: IRRepresentation): IRRepresentation {
    if (typeof ir.content === "string") return ir;
    else  return {type: ir.type, content:  this.processConstantPropagation(ir.content)}
  }

  layer1Optimization(ir: IRRepresentation): IRRepresentation {
    ir = this.codeFolding(ir);
    ir = this.deadCodeElimination(ir);
    ir = this.loopUnrolling(ir);

    if (typeof ir.content === "string") return ir;

    for (let i = 0; i < ir.content.length; i++) {
      ir.content[i] = this.layer1Optimization(ir.content[i]);
    }

    return ir;
  }

  private printNode(node: Parser.SyntaxNode, indent: number) {
    const padding = "  ".repeat(indent);
    console.log(
      `${padding}${node.type} (${node.startPosition.row}:${node.startPosition.column})`
    );

    for (const child of node.namedChildren) {
      this.printNode(child, indent + 1);
    }
  }
}
