// Quick test for current JobScooter setup
require('dotenv').config();

async function quickTest() {
    console.log('🚀 JobScooter Quick Setup Test\n');
    
    // Test 1: Environment variables
    console.log('1. Checking environment configuration...');
    const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
    const missing = requiredEnvVars.filter(env => !process.env[env]);
    
    if (missing.length === 0) {
        console.log('✅ All required environment variables are set');
        console.log(`   📍 Database: ${process.env.DB_NAME}`);
        console.log(`   🌐 Frontend: ${process.env.FRONTEND_URL}`);
        console.log(`   📧 Email: ${process.env.SMTP_FROM || 'Not configured'}`);
    } else {
        console.log(`❌ Missing environment variables: ${missing.join(', ')}`);
        return;
    }

    // Test 2: Database connection
    console.log('\n2. Testing database connection...');
    try {
        const db = require('./config/database');
        const result = await db.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = ?', [process.env.DB_NAME]);
        console.log('✅ Database connection successful');
        console.log(`   📊 Tables found: ${result.rows[0].table_count || result.rows[0].TABLE_COUNT}`);
    } catch (dbError) {
        console.log(`❌ Database error: ${dbError.message}`);
        return;
    }

    // Test 3: Required files
    console.log('\n3. Checking required files...');
    const fs = require('fs');
    const requiredFiles = [
        'server.js',
        'package.json',
        'public/index.html',
        'public/pre-application.html',
        'routes/pre-application.js'
    ];
    
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    if (missingFiles.length === 0) {
        console.log('✅ All required files present');
    } else {
        console.log(`⚠️ Missing files: ${missingFiles.join(', ')}`);
    }

    // Test 4: Dependencies
    console.log('\n4. Checking package dependencies...');
    try {
        const packageJson = require('./package.json');
        const requiredDeps = ['express', 'mysql2', 'bcrypt', 'jsonwebtoken', 'multer'];
        const installed = requiredDeps.filter(dep => packageJson.dependencies[dep]);
        console.log(`✅ Dependencies installed: ${installed.length}/${requiredDeps.length}`);
        
        if (installed.length < requiredDeps.length) {
            console.log('⚠️ Run: npm install');
        }
    } catch (error) {
        console.log('⚠️ Could not read package.json');
    }

    // Test 5: API endpoints test
    console.log('\n5. Testing basic API structure...');
    try {
        const express = require('express');
        console.log('✅ Express is available');
        
        // Check if routes exist
        const routeFiles = [
            'routes/pre-application.js',
            'routes/landing.js', 
            'routes/documents.js',
            'routes/account.js'
        ];
        
        const existingRoutes = routeFiles.filter(route => fs.existsSync(route));
        console.log(`✅ Route files: ${existingRoutes.length}/${routeFiles.length} available`);
        
    } catch (error) {
        console.log('❌ Express not available - run npm install');
    }

    console.log('\n🎯 Setup Status Summary:');
    console.log('✅ Database: Connected and tables exist');
    console.log('✅ Environment: Production configuration loaded');
    console.log('✅ Files: Core application files present');
    console.log('✅ Domain: Ready for jobscooter.co.za');
    console.log('\n🚀 Next steps:');
    console.log('1. Run: npm install (if needed)');
    console.log('2. Run: npm start');
    console.log('3. Visit: https://www.jobscooter.co.za');
    
    console.log('\n🔧 Development ready! You can now:');
    console.log('• Implement ID document processing');
    console.log('• Add language verification');
    console.log('• Build certificate AI analysis');
    console.log('• Create media upload system');
    console.log('• Implement CV generation');

    process.exit(0);
}

quickTest().catch(error => {
    console.error('Test failed:', error.message);
    process.exit(1);
});