-- ============================================================================
-- HRMS Go V5 - Complete Sample Data for All Modules
-- ============================================================================
-- This script adds comprehensive sample data for all modules
-- Run this AFTER importing schema.sql and seeds.sql
-- ============================================================================

USE hrms_go_v5;

-- ============================================================================
-- 1. PAYROLL DATA
-- ============================================================================

-- Sample Payroll Runs
INSERT INTO payroll (employee_id, month, year, basic_salary, allowances, deductions, gross_salary, net_salary, total_deductions, status, payment_date, payment_method, created_at, updated_at) VALUES
(1, 10, 2025, 50000.00, 15000.00, 8500.00, 65000.00, 56500.00, 8500.00, 'paid', '2025-10-05', 'bank_transfer', NOW(), NOW()),
(2, 10, 2025, 45000.00, 13000.00, 7400.00, 58000.00, 50600.00, 7400.00, 'paid', '2025-10-05', 'bank_transfer', NOW(), NOW()),
(3, 10, 2025, 60000.00, 18000.00, 10200.00, 78000.00, 67800.00, 10200.00, 'paid', '2025-10-05', 'bank_transfer', NOW(), NOW()),
(4, 10, 2025, 55000.00, 16500.00, 9350.00, 71500.00, 62150.00, 9350.00, 'pending', NULL, 'bank_transfer', NOW(), NOW()),
(5, 10, 2025, 48000.00, 14400.00, 7920.00, 62400.00, 54480.00, 7920.00, 'pending', NULL, 'bank_transfer', NOW(), NOW()),
(1, 9, 2025, 50000.00, 15000.00, 8500.00, 65000.00, 56500.00, 8500.00, 'paid', '2025-09-05', 'bank_transfer', NOW(), NOW()),
(2, 9, 2025, 45000.00, 13000.00, 7400.00, 58000.00, 50600.00, 7400.00, 'paid', '2025-09-05', 'bank_transfer', NOW(), NOW());

-- ============================================================================
-- 2. RECRUITMENT DATA
-- ============================================================================

