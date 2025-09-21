#!/usr/bin/env node

// JobScooter Server Starter
require('dotenv').config();

console.log('🚀 Starting JobScooter Server...\n');

// Check environment
const isProduction = process.env.NODE_ENV === 'production';
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔗 Domain: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
console.log(`💾 Database: ${process.env.DB_NAME}`);

// Quick pre-flight checks
console.log('\n🔍 Pre-flight checks...');

// Check database config
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.log('❌ Database configuration incomplete');
    console.log('Please check your .env file');
    process.exit(1);
}
console.log('✅ Database configuration found');

// Check if we can load express
try {
    require('express');
    console.log('✅ Express is available');
} catch (error) {
    console.log('❌ Express not found - run: npm install');
    process.exit(1);
}

// Try to start the server
try {
    console.log('\n🚀 Launching JobScooter server...\n');
    require('./server.js');
} catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Run: npm install');
    console.log('2. Check your .env file');
    console.log('3. Ensure database is accessible');
    process.exit(1);
}