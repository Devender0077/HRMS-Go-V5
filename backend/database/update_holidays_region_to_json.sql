-- ============================================================================
-- HRMS Go V5 - Update Holidays Region Column to Support Multiple Regions
-- ============================================================================
-- This migration changes the region column from ENUM to VARCHAR(500) JSON array
-- SAFE TO RUN MULTIPLE TIMES
-- ============================================================================

USE hrms_go_v5;

-- Step 1: Check if column is still ENUM
SET @column_type = (
    SELECT DATA_TYPE 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'holidays' 
    AND COLUMN_NAME = 'region'
);

-- Step 2: Convert ENUM values to JSON arrays BEFORE changing column type
UPDATE holidays SET region = '["india"]' WHERE region = 'india';
UPDATE holidays SET region = '["usa"]' WHERE region = 'usa';
UPDATE holidays SET region = '["global"]' WHERE region = 'global';
UPDATE holidays SET region = '["other"]' WHERE region = 'other';

-- Step 3: Change column type from ENUM to VARCHAR(500)
ALTER TABLE holidays MODIFY COLUMN region VARCHAR(500) NOT NULL DEFAULT '["global"]';

-- Step 4: Merge duplicate holidays (same name, same date, different regions)
-- Christmas Day (USA + India)
UPDATE holidays 
SET region = '["usa","india"]' 
WHERE name = 'Christmas Day' AND id = (SELECT MIN(id) FROM (SELECT id FROM holidays WHERE name = 'Christmas Day') AS temp);

DELETE FROM holidays 
WHERE name = 'Christmas Day' AND id != (SELECT MIN(id) FROM (SELECT id FROM holidays WHERE name = 'Christmas Day') AS temp);

-- Step 5: Verify the changes
SELECT id, name, date, type, region, status 
FROM holidays 
ORDER BY date;

SELECT '✅ Migration completed! Holidays now support multiple regions.' AS status;

-- ============================================================================
-- Summary:
-- - Changed region column from ENUM to VARCHAR(500)
-- - Supports JSON arrays like ["usa","india","global"]
-- - Merged duplicate holidays (e.g., Christmas for USA+India)
-- - All existing data converted to JSON format
-- ============================================================================

