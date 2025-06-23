import Parser, { SyntaxNode } from "tree-sitter";
import CPP from "tree-sitter-cpp";
import { IRRepresentation } from "../interfaces/CParser";

export class CppParser {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
    this.parser.setLanguage(CPP as Parser.Language);
  }

  parse(code: string) {
    return this.parser.parse(code);
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

  deadCodeElimination(irNode: IRRepresentation): IRRepresentation {
    if (!Array.isArray(irNode.content)) return irNode;

    let newContent: string | IRRepresentation[] = [];
    let foundReturn = false;

    for (const item of irNode.content) {
      if (typeof item === "string") {
        if (!foundReturn || item === "}" || item === ";") {
          newContent.push(item);
        }
        continue;
      }

      const optimized = this.deadCodeElimination(item);

      if (foundReturn) {
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

  constantPropagatin(
    contents: IRRepresentation["content"]
  ): IRRepresentation["content"] {
    if (typeof contents === "string") return contents;
    const isInitDeclarator = contents.find((c) => c.type === "init_declarator");
    if (!isInitDeclarator) return contents;
    return contents;
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

      let init, condition, update, body;
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

  optimizeCodeFromIR(ir: IRRepresentation): IRRepresentation {
    ir = this.codeFolding(ir);
    ir = this.deadCodeElimination(ir);
    ir.content = this.constantPropagatin(ir.content);
    ir = this.loopUnrolling(ir);

    if (typeof ir.content === "string") return ir;

    for (let i = 0; i < ir.content.length; i++) {
      ir.content[i] = this.optimizeCodeFromIR(ir.content[i]);
    }

    return ir;
  }
}
