#!/usr/bin/env node

/**
 * Update Role Permissions
 * Assigns comprehensive permissions to each role
 */

const db = require('../config/database');

async function updateRolePermissions() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         🔐 UPDATING ROLE PERMISSIONS                           ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Define role permissions
    const rolePermissions = {
      'super_admin': 'ALL', // Super admin gets all permissions
      
      'hr_manager': [
        // Dashboard & Calendar
        'dashboard.view', 'calendar.view', 'calendar.manage',
        // Employees - Full access
        'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
        // Attendance - Full access
        'attendance.clock', 'attendance.view_all', 'attendance.view_own', 'attendance.manage', 'attendance.approve',
        // Leaves - Full access
        'leaves.view_all', 'leaves.view_own', 'leaves.apply', 'leaves.approve', 'leaves.manage',
        // Payroll - Full access
        'payroll.view_all', 'payroll.view_own', 'payroll.process', 'payroll.manage',
        // Recruitment
        'recruitment.view', 'recruitment.manage', 'recruitment.post',
        // Performance
        'performance.view', 'performance.manage', 'performance.view_own',
        // Training
        'training.view', 'training.manage', 'training.enroll',
        // Documents
        'documents.view', 'documents.upload', 'documents.manage',
        // Reports
        'reports.view', 'reports.generate', 'reports.export',
        // Assets
        'assets.view', 'assets.manage', 'assets.assign',
        // Settings
        'settings.view', 'settings.manage', 'settings.roles', 'settings.users',
        // Announcements
        'announcements.view', 'announcements.create',
        // Messenger
        'messenger.use',
        // Profile
        'profile.view', 'profile.edit',
      ],
      
      'hr': [
        // Dashboard & Calendar
        'dashboard.view', 'calendar.view', 'calendar.manage',
        // Employees - Full access
        'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
        // Attendance
        'attendance.clock', 'attendance.view_all', 'attendance.view_own', 'attendance.manage', 'attendance.approve',
        // Leaves
        'leaves.view_all', 'leaves.view_own', 'leaves.apply', 'leaves.approve',
        // Payroll - Can view all and view own
        'payroll.view_all', 'payroll.view_own',
        // Recruitment
        'recruitment.view', 'recruitment.manage', 'recruitment.post',
        // Performance
        'performance.view', 'performance.manage', 'performance.view_own',
        // Training
        'training.view', 'training.manage', 'training.enroll',
        // Documents
        'documents.view', 'documents.upload', 'documents.manage',
        // Reports
        'reports.view', 'reports.generate', 'reports.export',
        // Assets
        'assets.view', 'assets.assign',
        // Settings - View only
        'settings.view',
        // Announcements
        'announcements.view', 'announcements.create',
        // Messenger
        'messenger.use',
        // Profile
        'profile.view', 'profile.edit',
      ],
      
      'manager': [
        // Dashboard & Calendar
        'dashboard.view', 'calendar.view', 'calendar.manage',
        // Employees - View only
        'employees.view',
        // Attendance
        'attendance.clock', 'attendance.view_all', 'attendance.view_own', 'attendance.manage', 'attendance.approve',
        // Leaves
        'leaves.view_all', 'leaves.view_own', 'leaves.apply', 'leaves.approve',
        // Payroll - Own only
        'payroll.view_own',
        // Performance
        'performance.view', 'performance.manage', 'performance.view_own',
        // Training
        'training.view', 'training.enroll',
        // Documents
        'documents.view', 'documents.upload',
        // Reports
        'reports.view', 'reports.generate',
        // Announcements
        'announcements.view',
        // Messenger
        'messenger.use',
        // Profile
        'profile.view', 'profile.edit',
      ],
      
      'employee': [
        // Dashboard & Calendar
        'dashboard.view', 'calendar.view',
        // Attendance - Clock and view own
        'attendance.clock', 'attendance.view_own',
        // Leaves - Apply and view own
        'leaves.view_own', 'leaves.apply',
        // Payroll - Own only
        'payroll.view_own',
        // Performance - Own only
        'performance.view_own',
        // Training
        'training.view', 'training.enroll',
        // Documents
        'documents.view', 'documents.upload',
        // Announcements
        'announcements.view',
        // Messenger
        'messenger.use',
        // Profile
        'profile.view', 'profile.edit',
      ],
    };

    // Get all roles
    const [roles] = await db.query('SELECT id, slug FROM user_roles');
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.slug] = role.id;
    });

    // Get all permissions
    const [permissions] = await db.query('SELECT id, slug FROM permissions');
    const permissionMap = {};
    permissions.forEach(perm => {
      permissionMap[perm.slug] = perm.id;
    });

    console.log(`Found ${roles.length} roles and ${permissions.length} permissions\n`);

    // Assign permissions to each role
    for (const [roleSlug, perms] of Object.entries(rolePermissions)) {
      const roleId = roleMap[roleSlug];
      if (!roleId) {
        console.log(`⚠️  Role not found: ${roleSlug}`);
        continue;
      }

      // Clear existing permissions for this role
      await db.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);

      let permissionsToAssign = [];
      
      if (perms === 'ALL') {
        // Super admin gets all permissions
        permissionsToAssign = permissions.map(p => p.id);
      } else {
        // Get permission IDs
        for (const permSlug of perms) {
          const permId = permissionMap[permSlug];
          if (permId) {
            permissionsToAssign.push(permId);
          } else {
            console.log(`   ⚠️  Permission not found: ${permSlug}`);
          }
        }
      }

      // Insert new permissions
      for (const permId of permissionsToAssign) {
        await db.query(
          'INSERT INTO role_permissions (role_id, permission_id, created_at) VALUES (?, ?, NOW())',
          [roleId, permId]
        );
      }

      console.log(`✅ ${roleSlug}: Assigned ${permissionsToAssign.length} permissions`);
    }

    console.log('\n' + '━'.repeat(65));
    console.log('✅ All role permissions updated successfully!');
    console.log('━'.repeat(65) + '\n');

    // Show permission count per role
    const [counts] = await db.query(`
      SELECT r.name, r.slug, COUNT(rp.id) as permission_count
      FROM user_roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      GROUP BY r.id
      ORDER BY r.level DESC
    `);

    console.log('📊 Permission counts per role:');
    counts.forEach(({ name, permission_count }) => {
      console.log(`   ${name}: ${permission_count} permissions`);
    });

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║         ✅ ROLE PERMISSIONS UPDATED SUCCESSFULLY!              ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

updateRolePermissions();

