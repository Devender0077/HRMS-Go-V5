#!/usr/bin/env node
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function fixAllRolePermissions() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: 'hrms_go_v5',
  });

  console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                          ║');
  console.log('║  🔐 FIXING ALL 381 PERMISSIONS FOR ALL ROLES 🔐                          ║');
  console.log('║                                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

  // Get total permissions
  const [permCount] = await connection.query('SELECT COUNT(*) as total FROM permissions');
  console.log(`📊 Total Permissions in Database: ${permCount[0].total}\n`);

  // Assign ALL permissions to Super Admin
  console.log('⚙️  Assigning ALL permissions to Super Admin...');
  await connection.query(`
    INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
    SELECT (SELECT id FROM user_roles WHERE slug = 'super_admin'), id, NOW()
    FROM permissions
  `);
  
  const [superCount] = await connection.query(`
    SELECT COUNT(*) as total FROM role_permissions 
    WHERE role_id = (SELECT id FROM user_roles WHERE slug = 'super_admin')
  `);
  console.log(`   ✅ Super Admin: ${superCount[0].total} permissions assigned\n`);

  // Show final summary for all roles
  const [summary] = await connection.query(`
    SELECT 
      ur.name as Role,
      ur.slug as Slug,
      COUNT(rp.id) as Total_Permissions
    FROM user_roles ur
    LEFT JOIN role_permissions rp ON ur.id = rp.role_id
    GROUP BY ur.id, ur.name, ur.slug
    ORDER BY COUNT(rp.id) DESC
  `);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 PERMISSIONS BY ROLE:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  summary.forEach(row => {
    const status = row.Total_Permissions === permCount[0].total ? '✅ ALL' : '⚠️  PARTIAL';
    console.log(`   ${row.Role.padEnd(20)} (${row.Slug.padEnd(15)}) → ${row.Total_Permissions.toString().padStart(3)} ${status}`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('✅ PERMISSIONS ASSIGNMENT COMPLETE!\n');
  console.log('🎯 SUMMARY:');
  console.log(`   • Total Permissions: ${permCount[0].total}`);
  console.log(`   • Super Admin has: ${superCount[0].total} (should be ${permCount[0].total})`);
  console.log(`   • Status: ${superCount[0].total === permCount[0].total ? '✅ PERFECT!' : '⚠️  NEEDS MORE'}\n`);

  await connection.end();
}

fixAllRolePermissions().catch(console.error);

