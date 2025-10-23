#!/usr/bin/env node

/**
 * Create Default Admin User
 * 
 * This script creates the default admin user for the HRMS system.
 * Run this after database tables are created.
 * 
 * Usage:
 *   npm run seed:admin
 */

require('dotenv').config();
const User = require('../models/User');
const sequelize = require('../config/database2');

async function seedAdminUser() {
  try {
    console.log('\n🔐 Creating default admin user...\n');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@hrms.com' } 
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email: admin@hrms.com');
      console.log('To reset password, delete the user from database and run this script again.\n');
      process.exit(0);
    }
    
    // Create admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@hrms.com',
      password: 'admin123', // Will be auto-hashed by User model
      userType: 'super_admin',
      status: 'active',
      emailVerifiedAt: new Date(),
      language: 'en',
      timezone: 'UTC',
    });
    
    console.log('✅ Admin user created successfully!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   DEFAULT LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   Email:    admin@hrms.com');
    console.log('   Password: admin123');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');
    console.log('To change password:');
    console.log('  1. Login to the application');
    console.log('  2. Go to Settings > Profile');
    console.log('  3. Update your password\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  seedAdminUser();
}

module.exports = { seedAdminUser };

