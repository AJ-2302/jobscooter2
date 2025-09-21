const express = require('express');
const router = express.Router();
const EmailService = require('../services/emailService');

// POST /api/test-email/send - Send test email (development only)
router.post('/send', async (req, res) => {
    try {
        // Only allow in development or with specific auth
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({
                success: false,
                message: 'Email testing disabled in production'
            });
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email address is required'
            });
        }

        const result = await EmailService.sendTestEmail(email);

        if (result.success) {
            res.json({
                success: true,
                message: 'Test email sent successfully!',
                messageId: result.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test email',
                error: result.error
            });
        }

    } catch (error) {
        console.error('Error in test email route:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// POST /api/test-email/welcome - Test welcome email (development only)
router.post('/welcome', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({
                success: false,
                message: 'Email testing disabled in production'
            });
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email address is required'
            });
        }

        // Mock credentials for testing
        const mockCredentials = {
            username: 'testuser123',
            password: 'TestPass123!'
        };
        const mockToken = 'test-verification-token-12345';

        const result = await EmailService.sendWelcomeEmail(email, mockCredentials, mockToken);

        if (result.success) {
            res.json({
                success: true,
                message: 'Welcome email sent successfully!',
                messageId: result.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send welcome email',
                error: result.error
            });
        }

    } catch (error) {
        console.error('Error in welcome email test:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/test-email/config - Show email configuration (development only)
router.get('/config', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({
                success: false,
                message: 'Configuration details hidden in production'
            });
        }

        res.json({
            success: true,
            config: {
                smtp_host: process.env.SMTP_HOST,
                smtp_port: process.env.SMTP_PORT,
                smtp_user: process.env.SMTP_USER,
                smtp_from: process.env.SMTP_FROM,
                frontend_url: process.env.FRONTEND_URL,
                configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
            }
        });

    } catch (error) {
        console.error('Error getting email config:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;