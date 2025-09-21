const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001; // Use different port for testing

// Serve static files from parent directory (public_html root)
app.use(express.static('../'));
app.use('/css', express.static('../css'));
app.use('/js', express.static('../js'));

// Test landing page routing
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    console.log('✅ Found index.html at:', indexPath);
    res.sendFile(indexPath);
  } else {
    console.log('❌ index.html not found at:', indexPath);
    res.send(`
      <h1>🔍 File Structure Test</h1>
      <h2>Current Directory: ${__dirname}</h2>
      <h3>Looking for index.html at: ${indexPath}</h3>
      <h3>File exists: ${fs.existsSync(indexPath)}</h3>
    `);
  }
});

// Test pre-application page
app.get('/pre-application.html', (req, res) => {
  const preAppPath = path.join(__dirname, '..', 'pre-application.html');
  
  if (fs.existsSync(preAppPath)) {
    console.log('✅ Found pre-application.html at:', preAppPath);
    res.sendFile(preAppPath);
  } else {
    console.log('❌ pre-application.html not found at:', preAppPath);
    res.status(404).send('Pre-application page not found');
  }
});

// Test CSS file serving
app.get('/test-css', (req, res) => {
  const cssPath = path.join(__dirname, '..', 'css', 'styles.css');
  console.log('CSS Path:', cssPath);
  console.log('CSS exists:', fs.existsSync(cssPath));
  
  res.json({
    cssPath,
    cssExists: fs.existsSync(cssPath),
    files: fs.readdirSync(path.join(__dirname, '..')).filter(f => f.endsWith('.css') || fs.statSync(path.join(__dirname, '..', f)).isDirectory())
  });
});

// Test JS file serving
app.get('/test-js', (req, res) => {
  const jsPath = path.join(__dirname, '..', 'js', 'main.js');
  console.log('JS Path:', jsPath);
  console.log('JS exists:', fs.existsSync(jsPath));
  
  res.json({
    jsPath,
    jsExists: fs.existsSync(jsPath),
    files: fs.readdirSync(path.join(__dirname, '..')).filter(f => f.endsWith('.js') || fs.statSync(path.join(__dirname, '..', f)).isDirectory())
  });
});

// Test complete file structure
app.get('/test-structure', (req, res) => {
  const publicHtmlPath = path.join(__dirname, '..');
  
  try {
    const structure = {
      publicHtml: publicHtmlPath,
      files: {},
      directories: {}
    };
    
    // Check main files
    const mainFiles = ['index.html', 'pre-application.html', 'status.html', '.htaccess'];
    mainFiles.forEach(file => {
      const filePath = path.join(publicHtmlPath, file);
      structure.files[file] = fs.existsSync(filePath);
    });
    
    // Check directories
    const mainDirs = ['css', 'js', 'jobscooter'];
    mainDirs.forEach(dir => {
      const dirPath = path.join(publicHtmlPath, dir);
      structure.directories[dir] = fs.existsSync(dirPath);
      
      if (fs.existsSync(dirPath)) {
        structure.directories[`${dir}_contents`] = fs.readdirSync(dirPath);
      }
    });
    
    res.json(structure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🧪 Test server running on http://localhost:${PORT}`);
  console.log(`📂 Serving files from: ${path.join(__dirname, '..')}`);
  console.log('\n🔍 Test URLs:');
  console.log(`   Landing page:    http://localhost:${PORT}/`);
  console.log(`   Pre-application: http://localhost:${PORT}/pre-application.html`);
  console.log(`   CSS test:        http://localhost:${PORT}/test-css`);
  console.log(`   JS test:         http://localhost:${PORT}/test-js`);
  console.log(`   Structure test:  http://localhost:${PORT}/test-structure`);
  console.log('\n💡 Press Ctrl+C to stop');
});