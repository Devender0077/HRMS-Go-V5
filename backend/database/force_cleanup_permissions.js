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

async function forceCleanup() {
  let connection;
  
  try {
    console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
    console.log('║         FORCE CLEANUP: REMOVE PDF TOOLS & FIX DUPLICATES                ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

    connection = await pool.getConnection();
    
    // Get count before
    const [beforeCount] = await connection.query('SELECT COUNT(*) as total FROM permissions');
    console.log(`📊 Before: ${beforeCount[0].total} permissions\n`);

    // ============================================================================
    // STEP 1: Remove PDF Tools Permissions
    // ============================================================================
    console.log('🗑️  STEP 1: Removing PDF Tools permissions...\n');

    // Get PDF tools permission IDs
    const [pdfPermissions] = await connection.query(`
      SELECT id, slug, name FROM permissions
      WHERE slug IN (
        'contracts.pdf_tools.use',
        'contracts.pdf_tools.merge',
        'contracts.pdf_tools.compress',
        'contracts.pdf_tools.split',
        'contracts.pdf_tools.edit'
      )
    `);

    if (pdfPermissions.length > 0) {
      console.log(`Found ${pdfPermissions.length} PDF tools permissions to remove:`);
      pdfPermissions.forEach(p => {
        console.log(`   - ID: ${p.id}, Slug: ${p.slug}, Name: ${p.name}`);
      });

      const pdfIds = pdfPermissions.map(p => p.id);

      // First, remove from role_permissions
      const [rolePermResult] = await connection.query(
        'DELETE FROM role_permissions WHERE permission_id IN (?)',
        [pdfIds]
      );
      console.log(`   ✅ Removed ${rolePermResult.affectedRows} role assignments`);

      // Then, remove the permissions themselves
      const [permResult] = await connection.query(
        'DELETE FROM permissions WHERE id IN (?)',
        [pdfIds]
      );
      console.log(`   ✅ Removed ${permResult.affectedRows} PDF tools permissions\n`);
    } else {
      console.log('   ✅ No PDF tools permissions found (already removed)\n');
    }

    // ============================================================================
    // STEP 2: Fix Duplicate Names
    // ============================================================================
    console.log('🔧 STEP 2: Fixing duplicate permission names...\n');

    const fixes = [
      // Finance
      { slug: 'finance.analytics.view', name: 'Finance - View Analytics' },
      { slug: 'finance.income.create', name: 'Finance - Create Income' },
      { slug: 'finance.income.view', name: 'Finance - View Income' },
      { slug: 'finance.income.edit', name: 'Finance - Edit Income' },
      { slug: 'finance.income.delete', name: 'Finance - Delete Income' },
      { slug: 'finance.expenses.view', name: 'Finance - View Expenses' },
      { slug: 'finance.reports.view', name: 'Finance - View Reports' },
      { slug: 'finance.reports.generate', name: 'Finance - Generate Reports' },
      
      // Payroll
      { slug: 'payroll.analytics.view', name: 'Payroll - View Analytics' },
      { slug: 'payroll.reports.view', name: 'Payroll - View Reports' },
      { slug: 'payroll.payslips.view', name: 'Payroll - View Payslips' },
      { slug: 'payroll.payslips.download', name: 'Payroll - Download Payslips' },
      { slug: 'payroll.salaries.create', name: 'Payroll - Create Salary' },
      { slug: 'payroll.salaries.delete', name: 'Payroll - Delete Salary' },
      
      // Attendance
      { slug: 'attendance.mark', name: 'Attendance - Mark Attendance' },
      { slug: 'attendance.regularization.approve', name: 'Attendance - Approve Regularization' },
      { slug: 'attendance.regularization.reject', name: 'Attendance - Reject Regularization' },
      
      // Leaves
      { slug: 'leaves.reports.view', name: 'Leave - View Reports' },
      
      // Performance
      { slug: 'performance.analytics.view', name: 'Performance - View Analytics' },
      
      // Settings/System
      { slug: 'settings.users.manage', name: 'System - Manage Users' },
      { slug: 'settings.roles.manage', name: 'System - Manage Roles' },
      { slug: 'settings.permissions.manage', name: 'System - Manage Permissions' },
      { slug: 'settings.roles.create', name: 'System - Create Roles' },
      { slug: 'settings.roles.edit', name: 'System - Edit Roles' },
      { slug: 'settings.roles.delete', name: 'System - Delete Roles' },
      { slug: 'settings.roles.view', name: 'System - View Roles' },
      
      // Documents
      { slug: 'documents.upload', name: 'Documents - Upload Files' },
      
      // Communication
      { slug: 'notifications.send', name: 'Communication - Send Notifications' },
    ];

    let fixedCount = 0;
    for (const fix of fixes) {
      const [result] = await connection.query(
        'UPDATE permissions SET name = ? WHERE slug = ?',
        [fix.name, fix.slug]
      );
      if (result.affectedRows > 0) {
        fixedCount++;
        console.log(`   ✅ ${fix.slug} → "${fix.name}"`);
      }
    }
    console.log(`\n   ✅ Fixed ${fixedCount} duplicate names\n`);

    // ============================================================================
    // STEP 3: Standardize Module Names
    // ============================================================================
    console.log('📝 STEP 3: Standardizing module names...\n');

    const [financeResult] = await connection.query(
      "UPDATE permissions SET module = 'Finance' WHERE module = 'finance'"
    );
    console.log(`   ✅ Standardized ${financeResult.affectedRows} finance module names`);

    const [contractsResult] = await connection.query(
      "UPDATE permissions SET module = 'Contracts' WHERE module = 'contracts'"
    );
    console.log(`   ✅ Standardized ${contractsResult.affectedRows} contracts module names\n`);

    // ============================================================================
    // STEP 4: Verify Results
    // ============================================================================
    console.log('═'.repeat(76));
    console.log('\n✅ CLEANUP COMPLETED!\n');

    const [afterCount] = await connection.query('SELECT COUNT(*) as total FROM permissions');
    const removed = beforeCount[0].total - afterCount[0].total;

    console.log(`Before: ${beforeCount[0].total} permissions`);
    console.log(`After:  ${afterCount[0].total} permissions`);
    console.log(`Removed: ${removed} permissions\n`);

    // Check remaining duplicates
    const [duplicates] = await connection.query(`
      SELECT name, COUNT(*) as count, GROUP_CONCAT(slug SEPARATOR ', ') as slugs
      FROM permissions
      GROUP BY name
      HAVING count > 1
      ORDER BY count DESC
    `);

    if (duplicates.length > 0) {
      console.log(`⚠️  Remaining ${duplicates.length} duplicate names:\n`);
      duplicates.forEach(d => {
        console.log(`   ${d.name}: ${d.count} times`);
        console.log(`      Slugs: ${d.slugs}\n`);
      });
    } else {
      console.log('✅ No duplicate names remaining!\n');
    }

    // Module stats
    const [moduleStats] = await connection.query(`
      SELECT module, COUNT(*) as count
      FROM permissions
      GROUP BY module
      ORDER BY count DESC
      LIMIT 10
    `);

    console.log('📋 TOP 10 MODULES:\n');
    moduleStats.forEach(stat => {
      console.log(`   ${stat.module}: ${stat.count} permissions`);
    });

    console.log('\n' + '═'.repeat(76));
    console.log('\n🎉 Database is clean!\n');
    console.log('Next steps:');
    console.log('1. Restart backend server to load new permissions');
    console.log('2. Check /dashboard/settings/roles page');
    console.log('3. Verify no PDF Tools permissions are visible\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

forceCleanup();

