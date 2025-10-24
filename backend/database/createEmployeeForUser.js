#!/usr/bin/env node

const db = require('../config/database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createEmployee() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║         Create Employee Profile for Existing User             ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Show users without employee profiles
    const [usersWithoutProfiles] = await db.query(`
      SELECT u.id, u.email, u.user_type
      FROM users u
      LEFT JOIN employees e ON u.id = e.user_id
      WHERE e.id IS NULL
      ORDER BY u.id
    `);

    if (usersWithoutProfiles.length === 0) {
      console.log('✅ All users already have employee profiles!');
      process.exit(0);
    }

    console.log('Users WITHOUT employee profiles:\n');
    usersWithoutProfiles.forEach(u => {
      console.log(`  ${u.id}. ${u.email} (${u.user_type})`);
    });

    rl.question('\nEnter user ID to create employee profile for: ', async (userId) => {
      const user = usersWithoutProfiles.find(u => u.id === parseInt(userId));
      
      if (!user) {
        console.log('❌ Invalid user ID or user already has employee profile');
        rl.close();
        process.exit(1);
      }

      // Get next employee_id
      const [maxEmp] = await db.query('SELECT MAX(id) as max_id FROM employees');
      const newEmployeeId = (maxEmp[0].max_id || 30) + 1;
      const empCode = `EMP${String(newEmployeeId).padStart(4, '0')}`;

      rl.question(`Enter first name: `, (firstName) => {
        rl.question(`Enter last name: `, async (lastName) => {
          
          try {
            await db.query(`
              INSERT INTO employees (
                user_id, employee_id, first_name, last_name, email,
                joining_date, employment_type, status
              ) VALUES (?, ?, ?, ?, ?, CURDATE(), 'full_time', 'active')
            `, [userId, empCode, firstName, lastName, user.email]);

            console.log('\n✅ Employee profile created successfully!');
            console.log(`   User ID: ${userId}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Employee ID: ${empCode}`);
            console.log(`   Name: ${firstName} ${lastName}`);
            console.log('\n🎉 You can now login and use clock in/out!');
            
            rl.close();
            process.exit(0);
          } catch (error) {
            console.error('❌ Error creating employee:', error.message);
            rl.close();
            process.exit(1);
          }
        });
      });
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createEmployee();

