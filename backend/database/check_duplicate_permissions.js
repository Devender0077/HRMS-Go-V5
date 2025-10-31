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

async function checkDuplicatePermissions() {
  try {
    console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
    console.log('║             CHECKING FOR DUPLICATE PERMISSIONS                           ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

    // Check for duplicate slugs
    const [duplicateSlugs] = await pool.query(`
      SELECT slug, COUNT(*) as count
      FROM permissions
      GROUP BY slug
      HAVING count > 1
      ORDER BY count DESC
    `);

    if (duplicateSlugs.length > 0) {
      console.log('❌ DUPLICATE SLUGS FOUND:\n');
      duplicateSlugs.forEach(row => {
        console.log(`   ${row.slug}: ${row.count} occurrences`);
      });
      
      // Get details of duplicates
      for (const dup of duplicateSlugs) {
        const [details] = await pool.query(
          'SELECT id, name, slug, module FROM permissions WHERE slug = ?',
          [dup.slug]
        );
        console.log(`\n   Details for "${dup.slug}":`);
        details.forEach(d => {
          console.log(`     ID: ${d.id}, Name: ${d.name}, Module: ${d.module}`);
        });
      }
    } else {
      console.log('✅ No duplicate slugs found!\n');
    }

    // Check for duplicate names
    const [duplicateNames] = await pool.query(`
      SELECT name, COUNT(*) as count
      FROM permissions
      GROUP BY name
      HAVING count > 1
      ORDER BY count DESC
    `);

    if (duplicateNames.length > 0) {
      console.log('\n❌ DUPLICATE NAMES FOUND:\n');
      duplicateNames.forEach(row => {
        console.log(`   ${row.name}: ${row.count} occurrences`);
      });
    } else {
      console.log('✅ No duplicate names found!\n');
    }

    // Check for PDF Tools permissions (deleted feature)
    const [pdfPermissions] = await pool.query(`
      SELECT id, name, slug, module
      FROM permissions
      WHERE slug LIKE '%pdf_tools%'
         OR slug LIKE '%pdf%merge%'
         OR slug LIKE '%pdf%compress%'
         OR name LIKE '%PDF Tool%'
         OR name LIKE '%Merge PDF%'
         OR name LIKE '%Compress PDF%'
      ORDER BY slug
    `);

    if (pdfPermissions.length > 0) {
      console.log('\n⚠️  PDF TOOLS PERMISSIONS FOUND (Should be removed - feature deleted):\n');
      pdfPermissions.forEach(p => {
        console.log(`   ID: ${p.id}, Slug: ${p.slug}, Name: ${p.name}`);
      });
    } else {
      console.log('\n✅ No PDF Tools permissions found!\n');
    }

    // Total count
    const [totalCount] = await pool.query('SELECT COUNT(*) as total FROM permissions');
    console.log(`\n📊 TOTAL PERMISSIONS: ${totalCount[0].total}\n`);

    // Group by module
    const [moduleStats] = await pool.query(`
      SELECT module, COUNT(*) as count
      FROM permissions
      GROUP BY module
      ORDER BY count DESC
    `);

    console.log('📋 PERMISSIONS BY MODULE:\n');
    moduleStats.forEach(stat => {
      console.log(`   ${stat.module}: ${stat.count} permissions`);
    });

    console.log('\n' + '═'.repeat(76) + '\n');

  } catch (error) {
    console.error('❌ Error checking permissions:', error.message);
  } finally {
    await pool.end();
  }
}

checkDuplicatePermissions();

