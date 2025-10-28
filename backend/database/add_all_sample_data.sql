-- ============================================================================
-- HRMS Go V5 - Complete Sample Data for All Modules
-- ============================================================================
-- This script adds comprehensive sample data matching exact Sequelize models
-- Run this AFTER importing schema.sql and seeds.sql
-- ============================================================================

USE hrms_go_v5;

-- ============================================================================
-- 1. PAYROLL DATA (Table: payrolls)
-- ============================================================================

INSERT INTO payrolls (employee_id, month, year, basic_salary, gross_salary, total_deductions, net_salary, status, paid_at, created_at, updated_at) VALUES
(1, 10, 2025, 50000.00, 65000.00, 8500.00, 56500.00, 'paid', '2025-10-05', NOW(), NOW()),
(2, 10, 2025, 45000.00, 58000.00, 7400.00, 50600.00, 'paid', '2025-10-05', NOW(), NOW()),
(3, 10, 2025, 60000.00, 78000.00, 10200.00, 67800.00, 'paid', '2025-10-05', NOW(), NOW()),
(4, 10, 2025, 55000.00, 71500.00, 9350.00, 62150.00, 'approved', NULL, NOW(), NOW()),
(5, 10, 2025, 48000.00, 62400.00, 7920.00, 54480.00, 'draft', NULL, NOW(), NOW()),
(6, 10, 2025, 52000.00, 67600.00, 8840.00, 58760.00, 'paid', '2025-10-05', NOW(), NOW()),
(7, 10, 2025, 47000.00, 61100.00, 7987.00, 53113.00, 'paid', '2025-10-05', NOW(), NOW()),
(8, 10, 2025, 51000.00, 66300.00, 8673.00, 57627.00, 'paid', '2025-10-05', NOW(), NOW()),
(1, 9, 2025, 50000.00, 65000.00, 8500.00, 56500.00, 'paid', '2025-09-05', NOW(), NOW()),
(2, 9, 2025, 45000.00, 58000.00, 7400.00, 50600.00, 'paid', '2025-09-05', NOW(), NOW()),
(3, 9, 2025, 60000.00, 78000.00, 10200.00, 67800.00, 'paid', '2025-09-05', NOW(), NOW()),
(4, 9, 2025, 55000.00, 71500.00, 9350.00, 62150.00, 'paid', '2025-09-05', NOW(), NOW());

-- ============================================================================
-- 2. RECRUITMENT DATA
-- ============================================================================

-- Job Postings (Exact model: employment_type, salary_range, positions, status: open/closed/on_hold)
INSERT INTO job_postings (title, department_id, location, employment_type, experience_required, salary_range, positions, description, requirements, status, posted_date, closing_date, created_at, updated_at) VALUES
('Senior Backend Developer', 1, 'Remote', 'full_time', '3-5 years', '₹60,000 - ₹90,000', 2, 'We are looking for an experienced Backend Developer to join our growing team. You will be responsible for building scalable backend services and mentoring junior developers.', 'Node.js, Express, MySQL, REST APIs, AWS, Docker, Git', 'open', '2025-10-15', '2025-12-31', NOW(), NOW()),
('HR Coordinator', 2, 'Mumbai', 'full_time', '1-3 years', '₹35,000 - ₹50,000', 1, 'HR Coordinator to support recruitment and employee relations. Must have excellent communication skills and experience with HRIS systems.', 'HR experience, Communication skills, MS Office, HRIS knowledge', 'open', '2025-10-18', '2025-11-30', NOW(), NOW()),
('UI/UX Designer', 1, 'Bangalore', 'contract', '2-4 years', '₹45,000 - ₹70,000', 1, 'Creative UI/UX Designer for web and mobile applications. Must have strong portfolio and user-centered design approach.', 'Figma, Adobe XD, User Research, Wireframing, Prototyping, HTML/CSS basics', 'open', '2025-10-20', '2025-12-15', NOW(), NOW()),
('DevOps Engineer', 1, 'Hyderabad', 'full_time', '3-5 years', '₹70,000 - ₹1,00,000', 1, 'DevOps Engineer to manage CI/CD pipelines and cloud infrastructure. Experience with containerization and orchestration required.', 'Docker, Kubernetes, AWS/Azure, Jenkins, Linux, Terraform, CI/CD', 'open', '2025-10-22', '2025-12-20', NOW(), NOW());

