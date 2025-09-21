const express = require('express');
const router = express.Router();

// GET /api/landing/info - Get landing page information
router.get('/info', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                platform: 'JobScooter',
                version: '1.0.0',
                features: [
                    'AI Document Verification',
                    'Secure & Compliant Data Processing',
                    'Certificate Authentication',
                    'Professional Profile Creation',
                    'Global Employer Network',
                    'Multi-language Support'
                ],
                stats: {
                    totalApplicants: 1000,
                    successfulPlacements: 750,
                    verifiedDocuments: 5000,
                    satisfactionRate: 98.5
                }
            }
        });
    } catch (error) {
        console.error('Error fetching landing info:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch landing page information'
        });
    }
});

// GET /api/landing/testimonials - Get testimonials
router.get('/testimonials', async (req, res) => {
    try {
        res.json({
            success: true,
            testimonials: [
                {
                    id: 1,
                    name: 'Sarah Johnson',
                    position: 'Software Engineer',
                    company: 'TechCorp',
                    message: 'JobScooter transformed my job search. The AI verification gave employers confidence in my qualifications, and I landed my dream job in 2 weeks!',
                    rating: 5,
                    verified: true
                },
                {
                    id: 2,
                    name: 'Michael Chen',
                    position: 'Data Analyst',
                    company: 'DataFlow Inc',
                    message: 'The certificate verification process was impressive. It saved me hours of paperwork and gave me a professional edge over other candidates.',
                    rating: 5,
                    verified: true
                },
                {
                    id: 3,
                    name: 'Lisa Williams',
                    position: 'HR Manager',
                    company: 'Global Recruiters',
                    message: 'As a recruiter, JobScooter profiles save me time. The verification system means I can trust the qualifications immediately.',
                    rating: 5,
                    verified: true
                }
            ]
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonials'
        });
    }
});

module.exports = router;