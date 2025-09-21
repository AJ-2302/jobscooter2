const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/documents/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image and document files are allowed'));
        }
    }
});

// POST /api/documents/process-id - Process ID document
router.post('/process-id', upload.single('idDocument'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No ID document uploaded'
            });
        }

        // TODO: Implement AI ID processing with Tesseract.js or cloud OCR service
        // For now, return mock data
        res.json({
            success: true,
            message: 'ID document processed successfully',
            extractedData: {
                firstName: 'John',
                lastName: 'Doe',
                idNumber: '1234567890123',
                dateOfBirth: '1990-01-01',
                nationality: 'South African',
                documentType: 'ID Card'
            },
            processingTime: '2.3s',
            confidence: 95
        });

    } catch (error) {
        console.error('Error processing ID document:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process ID document'
        });
    }
});

// POST /api/documents/manual-entry - Manual ID data entry fallback
router.post('/manual-entry', async (req, res) => {
    try {
        const { firstName, lastName, idNumber, dateOfBirth, nationality } = req.body;

        if (!firstName || !lastName || !idNumber) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, and ID number are required'
            });
        }

        res.json({
            success: true,
            message: 'Personal data saved successfully',
            data: {
                firstName,
                lastName,
                idNumber,
                dateOfBirth,
                nationality,
                entryMethod: 'manual'
            }
        });

    } catch (error) {
        console.error('Error saving manual entry:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save personal data'
        });
    }
});

// GET /api/documents/extraction-status/:jobId - Check processing status
router.get('/extraction-status/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;

        // TODO: Implement actual job status checking
        res.json({
            success: true,
            status: 'completed',
            progress: 100,
            message: 'Document processing completed'
        });

    } catch (error) {
        console.error('Error checking extraction status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check processing status'
        });
    }
});

module.exports = router;