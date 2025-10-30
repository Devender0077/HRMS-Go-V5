-- ============================================================================
-- COMPREHENSIVE HRMS PERMISSIONS - ALL MODULES & ACTIONS
-- 200+ Granular permissions for complete RBAC coverage
-- Database: hrms_go_v5
-- ============================================================================

USE hrms_go_v5;

-- ============================================================================
-- DASHBOARD MODULE (10 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Dashboard', 'dashboard.view', 'Access main dashboard', 'Dashboard'), NOW(), NOW(),
('View Analytics', 'dashboard.analytics', 'View dashboard analytics and charts', 'Dashboard'), NOW(), NOW(),
('View Calendar', 'calendar.view', 'View company calendar', 'Dashboard'), NOW(), NOW(),
('Create Calendar Events', 'calendar.create', 'Create calendar events', 'Dashboard'), NOW(), NOW(),
('Edit Calendar Events', 'calendar.edit', 'Edit calendar events', 'Dashboard'), NOW(), NOW(),
('Delete Calendar Events', 'calendar.delete', 'Delete calendar events', 'Dashboard'), NOW(), NOW(),
('Export Calendar', 'calendar.export', 'Export calendar data', 'Dashboard'), NOW(), NOW(),
('View Notifications', 'notifications.view', 'View notifications', 'Dashboard'), NOW(), NOW(),
('Manage Notifications', 'notifications.manage', 'Mark as read, clear notifications', 'Dashboard'), NOW(), NOW(),
('View Profile', 'profile.view', 'View own profile', 'Dashboard'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- EMPLOYEES MODULE (15 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Employees List', 'employees.view', 'View employee directory', 'Employees'), NOW(), NOW(),
('View Employee Details', 'employees.view_details', 'View detailed employee information', 'Employees'), NOW(), NOW(),
('Create Employees', 'employees.create', 'Add new employees', 'Employees'), NOW(), NOW(),
('Edit Employees', 'employees.edit', 'Edit employee information', 'Employees'), NOW(), NOW(),
('Delete Employees', 'employees.delete', 'Delete employees', 'Employees'), NOW(), NOW(),
('Export Employees', 'employees.export', 'Export employee data to Excel/PDF', 'Employees'), NOW(), NOW(),
('Import Employees', 'employees.import', 'Bulk import employees from Excel', 'Employees'), NOW(), NOW(),
('View Organization Chart', 'employees.view_org_chart', 'View organizational hierarchy', 'Employees'), NOW(), NOW(),
('Manage Departments', 'employees.manage_departments', 'Create and edit departments', 'Employees'), NOW(), NOW(),
('Manage Designations', 'employees.manage_designations', 'Create and edit designations', 'Employees'), NOW(), NOW(),
('Assign Managers', 'employees.assign_managers', 'Assign reporting managers', 'Employees'), NOW(), NOW(),
('View Employee Reports', 'employees.view_reports', 'View employee reports', 'Employees'), NOW(), NOW(),
('Activate/Deactivate', 'employees.activate', 'Activate or deactivate employees', 'Employees'), NOW(), NOW(),
('Reset Employee Password', 'employees.reset_password', 'Reset employee passwords', 'Employees'), NOW(), NOW(),
('View Salary Info', 'employees.view_salary', 'View employee salary information', 'Employees'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- ATTENDANCE MODULE (15 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('Clock In/Out', 'attendance.clock', 'Clock in and out for attendance', 'Attendance'), NOW(), NOW(),
('View Own Attendance', 'attendance.view_own', 'View own attendance records', 'Attendance'), NOW(), NOW(),
('View All Attendance', 'attendance.view_all', 'View all employee attendance records', 'Attendance'), NOW(), NOW(),
('View Attendance Calendar', 'attendance.view_calendar', 'View attendance calendar/muster', 'Attendance'), NOW(), NOW(),
('Manage Attendance', 'attendance.manage', 'Edit and manage attendance records', 'Attendance'), NOW(), NOW(),
('Mark Attendance', 'attendance.mark', 'Mark attendance for employees', 'Attendance'), NOW(), NOW(),
('Export Attendance', 'attendance.export', 'Export attendance reports', 'Attendance'), NOW(), NOW(),
('Request Regularization', 'attendance.request_regularization', 'Request attendance regularization', 'Attendance'), NOW(), NOW(),
('Approve Regularization', 'attendance.approve_regularization', 'Approve attendance regularization requests', 'Attendance'), NOW(), NOW(),
('Reject Regularization', 'attendance.reject_regularization', 'Reject regularization requests', 'Attendance'), NOW(), NOW(),
('View Muster Report', 'attendance.view_muster', 'View muster reports', 'Attendance'), NOW(), NOW(),
('Generate Muster Report', 'attendance.generate_muster', 'Generate muster reports', 'Attendance'), NOW(), NOW(),
('Configure Week Off', 'attendance.configure_weekoff', 'Configure week off days', 'Attendance'), NOW(), NOW(),
('Configure Shifts', 'attendance.configure_shifts', 'Configure work shifts', 'Attendance'), NOW(), NOW(),
('View Attendance Analytics', 'attendance.analytics', 'View attendance analytics', 'Attendance'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- LEAVES MODULE (18 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Own Leaves', 'leaves.view_own', 'View own leave applications', 'Leaves'), NOW(), NOW(),
('View All Leaves', 'leaves.view_all', 'View all employee leave applications', 'Leaves'), NOW(), NOW(),
('Apply Leave', 'leaves.apply', 'Submit leave applications', 'Leaves'), NOW(), NOW(),
('Edit Leave', 'leaves.edit', 'Edit leave applications', 'Leaves'), NOW(), NOW(),
('Cancel Leave', 'leaves.cancel', 'Cancel leave applications', 'Leaves'), NOW(), NOW(),
('Approve Leave', 'leaves.approve', 'Approve leave applications', 'Leaves'), NOW(), NOW(),
('Reject Leave', 'leaves.reject', 'Reject leave applications', 'Leaves'), NOW(), NOW(),
('View Leave Balance', 'leaves.view_balance', 'View leave balance', 'Leaves'), NOW(), NOW(),
('View All Balances', 'leaves.view_all_balances', 'View all employee leave balances', 'Leaves'), NOW(), NOW(),
('Allocate Leave Balance', 'leaves.allocate_balance', 'Allocate leave balance to employees', 'Leaves'), NOW(), NOW(),
('Adjust Leave Balance', 'leaves.adjust_balance', 'Adjust leave balance manually', 'Leaves'), NOW(), NOW(),
('Manage Leave Types', 'leaves.manage_types', 'Create and configure leave types', 'Leaves'), NOW(), NOW(),
('Activate Leave Types', 'leaves.activate_types', 'Activate or deactivate leave types', 'Leaves'), NOW(), NOW(),
('Delete Leave Types', 'leaves.delete_types', 'Delete leave types', 'Leaves'), NOW(), NOW(),
('View Leave Reports', 'leaves.view_reports', 'View leave reports', 'Leaves'), NOW(), NOW(),
('Export Leaves', 'leaves.export', 'Export leave data to Excel/PDF', 'Leaves'), NOW(), NOW(),
('Configure Leave Policy', 'leaves.configure_policy', 'Configure leave policies', 'Leaves'), NOW(), NOW(),
('View Leave Analytics', 'leaves.analytics', 'View leave analytics and trends', 'Leaves'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- PAYROLL MODULE (20 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Own Payroll', 'payroll.view_own', 'View own salary and payslips', 'Payroll'), NOW(), NOW(),
('View All Payroll', 'payroll.view_all', 'View all employee payroll', 'Payroll'), NOW(), NOW(),
('View Salary Details', 'payroll.view_salary', 'View detailed salary breakdowns', 'Payroll'), NOW(), NOW(),
('Edit Salary', 'payroll.edit', 'Edit employee salary and components', 'Payroll'), NOW(), NOW(),
('Create Salary', 'payroll.create_salary', 'Create new salary structures', 'Payroll'), NOW(), NOW(),
('Delete Salary', 'payroll.delete_salary', 'Delete salary records', 'Payroll'), NOW(), NOW(),
('Process Payroll', 'payroll.process', 'Run payroll processing', 'Payroll'), NOW(), NOW(),
('Approve Payroll', 'payroll.approve', 'Approve processed payroll', 'Payroll'), NOW(), NOW(),
('Reject Payroll', 'payroll.reject', 'Reject payroll processing', 'Payroll'), NOW(), NOW(),
('View Payslips', 'payroll.view_payslips', 'View employee payslips', 'Payroll'), NOW(), NOW(),
('Generate Payslips', 'payroll.generate_payslips', 'Generate monthly payslips', 'Payroll'), NOW(), NOW(),
('Download Payslips', 'payroll.download_payslips', 'Download payslips as PDF', 'Payroll'), NOW(), NOW(),
('Email Payslips', 'payroll.email_payslips', 'Send payslips via email', 'Payroll'), NOW(), NOW(),
('Export Payroll', 'payroll.export', 'Export payroll reports', 'Payroll'), NOW(), NOW(),
('View Payroll Reports', 'payroll.view_reports', 'View payroll reports', 'Payroll'), NOW(), NOW(),
('Configure Salary Components', 'payroll.configure_components', 'Configure salary components', 'Payroll'), NOW(), NOW(),
('Manage Deductions', 'payroll.manage_deductions', 'Manage salary deductions', 'Payroll'), NOW(), NOW(),
('Manage Bonuses', 'payroll.manage_bonuses', 'Manage employee bonuses', 'Payroll'), NOW(), NOW(),
('View Tax Reports', 'payroll.view_tax', 'View tax reports', 'Payroll'), NOW(), NOW(),
('Process Year End', 'payroll.year_end', 'Process year-end payroll', 'Payroll'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- RECRUITMENT MODULE (20 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Job Postings', 'recruitment.view_jobs', 'View job postings list', 'Recruitment'), NOW(), NOW(),
('Create Job Postings', 'recruitment.create_jobs', 'Create new job postings', 'Recruitment'), NOW(), NOW(),
('Edit Job Postings', 'recruitment.edit_jobs', 'Edit job postings', 'Recruitment'), NOW(), NOW(),
('Delete Job Postings', 'recruitment.delete_jobs', 'Delete job postings', 'Recruitment'), NOW(), NOW(),
('Publish Job Postings', 'recruitment.publish_jobs', 'Publish jobs to job boards', 'Recruitment'), NOW(), NOW(),
('Close Job Postings', 'recruitment.close_jobs', 'Close job postings', 'Recruitment'), NOW(), NOW(),
('View Applications', 'recruitment.view_applications', 'View job applications', 'Recruitment'), NOW(), NOW(),
('Review Applications', 'recruitment.review_applications', 'Review and manage applications', 'Recruitment'), NOW(), NOW(),
('Shortlist Candidates', 'recruitment.shortlist', 'Shortlist candidates', 'Recruitment'), NOW(), NOW(),
('Reject Applications', 'recruitment.reject', 'Reject applications', 'Recruitment'), NOW(), NOW(),
('View Candidate Pipeline', 'recruitment.view_pipeline', 'View recruitment pipeline', 'Recruitment'), NOW(), NOW(),
('Manage Pipeline Stages', 'recruitment.manage_stages', 'Manage pipeline stages', 'Recruitment'), NOW(), NOW(),
('Schedule Interviews', 'recruitment.schedule_interviews', 'Schedule candidate interviews', 'Recruitment'), NOW(), NOW(),
('Conduct Interviews', 'recruitment.conduct_interviews', 'Conduct and evaluate interviews', 'Recruitment'), NOW(), NOW(),
('View Interview Feedback', 'recruitment.view_feedback', 'View interview feedback', 'Recruitment'), NOW(), NOW(),
('Create Offers', 'recruitment.create_offers', 'Create job offers', 'Recruitment'), NOW(), NOW(),
('Approve Offers', 'recruitment.approve_offers', 'Approve job offers', 'Recruitment'), NOW(), NOW(),
('Send Offers', 'recruitment.send_offers', 'Send offers to candidates', 'Recruitment'), NOW(), NOW(),
('View Recruitment Reports', 'recruitment.view_reports', 'View recruitment reports', 'Recruitment'), NOW(), NOW(),
('Export Recruitment Data', 'recruitment.export', 'Export recruitment data', 'Recruitment'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- PERFORMANCE MODULE (18 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Own Performance', 'performance.view_own', 'View own performance data', 'Performance'), NOW(), NOW(),
('View All Performance', 'performance.view_all', 'View all employee performance data', 'Performance'), NOW(), NOW(),
('View Performance Dashboard', 'performance.view_dashboard', 'View performance dashboard', 'Performance'), NOW(), NOW(),
('Set Own Goals', 'performance.set_own_goals', 'Set personal goals and KPIs', 'Performance'), NOW(), NOW(),
('Set Team Goals', 'performance.set_team_goals', 'Set goals for team members', 'Performance'), NOW(), NOW(),
('View Goals', 'performance.view_goals', 'View goals and KPIs', 'Performance'), NOW(), NOW(),
('Edit Goals', 'performance.edit_goals', 'Edit goals and KPIs', 'Performance'), NOW(), NOW(),
('Delete Goals', 'performance.delete_goals', 'Delete goals', 'Performance'), NOW(), NOW(),
('Conduct Reviews', 'performance.conduct_reviews', 'Conduct performance reviews', 'Performance'), NOW(), NOW(),
('View Reviews', 'performance.view_reviews', 'View performance reviews', 'Performance'), NOW(), NOW(),
('Approve Reviews', 'performance.approve_reviews', 'Approve performance reviews', 'Performance'), NOW(), NOW(),
('Provide Feedback', 'performance.provide_feedback', 'Provide 360° feedback', 'Performance'), NOW(), NOW(),
('View Feedback', 'performance.view_feedback', 'View received feedback', 'Performance'), NOW(), NOW(),
('Request Feedback', 'performance.request_feedback', 'Request feedback from others', 'Performance'), NOW(), NOW(),
('View Performance Reports', 'performance.view_reports', 'View performance reports', 'Performance'), NOW(), NOW(),
('Export Performance Data', 'performance.export', 'Export performance data', 'Performance'), NOW(), NOW(),
('Configure Review Cycles', 'performance.configure_cycles', 'Configure review cycles', 'Performance'), NOW(), NOW(),
('View Analytics', 'performance.analytics', 'View performance analytics', 'Performance'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- TRAINING MODULE (15 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Training Programs', 'training.view', 'View training programs', 'Training'), NOW(), NOW(),
('Create Training Programs', 'training.create', 'Create new training programs', 'Training'), NOW(), NOW(),
('Edit Training Programs', 'training.edit', 'Edit training programs', 'Training'), NOW(), NOW(),
('Delete Training Programs', 'training.delete', 'Delete training programs', 'Training'), NOW(), NOW(),
('Publish Training', 'training.publish', 'Publish training programs', 'Training'), NOW(), NOW(),
('Enroll in Training', 'training.enroll', 'Enroll in training programs', 'Training'), NOW(), NOW(),
('Approve Enrollment', 'training.approve_enrollment', 'Approve training enrollment requests', 'Training'), NOW(), NOW(),
('View Training Sessions', 'training.view_sessions', 'View training sessions', 'Training'), NOW(), NOW(),
('Schedule Sessions', 'training.schedule_sessions', 'Schedule training sessions', 'Training'), NOW(), NOW(),
('Conduct Training', 'training.conduct', 'Conduct training sessions', 'Training'), NOW(), NOW(),
('Mark Attendance', 'training.mark_attendance', 'Mark training attendance', 'Training'), NOW(), NOW(),
('View Training Reports', 'training.view_reports', 'View training reports', 'Training'), NOW(), NOW(),
('Export Training Data', 'training.export', 'Export training data', 'Training'), NOW(), NOW(),
('Certify Completion', 'training.certify', 'Issue training certificates', 'Training'), NOW(), NOW(),
('View Training Analytics', 'training.analytics', 'View training analytics', 'Training'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- DOCUMENTS MODULE (12 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Own Documents', 'documents.view_own', 'View own documents', 'Documents'), NOW(), NOW(),
('View All Documents', 'documents.view_all', 'View all company documents', 'Documents'), NOW(), NOW(),
('Upload Documents', 'documents.create', 'Upload new documents', 'Documents'), NOW(), NOW(),
('Edit Documents', 'documents.edit', 'Edit document metadata', 'Documents'), NOW(), NOW(),
('Delete Documents', 'documents.delete', 'Delete documents', 'Documents'), NOW(), NOW(),
('Download Documents', 'documents.download', 'Download documents', 'Documents'), NOW(), NOW(),
('Share Documents', 'documents.share', 'Share documents with others', 'Documents'), NOW(), NOW(),
('View Document Library', 'documents.view_library', 'Access document library', 'Documents'), NOW(), NOW(),
('View Employee Documents', 'documents.view_employee_docs', 'View employee-specific documents', 'Documents'), NOW(), NOW(),
('Organize Folders', 'documents.organize', 'Create and manage folders', 'Documents'), NOW(), NOW(),
('Set Permissions', 'documents.set_permissions', 'Set document access permissions', 'Documents'), NOW(), NOW(),
('View Document History', 'documents.view_history', 'View document version history', 'Documents'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- FINANCE MODULE (18 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Expenses', 'finance.view_expenses', 'View expense records', 'Finance'), NOW(), NOW(),
('Create Expenses', 'finance.create_expenses', 'Create expense entries', 'Finance'), NOW(), NOW(),
('Edit Expenses', 'finance.edit_expenses', 'Edit expense records', 'Finance'), NOW(), NOW(),
('Delete Expenses', 'finance.delete_expenses', 'Delete expense records', 'Finance'), NOW(), NOW(),
('Approve Expenses', 'finance.approve_expenses', 'Approve or reject expenses', 'Finance'), NOW(), NOW(),
('Reject Expenses', 'finance.reject_expenses', 'Reject expense claims', 'Finance'), NOW(), NOW(),
('View Income', 'finance.view_income', 'View income records', 'Finance'), NOW(), NOW(),
('Create Income', 'finance.create_income', 'Create income entries', 'Finance'), NOW(), NOW(),
('Edit Income', 'finance.edit_income', 'Edit income records', 'Finance'), NOW(), NOW(),
('Delete Income', 'finance.delete_income', 'Delete income records', 'Finance'), NOW(), NOW(),
('View Finance Reports', 'finance.view_reports', 'View financial reports', 'Finance'), NOW(), NOW(),
('Generate Finance Reports', 'finance.generate_reports', 'Generate custom reports', 'Finance'), NOW(), NOW(),
('Export Finance Data', 'finance.export', 'Export financial data', 'Finance'), NOW(), NOW(),
('View Budget', 'finance.view_budget', 'View budget information', 'Finance'), NOW(), NOW(),
('Manage Budget', 'finance.manage_budget', 'Create and manage budgets', 'Finance'), NOW(), NOW(),
('View Invoices', 'finance.view_invoices', 'View invoices', 'Finance'), NOW(), NOW(),
('Create Invoices', 'finance.create_invoices', 'Create invoices', 'Finance'), NOW(), NOW(),
('Approve Payments', 'finance.approve_payments', 'Approve payment requests', 'Finance'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- CONTRACTS MODULE (25 permissions - ENHANCED!)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
-- Templates Management
('View Contract Templates', 'contracts.templates.view', 'View contract templates list', 'Contracts'), NOW(), NOW(),
('Create Contract Template', 'contracts.templates.create', 'Upload new contract templates', 'Contracts'), NOW(), NOW(),
('Edit Contract Template', 'contracts.templates.edit', 'Edit template metadata', 'Contracts'), NOW(), NOW(),
('Delete Contract Template', 'contracts.templates.delete', 'Delete contract templates', 'Contracts'), NOW(), NOW(),
('Activate Template', 'contracts.templates.activate', 'Activate or deactivate templates', 'Contracts'), NOW(), NOW(),
('Duplicate Template', 'contracts.templates.duplicate', 'Duplicate contract templates', 'Contracts'), NOW(), NOW(),
('Edit Template Fields', 'contracts.templates.edit_fields', 'Edit template fields visually', 'Contracts'), NOW(), NOW(),
('Auto-Detect Fields', 'contracts.templates.auto_detect', 'Use auto-detect for template fields', 'Contracts'), NOW(), NOW(),
-- Agreements Management
('View Own Agreements', 'contracts.agreements.view', 'View own contract agreements', 'Contracts'), NOW(), NOW(),
('View All Agreements', 'contracts.agreements.view_all', 'View all company agreements', 'Contracts'), NOW(), NOW(),
('Send Agreements', 'contracts.agreements.send', 'Send contracts for e-signature', 'Contracts'), NOW(), NOW(),
('Resend Agreements', 'contracts.agreements.resend', 'Resend contract reminders', 'Contracts'), NOW(), NOW(),
('Cancel Agreements', 'contracts.agreements.cancel', 'Cancel sent agreements', 'Contracts'), NOW(), NOW(),
('Download Agreements', 'contracts.agreements.download', 'Download signed agreements', 'Contracts'), NOW(), NOW(),
('View Agreement Audit Trail', 'contracts.agreements.audit', 'View contract audit trail', 'Contracts'), NOW(), NOW(),
-- E-Signature
('Sign Contracts', 'contracts.sign', 'Sign contracts with e-signature', 'Contracts'), NOW(), NOW(),
('View Signing Status', 'contracts.signing.view_status', 'View contract signing status', 'Contracts'), NOW(), NOW(),
('Decline Contracts', 'contracts.decline', 'Decline contract signing', 'Contracts'), NOW(), NOW(),
-- PDF Tools
('Use PDF Tools', 'contracts.pdf_tools.use', 'Access PDF manipulation tools', 'Contracts'), NOW(), NOW(),
('Merge PDFs', 'contracts.pdf_tools.merge', 'Merge multiple PDF files', 'Contracts'), NOW(), NOW(),
('Compress PDFs', 'contracts.pdf_tools.compress', 'Compress PDF file size', 'Contracts'), NOW(), NOW(),
('Split PDFs', 'contracts.pdf_tools.split', 'Split PDF pages', 'Contracts'), NOW(), NOW(),
('Edit PDFs', 'contracts.pdf_tools.edit', 'Edit PDF content', 'Contracts'), NOW(), NOW(),
-- Onboarding
('View Onboarding', 'contracts.onboarding.view', 'View employee onboarding documents', 'Contracts'), NOW(), NOW(),
('Manage Onboarding', 'contracts.onboarding.manage', 'Manage employee onboarding process', 'Contracts'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- ASSETS MODULE (18 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Assets', 'assets.view', 'View asset list and details', 'Assets'), NOW(), NOW(),
('Create Assets', 'assets.create', 'Add new assets', 'Assets'), NOW(), NOW(),
('Edit Assets', 'assets.edit', 'Edit asset information', 'Assets'), NOW(), NOW(),
('Delete Assets', 'assets.delete', 'Delete assets', 'Assets'), NOW(), NOW(),
('Export Assets', 'assets.export', 'Export asset data', 'Assets'), NOW(), NOW(),
('Import Assets', 'assets.import', 'Bulk import assets', 'Assets'), NOW(), NOW(),
('View Asset Categories', 'assets.view_categories', 'View asset categories', 'Assets'), NOW(), NOW(),
('Manage Categories', 'assets.manage_categories', 'Create and edit asset categories', 'Assets'), NOW(), NOW(),
('View Assignments', 'assets.view_assignments', 'View asset assignments', 'Assets'), NOW(), NOW(),
('Assign Assets', 'assets.assign', 'Assign assets to employees', 'Assets'), NOW(), NOW(),
('Unassign Assets', 'assets.unassign', 'Unassign assets from employees', 'Assets'), NOW(), NOW(),
('View Maintenance', 'assets.view_maintenance', 'View asset maintenance records', 'Assets'), NOW(), NOW(),
('Create Maintenance', 'assets.create_maintenance', 'Create maintenance records', 'Assets'), NOW(), NOW(),
('Edit Maintenance', 'assets.edit_maintenance', 'Edit maintenance records', 'Assets'), NOW(), NOW(),
('Schedule Maintenance', 'assets.schedule_maintenance', 'Schedule asset maintenance', 'Assets'), NOW(), NOW(),
('View Asset Reports', 'assets.view_reports', 'View asset reports', 'Assets'), NOW(), NOW(),
('Track Asset Location', 'assets.track_location', 'Track asset locations', 'Assets'), NOW(), NOW(),
('Depreciate Assets', 'assets.depreciate', 'Calculate asset depreciation', 'Assets'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- ANNOUNCEMENTS MODULE (10 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Announcements', 'announcements.view', 'View announcements', 'Communication'), NOW(), NOW(),
('Create Announcements', 'announcements.create', 'Create new announcements', 'Communication'), NOW(), NOW(),
('Edit Announcements', 'announcements.edit', 'Edit announcements', 'Communication'), NOW(), NOW(),
('Delete Announcements', 'announcements.delete', 'Delete announcements', 'Communication'), NOW(), NOW(),
('Pin Announcements', 'announcements.pin', 'Pin important announcements', 'Communication'), NOW(), NOW(),
('Publish Announcements', 'announcements.publish', 'Publish draft announcements', 'Communication'), NOW(), NOW(),
('Target Announcements', 'announcements.target', 'Target specific departments/roles', 'Communication'), NOW(), NOW(),
('Schedule Announcements', 'announcements.schedule', 'Schedule future announcements', 'Communication'), NOW(), NOW(),
('View Analytics', 'announcements.analytics', 'View announcement read statistics', 'Communication'), NOW(), NOW(),
('Send Notifications', 'announcements.notify', 'Send push notifications', 'Communication'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- MESSENGER MODULE (8 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('Access Messenger', 'messenger.view', 'Access messenger', 'Communication'), NOW(), NOW(),
('Send Messages', 'messenger.send', 'Send messages to other users', 'Communication'), NOW(), NOW(),
('Create Group Chats', 'messenger.create_groups', 'Create group conversations', 'Communication'), NOW(), NOW(),
('Delete Messages', 'messenger.delete', 'Delete own messages', 'Communication'), NOW(), NOW(),
('Archive Conversations', 'messenger.archive', 'Archive conversations', 'Communication'), NOW(), NOW(),
('Mute Conversations', 'messenger.mute', 'Mute conversations', 'Communication'), NOW(), NOW(),
('Share Files', 'messenger.share_files', 'Share files in messenger', 'Communication'), NOW(), NOW(),
('View Message History', 'messenger.view_history', 'View message history', 'Communication'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- REPORTS MODULE (12 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Reports Dashboard', 'reports.view', 'Access reports dashboard', 'Reports'), NOW(), NOW(),
('Generate Reports', 'reports.generate', 'Generate custom reports', 'Reports'), NOW(), NOW(),
('Export Reports', 'reports.export', 'Export reports to Excel/PDF', 'Reports'), NOW(), NOW(),
('Share Reports', 'reports.share', 'Share reports with others', 'Reports'), NOW(), NOW(),
('Schedule Reports', 'reports.schedule', 'Schedule automated reports', 'Reports'), NOW(), NOW(),
('Save Report Templates', 'reports.save_templates', 'Save custom report templates', 'Reports'), NOW(), NOW(),
('View Attendance Reports', 'reports.attendance', 'View attendance reports', 'Reports'), NOW(), NOW(),
('View Leave Reports', 'reports.leaves', 'View leave reports', 'Reports'), NOW(), NOW(),
('View Payroll Reports', 'reports.payroll', 'View payroll reports', 'Reports'), NOW(), NOW(),
('View HR Reports', 'reports.hr', 'View HR reports', 'Reports'), NOW(), NOW(),
('View Financial Reports', 'reports.financial', 'View financial reports', 'Reports'), NOW(), NOW(),
('View Analytics Dashboard', 'reports.analytics', 'View analytics dashboard', 'Reports'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- SETTINGS MODULE (20 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View System Settings', 'settings.view_system', 'View system configuration', 'Settings'), NOW(), NOW(),
('Edit System Settings', 'settings.edit_system', 'Edit system configuration', 'Settings'), NOW(), NOW(),
('View General Settings', 'settings.view_general', 'View general settings', 'Settings'), NOW(), NOW(),
('Edit General Settings', 'settings.edit_general', 'Edit general settings', 'Settings'), NOW(), NOW(),
('View Roles', 'settings.view_roles', 'View user roles', 'Settings'), NOW(), NOW(),
('Create Roles', 'settings.create_roles', 'Create new user roles', 'Settings'), NOW(), NOW(),
('Edit Roles', 'settings.edit_roles', 'Edit user roles', 'Settings'), NOW(), NOW(),
('Delete Roles', 'settings.delete_roles', 'Delete user roles', 'Settings'), NOW(), NOW(),
('Manage Permissions', 'settings.manage_permissions', 'Assign permissions to roles', 'Settings'), NOW(), NOW(),
('View Holidays', 'settings.view_holidays', 'View holiday calendar', 'Settings'), NOW(), NOW(),
('Create Holidays', 'settings.create_holidays', 'Create holidays', 'Settings'), NOW(), NOW(),
('Edit Holidays', 'settings.edit_holidays', 'Edit holidays', 'Settings'), NOW(), NOW(),
('Delete Holidays', 'settings.delete_holidays', 'Delete holidays', 'Settings'), NOW(), NOW(),
('Configure Email', 'settings.configure_email', 'Configure email settings', 'Settings'), NOW(), NOW(),
('Configure Notifications', 'settings.configure_notifications', 'Configure notification settings', 'Settings'), NOW(), NOW(),
('View Audit Logs', 'settings.view_audit', 'View system audit logs', 'Settings'), NOW(), NOW(),
('Backup Database', 'settings.backup', 'Backup database', 'Settings'), NOW(), NOW(),
('Restore Database', 'settings.restore', 'Restore database backup', 'Settings'), NOW(), NOW(),
('Configure Integration', 'settings.integrations', 'Configure third-party integrations', 'Settings'), NOW(), NOW(),
('Manage Company Info', 'settings.company_info', 'Edit company information', 'Settings'), NOW(), NOW()
ON DUPLICATE KEY UPDATE description = VALUES(description), updated_at = NOW();

-- ============================================================================
-- USERS MODULE (12 permissions)
-- ============================================================================

INSERT INTO permissions (name, slug, description, module, created_at, updated_at) VALUES
('View Users', 'users.view', 'View system users', 'Users'), NOW(), NOW(),
('Create Users', 'users.create', 'Create new system users', 'Users'), NOW(), NOW(),
('Edit Users', 'users.edit', 'Edit user accounts', 'Users'), NOW(), NOW(),
('Delete Users', 'users.delete', 'Delete user accounts', 'Users'), NOW(), NOW(),
('Activate/Deactivate Users', 'users.activate', 'Activate or deactivate users', 'Users'), NOW(), NOW(),
('Reset Passwords', 'users.reset_password', 'Reset user passwords', 'Users'), NOW(), NOW(),
('Force Password Change', 'users.force_password_change', 'Force users to change password', 'Users'), NOW(), NOW(),
('Lock/Unlock Accounts', 'users.lock', 'Lock or unlock user accounts', 'Users'), NOW(), NOW(),
('View User Activity', 'users.view_activity', 'View user login activity', 'Users'), NOW(), NOW(),
('Manage User Roles', 'users.manage_roles', 'Assign roles to users', 'Users'), NOW(), NOW(),
('View User Sessions', 'users.view_sessions', 'View active user sessions', 'Users'), NOW(), NOW(),
('Terminate Sessions', 'users.terminate_sessions', 'Terminate user sessions', 'Users'), NOW(), NOW()
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

INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
SELECT @superadmin_id, id, NOW()
FROM permissions;

-- ============================================================================
-- ADMIN: ALL PERMISSIONS
-- ============================================================================

INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
SELECT @admin_id, id, NOW()
FROM permissions;

-- ============================================================================
-- SUMMARY & VERIFICATION
-- ============================================================================

-- Total permissions count
SELECT 
  'COMPREHENSIVE PERMISSIONS SETUP COMPLETE!' as Status,
  COUNT(*) as Total_Permissions
FROM permissions;

-- Permissions by module
SELECT 
  module as Module,
  COUNT(*) as Permission_Count
FROM permissions
GROUP BY module
ORDER BY Permission_Count DESC, module;

-- Permissions by role
SELECT 
  ur.name as Role,
  COUNT(rp.id) as Total_Permissions
FROM user_roles ur
LEFT JOIN role_permissions rp ON ur.id = rp.role_id
WHERE ur.slug IN ('superadmin', 'admin', 'hr_manager', 'hr', 'manager', 'employee', 'accountant')
GROUP BY ur.id, ur.name
ORDER BY COUNT(rp.id) DESC;

-- Show recent additions (last 30)
SELECT 
  name,
  slug,
  module
FROM permissions
ORDER BY id DESC
LIMIT 30;

SELECT '✅ 200+ Permissions Created Successfully!' as Final_Status;


