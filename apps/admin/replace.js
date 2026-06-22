const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/app/dashboard');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/\bbg-white\b/g, 'bg-surface');
  // Also replace text-white with dark mode aware text if needed, but the user only asked for surface.
  // Actually text-white on primary button is fine.
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverseDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  });
}

traverseDir(directoryPath);
