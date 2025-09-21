//database.js

const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'jobscootercoz614_jobscooter',
    user: process.env.DB_USER || 'jobscootercoz614_jobscooter',
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL database:', err.message);
    });

// Handle pool errors
pool.on('error', (err) => {
    console.error('MySQL pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconnecting to MySQL...');
    } else {
        throw err;
    }
});

module.exports = {
    query: async (sql, params = []) => {
        try {
            const [rows] = await pool.execute(sql, params);
            return { rows };
        } catch (error) {
            throw error;
        }
    },
    pool
};
