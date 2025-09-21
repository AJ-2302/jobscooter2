require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const landingRoutes = require('./routes/landing');
const preApplicationRoutes = require('./routes/pre-application');
const documentRoutes = require('./routes/documents');
const accountRoutes = require('./routes/account');
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/application');
const certificateRoutes = require('./routes/certificates');
const profileRoutes = require('./routes/profile');
const publicRoutes = require('./routes/public');
const testEmailRoutes = require('./routes/test-email');

const app = express();
// const PORT = process.env.PORT || 3000;

// Database Configuration (Production MySQL)
const dbConfig = {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'jobscootercoz614_jobscooter',
    port: process.env.MYSQLPORT || 3306,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
};

// ✅ Force redirect to www Block I added. Will delete if it does not work
app.use((req, res, next) => {
    if (req.hostname === 'jobscooter.co.za') {
        return res.redirect(301, 'https://www.jobscooter.co.za' + req.originalUrl);
    }
    next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: (process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,OPTIONS').split(','),
  allowedHeaders: (process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization').split(','),
  credentials: true
}));
app.use(limiter);
const maxFileSize = process.env.MAX_FILE_SIZE || 104857600; // 100MB default
app.use(express.json({ limit: `${maxFileSize}b` }));
app.use(express.urlencoded({ extended: true, limit: `${maxFileSize}b` }));

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Also serve from parent directory for web hosting compatibility
app.use(express.static('../'));
app.use('/css', express.static('../css'));
app.use('/js', express.static('../js'));

// Routes
app.use('/api/landing', landingRoutes);
app.use('/api/pre-application', preApplicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/test-email', testEmailRoutes);

// Serve the landing page - check multiple locations
app.get('/', (req, res) => {
  const possiblePaths = [
    path.join(__dirname, '..', 'index.html'),          // Parent directory
    path.join(__dirname, 'public', 'index.html'),      // Public subfolder
    path.join(__dirname, 'index.html')                  // Same directory
  ];
  
  // Try each path until we find one that exists
  for (const filePath of possiblePaths) {
    if (require('fs').existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  
  // If no file found, send a basic response
  res.send(`
    <h1>JobScooter Server Running</h1>
    <p>The server is running but the index.html file needs to be in the correct location.</p>
    <p>Current directory: ${__dirname}</p>
    <p>Tried paths:</p>
    <ul>${possiblePaths.map(p => `<li>${p}</li>`).join('')}</ul>
  `);
});

// Serve the pre-application page
app.get('/pre-application.html', (req, res) => {
  const possiblePaths = [
    path.join(__dirname, '..', 'pre-application.html'),          // Parent directory
    path.join(__dirname, 'public', 'pre-application.html'),      // Public subfolder
    path.join(__dirname, 'pre-application.html')                  // Same directory
  ];
  
  for (const filePath of possiblePaths) {
    if (require('fs').existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  
  res.status(404).send('Pre-application page not found');
});

// Serve status page
app.get('/status.html', (req, res) => {
  const statusPath = path.join(__dirname, '..', 'status.html');
  if (require('fs').existsSync(statusPath)) {
    return res.sendFile(statusPath);
  }
  res.status(404).send('Status page not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 JobScooter server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`📧 Email configured: ${process.env.SMTP_HOST ? '✅' : '❌'}`);
  console.log(`💾 Database: ${process.env.DB_NAME}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log('\n🎯 Production mode - JobScooter is live!');
  }
});
