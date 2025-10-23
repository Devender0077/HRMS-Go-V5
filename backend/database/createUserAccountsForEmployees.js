/**
 * Create User Accounts for All Employees
 * Links employees to user accounts for login capability
 */

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Employee = require('../models/Employee');
const sequelize = require('../config/database2');

async function createUserAccounts() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    🔐 Creating User Accounts for All Employees                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get all employees without user accounts
    const employees = await Employee.findAll({
      where: { userId: null },
    });

    console.log(`📊 Found ${employees.length} employees without user accounts\n`);

    if (employees.length === 0) {
      console.log('✅ All employees already have user accounts!\n');
      process.exit(0);
    }

    let created = 0;

    for (const employee of employees) {
      try {
        // Create user account with default password "password123"
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const user = await User.create({
          name: `${employee.firstName} ${employee.lastName}`,
          email: employee.email,
          password: hashedPassword,
          userType: 'employee',
          status: 'active',
          emailVerifiedAt: new Date(),
        });

        // Link employee to user
        await employee.update({ userId: user.id });

        console.log(`✅ Created user account: ${employee.email} (Employee: ${employee.employeeId})`);
        created++;
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          // User already exists, try to link
          const existingUser = await User.findOne({ where: { email: employee.email } });
          if (existingUser) {
            await employee.update({ userId: existingUser.id });
            console.log(`🔗 Linked existing user: ${employee.email} (Employee: ${employee.employeeId})`);
            created++;
          }
        } else {
          console.error(`❌ Error creating user for ${employee.email}:`, error.message);
        }
      }
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║    ✅ User Accounts Created: ${created}/${employees.length}                      ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n📝 LOGIN CREDENTIALS FOR EMPLOYEES:');
    console.log('   Email: {employee_email}');
    console.log('   Password: password123');
    console.log('\n⚠️  Employees should change their password after first login!\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  createUserAccounts();
}

module.exports = { createUserAccounts };

