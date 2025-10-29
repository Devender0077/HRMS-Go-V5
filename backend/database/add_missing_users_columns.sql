-- ============================================================================
-- HRMS Go V5 - Add Missing Columns to Users Table
-- ============================================================================
-- This migration adds phone, avatar, and email_verified_at columns to users table
-- SAFE TO RUN MULTIPLE TIMES (checks if columns exist)
-- ============================================================================

USE hrms_go_v5;

-- Add phone column (if not exists)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'phone';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN phone VARCHAR(50) DEFAULT NULL AFTER name',
    'SELECT "Column phone already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add avatar column (if not exists)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'avatar';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN avatar VARCHAR(255) DEFAULT NULL AFTER phone',
    'SELECT "Column avatar already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add email_verified_at column (if not exists)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'email_verified_at';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMP NULL DEFAULT NULL AFTER last_login',
    'SELECT "Column email_verified_at already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify columns were added
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME IN ('phone', 'avatar', 'email_verified_at', 'last_login')
ORDER BY ORDINAL_POSITION;

SELECT '✅ Migration completed! Users table now has all required columns.' AS status;

-- ============================================================================
-- Summary:
-- - Added phone VARCHAR(50)
-- - Added avatar VARCHAR(255)
-- - Added email_verified_at TIMESTAMP
-- - Safe to run multiple times (idempotent)
-- ============================================================================

