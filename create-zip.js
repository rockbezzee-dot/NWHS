#!/usr/bin/env node

/**
 * Discord-Roblox Bridge Bot - ZIP File Generator
 * Creates a downloadable ZIP package of the bot
 * 
 * Usage: node create-zip.js
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Check if archiver is installed
try {
  require.resolve('archiver');
} catch (e) {
  console.error('❌ archiver package not found!');
  console.error('Install it with: npm install archiver');
  process.exit(1);
}

const output = fs.createWriteStream(path.join(__dirname, 'discord-roblox-bridge.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log('\n✅ ZIP file created successfully!');
  console.log(`📦 File: discord-roblox-bridge.zip`);
  console.log(`📊 Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\n📥 You can now download: discord-roblox-bridge.zip\n`);
});

archive.on('error', (err) => {
  throw err;
});

output.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Add files to ZIP
const filesToAdd = [
  { src: 'package.json', dest: 'package.json' },
  { src: '.env.example', dest: '.env.example' },
  { src: 'src/index.js', dest: 'src/index.js' },
  { src: 'README.md', dest: 'README.md' },
  { src: 'SETUP_GUIDE.md', dest: 'SETUP_GUIDE.md' },
  { src: 'setup.js', dest: 'setup.js' },
  { src: 'setup.sh', dest: 'setup.sh' },
  { src: 'setup.bat', dest: 'setup.bat' },
  { src: '.gitignore', dest: '.gitignore' },
];

console.log('📦 Creating ZIP file...\n');

filesToAdd.forEach(file => {
  const filePath = path.join(__dirname, file.src);
  if (fs.existsSync(filePath)) {
    archive.file(filePath, { name: file.dest });
    console.log(`  ✓ ${file.src}`);
  } else {
    console.log(`  ⚠ ${file.src} (not found)`);
  }
});

archive.finalize();
