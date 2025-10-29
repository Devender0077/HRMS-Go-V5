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
-- USA Holidays 2025
(1, 'New Year\'s Day', '2025-01-01', 'public', 'usa', 'active', 'New Year celebration', NOW(), NOW()),
(2, 'Martin Luther King Jr. Day', '2025-01-20', 'public', 'usa', 'active', 'Honoring civil rights leader', NOW(), NOW()),
(3, 'Presidents\' Day', '2025-02-17', 'public', 'usa', 'active', 'Honoring US presidents', NOW(), NOW()),
(4, 'Memorial Day', '2025-05-26', 'public', 'usa', 'active', 'Honoring military personnel', NOW(), NOW()),
(5, 'Independence Day', '2025-07-04', 'public', 'usa', 'active', 'US Independence Day', NOW(), NOW()),
(6, 'Labor Day', '2025-09-01', 'public', 'usa', 'active', 'Honoring labor movement', NOW(), NOW()),
(7, 'Thanksgiving Day', '2025-11-27', 'public', 'usa', 'active', 'Thanksgiving celebration', NOW(), NOW()),
(8, 'Christmas Day', '2025-12-25', 'public', 'usa', 'active', 'Christmas celebration', NOW(), NOW()),
(9, 'Veterans Day', '2025-11-11', 'public', 'usa', 'active', 'Honoring military veterans', NOW(), NOW()),
(10, 'Columbus Day', '2025-10-13', 'public', 'usa', 'active', 'Commemorating Columbus', NOW(), NOW()),

-- India Holidays 2025
(11, 'Republic Day', '2025-01-26', 'public', 'india', 'active', 'India\'s Republic Day', NOW(), NOW()),
(12, 'Holi', '2025-03-14', 'public', 'india', 'active', 'Festival of Colors', NOW(), NOW()),
(13, 'Good Friday', '2025-04-18', 'public', 'india', 'active', 'Christian holiday', NOW(), NOW()),
(14, 'Independence Day', '2025-08-15', 'public', 'india', 'active', 'India\'s Independence Day', NOW(), NOW()),
(15, 'Gandhi Jayanti', '2025-10-02', 'public', 'india', 'active', 'Mahatma Gandhi\'s Birthday', NOW(), NOW()),
(16, 'Diwali', '2025-10-20', 'public', 'india', 'active', 'Festival of Lights', NOW(), NOW()),
(17, 'Christmas Day', '2025-12-25', 'public', 'india', 'active', 'Christmas celebration', NOW(), NOW()),
(18, 'Eid al-Fitr', '2025-03-31', 'public', 'india', 'active', 'Islamic festival', NOW(), NOW()),
(19, 'Dussehra', '2025-10-02', 'public', 'india', 'active', 'Hindu festival', NOW(), NOW()),
(20, 'Guru Nanak Jayanti', '2025-11-05', 'public', 'india', 'active', 'Sikh festival', NOW(), NOW()),

-- Global/Company-wide Holidays
(21, 'New Year\'s Eve', '2025-12-31', 'optional', 'global', 'active', 'End of year celebration', NOW(), NOW()),
(22, 'International Women\'s Day', '2025-03-08', 'optional', 'global', 'active', 'Celebrating women', NOW(), NOW()),
(23, 'Earth Day', '2025-04-22', 'optional', 'global', 'active', 'Environmental awareness', NOW(), NOW()),
(24, 'Company Foundation Day', '2025-06-15', 'company', 'global', 'active', 'Company anniversary', NOW(), NOW()),
(25, 'Team Building Day', '2025-09-15', 'company', 'global', 'active', 'Company team building event', NOW(), NOW());

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

