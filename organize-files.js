// File Organization Script for JobScooter
const fs = require('fs');
const path = require('path');

console.log('🗂️  Organizing JobScooter Files...\n');

// Define the correct structure
const fileStructure = {
  // Files that should be in the root public_html directory
  root: [
    'index.html',
    'pre-application.html',
    'status.html',
    '.htaccess'
  ],
  
  // Directories that should exist
  directories: [
    'css',
    'js',
    'jobscooter'
  ],
  
  // Files in CSS directory
  css: [
    'styles.css',
    'application.css'
  ],
  
  // Files in JS directory
  js: [
    'main.js',
    'pre-application.js'
  ]
};

// Current paths
const rootDir = path.join(__dirname, '..');
const jobscooterDir = __dirname;

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function copyFileIfExists(source, destination) {
  if (checkFileExists(source)) {
    try {
      fs.copyFileSync(source, destination);
      console.log(`✅ Copied: ${path.basename(source)} → ${path.dirname(destination)}`);
      return true;
    } catch (error) {
      console.log(`❌ Failed to copy ${source}: ${error.message}`);
      return false;
    }
  }
  return false;
}

function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

console.log('1. Checking root directory files...');
fileStructure.root.forEach(file => {
  const rootPath = path.join(rootDir, file);
  const exists = checkFileExists(rootPath);
  console.log(`${exists ? '✅' : '❌'} ${file}: ${exists ? 'Found' : 'Missing'}`);
  
  if (!exists) {
    // Try to copy from various locations
    const possibleSources = [
      path.join(jobscooterDir, file),
      path.join(jobscooterDir, 'public', file)
    ];
    
    for (const source of possibleSources) {
      if (copyFileIfExists(source, rootPath)) {
        break;
      }
    }
  }
});

console.log('\n2. Checking directory structure...');
fileStructure.directories.forEach(dir => {
  const dirPath = path.join(rootDir, dir);
  const exists = fs.existsSync(dirPath);
  console.log(`${exists ? '✅' : '📁'} ${dir}: ${exists ? 'Exists' : 'Creating...'}`);
  
  if (!exists) {
    createDirectoryIfNotExists(dirPath);
  }
});

console.log('\n3. Checking CSS files...');
const cssDir = path.join(rootDir, 'css');
createDirectoryIfNotExists(cssDir);
fileStructure.css.forEach(file => {
  const targetPath = path.join(cssDir, file);
  const exists = checkFileExists(targetPath);
  console.log(`${exists ? '✅' : '❌'} css/${file}: ${exists ? 'Found' : 'Missing'}`);
  
  if (!exists) {
    const possibleSources = [
      path.join(jobscooterDir, 'public', 'css', file),
      path.join(jobscooterDir, 'css', file)
    ];
    
    for (const source of possibleSources) {
      if (copyFileIfExists(source, targetPath)) {
        break;
      }
    }
  }
});

console.log('\n4. Checking JS files...');
const jsDir = path.join(rootDir, 'js');
createDirectoryIfNotExists(jsDir);
fileStructure.js.forEach(file => {
  const targetPath = path.join(jsDir, file);
  const exists = checkFileExists(targetPath);
  console.log(`${exists ? '✅' : '❌'} js/${file}: ${exists ? 'Found' : 'Missing'}`);
  
  if (!exists) {
    const possibleSources = [
      path.join(jobscooterDir, 'public', 'js', file),
      path.join(jobscooterDir, 'js', file)
    ];
    
    for (const source of possibleSources) {
      if (copyFileIfExists(source, targetPath)) {
        break;
      }
    }
  }
});

console.log('\n📊 File Structure Summary:');
console.log(`Root directory: ${rootDir}`);
console.log(`JobScooter app: ${jobscooterDir}`);

// Verify final structure
console.log('\n🔍 Final Verification:');
const finalStructure = {
  [`${rootDir}/index.html`]: 'Landing Page',
  [`${rootDir}/pre-application.html`]: 'Pre-Application Page',
  [`${rootDir}/css/styles.css`]: 'Main Styles',
  [`${rootDir}/js/main.js`]: 'Main JavaScript',
  [`${jobscooterDir}/server.js`]: 'Node.js Server',
  [`${jobscooterDir}/.env`]: 'Environment Config'
};

Object.entries(finalStructure).forEach(([filePath, description]) => {
  const exists = checkFileExists(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${exists ? 'Ready' : 'Missing'}`);
});

console.log('\n🎯 Next Steps:');
console.log('1. Restart your Node.js server: npm start');
console.log('2. Visit: https://www.jobscooter.co.za');
console.log('3. Check server response for path debugging');

console.log('\n✨ File organization complete!');