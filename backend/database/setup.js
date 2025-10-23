#!/usr/bin/env node

/**
 * Complete Database Setup Script
 * 
 * This script:
 * 1. Tests database connection
 * 2. Creates all 25 tables automatically
 * 3. Seeds initial data (general settings, sample employees, etc.)
 * 
 * Usage:
 *   npm run setup             - Full setup (migrate + seed)
 *   npm run setup:migrate     - Only create tables
 *   npm run setup:seed        - Only seed data (assumes tables exist)
 *   npm run setup:fresh       - Fresh start (⚠️ DESTROYS DATA!)
 */

require('dotenv').config();
const { syncStrategies } = require('../config/syncDatabase');

// Import seed functions
const seedDashboardData = require('./seedDashboardData');
const seedGeneralSettings = require('./seedGeneralSettings');
const { seedAdminUser } = require('./seedAdminUser');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'full';

const setupSteps = {
  // Full setup: migrate + seed
  full: async () => {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║          🚀 HRMS Go V5 - Complete Database Setup              ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    try {
      // Step 1: Migrate (create tables)
      console.log('📦 Step 1/4: Creating database tables...\n');
      const migrateResult = await syncStrategies.development();
      console.log(`✅ Tables created: ${migrateResult.models.length} models\n`);
      
      // Wait a bit for tables to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Create admin user
      console.log('🔐 Step 2/4: Creating admin user...\n');
      await seedAdminUser();
      console.log('✅ Admin user created\n');
      
      // Step 3: Seed general settings
      console.log('📝 Step 3/4: Seeding general settings...\n');
      await seedGeneralSettings.seedGeneralSettings();
      console.log('✅ General settings seeded\n');
      
      // Step 4: Seed dashboard/sample data
      console.log('📊 Step 4/4: Seeding sample data...\n');
      await seedDashboardData.seedAll();
      console.log('✅ Sample data seeded\n');
      
      console.log('╔════════════════════════════════════════════════════════════════╗');
      console.log('║                    ✅ SETUP COMPLETE!                          ║');
      console.log('╚════════════════════════════════════════════════════════════════╝\n');
      console.log('Your database is ready with:');
      console.log(`  ✅ ${migrateResult.models.length} tables created`);
      console.log('  ✅ Admin user created (admin@hrms.com / admin123)');
      console.log('  ✅ General settings configured');
      console.log('  ✅ Sample data populated\n');
      console.log('Next steps:');
      console.log('  1. Start backend: npm run dev');
      console.log('  2. Start frontend: cd .. && npm start');
      console.log('  3. Login with your credentials');
      console.log('\n⚠️  IMPORTANT: Change default password after first login!\n');
      
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      console.error('\nFull error:', error);
      process.exit(1);
    }
  },
  
  // Only migrate (create tables)
  migrate: async () => {
    console.log('\n📦 Creating database tables...\n');
    try {
      const result = await syncStrategies.development();
      console.log(`\n✅ Success! Created ${result.models.length} tables\n`);
      console.log('Models created:');
      result.models.forEach((model, index) => {
        console.log(`  ${(index + 1).toString().padStart(2, ' ')}. ${model}`);
      });
      console.log('\nNext: Run "npm run setup:seed" to add sample data\n');
      process.exit(0);
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  },
  
  // Only seed data
  seed: async () => {
    console.log('\n📊 Seeding database with sample data...\n');
    try {
      // Seed general settings
      console.log('1. Seeding general settings...');
      await seedGeneralSettings.seedGeneralSettings();
      console.log('   ✅ General settings done\n');
      
      // Seed sample data
      console.log('2. Seeding sample data...');
      await seedDashboardData.seedAll();
      console.log('   ✅ Sample data done\n');
      
      console.log('✅ All data seeded successfully!\n');
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding failed:', error.message);
      console.error(error);
      process.exit(1);
    }
  },
  
  // Fresh start: drop everything and recreate
  fresh: async () => {
    console.log('\n🚨 WARNING: This will DELETE ALL DATA!\n');
    console.log('All tables will be dropped and recreated from scratch.');
    console.log('Waiting 5 seconds... (Ctrl+C to cancel)\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      console.log('🗑️  Dropping all tables...\n');
      const result = await syncStrategies.fresh();
      console.log(`✅ Tables recreated: ${result.models.length}\n`);
      
      console.log('📝 Seeding general settings...\n');
      await seedGeneralSettings.seedGeneralSettings();
      console.log('✅ General settings seeded\n');
      
      console.log('📊 Seeding sample data...\n');
      await seedDashboardData.seedAll();
      console.log('✅ Sample data seeded\n');
      
      console.log('╔════════════════════════════════════════════════════════════════╗');
      console.log('║              ✅ FRESH DATABASE READY!                          ║');
      console.log('╚════════════════════════════════════════════════════════════════╝\n');
      process.exit(0);
    } catch (error) {
      console.error('❌ Fresh setup failed:', error.message);
      process.exit(1);
    }
  },
  
  // Show help
  help: () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║              HRMS Go V5 - Database Setup Tool                  ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  npm run setup [command]

COMMANDS:
  (no command)    - Full setup: create tables + seed data (default)
  migrate         - Only create tables (no data)
  seed            - Only seed data (assumes tables exist)
  fresh           - Fresh start: drop all + recreate + seed (⚠️  DESTROYS DATA!)
  help            - Show this help message

EXAMPLES:
  npm run setup              # Complete setup (recommended for first time)
  npm run setup:migrate      # Just create tables
  npm run setup:seed         # Just add sample data
  npm run setup:fresh        # Fresh start (deletes everything!)

WHAT GETS CREATED:

Tables (25 total):
  ✅ Users, Employees, Roles, Permissions
  ✅ Branches, Departments, Designations
  ✅ Attendance, Shifts, Policies, Leaves
  ✅ Payroll, Salary Components
  ✅ Job Postings, Applications
  ✅ Performance Goals, Training Programs
  ✅ Assets, Categories, Assignments
  ✅ Documents, Calendar Events
  ✅ General Settings

Sample Data:
  ✅ 5 Sample Employees
  ✅ 4 Attendance Records
  ✅ 3 Leave Requests
  ✅ 4 Calendar Events
  ✅ General Settings (83 settings across 22 categories)
  ✅ Configuration Data (departments, branches, etc.)

FIRST TIME SETUP:

1. Make sure Docker is running:
   docker-compose up -d

2. Install dependencies:
   npm install

3. Run full setup:
   npm run setup

4. Start backend:
   npm run dev

5. Start frontend (in another terminal):
   cd ..
   npm start

6. Login:
   URL: http://localhost:3000
   Email: admin@hrms.com
   Password: admin123

════════════════════════════════════════════════════════════════
`);
  },
};

// Execute command
(async () => {
  const commandKey = command.replace(':', '');
  const fn = setupSteps[commandKey] || setupSteps['help'];
  
  if (!setupSteps[commandKey] && command !== 'help') {
    console.log(`\n⚠️  Unknown command: ${command}`);
    console.log('Run "npm run setup help" for usage info\n');
    process.exit(1);
  }
  
  try {
    await fn();
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
})();

