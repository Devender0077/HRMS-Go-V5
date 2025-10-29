-- Add region-specific fields to employees table for USA and India

-- Add region field
ALTER TABLE employees ADD COLUMN region ENUM('india', 'usa', 'other') DEFAULT 'india' AFTER emergency_contact_relation;

-- USA-specific fields
ALTER TABLE employees ADD COLUMN ssn VARCHAR(20) NULL COMMENT 'Social Security Number (USA)' AFTER region;
ALTER TABLE employees ADD COLUMN driver_license_number VARCHAR(50) NULL COMMENT 'Driver License Number (USA)' AFTER ssn;
ALTER TABLE employees ADD COLUMN driver_license_state VARCHAR(50) NULL COMMENT 'Driver License State (USA)' AFTER driver_license_number;
ALTER TABLE employees ADD COLUMN driver_license_expiry DATE NULL COMMENT 'Driver License Expiry Date (USA)' AFTER driver_license_state;
ALTER TABLE employees ADD COLUMN w4_form_status ENUM('pending', 'submitted', 'approved') NULL COMMENT 'W-4 Tax Form Status (USA)' AFTER driver_license_expiry;

-- India-specific fields
ALTER TABLE employees ADD COLUMN pan_number VARCHAR(20) NULL COMMENT 'PAN Number (India)' AFTER w4_form_status;
ALTER TABLE employees ADD COLUMN aadhaar_number VARCHAR(20) NULL COMMENT 'Aadhaar Number (India)' AFTER pan_number;
ALTER TABLE employees ADD COLUMN pf_number VARCHAR(50) NULL COMMENT 'Provident Fund Number (India)' AFTER aadhaar_number;
ALTER TABLE employees ADD COLUMN esi_number VARCHAR(50) NULL COMMENT 'ESI Number (India)' AFTER pf_number;
ALTER TABLE employees ADD COLUMN uan_number VARCHAR(50) NULL COMMENT 'Universal Account Number (India)' AFTER esi_number;

-- Add indexes for faster searches
CREATE INDEX idx_employees_region ON employees(region);
CREATE INDEX idx_employees_ssn ON employees(ssn);
CREATE INDEX idx_employees_pan ON employees(pan_number);
CREATE INDEX idx_employees_aadhaar ON employees(aadhaar_number);

