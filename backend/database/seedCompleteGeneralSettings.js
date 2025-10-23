/**
 * Seed Complete General Settings with Sample Data
 * Adds comprehensive sample data for all categories
 */

const sequelize = require('../config/database2');
const db = require('../config/database');
const PROFESSIONAL_TEMPLATES = require('./professionalTemplates');

const COMPLETE_SAMPLE_SETTINGS = [
  // ======== GENERAL ========
  { category: 'general', setting_key: 'app_name', setting_value: 'HRMS Go V5', type: 'text', description: 'Application Name' },
  { category: 'general', setting_key: 'app_tagline', setting_value: 'Modern HR Management System', type: 'text', description: 'Tagline' },
  { category: 'general', setting_key: 'logo', setting_value: '/logo/logo_full.svg', type: 'file', description: 'Logo' },
  { category: 'general', setting_key: 'favicon', setting_value: '/favicon/favicon.ico', type: 'file', description: 'Favicon' },
  { category: 'general', setting_key: 'default_timezone', setting_value: 'America/New_York', type: 'text', description: 'Default Timezone' },
  { category: 'general', setting_key: 'date_format', setting_value: 'MM/DD/YYYY', type: 'text', description: 'Date Format' },
  { category: 'general', setting_key: 'time_format', setting_value: '12', type: 'text', description: 'Time Format' },
  
  // ======== COMPANY INFO ========
  { category: 'company', setting_key: 'company_name', setting_value: 'HRMS Technologies Inc.', type: 'text', description: 'Company Name' },
  { category: 'company', setting_key: 'company_legal_name', setting_value: 'HRMS Technologies Incorporated', type: 'text', description: 'Legal Name' },
  { category: 'company', setting_key: 'company_email', setting_value: 'contact@hrms.com', type: 'text', description: 'Company Email' },
  { category: 'company', setting_key: 'company_phone', setting_value: '+1 (555) 123-4567', type: 'text', description: 'Phone Number' },
  { category: 'company', setting_key: 'company_address', setting_value: '123 Business Ave, Suite 100', type: 'text', description: 'Address' },
  { category: 'company', setting_key: 'company_city', setting_value: 'New York', type: 'text', description: 'City' },
  { category: 'company', setting_key: 'company_state', setting_value: 'NY', type: 'text', description: 'State' },
  { category: 'company', setting_key: 'company_country', setting_value: 'United States', type: 'text', description: 'Country' },
  { category: 'company', setting_key: 'company_postal_code', setting_value: '10001', type: 'text', description: 'Postal Code' },
  { category: 'company', setting_key: 'company_website', setting_value: 'https://www.hrmstech.com', type: 'text', description: 'Website' },
  { category: 'company', setting_key: 'company_tax_id', setting_value: '12-3456789', type: 'text', description: 'Tax ID' },
  { category: 'company', setting_key: 'company_registration_number', setting_value: 'REG-2024-001', type: 'text', description: 'Registration Number' },
  
  // ======== LOCALIZATION ========
  { category: 'localization', setting_key: 'default_language', setting_value: 'en', type: 'text', description: 'Default Language' },
  { category: 'localization', setting_key: 'default_currency', setting_value: 'USD', type: 'text', description: 'Default Currency' },
  { category: 'localization', setting_key: 'currency_symbol', setting_value: '$', type: 'text', description: 'Currency Symbol' },
  { category: 'localization', setting_key: 'currency_position', setting_value: 'before', type: 'text', description: 'Currency Position' },
  { category: 'localization', setting_key: 'thousand_separator', setting_value: ',', type: 'text', description: 'Thousand Separator' },
  { category: 'localization', setting_key: 'decimal_separator', setting_value: '.', type: 'text', description: 'Decimal Separator' },
  { category: 'localization', setting_key: 'number_of_decimals', setting_value: '2', type: 'number', description: 'Number of Decimals' },
  
  // ======== EMAIL CONFIG ========
  { category: 'email', setting_key: 'smtp_host', setting_value: 'smtp.gmail.com', type: 'text', description: 'SMTP Host' },
  { category: 'email', setting_key: 'smtp_port', setting_value: '587', type: 'number', description: 'SMTP Port' },
  { category: 'email', setting_key: 'smtp_username', setting_value: 'noreply@hrms.com', type: 'text', description: 'SMTP Username' },
  { category: 'email', setting_key: 'smtp_password', setting_value: '', type: 'text', description: 'SMTP Password' },
  { category: 'email', setting_key: 'smtp_encryption', setting_value: 'tls', type: 'text', description: 'Encryption' },
  { category: 'email', setting_key: 'mail_from_name', setting_value: 'HRMS Go System', type: 'text', description: 'From Name' },
  { category: 'email', setting_key: 'mail_from_address', setting_value: 'noreply@hrms.com', type: 'text', description: 'From Address' },
  
  // ======== NOTIFICATIONS ========
  { category: 'notifications', setting_key: 'enable_email_notifications', setting_value: 'true', type: 'boolean', description: 'Enable Email Notifications' },
  { category: 'notifications', setting_key: 'enable_browser_notifications', setting_value: 'true', type: 'boolean', description: 'Enable Browser Notifications' },
  { category: 'notifications', setting_key: 'notify_employee_leave', setting_value: 'true', type: 'boolean', description: 'Notify Leave Requests' },
  { category: 'notifications', setting_key: 'notify_employee_attendance', setting_value: 'true', type: 'boolean', description: 'Notify Attendance' },
  { category: 'notifications', setting_key: 'notify_payroll', setting_value: 'true', type: 'boolean', description: 'Notify Payroll' },
  { category: 'notifications', setting_key: 'notify_document_upload', setting_value: 'true', type: 'boolean', description: 'Notify Document Upload' },
  
  // ======== INTEGRATIONS ========
  { category: 'integrations', setting_key: 'slack_enabled', setting_value: 'false', type: 'boolean', description: 'Enable Slack' },
  { category: 'integrations', setting_key: 'slack_webhook_url', setting_value: '', type: 'text', description: 'Slack Webhook URL' },
  { category: 'integrations', setting_key: 'pusher_enabled', setting_value: 'false', type: 'boolean', description: 'Enable Pusher' },
  { category: 'integrations', setting_key: 'pusher_app_id', setting_value: '', type: 'text', description: 'Pusher App ID' },
  { category: 'integrations', setting_key: 'pusher_key', setting_value: '', type: 'text', description: 'Pusher Key' },
  { category: 'integrations', setting_key: 'pusher_secret', setting_value: '', type: 'text', description: 'Pusher Secret' },
  { category: 'integrations', setting_key: 'pusher_cluster', setting_value: 'us2', type: 'text', description: 'Pusher Cluster' },
  { category: 'integrations', setting_key: 'msteams_enabled', setting_value: 'false', type: 'boolean', description: 'Enable MS Teams' },
  { category: 'integrations', setting_key: 'msteams_webhook_url', setting_value: '', type: 'text', description: 'MS Teams Webhook' },
  { category: 'integrations', setting_key: 'zoom_enabled', setting_value: 'false', type: 'boolean', description: 'Enable Zoom' },
  { category: 'integrations', setting_key: 'zoom_api_key', setting_value: '', type: 'text', description: 'Zoom API Key' },
  
  // ======== SECURITY ========
  { category: 'security', setting_key: 'password_min_length', setting_value: '8', type: 'number', description: 'Minimum Password Length' },
  { category: 'security', setting_key: 'password_require_uppercase', setting_value: 'true', type: 'boolean', description: 'Require Uppercase' },
  { category: 'security', setting_key: 'password_require_lowercase', setting_value: 'true', type: 'boolean', description: 'Require Lowercase' },
  { category: 'security', setting_key: 'password_require_numbers', setting_value: 'true', type: 'boolean', description: 'Require Numbers' },
  { category: 'security', setting_key: 'password_require_special', setting_value: 'true', type: 'boolean', description: 'Require Special Characters' },
  { category: 'security', setting_key: 'password_expiry_days', setting_value: '90', type: 'number', description: 'Password Expiry (days)' },
  { category: 'security', setting_key: 'two_factor_auth', setting_value: 'false', type: 'boolean', description: 'Enable 2FA' },
  { category: 'security', setting_key: 'session_timeout', setting_value: '30', type: 'number', description: 'Session Timeout (minutes)' },
  { category: 'security', setting_key: 'max_login_attempts', setting_value: '5', type: 'number', description: 'Max Login Attempts' },
  
  // ======== BACKUP & STORAGE ========
  { category: 'backup', setting_key: 'auto_backup_enabled', setting_value: 'true', type: 'boolean', description: 'Enable Auto Backup' },
  { category: 'backup', setting_key: 'backup_frequency', setting_value: 'daily', type: 'text', description: 'Backup Frequency' },
  { category: 'backup', setting_key: 'backup_time', setting_value: '02:00', type: 'text', description: 'Backup Time' },
  { category: 'backup', setting_key: 'backup_retention_days', setting_value: '30', type: 'number', description: 'Retention Days' },
  { category: 'backup', setting_key: 'storage_type', setting_value: 'local', type: 'text', description: 'Storage Type' },
  { category: 'backup', setting_key: 's3_bucket', setting_value: '', type: 'text', description: 'S3 Bucket Name' },
  { category: 'backup', setting_key: 's3_region', setting_value: 'us-east-1', type: 'text', description: 'S3 Region' },
  
  // ======== API MANAGEMENT ========
  { category: 'api', setting_key: 'api_enabled', setting_value: 'true', type: 'boolean', description: 'Enable API' },
  { category: 'api', setting_key: 'api_rate_limit', setting_value: '1000', type: 'number', description: 'Rate Limit (per hour)' },
  { category: 'api', setting_key: 'api_version', setting_value: 'v1', type: 'text', description: 'API Version' },
  { category: 'api', setting_key: 'api_documentation_url', setting_value: '/api/docs', type: 'text', description: 'Documentation URL' },
  
  // ======== COOKIE CONSENT ========
  { category: 'cookies', setting_key: 'cookie_consent_enabled', setting_value: 'true', type: 'boolean', description: 'Enable Cookie Consent' },
  { category: 'cookies', setting_key: 'cookie_consent_message', setting_value: 'We use cookies to improve your experience on our site.', type: 'text', description: 'Consent Message' },
  { category: 'cookies', setting_key: 'cookie_consent_button_text', setting_value: 'Accept', type: 'text', description: 'Button Text' },
  { category: 'cookies', setting_key: 'cookie_consent_position', setting_value: 'bottom', type: 'text', description: 'Position' },
  
  // ======== OFFER LETTER ========
  { category: 'offer', setting_key: 'offer_letter_template', setting_value: PROFESSIONAL_TEMPLATES.offer_letter, type: 'text', description: 'Offer Letter Template' },
  { category: 'offer', setting_key: 'offer_letter_subject', setting_value: 'Job Offer - {designation} Position at {company_name}', type: 'text', description: 'Email Subject' },
  { category: 'offer', setting_key: 'offer_letter_auto_send', setting_value: 'false', type: 'boolean', description: 'Auto Send Offer Letters' },
  { category: 'offer', setting_key: 'offer_letter_validity_days', setting_value: '7', type: 'number', description: 'Validity (days)' },
  { category: 'offer', setting_key: 'offer_letter_footer', setting_value: 'This is a confidential offer. Please do not share without authorization.', type: 'text', description: 'Footer Text' },
  
  // ======== JOINING LETTER ========
  { category: 'joining', setting_key: 'joining_letter_template', setting_value: PROFESSIONAL_TEMPLATES.joining_letter, type: 'text', description: 'Joining Letter Template' },
  { category: 'joining', setting_key: 'joining_letter_subject', setting_value: 'Welcome to {company_name} - Joining Confirmation', type: 'text', description: 'Email Subject' },
  { category: 'joining', setting_key: 'joining_letter_auto_send', setting_value: 'true', type: 'boolean', description: 'Auto Send Joining Letters' },
  { category: 'joining', setting_key: 'joining_checklist_enabled', setting_value: 'true', type: 'boolean', description: 'Enable Joining Checklist' },
  
  // ======== EXPERIENCE CERTIFICATE ========
  { category: 'experience', setting_key: 'experience_cert_template', setting_value: PROFESSIONAL_TEMPLATES.experience_certificate, type: 'text', description: 'Experience Certificate Template' },
  { category: 'experience', setting_key: 'experience_cert_signatory', setting_value: 'HR Manager', type: 'text', description: 'Certificate Signatory' },
  { category: 'experience', setting_key: 'experience_cert_auto_generate', setting_value: 'false', type: 'boolean', description: 'Auto Generate on Exit' },
  
  // ======== NOC (No Objection Certificate) ========
  { category: 'noc', setting_key: 'noc_template', setting_value: PROFESSIONAL_TEMPLATES.noc, type: 'text', description: 'NOC Template' },
  { category: 'noc', setting_key: 'noc_approval_required', setting_value: 'true', type: 'boolean', description: 'Approval Required' },
  { category: 'noc', setting_key: 'noc_validity_days', setting_value: '180', type: 'number', description: 'NOC Validity (days)' },
  
  // ======== GOOGLE CALENDAR ========
  { category: 'google', setting_key: 'google_calendar_enabled', setting_value: 'false', type: 'boolean', description: 'Enable Google Calendar' },
  
  // ======== SEO ========
  { category: 'seo', setting_key: 'seo_title', setting_value: 'HRMS Go V5 - HR Management System', type: 'text', description: 'SEO Title' },
  { category: 'seo', setting_key: 'seo_description', setting_value: 'Complete HR Management solution for modern businesses', type: 'text', description: 'SEO Description' },
  
  // ======== CACHE ========
  { category: 'cache', setting_key: 'cache_enabled', setting_value: 'true', type: 'boolean', description: 'Enable Cache' },
  
  // ======== WEBHOOKS ========
  { category: 'webhook', setting_key: 'webhooks_enabled', setting_value: 'false', type: 'boolean', description: 'Enable Webhooks' },
  
  // ======== CHATGPT/AI ========
  { category: 'chatgpt', setting_key: 'ai_enabled', setting_value: 'false', type: 'boolean', description: 'Enable AI Features' },
  { category: 'chatgpt', setting_key: 'openai_api_key', setting_value: '', type: 'text', description: 'OpenAI API Key' },
  
  // ======== EXPORT/IMPORT ========
  { category: 'export', setting_key: 'export_max_rows', setting_value: '10000', type: 'number', description: 'Max Export Rows' },
];

async function seedCompleteSettings() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    📝 Seeding Complete General Settings                       ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check existing settings
    const [existingSettings] = await db.query('SELECT COUNT(*) as count FROM general_settings');
    console.log(`📊 Found ${existingSettings[0].count} existing settings\n`);

    // Clear existing settings (optional - comment out to keep existing)
    await db.query('DELETE FROM general_settings');
    console.log('🗑️  Cleared existing settings\n');

    let inserted = 0;
    let errors = 0;

    for (const setting of COMPLETE_SAMPLE_SETTINGS) {
      try {
        await db.query(
          `INSERT INTO general_settings 
           (category, setting_key, setting_value, type, description, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE 
           setting_value = VALUES(setting_value),
           updated_at = NOW()`,
          [setting.category, setting.setting_key, setting.setting_value, setting.type, setting.description]
        );
        console.log(`✅ ${setting.category.padEnd(15)} → ${setting.description}`);
        inserted++;
      } catch (error) {
        console.error(`❌ Error inserting ${setting.setting_key}:`, error.message);
        errors++;
      }
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║    ✅ Inserted ${inserted}/${COMPLETE_SAMPLE_SETTINGS.length} settings (${errors} errors)              ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝');
    
    // Show summary by category
    const [summary] = await db.query(`
      SELECT category, COUNT(*) as count 
      FROM general_settings 
      GROUP BY category 
      ORDER BY category
    `);
    
    console.log('\n📊 SETTINGS BY CATEGORY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    summary.forEach(row => {
      console.log(`  ${row.category.padEnd(15)} : ${row.count} settings`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedCompleteSettings();
}

module.exports = { seedCompleteSettings };

