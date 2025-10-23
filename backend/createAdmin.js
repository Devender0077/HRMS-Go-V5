const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function createAdmin() {
  try {
    // Generate bcrypt hash for 'admin123'
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    console.log('\n🔐 Creating admin user...\n');
    console.log('Password Hash:', passwordHash);
    console.log('');
    
    // Delete existing admin
    await db.query('DELETE FROM users WHERE email = ?', ['admin@hrms.com']);
    console.log('✅ Cleared existing admin user');
    
    // Create new admin with proper hash
    const [result] = await db.query(
      `INSERT INTO users (name, email, password, user_type, status, email_verified_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
      ['System Administrator', 'admin@hrms.com', passwordHash, 'super_admin', 'active']
    );
    
    console.log('✅ Admin user created successfully!\n');
    
    // Verify
    const [[user]] = await db.query(
      'SELECT id, name, email, user_type, status, LENGTH(password) as pwd_len FROM users WHERE email = ?',
      ['admin@hrms.com']
    );
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   ADMIN USER DETAILS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('ID:', user.id);
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Type:', user.user_type);
    console.log('Status:', user.status);
    console.log('Password Length:', user.pwd_len, 'chars (bcrypt hash)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📝 LOGIN CREDENTIALS:');
    console.log('   Email:    admin@hrms.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Change this password after first login!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();

