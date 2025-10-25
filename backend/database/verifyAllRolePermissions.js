const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
};

async function verifyRolePermissions() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║          🔐 ROLE PERMISSIONS VERIFICATION                                  ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    // Get all roles
    const [roles] = await connection.execute(
      'SELECT * FROM user_roles ORDER BY id'
    );

    for (const role of roles) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📋 ROLE: ${role.name.toUpperCase()}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      // Get permissions for this role
      const [permissions] = await connection.execute(`
        SELECT p.slug, p.name, p.module
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = ?
        ORDER BY p.module, p.slug
      `, [role.id]);

      console.log(`Total Permissions: ${permissions.length}`);

      // Group by module
      const byModule = permissions.reduce((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
      }, {});

      for (const [module, perms] of Object.entries(byModule)) {
        console.log(`\n  ${module.toUpperCase()} (${perms.length}):`);
        perms.forEach(p => {
          console.log(`    ✅ ${p.slug}`);
        });
      }

      // Get user count for this role
      const [userCount] = await connection.execute(
        'SELECT COUNT(*) as count FROM users WHERE role_id = ?',
        [role.id]
      );
      console.log(`\n  👥 Users with this role: ${userCount[0].count}`);

      // List users
      if (userCount[0].count > 0) {
        const [users] = await connection.execute(
          'SELECT email, name FROM users WHERE role_id = ?',
          [role.id]
        );
        users.forEach(u => {
          console.log(`     - ${u.email} (${u.name})`);
        });
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Overall stats
    const [totalPerms] = await connection.execute('SELECT COUNT(*) as count FROM permissions');
    const [totalRolePerms] = await connection.execute('SELECT COUNT(*) as count FROM role_permissions');
    const [totalUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');

    console.log(`Total Permissions in System: ${totalPerms[0].count}`);
    console.log(`Total Role-Permission Assignments: ${totalRolePerms[0].count}`);
    console.log(`Total Users: ${totalUsers[0].count}`);
    console.log(`Total Roles: ${roles.length}`);

    console.log('\n✅ Verification Complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run verification
verifyRolePermissions()
  .then(() => {
    console.log('✅ Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });

