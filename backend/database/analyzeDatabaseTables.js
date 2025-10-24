/**
 * Database Analysis Script
 * Shows all tables, which have models, which don't
 */

const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function analyzeTables() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║          📊 DATABASE TABLES ANALYSIS                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    // Get all tables from database
    const [tables] = await db.query('SHOW TABLES');
    const allTables = tables.map(t => Object.values(t)[0]);
    
    // Get all model files
    const modelsDir = path.join(__dirname, '../models');
    const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));
    const modelNames = modelFiles.map(f => f.replace('.js', ''));
    
    // Convert model names to table names (PascalCase → snake_case)
    const modelTableMap = {};
    modelFiles.forEach(file => {
      const modelName = file.replace('.js', '');
      // Simple conversion (not perfect but close enough)
      const tableName = modelName
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .substring(1)
        .replace(/_([a-z])/g, (match, letter) => `_${letter}`) + 's';
      modelTableMap[modelName] = tableName;
    });

    console.log(`📊 SUMMARY:`);
    console.log(`  Total Tables in Database: ${allTables.length}`);
    console.log(`  Total Models in Code:     ${modelFiles.length}`);
    console.log(`  Missing Models:           ${allTables.length - modelFiles.length}\n`);

    // Categorize tables
    const settingsTables = allTables.filter(t => 
      t.includes('setting') || t.includes('configuration') || 
      t.includes('integration_') || t.includes('cookie_consent') ||
      t.includes('seo_') || t.includes('cache_') || t.includes('webhook_') ||
      t.includes('ai_') || t.includes('google_calendar') || t.includes('export_') ||
      t.includes('api_configuration') || t.includes('backup_configuration') ||
      t.includes('company_information') || t.includes('localization_') ||
      t.includes('notification_') || t.includes('security_') || t.includes('email_configuration') ||
      t.includes('document_template')
    );

    const coreTables = allTables.filter(t => 
      ['users', 'employees', 'roles', 'permissions', 'branches', 'departments', 'designations'].includes(t)
    );

    const hrTables = allTables.filter(t => 
      t.includes('attendance') || t.includes('leave') || t.includes('shift') || t.includes('payroll') ||
      t.includes('salary') || t.includes('performance') || t.includes('training')
    );

    const recruitmentTables = allTables.filter(t => 
      t.includes('job_') || t.includes('hiring') || t.includes('interview')
    );

    const otherTables = allTables.filter(t => 
      !settingsTables.includes(t) && !coreTables.includes(t) && 
      !hrTables.includes(t) && !recruitmentTables.includes(t)
    );

    console.log('📂 TABLES BY CATEGORY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`🔧 SETTINGS TABLES (${settingsTables.length}):`);
    settingsTables.forEach((t, i) => {
      const hasModel = modelFiles.some(m => {
        const modelName = m.replace('.js', '');
        return t === modelTableMap[modelName] || 
               t.replace(/_/g, '') === modelName.toLowerCase() ||
               modelName.toLowerCase().includes(t.replace(/_/g, ''));
      });
      console.log(`  ${(i + 1).toString().padStart(2)}. ${t.padEnd(35)} ${hasModel ? '✅ HAS MODEL' : '❌ NO MODEL'}`);
    });

    console.log(`\n👥 CORE TABLES (${coreTables.length}):`);
    coreTables.forEach((t, i) => {
      const hasModel = modelFiles.some(m => m.toLowerCase().includes(t.replace(/_/g, '')));
      console.log(`  ${(i + 1).toString().padStart(2)}. ${t.padEnd(35)} ${hasModel ? '✅ HAS MODEL' : '❌ NO MODEL'}`);
    });

    console.log(`\n📋 HR TABLES (${hrTables.length}):`);
    hrTables.forEach((t, i) => {
      const hasModel = modelFiles.some(m => m.toLowerCase().includes(t.replace(/_/g, '')));
      console.log(`  ${(i + 1).toString().padStart(2)}. ${t.padEnd(35)} ${hasModel ? '✅ HAS MODEL' : '❌ NO MODEL'}`);
    });

    console.log(`\n💼 RECRUITMENT TABLES (${recruitmentTables.length}):`);
    recruitmentTables.forEach((t, i) => {
      const hasModel = modelFiles.some(m => m.toLowerCase().includes(t.replace(/_/g, '')));
      console.log(`  ${(i + 1).toString().padStart(2)}. ${t.padEnd(35)} ${hasModel ? '✅ HAS MODEL' : '❌ NO MODEL'}`);
    });

    console.log(`\n📦 OTHER TABLES (${otherTables.length}):`);
    otherTables.forEach((t, i) => {
      const hasModel = modelFiles.some(m => m.toLowerCase().includes(t.replace(/_/g, '')));
      console.log(`  ${(i + 1).toString().padStart(2)}. ${t.padEnd(35)} ${hasModel ? '✅ HAS MODEL' : '❌ NO MODEL'}`);
    });

    console.log('\n\n📝 MODELS WITHOUT TABLES:');
    const modelsWithoutTables = modelFiles.filter(m => {
      const modelName = m.replace('.js', '');
      const expectedTable = modelTableMap[modelName];
      return !allTables.includes(expectedTable) && 
             !allTables.some(t => t.replace(/_/g, '') === modelName.toLowerCase());
    });
    if (modelsWithoutTables.length > 0) {
      modelsWithoutTables.forEach((m, i) => {
        console.log(`  ${(i + 1).toString().padStart(2)}. ${m}`);
      });
    } else {
      console.log('  ✅ All models have corresponding tables');
    }

    console.log('\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  analyzeTables();
}

module.exports = { analyzeTables };

