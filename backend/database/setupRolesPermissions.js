#!/usr/bin/env node

/**
 * Setup Roles and Permissions System
 * Creates tables and seeds sample data
 */

const db = require('../config/database');

async function setup() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         🔐 SETTING UP ROLES & PERMISSIONS SYSTEM               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Check if tables exist
    const [tables] = await db.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'hrms_go_v5' 
      AND TABLE_NAME IN ('user_roles', 'permissions', 'role_permissions')
    `);
    
    const existingTables = tables.map(t => t.TABLE_NAME);
    console.log(`Existing tables: ${existingTables.length > 0 ? existingTables.join(', ') : 'none'}\n`);

    // Create tables if they don't exist
    if (!existingTables.includes('user_roles')) {
      console.log('Creating user_roles table...');
      await db.query(`
        CREATE TABLE user_roles (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          slug VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          level INT DEFAULT 0,
          is_system BOOLEAN DEFAULT FALSE,
          status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ Created user_roles table\n');
    }

    if (!existingTables.includes('permissions')) {
      console.log('Creating permissions table...');
      await db.query(`
        CREATE TABLE permissions (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          slug VARCHAR(100) NOT NULL UNIQUE,
          module VARCHAR(50) NOT NULL,
          description TEXT,
          status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ Created permissions table\n');
    }

    if (!existingTables.includes('role_permissions')) {
      console.log('Creating role_permissions table...');
      await db.query(`
        CREATE TABLE role_permissions (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          role_id BIGINT UNSIGNED NOT NULL,
          permission_id BIGINT UNSIGNED NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE,
          FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
          UNIQUE KEY role_permission_unique (role_id, permission_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ Created role_permissions table\n');
    }

    // Seed roles
    console.log('Seeding roles...');
    const roles = [
      { name: 'Super Admin', slug: 'super_admin', description: 'Full system access', level: 100, is_system: true },
      { name: 'HR Manager', slug: 'hr_manager', description: 'HR management and operations', level: 80, is_system: false },
      { name: 'HR', slug: 'hr', description: 'HR operations', level: 70, is_system: false },
      { name: 'Manager', slug: 'manager', description: 'Department and team management', level: 60, is_system: false },
      { name: 'Employee', slug: 'employee', description: 'Regular employee access', level: 10, is_system: false },
    ];

    for (const role of roles) {
      await db.query(`
        INSERT INTO user_roles (name, slug, description, level, is_system, status)
        VALUES (?, ?, ?, ?, ?, 'active')
        ON DUPLICATE KEY UPDATE 
        description = VALUES(description),
        level = VALUES(level),
        is_system = VALUES(is_system)
      `, [role.name, role.slug, role.description, role.level, role.is_system]);
    }
    console.log(`✅ Seeded ${roles.length} roles\n`);

    // Seed permissions
    console.log('Seeding permissions...');
    const permissions = [
      // User Management
      { name: 'View Users', slug: 'users.view', module: 'User Management', description: 'View user list' },
      { name: 'Create Users', slug: 'users.create', module: 'User Management', description: 'Create new users' },
      { name: 'Edit Users', slug: 'users.edit', module: 'User Management', description: 'Edit user details' },
      { name: 'Delete Users', slug: 'users.delete', module: 'User Management', description: 'Delete users' },
      
      // Employee Management
      { name: 'View Employees', slug: 'employees.view', module: 'Employee Management', description: 'View employee list' },
      { name: 'Create Employees', slug: 'employees.create', module: 'Employee Management', description: 'Create new employees' },
      { name: 'Edit Employees', slug: 'employees.edit', module: 'Employee Management', description: 'Edit employee details' },
      { name: 'Delete Employees', slug: 'employees.delete', module: 'Employee Management', description: 'Delete employees' },
      
      // Attendance
      { name: 'View Attendance', slug: 'attendance.view', module: 'Attendance', description: 'View attendance records' },
      { name: 'Manage Attendance', slug: 'attendance.manage', module: 'Attendance', description: 'Manage attendance' },
      { name: 'Approve Regularization', slug: 'attendance.approve', module: 'Attendance', description: 'Approve attendance regularization' },
      
      // Leave Management
      { name: 'View Leaves', slug: 'leaves.view', module: 'Leave Management', description: 'View leave requests' },
      { name: 'Apply Leave', slug: 'leaves.apply', module: 'Leave Management', description: 'Apply for leave' },
      { name: 'Approve Leaves', slug: 'leaves.approve', module: 'Leave Management', description: 'Approve leave requests' },
      
      // Payroll
      { name: 'View Payroll', slug: 'payroll.view', module: 'Payroll', description: 'View payroll information' },
      { name: 'Process Payroll', slug: 'payroll.process', module: 'Payroll', description: 'Process payroll' },
      { name: 'View Own Payslip', slug: 'payroll.view_own', module: 'Payroll', description: 'View own payslip' },
      
      // Reports
      { name: 'View Reports', slug: 'reports.view', module: 'Reports', description: 'View reports' },
      { name: 'Generate Reports', slug: 'reports.generate', module: 'Reports', description: 'Generate custom reports' },
      { name: 'Export Reports', slug: 'reports.export', module: 'Reports', description: 'Export reports' },
      
      // Settings
      { name: 'View Settings', slug: 'settings.view', module: 'Settings', description: 'View system settings' },
      { name: 'Manage Settings', slug: 'settings.manage', module: 'Settings', description: 'Manage system settings' },
    ];

    for (const perm of permissions) {
      await db.query(`
        INSERT INTO permissions (name, slug, module, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE 
        module = VALUES(module),
        description = VALUES(description),
        updated_at = NOW()
      `, [perm.name, perm.slug, perm.module, perm.description]);
    }
    console.log(`✅ Seeded ${permissions.length} permissions\n`);

    // Assign permissions to roles
    console.log('Assigning permissions to roles...');
    
    // Super Admin gets all permissions
    const [allPermissions] = await db.query('SELECT id FROM permissions');
    const [superAdminRole] = await db.query('SELECT id FROM user_roles WHERE slug = "super_admin"');
    
    if (superAdminRole.length > 0) {
      for (const perm of allPermissions) {
        await db.query(`
          INSERT IGNORE INTO role_permissions (role_id, permission_id)
          VALUES (?, ?)
        `, [superAdminRole[0].id, perm.id]);
      }
      console.log(`✅ Assigned ${allPermissions.length} permissions to Super Admin\n`);
    }

    // HR Manager gets most permissions except system settings
    const [hrManagerRole] = await db.query('SELECT id FROM user_roles WHERE slug = "hr_manager"');
    const [hrPermissions] = await db.query(`
      SELECT id FROM permissions 
      WHERE slug NOT LIKE 'settings.manage'
    `);
    
    if (hrManagerRole.length > 0) {
      for (const perm of hrPermissions) {
        await db.query(`
          INSERT IGNORE INTO role_permissions (role_id, permission_id)
          VALUES (?, ?)
        `, [hrManagerRole[0].id, perm.id]);
      }
      console.log(`✅ Assigned ${hrPermissions.length} permissions to HR Manager\n`);
    }

    // Employee gets basic permissions
    const [employeeRole] = await db.query('SELECT id FROM user_roles WHERE slug = "employee"');
    const [employeePermissions] = await db.query(`
      SELECT id FROM permissions 
      WHERE slug IN ('leaves.apply', 'leaves.view', 'attendance.view', 'payroll.view_own')
    `);
    
    if (employeeRole.length > 0) {
      for (const perm of employeePermissions) {
        await db.query(`
          INSERT IGNORE INTO role_permissions (role_id, permission_id)
          VALUES (?, ?)
        `, [employeeRole[0].id, perm.id]);
      }
      console.log(`✅ Assigned ${employeePermissions.length} permissions to Employee\n`);
    }

    // Add role_id column to users table if it doesn't exist
    const [userColumns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'hrms_go_v5' 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'role_id'
    `);

    if (userColumns.length === 0) {
      console.log('Adding role_id column to users table...');
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN role_id BIGINT UNSIGNED NULL AFTER user_type,
        ADD FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE SET NULL
      `);
      console.log('✅ Added role_id column\n');
    }

    // Update existing users with roles based on user_type
    console.log('Updating existing users with roles...');
    await db.query(`
      UPDATE users u
      INNER JOIN user_roles r ON (
        CASE 
          WHEN u.user_type = 'super_admin' THEN r.slug = 'super_admin'
          WHEN u.user_type = 'hr_manager' THEN r.slug = 'hr_manager'
          WHEN u.user_type = 'hr' THEN r.slug = 'hr'
          WHEN u.user_type = 'manager' THEN r.slug = 'manager'
          WHEN u.user_type = 'employee' THEN r.slug = 'employee'
          ELSE r.slug = 'employee'
        END
      )
      SET u.role_id = r.id
      WHERE u.role_id IS NULL
    `);
    console.log('✅ Updated user roles\n');

    // Verify setup
    const [roleCount] = await db.query('SELECT COUNT(*) as count FROM user_roles');
    const [permCount] = await db.query('SELECT COUNT(*) as count FROM permissions');
    const [assignmentCount] = await db.query('SELECT COUNT(*) as count FROM role_permissions');
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role_id IS NOT NULL');

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ SETUP COMPLETE!                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log(`📊 Final Statistics:`);
    console.log(`   Roles: ${roleCount[0].count}`);
    console.log(`   Permissions: ${permCount[0].count}`);
    console.log(`   Role-Permission Assignments: ${assignmentCount[0].count}`);
    console.log(`   Users with Roles: ${userCount[0].count}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

setup();

