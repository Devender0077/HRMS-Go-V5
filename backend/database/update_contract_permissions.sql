-- ============================================================================
-- CONTRACT MANAGEMENT PERMISSIONS UPDATE
-- Comprehensive RBAC permissions for all contract pages
-- ============================================================================

USE hrms;

-- Add new permissions for contract management
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
-- Templates Management
('View Contract Templates', 'contracts.templates.view', 'View contract templates list', 'Contracts', NOW(), NOW()),
('Create Contract Template', 'contracts.templates.create', 'Upload new contract templates', 'Contracts', NOW(), NOW()),
('Edit Contract Template', 'contracts.templates.edit', 'Edit template fields and settings', 'Contracts', NOW(), NOW()),
('Delete Contract Template', 'contracts.templates.delete', 'Delete contract templates', 'Contracts', NOW(), NOW()),
('Activate/Deactivate Template', 'contracts.templates.activate', 'Activate or deactivate templates', 'Contracts', NOW(), NOW()),

-- Agreements Management (sent contracts)
('View Agreements', 'contracts.agreements.view', 'View sent contract agreements', 'Contracts', NOW(), NOW()),
('Send Agreements', 'contracts.agreements.send', 'Send contracts for e-signature', 'Contracts', NOW(), NOW()),
('Cancel Agreements', 'contracts.agreements.cancel', 'Cancel sent agreements', 'Contracts', NOW(), NOW()),
('View All Agreements', 'contracts.agreements.view_all', 'View all company agreements', 'Contracts', NOW(), NOW()),

-- E-Signature
('Sign Contracts', 'contracts.sign', 'Sign contracts with e-signature', 'Contracts', NOW(), NOW()),
('View Signing Status', 'contracts.signing.view_status', 'View contract signing status', 'Contracts', NOW(), NOW()),

-- PDF Tools
('Use PDF Tools', 'contracts.pdf_tools.use', 'Access PDF manipulation tools', 'Contracts', NOW(), NOW()),
('Merge PDFs', 'contracts.pdf_tools.merge', 'Merge multiple PDF files', 'Contracts', NOW(), NOW()),
('Compress PDFs', 'contracts.pdf_tools.compress', 'Compress PDF file size', 'Contracts', NOW(), NOW()),

-- Onboarding
('View Onboarding', 'contracts.onboarding.view', 'View employee onboarding documents', 'Contracts', NOW(), NOW()),
('Manage Onboarding', 'contracts.onboarding.manage', 'Manage employee onboarding process', 'Contracts', NOW(), NOW())

ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  updated_at = NOW();

-- ============================================================================
-- ASSIGN PERMISSIONS TO ROLES
-- ============================================================================

-- Get role IDs
SET @superadmin_id = (SELECT id FROM user_roles WHERE slug = 'superadmin' LIMIT 1);
SET @admin_id = (SELECT id FROM user_roles WHERE slug = 'admin' LIMIT 1);
SET @hr_manager_id = (SELECT id FROM user_roles WHERE slug = 'hr_manager' LIMIT 1);
SET @hr_id = (SELECT id FROM user_roles WHERE slug = 'hr' LIMIT 1);
SET @manager_id = (SELECT id FROM user_roles WHERE slug = 'manager' LIMIT 1);
SET @employee_id = (SELECT id FROM user_roles WHERE slug = 'employee' LIMIT 1);
SET @accountant_id = (SELECT id FROM user_roles WHERE slug = 'accountant' LIMIT 1);

-- ============================================================================
-- SUPER ADMIN: ALL CONTRACT PERMISSIONS
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @superadmin_id, id, NOW()
FROM permissions
WHERE module = 'Contracts'
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- ADMIN: ALL CONTRACT PERMISSIONS
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @admin_id, id, NOW()
FROM permissions
WHERE module = 'Contracts'
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- HR MANAGER: FULL CONTRACT MANAGEMENT
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @hr_manager_id, id, NOW()
FROM permissions
WHERE slug IN (
  'contracts.templates.view',
  'contracts.templates.create',
  'contracts.templates.edit',
  'contracts.templates.delete',
  'contracts.templates.activate',
  'contracts.agreements.view',
  'contracts.agreements.send',
  'contracts.agreements.cancel',
  'contracts.agreements.view_all',
  'contracts.signing.view_status',
  'contracts.pdf_tools.use',
  'contracts.pdf_tools.merge',
  'contracts.pdf_tools.compress',
  'contracts.onboarding.view',
  'contracts.onboarding.manage'
)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- HR: CONTRACT MANAGEMENT (NO DELETE)
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @hr_id, id, NOW()
FROM permissions
WHERE slug IN (
  'contracts.templates.view',
  'contracts.templates.create',
  'contracts.templates.edit',
  'contracts.agreements.view',
  'contracts.agreements.send',
  'contracts.agreements.view_all',
  'contracts.signing.view_status',
  'contracts.pdf_tools.use',
  'contracts.pdf_tools.merge',
  'contracts.pdf_tools.compress',
  'contracts.onboarding.view',
  'contracts.onboarding.manage'
)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- MANAGER: VIEW & SEND CONTRACTS FOR TEAM
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @manager_id, id, NOW()
FROM permissions
WHERE slug IN (
  'contracts.templates.view',
  'contracts.agreements.view',
  'contracts.agreements.send',
  'contracts.signing.view_status',
  'contracts.pdf_tools.use',
  'contracts.onboarding.view'
)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- EMPLOYEE: SIGN CONTRACTS & VIEW OWN
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @employee_id, id, NOW()
FROM permissions
WHERE slug IN (
  'contracts.agreements.view',
  'contracts.sign',
  'contracts.onboarding.view'
)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- ACCOUNTANT: VIEW CONTRACTS ONLY
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @accountant_id, id, NOW()
FROM permissions
WHERE slug IN (
  'contracts.templates.view',
  'contracts.agreements.view',
  'contracts.agreements.view_all',
  'contracts.signing.view_status'
)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT 
  'Contract Permissions Update Complete!' as Status,
  (SELECT COUNT(*) FROM permissions WHERE module = 'Contracts') as Total_Permissions,
  (SELECT COUNT(DISTINCT role_id) FROM role_permissions 
   JOIN permissions ON role_permissions.permission_id = permissions.id 
   WHERE permissions.module = 'Contracts') as Roles_With_Permissions;

-- Show permissions by role
SELECT 
  ur.name as Role,
  COUNT(rp.id) as Contract_Permissions
FROM user_roles ur
LEFT JOIN role_permissions rp ON ur.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id AND p.module = 'Contracts'
WHERE ur.slug IN ('superadmin', 'admin', 'hr_manager', 'hr', 'manager', 'employee', 'accountant')
GROUP BY ur.id, ur.name
ORDER BY COUNT(rp.id) DESC;

