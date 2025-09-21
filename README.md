# JobScooter - AI-Powered Job Application Platform

JobScooter is an innovative AI-powered job application automation platform that features intelligent document verification, automatic profile creation, and tiered access control with a public profile system.

## 🚀 Features

- **AI Document Verification**: Automatic extraction and verification of information from ID documents and certificates
- **Secure Data Processing**: Bank-level encryption with GDPR compliance
- **Certificate Authentication**: Verification against accredited institution databases
- **Professional Profile Creation**: Auto-generated CVs and comprehensive profiles
- **Multi-language Support**: English and German language verification
- **Tiered Access System**: Public profiles with subscription-based access levels
- **Traffic Light System**: Quality assessment for application completion

## 🏗️ Architecture Overview

### Frontend
- **Landing Page**: Modern, responsive design with feature showcase
- **Pre-Application Flow**: Terms acceptance and process explanation
- **Application Steps**: 5-step guided application process (0-100% completion)
- **User Dashboard**: Profile management and editing capabilities

### Backend
- **Node.js/Express**: RESTful API server
- **PostgreSQL**: Robust database for user data and documents
- **AI Integration**: Document processing and text extraction
- **Email System**: Automated notifications and verification
- **File Upload**: Secure document and media handling

### Database Schema
- `applicants`: User accounts and profiles
- `application_sessions`: Temporary session management
- `certificates`: Document storage and verification
- `language_verifications`: Language proficiency tracking
- `public_profiles`: Public profile system
- `subscriptions`: Access control and analytics

## 📋 Prerequisites

Before running JobScooter, ensure you have:

- Node.js (v14 or higher)
- MySQL (v5.7 or higher) - ✅ Already set up
- phpMyAdmin access - ✅ Available

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd jobscooter
npm install
```

### 2. Database Setup
1. Your MySQL database is already created: `jobscootercoz614_jobscooter`
2. Run the MySQL schema file to create tables:
   - Open phpMyAdmin
   - Select your database: `jobscootercoz614_jobscooter`
   - Go to "SQL" tab
   - Copy and paste the contents of `database/schema_mysql.sql`
   - Click "Go" to execute

### 3. Environment Configuration
Your `.env` file is already created with your database credentials. You may want to update:

```env
# Email Configuration (when ready)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Security (change in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
ENCRYPTION_KEY=change_this_to_32_char_key_prod_2024
```

### 4. Create Upload Directories
```bash
mkdir -p uploads/documents uploads/images uploads/videos
```

### 5. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## 🔄 Application Flow

### User Journey
1. **Landing Page** (`/`) - Introduction and "Apply Now" button
2. **Pre-Application** (`/pre-application.html`) - Process explanation and legal agreements
3. **Step 1 (0-20%)** - ID verification and account creation
4. **Step 2 (20-40%)** - Language verification
5. **Step 3 (40-60%)** - Certificate analysis and classification
6. **Step 4 (60-80%)** - Media upload (photo/video)
7. **Step 5 (80-100%)** - CV generation and profile finalization

### API Endpoints

#### Pre-Application
- `POST /api/pre-application/start` - Initialize application session
- `GET /api/pre-application/session/:token` - Get session data
- `PUT /api/pre-application/session/:token` - Update session

#### Document Processing
- `POST /api/documents/process-id` - Process ID document with AI
- `POST /api/documents/manual-entry` - Manual data entry fallback
- `GET /api/documents/extraction-status/:jobId` - Check processing status

#### Account Management
- `POST /api/account/create-from-session` - Create account after verification
- `POST /api/account/verify-email` - Email verification

#### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

## 🔧 Development Status

### ✅ Completed
- [x] Project structure and dependencies
- [x] Database schema design
- [x] Landing page with modern UI
- [x] Pre-application flow with legal agreements
- [x] Basic API routing structure
- [x] Session management system
- [x] Document upload configuration

### 🚧 In Progress
- [ ] ID document AI processing (Step 1)
- [ ] Account creation and email system
- [ ] User authentication and JWT tokens
- [ ] Language verification system (Step 2)
- [ ] Certificate processing and AI analysis (Step 3)
- [ ] Media upload system (Step 4)
- [ ] CV generation and profile finalization (Step 5)
- [ ] Public profile and subscription system
- [ ] Traffic light status system

### 📋 TODO
- [ ] AI/OCR integration (Tesseract.js or cloud service)
- [ ] Email notification system
- [ ] File encryption and security measures
- [ ] Certificate authenticity verification
- [ ] Video transcription service
- [ ] Advanced user dashboard
- [ ] Analytics and reporting
- [ ] Admin panel
- [ ] Mobile responsiveness improvements
- [ ] Testing suite
- [ ]ployment configuration

## 🔒 Security Features

- **Data Encryption**: All sensitive data encrypted at rest
- **ID Document Security**: Documents processed and immediately deleted
- **Access Logging**: All document access logged for audit
- **GDPR Compliance**: Data protection and user rights
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API protection against abuse
- **HTTPS**: Secure data transmission

## 🤝 Contributing

This is a prototype system. To contribute:

1. Follow the existing code structure
2. Implement TODOs in order of priority
3. Add proper error handling and validation
4. Include tests for new features
5. Update documentation

## 📞 Support

For questions or support:
- Email: support@jobscooter.com
- Documentation: See inline code comments
- Issues: Check TODO items in route files

## 📄 License

This project is proprietary software developed for JobScooter platform.

---

**Note**: This is a development version. Many features are marked as TODO and need implementation. Refer to individual route files for specific implementation requirements.