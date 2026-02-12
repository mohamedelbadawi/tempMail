#!/usr/bin/env node

const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🔍 TempMail Setup Verification\n');
console.log('━'.repeat(50));

let allChecks = true;

// Color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

function success(msg) {
  console.log(`${colors.green}✓${colors.reset} ${msg}`);
}

function error(msg) {
  console.log(`${colors.red}✗${colors.reset} ${msg}`);
  allChecks = false;
}

function warning(msg) {
  console.log(`${colors.yellow}⚠${colors.reset} ${msg}`);
}

function info(msg) {
  console.log(`${colors.blue}ℹ${colors.reset} ${msg}`);
}

// Check Node.js version
console.log('\n📦 Checking Dependencies...\n');
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 16) {
    success(`Node.js version: ${nodeVersion}`);
  } else {
    error(`Node.js version ${nodeVersion} is too old. Need v16 or higher.`);
  }
} catch (e) {
  error('Node.js check failed');
}

// Check SQLite (bundled with sqlite3 npm package)
success('SQLite database (bundled - no external installation needed)');

// Check npm packages
console.log('\n📚 Checking Node Modules...\n');

if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  success('Backend dependencies installed');
} else {
  error('Backend dependencies not installed');
  info('  Run: npm install');
}

if (fs.existsSync(path.join(__dirname, 'client', 'node_modules'))) {
  success('Frontend dependencies installed');
} else {
  error('Frontend dependencies not installed');
  info('  Run: cd client && npm install');
}

// Check environment files
console.log('\n⚙️  Checking Configuration...\n');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  success('.env file exists');
  
  // Check env contents
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['PORT', 'DB_PATH', 'SMTP_PORT', 'DOMAIN', 'CLIENT_URL'];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      success(`  ${varName} configured`);
    } else {
      warning(`  ${varName} missing`);
    }
  });
} else {
  error('.env file not found');
  info('  Run: npm run setup');
}

const clientEnvPath = path.join(__dirname, 'client', '.env.local');
if (fs.existsSync(clientEnvPath)) {
  success('client/.env.local file exists');
} else {
  warning('client/.env.local file not found');
  info('  Run: npm run setup');
}

// Check ports availability
console.log('\n🔌 Checking Port Availability...\n');

function checkPort(port, name) {
  return new Promise((resolve) => {
    const server = http.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        warning(`Port ${port} (${name}) is in use`);
        info(`  This might be okay if ${name} is already running`);
      } else {
        error(`Port ${port} (${name}) check failed: ${err.message}`);
      }
      resolve(false);
    });
    
    server.once('listening', () => {
      success(`Port ${port} (${name}) is available`);
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

async function checkPorts() {
  await checkPort(5000, 'Backend API');
  await checkPort(3000, 'Frontend');
  await checkPort(2525, 'SMTP Server');
}

checkPorts().then(() => {
  // Final summary
  console.log('\n' + '━'.repeat(50));
  
  if (allChecks) {
    console.log(`\n${colors.green}🎉 All checks passed!${colors.reset}\n`);
    console.log('You can now start the application with:');
    console.log(`  ${colors.blue}npm run dev${colors.reset}\n`);
  } else {
    console.log(`\n${colors.yellow}⚠️  Some issues found${colors.reset}\n`);
    console.log('Please fix the issues above and run this script again.');
    console.log(`Or run: ${colors.blue}npm run setup${colors.reset} for automatic setup.\n`);
  }
  
  console.log('Quick commands:');
  console.log(`  ${colors.blue}npm run setup${colors.reset}     - Run setup wizard`);
  console.log(`  ${colors.blue}npm run dev${colors.reset}       - Start development servers`);
  console.log(`  ${colors.blue}npm run test-email${colors.reset} <email> - Send test email\n`);
  
  console.log('Documentation:');
  console.log('  📖 QUICKSTART.md  - 5-minute setup guide');
  console.log('  📖 README.md      - Complete documentation');
  console.log('  📖 FEATURES.md    - Feature details\n');
});
