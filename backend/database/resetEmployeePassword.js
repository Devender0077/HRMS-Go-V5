#!/usr/bin/env node

/**
 * Quick Password Reset Script for Employee Accounts
 * 
 * Usage:
 *   node resetEmployeePassword.js
 * 
 * This will reset passwords for common employee test accounts
 */

const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function resetPasswords() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║           🔐 Employee Password Reset Tool                      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const employeeAccounts = [
      'john.doe@hrmsgo.com',
      'jane.smith@hrmsgo.com',
      'bob.johnson@hrmsgo.com',
      'sarah.williams@hrmsgo.com',
      'david.brown@hrmsgo.com',
      'emily.davis@hrmsgo.com',
      'robert.miller@hrmsgo.com',
      'lisa.anderson@hrmsgo.com'
    ];
    
    console.log('Resetting passwords for employee accounts...\n');
    
    let resetCount = 0;
    for (const email of employeeAccounts) {
      const [result] = await db.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, email]
      );
      
      if (result.affectedRows > 0) {
        console.log(`✅ ${email}`);
        resetCount++;
      }
    }
    
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║  ✅ Reset ${resetCount} employee passwords successfully!`);
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    console.log('All employee accounts now use:');
    console.log('  Password: password123\n');
    
    console.log('Example login:');
    console.log('  Email: john.doe@hrmsgo.com');
    console.log('  Password: password123\n');
    
    // Show all reset accounts with employee details
    const [employees] = await db.query(`
      SELECT u.email, CONCAT(e.first_name, ' ', e.last_name) as name, 
             e.employee_id, e.status
      FROM users u
      INNER JOIN employees e ON u.id = e.user_id
      WHERE u.email IN (?)
      ORDER BY u.email
    `, [employeeAccounts]);
    
    if (employees.length > 0) {
      console.log('Updated Accounts:\n');
      employees.forEach((emp, i) => {
        console.log(`${i + 1}. ${emp.email.padEnd(30)} | ${emp.name.padEnd(20)} | ${emp.employee_id}`);
      });
    }
    
    console.log('\n🎉 You can now login with any of these accounts!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the script
resetPasswords();

