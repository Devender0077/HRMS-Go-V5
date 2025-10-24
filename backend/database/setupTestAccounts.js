const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupTestAccounts() {
  let connection;
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║              SETTING UP TEST ACCOUNTS FOR ALL ROLES                        ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'hrms_go_v5'
    });

    console.log('✓ Connected to database\n');

    // Hash password for all test accounts
    const password = 'Test@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Test accounts to create
    const testAccounts = [
      { email: 'superadmin@test.com', name: 'Super Admin Test', user_type: 'super_admin', role_id: 1 },
      { email: 'hrmanager@test.com', name: 'HR Manager Test', user_type: 'hr_manager', role_id: 2 },
      { email: 'hr@test.com', name: 'HR Test', user_type: 'hr', role_id: 3 },
      { email: 'manager@test.com', name: 'Manager Test', user_type: 'manager', role_id: 4 },
      { email: 'employee@test.com', name: 'Employee Test', user_type: 'employee', role_id: 5 },
    ];

    console.log('⏳ Creating test accounts...\n');

    for (const account of testAccounts) {
      try {
        // Check if account exists
        const [existing] = await connection.query(
          'SELECT id FROM users WHERE email = ?',
          [account.email]
        );

        if (existing.length > 0) {
          // Update existing account
          await connection.query(
            'UPDATE users SET password = ?, user_type = ?, role_id = ?, status = ?, updated_at = NOW() WHERE email = ?',
            [hashedPassword, account.user_type, account.role_id, 'active', account.email]
          );
          console.log(`✓ Updated: ${account.email}`);
        } else {
          // Create new account
          await connection.query(
            'INSERT INTO users (name, email, password, user_type, role_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [account.name, account.email, hashedPassword, account.user_type, account.role_id, 'active']
          );
          console.log(`✓ Created: ${account.email}`);
        }
      } catch (error) {
        console.error(`❌ Error for ${account.email}:`, error.message);
      }
    }

    console.log('\n═'.repeat(80));
    console.log('📋 TEST ACCOUNT CREDENTIALS:');
    console.log('═'.repeat(80));
    console.log('\n✅ Super Admin:');
    console.log('   Email: superadmin@test.com');
    console.log('   Password: Test@123');
    console.log('   Expected Access: ALL PAGES\n');

    console.log('✅ HR Manager:');
    console.log('   Email: hrmanager@test.com');
    console.log('   Password: Test@123');
    console.log('   Expected Access: Almost all except system settings\n');

    console.log('✅ HR:');
    console.log('   Email: hr@test.com');
    console.log('   Password: Test@123');
    console.log('   Expected Access: Employees, Attendance, Leaves, Documents\n');

    console.log('✅ Manager:');
    console.log('   Email: manager@test.com');
    console.log('   Password: Test@123');
    console.log('   Expected Access: Dashboard, Employees (view), Attendance, Leaves, Performance\n');

    console.log('✅ Employee:');
    console.log('   Email: employee@test.com');
    console.log('   Password: Test@123');
    console.log('   Expected Access: Dashboard, Calendar, Attendance (clock), Leaves (apply), Payroll (own)\n');

    console.log('═'.repeat(80));
    
    // Show what permissions each role has
    console.log('\n📊 CHECKING ROLE PERMISSIONS:\n');
    
    const [roles] = await connection.query('SELECT id, name, slug FROM user_roles ORDER BY id');
    
    for (const role of roles) {
      const [perms] = await connection.query(
        `SELECT p.slug
         FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id = ?
         ORDER BY p.slug
         LIMIT 10`,
        [role.id]
      );
      
      const [[{total}]] = await connection.query(
        'SELECT COUNT(*) as total FROM role_permissions WHERE role_id = ?',
        [role.id]
      );
      
      console.log(`${role.name} (${total} permissions):`);
      console.log('  First 10:', perms.map(p => p.slug).join(', '));
      console.log('');
    }

    console.log('✅ TEST ACCOUNTS READY!\n');
    console.log('🎯 NEXT STEPS:');
    console.log('   1. Logout from current session');
    console.log('   2. Clear browser storage (F12 → Application → Clear Site Data)');
    console.log('   3. Close browser completely');
    console.log('   4. Reopen and login with test accounts above');
    console.log('   5. Verify navigation shows correct pages for each role\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

setupTestAccounts();

