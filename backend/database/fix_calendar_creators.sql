-- ============================================================================
-- Fix Calendar Events - Add Creator Information
-- ============================================================================
-- This script updates existing calendar events to have creator information
-- ============================================================================

USE hrms_go_v5;

-- Update all calendar events without creator to have creator = superadmin (ID 1)
UPDATE calendar_events 
SET created_by = 1 
WHERE created_by IS NULL OR created_by = 0;

-- Verify the update
SELECT 
    id, 
    title, 
    created_by,
    (SELECT name FROM users WHERE id = calendar_events.created_by) AS creator_name,
    visibility,
    DATE_FORMAT(start, '%Y-%m-%d %H:%i') AS event_start
FROM calendar_events 
ORDER BY id;

SELECT '✅ Calendar events updated with creator information!' AS Status;

