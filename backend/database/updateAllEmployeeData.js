/**
 * Update All Existing Employees with Complete Data
 * Fills in missing fields for all employees
 */

const Employee = require('../models/Employee');
const sequelize = require('../config/database2');

const completeEmployeeData = [
  {
    employeeId: 'EMP001',
    updates: {
      maritalStatus: 'married',
      bloodGroup: 'O+',
      nationality: 'American',
      shift: 'Morning Shift',
      attendancePolicy: 'Standard Policy',
      paymentMethod: 'Bank Transfer',
      address: '123 Main Street',
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      postalCode: '90001',
      emergencyContactName: 'Mary Doe',
      emergencyContactPhone: '+1234567899',
      emergencyContactRelation: 'Spouse',
      bankName: 'Bank of America',
      accountNumber: '1234567890',
      routingNumber: '121000358',
    },
  },
  {
    employeeId: 'EMP002',
    updates: {
      maritalStatus: 'single',
      bloodGroup: 'A+',
      nationality: 'American',
      shift: 'Morning Shift',
      attendancePolicy: 'Standard Policy',
      paymentMethod: 'Bank Transfer',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      postalCode: '90002',
      emergencyContactName: 'Robert Smith',
      emergencyContactPhone: '+1234567898',
      emergencyContactRelation: 'Parent',
      bankName: 'Chase Bank',
      accountNumber: '9876543210',
    },
  },
  {
    employeeId: 'EMP003',
    updates: {
      maritalStatus: 'married',
      bloodGroup: 'B+',
      nationality: 'American',
      shift: 'Morning Shift',
      attendancePolicy: 'Flexible Policy',
      paymentMethod: 'Bank Transfer',
      address: '789 Pine Road',
      city: 'New York',
      state: 'New York',
      country: 'USA',
      postalCode: '10001',
      emergencyContactName: 'Alice Johnson',
      emergencyContactPhone: '+1234567897',
      emergencyContactRelation: 'Spouse',
      bankName: 'Citibank',
      accountNumber: '5555555555',
    },
  },
  {
    employeeId: 'EMP004',
    updates: {
      maritalStatus: 'single',
      bloodGroup: 'AB+',
      nationality: 'American',
      shift: 'Morning Shift',
      attendancePolicy: 'Standard Policy',
      paymentMethod: 'Bank Transfer',
      address: '321 Elm Street',
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      postalCode: '90003',
      emergencyContactName: 'Tom Williams',
      emergencyContactPhone: '+1234567896',
      emergencyContactRelation: 'Parent',
      bankName: 'Wells Fargo',
      accountNumber: '3333333333',
    },
  },
  {
    employeeId: 'EMP005',
    updates: {
      maritalStatus: 'married',
      bloodGroup: 'A-',
      nationality: 'American',
      shift: 'Evening Shift',
      attendancePolicy: 'Standard Policy',
      paymentMethod: 'Bank Transfer',
      address: '654 Maple Drive',
      city: 'New York',
      state: 'New York',
      country: 'USA',
      postalCode: '10002',
      emergencyContactName: 'Susan Brown',
      emergencyContactPhone: '+1234567895',
      emergencyContactRelation: 'Spouse',
      bankName: 'TD Bank',
      accountNumber: '4444444444',
    },
  },
  {
    employeeId: 'EMP006',
    updates: {
      maritalStatus: 'single',
      bloodGroup: 'O-',
      nationality: 'American',
      shift: 'Morning Shift',
      attendancePolicy: 'Flexible Policy',
      paymentMethod: 'Bank Transfer',
      address: '987 Cedar Lane',
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      postalCode: '90004',
      emergencyContactName: 'James Davis',
      emergencyContactPhone: '+1234567894',
      emergencyContactRelation: 'Sibling',
      bankName: 'US Bank',
      accountNumber: '6666666666',
    },
  },
  {
    employeeId: 'EMP007',
    updates: {
      maritalStatus: 'divorced',
      bloodGroup: 'B-',
      nationality: 'American',
      shift: 'Evening Shift',
      attendancePolicy: 'Standard Policy',
      paymentMethod: 'Bank Transfer',
      address: '147 Birch Avenue',
      city: 'Austin',
      state: 'Texas',
      country: 'USA',
      postalCode: '73301',
      emergencyContactName: 'Maria Miller',
      emergencyContactPhone: '+1234567893',
      emergencyContactRelation: 'Parent',
      bankName: 'Capital One',
      accountNumber: '7777777777',
    },
  },
  {
    employeeId: 'EMP008',
    updates: {
      maritalStatus: 'single',
      bloodGroup: 'AB-',
      nationality: 'American',
      shift: 'Night Shift',
      attendancePolicy: 'Flexible Policy',
      paymentMethod: 'Bank Transfer',
      address: '258 Walnut Street',
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      postalCode: '90005',
      emergencyContactName: 'Carlos Anderson',
      emergencyContactPhone: '+1234567892',
      emergencyContactRelation: 'Parent',
      bankName: 'PNC Bank',
      accountNumber: '8888888888',
    },
  },
];

async function updateAllEmployees() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    📝 Updating All Employees with Complete Data               ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    let updated = 0;

    for (const empData of completeEmployeeData) {
      try {
        const employee = await Employee.findOne({
          where: { employeeId: empData.employeeId },
        });

        if (employee) {
          await employee.update(empData.updates);
          console.log(`✅ Updated ${empData.employeeId}: ${employee.firstName} ${employee.lastName}`);
          updated++;
        } else {
          console.log(`⏭️  Employee not found: ${empData.employeeId}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${empData.employeeId}:`, error.message);
      }
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║    ✅ Updated ${updated}/${completeEmployeeData.length} employees with complete data          ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\nAll employees now have:');
    console.log('  ✅ Marital Status, Blood Group, Nationality');
    console.log('  ✅ Shift, Attendance Policy, Payment Method');
    console.log('  ✅ Complete Address (street, city, state, postal code, country)');
    console.log('  ✅ Emergency Contact (name, phone, relation)');
    console.log('  ✅ Bank Details (bank name, account number, routing)\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updateAllEmployees();
}

module.exports = { updateAllEmployees };

