const fs = require("fs-extra");
const path = require("path");
const os = require("os");

// Path where Kaggle expects the file
const kaggleDir = path.join(os.homedir(), ".kaggle");
const kaggleFile = path.join(kaggleDir, "kaggle.json");

// Path where your file is downloaded
const downloadedKaggleFile = path.join(__dirname, "kaggle.json");

// Ensure the .kaggle directory exists
fs.ensureDirSync(kaggleDir);

// Copy kaggle.json to the correct location
fs.copyFileSync(downloadedKaggleFile, kaggleFile);

// Set correct file permissions (only for Linux/macOS)
fs.chmodSync(kaggleFile, 0o600);

console.log("Kaggle API key set up successfully!");
