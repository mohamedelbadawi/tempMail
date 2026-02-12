const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 TempMail Setup Script\n');

// Check if Node.js version is compatible
const nodeVersion = process.version.match(/^v(\d+\.\d+)/)[1];
if (parseFloat(nodeVersion) < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  process.exit(1);
}
console.log('✅ Node.js version:', process.version);

// SQLite is bundled with the app - no external installation needed
console.log('✅ Using SQLite (no external database required)');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `PORT=5000
DB_PATH=./data/tempmail.db
SMTP_PORT=2525
DOMAIN=localhost
CLIENT_URL=http://localhost:3000
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('✅ .env file already exists');
}

// Create client .env.local file if it doesn't exist
const clientEnvPath = path.join(__dirname, 'client', '.env.local');
if (!fs.existsSync(clientEnvPath)) {
  const clientEnvContent = 'API_URL=http://localhost:5000\n';
  fs.mkdirSync(path.dirname(clientEnvPath), { recursive: true });
  fs.writeFileSync(clientEnvPath, clientEnvContent);
  console.log('✅ Created client/.env.local file');
} else {
  console.log('✅ client/.env.local file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...\n');

try {
  console.log('Installing backend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\nInstalling frontend dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit', shell: true });
  
  console.log('\n✅ All dependencies installed successfully!');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!\n');
console.log('Next steps:');
console.log('1. Run "npm run dev" to start the development server');
console.log('2. Open http://localhost:3000 in your browser');
console.log('3. Test email reception with "node test-email.js <your-email@localhost>"');
console.log('\n💡 Note: SQLite database will be created automatically in ./data/tempmail.db\n');
