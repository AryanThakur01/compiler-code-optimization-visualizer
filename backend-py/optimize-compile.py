import os
import re
import subprocess
import difflib
import argparse

def print_diff(before: str, after: str, label: str):
    before_lines = before.splitlines(keepends=True)
    after_lines = after.splitlines(keepends=True)
    diff = difflib.unified_diff(before_lines, after_lines, fromfile='Before ' + label, tofile='After ' + label)
    print(f"\nDiff for {label}:\n" + "".join(diff))

# Define optimization passes
def constant_folding(code: str) -> str:
    pattern = re.compile(r'(\d+)\s*\+\s*(\d+)')
    def repl(match):
        return str(int(match.group(1)) + int(match.group(2)))
    return pattern.sub(repl, code)

def remove_dead_code(code: str) -> str:
    pattern = re.compile(r'if\s*\(false\)\s*\{.*?\}', re.DOTALL)
    return pattern.sub('', code)

def peephole_optimization(code: str) -> str:
    return code.replace("x = x + 0;", "")

def inline_function_expansion(code: str) -> str:
    # Simple inline function expansion for demo purposes
    code = re.sub(r'inline\s+int\s+square\s*\(int\s+\w+\)\s*\{[^}]*\}', '', code)
    code = re.sub(r'square\s*\(\s*(\d+)\s*\)', lambda m: f"{m.group(1)} * {m.group(1)}", code)
    return code

def optimize_code(code: str) -> dict:
    steps = {"Original": code}
    
    # Constant Folding
    cf_code = constant_folding(steps["Original"])
    steps["Constant Folding"] = cf_code
    print_diff(steps["Original"], cf_code, "Constant Folding")
    
    # Dead Code Elimination
    dce_code = remove_dead_code(cf_code)
    steps["Dead Code Elimination"] = dce_code
    print_diff(cf_code, dce_code, "Dead Code Elimination")
    
    # Peephole Optimization
    ph_code = peephole_optimization(dce_code)
    steps["Peephole Optimization"] = ph_code
    print_diff(dce_code, ph_code, "Peephole Optimization")
    
    # Inline Function Expansion
    if_code = inline_function_expansion(ph_code)
    steps["Inline Function Expansion"] = if_code
    print_diff(ph_code, if_code, "Inline Function Expansion")
    
    return steps

def compile_code(source_file: str, output_exe: str) -> bool:
    compile_cmd = ['g++', source_file, '-o', output_exe]
    try:
        subprocess.run(compile_cmd, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print("Compilation error:", e)
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Optimize and Compile C++ Code")
    parser.add_argument('--source', type=str, required=True, help="Path to the C++ source file")
    parser.add_argument('--output', type=str, required=True, help="Directory to save the optimized and compiled executables")
    args = parser.parse_args()

    # Read in the source C++ file
    with open(args.source, 'r') as file:
        sample_code = file.read()

    print("=== Original Code ===")
    print(sample_code)
    
    # --- Step 1: Optimize the Code with Multiple Passes ---
    optimization_steps = optimize_code(sample_code)
    final_optimized_code = optimization_steps["Inline Function Expansion"]
    print("\n=== Final Optimized Code ===")
    print(final_optimized_code)

    # --- Step 2: Save Both Original and Optimized Code to Files ---
    source_filename = os.path.join(args.output, 'original.cpp')
    optimized_filename = os.path.join(args.output, 'optimized.cpp')
    with open(source_filename, 'w') as file:
        file.write(sample_code)
    with open(optimized_filename, 'w') as file:
        file.write(final_optimized_code)

    # --- Step 3: Compile Both Versions ---
    original_exe = os.path.join(args.output, 'original_exe.exe')  # Ensure `.exe` on Windows
    optimized_exe = os.path.join(args.output, 'optimized_exe.exe')  # Ensure `.exe` on Windows
    
    print("\nCompiling original code...")
    if compile_code(source_filename, original_exe):
        print("Original compilation succeeded.")
    else:
        print("Original compilation failed.")
    
    print("\nCompiling optimized code...")
    if compile_code(optimized_filename, optimized_exe):
        print("Optimized compilation succeeded.")
    else:
        print("Optimized compilation failed.")

    # --- Step 4: Run Both Compiled Executables and Compare Outputs ---
    print("\nRunning original executable:")
    orig_result = subprocess.run([original_exe], capture_output=True, text=True)
    print(orig_result.stdout)
    
    print("\nRunning optimized executable:")
    opt_result = subprocess.run([optimized_exe], capture_output=True, text=True)
    print(opt_result.stdout)
    
    # Optional: Clean up generated files (if desired)
    os.remove(source_filename)
    os.remove(optimized_filename)
    os.remove(original_exe)
    os.remove(optimized_exe)
