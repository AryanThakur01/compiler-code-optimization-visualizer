import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";

const datasetPath = path.join(process.cwd(), "data");

const downloadDataset = async () => {
  try {
    // Ensure directory exists
    await fs.ensureDir(datasetPath);

    console.log("Downloading dataset...");

    // Execute Kaggle CLI command
    exec(
      `kaggle datasets download -d adarshbiradar/c-programs -p ${datasetPath} --unzip`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("Error downloading dataset:", error);
          return;
        }
        if (stderr) console.warn("⚠️ Warning:", stderr);
        console.log("✅ Dataset downloaded successfully:", stdout);
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

downloadDataset();
