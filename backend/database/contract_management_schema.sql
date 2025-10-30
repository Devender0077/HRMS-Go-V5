-- ============================================================================
-- DIGITAL CONTRACT MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Phase 1: Foundation Tables
-- ============================================================================

-- Contract Templates
CREATE TABLE IF NOT EXISTS contract_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('employee', 'vendor', 'msa', 'po', 'sow', 'nda', 'other') DEFAULT 'employee',
  region ENUM('usa', 'india', 'global') DEFAULT 'global',
  file_path VARCHAR(500),
  file_type VARCHAR(50), -- pdf, docx, etc
  file_size INT, -- in bytes
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_region (region),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Template Fields (for form generation)
CREATE TABLE IF NOT EXISTS template_fields (
  id INT PRIMARY KEY AUTO_INCREMENT,
  template_id INT NOT NULL,
  field_name VARCHAR(255) NOT NULL,
  field_type ENUM('text', 'date', 'signature', 'initials', 'checkbox', 'dropdown', 'email', 'number') DEFAULT 'text',
  field_label VARCHAR(255),
  required BOOLEAN DEFAULT FALSE,
  page_number INT DEFAULT 1,
  x_position FLOAT,
  y_position FLOAT,
  width FLOAT,
  height FLOAT,
  default_value TEXT,
  validation_rules JSON,
  placeholder VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES contract_templates(id) ON DELETE CASCADE,
  INDEX idx_template (template_id),
  INDEX idx_page (page_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contract Instances (actual contracts sent to people)
CREATE TABLE IF NOT EXISTS contract_instances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  template_id INT,
  contract_number VARCHAR(100) UNIQUE,
  title VARCHAR(255) NOT NULL,
  recipient_type ENUM('employee', 'vendor', 'other') DEFAULT 'employee',
  recipient_id INT, -- employee_id or vendor_id
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  status ENUM('draft', 'sent', 'viewed', 'in_progress', 'completed', 'declined', 'expired', 'cancelled') DEFAULT 'draft',
  sent_date TIMESTAMP NULL,
  viewed_date TIMESTAMP NULL,
  completed_date TIMESTAMP NULL,
  declined_date TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  original_file_path VARCHAR(500), -- Original template file
  signed_file_path VARCHAR(500), -- Final signed PDF
  metadata JSON, -- Store additional data (pre-filled values, etc)
  decline_reason TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES contract_templates(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_recipient (recipient_type, recipient_id),
  INDEX idx_status (status),
  INDEX idx_contract_number (contract_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Field Values (signed/filled data)
CREATE TABLE IF NOT EXISTS contract_field_values (
  id INT PRIMARY KEY AUTO_INCREMENT,
  instance_id INT NOT NULL,
  field_id INT NOT NULL,
  field_name VARCHAR(255), -- Denormalized for easier querying
  value TEXT,
  signature_data LONGTEXT, -- Base64 signature image
  filled_at TIMESTAMP NULL,
  filled_by INT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instance_id) REFERENCES contract_instances(id) ON DELETE CASCADE,
  FOREIGN KEY (field_id) REFERENCES template_fields(id) ON DELETE SET NULL,
  FOREIGN KEY (filled_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_instance (instance_id),
  INDEX idx_field (field_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit Trail
CREATE TABLE IF NOT EXISTS contract_audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  instance_id INT NOT NULL,
  action VARCHAR(100) NOT NULL, -- created, sent, viewed, signed, declined, expired, etc
  performed_by INT,
  performed_by_name VARCHAR(255), -- Denormalized for audit trail
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSON, -- Additional context
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instance_id) REFERENCES contract_instances(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_instance (instance_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reminders
CREATE TABLE IF NOT EXISTS contract_reminders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  instance_id INT NOT NULL,
  reminder_type ENUM('initial', 'followup', 'final', 'expiry_warning') DEFAULT 'followup',
  scheduled_at TIMESTAMP NOT NULL,
  sent_at TIMESTAMP NULL,
  status ENUM('pending', 'sent', 'cancelled', 'failed') DEFAULT 'pending',
  email_subject VARCHAR(255),
  email_body TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instance_id) REFERENCES contract_instances(id) ON DELETE CASCADE,
  INDEX idx_instance (instance_id),
  INDEX idx_status (status),
  INDEX idx_scheduled (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employee Onboarding Checklist
CREATE TABLE IF NOT EXISTS employee_onboarding_documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  contract_instance_id INT,
  document_type VARCHAR(100) NOT NULL, -- 'i9', 'w4', 'employment_agreement', 'nda', etc.
  document_name VARCHAR(255),
  status ENUM('pending', 'sent', 'in_progress', 'completed', 'waived', 'overdue') DEFAULT 'pending',
  required BOOLEAN DEFAULT TRUE,
  due_date DATE,
  completed_at TIMESTAMP NULL,
  waived_at TIMESTAMP NULL,
  waived_by INT,
  waive_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (contract_instance_id) REFERENCES contract_instances(id) ON DELETE SET NULL,
  FOREIGN KEY (waived_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_employee (employee_id),
  INDEX idx_status (status),
  INDEX idx_document_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Signing Sessions (for tracking multi-step signing)
CREATE TABLE IF NOT EXISTS contract_signing_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  instance_id INT NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id INT,
  email VARCHAR(255) NOT NULL,
  status ENUM('active', 'completed', 'expired', 'cancelled') DEFAULT 'active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instance_id) REFERENCES contract_instances(id) ON DELETE CASCADE,
  INDEX idx_instance (instance_id),
  INDEX idx_token (session_token),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA: Sample Templates
-- ============================================================================

-- Sample USA Templates
INSERT INTO contract_templates (name, description, category, region, is_active, created_at, updated_at) VALUES
('Employment Agreement - USA', 'Standard employment agreement for USA employees', 'employee', 'usa', TRUE, NOW(), NOW()),
('Form I-9', 'Employment Eligibility Verification (USA)', 'employee', 'usa', TRUE, NOW(), NOW()),
('Form W-4', 'Employee Withholding Certificate (USA)', 'employee', 'usa', TRUE, NOW(), NOW()),
('NDA - USA', 'Non-Disclosure Agreement for USA employees', 'nda', 'usa', TRUE, NOW(), NOW()),
('Direct Deposit Authorization', 'Bank account authorization for direct deposit', 'employee', 'usa', TRUE, NOW(), NOW());

-- Sample India Templates
INSERT INTO contract_templates (name, description, category, region, is_active, created_at, updated_at) VALUES
('Employment Contract - India', 'Standard employment contract for India employees', 'employee', 'india', TRUE, NOW(), NOW()),
('Appointment Letter - India', 'Formal appointment letter for new hires in India', 'employee', 'india', TRUE, NOW(), NOW()),
('NDA - India', 'Non-Disclosure Agreement for India employees', 'nda', 'india', TRUE, NOW(), NOW()),
('Form 11 (EPF)', 'Employee Provident Fund nomination form', 'employee', 'india', TRUE, NOW(), NOW()),
('Gratuity Nomination', 'Gratuity nominee details form', 'employee', 'india', TRUE, NOW(), NOW());

-- Sample Vendor/Business Templates
INSERT INTO contract_templates (name, description, category, region, is_active, created_at, updated_at) VALUES
('Master Service Agreement (MSA)', 'Framework agreement for ongoing vendor services', 'msa', 'global', TRUE, NOW(), NOW()),
('Statement of Work (SOW)', 'Project-specific work details', 'sow', 'global', TRUE, NOW(), NOW()),
('Purchase Order (PO)', 'Standard purchase order template', 'po', 'global', TRUE, NOW(), NOW()),
('Business NDA', 'Mutual non-disclosure agreement for business partnerships', 'nda', 'global', TRUE, NOW(), NOW());

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Optimize searches
CREATE INDEX idx_contract_instances_recipient_status ON contract_instances(recipient_id, status);
CREATE INDEX idx_contract_instances_created ON contract_instances(created_at DESC);
CREATE INDEX idx_template_fields_template_page ON template_fields(template_id, page_number);
CREATE INDEX idx_audit_log_instance_created ON contract_audit_log(instance_id, created_at DESC);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active contracts awaiting signature
CREATE OR REPLACE VIEW pending_contracts AS
SELECT 
  ci.id,
  ci.contract_number,
  ci.title,
  ci.recipient_name,
  ci.recipient_email,
  ci.status,
  ci.sent_date,
  ci.expires_at,
  ct.name as template_name,
  ct.category,
  DATEDIFF(ci.expires_at, NOW()) as days_until_expiry
FROM contract_instances ci
LEFT JOIN contract_templates ct ON ci.template_id = ct.id
WHERE ci.status IN ('sent', 'viewed', 'in_progress')
  AND (ci.expires_at IS NULL OR ci.expires_at > NOW());

-- Employee onboarding progress
CREATE OR REPLACE VIEW employee_onboarding_progress AS
SELECT 
  e.id as employee_id,
  e.employee_id as employee_code,
  CONCAT(e.first_name, ' ', e.last_name) as employee_name,
  COUNT(eod.id) as total_documents,
  SUM(CASE WHEN eod.status = 'completed' THEN 1 ELSE 0 END) as completed_documents,
  SUM(CASE WHEN eod.status = 'pending' THEN 1 ELSE 0 END) as pending_documents,
  SUM(CASE WHEN eod.status = 'overdue' THEN 1 ELSE 0 END) as overdue_documents,
  ROUND(SUM(CASE WHEN eod.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(eod.id), 2) as completion_percentage
FROM employees e
LEFT JOIN employee_onboarding_documents eod ON e.id = eod.employee_id
WHERE eod.required = TRUE
GROUP BY e.id, e.employee_id, e.first_name, e.last_name;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT 'Digital Contract Management System tables created successfully!' as Status;
SELECT COUNT(*) as 'Template Count' FROM contract_templates;

