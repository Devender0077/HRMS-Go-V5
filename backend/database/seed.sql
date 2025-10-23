-- ============================================================================
-- HRMS Go V5 - Sample Data (Seed File)
-- ============================================================================
-- This file contains sample data for testing and development
-- Run this AFTER running schema.sql
-- ============================================================================

USE hrms_go_v5;

-- ============================================================================
-- ORGANIZATION DATA
-- ============================================================================

-- Branches
INSERT INTO branches (name, code, address, city, state, country, phone, email, status) VALUES
('Headquarters', 'HQ', '123 Main Street', 'New York', 'NY', 'USA', '+1-212-555-0100', 'hq@company.com', 'active'),
('West Coast Office', 'WC', '456 Tech Blvd', 'San Francisco', 'CA', 'USA', '+1-415-555-0200', 'westcoast@company.com', 'active'),
('East Coast Office', 'EC', '789 Business Ave', 'Boston', 'MA', 'USA', '+1-617-555-0300', 'eastcoast@company.com', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Departments
INSERT INTO departments (name, code, description, status) VALUES
('Engineering', 'ENG', 'Software development and technical operations', 'active'),
('Human Resources', 'HR', 'Employee management and recruitment', 'active'),
('Finance', 'FIN', 'Financial planning and accounting', 'active'),
('Marketing', 'MKT', 'Marketing and communications', 'active'),
('Sales', 'SALES', 'Sales and business development', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Designations
INSERT INTO designations (name, code, description, status) VALUES
('Software Engineer', 'SE', 'Entry level software developer', 'active'),
('Senior Software Engineer', 'SSE', 'Experienced software developer', 'active'),
('Team Lead', 'TL', 'Technical team leader', 'active'),
('Manager', 'MGR', 'Department manager', 'active'),
('Director', 'DIR', 'Director level position', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- ATTENDANCE CONFIGURATION
-- ============================================================================

-- Shifts
INSERT INTO shifts (name, code, start_time, end_time, grace_period_minutes, status) VALUES
('Morning Shift', 'MS', '09:00:00', '18:00:00', 15, 'active'),
('Evening Shift', 'ES', '14:00:00', '23:00:00', 15, 'active'),
('Night Shift', 'NS', '23:00:00', '08:00:00', 15, 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Attendance Policies
INSERT INTO attendance_policies (name, late_grace_minutes, early_leave_grace_minutes, overtime_threshold, status) VALUES
('Standard Policy', 15, 15, 8.00, 'active'),
('Flexible Policy', 30, 30, 9.00, 'active'),
('Strict Policy', 5, 5, 8.00, 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- LEAVE MANAGEMENT
-- ============================================================================

-- Leave Types
INSERT INTO leave_types (name, days_per_year, carry_forward, max_carry_forward, status) VALUES
('Annual Leave', 20, 1, 5, 'active'),
('Sick Leave', 10, 0, 0, 'active'),
('Casual Leave', 7, 0, 0, 'active'),
('Maternity Leave', 90, 0, 0, 'active'),
('Paternity Leave', 15, 0, 0, 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- PAYROLL CONFIGURATION
-- ============================================================================

-- Salary Components
INSERT INTO salary_components (name, code, type, calculation_type, amount, percentage, is_taxable, status) VALUES
('Basic Salary', 'BASIC', 'earning', 'percentage', 0, 60.00, 1, 'active'),
('House Rent Allowance', 'HRA', 'earning', 'percentage', 0, 40.00, 1, 'active'),
('Medical Allowance', 'MA', 'earning', 'fixed', 1000.00, 0, 0, 'active'),
('Transport Allowance', 'TA', 'earning', 'fixed', 800.00, 0, 0, 'active'),
('Provident Fund', 'PF', 'deduction', 'percentage', 0, 12.00, 0, 'active'),
('Professional Tax', 'PT', 'deduction', 'fixed', 200.00, 0, 0, 'active'),
('Income Tax', 'IT', 'deduction', 'percentage', 0, 10.00, 0, 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Payment Methods
INSERT INTO payment_methods (name, code, type, requires_bank_details, description, is_default, status) VALUES
('Bank Transfer', 'BANK', 'bank_transfer', 1, 'Direct bank transfer', 1, 'active'),
('Cash', 'CASH', 'cash', 0, 'Cash payment', 0, 'active'),
('Check', 'CHECK', 'check', 1, 'Bank check payment', 0, 'active'),
('Paypal', 'PAYPAL', 'online', 1, 'PayPal transfer', 0, 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Tax Settings
INSERT INTO tax_settings (name, code, tax_type, calculation_method, percentage, threshold_amount, description, is_mandatory, status) VALUES
('Federal Income Tax', 'FIT', 'income_tax', 'percentage', 15.00, 50000.00, 'Federal income tax', 1, 'active'),
('State Tax', 'ST', 'state_tax', 'percentage', 5.00, 30000.00, 'State income tax', 1, 'active'),
('Social Security', 'SS', 'social_security', 'percentage', 6.20, 0, 'Social security contribution', 1, 'active'),
('Medicare', 'MED', 'medicare', 'percentage', 1.45, 0, 'Medicare contribution', 1, 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- RECRUITMENT CONFIGURATION
-- ============================================================================

-- Job Categories
INSERT INTO job_categories (name, description, status) VALUES
('Technology', 'Software and IT positions', 'active'),
('Management', 'Management and leadership roles', 'active'),
('Operations', 'Operational positions', 'active'),
('Sales & Marketing', 'Sales and marketing roles', 'active'),
('Finance & Accounting', 'Finance related positions', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Job Types
INSERT INTO job_types (name, description, status) VALUES
('Full Time', 'Full-time employment', 'active'),
('Part Time', 'Part-time employment', 'active'),
('Contract', 'Contract-based employment', 'active'),
('Intern', 'Internship program', 'active'),
('Freelance', 'Freelance/project-based', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Hiring Stages
INSERT INTO hiring_stages (name, description, status) VALUES
('Application Received', 'Initial application stage', 'active'),
('Resume Screening', 'Resume review stage', 'active'),
('Phone Screening', 'Initial phone interview', 'active'),
('Technical Interview', 'Technical assessment', 'active'),
('HR Interview', 'HR round interview', 'active'),
('Final Interview', 'Final decision interview', 'active'),
('Offer Extended', 'Offer letter sent', 'active'),
('Hired', 'Candidate accepted offer', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- PERFORMANCE CONFIGURATION
-- ============================================================================

-- KPI Indicators
INSERT INTO kpi_indicators (name, description, status) VALUES
('Productivity', 'Work output and efficiency', 'active'),
('Quality', 'Work quality standards', 'active'),
('Attendance', 'Attendance and punctuality', 'active'),
('Team Collaboration', 'Teamwork and cooperation', 'active'),
('Innovation', 'Creative problem solving', 'active'),
('Customer Satisfaction', 'Client feedback scores', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Review Cycles
INSERT INTO review_cycles (name, description, status) VALUES
('Quarterly', 'Every 3 months', 'active'),
('Semi-Annual', 'Every 6 months', 'active'),
('Annual', 'Once per year', 'active'),
('Probation Review', 'End of probation period', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Goal Categories
INSERT INTO goal_categories (name, description, status) VALUES
('Project Goals', 'Project delivery targets', 'active'),
('Learning & Development', 'Skill development goals', 'active'),
('KPI Targets', 'Performance metric goals', 'active'),
('Team Goals', 'Team collaboration objectives', 'active'),
('Personal Development', 'Career growth goals', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- TRAINING CONFIGURATION
-- ============================================================================

-- Training Types
INSERT INTO training_types (name, description, status) VALUES
('Technical Training', 'Technical skill development', 'active'),
('Soft Skills', 'Communication and interpersonal skills', 'active'),
('Leadership', 'Leadership and management training', 'active'),
('Compliance', 'Regulatory and compliance training', 'active'),
('Safety', 'Health and safety training', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- DOCUMENTS CONFIGURATION
-- ============================================================================

-- Document Categories
INSERT INTO document_categories (name, description, status) VALUES
('Identity Documents', 'ID proof and verification', 'active'),
('Educational Certificates', 'Degrees and certifications', 'active'),
('Employment Documents', 'Offer letters and contracts', 'active'),
('Tax Documents', 'Tax forms and declarations', 'active'),
('Insurance Documents', 'Health and life insurance', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Document Types
INSERT INTO document_types (name, description, status) VALUES
('Passport', 'Passport copy', 'active'),
('Driving License', 'Driver license', 'active'),
('Degree Certificate', 'Educational degree', 'active'),
('Experience Letter', 'Previous employment proof', 'active'),
('Tax Form', 'Tax declaration forms', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Company Policies
INSERT INTO company_policies (name, description, status) VALUES
('Code of Conduct', 'Employee code of conduct policy', 'active'),
('Leave Policy', 'Leave and time-off policy', 'active'),
('Remote Work Policy', 'Work from home guidelines', 'active'),
('Travel Policy', 'Business travel guidelines', 'active'),
('Expense Reimbursement', 'Expense claim policy', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- MISC CONFIGURATION
-- ============================================================================

-- Award Types
INSERT INTO award_types (name, description, status) VALUES
('Employee of the Month', 'Monthly excellence award', 'active'),
('Best Performer', 'Top performance recognition', 'active'),
('Innovation Award', 'Creative solutions recognition', 'active'),
('Team Player Award', 'Outstanding collaboration', 'active'),
('Service Award', 'Long service recognition', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Termination Types
INSERT INTO termination_types (name, description, status) VALUES
('Voluntary Resignation', 'Employee initiated resignation', 'active'),
('Retirement', 'Retirement from service', 'active'),
('End of Contract', 'Contract completion', 'active'),
('Termination with Cause', 'Performance or misconduct', 'active'),
('Layoff', 'Business restructuring', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Termination Reasons
INSERT INTO termination_reasons (name, description, status) VALUES
('Better Opportunity', 'Accepted another offer', 'active'),
('Personal Reasons', 'Personal or family reasons', 'active'),
('Relocation', 'Moving to different location', 'active'),
('Career Change', 'Switching career path', 'active'),
('Performance Issues', 'Performance related', 'active'),
('Health Reasons', 'Medical reasons', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Expense Categories
INSERT INTO expense_categories (name, description, status) VALUES
('Travel', 'Business travel expenses', 'active'),
('Meals & Entertainment', 'Client meetings and meals', 'active'),
('Office Supplies', 'Office equipment and supplies', 'active'),
('Training & Development', 'Professional development', 'active'),
('Telecommunications', 'Phone and internet charges', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Expense Limits
INSERT INTO expense_limits (name, description, status) VALUES
('Daily Meal Allowance', 'Per day meal limit', 'active'),
('Monthly Travel Budget', 'Monthly travel expense limit', 'active'),
('Annual Training Budget', 'Yearly training allocation', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Income Categories
INSERT INTO income_categories (name, description, status) VALUES
('Product Sales', 'Software product revenue', 'active'),
('Service Revenue', 'Consulting and services', 'active'),
('Training Income', 'Training and workshops', 'active'),
('License Fees', 'Software licensing', 'active'),
('Support & Maintenance', 'Technical support revenue', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Income Sources
INSERT INTO income_sources (name, description, status) VALUES
('Direct Sales', 'Direct customer sales', 'active'),
('Channel Partners', 'Partner network', 'active'),
('Online Platform', 'E-commerce sales', 'active'),
('Corporate Clients', 'Enterprise customers', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Contract Types
INSERT INTO contract_types (name, description, status) VALUES
('Permanent', 'Permanent employment contract', 'active'),
('Fixed Term', 'Fixed duration contract', 'active'),
('Probation', 'Probationary contract', 'active'),
('Consultant', 'Consulting agreement', 'active'),
('Intern', 'Internship agreement', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Message Templates
INSERT INTO message_templates (name, description, status) VALUES
('Welcome Message', 'New employee welcome', 'active'),
('Birthday Wishes', 'Employee birthday greeting', 'active'),
('Leave Approval', 'Leave approved notification', 'active'),
('Leave Rejection', 'Leave rejected notification', 'active'),
('Meeting Reminder', 'Meeting reminder message', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Notification Settings
INSERT INTO notification_settings (name, description, status) VALUES
('Email Notifications', 'Enable email alerts', 'active'),
('Push Notifications', 'Enable push notifications', 'active'),
('SMS Alerts', 'Enable SMS notifications', 'active'),
('Desktop Notifications', 'Enable desktop alerts', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Leave Policies
INSERT INTO leave_policies (name, description, status) VALUES
('Standard Leave Policy', 'Default leave policy', 'active'),
('Senior Staff Policy', 'Enhanced leave benefits', 'active'),
('Probation Policy', 'Leave policy for probation period', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- SYSTEM SETTINGS
-- ============================================================================

INSERT INTO system_settings (category, setting_key, setting_value, description) VALUES
('general', 'app_name', 'HRMS Go V5', 'Application name'),
('general', 'time_zone', 'UTC', 'Default timezone'),
('general', 'date_format', 'YYYY-MM-DD', 'Date format'),
('general', 'time_format', '24', 'Time format (12/24)'),
('company', 'company_name', 'Your Company', 'Company name'),
('company', 'company_email', 'info@company.com', 'Company email'),
('company', 'company_phone', '+1234567890', 'Company phone'),
('company', 'company_address', '', 'Company address'),
('localization', 'language', 'en', 'Default language'),
('localization', 'currency', 'USD', 'Default currency'),
('localization', 'currency_symbol', '$', 'Currency symbol'),
('email', 'email_enabled', 'false', 'Enable email notifications'),
('email', 'smtp_host', '', 'SMTP host'),
('email', 'smtp_port', '587', 'SMTP port'),
('notifications', 'push_enabled', 'true', 'Enable push notifications'),
('notifications', 'email_notifications', 'true', 'Enable email notifications'),
('security', 'password_min_length', '8', 'Minimum password length'),
('security', 'session_timeout', '60', 'Session timeout in minutes'),
('backup', 'auto_backup', 'false', 'Enable automatic backup')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- ============================================================================
-- SECURITY
-- ============================================================================

-- Roles
INSERT INTO roles (name, code, description, status) VALUES
('Super Admin', 'SUPER_ADMIN', 'Full system access', 'active'),
('HR Manager', 'HR_MANAGER', 'Human resources management', 'active'),
('Department Manager', 'DEPT_MANAGER', 'Department level management', 'active'),
('Team Lead', 'TEAM_LEAD', 'Team leadership access', 'active'),
('Employee', 'EMPLOYEE', 'Regular employee access', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Permissions
INSERT INTO permissions (name, code, module, description, status) VALUES
('View Employees', 'view_employees', 'employees', 'Can view employee list', 'active'),
('Create Employee', 'create_employee', 'employees', 'Can create new employees', 'active'),
('Edit Employee', 'edit_employee', 'employees', 'Can edit employee details', 'active'),
('Delete Employee', 'delete_employee', 'employees', 'Can delete employees', 'active'),
('View Attendance', 'view_attendance', 'attendance', 'Can view attendance records', 'active'),
('Mark Attendance', 'mark_attendance', 'attendance', 'Can mark attendance', 'active'),
('View Leaves', 'view_leaves', 'leaves', 'Can view leave requests', 'active'),
('Apply Leave', 'apply_leave', 'leaves', 'Can apply for leave', 'active'),
('Approve Leaves', 'approve_leaves', 'leaves', 'Can approve leave requests', 'active'),
('View Payroll', 'view_payroll', 'payroll', 'Can view payroll data', 'active'),
('Process Payroll', 'process_payroll', 'payroll', 'Can process payroll', 'active'),
('View Reports', 'view_reports', 'reports', 'Can view reports', 'active'),
('Manage Settings', 'manage_settings', 'settings', 'Can manage system settings', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- DEFAULT USER
-- ============================================================================

-- Default Admin User (password: admin123)
INSERT INTO users (name, email, password, user_type, status) VALUES
('System Administrator', 'admin@hrms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================

