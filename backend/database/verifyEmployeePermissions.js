#!/usr/bin/env node

/**
 * Verify Employee Permissions
 * Checks if employee@test.com has all 16 required permissions
 */

const db = require('../config/database');

async function verifyPermissions() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         🔍 VERIFYING EMPLOYEE PERMISSIONS                      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Get employee role
    const [[employeeRole]] = await db.query(
      'SELECT id, name, slug FROM user_roles WHERE slug = ?',
      ['employee']
    );

    if (!employeeRole) {
      console.log('❌ Employee role not found!');
      process.exit(1);
    }

    console.log(`✅ Found Employee Role (ID: ${employeeRole.id})\n`);

    // Get permissions assigned to employee role
    const [rolePermissions] = await db.query(`
      SELECT p.slug, p.name, p.module
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
      ORDER BY p.module, p.slug
    `, [employeeRole.id]);

    console.log('━'.repeat(65));
    console.log(`📊 Employee Role has ${rolePermissions.length} permissions:`);
    console.log('━'.repeat(65));

    // Group by module
    const grouped = {};
    rolePermissions.forEach(perm => {
      if (!grouped[perm.module]) {
        grouped[perm.module] = [];
      }
      grouped[perm.module].push({ slug: perm.slug, name: perm.name });
    });

    Object.keys(grouped).sort().forEach(module => {
      console.log(`\n📁 ${module}:`);
      grouped[module].forEach(perm => {
        console.log(`   ✅ ${perm.slug.padEnd(30)} (${perm.name})`);
      });
    });

    console.log('\n' + '━'.repeat(65));

    // Check for required permissions
    const requiredPermissions = [
      'dashboard.view',
      'calendar.view',
      'attendance.clock',
      'attendance.view_own',
      'leaves.view_own',
      'leaves.apply',
      'payroll.view_own',
      'performance.view_own',
      'training.view',
      'training.enroll',
      'documents.view',
      'documents.upload',
      'announcements.view',
      'messenger.use',
      'profile.view',
      'profile.edit',
    ];

    const assignedSlugs = rolePermissions.map(p => p.slug);
    const missing = requiredPermissions.filter(req => !assignedSlugs.includes(req));

    if (missing.length === 0) {
      console.log('\n✅ ALL 16 REQUIRED PERMISSIONS ARE ASSIGNED!');
    } else {
      console.log(`\n❌ MISSING ${missing.length} PERMISSIONS:`);
      missing.forEach(slug => {
        console.log(`   ❌ ${slug}`);
      });
    }

    console.log('\n' + '━'.repeat(65));

    // Check employee@test.com user
    const [[testUser]] = await db.query(
      'SELECT id, email, user_type, role_id FROM users WHERE email = ?',
      ['employee@test.com']
    );

    if (!testUser) {
      console.log('\n⚠️  User employee@test.com not found!');
    } else {
      console.log(`\n✅ Found User: ${testUser.email}`);
      console.log(`   User Type: ${testUser.user_type}`);
      console.log(`   Role ID: ${testUser.role_id}`);
      
      if (testUser.role_id === employeeRole.id) {
        console.log('   ✅ User has Employee role assigned!');
      } else {
        console.log(`   ❌ User has wrong role_id (expected ${employeeRole.id}, got ${testUser.role_id})`);
      }
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║         ✅ VERIFICATION COMPLETE                               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    if (missing.length === 0 && testUser && testUser.role_id === employeeRole.id) {
      console.log('🎯 NEXT STEP:');
      console.log('   1. LOGOUT from the application');
      console.log('   2. LOGIN again with employee@test.com / Test@123');
      console.log('   3. Check console: localStorage.getItem("permissions")');
      console.log('   4. You should see all 16 permissions!\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

verifyPermissions();

