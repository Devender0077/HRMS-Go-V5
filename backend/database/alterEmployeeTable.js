/**
 * Alter Employee Table - Add Missing Fields Using Sequelize
 * 
 * This script uses Sequelize's alter() to add new fields to the employees table
 * without dropping existing data.
 */

const sequelize = require('../config/database2');
const Employee = require('../models/Employee');

async function alterEmployeeTable() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║     🔄 Altering Employee Table - Adding New Fields             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    console.log('📋 Altering employees table (this may take a moment)...\n');

    // Use alter() to add missing columns
    await Employee.sync({ alter: true });

    console.log('✅ Employee table altered successfully!');
    console.log('   New fields added:');
    console.log('   • payment_method');
    console.log('   • blood_group');
    console.log('   • nationality');
    console.log('   • emergency_contact_name');
    console.log('   • emergency_contact_phone');
    console.log('   • emergency_contact_relation\n');

    // Get count of existing employees
    const count = await Employee.count();
    console.log(`📊 Total employees in table: ${count}\n`);

    if (count > 0) {
      console.log('💡 TIP: Run "npm run db:seed" to add complete sample data');
      console.log('   This will add more employees with all fields populated.\n');
    }

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ ALTER COMPLETE!                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\nNext steps:');
    console.log('  1. Restart backend (if running)');
    console.log('  2. Restart frontend');
    console.log('  3. Test employee pages\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error altering employee table:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  alterEmployeeTable();
}

module.exports = { alterEmployeeTable };

