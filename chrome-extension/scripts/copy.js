const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Files and directories to ignore
const ignorePatterns = [
  'package.json',
  'package-lock.json', 
  'node_modules',
  'dist',
  'releases',
  'scripts',
  '.git',
  '.gitignore',
  'README.md',
  'CONTRIBUTING.md',
  'LICENSE'
];

// Files to include (Chrome extension files)
const includeExtensions = ['.js', '.json', '.css', '.html', '.png', '.ico', '.svg'];
const includeFiles = ['manifest.json'];
const includeDirs = ['src', 'icons'];

function shouldIgnore(filePath) {
  const basename = path.basename(filePath);
  const dirname = path.dirname(filePath);
  
  // Check if file/directory should be ignored
  for (const pattern of ignorePatterns) {
    if (basename === pattern || dirname.includes(pattern) || filePath.includes(pattern)) {
      return true;
    }
  }
  
  // Check if it's a markdown file
  if (basename.endsWith('.md')) {
    return true;
  }
  
  return false;
}

function shouldInclude(filePath) {
  const basename = path.basename(filePath);
  const ext = path.extname(filePath);
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  const dirName = relativePath.split(path.sep)[0];
  
  // Always include specific files
  if (includeFiles.includes(basename)) {
    return true;
  }
  
  // Include files in allowed directories
  if (includeDirs.includes(dirName)) {
    return includeExtensions.includes(ext);
  }
  
  return false;
}

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Copy file
  fs.copyFileSync(src, dest);
}

function copyDirectory(src, dest) {
  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (shouldIgnore(srcPath)) {
      continue;
    }
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (stat.isFile() && shouldInclude(srcPath)) {
      copyFile(srcPath, destPath);
      log(`  ✓ ${srcPath}`, 'blue');
    }
  }
}

function main() {
  const srcDir = path.join(__dirname, '..');
  const destDir = path.join(__dirname, '..', 'dist');
  
  log('🏗️  Copying Chrome extension files...', 'green');
  
  // Clean destination directory
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  
  // Create destination directory
  fs.mkdirSync(destDir, { recursive: true });
  
  // Copy files
  copyDirectory(srcDir, destDir);
  
  log(`✅ Chrome extension copied to dist/`, 'green');
  log('📁 Ready for loading as unpacked extension in Chrome', 'blue');
}

main();