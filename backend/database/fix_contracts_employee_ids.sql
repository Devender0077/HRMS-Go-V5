-- ============================================================================
-- FIX: Update contracts table with valid employee IDs
-- ============================================================================
-- This fixes the "undefined undefined" employee names issue
-- by linking contracts to actual employees in the database

-- First, let's see what we have
SELECT 
  c.id,
  c.employee_id,
  c.contract_type,
  c.start_date,
  e.id AS actual_employee_id,
  e.first_name,
  e.last_name
FROM contracts c
LEFT JOIN employees e ON c.employee_id = e.id
LIMIT 10;

-- Update contracts to use valid employee IDs
-- This assumes you have at least 7 employees in your database
-- Adjust the employee IDs based on what you see in your employees table

UPDATE contracts SET employee_id = 1 WHERE id = 1;
UPDATE contracts SET employee_id = 2 WHERE id = 2;
UPDATE contracts SET employee_id = 3 WHERE id = 3;
UPDATE contracts SET employee_id = 4 WHERE id = 4;

-- Verify the fix
SELECT 
  c.id,
  c.employee_id,
  c.contract_type,
  CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
  e.employee_id AS employee_code
FROM contracts c
LEFT JOIN employees e ON c.employee_id = e.id
LIMIT 10;

SELECT '✅ Contracts employee IDs updated!' AS status;

-- ============================================================================
-- ALTERNATIVE: If you want to auto-assign employees sequentially
-- ============================================================================
/*
SET @row_number = 0;
UPDATE contracts 
SET employee_id = (
  SELECT id FROM employees 
  WHERE id = (SELECT MIN(id) + (@row_number := @row_number + 1) FROM employees)
  LIMIT 1
);
*/

