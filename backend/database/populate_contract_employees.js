const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixContractEmployees() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hrms_db',
  });

  try {
    console.log('🔍 Checking contracts and employees...\n');

    // Get all employees
    const [employees] = await connection.execute(
      'SELECT id, first_name, last_name, employee_id FROM employees ORDER BY id LIMIT 10'
    );

    if (employees.length === 0) {
      console.log('❌ No employees found in database!');
      console.log('👉 Please add employees first via: /dashboard/hr/employees/new');
      return;
    }

    console.log(`✅ Found ${employees.length} employees:`);
    employees.forEach((emp, idx) => {
      console.log(`   ${idx + 1}. ID: ${emp.id} - ${emp.first_name} ${emp.last_name} (${emp.employee_id})`);
    });
    console.log('');

    // Get all contracts
    const [contracts] = await connection.execute(
      'SELECT id, employee_id, contract_type, start_date FROM contracts'
    );

    console.log(`📋 Found ${contracts.length} contracts\n`);

    if (contracts.length === 0) {
      console.log('ℹ️  No contracts to update.');
      return;
    }

    // Update each contract with a valid employee
    let updated = 0;
    for (let i = 0; i < contracts.length; i++) {
      const contract = contracts[i];
      const employee = employees[i % employees.length]; // Cycle through employees
      
      await connection.execute(
        'UPDATE contracts SET employee_id = ? WHERE id = ?',
        [employee.id, contract.id]
      );

      console.log(`✅ Contract ${contract.id} → Assigned to ${employee.first_name} ${employee.last_name}`);
      updated++;
    }

    console.log(`\n🎉 SUCCESS! Updated ${updated} contracts with employee data!`);
    console.log('\n📋 Verification:');

    // Verify the updates
    const [result] = await connection.execute(`
      SELECT 
        c.id,
        c.contract_type,
        c.start_date,
        c.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
        e.employee_id AS employee_code
      FROM contracts c
      LEFT JOIN employees e ON c.employee_id = e.id
      ORDER BY c.id
    `);

    console.log('\n┌─────┬───────────┬─────────────┬────────────────────────┐');
    console.log('│ ID  │ Type      │ Start Date  │ Employee               │');
    console.log('├─────┼───────────┼─────────────┼────────────────────────┤');
    result.forEach(row => {
      const id = String(row.id).padEnd(3);
      const type = String(row.contract_type).padEnd(9);
      const date = String(row.start_date || '').split('T')[0].padEnd(11);
      const emp = String(row.employee_name || '-').padEnd(22);
      console.log(`│ ${id} │ ${type} │ ${date} │ ${emp} │`);
    });
    console.log('└─────┴───────────┴─────────────┴────────────────────────┘');

    console.log('\n✅ COMPLETE! Restart backend and hard refresh browser!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

fixContractEmployees();
