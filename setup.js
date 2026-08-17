#!/usr/bin/env node

/**
 * Discord-Roblox Bridge Bot - Interactive Setup
 * Run this with: node setup.js
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const questions = [
  {
    key: 'DISCORD_TOKEN',
    question: '🤖 Discord Bot Token: ',
    description: 'Get this from: https://discord.com/developers/applications',
  },
  {
    key: 'ROBLOSECURITY',
    question: '🍪 Roblox .ROBLOSECURITY Cookie: ',
    description: 'Get this by logging into Roblox and checking browser cookies (see README)',
  },
  {
    key: 'ROBLOX_GROUP_ID',
    question: '👥 Roblox Group ID: ',
    description: 'The ID of your Roblox group',
  },
  {
    key: 'DISCORD_GUILD_ID',
    question: '🏰 Discord Guild (Server) ID: ',
    description: 'Right-click your Discord server and select Copy Server ID',
  },
  {
    key: 'STAFF_ROLE_ID',
    question: '👑 Discord Staff Role ID: ',
    description: 'Right-click the staff role and select Copy Role ID',
  },
  {
    key: 'PORT',
    question: '🌐 Web Server Port (default: 3000): ',
    description: 'Port for the Express web server',
    optional: true,
  },
];

let config = {};

console.log('\n' + '='.repeat(50));
console.log('  Discord-Roblox Bridge Bot - Setup');
console.log('='.repeat(50) + '\n');

// Load existing .env if it exists
const envPath = path.join(__dirname, '.env');
let existingEnv = '';

if (fs.existsSync(envPath)) {
  existingEnv = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found existing .env file\n');
}

const askQuestion = (index) => {
  if (index >= questions.length) {
    saveConfig();
    return;
  }

  const q = questions[index];
  console.log(`📝 ${q.description}`);
  
  rl.question(q.question, (answer) => {
    if (answer) {
      config[q.key] = answer;
    }
    console.log('');
    askQuestion(index + 1);
  });
};

const saveConfig = () => {
  try {
    let envContent = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');

    // Replace with user inputs
    Object.entries(config).forEach(([key, value]) => {
      const regex = new RegExp(`(${key}=).*`, 'g');
      envContent = envContent.replace(regex, `$1${value}`);
    });

    fs.writeFileSync(envPath, envContent);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Configuration Complete!');
    console.log('='.repeat(50) + '\n');

    console.log('Your .env file has been updated with:');
    Object.keys(config).forEach((key) => {
      console.log(`  ✓ ${key}`);
    });

    console.log('\n📖 Next Steps:');
    console.log('  1. Run: npm install');
    console.log('  2. Run: npm start (or npm run dev for development)\n');

    rl.close();
  } catch (error) {
    console.error('❌ Error saving configuration:', error.message);
    rl.close();
    process.exit(1);
  }
};

askQuestion(0);
