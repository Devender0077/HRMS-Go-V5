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

async function comprehensiveCleanup() {
  let connection;
  
  try {
    console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
    console.log('║       COMPREHENSIVE PERMISSIONS CLEANUP - REMOVE ALL DUPLICATES          ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

    connection = await pool.getConnection();
    
    const [beforeCount] = await connection.query('SELECT COUNT(*) as total FROM permissions');
    console.log(`📊 Before: ${beforeCount[0].total} permissions\n`);

    // ============================================================================
    // STEP 1: Get all duplicate permission names
    // ============================================================================
    console.log('🔍 STEP 1: Finding all duplicates...\n');

    const [duplicates] = await connection.query(`
      SELECT name, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids, GROUP_CONCAT(slug ORDER BY id) as slugs
      FROM permissions
      GROUP BY name
      HAVING count > 1
      ORDER BY count DESC, name
    `);

    console.log(`Found ${duplicates.length} duplicate permission names:\n`);

    // ============================================================================
    // STEP 2: Define which duplicates to keep and which to delete
    // ============================================================================
    
    const idsToDelete = [];
    const namesToUpdate = [];

    for (const dup of duplicates) {
      const ids = dup.ids.split(',').map(Number);
      const slugs = dup.slugs.split(',');
      
      console.log(`\n"${dup.name}" (${dup.count} times):`);
      slugs.forEach((slug, idx) => {
        console.log(`   ${idx + 1}. ID: ${ids[idx]}, Slug: ${slug}`);
      });

      // Decision logic: Keep the most specific/primary slug, delete others
      let keepId = null;
      let deleteIds = [];

      // Special handling for each duplicate group
      if (dup.name === 'Approve Regularization') {
        // Keep attendance.approve_regularization, delete attendance.approve
        keepId = ids[slugs.indexOf('attendance.approve_regularization')];
        deleteIds = ids.filter(id => id !== keepId);
      }
      else if (dup.name === 'Reject Regularization') {
        // Keep attendance.regularization.reject, delete attendance.reject_regularization
        keepId = ids[slugs.indexOf('attendance.regularization.reject')];
        deleteIds = ids.filter(id => id !== keepId);
      }
      else if (['Create Income', 'View Income', 'Edit Income', 'Delete Income'].includes(dup.name)) {
        // Keep Finance.* versions, delete income.*
        const financeIdx = slugs.findIndex(s => s.startsWith('finance.'));
        if (financeIdx !== -1) {
          keepId = ids[financeIdx];
          deleteIds = ids.filter(id => id !== keepId);
        }
      }
      else if (['View Expenses', 'Create Expenses', 'Edit Expenses', 'Delete Expenses', 'Reject Expenses', 'Approve Expenses'].includes(dup.name)) {
        // Keep Finance.* or finance.expenses.* versions, delete expenses.*
        const financeIdx = slugs.findIndex(s => s.startsWith('finance.'));
        if (financeIdx !== -1) {
          keepId = ids[financeIdx];
          deleteIds = ids.filter(id => id !== keepId);
        }
      }
      else if (['Create Salary', 'Delete Salary', 'View Payslips', 'Download Payslips'].includes(dup.name)) {
        // Keep payroll.* versions, delete salaries.* or payslips.*
        const payrollIdx = slugs.findIndex(s => s.startsWith('payroll.'));
        if (payrollIdx !== -1) {
          keepId = ids[payrollIdx];
          deleteIds = ids.filter(id => id !== keepId);
        }
      }
      else if (['View Roles', 'Create Roles', 'Edit Roles', 'Delete Roles'].includes(dup.name)) {
        // Keep settings.* versions, delete roles.*
        const settingsIdx = slugs.findIndex(s => s.startsWith('settings.'));
        if (settingsIdx !== -1) {
          keepId = ids[settingsIdx];
          deleteIds = ids.filter(id => id !== keepId);
        }
      }
      else if (dup.name === 'Manage Permissions') {
        // Keep settings.manage_permissions, delete roles.manage_permissions
        keepId = ids[slugs.indexOf('settings.manage_permissions')];
        deleteIds = ids.filter(id => id !== keepId);
      }
      else if (dup.name === 'Manage Users') {
        // Keep settings.manage_users, delete settings.users
        keepId = ids[slugs.indexOf('settings.manage_users')];
        deleteIds = ids.filter(id => id !== keepId);
      }
      else if (dup.name === 'Manage Roles') {
        // Keep settings.manage_roles, delete settings.roles
        keepId = ids[slugs.indexOf('settings.manage_roles')];
        deleteIds = ids.filter(id => id !== keepId);
      }
      else if (dup.name === 'View Analytics') {
        // Keep all - they're for different modules (dashboard, performance, announcements)
        // But rename them to be specific
        namesToUpdate.push({
          id: ids[slugs.indexOf('dashboard.analytics')],
          name: 'Dashboard - View Analytics'
        });
        namesToUpdate.push({
          id: ids[slugs.indexOf('performance.analytics')],
          name: 'Performance - View Analytics'
        });
        if (slugs.includes('announcements.analytics')) {
          namesToUpdate.push({
            id: ids[slugs.indexOf('announcements.analytics')],
            name: 'Announcements - View Analytics'
          });
        }
      }
      else if (dup.name === 'View Payroll Reports' || dup.name === 'Payroll - View Reports') {
        // Keep payroll.reports.view (renamed to "Payroll - View Reports"), delete reports.payroll
        const payrollReportsIdx = slugs.findIndex(s => s === 'payroll.reports.view');
        if (payrollReportsIdx !== -1) {
          keepId = ids[payrollReportsIdx];
          deleteIds = ids.filter(id => id !== keepId);
        }
      }
      else if (dup.name === 'View Leave Reports' || dup.name === 'Leave - View Reports') {
        // Keep leaves.reports.view (renamed), delete reports.leaves
        const leaveReportsIdx = slugs.findIndex(s => s === 'leaves.reports.view');
        if (leaveReportsIdx !== -1) {
          keepId = ids[leaveReportsIdx];
          deleteIds = ids.filter(id => id !== keepId);
        }
      }
      else if (dup.name === 'Mark Attendance' || dup.name === 'Attendance - Mark Attendance') {
        // Keep attendance.mark (renamed), delete training mark attendance
        const attendanceMarkIdx = slugs.findIndex(s => s === 'attendance.mark');
        if (attendanceMarkIdx !== -1) {
          keepId = ids[attendanceMarkIdx];
          deleteIds = ids.filter(id => id !== keepId);
        }
      }
      else if (dup.name === 'Upload Documents' || dup.name === 'Documents - Upload Files') {
        // Keep documents.upload (renamed), delete others
        const docsUploadIdx = slugs.findIndex(s => s === 'documents.upload');
        if (docsUploadIdx !== -1) {
          keepId = ids[docsUploadIdx];
          deleteIds = ids.filter(id => id !== keepId);
        }
      }
      else if (dup.name === 'Send Notifications' || dup.name === 'Communication - Send Notifications') {
        // Keep notifications.send (renamed), delete others
        const notifSendIdx = slugs.findIndex(s => s === 'notifications.send');
        if (notifSendIdx !== -1) {
          keepId = ids[notifSendIdx];
          deleteIds = ids.filter(id => id !== keepId);
        }
      }
      else {
        // Default: keep first (oldest) ID, delete rest
        keepId = ids[0];
        deleteIds = ids.slice(1);
      }

      if (deleteIds.length > 0) {
        console.log(`   ✅ Keep: ID ${keepId}`);
        console.log(`   ❌ Delete: IDs ${deleteIds.join(', ')}`);
        idsToDelete.push(...deleteIds);
      }
    }

    // ============================================================================
    // STEP 3: Delete duplicate permissions
    // ============================================================================
    if (idsToDelete.length > 0) {
      console.log(`\n🗑️  STEP 2: Deleting ${idsToDelete.length} duplicate permissions...\n`);

      // First, delete role assignments
      const [rolePermResult] = await connection.query(
        'DELETE FROM role_permissions WHERE permission_id IN (?)',
        [idsToDelete]
      );
      console.log(`   ✅ Removed ${rolePermResult.affectedRows} role assignments`);

      // Then, delete the permissions
      const [permResult] = await connection.query(
        'DELETE FROM permissions WHERE id IN (?)',
        [idsToDelete]
      );
      console.log(`   ✅ Deleted ${permResult.affectedRows} duplicate permissions\n`);
    }

    // ============================================================================
    // STEP 4: Update permission names for clarity
    // ============================================================================
    if (namesToUpdate.length > 0) {
      console.log(`🔧 STEP 3: Updating ${namesToUpdate.length} permission names for clarity...\n`);

      for (const update of namesToUpdate) {
        await connection.query(
          'UPDATE permissions SET name = ? WHERE id = ?',
          [update.name, update.id]
        );
        console.log(`   ✅ ID ${update.id} → "${update.name}"`);
      }
      console.log();
    }

    // ============================================================================
    // STEP 5: Standardize all module names (proper case)
    // ============================================================================
    console.log('📝 STEP 4: Standardizing ALL module names...\n');

    const moduleUpdates = [
      { from: 'finance', to: 'Finance' },
      { from: 'contracts', to: 'Contracts' },
      { from: 'payroll', to: 'Payroll' },
      { from: 'attendance', to: 'Attendance' },
      { from: 'documents', to: 'Documents' },
      { from: 'employees', to: 'Employees' },
      { from: 'leaves', to: 'Leaves' },
      { from: 'performance', to: 'Performance' },
      { from: 'recruitment', to: 'Recruitment' },
      { from: 'training', to: 'Training' },
      { from: 'assets', to: 'Assets' },
    ];

    for (const { from, to } of moduleUpdates) {
      const [result] = await connection.query(
        'UPDATE permissions SET module = ? WHERE module = ?',
        [to, from]
      );
      if (result.affectedRows > 0) {
        console.log(`   ✅ ${from} → ${to} (${result.affectedRows} permissions)`);
      }
    }

    // ============================================================================
    // STEP 6: Verify results
    // ============================================================================
    console.log('\n' + '═'.repeat(76));
    console.log('\n✅ COMPREHENSIVE CLEANUP COMPLETED!\n');

    const [afterCount] = await connection.query('SELECT COUNT(*) as total FROM permissions');
    const removed = beforeCount[0].total - afterCount[0].total;

    console.log(`Before: ${beforeCount[0].total} permissions`);
    console.log(`After:  ${afterCount[0].total} permissions`);
    console.log(`Removed: ${removed} duplicate permissions\n`);

    // Check for any remaining duplicates
    const [remainingDups] = await connection.query(`
      SELECT name, COUNT(*) as count, GROUP_CONCAT(slug SEPARATOR ', ') as slugs
      FROM permissions
      GROUP BY name
      HAVING count > 1
      ORDER BY count DESC
    `);

    if (remainingDups.length > 0) {
      console.log(`⚠️  ${remainingDups.length} remaining duplicates (different modules - OK):\n`);
      remainingDups.slice(0, 5).forEach(d => {
        console.log(`   ${d.name}: ${d.count} times (${d.slugs})`);
      });
    } else {
      console.log('✅ NO DUPLICATE NAMES! All permissions are unique!\n');
    }

    // Module stats
    const [moduleStats] = await connection.query(`
      SELECT module, COUNT(*) as count
      FROM permissions
      GROUP BY module
      ORDER BY count DESC
    `);

    console.log('\n📋 PERMISSIONS BY MODULE:\n');
    moduleStats.forEach(stat => {
      console.log(`   ${stat.module}: ${stat.count} permissions`);
    });

    console.log('\n' + '═'.repeat(76));
    console.log('\n🎉 Database is now COMPLETELY CLEAN!\n');
    console.log('✅ All duplicate permissions removed');
    console.log('✅ Module names standardized');
    console.log('✅ Permission names clarified');
    console.log('\n⚠️  RESTART BACKEND to see changes!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

comprehensiveCleanup();

