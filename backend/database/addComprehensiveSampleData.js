const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSampleData() {
  let connection;
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║              ADDING COMPREHENSIVE SAMPLE DATA                              ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'hrms_go_v5'
    });

    console.log('✓ Connected to database\n');

    // Helper function to insert if table is empty
    const insertIfEmpty = async (tableName, query, description) => {
      const [[{count}]] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      if (count === 0) {
        console.log(`⏳ Adding ${description}...`);
        await connection.query(query);
        console.log(`✅ ${description} added\n`);
        return true;
      }
      return false;
    };

    // 1. Asset Categories
    await insertIfEmpty('asset_categories', `
      INSERT INTO asset_categories (name, description, status, created_at, updated_at) VALUES
      ('Laptops', 'Company laptops and computers', 'active', NOW(), NOW()),
      ('Monitors', 'Display monitors', 'active', NOW(), NOW()),
      ('Furniture', 'Office furniture', 'active', NOW(), NOW()),
      ('Mobile Devices', 'Phones and tablets', 'active', NOW(), NOW()),
      ('Office Equipment', 'Printers, scanners, etc', 'active', NOW(), NOW())
    `, 'Asset Categories');

    // 2. Assets
    await insertIfEmpty('assets', `
      INSERT INTO assets (name, asset_tag, category_id, purchase_date, purchase_cost, status, created_at, updated_at) VALUES
      ('MacBook Pro 16"', 'ASSET-001', 1, '2024-01-15', 2500.00, 'available', NOW(), NOW()),
      ('Dell XPS 15', 'ASSET-002', 1, '2024-02-01', 1800.00, 'available', NOW(), NOW()),
      ('LG UltraWide Monitor', 'ASSET-003', 2, '2024-01-20', 500.00, 'available', NOW(), NOW()),
      ('Herman Miller Chair', 'ASSET-004', 3, '2024-03-10', 800.00, 'available', NOW(), NOW()),
      ('iPhone 14 Pro', 'ASSET-005', 4, '2024-04-01', 1200.00, 'available', NOW(), NOW())
    `, 'Assets');

    // 3. Document Categories
    await insertIfEmpty('document_categories', `
      INSERT INTO document_categories (name, description, is_mandatory, status, created_at, updated_at) VALUES
      ('Identity Proof', 'Government issued ID', 1, 'active', NOW(), NOW()),
      ('Educational Certificates', 'Degrees and certificates', 1, 'active', NOW(), NOW()),
      ('Experience Letters', 'Previous employment letters', 0, 'active', NOW(), NOW()),
      ('Tax Documents', 'Tax related documents', 1, 'active', NOW(), NOW()),
      ('Bank Details', 'Banking information', 1, 'active', NOW(), NOW())
    `, 'Document Categories');

    // 4. Calendar Events
    await insertIfEmpty('calendar_events', `
      INSERT INTO calendar_events (title, description, event_type, start_date, end_date, all_day, created_at, updated_at) VALUES
      ('Company Meeting', 'Monthly all-hands meeting', 'meeting', '2025-10-28 10:00:00', '2025-10-28 11:00:00', 0, NOW(), NOW()),
      ('Holiday - Diwali', 'Public holiday', 'holiday', '2025-11-01', '2025-11-01', 1, NOW(), NOW()),
      ('Team Building', 'Team outing', 'event', '2025-11-05', '2025-11-05', 1, NOW(), NOW()),
      ('Project Deadline', 'Q4 deadline', 'deadline', '2025-11-15', '2025-11-15', 1, NOW(), NOW()),
      ('Training Session', 'React training', 'training', '2025-11-01 14:00:00', '2025-11-01 16:00:00', 0, NOW(), NOW())
    `, 'Calendar Events');

    // 5. Performance Goals
    const [emps] = await connection.query('SELECT id FROM employees LIMIT 3');
    if (emps.length > 0) {
      const [[{goalCount}]] = await connection.query('SELECT COUNT(*) as goalCount FROM performance_goals');
      if (goalCount === 0) {
        console.log('⏳ Adding Performance Goals...');
        for (const emp of emps) {
          await connection.query(`
            INSERT INTO performance_goals (employee_id, title, description, target_date, status, created_at, updated_at)
            VALUES (?, 'Complete Project', 'Finish project deliverables', '2025-12-31', 'in_progress', NOW(), NOW())
          `, [emp.id]);
        }
        console.log('✅ Performance Goals added\n');
      }
    }

    // 6. Training Programs
    await insertIfEmpty('training_programs', `
      INSERT INTO training_programs (name, description, duration, start_date, end_date, status, created_at, updated_at) VALUES
      ('React Advanced', 'Advanced React concepts', 20, '2025-11-01', '2025-11-20', 'scheduled', NOW(), NOW()),
      ('Leadership Skills', 'Management training', 15, '2025-11-05', '2025-11-20', 'scheduled', NOW(), NOW()),
      ('Cybersecurity', 'Security best practices', 5, '2025-11-10', '2025-11-15', 'scheduled', NOW(), NOW())
    `, 'Training Programs');

    // 7. Salary Components
    await insertIfEmpty('salary_components', `
      INSERT INTO salary_components (name, type, calculation_type, value, status, created_at, updated_at) VALUES
      ('Basic Salary', 'earning', 'fixed', 0, 'active', NOW(), NOW()),
      ('HRA', 'earning', 'percentage', 40, 'active', NOW(), NOW()),
      ('Transport', 'earning', 'fixed', 0, 'active', NOW(), NOW()),
      ('PF', 'deduction', 'percentage', 12, 'active', NOW(), NOW()),
      ('Tax', 'deduction', 'percentage', 10, 'active', NOW(), NOW())
    `, 'Salary Components');

    // 8. Announcements
    await insertIfEmpty('announcements', `
      INSERT INTO announcements (title, message, type, priority, start_date, end_date, status, created_by, created_at, updated_at) VALUES
      ('Welcome to HRMS Go', 'Welcome to our new HRMS system!', 'general', 'high', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'published', 1, NOW(), NOW()),
      ('Holiday Notice', 'Office closed for Diwali', 'holiday', 'high', NOW(), '2025-11-01', 'published', 1, NOW(), NOW()),
      ('System Maintenance', 'Scheduled maintenance this weekend', 'maintenance', 'medium', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'published', 1, NOW(), NOW())
    `, 'Announcements');

    // 9. Attendance (for current employees)
    if (emps.length > 0) {
      const [[{attCount}]] = await connection.query('SELECT COUNT(*) as attCount FROM attendance');
      if (attCount < 20) {
        console.log('⏳ Adding Attendance Records...');
        for (const emp of emps) {
          for (let i = 0; i < 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            await connection.query(`
              INSERT INTO attendance (employee_id, date, check_in, check_out, status, total_hours, created_at, updated_at)
              VALUES (?, ?, '09:00:00', '18:00:00', 'present', 8, NOW(), NOW())
              ON DUPLICATE KEY UPDATE check_in = check_in
            `, [emp.id, dateStr]);
          }
        }
        console.log('✅ Attendance Records added\n');
      }
    }

    // 10. Payroll Records
    if (emps.length > 0) {
      const [[{payCount}]] = await connection.query('SELECT COUNT(*) as payCount FROM payrolls');
      if (payCount < 5) {
        console.log('⏳ Adding Payroll Records...');
        for (const emp of emps) {
          await connection.query(`
            INSERT INTO payrolls (employee_id, period_start, period_end, basic_salary, gross_salary, net_salary, status, created_at, updated_at)
            VALUES (?, '2025-10-01', '2025-10-31', 5000, 6500, 5850, 'processed', NOW(), NOW())
          `, [emp.id]);
        }
        console.log('✅ Payroll Records added\n');
      }
    }

    // Final summary
    console.log('═'.repeat(80));
    console.log('📊 FINAL STATUS - Tables with Data:');
    console.log('═'.repeat(80));
    
    const checkTables = [
      'employees', 'departments', 'branches', 'asset_categories', 'assets',
      'document_categories', 'calendar_events', 'training_programs', 
      'salary_components', 'announcements', 'attendance', 'payrolls',
      'leave_types', 'shifts', 'job_postings', 'performance_goals'
    ];

    for (const table of checkTables) {
      try {
        const [[{count}]] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
        const status = count > 0 ? '✅' : '❌';
        console.log(`  ${status} ${table.padEnd(30)} : ${count} records`);
      } catch (e) {
        console.log(`  ⚠️  ${table.padEnd(30)} : Error checking`);
      }
    }
    
    console.log('═'.repeat(80));
    console.log('\n✅ SAMPLE DATA ADDED TO ALL IMPORTANT TABLES!\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

addSampleData();

