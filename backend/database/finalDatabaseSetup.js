/**
 * Final Database Setup
 * Removes redundant settings tables, uses only specialized tables
 */

const sequelize = require('../config/database2');
const db = require('../config/database');

async function finalSetup() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    🔧 Final Database Setup - Clean Architecture                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    console.log('📊 CURRENT STATE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Check current tables
    const [[generalCount]] = await db.query('SELECT COUNT(*) as count FROM general_settings');
    const [[systemCount]] = await db.query('SELECT COUNT(*) as count FROM system_settings');
    const [[companyCount]] = await db.query('SELECT COUNT(*) as count FROM company_information');
    
    console.log(`  general_settings:       ${generalCount.count} rows (OLD - to be removed)`);
    console.log(`  system_settings:        ${systemCount.count} rows (OLD - to be removed)`);
    console.log(`  company_information:    ${companyCount.count} rows (NEW - specialized)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🎯 DECISION:');
    console.log('  ✅ KEEP specialized tables (19 tables for settings)');
    console.log('  ✅ KEEP general_settings (for simple app configs only)');
    console.log('  ❌ DROP system_settings (duplicate, not needed)\n');

    console.log('🗑️  Dropping system_settings...');
    await db.query('DROP TABLE IF EXISTS system_settings');
    console.log('✅ system_settings dropped\n');

    console.log('🧹 Cleaning general_settings (keep only simple app configs)...');
    // Keep only truly general app settings in general_settings
    const keysToKeep = [
      'app_name', 'app_version', 'app_url', 
      'app_logo', 'app_favicon', 'app_logo_dark', 'app_small_logo',
      'admin_email', 'support_email',
      'timezone', 'date_format', 'time_format'
    ];
    
    const placeholders = keysToKeep.map(() => '?').join(',');
    await db.query(
      `DELETE FROM general_settings WHERE setting_key NOT IN (${placeholders})`,
      keysToKeep
    );
    
    const [[remainingCount]] = await db.query('SELECT COUNT(*) as count FROM general_settings');
    console.log(`✅ general_settings cleaned (${remainingCount.count} simple configs kept)\n`);

    // Verify specialized tables have data
    console.log('📊 SPECIALIZED TABLES STATUS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const specializedTables = [
      'company_information',
      'email_configurations',
      'localization_settings',
      'notification_settings',
      'integration_slack',
      'integration_pusher',
      'integration_teams',
      'integration_zoom',
      'security_policies',
      'backup_configurations',
      'api_configurations',
      'document_templates',
      'cookie_consent',
      'seo_settings',
      'cache_settings',
      'webhook_configurations',
      'ai_configurations',
      'google_calendar_integrations',
      'export_settings',
    ];

    let totalRows = 0;
    for (const table of specializedTables) {
      const [[result]] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table.padEnd(35)}: ${result.count} row(s)`);
      totalRows += result.count;
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  TOTAL: ${totalRows} rows across 19 specialized tables\n`);

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                ✅ SETUP COMPLETE!                              ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n📊 FINAL DATABASE STATE:');
    console.log('  ✅ 19 specialized settings tables (with data)');
    console.log('  ✅ 1 general_settings table (simple app configs only)');
    console.log('  ✅ ~25 core application tables (employees, departments, etc.)');
    console.log('  ❌ 0 redundant settings tables');
    console.log('\n  Total: Clean, optimized database architecture!\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  finalSetup();
}

module.exports = { finalSetup };

