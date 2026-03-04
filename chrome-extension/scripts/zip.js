const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Read manifest to get version
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const version = manifest.version;

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'releases');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create zip file
const output = fs.createWriteStream(path.join(outputDir, `reddit-mtg-cardhover-chrome-${version}.zip`));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
  console.log(`✅ Chrome extension packaged: ${archive.pointer()} total bytes`);
  console.log(`📁 File: releases/reddit-mtg-cardhover-chrome-${version}.zip`);
  console.log('🚀 Ready for Chrome Web Store upload!');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Add all files except the ones we want to exclude
archive.glob('**/*', {
  ignore: [
    'package.json',
    'package-lock.json',
    'node_modules/**',
    'scripts/**',
    'releases/**',
    '*.md',
    '.gitignore'
  ]
});

archive.finalize();