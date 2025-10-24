#!/usr/bin/env node

/**
 * Create Employee Profiles for All Test Accounts
 */

const db = require('../config/database');

async function createEmployeeProfiles() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         👥 CREATING EMPLOYEE PROFILES FOR TEST ACCOUNTS        ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const testAccounts = [
      {
        email: 'employee@test.com',
        employeeId: 'EMP001',
        firstName: 'Employee',
        lastName: 'Test',
        departmentId: 1,
        designationId: 1,
      },
      {
        email: 'manager@test.com',
        employeeId: 'MGR001',
        firstName: 'Manager',
        lastName: 'Test',
        departmentId: 1,
        designationId: 2,
      },
      {
        email: 'hr@test.com',
        employeeId: 'HR001',
        firstName: 'HR',
        lastName: 'Test',
        departmentId: 2,
        designationId: 3,
      },
      {
        email: 'hrmanager@test.com',
        employeeId: 'HRMGR001',
        firstName: 'HR Manager',
        lastName: 'Test',
        departmentId: 2,
        designationId: 4,
      },
      {
        email: 'superadmin@test.com',
        employeeId: 'ADMIN001',
        firstName: 'Super',
        lastName: 'Admin',
        departmentId: 1,
        designationId: 5,
      },
    ];

    for (const account of testAccounts) {
      // Get user
      const [[user]] = await db.query('SELECT id FROM users WHERE email = ?', [account.email]);
      
      if (!user) {
        console.log(`⚠️  User not found: ${account.email}`);
        continue;
      }

      // Check if employee profile already exists
      const [[existing]] = await db.query('SELECT id FROM employees WHERE user_id = ?', [user.id]);
      
      if (existing) {
        console.log(`✅ ${account.email.padEnd(25)} → Already has employee profile (ID: ${existing.id})`);
        continue;
      }

      // Create employee profile
      await db.query(`
        INSERT INTO employees (
          user_id, employee_id, first_name, last_name, email, phone,
          joining_date, department_id, designation_id, status,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, '0000000000',
          CURDATE(), ?, ?, 'active',
          NOW(), NOW()
        )
      `, [
        user.id,
        account.employeeId,
        account.firstName,
        account.lastName,
        account.email,
        account.departmentId,
        account.designationId,
      ]);

      console.log(`✅ ${account.email.padEnd(25)} → Created employee profile (${account.employeeId})`);
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║         ✅ EMPLOYEE PROFILES CREATED SUCCESSFULLY!             ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createEmployeeProfiles();

