#!/usr/bin/env node

/**
 * Seed Comprehensive Permissions for ALL HRMS Modules
 * Includes full CRUD (Create, Read/View, Update/Edit, Delete) for every module
 */

const db = require('../config/database');

async function seedPermissions() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║       🔐 SEEDING COMPREHENSIVE PERMISSIONS                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const permissions = [
      // ===== DASHBOARD =====
      { name: 'View Dashboard', slug: 'dashboard.view', module: 'Dashboard', description: 'Access dashboard and analytics' },
      
      // ===== USER MANAGEMENT =====
      { name: 'View Users', slug: 'users.view', module: 'User Management', description: 'View user list' },
      { name: 'Create Users', slug: 'users.create', module: 'User Management', description: 'Create new users' },
      { name: 'Edit Users', slug: 'users.edit', module: 'User Management', description: 'Edit user details' },
      { name: 'Delete Users', slug: 'users.delete', module: 'User Management', description: 'Delete users' },
      { name: 'Reset User Password', slug: 'users.reset_password', module: 'User Management', description: 'Reset user passwords' },
      
      // ===== ROLE MANAGEMENT =====
      { name: 'View Roles', slug: 'roles.view', module: 'Role Management', description: 'View roles list' },
      { name: 'Create Roles', slug: 'roles.create', module: 'Role Management', description: 'Create new roles' },
      { name: 'Edit Roles', slug: 'roles.edit', module: 'Role Management', description: 'Edit role details' },
      { name: 'Delete Roles', slug: 'roles.delete', module: 'Role Management', description: 'Delete roles' },
      { name: 'Manage Permissions', slug: 'roles.manage_permissions', module: 'Role Management', description: 'Assign permissions to roles' },
      
      // ===== EMPLOYEE MANAGEMENT =====
      { name: 'View Employees', slug: 'employees.view', module: 'Employee Management', description: 'View employee list' },
      { name: 'Create Employees', slug: 'employees.create', module: 'Employee Management', description: 'Create new employees' },
      { name: 'Edit Employees', slug: 'employees.edit', module: 'Employee Management', description: 'Edit employee details' },
      { name: 'Delete Employees', slug: 'employees.delete', module: 'Employee Management', description: 'Delete employees' },
      { name: 'Export Employees', slug: 'employees.export', module: 'Employee Management', description: 'Export employee data' },
      
      // ===== ATTENDANCE =====
      { name: 'View All Attendance', slug: 'attendance.view_all', module: 'Attendance', description: 'View all employee attendance' },
      { name: 'View Own Attendance', slug: 'attendance.view_own', module: 'Attendance', description: 'View own attendance records' },
      { name: 'Clock In/Out', slug: 'attendance.clock', module: 'Attendance', description: 'Clock in and clock out' },
      { name: 'Manage Attendance', slug: 'attendance.manage', module: 'Attendance', description: 'Create/edit attendance records' },
      { name: 'Delete Attendance', slug: 'attendance.delete', module: 'Attendance', description: 'Delete attendance records' },
      { name: 'Approve Regularization', slug: 'attendance.approve_regularization', module: 'Attendance', description: 'Approve attendance regularization' },
      { name: 'Export Attendance', slug: 'attendance.export', module: 'Attendance', description: 'Export attendance reports' },
      
      // ===== LEAVE MANAGEMENT =====
      { name: 'View All Leaves', slug: 'leaves.view_all', module: 'Leave Management', description: 'View all leave requests' },
      { name: 'View Own Leaves', slug: 'leaves.view_own', module: 'Leave Management', description: 'View own leave requests' },
      { name: 'Apply Leave', slug: 'leaves.apply', module: 'Leave Management', description: 'Apply for leave' },
      { name: 'Edit Leave', slug: 'leaves.edit', module: 'Leave Management', description: 'Edit leave requests' },
      { name: 'Cancel Leave', slug: 'leaves.cancel', module: 'Leave Management', description: 'Cancel leave requests' },
      { name: 'Approve Leaves', slug: 'leaves.approve', module: 'Leave Management', description: 'Approve leave requests' },
      { name: 'Reject Leaves', slug: 'leaves.reject', module: 'Leave Management', description: 'Reject leave requests' },
      { name: 'Delete Leave', slug: 'leaves.delete', module: 'Leave Management', description: 'Delete leave records' },
      { name: 'Manage Leave Types', slug: 'leaves.manage_types', module: 'Leave Management', description: 'Manage leave types' },
      
      // ===== PAYROLL =====
      { name: 'View All Payroll', slug: 'payroll.view_all', module: 'Payroll', description: 'View all payroll records' },
      { name: 'View Own Payslip', slug: 'payroll.view_own', module: 'Payroll', description: 'View own payslip' },
      { name: 'Create Payroll', slug: 'payroll.create', module: 'Payroll', description: 'Create payroll' },
      { name: 'Edit Payroll', slug: 'payroll.edit', module: 'Payroll', description: 'Edit payroll' },
      { name: 'Process Payroll', slug: 'payroll.process', module: 'Payroll', description: 'Process monthly payroll' },
      { name: 'Delete Payroll', slug: 'payroll.delete', module: 'Payroll', description: 'Delete payroll records' },
      { name: 'Export Payroll', slug: 'payroll.export', module: 'Payroll', description: 'Export payroll data' },
      { name: 'Manage Salary Components', slug: 'payroll.manage_components', module: 'Payroll', description: 'Manage salary components' },
      
      // ===== PERFORMANCE =====
      { name: 'View All Performance', slug: 'performance.view_all', module: 'Performance', description: 'View all performance reviews' },
      { name: 'View Own Performance', slug: 'performance.view_own', module: 'Performance', description: 'View own performance' },
      { name: 'Create Performance Review', slug: 'performance.create', module: 'Performance', description: 'Create performance reviews' },
      { name: 'Edit Performance Review', slug: 'performance.edit', module: 'Performance', description: 'Edit performance reviews' },
      { name: 'Delete Performance Review', slug: 'performance.delete', module: 'Performance', description: 'Delete performance reviews' },
      { name: 'Set Goals', slug: 'performance.set_goals', module: 'Performance', description: 'Set performance goals' },
      
      // ===== RECRUITMENT =====
      { name: 'View Job Postings', slug: 'recruitment.view_jobs', module: 'Recruitment', description: 'View job postings' },
      { name: 'Create Job Posting', slug: 'recruitment.create_job', module: 'Recruitment', description: 'Create job postings' },
      { name: 'Edit Job Posting', slug: 'recruitment.edit_job', module: 'Recruitment', description: 'Edit job postings' },
      { name: 'Delete Job Posting', slug: 'recruitment.delete_job', module: 'Recruitment', description: 'Delete job postings' },
      { name: 'View Applications', slug: 'recruitment.view_applications', module: 'Recruitment', description: 'View job applications' },
      { name: 'Review Applications', slug: 'recruitment.review_applications', module: 'Recruitment', description: 'Review and process applications' },
      { name: 'Delete Applications', slug: 'recruitment.delete_applications', module: 'Recruitment', description: 'Delete applications' },
      
      // ===== TRAINING =====
      { name: 'View Training Programs', slug: 'training.view', module: 'Training', description: 'View training programs' },
      { name: 'Create Training Program', slug: 'training.create', module: 'Training', description: 'Create training programs' },
      { name: 'Edit Training Program', slug: 'training.edit', module: 'Training', description: 'Edit training programs' },
      { name: 'Delete Training Program', slug: 'training.delete', module: 'Training', description: 'Delete training programs' },
      { name: 'Enroll Employees', slug: 'training.enroll', module: 'Training', description: 'Enroll employees in training' },
      
      // ===== DOCUMENTS =====
      { name: 'View All Documents', slug: 'documents.view_all', module: 'Documents', description: 'View all employee documents' },
      { name: 'View Own Documents', slug: 'documents.view_own', module: 'Documents', description: 'View own documents' },
      { name: 'Upload Documents', slug: 'documents.upload', module: 'Documents', description: 'Upload documents' },
      { name: 'Edit Documents', slug: 'documents.edit', module: 'Documents', description: 'Edit document details' },
      { name: 'Delete Documents', slug: 'documents.delete', module: 'Documents', description: 'Delete documents' },
      { name: 'Manage Document Categories', slug: 'documents.manage_categories', module: 'Documents', description: 'Manage document categories' },
      
      // ===== ASSETS =====
      { name: 'View Assets', slug: 'assets.view', module: 'Assets', description: 'View asset inventory' },
      { name: 'Create Asset', slug: 'assets.create', module: 'Assets', description: 'Create new asset' },
      { name: 'Edit Asset', slug: 'assets.edit', module: 'Assets', description: 'Edit asset details' },
      { name: 'Delete Asset', slug: 'assets.delete', module: 'Assets', description: 'Delete assets' },
      { name: 'Assign Asset', slug: 'assets.assign', module: 'Assets', description: 'Assign assets to employees' },
      { name: 'Return Asset', slug: 'assets.return', module: 'Assets', description: 'Process asset returns' },
      { name: 'Manage Asset Categories', slug: 'assets.manage_categories', module: 'Assets', description: 'Manage asset categories' },
      
      // ===== DEPARTMENTS =====
      { name: 'View Departments', slug: 'departments.view', module: 'Departments', description: 'View departments' },
      { name: 'Create Department', slug: 'departments.create', module: 'Departments', description: 'Create new department' },
      { name: 'Edit Department', slug: 'departments.edit', module: 'Departments', description: 'Edit department details' },
      { name: 'Delete Department', slug: 'departments.delete', module: 'Departments', description: 'Delete departments' },
      
      // ===== DESIGNATIONS =====
      { name: 'View Designations', slug: 'designations.view', module: 'Designations', description: 'View designations' },
      { name: 'Create Designation', slug: 'designations.create', module: 'Designations', description: 'Create new designation' },
      { name: 'Edit Designation', slug: 'designations.edit', module: 'Designations', description: 'Edit designation details' },
      { name: 'Delete Designation', slug: 'designations.delete', module: 'Designations', description: 'Delete designations' },
      
      // ===== BRANCHES =====
      { name: 'View Branches', slug: 'branches.view', module: 'Branches', description: 'View branches' },
      { name: 'Create Branch', slug: 'branches.create', module: 'Branches', description: 'Create new branch' },
      { name: 'Edit Branch', slug: 'branches.edit', module: 'Branches', description: 'Edit branch details' },
      { name: 'Delete Branch', slug: 'branches.delete', module: 'Branches', description: 'Delete branches' },
      
      // ===== SHIFTS =====
      { name: 'View Shifts', slug: 'shifts.view', module: 'Shifts', description: 'View shift schedules' },
      { name: 'Create Shift', slug: 'shifts.create', module: 'Shifts', description: 'Create new shift' },
      { name: 'Edit Shift', slug: 'shifts.edit', module: 'Shifts', description: 'Edit shift details' },
      { name: 'Delete Shift', slug: 'shifts.delete', module: 'Shifts', description: 'Delete shifts' },
      { name: 'Assign Shifts', slug: 'shifts.assign', module: 'Shifts', description: 'Assign shifts to employees' },
      
      // ===== POLICIES =====
      { name: 'View Policies', slug: 'policies.view', module: 'Policies', description: 'View company policies' },
      { name: 'Create Policy', slug: 'policies.create', module: 'Policies', description: 'Create new policy' },
      { name: 'Edit Policy', slug: 'policies.edit', module: 'Policies', description: 'Edit policy details' },
      { name: 'Delete Policy', slug: 'policies.delete', module: 'Policies', description: 'Delete policies' },
      { name: 'Publish Policy', slug: 'policies.publish', module: 'Policies', description: 'Publish policies to employees' },
      
      // ===== CALENDAR =====
      { name: 'View Calendar', slug: 'calendar.view', module: 'Calendar', description: 'View calendar events' },
      { name: 'Create Event', slug: 'calendar.create', module: 'Calendar', description: 'Create calendar events' },
      { name: 'Edit Event', slug: 'calendar.edit', module: 'Calendar', description: 'Edit calendar events' },
      { name: 'Delete Event', slug: 'calendar.delete', module: 'Calendar', description: 'Delete calendar events' },
      
      // ===== REPORTS =====
      { name: 'View Reports', slug: 'reports.view', module: 'Reports', description: 'View reports' },
      { name: 'Generate Reports', slug: 'reports.generate', module: 'Reports', description: 'Generate custom reports' },
      { name: 'Export Reports', slug: 'reports.export', module: 'Reports', description: 'Export reports to Excel/PDF' },
      { name: 'Create Custom Report', slug: 'reports.create_custom', module: 'Reports', description: 'Create custom report templates' },
      
      // ===== SETTINGS =====
      { name: 'View General Settings', slug: 'settings.view_general', module: 'Settings', description: 'View general settings' },
      { name: 'Manage General Settings', slug: 'settings.manage_general', module: 'Settings', description: 'Manage general settings' },
      { name: 'View System Setup', slug: 'settings.view_system', module: 'Settings', description: 'View system setup' },
      { name: 'Manage System Setup', slug: 'settings.manage_system', module: 'Settings', description: 'Manage system configuration' },
      { name: 'View Integrations', slug: 'settings.view_integrations', module: 'Settings', description: 'View integrations' },
      { name: 'Manage Integrations', slug: 'settings.manage_integrations', module: 'Settings', description: 'Manage third-party integrations' },
      
      // ===== ORGANIZATION =====
      { name: 'View Organization', slug: 'organization.view', module: 'Organization', description: 'View organization details' },
      { name: 'Edit Organization', slug: 'organization.edit', module: 'Organization', description: 'Edit organization details' },
      
      // ===== NOTIFICATIONS =====
      { name: 'View Notifications', slug: 'notifications.view', module: 'Notifications', description: 'View notifications' },
      { name: 'Send Notifications', slug: 'notifications.send', module: 'Notifications', description: 'Send notifications to users' },
      { name: 'Delete Notifications', slug: 'notifications.delete', module: 'Notifications', description: 'Delete notifications' },
    ];

    console.log(`Inserting ${permissions.length} permissions...\n`);
    
    let inserted = 0;
    let updated = 0;
    
    for (const perm of permissions) {
      const [result] = await db.query(`
        INSERT INTO permissions (name, slug, module, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE 
        module = VALUES(module),
        description = VALUES(description),
        updated_at = NOW()
      `, [perm.name, perm.slug, perm.module, perm.description]);
      
      if (result.affectedRows === 1) {
        inserted++;
      } else {
        updated++;
      }
      
      console.log(`  ${perm.module.padEnd(25)} | ${perm.name}`);
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║  ✅ Inserted: ${inserted} | Updated: ${updated} | Total: ${permissions.length}             ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Group by module for summary
    const modules = {};
    permissions.forEach(p => {
      if (!modules[p.module]) modules[p.module] = 0;
      modules[p.module]++;
    });

    console.log('📊 Permissions by Module:\n');
    Object.keys(modules).sort().forEach(module => {
      console.log(`  ${module.padEnd(25)} : ${modules[module]} permissions`);
    });

    // Now assign all permissions to Super Admin
    console.log('\n🔧 Assigning all permissions to Super Admin...');
    
    const [superAdmin] = await db.query('SELECT id FROM user_roles WHERE slug = "super_admin"');
    if (superAdmin.length > 0) {
      const [allPerms] = await db.query('SELECT id FROM permissions');
      
      for (const perm of allPerms) {
        await db.query(`
          INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
          VALUES (?, ?, NOW())
        `, [superAdmin[0].id, perm.id]);
      }
      
      console.log(`✅ Assigned ${allPerms.length} permissions to Super Admin\n`);
    }

    // Assign permissions to HR Manager (all except system settings management)
    const [hrManager] = await db.query('SELECT id FROM user_roles WHERE slug = "hr_manager"');
    if (hrManager.length > 0) {
      const [hrPerms] = await db.query(`
        SELECT id FROM permissions 
        WHERE slug NOT LIKE 'settings.manage_system'
      `);
      
      for (const perm of hrPerms) {
        await db.query(`
          INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
          VALUES (?, ?, NOW())
        `, [hrManager[0].id, perm.id]);
      }
      
      console.log(`✅ Assigned ${hrPerms.length} permissions to HR Manager\n`);
    }

    // Assign basic permissions to Employee
    const [employee] = await db.query('SELECT id FROM user_roles WHERE slug = "employee"');
    if (employee.length > 0) {
      const [empPerms] = await db.query(`
        SELECT id FROM permissions 
        WHERE slug IN (
          'dashboard.view',
          'attendance.view_own',
          'attendance.clock',
          'leaves.view_own',
          'leaves.apply',
          'payroll.view_own',
          'performance.view_own',
          'documents.view_own',
          'documents.upload',
          'notifications.view',
          'calendar.view'
        )
      `);
      
      for (const perm of empPerms) {
        await db.query(`
          INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
          VALUES (?, ?, NOW())
        `, [employee[0].id, perm.id]);
      }
      
      console.log(`✅ Assigned ${empPerms.length} permissions to Employee\n`);
    }

    // Final verification
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM permissions) as total_permissions,
        (SELECT COUNT(*) FROM user_roles) as total_roles,
        (SELECT COUNT(*) FROM role_permissions) as total_assignments
    `);

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ COMPREHENSIVE PERMISSIONS SEEDED!              ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log(`📊 Final Statistics:`);
    console.log(`   Total Permissions: ${stats[0].total_permissions}`);
    console.log(`   Total Roles: ${stats[0].total_roles}`);
    console.log(`   Total Assignments: ${stats[0].total_assignments}\n`);
    console.log(`✅ All ${permissions.length} permissions created successfully!`);
    console.log(`✅ Permissions assigned to roles!`);
    console.log(`✅ Ready to use in frontend!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedPermissions();

