#!/usr/bin/env node

/**
 * Cleanup Users Table - Remove Employee-Type Users
 * 
 * This script removes users with user_type='employee' from the users table.
 * Employees table will be updated to remove user_id references.
 * 
 * Architecture:
 * - users table: Only for admin/manager/hr (authentication + role management)
 * - employees table: For all employees (HR data, standalone)
 */

const db = require('../config/database');

async function cleanupUsers() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║           🧹 USERS TABLE CLEANUP                               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Step 1: Analyze current state
    console.log('📊 Step 1: Analyzing current users...\n');
    
    const [allUsers] = await db.query(`
      SELECT u.id, u.email, u.user_type,
             e.id as emp_id, e.employee_id as emp_code
      FROM users u
      LEFT JOIN employees e ON u.id = e.user_id
      ORDER BY u.user_type, u.id
    `);
    
    const employeeUsers = allUsers.filter(u => u.user_type === 'employee');
    const adminUsers = allUsers.filter(u => u.user_type !== 'employee');
    
    console.log(`Total users: ${allUsers.length}`);
    console.log(`  ✅ Keep (admin/manager/hr): ${adminUsers.length}`);
    console.log(`  ❌ Remove (employee type): ${employeeUsers.length}\n`);
    
    if (adminUsers.length > 0) {
      console.log('Users to KEEP:');
      adminUsers.forEach(u => {
        console.log(`  ✅ ${u.email.padEnd(30)} (${u.user_type})`);
      });
      console.log('');
    }
    
    if (employeeUsers.length > 0) {
      console.log('Users to REMOVE:');
      employeeUsers.forEach(u => {
        const empInfo = u.emp_id ? `→ Employee #${u.emp_code}` : '';
        console.log(`  ❌ ${u.email.padEnd(30)} (${u.user_type}) ${empInfo}`);
      });
      console.log('');
    }
    
    if (employeeUsers.length === 0) {
      console.log('✅ No employee-type users found. Table is already clean!\n');
      process.exit(0);
    }
    
    // Step 2: Remove user_id references from employees table
    console.log('📝 Step 2: Removing user_id references from employees table...\n');
    
    const employeeUserIds = employeeUsers.map(u => u.id);
    const [updateResult] = await db.query(`
      UPDATE employees 
      SET user_id = NULL 
      WHERE user_id IN (?)
    `, [employeeUserIds]);
    
    console.log(`  ✅ Updated ${updateResult.affectedRows} employee records\n`);
    
    // Step 3: Delete employee-type users
    console.log('🗑️  Step 3: Deleting employee-type users...\n');
    
    const [deleteResult] = await db.query(`
      DELETE FROM users 
      WHERE user_type = 'employee'
    `);
    
    console.log(`  ✅ Deleted ${deleteResult.affectedRows} users\n`);
    
    // Step 4: Verify cleanup
    console.log('✅ Step 4: Verifying cleanup...\n');
    
    const [remainingUsers] = await db.query(`
      SELECT id, email, user_type 
      FROM users 
      ORDER BY user_type, email
    `);
    
    console.log(`Remaining users: ${remainingUsers.length}\n`);
    remainingUsers.forEach(u => {
      console.log(`  ✅ ${u.email.padEnd(35)} (${u.user_type})`);
    });
    
    // Step 5: Verify employees table
    const [employees] = await db.query(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN user_id IS NULL THEN 1 ELSE 0 END) as without_user,
             SUM(CASE WHEN user_id IS NOT NULL THEN 1 ELSE 0 END) as with_user
      FROM employees
    `);
    
    console.log('\n📊 Employees table status:');
    console.log(`  Total employees: ${employees[0].total}`);
    console.log(`  With user account: ${employees[0].with_user}`);
    console.log(`  Without user account: ${employees[0].without_user}`);
    
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ CLEANUP COMPLETE!                              ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    console.log('✅ Users table now contains only:');
    console.log('   - super_admin (for system administration)');
    console.log('   - manager (for department/team management)');
    console.log('   - hr / hr_manager (for HR operations)\n');
    
    console.log('✅ Employees table remains intact with all employee data\n');
    
    console.log('ℹ️  Note: Employee accounts no longer have user login access.');
    console.log('   If you need to give an employee login access:');
    console.log('   1. Create a user with appropriate role (manager/hr)');
    console.log('   2. Link it to employee via user_id\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the cleanup
cleanupUsers();

