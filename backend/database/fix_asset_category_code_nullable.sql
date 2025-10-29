-- ============================================================================
-- FIX: Make asset_categories.code column NULLABLE
-- ============================================================================
-- This allows categories to be created without a code
-- Code is now optional, only name is required

ALTER TABLE asset_categories 
MODIFY COLUMN code VARCHAR(50) NULL;

-- Note: The UNIQUE constraint remains, but NULL values are allowed
-- Multiple NULL values are permitted in a UNIQUE column in MySQL

SELECT '✅ asset_categories.code is now NULLABLE' AS status;

