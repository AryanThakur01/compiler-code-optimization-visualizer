import * as fs from "fs-extra";
import * as path from "path";

let optimizedPatterns: { [key: string]: string } = {};

export const loadKaggleDataset = async () => {
  try {
    const datasetPath = path.join(
      process.cwd(),
      "data",
      "c_optimization_dataset.txt"
    );

    if (await fs.pathExists(datasetPath)) {
      const data = await fs.readFile(datasetPath, "utf-8"); // Read as text
      console.log("Kaggle dataset loaded successfully.");

      // Here you need logic to process the dataset if needed
      optimizedPatterns["x = x + 1;"] = "x++;"; // Example: Add some basic patterns manually
      optimizedPatterns["x = x - 1;"] = "x--;";
    } else {
      console.error("Dataset file not found.");
    }
  } catch (error) {
    console.error("Error loading dataset:", error);
  }
};

// Function to apply optimizations
export const getOptimizedPattern = (code: string): string => {
  for (const pattern in optimizedPatterns) {
    const regex = new RegExp(pattern, "g");
    if (regex.test(code)) {
      return code.replace(regex, optimizedPatterns[pattern]);
    }
  }
  return code;
};

// Load the dataset on startup
loadKaggleDataset();
