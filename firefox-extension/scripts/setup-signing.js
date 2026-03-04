#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🦊 Firefox Extension Signing Setup');
console.log('=====================================');
console.log('');
log('This will help you set up your Mozilla Add-ons API credentials for signing.', 'blue');
console.log('');
console.log('First, you need to get your API credentials from Mozilla:');
console.log('👉 https://addons.mozilla.org/en-US/developers/addon/api/key/');
console.log('');
console.log('1. Sign in to your Mozilla Add-ons account');
console.log('2. Click "Generate new credentials" or use existing ones');
console.log('3. Copy the JWT Issuer and JWT Secret');
console.log('');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function maskSecret(secret) {
  if (secret.length <= 8) {
    return '*'.repeat(secret.length);
  }
  return secret.substring(0, 4) + '*'.repeat(secret.length - 8) + secret.substring(secret.length - 4);
}

async function main() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    
    // Check if .env already exists
    if (fs.existsSync(envPath)) {
      const overwrite = await askQuestion('⚠️  .env file already exists. Overwrite it? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        log('Setup cancelled.', 'yellow');
        rl.close();
        return;
      }
    }

    log('Please enter your Mozilla Add-ons API credentials:', 'green');
    console.log('');

    const jwtIssuer = await askQuestion('JWT Issuer (AMO_JWT_ISSUER): ');
    if (!jwtIssuer) {
      log('❌ JWT Issuer is required!', 'red');
      rl.close();
      return;
    }

    const jwtSecret = await askQuestion('JWT Secret (AMO_JWT_SECRET): ');
    if (!jwtSecret) {
      log('❌ JWT Secret is required!', 'red');
      rl.close();
      return;
    }

    // Validate format (basic check)
    if (!jwtIssuer.includes('user:')) {
      log('⚠️  Warning: JWT Issuer usually starts with "user:" - double check your credentials', 'yellow');
    }

    if (jwtSecret.length < 20) {
      log('⚠️  Warning: JWT Secret seems short - double check your credentials', 'yellow');
    }

    // Create .env content
    const envContent = `# Mozilla Add-ons API Credentials for Firefox Extension Signing
# Get these from: https://addons.mozilla.org/en-US/developers/addon/api/key/
# Keep these secret! This file is git-ignored.

AMO_JWT_ISSUER=${jwtIssuer}
AMO_JWT_SECRET=${jwtSecret}

# Optional: Set to 'listed' for Firefox Add-ons store submission
# AMO_CHANNEL=unlisted
`;

    // Write .env file
    fs.writeFileSync(envPath, envContent);

    console.log('');
    log('✅ Signing credentials saved to .env file!', 'green');
    console.log('');
    console.log('Summary:');
    console.log(`📁 File: ${envPath}`);
    console.log(`🔑 JWT Issuer: ${jwtIssuer.substring(0, 12)}...`);
    console.log(`🔐 JWT Secret: ${maskSecret(jwtSecret)}`);
    console.log('');
    log('🔒 Your .env file is git-ignored for security.', 'blue');
    console.log('');
    console.log('Now you can sign your extension:');
    console.log('• npm run sign       (for self-distribution)');
    console.log('• npm run sign-listed (for Firefox Add-ons store)');
    console.log('• npm run release    (lint + build + sign)');

  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
  }

  rl.close();
}

main();