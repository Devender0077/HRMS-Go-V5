-- Add region-specific fields to employees table for USA and India
-- SAFE TO RUN MULTIPLE TIMES - Checks if columns exist before adding

-- Add region field (only if it doesn't exist)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'employees' 
AND COLUMN_NAME = 'region';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE employees ADD COLUMN region ENUM(''india'', ''usa'', ''other'') DEFAULT ''india'' AFTER emergency_contact_relation',
    'SELECT "Column region already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- USA-specific fields
-- SSN
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'ssn';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE employees ADD COLUMN ssn VARCHAR(20) NULL COMMENT ''Social Security Number (USA)'' AFTER region', 'SELECT "Column ssn already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Driver License Number
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'driver_license_number';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE employees ADD COLUMN driver_license_number VARCHAR(50) NULL COMMENT ''Driver License Number (USA)'' AFTER ssn', 'SELECT "Column driver_license_number already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Driver License State
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'driver_license_state';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE employees ADD COLUMN driver_license_state VARCHAR(50) NULL COMMENT ''Driver License State (USA)'' AFTER driver_license_number', 'SELECT "Column driver_license_state already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Driver License Expiry
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'driver_license_expiry';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE employees ADD COLUMN driver_license_expiry DATE NULL COMMENT ''Driver License Expiry Date (USA)'' AFTER driver_license_state', 'SELECT "Column driver_license_expiry already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- W4 Form Status
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'w4_form_status';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE employees ADD COLUMN w4_form_status ENUM(''pending'', ''submitted'', ''approved'') NULL COMMENT ''W-4 Tax Form Status (USA)'' AFTER driver_license_expiry', 'SELECT "Column w4_form_status already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- India-specific fields
-- PAN Number
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'pan_number';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE employees ADD COLUMN pan_number VARCHAR(20) NULL COMMENT ''PAN Number (India)'' AFTER w4_form_status', 'SELECT "Column pan_number already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Aadhaar Number
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'aadhaar_number';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE employees ADD COLUMN aadhaar_number VARCHAR(20) NULL COMMENT ''Aadhaar Number (India)'' AFTER pan_number', 'SELECT "Column aadhaar_number already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- PF Number
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'pf_number';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE employees ADD COLUMN pf_number VARCHAR(50) NULL COMMENT ''Provident Fund Number (India)'' AFTER aadhaar_number', 'SELECT "Column pf_number already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ESI Number
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'esi_number';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE employees ADD COLUMN esi_number VARCHAR(50) NULL COMMENT ''ESI Number (India)'' AFTER pf_number', 'SELECT "Column esi_number already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- UAN Number
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'uan_number';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE employees ADD COLUMN uan_number VARCHAR(50) NULL COMMENT ''Universal Account Number (India)'' AFTER esi_number', 'SELECT "Column uan_number already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add indexes for faster searches (only if they don't exist)
SET @index_exists = 0;
SELECT COUNT(*) INTO @index_exists FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND INDEX_NAME = 'idx_employees_region';
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_employees_region ON employees(region)', 'SELECT "Index idx_employees_region already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @index_exists = 0;
SELECT COUNT(*) INTO @index_exists FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND INDEX_NAME = 'idx_employees_ssn';
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_employees_ssn ON employees(ssn)', 'SELECT "Index idx_employees_ssn already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @index_exists = 0;
SELECT COUNT(*) INTO @index_exists FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND INDEX_NAME = 'idx_employees_pan';
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_employees_pan ON employees(pan_number)', 'SELECT "Index idx_employees_pan already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @index_exists = 0;
SELECT COUNT(*) INTO @index_exists FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND INDEX_NAME = 'idx_employees_aadhaar';
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_employees_aadhaar ON employees(aadhaar_number)', 'SELECT "Index idx_employees_aadhaar already exists" AS message');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT '✅ Migration completed successfully! All region-specific fields are now available.' AS status;

