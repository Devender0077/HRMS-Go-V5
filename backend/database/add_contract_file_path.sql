-- ============================================================================
-- ADD: file_path column to contracts table
-- ============================================================================
-- This allows storing contract document uploads

-- Check if column exists first
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE table_schema = DATABASE() 
  AND table_name = 'contracts' 
  AND column_name = 'file_path';

-- Add column if it doesn't exist
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE contracts ADD COLUMN file_path VARCHAR(255) NULL AFTER signed_date',
  'SELECT ''Column file_path already exists'' AS message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT '✅ file_path column is ready in contracts table' AS status;