-- Job Applications (Exact model: experience, resume_path, applied_date, notes)
-- Fields in model: job_id, candidate_name, email, phone, experience, current_company, resume_path, cover_letter, status, applied_date, notes
INSERT INTO job_applications (job_id, candidate_name, email, phone, experience, current_company, resume_path, cover_letter, status, applied_date, notes, created_at, updated_at) VALUES
(1, 'Amit Sharma', 'amit.sharma@email.com', '+91-9876543210', 4, 'Tech Corp India', '/uploads/resumes/amit_resume.pdf', 'I am excited to apply for the Backend Developer position. With 4 years of experience in Node.js and Express, I believe I can contribute significantly to your team.', 'interview', '2025-10-15', 'Strong technical background. Scheduled for technical round.', NOW(), NOW()),
(1, 'Priya Patel', 'priya.patel@email.com', '+91-9876543211', 5, 'Software Solutions Inc', '/uploads/resumes/priya_resume.pdf', 'My experience in backend development aligns well with your requirements. I have worked extensively with MySQL and AWS.', 'screening', '2025-10-18', 'Resume under review by technical team.', NOW(), NOW()),
(2, 'Rahul Verma', 'rahul.verma@email.com', '+91-9876543212', 2, 'People Co', '/uploads/resumes/rahul_resume.pdf', 'Passionate about HR and employee engagement. I have 2 years of experience in recruitment and onboarding.', 'applied', '2025-10-20', 'New application pending initial screening.', NOW(), NOW()),
(3, 'Sneha Reddy', 'sneha.reddy@email.com', '+91-9876543213', 3, 'Design Studio', '/uploads/resumes/sneha_resume.pdf', 'Creative designer with a passion for creating intuitive user experiences. My portfolio showcases various web and mobile projects.', 'interview', '2025-10-22', 'Portfolio review completed. Scheduled for design challenge.', NOW(), NOW()),
(4, 'Karthik Krishnan', 'karthik.k@email.com', '+91-9876543214', 4, 'Cloud Systems Ltd', '/uploads/resumes/karthik_resume.pdf', 'DevOps professional with expertise in Docker, Kubernetes, and AWS. I have managed large-scale deployments.', 'screening', '2025-10-25', 'Strong DevOps experience. Under HR review.', NOW(), NOW()),
(1, 'Anjali Gupta', 'anjali.gupta@email.com', '+91-9876543215', 3, 'StartupXYZ', '/uploads/resumes/anjali_resume.pdf', 'Full-stack developer with strong backend skills. Looking for challenging opportunities.', 'applied', '2025-10-26', 'Application received. Pending review.', NOW(), NOW());

-- ============================================================================
-- 3. TRAINING DATA (Table: training_programs)
-- ============================================================================

