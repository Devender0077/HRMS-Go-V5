-- Fix calendar events to have creator information
-- This assigns all existing events to Superadmin (user_id = 1)
-- After running this, user badges will appear in the calendar

UPDATE calendar_events 
SET created_by = 1 
WHERE created_by IS NULL OR created_by = 0;

-- Verify the update
SELECT id, title, created_by, created_at 
FROM calendar_events 
ORDER BY created_at DESC 
LIMIT 10;

