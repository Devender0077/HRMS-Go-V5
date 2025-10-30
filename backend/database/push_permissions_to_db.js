#!/usr/bin/env node
/**
 * Push Comprehensive Permissions to Database
 * Automatically updates hrms_go_v5 database with 200+ permissions
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: 'hrms_go_v5', // Fixed database name
  multipleStatements: true,
};

async function pushPermissionsToDatabase() {
  let connection;
  
  try {
    console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                          ║');
    console.log('║  🔐 PUSHING 200+ PERMISSIONS TO DATABASE 🔐                              ║');
    console.log('║                                                                          ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

    console.log('📡 Connecting to database:', DB_CONFIG.database);
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected successfully!\n');

    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'comprehensive_all_permissions.sql');
    console.log('📄 Reading SQL file:', sqlFilePath);
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ SQL file loaded\n');

    // Execute SQL
    console.log('⚙️  Executing SQL statements...');
    console.log('   This may take 10-15 seconds...\n');
    
    const [results] = await connection.query(sqlContent);
    
    console.log('✅ SQL executed successfully!\n');

    // Show summary results
    if (Array.isArray(results)) {
      // Find the summary result sets
      const summaryResults = results.filter(r => Array.isArray(r) && r.length > 0);
      
      summaryResults.forEach((resultSet, index) => {
        if (resultSet.length > 0) {
          const firstRow = resultSet[0];
          
          // Total permissions
          if (firstRow.Status && firstRow.Total_Permissions) {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📊 ${firstRow.Status}`);
            console.log(`   Total Permissions: ${firstRow.Total_Permissions}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          }
          
          // Permissions by module
          if (firstRow.Module && firstRow.Permission_Count) {
            console.log('📋 PERMISSIONS BY MODULE:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            resultSet.forEach(row => {
              console.log(`   ${row.Module.padEnd(20)} → ${row.Permission_Count.toString().padStart(3)} permissions`);
            });
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          }
          
          // Permissions by role
          if (firstRow.Role && firstRow.Total_Permissions !== undefined) {
            console.log('👥 PERMISSIONS BY ROLE:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            resultSet.forEach(row => {
              console.log(`   ${row.Role.padEnd(20)} → ${row.Total_Permissions.toString().padStart(3)} permissions`);
            });
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          }
          
          // Recent additions
          if (firstRow.name && firstRow.slug) {
            console.log('🆕 RECENTLY ADDED PERMISSIONS (Last 30):');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            resultSet.slice(0, 10).forEach(row => {
              console.log(`   ${row.module.padEnd(15)} → ${row.name}`);
            });
            console.log(`   ... and ${resultSet.length - 10} more`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          }
          
          // Final status
          if (firstRow.Final_Status) {
            console.log('╔══════════════════════════════════════════════════════════════════════════╗');
            console.log('║                                                                          ║');
            console.log(`║  ${firstRow.Final_Status.padEnd(72)} ║`);
            console.log('║                                                                          ║');
            console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');
          }
        }
      });
    }

    console.log('✅ Database updated successfully!\n');
    console.log('📌 NEXT STEPS:');
    console.log('   1. Hard refresh browser (Cmd+Shift+R)');
    console.log('   2. Go to: Settings → Roles');
    console.log('   3. Click any role to see ALL permissions!');
    console.log('   4. You should see 200+ permissions organized by module!\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n💡 TROUBLESHOOTING:');
    console.error('   - Check MySQL is running');
    console.error('   - Verify database name: hrms_go_v5');
    console.error('   - Check credentials in backend/.env');
    console.error('   - Ensure MySQL user has permissions\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed\n');
    }
  }
}

// Run the script
pushPermissionsToDatabase();