INSERT INTO training_programs (title, description, category, duration_days, max_participants, instructor_name, instructor_email, start_date, end_date, location, mode, cost_per_participant, status, created_by, created_at, updated_at) VALUES
('Leadership Development Program', 'Comprehensive leadership training for managers and senior employees. Covers strategic thinking, team management, and decision making.', 'Leadership', 5, 20, 'Dr. Rajesh Kumar', 'rajesh.kumar@training.com', '2025-11-15', '2025-11-19', 'Conference Hall A', 'offline', 15000.00, 'upcoming', 1, NOW(), NOW()),
('Advanced Excel & Data Analysis', 'Master Excel and data analysis techniques. Learn pivot tables, VLOOKUP, macros, and data visualization.', 'Technical', 3, 30, 'Anjali Mehta', 'anjali.mehta@training.com', '2025-11-05', '2025-11-07', 'Training Room 2', 'hybrid', 8000.00, 'upcoming', 1, NOW(), NOW()),
('Effective Communication Skills', 'Improve workplace communication, presentation skills, and interpersonal relationships.', 'Soft Skills', 2, 25, 'Vikram Singh', 'vikram.singh@training.com', '2025-10-25', '2025-10-26', 'Online', 'online', 5000.00, 'ongoing', 1, NOW(), NOW()),
('Project Management Fundamentals', 'Learn project management basics, methodologies (Agile, Waterfall), and PMP certification prep.', 'Management', 10, 15, 'Suman Agarwal', 'suman.agarwal@training.com', '2025-12-01', '2025-12-10', 'Training Center', 'offline', 25000.00, 'upcoming', 1, NOW(), NOW()),
('Cybersecurity Awareness', 'Essential cybersecurity practices for employees. Learn about threats, data protection, and safe browsing.', 'Security', 1, 50, 'Karthik Reddy', 'karthik.reddy@training.com', '2025-10-20', '2025-10-20', 'Online', 'online', 2000.00, 'completed', 1, NOW(), NOW()),
('Time Management & Productivity', 'Learn effective time management techniques to boost productivity and work-life balance.', 'Soft Skills', 2, 30, 'Meera Iyer', 'meera.iyer@training.com', '2025-11-10', '2025-11-11', 'Training Room 1', 'offline', 6000.00, 'upcoming', 1, NOW(), NOW()),
('SQL for Data Analysis', 'Comprehensive SQL training covering queries, joins, subqueries, and database optimization.', 'Technical', 5, 20, 'Arjun Nair', 'arjun.nair@training.com', '2025-11-20', '2025-11-24', 'Lab 3', 'offline', 12000.00, 'upcoming', 1, NOW(), NOW());

-- ============================================================================
-- 4. PERFORMANCE DATA (Table: performance_goals)
-- ============================================================================

INSERT INTO performance_goals (employee_id, title, description, category, target_value, current_value, unit, start_date, end_date, weight, status, progress, created_by, created_at, updated_at) VALUES
(1, 'Complete Backend Refactoring', 'Refactor legacy backend code to modern architecture using best practices and design patterns', 'technical', 100, 65, 'percentage', '2025-10-01', '2025-12-31', 30, 'in_progress', 65, 3, NOW(), NOW()),
(1, 'Reduce API Response Time', 'Optimize APIs to reduce average response time from 500ms to 200ms', 'performance', 200, 280, 'milliseconds', '2025-10-01', '2025-11-30', 25, 'in_progress', 56, 3, NOW(), NOW()),
(2, 'Recruitment Target Q4', 'Successfully hire 10 qualified candidates by end of Q4 2025', 'recruitment', 10, 6, 'count', '2025-10-01', '2025-12-31', 40, 'in_progress', 60, 3, NOW(), NOW()),
(2, 'Employee Satisfaction Score', 'Achieve employee satisfaction score of 4.5/5 in quarterly survey', 'engagement', 4.5, 4.2, 'rating', '2025-10-01', '2025-12-31', 30, 'in_progress', 84, 3, NOW(), NOW()),
(3, 'Sales Revenue Target', 'Achieve sales revenue target of ₹50 lakhs in Q4', 'sales', 5000000, 3200000, 'currency', '2025-10-01', '2025-12-31', 50, 'in_progress', 64, 3, NOW(), NOW()),
(4, 'Customer Satisfaction Score', 'Maintain CSAT score above 4.5/5 throughout the quarter', 'customer_service', 4.5, 4.7, 'rating', '2025-10-01', '2025-12-31', 35, 'in_progress', 94, 3, NOW(), NOW()),
(5, 'Complete Certifications', 'Complete AWS Solutions Architect and AWS Developer certifications', 'learning', 2, 1, 'count', '2025-10-01', '2025-12-31', 20, 'in_progress', 50, 3, NOW(), NOW()),
(6, 'Process Improvement', 'Document and optimize 5 core HR processes', 'process', 5, 3, 'count', '2025-10-01', '2025-12-31', 25, 'in_progress', 60, 3, NOW(), NOW());

-- ============================================================================
-- 5. ASSETS DATA
-- ============================================================================

