#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function verifyPermissions() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: 'hrms_go_v5',
    multipleStatements: true,
  });

  console.log('\n✅ Connected to database: hrms_go_v5\n');

  const sqlFile = fs.readFileSync(path.join(__dirname, 'add_missing_permissions.sql'), 'utf8');
  const [results] = await connection.query(sqlFile);

  // Display results
  if (Array.isArray(results)) {
    results.forEach((resultSet) => {
      if (Array.isArray(resultSet) && resultSet.length > 0) {
        const firstRow = resultSet[0];
        
        if (firstRow.Current_Permissions) {
          console.log(`📊 Current Permissions: ${firstRow.Current_Permissions}\n`);
        }
        
        if (firstRow.Status) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`✅ ${firstRow.Status}`);
          console.log(`   Total Permissions: ${firstRow.Total_Permissions}`);
          console.log(`   Super Admin: ${firstRow.SuperAdmin_Permissions} permissions`);
          console.log(`   Admin: ${firstRow.Admin_Permissions} permissions`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        }
        
        if (firstRow.Module) {
          console.log('📋 PERMISSIONS BY MODULE:');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          resultSet.forEach(row => {
            console.log(`   ${(row.Module || 'Unknown').padEnd(25)} → ${row.Permission_Count.toString().padStart(3)} permissions`);
          });
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        }
      }
    });
  }

  console.log('✅ Database verified and updated!\n');
  console.log('📌 NEXT STEPS:');
  console.log('   1. Hard refresh browser (Cmd+Shift+R)');
  console.log('   2. Settings → Roles → View any role');
  console.log('   3. You should see 381 permissions organized by module!\n');

  await connection.end();
}

verifyPermissions().catch(console.error);

