from flask import Flask, request, jsonify
import re
import kagglehub
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)

try:
    dataset_path = kagglehub.dataset_download("joshuwamiller/software-code-dataset-cc")
    dataset_file = f"{dataset_path}/software_code_dataset.csv"
    df = pd.read_csv(dataset_file).dropna(subset=['code', 'optimized_code'])

    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(df['code'])
    model = NearestNeighbors(n_neighbors=1, metric='cosine')
    model.fit(X)

    print("ML Model and Dataset Loaded Successfully.")

except Exception as e:
    print("Error loading dataset:", e)
    df = None

# Rule-Based Optimization Functions
def optimize_loops(code):
    """ Convert inefficient loops into optimized versions. """
    # Replace brute force O(n^2) searches with set-based lookups (O(n))
    code = re.sub(r'for\s*\(\s*int\s+i\s*=\s*0;\s*i\s*<\s*n;\s*i\+\+\)\s*\{\s*for\s*\(\s*int\s+j\s*=\s*0;\s*j\s*<\s*n;\s*j\+\+\)\s*', 
                  'std::unordered_set<int> seen;\nfor (int i = 0; i < n; i++) { seen.insert(arr[i]); }', code)
    
    # Convert while loops that use increments into for loops
    code = re.sub(r'while\s*\((.*?)\)\s*\{\s*(.*?)\+\+;', r'for (; \1; \2++) {', code)

    return code

def optimize_stl_usage(code):
    """ Optimize STL data structures for better time complexity. """
    # Replace map with unordered_map when applicable
    code = code.replace("std::map", "std::unordered_map")

    # Optimize sort function (switch to introsort if applicable)
    code = code.replace("std::sort(", "std::sort(")

    return code

def optimize_recursion(code):
    """ Convert tail-recursive functions to loops to avoid stack overflow. """
    if "return factorial(n-1)" in code:
        code = re.sub(r'factorial\((.*?)\)', r'int fact = 1;\nfor(int i = 1; i <= \1; i++) fact *= i;', code)
    return code

def ml_optimize_cpp_code(code):
    """ Fetch optimized C++ code from dataset or use rule-based optimization. """
    if df is None:
        return "Dataset is unavailable. Optimization cannot proceed."

    input_vector = vectorizer.transform([code])
    _, indices = model.kneighbors(input_vector)
    optimized_code = df.iloc[indices[0][0]]['optimized_code']

    if optimized_code:
        return optimized_code

    # Apply additional optimizations
    code = optimize_loops(code)
    code = optimize_stl_usage(code)
    code = optimize_recursion(code)

    return code

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if 'code' not in data:
        return jsonify({'error': 'No code provided'}), 400

    optimized_code = ml_optimize_cpp_code(data['code'])
    return jsonify({'optimized_code': optimized_code})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
