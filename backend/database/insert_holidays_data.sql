-- ============================================================================
-- HRMS Go V5 - Insert Holiday Sample Data
-- ============================================================================
-- Run this to populate the holidays table with 25 sample holidays
-- Safe to run multiple times (uses INSERT IGNORE)
-- ============================================================================

USE hrms_go_v5;

-- Clear existing holidays (optional - comment out if you want to keep existing data)
-- DELETE FROM holidays;

-- Insert holidays with INSERT IGNORE to prevent duplicates
INSERT IGNORE INTO `holidays` (id, name, date, type, region, status, description, created_at, updated_at) VALUES
-- USA-only Holidays 2025
(1, 'New Year\'s Day', '2025-01-01', 'public', '["usa","india","global"]', 'active', 'New Year celebration - observed globally', NOW(), NOW()),
(2, 'Martin Luther King Jr. Day', '2025-01-20', 'public', '["usa"]', 'active', 'Honoring civil rights leader', NOW(), NOW()),
(3, 'Presidents\' Day', '2025-02-17', 'public', '["usa"]', 'active', 'Honoring US presidents', NOW(), NOW()),
(4, 'Memorial Day', '2025-05-26', 'public', '["usa"]', 'active', 'Honoring military personnel', NOW(), NOW()),
(5, 'Independence Day (USA)', '2025-07-04', 'public', '["usa"]', 'active', 'US Independence Day', NOW(), NOW()),
(6, 'Labor Day', '2025-09-01', 'public', '["usa"]', 'active', 'Honoring labor movement', NOW(), NOW()),
(7, 'Thanksgiving Day', '2025-11-27', 'public', '["usa"]', 'active', 'Thanksgiving celebration', NOW(), NOW()),
(8, 'Veterans Day', '2025-11-11', 'public', '["usa"]', 'active', 'Honoring military veterans', NOW(), NOW()),
(9, 'Columbus Day', '2025-10-13', 'public', '["usa"]', 'active', 'Commemorating Columbus', NOW(), NOW()),

-- India-only Holidays 2025
(10, 'Republic Day', '2025-01-26', 'public', '["india"]', 'active', 'India\'s Republic Day', NOW(), NOW()),
(11, 'Holi', '2025-03-14', 'public', '["india"]', 'active', 'Festival of Colors', NOW(), NOW()),
(12, 'Independence Day (India)', '2025-08-15', 'public', '["india"]', 'active', 'India\'s Independence Day', NOW(), NOW()),
(13, 'Gandhi Jayanti', '2025-10-02', 'public', '["india"]', 'active', 'Mahatma Gandhi\'s Birthday', NOW(), NOW()),
(14, 'Diwali', '2025-10-20', 'public', '["india"]', 'active', 'Festival of Lights', NOW(), NOW()),
(15, 'Eid al-Fitr', '2025-03-31', 'public', '["india"]', 'active', 'Islamic festival', NOW(), NOW()),
(16, 'Dussehra', '2025-10-02', 'public', '["india"]', 'active', 'Hindu festival', NOW(), NOW()),
(17, 'Guru Nanak Jayanti', '2025-11-05', 'public', '["india"]', 'active', 'Sikh festival', NOW(), NOW()),

-- Multi-region Holidays (observed in both countries)
(18, 'Good Friday', '2025-04-18', 'public', '["usa","india"]', 'active', 'Christian holiday observed in both regions', NOW(), NOW()),
(19, 'Christmas Day', '2025-12-25', 'public', '["usa","india","global"]', 'active', 'Christmas celebration - observed globally', NOW(), NOW()),

-- Global/Company-wide Holidays
(20, 'New Year\'s Eve', '2025-12-31', 'optional', '["global"]', 'active', 'End of year celebration', NOW(), NOW()),
(21, 'International Women\'s Day', '2025-03-08', 'optional', '["global"]', 'active', 'Celebrating women', NOW(), NOW()),
(22, 'Earth Day', '2025-04-22', 'optional', '["global"]', 'active', 'Environmental awareness', NOW(), NOW()),
(23, 'Company Foundation Day', '2025-06-15', 'company', '["global"]', 'active', 'Company anniversary', NOW(), NOW()),
(24, 'Team Building Day', '2025-09-15', 'company', '["global"]', 'active', 'Company team building event', NOW(), NOW());

-- Verify the insert
SELECT COUNT(*) as total_holidays FROM holidays;
SELECT * FROM holidays ORDER BY date;

-- ============================================================================
-- Summary:
-- - 10 USA holidays
-- - 10 India holidays  
-- - 5 Global/Company holidays
-- - Total: 25 holidays for 2025
-- ============================================================================

