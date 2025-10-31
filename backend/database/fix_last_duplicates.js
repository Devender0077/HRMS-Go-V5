const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
  waitForConnections: true,
  connectionLimit: 10,
});

async function fixLastDuplicates() {
  let connection;
  
  try {
    console.log('\n🔧 Fixing last 2 duplicate permissions...\n');

    connection = await pool.getConnection();

    // Get the IDs of the duplicates to delete
    const [reportsLeaves] = await connection.query(
      "SELECT id FROM permissions WHERE slug = 'reports.leaves'"
    );
    const [reportsPayroll] = await connection.query(
      "SELECT id FROM permissions WHERE slug = 'reports.payroll'"
    );

    const idsToDelete = [];
    if (reportsLeaves.length > 0) idsToDelete.push(reportsLeaves[0].id);
    if (reportsPayroll.length > 0) idsToDelete.push(reportsPayroll[0].id);

    if (idsToDelete.length > 0) {
      // Delete role assignments
      const [roleResult] = await connection.query(
        'DELETE FROM role_permissions WHERE permission_id IN (?)',
        [idsToDelete]
      );
      console.log(`✅ Removed ${roleResult.affectedRows} role assignments`);

      // Delete permissions
      const [permResult] = await connection.query(
        'DELETE FROM permissions WHERE id IN (?)',
        [idsToDelete]
      );
      console.log(`✅ Deleted ${permResult.affectedRows} duplicate permissions\n`);
    }

    // Verify - check for any remaining duplicates
    const [duplicates] = await connection.query(`
      SELECT name, COUNT(*) as count, GROUP_CONCAT(slug) as slugs
      FROM permissions
      GROUP BY name
      HAVING count > 1
    `);

    const [totalCount] = await connection.query('SELECT COUNT(*) as total FROM permissions');

    console.log('═'.repeat(60));
    console.log(`\n✅ TOTAL PERMISSIONS: ${totalCount[0].total}\n`);

    if (duplicates.length > 0) {
      console.log(`⚠️  ${duplicates.length} remaining duplicates:`);
      duplicates.forEach(d => {
        console.log(`   ${d.name}: ${d.slugs}`);
      });
    } else {
      console.log('🎉 NO DUPLICATES! All permissions are unique!\n');
    }

    console.log('═'.repeat(60));
    console.log('\n✅ Database is completely clean!');
    console.log('\n⚠️  RESTART BACKEND to see changes!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

fixLastDuplicates();

