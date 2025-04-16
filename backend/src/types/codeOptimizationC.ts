export type ASTNode =
  | { op: "preproc_include"; value: string } // direct assignment
  | { op: "assign"; target: string; value: string } // direct assignment
  | {
      op: "binary";
      operator: string;
      target: string;
      arg1: string;
      arg2: string;
    }
  | { op: "call"; target?: string; function: string; args: string[] }
  | { op: "if"; condition: string; thenLabel: string; elseLabel: string }
  | { op: "label"; name: string }
  | { op: "goto"; label: string }
  | { op: "return"; value: string }

  // ➕ Control flow additions
  | { op: "loop_start"; label: string }     // marks the start of a loop
  | { op: "loop_end"; label: string }       // marks the end of a loop
  | { op: "break"; label: string }          // jump out of loop to label
  | { op: "continue"; label: string }       // jump to beginning of loop

  // ➕ Switch-case
  | { op: "switch"; expr: string }
  | { op: "case"; value: string; label: string }
  | { op: "default"; label: string };
