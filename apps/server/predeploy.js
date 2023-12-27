const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// The tarball files are the building blocks of npm packages
const createTarballs = (packagePath) => {
  // Navigate to the folder in which the package is located
  process.chdir(path.join(__dirname, packagePath));

  // Compile the package into JS and then pack it
  // This iwill create a .tgz (tarball) file inside the package folder
  execSync("npm run build && npm pack", { stdio: "inherit" });

  // Move the .tgz file to the funcitons folder
  const tgzFile = fs.readdirSync("./").find((file) => file.endsWith(".tgz"));
  if (tgzFile) {
    fs.renameSync(tgzFile, path.join(__dirname, "/", tgzFile));
  }
};

let packagePaths = ["../../packages/core"];

packagePaths.forEach((p) => createTarballs(p));

// Navigate back to the functions directory to install packages
process.chdir(__dirname);

// Install the .tgz packages using npm
const tgzFiles = fs.readdirSync("./").filter((file) => file.endsWith(".tgz"));
for (const tgzFile of tgzFiles) {
  execSync(`npm install ./${tgzFile}`, { stdio: "inherit" });
}
