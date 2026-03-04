#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Try to load environment variables from .env file
try {
  require('dotenv').config();
} catch (err) {
  // dotenv not installed or .env file doesn't exist, continue with environment variables
}

// Configuration
const channel = process.argv.includes('--channel=listed') ? 'listed' : 'unlisted';
const verbose = process.argv.includes('--verbose');

// Colors for console output (cross-platform)
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Check for required credentials
const apiKey = process.env.AMO_JWT_ISSUER;
const apiSecret = process.env.AMO_JWT_SECRET;

if (!apiKey || !apiSecret) {
  logError('Missing AMO API credentials!');
  console.log('');
  logInfo('You need to set up your Mozilla Add-ons API credentials.');
  console.log('');
  logInfo('Option 1: Create a .env file in this directory:');
  console.log('  AMO_JWT_ISSUER=your-jwt-issuer-here');
  console.log('  AMO_JWT_SECRET=your-jwt-secret-here');
  console.log('');
  logInfo('Option 2: Set environment variables:');
  console.log('  export AMO_JWT_ISSUER="your-jwt-issuer-here"');
  console.log('  export AMO_JWT_SECRET="your-jwt-secret-here"');
  console.log('');
  logInfo('Option 3: Run the setup helper:');
  console.log('  npm run setup-signing');
  console.log('');
  logInfo('Get your credentials from: https://addons.mozilla.org/en-US/developers/addon/api/key/');
  process.exit(1);
}

// Mask the API key for security
const maskedApiKey = apiKey.substring(0, 8) + '...';
logInfo(`Using AMO JWT Issuer: ${maskedApiKey}`);
logInfo(`Signing for ${channel} distribution`);

// Prepare web-ext sign command
const webExtPath = path.join(__dirname, '..', 'node_modules', '.bin', 'web-ext');
const isWindows = process.platform === 'win32';
const webExtCommand = isWindows ? 'web-ext.cmd' : 'web-ext';

const args = [
  'sign',
  `--channel=${channel}`,
  `--api-key=${apiKey}`,
  `--api-secret=${apiSecret}`
];

if (verbose) {
  args.push('--verbose');
}

// Spawn the web-ext process
logInfo('Starting extension signing process...');

const webExt = spawn(webExtCommand, args, {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..'),
  shell: isWindows
});

webExt.on('close', (code) => {
  if (code === 0) {
    logSuccess('Extension signed successfully!');
    logInfo('Check the web-ext-artifacts/ folder for your signed .xpi file');
    console.log('');
    logInfo('You can now distribute the signed .xpi file to users.');
    logInfo('Users can install it by dragging it into Firefox or using about:addons');
  } else {
    logError(`Signing failed with exit code ${code}`);
    console.log('');
    logWarning('Common solutions:');
    console.log('• Check your API credentials are correct');
    console.log('• Ensure your extension passes linting (npm run lint)');
    console.log('• Try again later if AMO servers are busy');
    console.log('• Check Mozilla documentation for detailed error info');
    process.exit(code);
  }
});

webExt.on('error', (error) => {
  logError(`Failed to start web-ext: ${error.message}`);
  
  if (error.code === 'ENOENT') {
    logWarning('web-ext command not found. Installing dependencies...');
    
    // Try to install dependencies automatically
    const npm = spawn('npm', ['install'], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    npm.on('close', (code) => {
      if (code === 0) {
        logInfo('Dependencies installed. Please run the sign command again.');
      } else {
        logError('Failed to install dependencies. Please run: npm install');
      }
      process.exit(code);
    });
  } else {
    process.exit(1);
  }
});