-- Asset Categories (if not exists)
INSERT INTO asset_categories (name, description, status, created_at, updated_at) VALUES
('Laptops', 'Company laptops and notebooks', 'active', NOW(), NOW()),
('Monitors', 'Computer monitors and displays', 'active', NOW(), NOW()),
('Furniture', 'Office furniture and equipment', 'active', NOW(), NOW()),
('Mobile Devices', 'Smartphones and tablets', 'active', NOW(), NOW()),
('Vehicles', 'Company vehicles', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = name;

-- Assets
INSERT INTO assets (name, asset_code, category_id, description, purchase_date, purchase_cost, current_value, depreciation_rate, warranty_expiry, location, status, created_at, updated_at) VALUES
('Dell Latitude 5420 Laptop', 'LT-2025-001', 1, 'Intel i7 11th Gen, 16GB RAM, 512GB SSD', '2025-01-15', 85000.00, 80000.00, 15, '2028-01-15', 'IT Department', 'available', NOW(), NOW()),
('Dell Latitude 5420 Laptop', 'LT-2025-002', 1, 'Intel i7 11th Gen, 16GB RAM, 512GB SSD', '2025-01-15', 85000.00, 80000.00, 15, '2028-01-15', 'Development Team', 'assigned', NOW(), NOW()),
('HP 27" 4K Monitor', 'MON-2025-001', 2, '27 inch 4K IPS Display, USB-C', '2025-02-01', 25000.00, 24000.00, 10, '2028-02-01', 'IT Department', 'available', NOW(), NOW()),
('MacBook Pro 16" M2', 'LT-2025-003', 1, 'M2 Pro Chip, 32GB RAM, 1TB SSD', '2025-03-10', 250000.00, 240000.00, 12, '2028-03-10', 'Development Team', 'assigned', NOW(), NOW()),
('iPhone 14 Pro', 'MOB-2025-001', 4, '256GB, Space Black, Corporate Plan', '2025-04-05', 120000.00, 110000.00, 20, '2026-04-05', 'Sales Department', 'assigned', NOW(), NOW()),
('Ergonomic Desk & Chair Set', 'FURN-2025-001', 3, 'Height-adjustable desk with ergonomic chair', '2025-01-10', 35000.00, 33000.00, 8, NULL, 'Office Floor 2, Desk 42', 'assigned', NOW(), NOW()),
('Toyota Innova Crysta', 'VEH-2025-001', 5, '2024 Model, Diesel, Company vehicle for client visits', '2024-06-15', 1800000.00, 1650000.00, 10, '2027-06-15', 'Transport Pool', 'available', NOW(), NOW()),
('Lenovo ThinkPad X1', 'LT-2025-004', 1, 'Intel i5, 16GB RAM, 256GB SSD', '2025-02-20', 65000.00, 62000.00, 15, '2028-02-20', 'HR Department', 'assigned', NOW(), NOW()),
('Samsung 24" Monitor', 'MON-2025-002', 2, '24 inch Full HD, HDMI', '2025-03-15', 15000.00, 14500.00, 10, '2028-03-15', 'Finance Department', 'assigned', NOW(), NOW()),
('iPad Pro 12.9"', 'MOB-2025-002', 4, '256GB, Wi-Fi + Cellular, Space Gray', '2025-05-10', 95000.00, 90000.00, 20, '2026-05-10', 'Marketing Department', 'assigned', NOW(), NOW());

-- Asset Assignments
INSERT INTO asset_assignments (asset_id, employee_id, assigned_date, expected_return_date, return_date, condition_at_assignment, condition_at_return, notes, status, created_at, updated_at) VALUES
(2, 1, '2025-01-20', NULL, NULL, 'excellent', NULL, 'Assigned for backend development work', 'active', NOW(), NOW()),
(4, 2, '2025-03-15', NULL, NULL, 'excellent', NULL, 'Assigned to HR Manager for department operations', 'active', NOW(), NOW()),
(5, 3, '2025-04-10', NULL, NULL, 'excellent', NULL, 'Assigned for sales activities and client communication', 'active', NOW(), NOW()),
(6, 4, '2025-01-15', NULL, NULL, 'good', NULL, 'Workstation setup for team lead', 'active', NOW(), NOW()),
(8, 5, '2025-02-25', NULL, NULL, 'excellent', NULL, 'Development laptop for new project', 'active', NOW(), NOW()),
(9, 6, '2025-03-20', NULL, NULL, 'good', NULL, 'Monitor for finance workstation', 'active', NOW(), NOW()),
(10, 7, '2025-05-15', NULL, NULL, 'excellent', NULL, 'iPad for marketing presentations', 'active', NOW(), NOW());

-- ============================================================================
-- 6. DOCUMENTS DATA
-- ============================================================================

-- Company Documents Library
INSERT INTO documents (title, description, category, file_name, file_path, file_type, file_size, uploaded_by, access_level, tags, version, status, is_template, created_at, updated_at) VALUES
('Employee Handbook 2025', 'Complete employee handbook with company policies, benefits, code of conduct, and guidelines', 'Policy', 'employee_handbook_2025.pdf', '/uploads/documents/handbook_2025.pdf', 'application/pdf', 2458624, 1, 'all', 'handbook,policy,guidelines,2025', '2.0', 'active', 1, NOW(), NOW()),
('Leave Policy', 'Comprehensive leave policy document covering all types of leaves, eligibility, and application process', 'Policy', 'leave_policy.pdf', '/uploads/documents/leave_policy.pdf', 'application/pdf', 524288, 1, 'all', 'leave,policy,hr,benefits', '1.5', 'active', 1, NOW(), NOW()),
('Code of Conduct', 'Employee code of conduct guidelines covering professional behavior, ethics, and workplace standards', 'Policy', 'code_of_conduct.pdf', '/uploads/documents/code_of_conduct.pdf', 'application/pdf', 1048576, 1, 'all', 'conduct,ethics,policy,standards', '1.0', 'active', 1, NOW(), NOW()),
('Onboarding Checklist Template', 'Comprehensive template for new employee onboarding process', 'Template', 'onboarding_checklist.xlsx', '/uploads/documents/onboarding_template.xlsx', 'application/xlsx', 102400, 1, 'hr', 'onboarding,template,hr,checklist', '1.0', 'active', 1, NOW(), NOW()),
('Performance Review Form', 'Annual performance review template with rating scales and competency assessment', 'Template', 'performance_review.docx', '/uploads/documents/performance_review.docx', 'application/docx', 204800, 1, 'manager', 'performance,review,template,evaluation', '2.0', 'active', 1, NOW(), NOW()),
('IT Security Guidelines', 'Information technology security protocols, password policies, and data protection guidelines', 'Guidelines', 'it_security.pdf', '/uploads/documents/it_security.pdf', 'application/pdf', 819200, 1, 'all', 'security,it,guidelines,policy', '1.2', 'active', 0, NOW(), NOW()),
('Remote Work Policy', 'Guidelines for remote work including eligibility, equipment, security, and communication expectations', 'Policy', 'remote_work_policy.pdf', '/uploads/documents/remote_work.pdf', 'application/pdf', 655360, 1, 'all', 'remote,work,policy,wfh', '1.0', 'active', 1, NOW(), NOW()),
('Travel & Expense Policy', 'Company travel policy and expense reimbursement guidelines', 'Policy', 'travel_expense_policy.pdf', '/uploads/documents/travel_expense.pdf', 'application/pdf', 450000, 1, 'all', 'travel,expense,policy,reimbursement', '1.1', 'active', 1, NOW(), NOW());

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT '✅ Sample data added successfully for all modules!' AS Status;
SELECT 'Total records added in this session:' AS Info;
SELECT 
    (SELECT COUNT(*) FROM payrolls WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Payroll,
    (SELECT COUNT(*) FROM job_postings WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Job_Postings,
    (SELECT COUNT(*) FROM job_applications WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Applications,
    (SELECT COUNT(*) FROM training_programs WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Training_Programs,
    (SELECT COUNT(*) FROM performance_goals WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Performance_Goals,
    (SELECT COUNT(*) FROM assets WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Assets,
    (SELECT COUNT(*) FROM asset_assignments WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Asset_Assignments,
    (SELECT COUNT(*) FROM documents WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS Documents;
