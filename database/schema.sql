-- JobScooter Database Schema
-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS profile_views CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS public_profiles CASCADE;
DROP TABLE IF EXISTS accredited_institutions CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS language_verifications CASCADE;
DROP TABLE IF EXISTS application_sessions CASCADE;
DROP TABLE IF EXISTS applicants CASCADE;

-- Extended applicants table
CREATE TABLE applicants (
    id SERIAL PRIMARY KEY,
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
    completion_percentage INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session management for pre-verification
CREATE TABLE application_sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    extracted_data JSONB,
    step_completed INTEGER DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Language verifications
CREATE TABLE language_verifications (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    certificate_id INTEGER REFERENCES certificates(id),
    verification_method VARCHAR(50), -- 'certificate', 'test', 'manual'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced certificates table
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
    original_filename VARCHAR(255),
    file_path VARCHAR(500),
    certificate_type VARCHAR(50), -- 'language', 'academic', 'professional', 'reference'
    document_classification VARCHAR(50), -- 'certificate', 'diploma', 'degree', 'reference_letter'
    extracted_data JSONB,
    institution_name VARCHAR(200),
    field_of_study VARCHAR(200),
    grade_level VARCHAR(100),
    date_issued DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_accredited BOOLEAN DEFAULT FALSE,
    authenticity_score INTEGER CHECK (authenticity_score >= 0 AND authenticity_score <= 100),
    validation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Public profiles and access control
CREATE TABLE public_profiles (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
    profile_url_slug VARCHAR(100) UNIQUE NOT NULL,
    public_fields JSONB, -- Controls what fields are publicly visible
    view_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription and access control
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER, -- This could be employers/recruiters
    user_email VARCHAR(255),
    subscription_type VARCHAR(50) DEFAULT 'viewer', -- 'viewer', 'basic', 'premium'
    features JSONB, -- What features/data they can access
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile views and analytics
CREATE TABLE profile_views (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES public_profiles(id) ON DELETE CASCADE,
    viewer_id INTEGER REFERENCES subscriptions(id),
    viewer_type VARCHAR(50), -- 'public', 'subscriber', 'premium'
    viewed_fields JSONB, -- What information was accessed
    ip_address INET,
    user_agent TEXT,
    view_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accredited institutions database
CREATE TABLE accredited_institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    country VARCHAR(50),
    institution_type VARCHAR(100),
    accreditation_body VARCHAR(100), -- NQA, SA, etc.
    is_verified BOOLEAN DEFAULT TRUE,
    website_url VARCHAR(255),
    verification_patterns JSONB, -- Patterns to verify authentic certificates
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_applicants_email ON applicants(email);
CREATE INDEX idx_applicants_username ON applicants(username);
CREATE INDEX idx_applicants_status ON applicants(status);
CREATE INDEX idx_application_sessions_token ON application_sessions(session_token);
CREATE INDEX idx_certificates_applicant ON certificates(applicant_id);
CREATE INDEX idx_public_profiles_slug ON public_profiles(profile_url_slug);
CREATE INDEX idx_profile_views_profile ON profile_views(profile_id);
CREATE INDEX idx_profile_views_timestamp ON profile_views(view_timestamp);

-- Insert some sample accredited institutions
INSERT INTO accredited_institutions (name, country, institution_type, accreditation_body, website_url) VALUES
('University of Cape Town', 'South Africa', 'University', 'CHE', 'https://www.uct.ac.za'),
('University of the Witwatersrand', 'South Africa', 'University', 'CHE', 'https://www.wits.ac.za'),
('Stellenbosch University', 'South Africa', 'University', 'CHE', 'https://www.sun.ac.za'),
('Goethe Institut', 'Germany', 'Language Institute', 'German Federal Government', 'https://www.goethe.de'),
('TOEFL', 'International', 'Testing Organization', 'ETS', 'https://www.ets.org'),
('IELTS', 'International', 'Testing Organization', 'British Council', 'https://www.ielts.org');