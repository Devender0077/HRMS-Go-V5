#!/usr/bin/env node

/**
 * Add Missing Permissions
 * Adds all permissions that are referenced in the navigation config but missing from the database
 */

const db = require('../config/database');

async function addMissingPermissions() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         🔐 ADDING MISSING PERMISSIONS                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // All permissions from navigation config
    const permissions = [
      // Dashboard & Calendar
      { name: 'View Dashboard', slug: 'dashboard.view', module: 'Dashboard', description: 'View dashboard page' },
      { name: 'View Calendar', slug: 'calendar.view', module: 'Calendar', description: 'View calendar' },
      { name: 'Manage Calendar', slug: 'calendar.manage', module: 'Calendar', description: 'Create and manage calendar events' },
      
      // Employees
      { name: 'View Employees', slug: 'employees.view', module: 'Employees', description: 'View employee list' },
      { name: 'Create Employees', slug: 'employees.create', module: 'Employees', description: 'Create new employees' },
      { name: 'Edit Employees', slug: 'employees.edit', module: 'Employees', description: 'Edit employee details' },
      { name: 'Delete Employees', slug: 'employees.delete', module: 'Employees', description: 'Delete employees' },
      
      // Attendance
      { name: 'Clock In/Out', slug: 'attendance.clock', module: 'Attendance', description: 'Clock in and clock out' },
      { name: 'View All Attendance', slug: 'attendance.view_all', module: 'Attendance', description: 'View all attendance records' },
      { name: 'View Own Attendance', slug: 'attendance.view_own', module: 'Attendance', description: 'View own attendance records' },
      { name: 'Manage Attendance', slug: 'attendance.manage', module: 'Attendance', description: 'Manage attendance records' },
      { name: 'Approve Regularization', slug: 'attendance.approve', module: 'Attendance', description: 'Approve attendance regularization' },
      
      // Leaves
      { name: 'View All Leaves', slug: 'leaves.view_all', module: 'Leaves', description: 'View all leave requests' },
      { name: 'View Own Leaves', slug: 'leaves.view_own', module: 'Leaves', description: 'View own leave requests' },
      { name: 'Apply Leave', slug: 'leaves.apply', module: 'Leaves', description: 'Apply for leave' },
      { name: 'Approve Leaves', slug: 'leaves.approve', module: 'Leaves', description: 'Approve leave requests' },
      { name: 'Manage Leaves', slug: 'leaves.manage', module: 'Leaves', description: 'Manage all leave requests' },
      
      // Payroll
      { name: 'View All Payroll', slug: 'payroll.view_all', module: 'Payroll', description: 'View all payroll records' },
      { name: 'View Own Payslip', slug: 'payroll.view_own', module: 'Payroll', description: 'View own payslip' },
      { name: 'Process Payroll', slug: 'payroll.process', module: 'Payroll', description: 'Process payroll' },
      { name: 'Manage Payroll', slug: 'payroll.manage', module: 'Payroll', description: 'Manage payroll records' },
      
      // Recruitment
      { name: 'View Recruitment', slug: 'recruitment.view', module: 'Recruitment', description: 'View job postings and applications' },
      { name: 'Manage Recruitment', slug: 'recruitment.manage', module: 'Recruitment', description: 'Manage recruitment process' },
      { name: 'Post Jobs', slug: 'recruitment.post', module: 'Recruitment', description: 'Create job postings' },
      
      // Performance
      { name: 'View Performance', slug: 'performance.view', module: 'Performance', description: 'View performance reviews' },
      { name: 'Manage Performance', slug: 'performance.manage', module: 'Performance', description: 'Manage performance reviews' },
      { name: 'View Own Performance', slug: 'performance.view_own', module: 'Performance', description: 'View own performance' },
      
      // Training
      { name: 'View Training', slug: 'training.view', module: 'Training', description: 'View training programs' },
      { name: 'Manage Training', slug: 'training.manage', module: 'Training', description: 'Manage training programs' },
      { name: 'Enroll Training', slug: 'training.enroll', module: 'Training', description: 'Enroll in training programs' },
      
      // Documents
      { name: 'View Documents', slug: 'documents.view', module: 'Documents', description: 'View documents' },
      { name: 'Upload Documents', slug: 'documents.upload', module: 'Documents', description: 'Upload documents' },
      { name: 'Manage Documents', slug: 'documents.manage', module: 'Documents', description: 'Manage all documents' },
      
      // Reports
      { name: 'View Reports', slug: 'reports.view', module: 'Reports', description: 'View reports' },
      { name: 'Generate Reports', slug: 'reports.generate', module: 'Reports', description: 'Generate custom reports' },
      { name: 'Export Reports', slug: 'reports.export', module: 'Reports', description: 'Export reports' },
      
      // Assets
      { name: 'View Assets', slug: 'assets.view', module: 'Assets', description: 'View asset list' },
      { name: 'Manage Assets', slug: 'assets.manage', module: 'Assets', description: 'Manage assets' },
      { name: 'Assign Assets', slug: 'assets.assign', module: 'Assets', description: 'Assign assets to employees' },
      
      // Settings
      { name: 'View Settings', slug: 'settings.view', module: 'Settings', description: 'View system settings' },
      { name: 'Manage Settings', slug: 'settings.manage', module: 'Settings', description: 'Manage system settings' },
      { name: 'Manage Roles', slug: 'settings.roles', module: 'Settings', description: 'Manage roles and permissions' },
      { name: 'Manage Users', slug: 'settings.users', module: 'Settings', description: 'Manage user accounts' },
      
      // Announcements
      { name: 'View Announcements', slug: 'announcements.view', module: 'Announcements', description: 'View announcements' },
      { name: 'Create Announcements', slug: 'announcements.create', module: 'Announcements', description: 'Create announcements' },
      
      // Messenger
      { name: 'Use Messenger', slug: 'messenger.use', module: 'Messenger', description: 'Use internal messaging' },
      
      // My Account
      { name: 'View Own Profile', slug: 'profile.view', module: 'Profile', description: 'View own profile' },
      { name: 'Edit Own Profile', slug: 'profile.edit', module: 'Profile', description: 'Edit own profile' },
    ];

    console.log(`Adding ${permissions.length} permissions...\n`);
    
    let added = 0;
    let updated = 0;
    
    for (const perm of permissions) {
      const [result] = await db.query(`
        INSERT INTO permissions (name, slug, module, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        module = VALUES(module),
        description = VALUES(description),
        updated_at = NOW()
      `, [perm.name, perm.slug, perm.module, perm.description]);
      
      if (result.affectedRows === 1) {
        added++;
        console.log(`✅ Added: ${perm.slug}`);
      } else if (result.affectedRows === 2) {
        updated++;
        console.log(`🔄 Updated: ${perm.slug}`);
      }
    }

    console.log('\n' + '━'.repeat(65));
    console.log(`✅ Added: ${added} permissions`);
    console.log(`🔄 Updated: ${updated} permissions`);
    console.log(`📊 Total: ${permissions.length} permissions`);
    console.log('━'.repeat(65) + '\n');

    // Show current permission count
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM permissions');
    console.log(`Total permissions in database: ${total}\n`);

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         ✅ MISSING PERMISSIONS ADDED SUCCESSFULLY!             ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addMissingPermissions();

