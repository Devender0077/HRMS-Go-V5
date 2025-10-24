const mysql = require('mysql2/promise');
require('dotenv').config();

async function assignRolePermissions() {
  let connection;
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║              ASSIGNING ROLE PERMISSIONS                                    ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'hrms_go_v5'
    });

    console.log('✓ Connected to database\n');

    // Get all roles
    const [roles] = await connection.query('SELECT * FROM user_roles ORDER BY id');
    
    // Get all permissions
    const [allPermissions] = await connection.query('SELECT * FROM permissions ORDER BY id');
    
    console.log(`Found ${roles.length} roles and ${allPermissions.length} permissions\n`);

    // Define permission sets for each role
    const rolePermissions = {
      // Super Admin - ALL permissions
      'super_admin': allPermissions.map(p => p.slug),
      
      // HR Manager - Almost all except super admin actions
      'hr_manager': allPermissions
        .filter(p => !p.slug.includes('system.') && !p.slug.includes('roles.delete') && !p.slug.includes('users.delete_admin'))
        .map(p => p.slug),
      
      // HR - Employee management, leaves, attendance, payroll view
      'hr': [
        'dashboard.view',
        'calendar.view',
        'employees.view',
        'employees.create',
        'employees.edit',
        'employees.delete',
        'departments.view',
        'departments.manage',
        'branches.view',
        'branches.manage',
        'designations.view',
        'designations.manage',
        'attendance.view_all',
        'attendance.view_reports',
        'attendance.edit',
        'attendance.approve',
        'leaves.view_all',
        'leaves.approve',
        'leaves.reject',
        'leaves.manage_types',
        'payroll.view_all',
        'payroll.view_reports',
        'documents.view_all',
        'documents.verify',
        'reports.view',
        'reports.generate',
        'policies.view',
      ],
      
      // Manager - Team management, approve leaves/attendance
      'manager': [
        'dashboard.view',
        'calendar.view',
        'employees.view',
        'attendance.view_all',
        'attendance.view_team',
        'attendance.approve',
        'leaves.view_all',
        'leaves.approve',
        'leaves.reject',
        'performance.view_all',
        'performance.create',
        'performance.edit',
        'training.view',
        'reports.view',
      ],
      
      // Employee - Self-service only
      'employee': [
        'dashboard.view',
        'calendar.view',
        'attendance.view_own',
        'attendance.clock',
        'leaves.view_own',
        'leaves.apply',
        'payroll.view_own',
        'documents.view_own',
        'documents.upload',
        'performance.view_own',
        'training.view',
      ],
    };

    // Clear existing role permissions
    console.log('⏳ Clearing existing role permissions...');
    await connection.query('DELETE FROM role_permissions');
    console.log('✓ Cleared\n');

    // Assign permissions to each role
    console.log('⏳ Assigning permissions to roles...\n');
    
    for (const role of roles) {
      const permSlugs = rolePermissions[role.slug] || [];
      
      console.log(`${role.name}:`);
      console.log(`  Assigning ${permSlugs.length} permissions...`);
      
      let assignedCount = 0;
      
      for (const permSlug of permSlugs) {
        const permission = allPermissions.find(p => p.slug === permSlug);
        
        if (permission) {
          await connection.query(
            'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
            [role.id, permission.id]
          );
          assignedCount++;
        }
      }
      
      console.log(`  ✅ Assigned ${assignedCount} permissions\n`);
    }

    // Verify assignments
    console.log('═'.repeat(80));
    console.log('📊 FINAL PERMISSION COUNT PER ROLE:');
    console.log('═'.repeat(80));
    
    for (const role of roles) {
      const [[{count}]] = await connection.query(
        'SELECT COUNT(*) as count FROM role_permissions WHERE role_id = ?',
        [role.id]
      );
      console.log(`  ${role.name.padEnd(20)} : ${count} permissions`);
    }
    
    console.log('═'.repeat(80));
    console.log('\n✅ ROLE PERMISSIONS ASSIGNED SUCCESSFULLY!\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Run the script
assignRolePermissions();

