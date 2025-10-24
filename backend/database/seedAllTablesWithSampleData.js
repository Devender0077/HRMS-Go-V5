const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedAllTables() {
  let connection;
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║              SEEDING ALL TABLES WITH SAMPLE DATA                           ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'hrms_go_v5'
    });

    console.log('✓ Connected to database\n');

    // 1. DEPARTMENTS (if empty)
    const [[{deptCount}]] = await connection.query('SELECT COUNT(*) as deptCount FROM departments');
    if (deptCount < 5) {
      console.log('⏳ Seeding Departments...');
      await connection.query(`
        INSERT IGNORE INTO departments (id, name, code, manager_id, description, status, created_at, updated_at) VALUES
        (1, 'Engineering', 'ENG', NULL, 'Software Development Team', 'active', NOW(), NOW()),
        (2, 'Human Resources', 'HR', NULL, 'HR Department', 'active', NOW(), NOW()),
        (3, 'Finance', 'FIN', NULL, 'Finance and Accounting', 'active', NOW(), NOW()),
        (4, 'Sales', 'SALES', NULL, 'Sales Team', 'active', NOW(), NOW()),
        (5, 'Marketing', 'MKT', NULL, 'Marketing Department', 'active', NOW(), NOW())
      `);
      console.log('✅ Departments seeded\n');
    }

    // 2. BRANCHES (if empty)
    const [[{branchCount}]] = await connection.query('SELECT COUNT(*) as branchCount FROM branches');
    if (branchCount < 3) {
      console.log('⏳ Seeding Branches...');
      await connection.query(`
        INSERT IGNORE INTO branches (id, name, code, address, city, state, country, phone, email, status, created_at, updated_at) VALUES
        (1, 'Headquarters', 'HQ', '123 Main St', 'New York', 'NY', 'USA', '+1234567890', 'hq@hrmsgo.com', 'active', NOW(), NOW()),
        (2, 'Branch Office East', 'EAST', '456 East Ave', 'Boston', 'MA', 'USA', '+1234567891', 'east@hrmsgo.com', 'active', NOW(), NOW()),
        (3, 'Branch Office West', 'WEST', '789 West Blvd', 'Los Angeles', 'CA', 'USA', '+1234567892', 'west@hrmsgo.com', 'active', NOW(), NOW())
      `);
      console.log('✅ Branches seeded\n');
    }

    // 3. DESIGNATIONS (if empty)
    const [[{desigCount}]] = await connection.query('SELECT COUNT(*) as desigCount FROM designations');
    if (desigCount < 5) {
      console.log('⏳ Seeding Designations...');
      await connection.query(`
        INSERT IGNORE INTO designations (id, name, code, department_id, level, description, status, created_at, updated_at) VALUES
        (1, 'Senior Software Engineer', 'SSE', 1, 3, 'Senior developer role', 'active', NOW(), NOW()),
        (2, 'HR Manager', 'HRM', 2, 4, 'HR management role', 'active', NOW(), NOW()),
        (3, 'Accountant', 'ACC', 3, 2, 'Finance team member', 'active', NOW(), NOW()),
        (4, 'Sales Executive', 'SLS', 4, 1, 'Sales representative', 'active', NOW(), NOW()),
        (5, 'Marketing Specialist', 'MKT', 5, 2, 'Marketing team member', 'active', NOW(), NOW())
      `);
      console.log('✅ Designations seeded\n');
    }

    // 4. EMPLOYEES (if empty or less than 10)
    const [[{empCount}]] = await connection.query('SELECT COUNT(*) as empCount FROM employees');
    if (empCount < 10) {
      console.log('⏳ Seeding Employees...');
      await connection.query(`
        INSERT IGNORE INTO employees 
        (employee_id, first_name, last_name, email, phone, department_id, designation_id, branch_id, 
         joining_date, employment_type, status, created_at, updated_at) 
        VALUES
        ('EMP001', 'John', 'Doe', 'john.doe@hrmsgo.com', '+1111111111', 1, 1, 1, '2024-01-15', 'full_time', 'active', NOW(), NOW()),
        ('EMP002', 'Jane', 'Smith', 'jane.smith@hrmsgo.com', '+1111111112', 2, 2, 1, '2024-02-01', 'full_time', 'active', NOW(), NOW()),
        ('EMP003', 'Bob', 'Johnson', 'bob.johnson@hrmsgo.com', '+1111111113', 1, 1, 1, '2024-03-10', 'full_time', 'active', NOW(), NOW()),
        ('EMP004', 'Sarah', 'Williams', 'sarah.williams@hrmsgo.com', '+1111111114', 3, 3, 2, '2024-01-20', 'full_time', 'active', NOW(), NOW()),
        ('EMP005', 'David', 'Brown', 'david.brown@hrmsgo.com', '+1111111115', 4, 4, 2, '2024-02-15', 'full_time', 'active', NOW(), NOW()),
        ('EMP006', 'Emily', 'Davis', 'emily.davis@hrmsgo.com', '+1111111116', 5, 5, 3, '2024-03-01', 'full_time', 'active', NOW(), NOW()),
        ('EMP007', 'Robert', 'Miller', 'robert.miller@hrmsgo.com', '+1111111117', 1, 1, 1, '2024-04-01', 'contract', 'active', NOW(), NOW()),
        ('EMP008', 'Lisa', 'Anderson', 'lisa.anderson@hrmsgo.com', '+1111111118', 2, 2, 1, '2024-04-15', 'full_time', 'active', NOW(), NOW()),
        ('EMP009', 'Michael', 'Taylor', 'michael.taylor@hrmsgo.com', '+1111111119', 3, 3, 2, '2024-05-01', 'full_time', 'active', NOW(), NOW()),
        ('EMP010', 'Jennifer', 'Thomas', 'jennifer.thomas@hrmsgo.com', '+1111111120', 4, 4, 3, '2024-05-15', 'part_time', 'active', NOW(), NOW())
      `);
      console.log('✅ Employees seeded\n');
    }

    // 5. LEAVE TYPES (if empty)
    const [[{leaveTypeCount}]] = await connection.query('SELECT COUNT(*) as leaveTypeCount FROM leave_types');
    if (leaveTypeCount < 5) {
      console.log('⏳ Seeding Leave Types...');
      await connection.query(`
        INSERT IGNORE INTO leave_types (id, name, code, days_per_year, max_carry_forward, color, description, status, created_at, updated_at) VALUES
        (1, 'Annual Leave', 'AL', 20, 5, '#4CAF50', 'Annual vacation leave', 'active', NOW(), NOW()),
        (2, 'Sick Leave', 'SL', 12, 3, '#FF9800', 'Medical leave', 'active', NOW(), NOW()),
        (3, 'Casual Leave', 'CL', 7, 0, '#2196F3', 'Short-term casual leave', 'active', NOW(), NOW()),
        (4, 'Maternity Leave', 'ML', 90, 0, '#E91E63', 'Maternity leave', 'active', NOW(), NOW()),
        (5, 'Paternity Leave', 'PL', 14, 0, '#9C27B0', 'Paternity leave', 'active', NOW(), NOW())
      `);
      console.log('✅ Leave Types seeded\n');
    }

    // 6. SHIFTS (if empty)
    const [[{shiftCount}]] = await connection.query('SELECT COUNT(*) as shiftCount FROM shifts');
    if (shiftCount < 3) {
      console.log('⏳ Seeding Shifts...');
      await connection.query(`
        INSERT IGNORE INTO shifts (id, name, code, start_time, end_time, break_duration, total_hours, status, created_at, updated_at) VALUES
        (1, 'Morning Shift', 'MS', '09:00:00', '18:00:00', 60, 8, 'active', NOW(), NOW()),
        (2, 'Evening Shift', 'ES', '14:00:00', '23:00:00', 60, 8, 'active', NOW(), NOW()),
        (3, 'Night Shift', 'NS', '22:00:00', '07:00:00', 60, 8, 'active', NOW(), NOW())
      `);
      console.log('✅ Shifts seeded\n');
    }

    // 7. SALARY COMPONENTS (if empty)
    const [[{salCompCount}]] = await connection.query('SELECT COUNT(*) as salCompCount FROM salary_components');
    if (salCompCount < 5) {
      console.log('⏳ Seeding Salary Components...');
      await connection.query(`
        INSERT IGNORE INTO salary_components (id, name, code, type, calculation_type, amount_percentage, status, created_at, updated_at) VALUES
        (1, 'Basic Salary', 'BASIC', 'earning', 'fixed', NULL, 'active', NOW(), NOW()),
        (2, 'House Rent Allowance', 'HRA', 'earning', 'percentage', 40, 'active', NOW(), NOW()),
        (3, 'Transport Allowance', 'TA', 'earning', 'fixed', NULL, 'active', NOW(), NOW()),
        (4, 'Provident Fund', 'PF', 'deduction', 'percentage', 12, 'active', NOW(), NOW()),
        (5, 'Tax Deduction', 'TAX', 'deduction', 'percentage', 10, 'active', NOW(), NOW())
      `);
      console.log('✅ Salary Components seeded\n');
    }

    // 8. JOB POSTINGS (if empty)
    const [[{jobCount}]] = await connection.query('SELECT COUNT(*) as jobCount FROM job_postings');
    if (jobCount < 3) {
      console.log('⏳ Seeding Job Postings...');
      await connection.query(`
        INSERT IGNORE INTO job_postings 
        (id, title, department_id, location, employment_type, experience_required, salary_range, description, requirements, status, posted_date, closing_date, created_at, updated_at) 
        VALUES
        (1, 'Senior Software Engineer', 1, 'New York, NY', 'full_time', '5+ years', '$100,000 - $150,000', 'We are looking for a Senior Software Engineer', 'React, Node.js, MySQL', 'open', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
        (2, 'HR Manager', 2, 'Boston, MA', 'full_time', '3+ years', '$80,000 - $120,000', 'Looking for experienced HR Manager', 'HRMS, Recruitment, Employee Relations', 'open', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
        (3, 'Marketing Specialist', 5, 'Los Angeles, CA', 'full_time', '2+ years', '$60,000 - $90,000', 'Digital marketing expert needed', 'SEO, SEM, Social Media', 'open', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW())
      `);
      console.log('✅ Job Postings seeded\n');
    }

    // 9. ASSET CATEGORIES (if empty)
    const [[{assetCatCount}]] = await connection.query('SELECT COUNT(*) as assetCatCount FROM asset_categories');
    if (assetCatCount < 4) {
      console.log('⏳ Seeding Asset Categories...');
      await connection.query(`
        INSERT IGNORE INTO asset_categories (id, name, code, description, status, created_at, updated_at) VALUES
        (1, 'Laptops', 'LAP', 'Company laptops', 'active', NOW(), NOW()),
        (2, 'Monitors', 'MON', 'Display monitors', 'active', NOW(), NOW()),
        (3, 'Furniture', 'FUR', 'Office furniture', 'active', NOW(), NOW()),
        (4, 'Mobile Devices', 'MOB', 'Company phones and tablets', 'active', NOW(), NOW())
      `);
      console.log('✅ Asset Categories seeded\n');
    }

    // 10. ASSETS (if empty)
    const [[{assetCount}]] = await connection.query('SELECT COUNT(*) as assetCount FROM assets');
    if (assetCount < 5) {
      console.log('⏳ Seeding Assets...');
      await connection.query(`
        INSERT IGNORE INTO assets 
        (asset_id, name, category_id, serial_number, purchase_date, purchase_cost, warranty_expiry, status, created_at, updated_at) 
        VALUES
        ('ASSET001', 'MacBook Pro 16"', 1, 'MBP001', '2024-01-15', 2500.00, '2027-01-15', 'available', NOW(), NOW()),
        ('ASSET002', 'Dell XPS 15', 1, 'DXPS002', '2024-02-01', 1800.00, '2027-02-01', 'available', NOW(), NOW()),
        ('ASSET003', 'LG UltraWide Monitor', 2, 'LGMON003', '2024-01-20', 500.00, '2027-01-20', 'available', NOW(), NOW()),
        ('ASSET004', 'Herman Miller Chair', 3, 'HMCH004', '2024-03-10', 800.00, '2029-03-10', 'available', NOW(), NOW()),
        ('ASSET005', 'iPhone 14 Pro', 4, 'IP14005', '2024-04-01', 1200.00, '2026-04-01', 'available', NOW(), NOW())
      `);
      console.log('✅ Assets seeded\n');
    }

    // 11. DOCUMENT CATEGORIES (if empty)
    const [[{docCatCount}]] = await connection.query('SELECT COUNT(*) as docCatCount FROM document_categories');
    if (docCatCount < 5) {
      console.log('⏳ Seeding Document Categories...');
      await connection.query(`
        INSERT IGNORE INTO document_categories (id, name, code, description, is_mandatory, status, created_at, updated_at) VALUES
        (1, 'Identity Proof', 'ID', 'Government issued ID', 1, 'active', NOW(), NOW()),
        (2, 'Educational Certificates', 'EDU', 'Degree and certificates', 1, 'active', NOW(), NOW()),
        (3, 'Experience Letters', 'EXP', 'Previous employment letters', 0, 'active', NOW(), NOW()),
        (4, 'Tax Documents', 'TAX', 'Tax related documents', 1, 'active', NOW(), NOW()),
        (5, 'Bank Details', 'BANK', 'Banking information', 1, 'active', NOW(), NOW())
      `);
      console.log('✅ Document Categories seeded\n');
    }

    // 12. ATTENDANCE POLICIES (if empty)
    const [[{policyCount}]] = await connection.query('SELECT COUNT(*) as policyCount FROM policies');
    if (policyCount < 3) {
      console.log('⏳ Seeding Attendance Policies...');
      await connection.query(`
        INSERT IGNORE INTO policies (id, name, code, type, description, policy_data, status, created_at, updated_at) VALUES
        (1, 'Standard Attendance Policy', 'SAP', 'attendance', 'Standard 9-6 attendance', '{"flexible": false, "grace_period": 15}', 'active', NOW(), NOW()),
        (2, 'Flexible Work Policy', 'FWP', 'attendance', 'Flexible working hours', '{"flexible": true, "core_hours": "11-15"}', 'active', NOW(), NOW()),
        (3, 'Remote Work Policy', 'RWP', 'work_from_home', 'Work from home policy', '{"remote_days": 2, "approval_required": true}', 'active', NOW(), NOW())
      `);
      console.log('✅ Attendance Policies seeded\n');
    }

    // 13. TRAINING PROGRAMS (if empty)
    const [[{trainingCount}]] = await connection.query('SELECT COUNT(*) as trainingCount FROM training_programs');
    if (trainingCount < 3) {
      console.log('⏳ Seeding Training Programs...');
      await connection.query(`
        INSERT IGNORE INTO training_programs 
        (id, name, description, trainer, duration, start_date, end_date, status, created_at, updated_at) 
        VALUES
        (1, 'React.js Advanced Training', 'Advanced React concepts', 'John Tech', 20, '2025-11-01', '2025-11-20', 'scheduled', NOW(), NOW()),
        (2, 'Leadership Skills', 'Management and leadership training', 'Sarah Leader', 15, '2025-11-05', '2025-11-20', 'scheduled', NOW(), NOW()),
        (3, 'Cybersecurity Awareness', 'Security best practices', 'Security Team', 5, '2025-11-10', '2025-11-15', 'scheduled', NOW(), NOW())
      `);
      console.log('✅ Training Programs seeded\n');
    }

    // 14. CALENDAR EVENTS (if empty)
    const [[{eventCount}]] = await connection.query('SELECT COUNT(*) as eventCount FROM calendar_events');
    if (eventCount < 5) {
      console.log('⏳ Seeding Calendar Events...');
      await connection.query(`
        INSERT IGNORE INTO calendar_events 
        (id, title, description, event_type, start_date, end_date, all_day, color, created_at, updated_at) 
        VALUES
        (1, 'Company Meeting', 'Monthly all-hands meeting', 'meeting', '2025-10-28 10:00:00', '2025-10-28 11:00:00', 0, '#1976D2', NOW(), NOW()),
        (2, 'Diwali Holiday', 'Public holiday', 'holiday', '2025-11-01', '2025-11-01', 1, '#F44336', NOW(), NOW()),
        (3, 'Team Building Event', 'Team outing', 'event', '2025-11-05 09:00:00', '2025-11-05 17:00:00', 1, '#4CAF50', NOW(), NOW()),
        (4, 'Project Deadline', 'Q4 project deadline', 'deadline', '2025-11-15', '2025-11-15', 1, '#FF9800', NOW(), NOW()),
        (5, 'Training Session', 'React training', 'training', '2025-11-01 14:00:00', '2025-11-01 16:00:00', 0, '#9C27B0', NOW(), NOW())
      `);
      console.log('✅ Calendar Events seeded\n');
    }

    // 15. PERFORMANCE GOALS (if empty)
    const [[{goalCount}]] = await connection.query('SELECT COUNT(*) as goalCount FROM performance_goals');
    if (goalCount < 3) {
      console.log('⏳ Seeding Performance Goals...');
      await connection.query(`
        INSERT IGNORE INTO performance_goals 
        (id, employee_id, title, description, target_date, status, created_at, updated_at) 
        VALUES
        (1, 1, 'Complete Project Alpha', 'Finish the main project deliverables', '2025-12-31', 'in_progress', NOW(), NOW()),
        (2, 2, 'Improve Team Efficiency', 'Reduce onboarding time by 30%', '2025-11-30', 'not_started', NOW(), NOW()),
        (3, 3, 'Learn New Technology', 'Master GraphQL and TypeScript', '2025-12-15', 'in_progress', NOW(), NOW())
      `);
      console.log('✅ Performance Goals seeded\n');
    }

    // Final summary
    console.log('═'.repeat(80));
    console.log('📊 FINAL DATABASE STATUS:');
    console.log('═'.repeat(80));
    
    const tables = [
      'departments', 'branches', 'designations', 'employees', 'leave_types',
      'shifts', 'salary_components', 'job_postings', 'asset_categories', 'assets',
      'document_categories', 'policies', 'training_programs', 'calendar_events', 'performance_goals'
    ];

    for (const table of tables) {
      const [[result]] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table.padEnd(30)} : ${result.count} records`);
    }
    
    console.log('═'.repeat(80));
    console.log('\n✅ ALL TABLES SEEDED WITH SAMPLE DATA!\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Run the script
seedAllTables();

