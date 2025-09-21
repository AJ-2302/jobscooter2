const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const EmailService = require('../services/emailService');

// POST /api/account/create-from-session - Create account after ID processing
router.post('/create-from-session', async (req, res) => {
    try {
        const { sessionToken, firstName, surname, email, phone, country, idNumber } = req.body;

        // Validate required fields
        if (!firstName || !surname || !email || !sessionToken) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Generate username and password
        const username = generateUsername(firstName, surname);
        const password = generatePassword();
        const passwordHash = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4();

        // Create user account
        const userQuery = `
            INSERT INTO applicants (username, password_hash, first_name, surname, email, phone, country, id_number, verification_token, completion_percentage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await db.query(userQuery, [
            username,
            passwordHash,
            firstName,
            surname,
            email,
            phone,
            country,
            idNumber,
            verificationToken,
            20 // ID processing completed = 20%
        ]);

        // Send welcome email with login credentials and verification link
        const emailResult = await EmailService.sendWelcomeEmail(email, {
            username: username,
            password: password
        }, verificationToken);
        
        if (!emailResult.success) {
            console.error('Failed to send welcome email:', emailResult.error);
            // Don't fail the registration, just log the error
        }
        
        res.json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: result.rows.insertId,
                username: username,
                email: email,
                createdAt: new Date()
            },
            loginCredentials: {
                username: username,
                password: password // In production, this should be sent via email only
            },
            verificationToken: verificationToken
        });

    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create account'
        });
    }
});

// POST /api/account/verify-email - Email verification
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
        }

        const query = `
            UPDATE applicants 
            SET is_verified = true, email_verified_at = NOW(), verification_token = NULL
            WHERE verification_token = ?
        `;

        const result = await db.query(query, [token]);

        if (result.rows.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        // Get updated user data
        const getUserQuery = 'SELECT id, username, email, is_verified FROM applicants WHERE verification_token IS NULL AND email = ?';
        const userResult = await db.query(getUserQuery, [req.body.email || '']);
        
        res.json({
            success: true,
            message: 'Email verified successfully',
            user: userResult.rows[0] || { verified: true }
        });

    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify email'
        });
    }
});

// Helper functions
function generateUsername(firstName, surname) {
    const base = (firstName.toLowerCase() + surname.toLowerCase()).replace(/[^a-z]/g, '');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return base + randomNum;
}

function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

module.exports = router;