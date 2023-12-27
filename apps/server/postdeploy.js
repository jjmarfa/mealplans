const fs = require("fs");
const path = require("path");

// Define the path to the package.json file in the functions folder
const packageJsonPath = path.join(__dirname, "package.json");

// Define the names of the packages you want to remove
const packagesToRemove = ["@social-recipe/core"];

// Read and parse the package.json file
const packageJsonData = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

// Remove the specified packages from dependencies
packagesToRemove.forEach((pkg) => {
  if (packageJsonData.dependencies && packageJsonData.dependencies[pkg]) {
    delete packageJsonData.dependencies[pkg];
  }
});

// Write the modified package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonData, null, 2));

// Delete the .tgz files from the functions folder
fs.readdirSync(__dirname).forEach((file) => {
  if (file.endsWith(".tgz")) {
    fs.unlinkSync(path.join(__dirname, file));
  }
});
