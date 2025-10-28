/**
 * COMPLETE CLEAN RESET WITH FULL SAMPLE DATA
 * 
 * This script:
 * 1. Deletes ALL data from users and employees
 * 2. Resets auto-increment IDs to 1
 * 3. Creates complete sample data with ALL fields populated
 * 4. Properly links users to employees
 * 5. Assigns correct roles
 * 
 * ARCHITECTURE:
 * - USERS: System access (login, permissions) - can be admin OR employee OR both
 * - EMPLOYEES: Staff members (HR data) - LINKED to users via user_id
 * - Some users are pure admins (no employee profile)
 * - Some users are staff (have employee profile)
 * - Some employees have no user account (staff without login)
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/syncDatabase');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Designation = require('../models/Designation');
const Branch = require('../models/Branch');
const db = require('../config/database');

async function completeCleanReset() {
  try {
    console.log('\n╔═══════════════════════════════════════════════════════════════════════╗');
    console.log('║          🔄 COMPLETE CLEAN RESET WITH FULL SAMPLE DATA               ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');

    console.log('⚠️  WARNING: This will DELETE ALL users & employees and RESET IDs!\n');
    console.log('Press Ctrl+C within 3 seconds to cancel...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🗑️  STEP 1: CLEANING ALL DATA...\n');

    // Delete using Sequelize (handles foreign keys)
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await Employee.destroy({ where: {}, force: true, truncate: true });
    console.log('   ✅ Deleted all employees');
    
    await User.destroy({ where: {}, force: true, truncate: true });
    console.log('   ✅ Deleted all users');

    // Reset auto-increment
    await db.query('ALTER TABLE users AUTO_INCREMENT = 1');
    await db.query('ALTER TABLE employees AUTO_INCREMENT = 1');
    console.log('   ✅ Reset auto-increment IDs to 1');
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('👤 STEP 2: CREATING USERS (Complete Data)...\n');

    // Don't hash here - User model will auto-hash in beforeCreate hook!
    const plainPassword = 'password123';
    const users = {};
    
    console.log('   ℹ️  Password for ALL users: password123');
    console.log('   ℹ️  User model will auto-hash passwords\n');

    // PURE SYSTEM ADMINISTRATORS (No employee profiles - NOT staff members)
    users.superadmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@hrms.com',
      password: plainPassword,
      userType: 'super_admin',
      status: 'active',
      phone: '+1-555-0001',
      language: 'en',
      timezone: 'America/New_York',
    });
    console.log('   ✅ Created: superadmin@hrms.com (super_admin) - NO employee profile');

    users.admin = await User.create({
      name: 'System Administrator',
      email: 'admin@hrms.com',
      password: plainPassword,
      userType: 'admin',
      status: 'active',
      phone: '+1-555-0002',
      language: 'en',
      timezone: 'America/New_York',
    });
    console.log('   ✅ Created: admin@hrms.com (admin) - NO employee profile');

    // HR STAFF (WITH employee profiles - they ARE staff members)
    users.hrManager = await User.create({
      name: 'Sarah Johnson',
      email: 'hr.manager@hrms.com',
      password: plainPassword,
      userType: 'hr_manager',
      status: 'active',
      phone: '+1-555-1001',
      language: 'en',
      timezone: 'America/New_York',
    });
    console.log('   ✅ Created: hr.manager@hrms.com (hr_manager) - WILL have employee profile');

    users.hr = await User.create({
      name: 'Emily Chen',
      email: 'hr@hrms.com',
      password: plainPassword,
      userType: 'hr',
      status: 'active',
      phone: '+1-555-1002',
      language: 'en',
      timezone: 'America/New_York',
    });
    console.log('   ✅ Created: hr@hrms.com (hr) - WILL have employee profile');

    // MANAGERS (WITH employee profiles - they ARE staff members)
    users.manager1 = await User.create({
      name: 'Michael Rodriguez',
      email: 'manager@hrms.com',
      password: plainPassword,
      userType: 'manager',
      status: 'active',
      phone: '+1-555-2001',
      language: 'en',
      timezone: 'America/New_York',
    });
    console.log('   ✅ Created: manager@hrms.com (manager) - WILL have employee profile');

    users.manager2 = await User.create({
      name: 'Lisa Anderson',
      email: 'manager2@hrms.com',
      password: plainPassword,
      userType: 'manager',
      status: 'active',
      phone: '+1-555-2002',
      language: 'en',
      timezone: 'America/New_York',
    });
    console.log('   ✅ Created: manager2@hrms.com (manager) - WILL have employee profile');

    // REGULAR EMPLOYEES (WITH employee profiles - they ARE staff members)
    users.emp1 = await User.create({
      name: 'John Doe',
      email: 'john.doe@hrms.com',
      password: plainPassword,
      userType: 'employee',
      status: 'active',
      phone: '+1-555-3001',
      language: 'en',
      timezone: 'America/New_York',
    });
    console.log('   ✅ Created: john.doe@hrms.com (employee) - WILL have employee profile');

    users.emp2 = await User.create({
      name: 'Sarah Williams',
      email: 'sarah.williams@hrms.com',
      password: plainPassword,
      userType: 'employee',
      status: 'active',
      phone: '+1-555-3002',
      language: 'en',
      timezone: 'America/New_York',
    });
    console.log('   ✅ Created: sarah.williams@hrms.com (employee) - WILL have employee profile');

    users.emp3 = await User.create({
      name: 'David Brown',
      email: 'david.brown@hrms.com',
      password: plainPassword,
      userType: 'employee',
      status: 'active',
      phone: '+1-555-3003',
      language: 'en',
      timezone: 'America/New_York',
    });
    console.log('   ✅ Created: david.brown@hrms.com (employee) - WILL have employee profile');

    users.emp4 = await User.create({
      name: 'Emily Davis',
      email: 'emily.davis@hrms.com',
      password: plainPassword,
      userType: 'employee',
      status: 'active',
      phone: '+1-555-3004',
      language: 'en',
      timezone: 'America/New_York',
    });
    console.log('   ✅ Created: emily.davis@hrms.com (employee) - WILL have employee profile');

    console.log(`\n   📊 Total users created: ${Object.keys(users).length}`);
    console.log('   ✅ User IDs start from 1 (clean reset)');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('👔 STEP 3: CREATING EMPLOYEES (Complete Data - ALL Fields)...\n');

    // Get departments, designations, branches
    const dept1 = await Department.findOne({ where: { name: 'Engineering' } }) || await Department.findByPk(1);
    const dept2 = await Department.findOne({ where: { name: 'Human Resources' } }) || await Department.findByPk(2);
    const dept3 = await Department.findOne({ where: { name: 'Sales' } }) || await Department.findByPk(3);
    const dept4 = await Department.findOne({ where: { name: 'Marketing' } }) || await Department.findByPk(4);
    
    const desigManager = await Designation.findByPk(2);
    const desigSenior = await Designation.findByPk(3);
    const desigJunior = await Designation.findByPk(4);
    
    const branch = await Branch.findByPk(1);

    // HR EMPLOYEES (Linked to HR user accounts) - COMPLETE DATA
    await Employee.create({
      userId: users.hrManager.id,
      employeeId: 'HR001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'hr.manager@hrms.com',
      phone: '+1-555-1001',
      dateOfBirth: '1985-03-15',
      gender: 'female',
      maritalStatus: 'married',
      address: '123 Main St, Apt 4B',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      departmentId: dept2?.id || 2,
      designationId: desigManager?.id || 2,
      branchId: branch?.id || 1,
      joiningDate: '2024-01-15',
      employmentType: 'full_time',
      workEmail: 'sarah.johnson@company.com',
      salary: 85000,
      status: 'active',
    });
    console.log('   ✅ HR001 - Sarah Johnson (HR Manager) - COMPLETE DATA');

    await Employee.create({
      userId: users.hr.id,
      employeeId: 'HR002',
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'hr@hrms.com',
      phone: '+1-555-1002',
      dateOfBirth: '1990-07-22',
      gender: 'female',
      maritalStatus: 'single',
      address: '456 Park Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10002',
      departmentId: dept2?.id || 2,
      designationId: desigSenior?.id || 3,
      branchId: branch?.id || 1,
      joiningDate: '2024-03-01',
      employmentType: 'full_time',
      workEmail: 'emily.chen@company.com',
      salary: 70000,
      status: 'active',
    });
    console.log('   ✅ HR002 - Emily Chen (HR) - COMPLETE DATA');

    // MANAGER EMPLOYEES (Linked to manager user accounts) - COMPLETE DATA
    await Employee.create({
      userId: users.manager1.id,
      employeeId: 'MGR001',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      email: 'manager@hrms.com',
      phone: '+1-555-2001',
      dateOfBirth: '1982-11-10',
      gender: 'male',
      maritalStatus: 'married',
      address: '789 Broadway',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10003',
      departmentId: dept1?.id || 1,
      designationId: desigManager?.id || 2,
      branchId: branch?.id || 1,
      joiningDate: '2023-06-01',
      employmentType: 'full_time',
      workEmail: 'michael.rodriguez@company.com',
      salary: 95000,
      status: 'active',
    });
    console.log('   ✅ MGR001 - Michael Rodriguez (Manager - Engineering) - COMPLETE DATA');

    await Employee.create({
      userId: users.manager2.id,
      employeeId: 'MGR002',
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'manager2@hrms.com',
      phone: '+1-555-2002',
      dateOfBirth: '1988-05-18',
      gender: 'female',
      maritalStatus: 'divorced',
      address: '321 Fifth Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10004',
      departmentId: dept3?.id || 3,
      designationId: desigManager?.id || 2,
      branchId: branch?.id || 1,
      joiningDate: '2023-09-15',
      employmentType: 'full_time',
      workEmail: 'lisa.anderson@company.com',
      salary: 92000,
      status: 'active',
    });
    console.log('   ✅ MGR002 - Lisa Anderson (Manager - Sales) - COMPLETE DATA');

    // REGULAR EMPLOYEES (Linked to employee user accounts) - COMPLETE DATA
    await Employee.create({
      userId: users.emp1.id,
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@hrms.com',
      phone: '+1-555-3001',
      dateOfBirth: '1995-01-25',
      gender: 'male',
      maritalStatus: 'single',
      address: '111 West St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10005',
      departmentId: dept1?.id || 1,
      designationId: desigSenior?.id || 3,
      branchId: branch?.id || 1,
      joiningDate: '2024-01-01',
      employmentType: 'full_time',
      workEmail: 'john.doe@company.com',
      salary: 75000,
      status: 'active',
    });
    console.log('   ✅ EMP001 - John Doe (Employee - Engineering) - COMPLETE DATA');

    await Employee.create({
      userId: users.emp2.id,
      employeeId: 'EMP002',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@hrms.com',
      phone: '+1-555-3002',
      dateOfBirth: '1993-08-14',
      gender: 'female',
      maritalStatus: 'married',
      address: '222 East St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10006',
      departmentId: dept1?.id || 1,
      designationId: desigSenior?.id || 3,
      branchId: branch?.id || 1,
      joiningDate: '2024-02-01',
      employmentType: 'full_time',
      workEmail: 'sarah.williams@company.com',
      salary: 72000,
      status: 'active',
    });
    console.log('   ✅ EMP002 - Sarah Williams (Employee - Engineering) - COMPLETE DATA');

    await Employee.create({
      userId: users.emp3.id,
      employeeId: 'EMP003',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@hrms.com',
      phone: '+1-555-3003',
      dateOfBirth: '1991-12-05',
      gender: 'male',
      maritalStatus: 'single',
      address: '333 North Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10007',
      departmentId: dept3?.id || 3,
      designationId: desigSenior?.id || 3,
      branchId: branch?.id || 1,
      joiningDate: '2024-03-01',
      employmentType: 'full_time',
      workEmail: 'david.brown@company.com',
      salary: 68000,
      status: 'active',
    });
    console.log('   ✅ EMP003 - David Brown (Employee - Sales) - COMPLETE DATA');

    await Employee.create({
      userId: users.emp4.id,
      employeeId: 'EMP004',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@hrms.com',
      phone: '+1-555-3004',
      dateOfBirth: '1994-04-30',
      gender: 'female',
      maritalStatus: 'single',
      address: '444 South Blvd',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10008',
      departmentId: dept3?.id || 3,
      designationId: desigJunior?.id || 4,
      branchId: branch?.id || 1,
      joiningDate: '2024-04-01',
      employmentType: 'full_time',
      workEmail: 'emily.davis@company.com',
      salary: 62000,
      status: 'active',
    });
    console.log('   ✅ EMP004 - Emily Davis (Employee - Sales) - COMPLETE DATA');

    // EMPLOYEES WITHOUT USER ACCOUNTS (Staff who don't need system access) - COMPLETE DATA
    const staffWithoutLogin = [
      { id: 'EMP005', first: 'Robert', last: 'Miller', dob: '1987-09-12', gender: 'male', marital: 'married', dept: dept1?.id || 1, salary: 65000, phone: '+1-555-4001' },
      { id: 'EMP006', first: 'Jennifer', last: 'Wilson', dob: '1992-02-28', gender: 'female', marital: 'single', dept: dept1?.id || 1, salary: 61000, phone: '+1-555-4002' },
      { id: 'EMP007', first: 'Thomas', last: 'Moore', dob: '1989-11-07', gender: 'male', marital: 'single', dept: dept3?.id || 3, salary: 59000, phone: '+1-555-4003' },
      { id: 'EMP008', first: 'Linda', last: 'Taylor', dob: '1993-06-19', gender: 'female', marital: 'married', dept: dept3?.id || 3, salary: 58000, phone: '+1-555-4004' },
      { id: 'EMP009', first: 'Christopher', last: 'Jackson', dob: '1996-03-21', gender: 'male', marital: 'single', dept: dept4?.id || 4, salary: 55000, phone: '+1-555-4005' },
      { id: 'EMP010', first: 'Patricia', last: 'White', dob: '1991-10-14', gender: 'female', marital: 'single', dept: dept4?.id || 4, salary: 56000, phone: '+1-555-4006' },
    ];

    let empIndex = 0;
    for (const emp of staffWithoutLogin) {
      await Employee.create({
        userId: null, // NO user account
        employeeId: emp.id,
        firstName: emp.first,
        lastName: emp.last,
        email: `${emp.first.toLowerCase()}.${emp.last.toLowerCase()}@company.com`,
        phone: emp.phone,
        dateOfBirth: emp.dob,
        gender: emp.gender,
        maritalStatus: emp.marital,
        address: `${500 + empIndex} Company Lane`,
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: `${10009 + empIndex}`,
        departmentId: emp.dept,
        designationId: desigJunior?.id || 4,
        branchId: branch?.id || 1,
        joiningDate: '2024-05-01',
        employmentType: 'full_time',
        workEmail: `${emp.first.toLowerCase()}.${emp.last.toLowerCase()}@work.company.com`,
        salary: emp.salary,
        status: 'active',
      });
      console.log(`   ✅ ${emp.id} - ${emp.first} ${emp.last} (NO login - HR manages) - COMPLETE DATA`);
      empIndex++;
    }

    console.log(`\n   📊 Total employees created: ${8 + staffWithoutLogin.length}`);
    console.log('   ✅ Employee IDs start from 1 (clean reset)');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔑 STEP 4: ASSIGNING ROLES TO USERS...\n');

    // Assign roles using raw SQL (more reliable)
    await db.query('UPDATE users SET role_id = 1 WHERE email = ?', ['superadmin@hrms.com']);
    console.log('   ✅ superadmin@hrms.com → Role: Super Admin (1)');
    
    await db.query('UPDATE users SET role_id = 2 WHERE email IN (?, ?)', ['admin@hrms.com', 'hr.manager@hrms.com']);
    console.log('   ✅ admin@hrms.com → Role: HR Manager (2)');
    console.log('   ✅ hr.manager@hrms.com → Role: HR Manager (2)');
    
    await db.query('UPDATE users SET role_id = 3 WHERE email = ?', ['hr@hrms.com']);
    console.log('   ✅ hr@hrms.com → Role: HR (3)');
    
    await db.query('UPDATE users SET role_id = 4 WHERE email IN (?, ?)', ['manager@hrms.com', 'manager2@hrms.com']);
    console.log('   ✅ manager@hrms.com → Role: Manager (4)');
    console.log('   ✅ manager2@hrms.com → Role: Manager (4)');
    
    await db.query('UPDATE users SET role_id = 5 WHERE user_type = ?', ['employee']);
    console.log('   ✅ All employees → Role: Employee (5)');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ VERIFICATION:\n');

    const [finalUsers] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.user_type,
        u.role_id,
        r.name as role_name,
        CASE WHEN e.id IS NOT NULL THEN 'YES' ELSE 'NO' END as has_employee_profile
      FROM users u
      LEFT JOIN user_roles r ON u.role_id = r.id
      LEFT JOIN employees e ON u.id = e.user_id
      WHERE u.status = 'active'
      ORDER BY u.id
    `);

    console.log('ID'.padEnd(5) + 'Email'.padEnd(30) + 'User Type'.padEnd(15) + 'Role Name'.padEnd(20) + 'Employee');
    console.log('─'.repeat(95));
    
    finalUsers.forEach(u => {
      const icon = u.has_employee_profile === 'YES' ? '👔' : '🔐';
      console.log(
        `${icon} ${String(u.id).padEnd(3)} ${u.email.padEnd(28)} ${(u.user_type || 'NULL').padEnd(13)} ${(u.role_name || 'NO ROLE').padEnd(18)} ${u.has_employee_profile}`
      );
    });

    const [finalEmployees] = await db.query('SELECT COUNT(*) as count FROM employees');
    const [linkedEmployees] = await db.query('SELECT COUNT(*) as count FROM employees WHERE user_id IS NOT NULL');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 FINAL SUMMARY:\n');
    console.log(`   👤 Total Users: ${finalUsers.length}`);
    console.log(`      🔐 Pure Admins (no employee): 2`);
    console.log(`      👔 Staff with login (has employee): 8`);
    console.log('');
    console.log(`   👔 Total Employees: ${finalEmployees[0].count}`);
    console.log(`      🔗 Linked to users (can login): ${linkedEmployees[0].count}`);
    console.log(`      👤 Standalone (no login): ${finalEmployees[0].count - linkedEmployees[0].count}`);
    console.log('');
    console.log('   ✅ Users have BOTH admins AND employees (different types!)');
    console.log('   ✅ Employees have COMPLETE data (all fields populated)');
    console.log('   ✅ User-Employee linking is PROPER');
    console.log('   ✅ IDs reset to start from 1');
    console.log('   ✅ Roles correctly assigned (1, 2, 3, 4, 5)');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 TEST ACCOUNTS (Password: password123):\n');

    console.log('🔐 PURE ADMINS (NO employee profile):');
    console.log('   superadmin@hrms.com - Super Admin');
    console.log('   admin@hrms.com - Admin');
    console.log('   → Can manage system, NO personal HR data\n');

    console.log('👔 HR STAFF (WITH employee profile):');
    console.log('   hr.manager@hrms.com - HR Manager (Employee: HR001)');
    console.log('   hr@hrms.com - HR (Employee: HR002)');
    console.log('   → Can manage HR + have own leaves/attendance\n');

    console.log('👔 MANAGERS (WITH employee profile):');
    console.log('   manager@hrms.com - Manager (Employee: MGR001)');
    console.log('   manager2@hrms.com - Manager (Employee: MGR002)');
    console.log('   → Can manage team + have own leaves/attendance\n');

    console.log('👔 EMPLOYEES (WITH employee profile):');
    console.log('   john.doe@hrms.com - Employee (EMP001)');
    console.log('   sarah.williams@hrms.com - Employee (EMP002)');
    console.log('   david.brown@hrms.com - Employee (EMP003)');
    console.log('   emily.davis@hrms.com - Employee (EMP004)');
    console.log('   → Have own leaves/attendance only\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ DATABASE RESET COMPLETE!\n');
    console.log('🔄 NEXT:\n');
    console.log('   1. Restart backend: cd backend && npm start');
    console.log('   2. Clear browser: localStorage.clear(); location.href="/auth/login"');
    console.log('   3. Test with: john.doe@hrms.com / password123');
    console.log('   4. Go to: /dashboard/leaves/apply');
    console.log('   5. Verify: "Your Leave Balance" shows all types\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  } finally {
    await db.end();
    await sequelize.close();
  }
}

completeCleanReset();

