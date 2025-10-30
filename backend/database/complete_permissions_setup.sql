-- ============================================================================
-- COMPLETE HRMS PERMISSIONS SETUP
-- Comprehensive RBAC permissions for ALL modules and pages
-- Database: hrms_go_v5
-- ============================================================================

USE hrms_go_v5;

-- ============================================================================
-- 1. DASHBOARD & GENERAL
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Dashboard', 'dashboard.view', 'Access dashboard and general features', 'Dashboard', NOW(), NOW()),
('View Calendar', 'calendar.view', 'View company calendar', 'Dashboard', NOW(), NOW()),
('Edit Calendar', 'calendar.edit', 'Create and edit calendar events', 'Dashboard', NOW(), NOW()),
('Delete Calendar Events', 'calendar.delete', 'Delete calendar events', 'Dashboard', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 2. EMPLOYEES MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Employees', 'employees.view', 'View employee list and details', 'Employees', NOW(), NOW()),
('Create Employees', 'employees.create', 'Add new employees', 'Employees', NOW(), NOW()),
('Edit Employees', 'employees.edit', 'Edit employee information', 'Employees', NOW(), NOW()),
('Delete Employees', 'employees.delete', 'Delete employees', 'Employees', NOW(), NOW()),
('View Organization Chart', 'employees.view_org_chart', 'View organizational hierarchy', 'Employees', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 3. ATTENDANCE MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('Clock In/Out', 'attendance.clock', 'Clock in and out for attendance', 'Attendance', NOW(), NOW()),
('View Own Attendance', 'attendance.view_own', 'View own attendance records', 'Attendance', NOW(), NOW()),
('View All Attendance', 'attendance.view_all', 'View all employee attendance records', 'Attendance', NOW(), NOW()),
('Manage Attendance', 'attendance.manage', 'Edit and manage attendance records', 'Attendance', NOW(), NOW()),
('Export Attendance', 'attendance.export', 'Export attendance reports', 'Attendance', NOW(), NOW()),
('Approve Regularization', 'attendance.approve_regularization', 'Approve attendance regularization requests', 'Attendance', NOW(), NOW()),
('Request Regularization', 'attendance.request_regularization', 'Request attendance regularization', 'Attendance', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 4. LEAVES MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Own Leaves', 'leaves.view_own', 'View own leave applications', 'Leaves', NOW(), NOW()),
('View All Leaves', 'leaves.view_all', 'View all employee leave applications', 'Leaves', NOW(), NOW()),
('Apply Leave', 'leaves.apply', 'Submit leave applications', 'Leaves', NOW(), NOW()),
('Approve Leave', 'leaves.approve', 'Approve or reject leave applications', 'Leaves', NOW(), NOW()),
('Cancel Leave', 'leaves.cancel', 'Cancel leave applications', 'Leaves', NOW(), NOW()),
('Manage Leave Types', 'leaves.manage_types', 'Create and configure leave types', 'Leaves', NOW(), NOW()),
('Allocate Leave Balance', 'leaves.allocate_balance', 'Allocate leave balance to employees', 'Leaves', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 5. PAYROLL MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Own Payroll', 'payroll.view_own', 'View own salary and payslips', 'Payroll', NOW(), NOW()),
('View All Payroll', 'payroll.view_all', 'View all employee payroll', 'Payroll', NOW(), NOW()),
('Edit Payroll', 'payroll.edit', 'Edit employee salary and components', 'Payroll', NOW(), NOW()),
('Process Payroll', 'payroll.process', 'Run payroll processing', 'Payroll', NOW(), NOW()),
('Export Payroll', 'payroll.export', 'Export payroll reports', 'Payroll', NOW(), NOW()),
('Approve Payroll', 'payroll.approve', 'Approve processed payroll', 'Payroll', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 6. RECRUITMENT MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Job Postings', 'recruitment.view_jobs', 'View job postings', 'Recruitment', NOW(), NOW()),
('Create Job Postings', 'recruitment.create_jobs', 'Create new job postings', 'Recruitment', NOW(), NOW()),
('Edit Job Postings', 'recruitment.edit_jobs', 'Edit job postings', 'Recruitment', NOW(), NOW()),
('Delete Job Postings', 'recruitment.delete_jobs', 'Delete job postings', 'Recruitment', NOW(), NOW()),
('View Applications', 'recruitment.view_applications', 'View job applications', 'Recruitment', NOW(), NOW()),
('Review Applications', 'recruitment.review_applications', 'Review and manage applications', 'Recruitment', NOW(), NOW()),
('Schedule Interviews', 'recruitment.schedule_interviews', 'Schedule candidate interviews', 'Recruitment', NOW(), NOW()),
('Make Offers', 'recruitment.make_offers', 'Create and send job offers', 'Recruitment', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 7. PERFORMANCE MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Own Performance', 'performance.view_own', 'View own performance data', 'Performance', NOW(), NOW()),
('View All Performance', 'performance.view_all', 'View all employee performance data', 'Performance', NOW(), NOW()),
('Set Goals', 'performance.set_goals', 'Set performance goals and KPIs', 'Performance', NOW(), NOW()),
('Conduct Reviews', 'performance.conduct_reviews', 'Conduct performance reviews', 'Performance', NOW(), NOW()),
('Provide Feedback', 'performance.provide_feedback', 'Provide 360° feedback', 'Performance', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 8. TRAINING MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Training', 'training.view', 'View training programs and sessions', 'Training', NOW(), NOW()),
('Create Training', 'training.create', 'Create training programs', 'Training', NOW(), NOW()),
('Edit Training', 'training.edit', 'Edit training programs', 'Training', NOW(), NOW()),
('Delete Training', 'training.delete', 'Delete training programs', 'Training', NOW(), NOW()),
('Enroll Training', 'training.enroll', 'Enroll in training programs', 'Training', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 9. DOCUMENTS MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Own Documents', 'documents.view_own', 'View own documents', 'Documents', NOW(), NOW()),
('View All Documents', 'documents.view_all', 'View all company documents', 'Documents', NOW(), NOW()),
('Upload Documents', 'documents.create', 'Upload new documents', 'Documents', NOW(), NOW()),
('Edit Documents', 'documents.edit', 'Edit document metadata', 'Documents', NOW(), NOW()),
('Delete Documents', 'documents.delete', 'Delete documents', 'Documents', NOW(), NOW()),
('Share Documents', 'documents.share', 'Share documents with others', 'Documents', NOW(), NOW()),
('Download Documents', 'documents.download', 'Download documents', 'Documents', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 10. FINANCE MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Expenses', 'finance.view_expenses', 'View expense records', 'Finance', NOW(), NOW()),
('Create Expenses', 'finance.create_expenses', 'Create expense entries', 'Finance', NOW(), NOW()),
('Approve Expenses', 'finance.approve_expenses', 'Approve or reject expenses', 'Finance', NOW(), NOW()),
('View Income', 'finance.view_income', 'View income records', 'Finance', NOW(), NOW()),
('Manage Income', 'finance.manage_income', 'Create and edit income entries', 'Finance', NOW(), NOW()),
('View Finance Reports', 'finance.view_reports', 'View financial reports', 'Finance', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 11. CONTRACTS MODULE (Enhanced)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
-- Templates Management
('View Contract Templates', 'contracts.templates.view', 'View contract templates list', 'Contracts', NOW(), NOW()),
('Create Contract Template', 'contracts.templates.create', 'Upload new contract templates', 'Contracts', NOW(), NOW()),
('Edit Contract Template', 'contracts.templates.edit', 'Edit template fields and settings', 'Contracts', NOW(), NOW()),
('Delete Contract Template', 'contracts.templates.delete', 'Delete contract templates', 'Contracts', NOW(), NOW()),
('Activate/Deactivate Template', 'contracts.templates.activate', 'Activate or deactivate templates', 'Contracts', NOW(), NOW()),
-- Agreements Management
('View Own Agreements', 'contracts.agreements.view', 'View own contract agreements', 'Contracts', NOW(), NOW()),
('View All Agreements', 'contracts.agreements.view_all', 'View all company agreements', 'Contracts', NOW(), NOW()),
('Send Agreements', 'contracts.agreements.send', 'Send contracts for e-signature', 'Contracts', NOW(), NOW()),
('Cancel Agreements', 'contracts.agreements.cancel', 'Cancel sent agreements', 'Contracts', NOW(), NOW()),
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
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 12. ASSETS MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Assets', 'assets.view', 'View asset list and details', 'Assets', NOW(), NOW()),
('Create Assets', 'assets.create', 'Add new assets', 'Assets', NOW(), NOW()),
('Edit Assets', 'assets.edit', 'Edit asset information', 'Assets', NOW(), NOW()),
('Delete Assets', 'assets.delete', 'Delete assets', 'Assets', NOW(), NOW()),
('Assign Assets', 'assets.assign', 'Assign assets to employees', 'Assets', NOW(), NOW()),
('Manage Categories', 'assets.manage_categories', 'Manage asset categories', 'Assets', NOW(), NOW()),
('View Maintenance', 'assets.view_maintenance', 'View asset maintenance records', 'Assets', NOW(), NOW()),
('Create Maintenance', 'assets.create_maintenance', 'Create maintenance records', 'Assets', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 13. ANNOUNCEMENTS & COMMUNICATION
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Announcements', 'announcements.view', 'View announcements', 'Communication', NOW(), NOW()),
('Create Announcements', 'announcements.create', 'Create new announcements', 'Communication', NOW(), NOW()),
('Edit Announcements', 'announcements.edit', 'Edit announcements', 'Communication', NOW(), NOW()),
('Delete Announcements', 'announcements.delete', 'Delete announcements', 'Communication', NOW(), NOW()),
('View Messenger', 'messenger.view', 'Access messenger', 'Communication', NOW(), NOW()),
('Send Messages', 'messenger.send', 'Send messages to other users', 'Communication', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 14. REPORTS MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Reports', 'reports.view', 'View reports dashboard and all reports', 'Reports', NOW(), NOW()),
('Generate Reports', 'reports.generate', 'Generate custom reports', 'Reports', NOW(), NOW()),
('Export Reports', 'reports.export', 'Export reports to Excel/PDF', 'Reports', NOW(), NOW()),
('Share Reports', 'reports.share', 'Share reports with others', 'Reports', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 15. SETTINGS MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View System Settings', 'settings.view_system', 'View system configuration', 'Settings', NOW(), NOW()),
('Edit System Settings', 'settings.edit_system', 'Edit system configuration', 'Settings', NOW(), NOW()),
('View General Settings', 'settings.view_general', 'View general settings', 'Settings', NOW(), NOW()),
('Edit General Settings', 'settings.edit_general', 'Edit general settings', 'Settings', NOW(), NOW()),
('Manage Roles', 'settings.manage_roles', 'Manage user roles and permissions', 'Settings', NOW(), NOW()),
('Manage Users', 'settings.manage_users', 'Manage system users', 'Settings', NOW(), NOW()),
('View Holidays', 'settings.view_holidays', 'View holiday calendar', 'Settings', NOW(), NOW()),
('Manage Holidays', 'settings.manage_holidays', 'Create and edit holidays', 'Settings', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- 16. USERS MODULE
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Users', 'users.view', 'View system users', 'Users', NOW(), NOW()),
('Create Users', 'users.create', 'Create new system users', 'Users', NOW(), NOW()),
('Edit Users', 'users.edit', 'Edit user accounts', 'Users', NOW(), NOW()),
('Delete Users', 'users.delete', 'Delete user accounts', 'Users', NOW(), NOW()),
('Reset Passwords', 'users.reset_password', 'Reset user passwords', 'Users', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- ROLE PERMISSION ASSIGNMENTS
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
-- SUPER ADMIN: ALL PERMISSIONS
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @superadmin_id, id, NOW()
FROM permissions
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- ADMIN: ALL PERMISSIONS
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @admin_id, id, NOW()
FROM permissions
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- HR MANAGER: COMPREHENSIVE HR PERMISSIONS
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @hr_manager_id, id, NOW()
FROM permissions
WHERE slug IN (
  -- Dashboard
  'dashboard.view', 'calendar.view', 'calendar.edit', 'calendar.delete',
  -- Employees
  'employees.view', 'employees.create', 'employees.edit', 'employees.delete', 'employees.view_org_chart',
  -- Attendance
  'attendance.clock', 'attendance.view_own', 'attendance.view_all', 'attendance.manage', 'attendance.export', 'attendance.approve_regularization',
  -- Leaves
  'leaves.view_own', 'leaves.view_all', 'leaves.apply', 'leaves.approve', 'leaves.cancel', 'leaves.manage_types', 'leaves.allocate_balance',
  -- Payroll
  'payroll.view_own', 'payroll.view_all', 'payroll.edit', 'payroll.process', 'payroll.export', 'payroll.approve',
  -- Recruitment
  'recruitment.view_jobs', 'recruitment.create_jobs', 'recruitment.edit_jobs', 'recruitment.delete_jobs', 
  'recruitment.view_applications', 'recruitment.review_applications', 'recruitment.schedule_interviews', 'recruitment.make_offers',
  -- Performance
  'performance.view_own', 'performance.view_all', 'performance.set_goals', 'performance.conduct_reviews', 'performance.provide_feedback',
  -- Training
  'training.view', 'training.create', 'training.edit', 'training.delete', 'training.enroll',
  -- Documents
  'documents.view_own', 'documents.view_all', 'documents.create', 'documents.edit', 'documents.delete', 'documents.share', 'documents.download',
  -- Finance
  'finance.view_expenses', 'finance.create_expenses', 'finance.approve_expenses', 'finance.view_income', 'finance.manage_income', 'finance.view_reports',
  -- Contracts
  'contracts.templates.view', 'contracts.templates.create', 'contracts.templates.edit', 'contracts.templates.delete', 'contracts.templates.activate',
  'contracts.agreements.view', 'contracts.agreements.view_all', 'contracts.agreements.send', 'contracts.agreements.cancel',
  'contracts.signing.view_status', 'contracts.pdf_tools.use', 'contracts.pdf_tools.merge', 'contracts.pdf_tools.compress',
  'contracts.onboarding.view', 'contracts.onboarding.manage',
  -- Assets
  'assets.view', 'assets.create', 'assets.edit', 'assets.delete', 'assets.assign', 'assets.manage_categories', 'assets.view_maintenance', 'assets.create_maintenance',
  -- Communication
  'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.delete', 'messenger.view', 'messenger.send',
  -- Reports
  'reports.view', 'reports.generate', 'reports.export', 'reports.share',
  -- Settings
  'settings.view_system', 'settings.edit_system', 'settings.view_general', 'settings.edit_general', 
  'settings.manage_roles', 'settings.manage_users', 'settings.view_holidays', 'settings.manage_holidays',
  -- Users
  'users.view', 'users.create', 'users.edit', 'users.delete', 'users.reset_password'
)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- HR: HR OPERATIONS (NO DELETE PERMISSIONS)
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @hr_id, id, NOW()
FROM permissions
WHERE slug IN (
  -- Dashboard
  'dashboard.view', 'calendar.view', 'calendar.edit',
  -- Employees
  'employees.view', 'employees.create', 'employees.edit', 'employees.view_org_chart',
  -- Attendance
  'attendance.clock', 'attendance.view_own', 'attendance.view_all', 'attendance.manage', 'attendance.export', 'attendance.approve_regularization',
  -- Leaves
  'leaves.view_own', 'leaves.view_all', 'leaves.apply', 'leaves.approve', 'leaves.manage_types', 'leaves.allocate_balance',
  -- Payroll
  'payroll.view_own', 'payroll.view_all', 'payroll.edit', 'payroll.export',
  -- Recruitment
  'recruitment.view_jobs', 'recruitment.create_jobs', 'recruitment.edit_jobs',
  'recruitment.view_applications', 'recruitment.review_applications', 'recruitment.schedule_interviews', 'recruitment.make_offers',
  -- Performance
  'performance.view_own', 'performance.view_all', 'performance.set_goals', 'performance.conduct_reviews', 'performance.provide_feedback',
  -- Training
  'training.view', 'training.create', 'training.edit', 'training.enroll',
  -- Documents
  'documents.view_own', 'documents.view_all', 'documents.create', 'documents.edit', 'documents.share', 'documents.download',
  -- Finance
  'finance.view_expenses', 'finance.view_income', 'finance.view_reports',
  -- Contracts
  'contracts.templates.view', 'contracts.templates.create', 'contracts.templates.edit',
  'contracts.agreements.view', 'contracts.agreements.view_all', 'contracts.agreements.send',
  'contracts.signing.view_status', 'contracts.pdf_tools.use', 'contracts.pdf_tools.merge', 'contracts.pdf_tools.compress',
  'contracts.onboarding.view', 'contracts.onboarding.manage',
  -- Assets
  'assets.view', 'assets.create', 'assets.edit', 'assets.assign', 'assets.view_maintenance', 'assets.create_maintenance',
  -- Communication
  'announcements.view', 'announcements.create', 'announcements.edit', 'messenger.view', 'messenger.send',
  -- Reports
  'reports.view', 'reports.generate', 'reports.export',
  -- Settings
  'settings.view_general', 'settings.edit_general', 'settings.view_holidays', 'settings.manage_holidays',
  -- Users
  'users.view', 'users.edit'
)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- MANAGER: TEAM MANAGEMENT
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @manager_id, id, NOW()
FROM permissions
WHERE slug IN (
  -- Dashboard
  'dashboard.view', 'calendar.view', 'calendar.edit',
  -- Employees (team only)
  'employees.view', 'employees.view_org_chart',
  -- Attendance
  'attendance.clock', 'attendance.view_own', 'attendance.view_all', 'attendance.approve_regularization',
  -- Leaves
  'leaves.view_own', 'leaves.view_all', 'leaves.apply', 'leaves.approve',
  -- Payroll
  'payroll.view_own', 'payroll.view_all',
  -- Recruitment
  'recruitment.view_jobs', 'recruitment.view_applications', 'recruitment.review_applications', 'recruitment.schedule_interviews',
  -- Performance
  'performance.view_own', 'performance.view_all', 'performance.set_goals', 'performance.conduct_reviews', 'performance.provide_feedback',
  -- Training
  'training.view', 'training.enroll',
  -- Documents
  'documents.view_own', 'documents.view_all', 'documents.create', 'documents.share', 'documents.download',
  -- Finance
  'finance.view_expenses', 'finance.approve_expenses',
  -- Contracts
  'contracts.templates.view', 'contracts.agreements.view', 'contracts.agreements.send',
  'contracts.signing.view_status', 'contracts.pdf_tools.use', 'contracts.onboarding.view',
  -- Assets
  'assets.view', 'assets.assign', 'assets.view_maintenance',
  -- Communication
  'announcements.view', 'announcements.create', 'messenger.view', 'messenger.send',
  -- Reports
  'reports.view', 'reports.generate', 'reports.export'
)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- EMPLOYEE: SELF-SERVICE
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @employee_id, id, NOW()
FROM permissions
WHERE slug IN (
  -- Dashboard
  'dashboard.view', 'calendar.view',
  -- Employees (view only)
  'employees.view', 'employees.view_org_chart',
  -- Attendance
  'attendance.clock', 'attendance.view_own', 'attendance.request_regularization',
  -- Leaves
  'leaves.view_own', 'leaves.apply', 'leaves.cancel',
  -- Payroll
  'payroll.view_own',
  -- Performance
  'performance.view_own', 'performance.provide_feedback',
  -- Training
  'training.view', 'training.enroll',
  -- Documents
  'documents.view_own', 'documents.download',
  -- Contracts
  'contracts.agreements.view', 'contracts.sign', 'contracts.onboarding.view',
  -- Assets
  'assets.view',
  -- Communication
  'announcements.view', 'messenger.view', 'messenger.send'
)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- ACCOUNTANT: FINANCE & PAYROLL
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id, created_at)
SELECT @accountant_id, id, NOW()
FROM permissions
WHERE slug IN (
  -- Dashboard
  'dashboard.view', 'calendar.view',
  -- Employees (view only)
  'employees.view',
  -- Attendance
  'attendance.view_all', 'attendance.export',
  -- Payroll
  'payroll.view_all', 'payroll.edit', 'payroll.process', 'payroll.export', 'payroll.approve',
  -- Finance
  'finance.view_expenses', 'finance.create_expenses', 'finance.approve_expenses', 
  'finance.view_income', 'finance.manage_income', 'finance.view_reports',
  -- Contracts
  'contracts.templates.view', 'contracts.agreements.view', 'contracts.agreements.view_all', 'contracts.signing.view_status',
  -- Assets
  'assets.view', 'assets.view_maintenance',
  -- Communication
  'announcements.view', 'messenger.view', 'messenger.send',
  -- Reports
  'reports.view', 'reports.generate', 'reports.export'
)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================================
-- SUMMARY & VERIFICATION
-- ============================================================================

-- Show total permissions count
SELECT 
  'TOTAL PERMISSIONS' as Metric,
  COUNT(*) as Count
FROM permissions;

-- Show permissions by module
SELECT 
  module as Module,
  COUNT(*) as Permission_Count
FROM permissions
GROUP BY module
ORDER BY Permission_Count DESC, module;

-- Show permissions by role
SELECT 
  ur.name as Role,
  COUNT(rp.id) as Total_Permissions
FROM user_roles ur
LEFT JOIN role_permissions rp ON ur.id = rp.role_id
WHERE ur.slug IN ('superadmin', 'admin', 'hr_manager', 'hr', 'manager', 'employee', 'accountant')
GROUP BY ur.id, ur.name
ORDER BY COUNT(rp.id) DESC;

-- Show recent permission additions
SELECT 
  name,
  slug,
  module,
  created_at
FROM permissions
ORDER BY created_at DESC
LIMIT 20;

SELECT '✅ Complete permissions setup finished!' as Status;

