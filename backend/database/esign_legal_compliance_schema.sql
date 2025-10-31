-- ============================================================================
-- E-SIGNATURE SYSTEM - LEGALLY COMPLIANT SCHEMA
-- Implements ESIGN Act, UETA, eIDAS requirements
-- Multi-signer workflow with complete audit trail
-- Database: hrms_go_v5
-- ============================================================================

USE hrms_go_v5;

SET FOREIGN_KEY_CHECKS=0;

-- ============================================================================
-- 1. CONTRACT_SIGNERS - Multi-Signer Support (NEW)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contract_signers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  contract_instance_id BIGINT UNSIGNED NOT NULL,
  
  -- Signer Information
  signer_type ENUM('sender', 'employee', 'manager', 'hr_manager', 'witness', 'third_party') NOT NULL,
  signer_order INT NOT NULL DEFAULT 1 COMMENT 'Order in signing sequence (1, 2, 3...)',
  user_id BIGINT UNSIGNED NULL COMMENT 'Link to users table if internal employee',
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NULL,
  
  -- Status Tracking
  status ENUM('pending', 'sent', 'viewed', 'in_progress', 'signed', 'declined', 'expired') NOT NULL DEFAULT 'pending',
  sent_at DATETIME NULL,
  viewed_at DATETIME NULL,
  signed_at DATETIME NULL,
  declined_at DATETIME NULL,
  decline_reason TEXT NULL,
  
  -- Signature Data
  signature_method ENUM('draw', 'type', 'upload', 'digital_certificate') NULL,
  signature_data LONGTEXT NULL COMMENT 'Base64 encoded signature image',
  signature_hash VARCHAR(255) NULL COMMENT 'SHA-256 hash of signature',
  typed_signature_text VARCHAR(255) NULL,
  typed_signature_font VARCHAR(100) NULL,
  
  -- Legal Compliance (ESIGN/UETA/eIDAS)
  consent_given BOOLEAN DEFAULT FALSE,
  consent_timestamp DATETIME NULL,
  consent_text TEXT NULL,
  consent_ip VARCHAR(45) NULL,
  intent_to_sign BOOLEAN DEFAULT FALSE,
  intent_timestamp DATETIME NULL,
  
  -- Authentication & Security
  authentication_method ENUM('email', 'sms', 'password', 'sso', 'biometric') NULL,
  authentication_token VARCHAR(255) NULL,
  authentication_verified BOOLEAN DEFAULT FALSE,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  geo_location VARCHAR(255) NULL COMMENT 'City, State, Country',
  device_fingerprint VARCHAR(255) NULL,
  browser_fingerprint TEXT NULL,
  
  -- Reminders & Notifications
  reminder_count INT DEFAULT 0,
  last_reminder_sent DATETIME NULL,
  access_code VARCHAR(100) NULL COMMENT 'Secure access code for signing link',
  access_code_expires DATETIME NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_contract_instance (contract_instance_id),
  INDEX idx_user (user_id),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_signer_order (contract_instance_id, signer_order),
  
  FOREIGN KEY (contract_instance_id) REFERENCES contract_instances(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Multi-signer support with legal compliance';

-- ============================================================================
-- 2. CONTRACT_FIELD_VALUES - Track filled form data (NEW)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contract_field_values (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  contract_instance_id BIGINT UNSIGNED NOT NULL,
  template_field_id BIGINT UNSIGNED NOT NULL,
  signer_id BIGINT UNSIGNED NULL COMMENT 'Which signer filled this field',
  
  -- Field Data
  field_value TEXT NULL,
  filled_at DATETIME NULL,
  filled_by_user_id BIGINT UNSIGNED NULL,
  filled_ip VARCHAR(45) NULL,
  
  -- Verification
  value_hash VARCHAR(255) NULL COMMENT 'SHA-256 hash of value for verification',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_contract_instance (contract_instance_id),
  INDEX idx_template_field (template_field_id),
  INDEX idx_signer (signer_id),
  
  FOREIGN KEY (contract_instance_id) REFERENCES contract_instances(id) ON DELETE CASCADE,
  FOREIGN KEY (template_field_id) REFERENCES template_fields(id) ON DELETE CASCADE,
  FOREIGN KEY (signer_id) REFERENCES contract_signers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Contract form field values with audit';

-- ============================================================================
-- 3. CONTRACT_CERTIFICATES - Digital Certificates (NEW)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contract_certificates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  contract_instance_id BIGINT UNSIGNED NOT NULL,
  signer_id BIGINT UNSIGNED NULL,
  
  -- Certificate Type
  certificate_type ENUM('signing', 'completion', 'verification', 'timestamp') NOT NULL,
  
  -- Certificate Data (X.509)
  certificate_data TEXT NULL COMMENT 'PEM encoded certificate',
  public_key TEXT NULL,
  certificate_hash VARCHAR(255) NULL COMMENT 'SHA-256 of certificate',
  serial_number VARCHAR(100) NULL,
  
  -- Issuer & Validity
  issuer VARCHAR(255) DEFAULT 'HRMS GO Certificate Authority',
  issued_at DATETIME NOT NULL,
  expires_at DATETIME NULL,
  valid BOOLEAN DEFAULT TRUE,
  
  -- Timestamp Authority (for legal timestamp)
  timestamp_authority VARCHAR(255) NULL,
  timestamp_token TEXT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_contract_instance (contract_instance_id),
  INDEX idx_signer (signer_id),
  INDEX idx_type (certificate_type),
  
  FOREIGN KEY (contract_instance_id) REFERENCES contract_instances(id) ON DELETE CASCADE,
  FOREIGN KEY (signer_id) REFERENCES contract_signers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Digital certificates for legal compliance';

-- ============================================================================
-- 4. SIGNATURE_VERIFICATION_LOG - Tamper Detection (NEW)
-- ============================================================================
CREATE TABLE IF NOT EXISTS signature_verification_log (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  contract_instance_id BIGINT UNSIGNED NOT NULL,
  
  -- Verification Details
  verified_by_user_id BIGINT UNSIGNED NULL,
  verification_timestamp DATETIME NOT NULL,
  verification_method ENUM('manual', 'automatic', 'scheduled') NOT NULL DEFAULT 'manual',
  
  -- Hash Verification
  document_hash VARCHAR(255) NOT NULL COMMENT 'SHA-256 hash at verification time',
  expected_hash VARCHAR(255) NOT NULL COMMENT 'Original hash from signing',
  hashes_match BOOLEAN NOT NULL,
  
  -- Verification Result
  verification_result ENUM('valid', 'invalid', 'tampered', 'corrupted', 'expired') NOT NULL,
  tamper_detected BOOLEAN DEFAULT FALSE,
  tamper_details TEXT NULL COMMENT 'Details of tampering if detected',
  
  -- Certificate Validation
  certificate_valid BOOLEAN DEFAULT TRUE,
  certificate_expired BOOLEAN DEFAULT FALSE,
  signature_valid BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  verification_notes TEXT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_contract_instance (contract_instance_id),
  INDEX idx_verified_by (verified_by_user_id),
  INDEX idx_result (verification_result),
  INDEX idx_tamper (tamper_detected),
  
  FOREIGN KEY (contract_instance_id) REFERENCES contract_instances(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Signature and document verification audit log';

-- ============================================================================
-- 5. UPDATE CONTRACT_INSTANCES - Add Legal Compliance Fields
-- ============================================================================

-- Add legal compliance fields to contract_instances
ALTER TABLE contract_instances
ADD COLUMN IF NOT EXISTS lifecycle_state ENUM('draft', 'pending_signers', 'in_progress', 'partially_signed', 'fully_signed', 'completed', 'archived', 'cancelled', 'expired') DEFAULT 'draft' AFTER status,
ADD COLUMN IF NOT EXISTS requires_sequential_signing BOOLEAN DEFAULT FALSE COMMENT 'True if signers must sign in order',
ADD COLUMN IF NOT EXISTS signing_deadline DATETIME NULL COMMENT 'Hard deadline for all signatures',
ADD COLUMN IF NOT EXISTS auto_expire BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS document_hash VARCHAR(255) NULL COMMENT 'SHA-256 hash of original document',
ADD COLUMN IF NOT EXISTS signed_document_hash VARCHAR(255) NULL COMMENT 'SHA-256 hash after all signatures',
ADD COLUMN IF NOT EXISTS certificate_issued BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS certificate_id BIGINT UNSIGNED NULL,
ADD COLUMN IF NOT EXISTS verification_code VARCHAR(100) NULL COMMENT 'Public verification code',
ADD COLUMN IF NOT EXISTS legally_binding BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS compliance_region ENUM('USA', 'EU', 'INDIA', 'GLOBAL') DEFAULT 'GLOBAL',
ADD COLUMN IF NOT EXISTS retention_period VARCHAR(50) DEFAULT '7 years' COMMENT 'Legal retention requirement',
ADD COLUMN IF NOT EXISTS archived_at DATETIME NULL;

-- ============================================================================
-- 6. ENHANCE CONTRACT_AUDIT_LOG - More Legal Details
-- ============================================================================

-- Add legal compliance fields to audit log
ALTER TABLE contract_audit_log
ADD COLUMN IF NOT EXISTS event_category ENUM('lifecycle', 'signer_action', 'verification', 'compliance', 'system') DEFAULT 'signer_action' AFTER action,
ADD COLUMN IF NOT EXISTS before_hash VARCHAR(255) NULL COMMENT 'Document hash before event',
ADD COLUMN IF NOT EXISTS after_hash VARCHAR(255) NULL COMMENT 'Document hash after event',
ADD COLUMN IF NOT EXISTS verification_status ENUM('verified', 'tampered', 'unknown', 'n/a') DEFAULT 'n/a',
ADD COLUMN IF NOT EXISTS legal_timestamp DATETIME NULL COMMENT 'Certified timestamp from authority',
ADD COLUMN IF NOT EXISTS geo_location VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS device_fingerprint VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS event_metadata JSON NULL COMMENT 'Complete event context for legal purposes',
ADD COLUMN IF NOT EXISTS compliance_validated BOOLEAN DEFAULT FALSE;

SET FOREIGN_KEY_CHECKS=1;

-- ============================================================================
-- 7. SAMPLE DATA - Multi-Signer Workflow Example
-- ============================================================================

-- This will be populated by seeding script
SELECT '✅ E-Signature legal compliance schema created successfully!' as Status;
SELECT 'Tables created: contract_signers, contract_field_values, contract_certificates, signature_verification_log' as Info;
SELECT 'Enhanced: contract_instances, contract_audit_log with legal compliance fields' as Info;


