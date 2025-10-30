const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAndFixAllTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hrms_db',
  });

  try {
    console.log('🔍 Checking all database tables...\n');

    // Check all critical tables
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
      ORDER BY TABLE_NAME
    `);

    console.log('📋 Existing tables:');
    tables.forEach((table, idx) => {
      console.log(`   ${idx + 1}. ${table.TABLE_NAME}`);
    });
    console.log('');

    // Check if contracts table has file_path column
    const [contractColumns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'contracts'
      ORDER BY ORDINAL_POSITION
    `);

    console.log('📋 Contracts table columns:');
    contractColumns.forEach((col) => {
      console.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    console.log('');

    // Add file_path column if missing
    const hasFilePath = contractColumns.some(col => col.COLUMN_NAME === 'file_path');
    if (!hasFilePath) {
      console.log('⚠️  file_path column missing! Adding it now...');
      await connection.execute(`
        ALTER TABLE contracts ADD COLUMN file_path VARCHAR(255) NULL AFTER signed_date
      `);
      console.log('✅ Added file_path column to contracts table');
    } else {
      console.log('✅ file_path column exists');
    }

    // Check asset_categories code column
    const [assetCatColumns] = await connection.execute(`
      SELECT COLUMN_NAME, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'asset_categories'
        AND COLUMN_NAME = 'code'
    `);

    if (assetCatColumns.length > 0 && assetCatColumns[0].IS_NULLABLE === 'NO') {
      console.log('\n⚠️  asset_categories.code is NOT NULL! Making it nullable...');
      await connection.execute(`
        ALTER TABLE asset_categories MODIFY COLUMN code VARCHAR(50) NULL
      `);
      console.log('✅ asset_categories.code is now nullable');
    }

    // Check employees count
    const [empCount] = await connection.execute('SELECT COUNT(*) as count FROM employees');
    console.log(`\n👥 Employees in database: ${empCount[0].count}`);

    if (empCount[0].count === 0) {
      console.log('❌ No employees found! Please add employees first via /dashboard/hr/employees/new');
    } else {
      // Show some employees
      const [employees] = await connection.execute(`
        SELECT id, first_name, last_name, employee_id 
        FROM employees 
        ORDER BY id
        LIMIT 5
      `);
      
      console.log('\n📋 Sample employees:');
      employees.forEach((emp) => {
        console.log(`   ID: ${emp.id} - ${emp.first_name} ${emp.last_name} (${emp.employee_id})`);
      });
    }

    // Check contracts
    const [contracts] = await connection.execute(`
      SELECT c.id, c.employee_id, c.contract_type, c.start_date,
             e.first_name, e.last_name, e.employee_id as emp_code
      FROM contracts c
      LEFT JOIN employees e ON c.employee_id = e.id
      LIMIT 5
    `);

    console.log(`\n📋 Contracts in database: ${contracts.length}`);
    if (contracts.length > 0) {
      console.log('\nContract details:');
      contracts.forEach((c) => {
        const empName = c.first_name ? `${c.first_name} ${c.last_name}` : 'NO EMPLOYEE';
        console.log(`   ID: ${c.id}, Employee: ${empName}, Type: ${c.contract_type}`);
      });
    }

    console.log('\n✅ DATABASE CHECK COMPLETE!');
    console.log('\n📋 NEXT STEPS:');
    console.log('   1. If employees exist but contracts show NO EMPLOYEE:');
    console.log('      → Run: node database/populate_contract_employees.js');
    console.log('   2. Restart backend: npm start');
    console.log('   3. Hard refresh browser: Cmd+Shift+R');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkAndFixAllTables();
