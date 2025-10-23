/**
 * Update Employee Table - Add Missing Fields
 * 
 * This script adds new fields to the existing employees table:
 * - payment_method
 * - blood_group
 * - nationality
 * - marital_status
 * - emergency_contact_name
 * - emergency_contact_phone
 * - emergency_contact_relation
 */

const db = require('../config/database');

async function updateEmployeeTable() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║     🔄 Updating Employee Table - Adding New Fields             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    // Check if table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'employees'");
    if (tables.length === 0) {
      console.log('❌ Employees table does not exist!');
      console.log('   Run: npm run setup\n');
      process.exit(1);
    }

    console.log('✅ Employees table found\n');
    console.log('📋 Adding missing columns...\n');

    const alterQueries = [
      {
        name: 'payment_method',
        query: `ALTER TABLE employees 
                ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100) DEFAULT 'Bank Transfer' AFTER attendance_policy`,
      },
      {
        name: 'blood_group',
        query: `ALTER TABLE employees 
                ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10) AFTER payment_method`,
      },
      {
        name: 'nationality',
        query: `ALTER TABLE employees 
                ADD COLUMN IF NOT EXISTS nationality VARCHAR(100) AFTER blood_group`,
      },
      {
        name: 'emergency_contact_name',
        query: `ALTER TABLE employees 
                ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(200) AFTER nationality`,
      },
      {
        name: 'emergency_contact_phone',
        query: `ALTER TABLE employees 
                ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(50) AFTER emergency_contact_name`,
      },
      {
        name: 'emergency_contact_relation',
        query: `ALTER TABLE employees 
                ADD COLUMN IF NOT EXISTS emergency_contact_relation VARCHAR(100) AFTER emergency_contact_phone`,
      },
    ];

    for (const { name, query } of alterQueries) {
      try {
        await db.query(query);
        console.log(`✅ Added column: ${name}`);
      } catch (error) {
        if (error.message.includes('Duplicate column')) {
          console.log(`⏭️  Column already exists: ${name}`);
        } else {
          console.error(`❌ Error adding ${name}:`, error.message);
        }
      }
    }

    console.log('\n✅ Employee table updated successfully!');
    console.log('\n📝 Updating existing employees with default values...\n');

    // Update existing employees with default values for new fields
    await db.query(`
      UPDATE employees 
      SET 
        payment_method = COALESCE(payment_method, 'Bank Transfer'),
        nationality = COALESCE(nationality, 'American'),
        marital_status = COALESCE(marital_status, 'single')
      WHERE payment_method IS NULL OR nationality IS NULL OR marital_status IS NULL
    `);

    const [[{count}]] = await db.query('SELECT COUNT(*) as count FROM employees');
    console.log(`✅ Updated ${count} employees with default values`);

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ UPDATE COMPLETE!                               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\nNext steps:');
    console.log('  1. Restart backend: npm run dev');
    console.log('  2. Restart frontend: npm start');
    console.log('  3. Test employee pages\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error updating employee table:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  updateEmployeeTable();
}

module.exports = { updateEmployeeTable };

