const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedEssentialData() {
  let connection;
  
  try {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║       SEEDING ESSENTIAL SAMPLE DATA                       ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'hrms_go_v5'
    });

    console.log('✓ Connected to database\n');

    // Use simple, safe INSERT INTO ... SELECT statements
    
    // 1. Employees (sample data already exists, just verify)
    const [[{empCount}]] = await connection.query('SELECT COUNT(*) as empCount FROM employees');
    console.log(`✓ Employees: ${empCount} records`);

    // 2. Attendance (add some sample records if needed)
    const [[{attCount}]] = await connection.query('SELECT COUNT(*) as attCount FROM attendance');
    if (attCount < 10) {
      console.log('⏳ Adding sample attendance records...');
      const [employees] = await connection.query('SELECT id FROM employees LIMIT 5');
      for (const emp of employees) {
        // Add attendance for last 5 days
        for (let i = 0; i < 5; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          await connection.query(`
            INSERT IGNORE INTO attendance 
            (employee_id, date, check_in, check_out, status, total_hours, created_at, updated_at)
            VALUES 
            (?, ?, '09:00:00', '18:00:00', 'present', 8, NOW(), NOW())
          `, [emp.id, dateStr]);
        }
      }
      console.log('✅ Attendance records added\n');
    }

    // 3. Leaves (add sample leave requests)
    const [[{leaveCount}]] = await connection.query('SELECT COUNT(*) as leaveCount FROM leaves');
    if (leaveCount < 5) {
      console.log('⏳ Adding sample leave requests...');
      const [employees] = await connection.query('SELECT id FROM employees LIMIT 3');
      for (const emp of employees) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 7);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 2);
        
        await connection.query(`
          INSERT IGNORE INTO leaves 
          (employee_id, leave_type_id, start_date, end_date, reason, status, created_at, updated_at)
          VALUES 
          (?, 1, ?, ?, 'Personal work', 'pending', NOW(), NOW())
        `, [emp.id, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]);
      }
      console.log('✅ Leave requests added\n');
    }

    // 4. Payroll (add sample payroll records)
    const [[{payrollCount}]] = await connection.query('SELECT COUNT(*) as payrollCount FROM payroll');
    if (payrollCount < 5) {
      console.log('⏳ Adding sample payroll records...');
      const [employees] = await connection.query('SELECT id FROM employees LIMIT 5');
      for (const emp of employees) {
        await connection.query(`
          INSERT IGNORE INTO payroll 
          (employee_id, period_start, period_end, basic_salary, gross_salary, net_salary, status, created_at, updated_at)
          VALUES 
          (?, '2025-10-01', '2025-10-31', 5000, 6500, 5850, 'processed', NOW(), NOW())
        `, [emp.id]);
      }
      console.log('✅ Payroll records added\n');
    }

    // Final summary
    console.log('═'.repeat(70));
    console.log('📊 CURRENT DATABASE STATUS:');
    console.log('═'.repeat(70));
    
    const counts = await Promise.all([
      connection.query('SELECT COUNT(*) as c FROM employees'),
      connection.query('SELECT COUNT(*) as c FROM departments'),
      connection.query('SELECT COUNT(*) as c FROM attendance'),
      connection.query('SELECT COUNT(*) as c FROM leaves'),
      connection.query('SELECT COUNT(*) as c FROM leave_types'),
      connection.query('SELECT COUNT(*) as c FROM payroll'),
      connection.query('SELECT COUNT(*) as c FROM users'),
      connection.query('SELECT COUNT(*) as c FROM user_roles'),
      connection.query('SELECT COUNT(*) as c FROM permissions'),
      connection.query('SELECT COUNT(*) as c FROM role_permissions'),
    ]);

    console.log(`  Employees:          ${counts[0][0][0].c}`);
    console.log(`  Departments:        ${counts[1][0][0].c}`);
    console.log(`  Attendance Records: ${counts[2][0][0].c}`);
    console.log(`  Leave Requests:     ${counts[3][0][0].c}`);
    console.log(`  Leave Types:        ${counts[4][0][0].c}`);
    console.log(`  Payroll Records:    ${counts[5][0][0].c}`);
    console.log(`  Users:              ${counts[6][0][0].c}`);
    console.log(`  Roles:              ${counts[7][0][0].c}`);
    console.log(`  Permissions:        ${counts[8][0][0].c}`);
    console.log(`  Role-Permissions:   ${counts[9][0][0].c}`);
    
    console.log('═'.repeat(70));
    console.log('\n✅ SAMPLE DATA SEEDING COMPLETE!\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

seedEssentialData();

