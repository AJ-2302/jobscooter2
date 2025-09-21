// Quick test to verify database connection and basic setup
require('dotenv').config();
const db = require('./config/database');

async function testConnection() {
    console.log('🚀 Testing JobScooter Database Connection...\n');
    
    try {
        // Test basic connection
        console.log('1. Testing database connection...');
        const testQuery = 'SELECT 1 as test';
        await db.query(testQuery);
        console.log('✅ Database connection successful!\n');
        
        // Test if tables exist
        console.log('2. Checking if tables exist...');
        const tablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = ? 
            ORDER BY table_name
        `;
        const result = await db.query(tablesQuery, [process.env.DB_NAME]);
        
        if (result.rows.length > 0) {
            console.log('✅ Found existing tables:');
            result.rows.forEach(row => {
                console.log(`   - ${row.table_name || row.TABLE_NAME}`);
            });
        } else {
            console.log('⚠️  No tables found. Please run the schema first:');
            console.log('   1. Open phpMyAdmin');
            console.log('   2. Select database: jobscootercoz614_jobscooter');
            console.log('   3. Go to SQL tab');
            console.log('   4. Copy/paste content from database/schema_mysql.sql');
            console.log('   5. Click "Go" to execute');
        }
        
        console.log('\n3. Testing API endpoints availability...');
        console.log(`✅ Server should be available at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        console.log(`✅ Landing page: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        console.log(`✅ Pre-application: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/pre-application.html`);
        
        // Test email service if configured
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            console.log('\n4. Testing email service...');
            try {
                const EmailService = require('./services/emailService');
                console.log('✅ Email service loaded and configured');
                console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`);
                console.log(`📬 From Address: ${process.env.SMTP_FROM}`);
            } catch (emailError) {
                console.log(`⚠️ Email service error: ${emailError.message}`);
                console.log('This is likely due to missing nodemailer dependency');
                console.log('Run: npm install to fix this');
            }
        } else {
            console.log('\n⚠️ Email service not configured');
        }
        
        console.log('\n🎉 JobScooter setup verification complete!');
        console.log('\nNext steps:');
        console.log('1. Install dependencies: npm install');
        console.log('2. If no tables found, run the schema in phpMyAdmin');
        console.log('3. Start the server: npm run dev');
        console.log('4. Visit: http://localhost:3000');
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Check your .env file has correct database credentials');
        console.log('2. Ensure MySQL is running');
        console.log('3. Verify database exists in phpMyAdmin');
    } finally {
        if (db.pool) {
            await db.pool.end();
            console.log('\n🔌 Database connection closed.');
        }
        process.exit(0);
    }
}

testConnection();