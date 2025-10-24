const db = require('../config/database');

async function addRoleColumn() {
  try {
    console.log('Adding role_id column to users table...\n');
    
    // Add column
    try {
      await db.query('ALTER TABLE users ADD COLUMN role_id BIGINT UNSIGNED NULL AFTER user_type');
      console.log('✅ Added role_id column');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('✅ role_id column already exists');
      } else {
        throw err;
      }
    }
    
    // Update users with roles
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
    console.log('✅ Updated users with roles\n');
    
    // Verify
    const [users] = await db.query(`
      SELECT u.email, u.user_type, r.name as role_name
      FROM users u
      LEFT JOIN user_roles r ON u.role_id = r.id
      LIMIT 10
    `);
    
    console.log('Verified users:');
    users.forEach(u => {
      console.log(`  ${u.email.padEnd(30)} | ${u.user_type.padEnd(12)} | ${u.role_name || 'NO ROLE'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addRoleColumn();

