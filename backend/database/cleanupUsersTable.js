const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanupUsersTable() {
  let connection;
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║              CLEANING UP USERS TABLE                                       ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'hrms_go_v5'
    });

    console.log('✓ Connected to database\n');

    // Get all employee users
    const [employeeUsers] = await connection.query(
      "SELECT id, name, email, user_type FROM users WHERE user_type = 'employee'"
    );

    console.log(`Found ${employeeUsers.length} employee users to remove:\n`);
    employeeUsers.forEach(u => {
      console.log(`  - ID ${u.id}: ${u.email} (${u.name})`);
    });

    if (employeeUsers.length === 0) {
      console.log('\n✓ No employee users found. Nothing to clean up.');
      await connection.end();
      return;
    }

    // Delete employee users
    console.log('\n⏳ Removing employee users from users table...');
    const [deleteResult] = await connection.query(
      "DELETE FROM users WHERE user_type = 'employee'"
    );
    console.log(`✓ Deleted ${deleteResult.affectedRows} employee users`);

    // Update employees table - set user_id to NULL for those employees
    console.log('\n⏳ Updating employees table (setting user_id to NULL)...');
    const employeeIds = employeeUsers.map(u => u.id);
    if (employeeIds.length > 0) {
      const [updateResult] = await connection.query(
        `UPDATE employees SET user_id = NULL WHERE user_id IN (${employeeIds.join(',')})`
      );
      console.log(`✓ Updated ${updateResult.affectedRows} employee records`);
    }

    // Show remaining users
    console.log('\n' + '='.repeat(80));
    console.log('REMAINING USERS IN USERS TABLE:');
    console.log('='.repeat(80));
    
    const [remainingUsers] = await connection.query(
      'SELECT id, name, email, user_type, status FROM users ORDER BY id'
    );

    console.log(String('ID').padEnd(5) + String('Name').padEnd(30) + String('Email').padEnd(35) + String('Type').padEnd(15));
    console.log('-'.repeat(85));
    remainingUsers.forEach(u => {
      console.log(
        String(u.id).padEnd(5) + 
        String(u.name || '').padEnd(30) + 
        String(u.email).padEnd(35) + 
        String(u.user_type || '').padEnd(15)
      );
    });
    console.log('='.repeat(80));
    console.log(`\nTotal remaining users: ${remainingUsers.length}`);

    // Count by type
    const superAdmins = remainingUsers.filter(u => u.user_type === 'super_admin').length;
    const hrManagers = remainingUsers.filter(u => u.user_type === 'hr_manager').length;
    const hrs = remainingUsers.filter(u => u.user_type === 'hr').length;
    const managers = remainingUsers.filter(u => u.user_type === 'manager').length;

    console.log('\n📊 BREAKDOWN BY TYPE:');
    console.log(`   Super Admin: ${superAdmins}`);
    console.log(`   HR Manager:  ${hrManagers}`);
    console.log(`   HR:          ${hrs}`);
    console.log(`   Manager:     ${managers}`);

    console.log('\n✅ CLEANUP COMPLETE!');
    console.log('   Users table now contains only administrative and management accounts.');
    console.log('   Employees should login through their employee profiles, not user accounts.\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Run the cleanup
cleanupUsersTable();

