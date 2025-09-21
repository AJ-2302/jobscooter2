const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'jobscootercoz614_jobscooter',  // <-- your actual database name in phpMyAdmin
    user: 'root',             // <-- default XAMPP user
    password: '',             // <-- default is empty
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


