#!/usr/bin/env node

/**
 * Standalone Database Migration Script
 * 
 * Usage:
 *   npm run migrate              - Create missing tables (safe)
 *   npm run migrate:alter        - Update existing tables (may modify schema)
 *   npm run migrate:fresh        - Drop all tables and recreate (DESTROYS DATA!)
 *   npm run migrate:status       - Check database connection and model status
 */

require('dotenv').config();
const { syncStrategies, models } = require('../config/syncDatabase');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'development';

// Command mapping
const commands = {
  'status': async () => {
    console.log('\n📊 Checking database status...\n');
    try {
      const result = await syncStrategies.production(); // Just connects, doesn't sync
      console.log(`✅ Database connection: OK`);
      console.log(`📦 Models registered: ${result.models.length}`);
      console.log('\nRegistered models:');
      result.models.forEach((model, index) => {
        console.log(`  ${(index + 1).toString().padStart(2, ' ')}. ${model}`);
      });
      console.log();
      return result;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    }
  },
  
  'development': async () => {
    console.log('\n📦 Creating missing tables (safe mode)...\n');
    try {
      const result = await syncStrategies.development();
      console.log(`\n✅ Migration complete!`);
      console.log(`📦 ${result.models.length} models synchronized`);
      console.log(`\n⚠️  Note: This only creates missing tables, doesn't update existing ones`);
      console.log(`To update existing tables, run: npm run migrate:alter\n`);
      return result;
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  },
  
  'alter': async () => {
    console.log('\n⚠️  WARNING: This will modify existing tables!\n');
    console.log('This may add/remove columns but tries to preserve data.');
    console.log('Waiting 3 seconds... (Ctrl+C to cancel)\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const result = await syncStrategies.developmentAlter();
      console.log(`\n✅ Tables updated!`);
      console.log(`📦 ${result.models.length} models synchronized`);
      console.log(`\n⚠️  Check your data to ensure nothing was lost\n`);
      return result;
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  },
  
  'fresh': async () => {
    console.log('\n🚨 DANGER ZONE: This will DELETE ALL DATA!\n');
    console.log('All tables will be dropped and recreated from scratch.');
    console.log('This cannot be undone!');
    console.log('\nWaiting 5 seconds... (Ctrl+C to cancel)\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      const result = await syncStrategies.fresh();
      console.log(`\n✅ Database recreated!`);
      console.log(`📦 ${result.models.length} models created`);
      console.log(`\n⚠️  All tables are now empty. Run seed scripts to add sample data.\n`);
      return result;
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  },
  
  'help': () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║              HRMS Go V5 - Database Migration Tool              ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  npm run migrate [command]

COMMANDS:
  (no command)          - Create missing tables (safe, default)
  status                - Check database connection and models
  alter                 - Update existing tables to match models
  fresh                 - Drop all tables and recreate (⚠️  DESTROYS DATA!)
  help                  - Show this help message

EXAMPLES:
  npm run migrate              # Safe: Only creates missing tables
  npm run migrate status       # Check connection
  npm run migrate:alter        # Update existing tables
  npm run migrate:fresh        # Fresh start (deletes all data!)

NOTES:
  - 'development' (default): Creates missing tables only
  - 'alter': Updates existing tables (may modify columns)
  - 'fresh': DESTROYS all data and recreates tables
  - Always backup your data before running 'alter' or 'fresh'

ENVIRONMENT VARIABLES:
  Set in backend/.env:
    DB_HOST=localhost
    DB_PORT=3306
    DB_NAME=hrms_go_v5
    DB_USER=root
    DB_PASSWORD=root

For production, use proper migration files instead of auto-sync.

════════════════════════════════════════════════════════════════
`);
  },
};

// Execute command
(async () => {
  const commandKey = command.replace(':', '');
  const fn = commands[commandKey] || commands['help'];
  
  if (!commands[commandKey] && command !== 'help') {
    console.log(`\n⚠️  Unknown command: ${command}`);
    console.log('Run "npm run migrate help" for usage info\n');
    process.exit(1);
  }
  
  try {
    await fn();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
})();

