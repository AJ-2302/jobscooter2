//routes / pre - application.ja

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const moment = require('moment');

// POST /api/pre-application/start - Initialize application session
router.post('/start', async (req, res) => {
    try {
        const { timestamp, agreedToTerms, agreedToDataProtection, agreedToPrivacy } = req.body;

        // Validate required agreements
        if (!agreedToTerms || !agreedToDataProtection || !agreedToPrivacy) {
            return res.status(400).json({
                success: false,
                message: 'All agreements must be accepted to proceed'
            });
        }

        // Generate unique session token
        const sessionToken = uuidv4();

        // Set session expiration (24 hours from now)
        const expiresAt = moment().add(24, 'hours').toISOString();

        // Initial session data
        const sessionData = {
            step_completed: 0,
            agreements: {
                terms: agreedToTerms,
                dataProtection: agreedToDataProtection,
                privacy: agreedToPrivacy,
                timestamp: timestamp
            },
            started_at: new Date().toISOString()
        };

        // Insert session into database
        const query = `
            INSERT INTO application_sessions (session_token, extracted_data, step_completed, expires_at)
            VALUES (?, ?, ?, ?)
        `;

        const result = await db.query(query, [
            sessionToken,
            JSON.stringify(sessionData),
            0,
            expiresAt
        ]);

        res.json({
            success: true,
            message: 'Application session created successfully',
            sessionToken: sessionToken,
            sessionId: result.rows.insertId,
            expiresAt: expiresAt
        });

    } catch (error) {
        console.error('Error creating application session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create application session'
        });
    }
});

// GET /api/pre-application/session/:token - Get session data
router.get('/session/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const query = `
            SELECT id, session_token, extracted_data, step_completed, expires_at, created_at
            FROM application_sessions
            WHERE session_token = ? AND expires_at > NOW()
        `;

        const result = await db.query(query, [token]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Session not found or expired'
            });
        }

        const session = result.rows[0];

        res.json({
            success: true,
            session: {
                id: session.id,
                token: session.session_token,
                data: session.extracted_data,
                stepCompleted: session.step_completed,
                expiresAt: session.expires_at,
                createdAt: session.created_at
            }
        });

    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve session'
        });
    }
});

// PUT /api/pre-application/session/:token - Update session data
router.put('/session/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { data, stepCompleted } = req.body;

        const query = `
            UPDATE application_sessions 
            SET extracted_data = ?, step_completed = ?
            WHERE session_token = ? AND expires_at > NOW()
        `;

        const result = await db.query(query, [
            JSON.stringify(data),
            stepCompleted,
            token
        ]);

        if (result.rows.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Session not found or expired'
            });
        }

        // Get updated session data
        const getQuery = 'SELECT * FROM application_sessions WHERE session_token = ?';
        const getResult = await db.query(getQuery, [token]);
        const session = getResult.rows[0];

        res.json({
            success: true,
            message: 'Session updated successfully',
            session: {
                id: session.id,
                token: session.session_token,
                data: session.extracted_data,
                stepCompleted: session.step_completed
            }
        });

    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update session'
        });
    }
});

// DELETE /api/pre-application/session/:token - Delete session
router.delete('/session/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const query = `
            DELETE FROM application_sessions 
            WHERE session_token = ?
        `;

        const result = await db.query(query, [token]);

        if (result.rows.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.json({
            success: true,
            message: 'Session deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete session'
        });
    }
});

// GET /api/pre-application/cleanup - Clean up expired sessions (admin only)
router.get('/cleanup', async (req, res) => {
    try {
        const query = `
            DELETE FROM application_sessions 
            WHERE expires_at <= NOW()
        `;

        const result = await db.query(query);
        const deletedCount = result.rows.affectedRows || 0;

        res.json({
            success: true,
            message: `Cleaned up ${deletedCount} expired sessions`
        });

    } catch (error) {
        console.error('Error cleaning up sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clean up expired sessions'
        });
    }
});

module.exports = router;