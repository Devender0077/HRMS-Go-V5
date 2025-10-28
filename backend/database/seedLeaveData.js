require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedLeaveData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'hrms_go_v5',
  });

  try {
    console.log('🔄 Starting Leave Data Seeding...\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // STEP 1: Seed Leave Types
    console.log('📝 STEP 1: Seeding Leave Types...');
    
    const leaveTypes = [
      { name: 'Annual Leave', days_per_year: 20, carry_forward: 1, max_carry_forward: 5, status: 'active' },
      { name: 'Sick Leave', days_per_year: 10, carry_forward: 0, max_carry_forward: 0, status: 'active' },
      { name: 'Casual Leave', days_per_year: 7, carry_forward: 0, max_carry_forward: 0, status: 'active' },
      { name: 'Maternity Leave', days_per_year: 90, carry_forward: 0, max_carry_forward: 0, status: 'active' },
      { name: 'Paternity Leave', days_per_year: 15, carry_forward: 0, max_carry_forward: 0, status: 'active' },
    ];

    for (const leaveType of leaveTypes) {
      await connection.query(
        `INSERT INTO leave_types (name, days_per_year, carry_forward, max_carry_forward, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE 
           days_per_year = VALUES(days_per_year),
           carry_forward = VALUES(carry_forward),
           max_carry_forward = VALUES(max_carry_forward),
           status = VALUES(status)`,
        [leaveType.name, leaveType.days_per_year, leaveType.carry_forward, leaveType.max_carry_forward, leaveType.status]
      );
      console.log(`  ✅ ${leaveType.name}: ${leaveType.days_per_year} days/year`);
    }

    // STEP 2: Get all leave types
    const [types] = await connection.query('SELECT id, name, days_per_year FROM leave_types WHERE status = "active"');
    console.log(`\n📊 Found ${types.length} leave types\n`);

    // STEP 3: Get all employees
    console.log('📝 STEP 2: Creating Leave Balances for All Employees...');
    const [employees] = await connection.query('SELECT id, first_name, last_name FROM employees');
    console.log(`📊 Found ${employees.length} employees\n`);

    if (employees.length === 0) {
      console.log('⚠️  No employees found. Skipping balance creation.');
      await connection.end();
      return;
    }

    // STEP 4: Create leave balances for each employee
    const currentYear = new Date().getFullYear();
    let balancesCreated = 0;

    for (const employee of employees) {
      for (const leaveType of types) {
        try {
          const [existing] = await connection.query(
            'SELECT id FROM leave_balances WHERE employee_id = ? AND leave_type_id = ? AND year = ?',
            [employee.id, leaveType.id, currentYear]
          );

          if (existing.length === 0) {
            await connection.query(
              `INSERT INTO leave_balances (employee_id, leave_type_id, year, total_days, used_days, pending_days, remaining_days, created_at, updated_at)
               VALUES (?, ?, ?, ?, 0, 0, ?, NOW(), NOW())`,
              [employee.id, leaveType.id, currentYear, leaveType.days_per_year, leaveType.days_per_year]
            );
            balancesCreated++;
          }
        } catch (error) {
          console.error(`  ❌ Error creating balance for ${employee.first_name}: ${error.message}`);
        }
      }
      console.log(`  ✅ ${employee.first_name} ${employee.last_name}: ${types.length} leave types allocated`);
    }

    console.log(`\n✅ Created ${balancesCreated} new leave balances\n`);

    // STEP 5: Create some sample leave requests
    console.log('📝 STEP 3: Creating Sample Leave Requests...');
    
    // Get first 3 employees for sample data
    const sampleEmployees = employees.slice(0, 3);
    const [annualLeaveType] = types.filter(t => t.name === 'Annual Leave');
    const [sickLeaveType] = types.filter(t => t.name === 'Sick Leave');

    if (annualLeaveType && sampleEmployees.length > 0) {
      // Approved leave
      await connection.query(
        `INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, days, reason, status, created_at, updated_at)
         VALUES (?, ?, '2025-11-10', '2025-11-14', 5, 'Family vacation', 'approved', NOW(), NOW())
         ON DUPLICATE KEY UPDATE id=id`,
        [sampleEmployees[0].id, annualLeaveType.id]
      );
      console.log(`  ✅ Approved leave for ${sampleEmployees[0].first_name}`);

      // Pending leave
      if (sampleEmployees.length > 1) {
        await connection.query(
          `INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, days, reason, status, created_at, updated_at)
           VALUES (?, ?, '2025-12-20', '2025-12-24', 5, 'Christmas holidays', 'pending', NOW(), NOW())
           ON DUPLICATE KEY UPDATE id=id`,
          [sampleEmployees[1].id, annualLeaveType.id]
        );
        console.log(`  ✅ Pending leave for ${sampleEmployees[1].first_name}`);
      }
    }

    if (sickLeaveType && sampleEmployees.length > 2) {
      // Rejected leave
      await connection.query(
        `INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, days, reason, status, created_at, updated_at)
         VALUES (?, ?, '2025-10-15', '2025-10-16', 2, 'Medical checkup', 'rejected', NOW(), NOW())
         ON DUPLICATE KEY UPDATE id=id`,
        [sampleEmployees[2].id, sickLeaveType.id]
      );
      console.log(`  ✅ Rejected leave for ${sampleEmployees[2].first_name}`);
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ LEAVE DATA SEEDING COMPLETE!\n');
    console.log('Summary:');
    console.log(`  • ${types.length} leave types configured`);
    console.log(`  • ${employees.length} employees processed`);
    console.log(`  • ${balancesCreated} leave balances created`);
    console.log(`  • ${sampleEmployees.length} sample leave requests created`);
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error seeding leave data:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedLeaveData()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedLeaveData;

