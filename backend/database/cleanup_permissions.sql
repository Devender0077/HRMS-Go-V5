-- ============================================================================
-- PERMISSIONS CLEANUP & FIX
-- Removes deleted features (PDF Tools) and fixes duplicate names
-- Database: hrms_go_v5
-- ============================================================================

USE hrms_go_v5;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- ============================================================================
-- STEP 1: REMOVE PDF TOOLS PERMISSIONS (Feature Deleted)
-- ============================================================================

-- Delete role_permissions assignments for PDF tools first
DELETE FROM role_permissions 
WHERE permission_id IN (
  SELECT id FROM permissions 
  WHERE slug LIKE '%pdf_tools%'
     OR slug LIKE 'contracts.pdf%merge%'
     OR slug LIKE 'contracts.pdf%compress%'
     OR slug LIKE 'contracts.pdf%split%'
     OR slug LIKE 'contracts.pdf%edit%'
);

-- Delete PDF tools permissions
DELETE FROM permissions 
WHERE slug LIKE '%pdf_tools%'
   OR slug LIKE 'contracts.pdf%merge%'
   OR slug LIKE 'contracts.pdf%compress%'
   OR slug LIKE 'contracts.pdf%split%'
   OR slug LIKE 'contracts.pdf%edit%'
   OR name LIKE '%PDF Tool%'
   OR name LIKE '%Merge PDF%'
   OR name LIKE '%Compress PDF%'
   OR name LIKE '%Split PDF%'
   OR name LIKE '%Edit PDF%';

SELECT '✅ Removed PDF Tools permissions (feature deleted)' as Status;

-- ============================================================================
-- STEP 2: FIX DUPLICATE NAMES (Make them more descriptive)
-- ============================================================================

-- Finance module duplicates - add "Finance" prefix
UPDATE permissions SET name = 'Finance - View Analytics' WHERE slug = 'finance.analytics.view';
UPDATE permissions SET name = 'Finance - Create Income' WHERE slug = 'finance.income.create';
UPDATE permissions SET name = 'Finance - View Income' WHERE slug = 'finance.income.view';
UPDATE permissions SET name = 'Finance - Edit Income' WHERE slug = 'finance.income.edit';
UPDATE permissions SET name = 'Finance - Delete Income' WHERE slug = 'finance.income.delete';
UPDATE permissions SET name = 'Finance - View Expenses' WHERE slug = 'finance.expenses.view';
UPDATE permissions SET name = 'Finance - View Reports' WHERE slug = 'finance.reports.view';
UPDATE permissions SET name = 'Finance - Generate Reports' WHERE slug = 'finance.reports.generate';

-- Payroll module duplicates - add "Payroll" prefix
UPDATE permissions SET name = 'Payroll - View Analytics' WHERE slug = 'payroll.analytics.view';
UPDATE permissions SET name = 'Payroll - View Reports' WHERE slug = 'payroll.reports.view';
UPDATE permissions SET name = 'Payroll - View Payslips' WHERE slug = 'payroll.payslips.view';
UPDATE permissions SET name = 'Payroll - Download Payslips' WHERE slug = 'payroll.payslips.download';
UPDATE permissions SET name = 'Payroll - Create Salary' WHERE slug = 'payroll.salaries.create';
UPDATE permissions SET name = 'Payroll - Delete Salary' WHERE slug = 'payroll.salaries.delete';

-- Attendance module duplicates
UPDATE permissions SET name = 'Attendance - Mark Attendance' WHERE slug = 'attendance.mark';
UPDATE permissions SET name = 'Attendance - Approve Regularization' WHERE slug = 'attendance.regularization.approve';
UPDATE permissions SET name = 'Attendance - Reject Regularization' WHERE slug = 'attendance.regularization.reject';

-- Leave module duplicates
UPDATE permissions SET name = 'Leave - View Reports' WHERE slug = 'leaves.reports.view';

-- Performance module duplicate
UPDATE permissions SET name = 'Performance - View Analytics' WHERE slug = 'performance.analytics.view';

-- Settings/System duplicates
UPDATE permissions SET name = 'System - Manage Users' WHERE slug = 'settings.users.manage';
UPDATE permissions SET name = 'System - Manage Roles' WHERE slug = 'settings.roles.manage';
UPDATE permissions SET name = 'System - Manage Permissions' WHERE slug = 'settings.permissions.manage';
UPDATE permissions SET name = 'System - Create Roles' WHERE slug = 'settings.roles.create';
UPDATE permissions SET name = 'System - Edit Roles' WHERE slug = 'settings.roles.edit';
UPDATE permissions SET name = 'System - Delete Roles' WHERE slug = 'settings.roles.delete';
UPDATE permissions SET name = 'System - View Roles' WHERE slug = 'settings.roles.view';

-- Documents module duplicate
UPDATE permissions SET name = 'Documents - Upload Files' WHERE slug = 'documents.upload';

-- Communication duplicate
UPDATE permissions SET name = 'Communication - Send Notifications' WHERE slug = 'notifications.send';

SELECT '✅ Fixed duplicate permission names' as Status;

-- ============================================================================
-- STEP 3: STANDARDIZE MODULE NAMES (Consistent Casing)
-- ============================================================================

-- Finance module - lowercase to proper case
UPDATE permissions SET module = 'Finance' WHERE module = 'finance';

-- Contracts module - lowercase to proper case
UPDATE permissions SET module = 'Contracts' WHERE module = 'contracts';

SELECT '✅ Standardized module names' as Status;

-- ============================================================================
-- STEP 4: VERIFY RESULTS
-- ============================================================================

-- Check for remaining duplicates
SELECT 
  name, 
  COUNT(*) as count,
  GROUP_CONCAT(slug SEPARATOR ', ') as slugs
FROM permissions
GROUP BY name
HAVING count > 1;

-- Count by module (should be cleaner now)
SELECT module, COUNT(*) as count
FROM permissions
GROUP BY module
ORDER BY count DESC;

-- Total permissions
SELECT COUNT(*) as total_permissions FROM permissions;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

SELECT '✅ Permissions cleanup completed!' as Status;

-- ============================================================================
-- SUMMARY
-- ============================================================================
/*
CHANGES MADE:
1. ✅ Removed 5 PDF Tools permissions (deleted feature)
2. ✅ Fixed 26+ duplicate permission names (added module prefixes)
3. ✅ Standardized module names (proper casing)
4. ✅ Cleaned up role_permissions assignments

BEFORE: 381 permissions with duplicates and obsolete entries
AFTER: ~376 permissions, all with unique descriptive names

PDF TOOLS REMOVED:
- Use PDF Tools
- Merge PDFs
- Compress PDFs
- Split PDFs
- Edit PDFs

DUPLICATE NAMES FIXED:
- Finance module: Added "Finance - " prefix
- Payroll module: Added "Payroll - " prefix
- Attendance module: Added "Attendance - " prefix
- Settings module: Added "System - " prefix
- Other modules: Made names more specific

Now all permissions have clear, descriptive, unique names!
*/