-- Sample Job Postings (already exist but let's add more)
INSERT INTO job_postings (title, department_id, location, job_type, experience_required, description, requirements, responsibilities, salary_range_min, salary_range_max, openings, deadline, status, posted_by, created_at, updated_at) VALUES
('Backend Developer', 1, 'Remote', 'full-time', '3-5 years', 'We are looking for an experienced Backend Developer.', 'Node.js, Express, MySQL, REST APIs', 'Develop and maintain backend services', 60000.00, 90000.00, 2, '2025-12-31', 'active', 1, NOW(), NOW()),
('HR Coordinator', 2, 'Mumbai', 'full-time', '1-3 years', 'HR Coordinator to support recruitment and employee relations.', 'HR experience, Communication skills', 'Assist in recruitment, onboarding, employee engagement', 35000.00, 50000.00, 1, '2025-11-30', 'active', 1, NOW(), NOW()),
('UI/UX Designer', 1, 'Bangalore', 'contract', '2-4 years', 'Creative UI/UX Designer for web applications.', 'Figma, Adobe XD, User Research', 'Design intuitive interfaces, conduct user research', 45000.00, 70000.00, 1, '2025-12-15', 'active', 1, NOW(), NOW());

-- Sample Job Applications (already exist but let's add more)
INSERT INTO job_applications (job_id, candidate_name, email, phone, resume_url, cover_letter, experience_years, current_company, current_designation, expected_salary, notice_period, status, applied_date, last_updated, created_at, updated_at) VALUES
(1, 'Amit Sharma', 'amit.sharma@email.com', '+91-9876543210', '/uploads/resumes/amit_resume.pdf', 'I am excited to apply for this position...', 4, 'Tech Corp', 'Senior Developer', 75000.00, 30, 'interview', '2025-10-15', NOW(), NOW(), NOW()),
(1, 'Priya Patel', 'priya.patel@email.com', '+91-9876543211', '/uploads/resumes/priya_resume.pdf', 'My experience aligns well...', 5, 'Software Inc', 'Lead Developer', 85000.00, 60, 'screening', '2025-10-18', NOW(), NOW(), NOW()),
(2, 'Rahul Verma', 'rahul.verma@email.com', '+91-9876543212', '/uploads/resumes/rahul_resume.pdf', 'Passionate about HR...', 2, 'People Co', 'HR Assistant', 42000.00, 15, 'applied', '2025-10-20', NOW(), NOW(), NOW()),
(3, 'Sneha Reddy', 'sneha.reddy@email.com', '+91-9876543213', '/uploads/resumes/sneha_resume.pdf', 'Creative designer with passion...', 3, 'Design Studio', 'UI Designer', 55000.00, 30, 'interview', '2025-10-22', NOW(), NOW(), NOW());

-- ============================================================================
-- 3. TRAINING DATA
-- ============================================================================

-- Sample Training Programs
INSERT INTO training_programs (title, description, category, duration_days, max_participants, instructor_name, instructor_email, start_date, end_date, location, mode, cost_per_participant, status, created_by, created_at, updated_at) VALUES
('Leadership Development Program', 'Comprehensive leadership training for managers', 'Leadership', 5, 20, 'Dr. Rajesh Kumar', 'rajesh.kumar@training.com', '2025-11-15', '2025-11-19', 'Conference Hall A', 'offline', 15000.00, 'upcoming', 1, NOW(), NOW()),
('Advanced Excel & Data Analysis', 'Master Excel and data analysis techniques', 'Technical', 3, 30, 'Anjali Mehta', 'anjali.mehta@training.com', '2025-11-05', '2025-11-07', 'Training Room 2', 'hybrid', 8000.00, 'upcoming', 1, NOW(), NOW()),
('Effective Communication Skills', 'Improve workplace communication', 'Soft Skills', 2, 25, 'Vikram Singh', 'vikram.singh@training.com', '2025-10-25', '2025-10-26', 'Online', 'online', 5000.00, 'ongoing', 1, NOW(), NOW()),
('Project Management Fundamentals', 'Learn project management basics and PMP prep', 'Management', 10, 15, 'Suman Agarwal', 'suman.agarwal@training.com', '2025-12-01', '2025-12-10', 'Training Center', 'offline', 25000.00, 'upcoming', 1, NOW(), NOW()),
('Cybersecurity Awareness', 'Essential cybersecurity practices for employees', 'Security', 1, 50, 'Karthik Reddy', 'karthik.reddy@training.com', '2025-10-20', '2025-10-20', 'Online', 'online', 2000.00, 'completed', 1, NOW(), NOW());

-- ============================================================================
-- 4. PERFORMANCE DATA
-- ============================================================================

-- Sample Performance Goals
INSERT INTO performance_goals (employee_id, title, description, category, target_value, current_value, unit, start_date, end_date, weight, status, progress, created_by, created_at, updated_at) VALUES
(1, 'Complete Backend Refactoring', 'Refactor legacy backend code to modern architecture', 'technical', 100, 65, 'percentage', '2025-10-01', '2025-12-31', 30, 'in_progress', 65, 3, NOW(), NOW()),
(1, 'Reduce API Response Time', 'Optimize APIs to reduce average response time', 'performance', 200, 180, 'milliseconds', '2025-10-01', '2025-11-30', 25, 'in_progress', 72, 3, NOW(), NOW()),
(2, 'Recruitment Target Q4', 'Hire 10 qualified candidates by end of Q4', 'recruitment', 10, 6, 'count', '2025-10-01', '2025-12-31', 40, 'in_progress', 60, 3, NOW(), NOW()),
(3, 'Sales Revenue Target', 'Achieve sales revenue of 50L', 'sales', 5000000, 3200000, 'currency', '2025-10-01', '2025-12-31', 50, 'in_progress', 64, 3, NOW(), NOW()),
(4, 'Customer Satisfaction Score', 'Maintain CSAT score above 4.5/5', 'customer_service', 4.5, 4.7, 'rating', '2025-10-01', '2025-12-31', 35, 'in_progress', 94, 3, NOW(), NOW());

-- ============================================================================
-- 5. ASSETS DATA
-- ============================================================================

-- Sample Asset Categories (if not exists)
INSERT INTO asset_categories (name, description, status, created_at, updated_at) VALUES
('Laptops', 'Company laptops and notebooks', 'active', NOW(), NOW()),
('Monitors', 'Computer monitors and displays', 'active', NOW(), NOW()),
('Furniture', 'Office furniture and equipment', 'active', NOW(), NOW()),
('Mobile Devices', 'Smartphones and tablets', 'active', NOW(), NOW()),
('Vehicles', 'Company vehicles', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = name;

-- Sample Assets
INSERT INTO assets (name, asset_code, category_id, description, purchase_date, purchase_cost, current_value, depreciation_rate, warranty_expiry, location, status, created_at, updated_at) VALUES
('Dell Latitude 5420 Laptop', 'LT-2025-001', 1, 'Intel i7, 16GB RAM, 512GB SSD', '2025-01-15', 85000.00, 80000.00, 15, '2028-01-15', 'IT Department', 'available', NOW(), NOW()),
('Dell Latitude 5420 Laptop', 'LT-2025-002', 1, 'Intel i7, 16GB RAM, 512GB SSD', '2025-01-15', 85000.00, 80000.00, 15, '2028-01-15', 'IT Department', 'assigned', NOW(), NOW()),
('HP 27" Monitor', 'MON-2025-001', 2, '27 inch 4K Monitor', '2025-02-01', 25000.00, 24000.00, 10, '2028-02-01', 'IT Department', 'available', NOW(), NOW()),
('MacBook Pro 16"', 'LT-2025-003', 1, 'M2 Pro, 32GB RAM, 1TB SSD', '2025-03-10', 250000.00, 240000.00, 12, '2028-03-10', 'Development Team', 'assigned', NOW(), NOW()),
('iPhone 14 Pro', 'MOB-2025-001', 4, '256GB Space Black', '2025-04-05', 120000.00, 110000.00, 20, '2026-04-05', 'Sales Department', 'assigned', NOW(), NOW()),
('Office Desk & Chair', 'FURN-2025-001', 3, 'Ergonomic desk and chair set', '2025-01-10', 35000.00, 33000.00, 8, NULL, 'Office Floor 2', 'assigned', NOW(), NOW()),
('Toyota Innova', 'VEH-2025-001', 5, 'Company vehicle for client visits', '2024-06-15', 1800000.00, 1650000.00, 10, '2027-06-15', 'Transport Pool', 'available', NOW(), NOW());

-- Sample Asset Assignments
INSERT INTO asset_assignments (asset_id, employee_id, assigned_date, expected_return_date, return_date, condition_at_assignment, condition_at_return, notes, status, created_at, updated_at) VALUES
(2, 1, '2025-01-20', NULL, NULL, 'excellent', NULL, 'Assigned for development work', 'active', NOW(), NOW()),
(4, 2, '2025-03-15', NULL, NULL, 'excellent', NULL, 'Assigned to HR Manager', 'active', NOW(), NOW()),
(5, 3, '2025-04-10', NULL, NULL, 'excellent', NULL, 'Assigned for sales activities', 'active', NOW(), NOW()),
(6, 4, '2025-01-15', NULL, NULL, 'good', NULL, 'Workstation setup', 'active', NOW(), NOW());

-- ============================================================================
-- 6. DOCUMENTS DATA
-- ============================================================================

-- Sample Company Documents Library
INSERT INTO documents (title, description, category, file_name, file_path, file_type, file_size, uploaded_by, access_level, tags, version, status, is_template, created_at, updated_at) VALUES
('Employee Handbook 2025', 'Complete employee handbook with policies', 'Policy', 'employee_handbook_2025.pdf', '/uploads/documents/handbook_2025.pdf', 'application/pdf', 2458624, 1, 'all', 'handbook,policy,guidelines', '2.0', 'active', 1, NOW(), NOW()),
('Leave Policy', 'Comprehensive leave policy document', 'Policy', 'leave_policy.pdf', '/uploads/documents/leave_policy.pdf', 'application/pdf', 524288, 1, 'all', 'leave,policy,hr', '1.5', 'active', 1, NOW(), NOW()),
('Code of Conduct', 'Employee code of conduct guidelines', 'Policy', 'code_of_conduct.pdf', '/uploads/documents/code_of_conduct.pdf', 'application/pdf', 1048576, 1, 'all', 'conduct,ethics,policy', '1.0', 'active', 1, NOW(), NOW()),
('Onboarding Checklist Template', 'Template for new employee onboarding', 'Template', 'onboarding_checklist.xlsx', '/uploads/documents/onboarding_template.xlsx', 'application/xlsx', 102400, 1, 'hr', 'onboarding,template,hr', '1.0', 'active', 1, NOW(), NOW()),
('Performance Review Form', 'Annual performance review template', 'Template', 'performance_review.docx', '/uploads/documents/performance_review.docx', 'application/docx', 204800, 1, 'manager', 'performance,review,template', '2.0', 'active', 1, NOW(), NOW()),
('IT Security Guidelines', 'Information technology security protocols', 'Guidelines', 'it_security.pdf', '/uploads/documents/it_security.pdf', 'application/pdf', 819200, 1, 'all', 'security,it,guidelines', '1.2', 'active', 0, NOW(), NOW());

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT '✅ Sample data added successfully for all modules!' AS Status;
SELECT 'Total records added:' AS Info;
SELECT 
    (SELECT COUNT(*) FROM payroll WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Payroll,
    (SELECT COUNT(*) FROM job_postings WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Job_Postings,
    (SELECT COUNT(*) FROM job_applications WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Applications,
    (SELECT COUNT(*) FROM training_programs WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Training_Programs,
    (SELECT COUNT(*) FROM performance_goals WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Performance_Goals,
    (SELECT COUNT(*) FROM assets WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Assets,
    (SELECT COUNT(*) FROM asset_assignments WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Asset_Assignments,
    (SELECT COUNT(*) FROM documents WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Documents;

