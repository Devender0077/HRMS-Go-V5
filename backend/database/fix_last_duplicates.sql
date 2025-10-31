USE hrms_go_v5;

-- Fix the last 2 remaining duplicates

-- Leave Reports: Keep leaves.view_reports, delete reports.leaves
DELETE rp FROM role_permissions rp 
WHERE rp.permission_id = (SELECT id FROM permissions WHERE slug = 'reports.leaves' LIMIT 1);

DELETE FROM permissions WHERE slug = 'reports.leaves';

-- Payroll Reports: Keep payroll.view_reports (already renamed to "Payroll - View Reports"), delete reports.payroll
DELETE rp FROM role_permissions rp 
WHERE rp.permission_id = (SELECT id FROM permissions WHERE slug = 'reports.payroll' LIMIT 1);

DELETE FROM permissions WHERE slug = 'reports.payroll';

-- Verify
SELECT COUNT(*) as total_permissions FROM permissions;

SELECT name, COUNT(*) as count, GROUP_CONCAT(slug) as slugs
FROM permissions
GROUP BY name
HAVING count > 1;

SELECT 'All duplicates removed!' as status;

