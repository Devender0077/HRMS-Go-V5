-- Quick Sample Data for Dashboard
-- Run this in phpMyAdmin (http://localhost:8080) to add sample data
-- Database: hrms_go_v5

-- Employees
INSERT INTO employees (employee_id, first_name, last_name, email, phone, date_of_birth, gender, joining_date, department_id, branch_id, designation_id, status, employment_type, basic_salary, created_at, updated_at) VALUES
('EMP001', 'John', 'Doe', 'john.doe@hrmsgo.com', '+1234567890', '1990-05-15', 'male', '2024-01-15', 1, 1, 1, 'Active', 'full_time', 75000, NOW(), NOW()),
('EMP002', 'Jane', 'Smith', 'jane.smith@hrmsgo.com', '+1234567891', '1992-08-22', 'female', '2024-02-01', 2, 1, 2, 'Active', 'full_time', 65000, NOW(), NOW()),
('EMP003', 'Mike', 'Johnson', 'mike.johnson@hrmsgo.com', '+1234567892', '1988-12-10', 'male', '2023-06-15', 1, 2, 3, 'Active', 'full_time', 85000, NOW(), NOW()),
('EMP004', 'Sarah', 'Williams', 'sarah.williams@hrmsgo.com', '+1234567893', '1995-03-18', 'female', '2024-03-10', 3, 1, 1, 'Active', 'full_time', 60000, NOW(), NOW()),
('EMP005', 'David', 'Brown', 'david.brown@hrmsgo.com', '+1234567894', '1991-07-25', 'male', '2024-01-20', 2, 2, 2, 'Active', 'full_time', 70000, NOW(), NOW())
ON DUPLICATE KEY UPDATE email=email;

-- Attendance for today
INSERT INTO attendance (employee_id, date, clock_in, clock_out, total_hours, status, created_at, updated_at)
SELECT id, CURDATE(), CONCAT(CURDATE(), ' 09:00:00'), CONCAT(CURDATE(), ' 18:00:00'), 9.0, 'present', NOW(), NOW()
FROM employees WHERE status = 'Active' LIMIT 4
ON DUPLICATE KEY UPDATE status='present';

-- Calendar events
INSERT INTO calendar_events (title, description, start_date, end_date, event_type, created_by, status, created_at, updated_at) VALUES
('Team Meeting', 'Weekly team sync meeting', CONCAT(CURDATE(), ' 10:00:00'), CONCAT(CURDATE(), ' 11:00:00'), 'meeting', 1, 'confirmed', NOW(), NOW()),
('Project Deadline', 'Q4 Project delivery deadline', DATE_ADD(CURDATE(), INTERVAL 7 DAY), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'deadline', 1, 'confirmed', NOW(), NOW()),
('Training Session', 'Leadership development training', DATE_ADD(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'training', 1, 'confirmed', NOW(), NOW()),
('Performance Review', 'Quarterly performance reviews', DATE_ADD(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'review', 1, 'confirmed', NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- Check results
SELECT 'Employees:' as Info, COUNT(*) as Count FROM employees UNION ALL
SELECT 'Attendance Today:', COUNT(*) FROM attendance WHERE date = CURDATE() UNION ALL
SELECT 'Calendar Events:', COUNT(*) FROM calendar_events;

