-- Add missing permissions quickly
USE hrms_go_v5;

-- Check current count
SELECT COUNT(*) as Current_Permissions FROM permissions;

-- The database already has 381 permissions!
-- Let's just verify they're assigned to all roles properly

-- Get role IDs
SET @superadmin_id = (SELECT id FROM user_roles WHERE slug = 'superadmin' LIMIT 1);
SET @admin_id = (SELECT id FROM user_roles WHERE slug = 'admin' LIMIT 1);

-- Ensure Super Admin and Admin have ALL permissions
INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
SELECT @superadmin_id, id, NOW()
FROM permissions;

INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
SELECT @admin_id, id, NOW()
FROM permissions;

-- Show final counts
SELECT 
  'PERMISSIONS UPDATE COMPLETE!' as Status,
  (SELECT COUNT(*) FROM permissions) as Total_Permissions,
  (SELECT COUNT(*) FROM role_permissions WHERE role_id = @superadmin_id) as SuperAdmin_Permissions,
  (SELECT COUNT(*) FROM role_permissions WHERE role_id = @admin_id) as Admin_Permissions;

-- Show permissions by module
SELECT 
  module as Module,
  COUNT(*) as Permission_Count
FROM permissions
GROUP BY module
ORDER BY Permission_Count DESC;
