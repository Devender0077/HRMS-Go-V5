#!/usr/bin/env node
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function assignAllPermissions() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: 'hrms_go_v5',
  });

  console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                          ║');
  console.log('║  🔐 ASSIGNING ALL 381 PERMISSIONS TO ROLES 🔐                            ║');
  console.log('║                                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

  // Get role IDs
  const [roles] = await connection.query(`
    SELECT id, name, slug FROM user_roles 
    WHERE slug IN ('superadmin', 'admin', 'hr_manager', 'hr', 'manager', 'employee', 'accountant')
  `);

  console.log('📋 Found roles:');
  roles.forEach(role => console.log(`   - ${role.name} (${role.slug})`));
  console.log('');

  // Assign ALL permissions to Super Admin and Admin
  console.log('⚙️  Assigning ALL permissions to Super Admin and Admin...');
  
  for (const role of roles.filter(r => ['superadmin', 'admin'].includes(r.slug))) {
    await connection.query(`
      INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
      SELECT ?, id, NOW() FROM permissions
    `, [role.id]);
    
    const [count] = await connection.query(`
      SELECT COUNT(*) as total FROM role_permissions WHERE role_id = ?
    `, [role.id]);
    
    console.log(`   ✅ ${role.name}: ${count[0].total} permissions assigned`);
  }

  console.log('');

  // Show final summary
  const [summary] = await connection.query(`
    SELECT 
      ur.name as Role,
      COUNT(rp.id) as Total_Permissions
    FROM user_roles ur
    LEFT JOIN role_permissions rp ON ur.id = rp.role_id
    WHERE ur.slug IN ('superadmin', 'admin', 'hr_manager', 'hr', 'manager', 'employee', 'accountant')
    GROUP BY ur.id, ur.name
    ORDER BY COUNT(rp.id) DESC
  `);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 FINAL PERMISSIONS BY ROLE:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  summary.forEach(row => {
    console.log(`   ${row.Role.padEnd(20)} → ${row.Total_Permissions.toString().padStart(3)} permissions`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Show modules
  const [modules] = await connection.query(`
    SELECT module, COUNT(*) as count 
    FROM permissions 
    GROUP BY module 
    ORDER BY count DESC 
    LIMIT 15
  `);

  console.log('📋 TOP 15 MODULES:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  modules.forEach(m => {
    console.log(`   ${(m.module || 'Unknown').padEnd(25)} → ${m.count.toString().padStart(3)} permissions`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('✅ ALL PERMISSIONS ASSIGNED SUCCESSFULLY!\n');
  console.log('📌 NEXT STEPS:');
  console.log('   1. Hard refresh browser (Cmd+Shift+R)');
  console.log('   2. Settings → Roles → Click any role');
  console.log('   3. You should see 381 permissions!\n');

  await connection.end();
}

assignAllPermissions().catch(console.error);

