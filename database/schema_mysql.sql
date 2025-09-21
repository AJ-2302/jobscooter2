-- JobScooter Database Schema for MySQL
-- Drop existing tables if they exist (for development)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS profile_views;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS public_profiles;
DROP TABLE IF EXISTS accredited_institutions;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS language_verifications;
DROP TABLE IF EXISTS application_sessions;
DROP TABLE IF EXISTS applicants;

SET FOREIGN_KEY_CHECKS = 1;

-- Extended applicants table
CREATE TABLE applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    surname VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    country VARCHAR(50),
    id_number VARCHAR(50),
    profile_picture_url VARCHAR(500),
    video_intro_url VARCHAR(500),
    video_transcript TEXT,
    auto_cv_url VARCHAR(500),
    public_profile_url VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, flagged
    traffic_light_status VARCHAR(10), -- green, yellow, red
    completion_percentage INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_status (status)
);

-- Session management for pre-verification
CREATE TABLE application_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    extracted_data JSON,
    step_completed INT DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_session_token (session_token)
);

-- Language verifications
CREATE TABLE language_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    language VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    certificate_id INT,
    verification_method VARCHAR(50), -- 'certificate', 'test', 'manual'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (certificate_id) REFERENCES certificates(id) ON DELETE SET NULL
);

-- Enhanced certificates table
CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    original_filename VARCHAR(255),
    file_path VARCHAR(500),
    certificate_type VARCHAR(50), -- 'language', 'academic', 'professional', 'reference'
    document_classification VARCHAR(50), -- 'certificate', 'diploma', 'degree', 'reference_letter'
    extracted_data JSON,
    institution_name VARCHAR(200),
    field_of_study VARCHAR(200),
    grade_level VARCHAR(100),
    date_issued DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_accredited BOOLEAN DEFAULT FALSE,
    authenticity_score INT CHECK (authenticity_score >= 0 AND authenticity_score <= 100),
    validation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    INDEX idx_applicant (applicant_id)
);

-- Public profiles and access control
CREATE TABLE public_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    profile_url_slug VARCHAR(100) UNIQUE NOT NULL,
    public_fields JSON, -- Controls what fields are publicly visible
    view_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    INDEX idx_profile_slug (profile_url_slug)
);

-- Subscription and access control
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- This could be employers/recruiters
    user_email VARCHAR(255),
    subscription_type VARCHAR(50) DEFAULT 'viewer', -- 'viewer', 'basic', 'premium'
    features JSON, -- What features/data they can access
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile views and analytics
CREATE TABLE profile_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    viewer_id INT,
    viewer_type VARCHAR(50), -- 'public', 'subscriber', 'premium'
    viewed_fields JSON, -- What information was accessed
    ip_address VARCHAR(45), -- Support for IPv6
    user_agent TEXT,
    view_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (profile_id) REFERENCES public_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (viewer_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
    INDEX idx_profile_views_profile (profile_id),
    INDEX idx_profile_views_timestamp (view_timestamp)
);

-- Accredited institutions database
CREATE TABLE accredited_institutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    country VARCHAR(50),
    institution_type VARCHAR(100),
    accreditation_body VARCHAR(100), -- NQA, SA, etc.
    is_verified BOOLEAN DEFAULT TRUE,
    website_url VARCHAR(255),
    verification_patterns JSON, -- Patterns to verify authentic certificates
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample accredited institutions
INSERT INTO accredited_institutions (name, country, institution_type, accreditation_body, website_url) VALUES
('University of Cape Town', 'South Africa', 'University', 'CHE', 'https://www.uct.ac.za'),
('University of the Witwatersrand', 'South Africa', 'University', 'CHE', 'https://www.wits.ac.za'),
('Stellenbosch University', 'South Africa', 'University', 'CHE', 'https://www.sun.ac.za'),
('Goethe Institut', 'Germany', 'Language Institute', 'German Federal Government', 'https://www.goethe.de'),
('TOEFL', 'International', 'Testing Organization', 'ETS', 'https://www.ets.org'),
('IELTS', 'International', 'Testing Organization', 'British Council', 'https://www.ielts.org'),
('University of South Africa (UNISA)', 'South Africa', 'University', 'CHE', 'https://www.unisa.ac.za'),
('Cape Peninsula University of Technology', 'South Africa', 'University of Technology', 'CHE', 'https://www.cput.ac.za'),
('Durban University of Technology', 'South Africa', 'University of Technology', 'CHE', 'https://www.dut.ac.za'),
('Tshwane University of Technology', 'South Africa', 'University of Technology', 'CHE', 'https://www.tut.ac.za');