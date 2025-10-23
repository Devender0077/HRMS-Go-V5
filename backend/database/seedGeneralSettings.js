const GeneralSetting = require('../models/GeneralSetting');
const sequelize = require('../config/database2');

const seedData = [
  // General Settings
  { settingKey: 'app_name', settingValue: 'HRMS Go V5', category: 'general', description: 'Application Name', type: 'text', isPublic: true },
  { settingKey: 'app_version', settingValue: '5.0.0', category: 'general', description: 'Application Version', type: 'text', isPublic: true },
  { settingKey: 'app_url', settingValue: 'http://localhost:3000', category: 'general', description: 'Application URL', type: 'text', isPublic: false },
  { settingKey: 'app_logo', settingValue: '', category: 'general', description: 'Application Logo Path', type: 'image', isPublic: true },
  { settingKey: 'app_favicon', settingValue: '', category: 'general', description: 'Application Favicon Path', type: 'image', isPublic: true },
  { settingKey: 'app_logo_dark', settingValue: '', category: 'general', description: 'Dark Theme Logo Path', type: 'image', isPublic: true },
  { settingKey: 'app_small_logo', settingValue: '', category: 'general', description: 'Small Logo for Mobile', type: 'image', isPublic: true },
  { settingKey: 'admin_email', settingValue: 'admin@hrmsgo.com', category: 'general', description: 'Admin Email Address', type: 'text', isPublic: false },
  { settingKey: 'support_email', settingValue: 'support@hrmsgo.com', category: 'general', description: 'Support Email Address', type: 'text', isPublic: true },
  { settingKey: 'timezone', settingValue: 'America/New_York', category: 'general', description: 'Default Timezone', type: 'text', isPublic: true },
  { settingKey: 'date_format', settingValue: 'MM/DD/YYYY', category: 'general', description: 'Date Format', type: 'text', isPublic: true },
  { settingKey: 'time_format', settingValue: '12', category: 'general', description: 'Time Format (12 or 24 hour)', type: 'text', isPublic: true },
  
  // Company Info
  { settingKey: 'company_name', settingValue: 'HRMS Go Inc.', category: 'company', description: 'Company Name', type: 'text', isPublic: true },
  { settingKey: 'company_email', settingValue: 'info@hrmsgo.com', category: 'company', description: 'Company Email', type: 'text', isPublic: true },
  { settingKey: 'company_phone', settingValue: '+1 (555) 123-4567', category: 'company', description: 'Company Phone', type: 'text', isPublic: true },
  { settingKey: 'company_address', settingValue: '123 Business Street, Suite 100', category: 'company', description: 'Company Address', type: 'text', isPublic: true },
  { settingKey: 'company_website', settingValue: 'https://www.hrmsgo.com', category: 'company', description: 'Company Website', type: 'text', isPublic: true },
  
  // Localization
  { settingKey: 'default_language', settingValue: 'en', category: 'localization', description: 'Default Language', type: 'text', isPublic: true },
  { settingKey: 'default_currency', settingValue: 'USD', category: 'localization', description: 'Default Currency', type: 'text', isPublic: true },
  { settingKey: 'currency_symbol', settingValue: '$', category: 'localization', description: 'Currency Symbol', type: 'text', isPublic: true },
  { settingKey: 'currency_position', settingValue: 'before', category: 'localization', description: 'Currency Position', type: 'text', isPublic: true },
  { settingKey: 'thousands_separator', settingValue: ',', category: 'localization', description: 'Thousands Separator', type: 'text', isPublic: true },
  { settingKey: 'decimal_separator', settingValue: '.', category: 'localization', description: 'Decimal Separator', type: 'text', isPublic: true },
  { settingKey: 'number_of_decimals', settingValue: '2', category: 'localization', description: 'Number of Decimals', type: 'number', isPublic: true },
  
  // Email Configuration
  { settingKey: 'email_from_name', settingValue: 'HRMS Go', category: 'email', description: 'Email From Name', type: 'text', isPublic: false },
  { settingKey: 'email_from_address', settingValue: 'noreply@hrmsgo.com', category: 'email', description: 'Email From Address', type: 'text', isPublic: false },
  { settingKey: 'smtp_host', settingValue: 'smtp.gmail.com', category: 'email', description: 'SMTP Host', type: 'text', isPublic: false },
  { settingKey: 'smtp_port', settingValue: '587', category: 'email', description: 'SMTP Port', type: 'number', isPublic: false },
  { settingKey: 'smtp_encryption', settingValue: 'tls', category: 'email', description: 'SMTP Encryption', type: 'text', isPublic: false },
  
  // Notifications
  { settingKey: 'notify_new_employee', settingValue: 'true', category: 'notifications', description: 'Notify on New Employee', type: 'boolean', isPublic: false },
  { settingKey: 'notify_leave_request', settingValue: 'true', category: 'notifications', description: 'Notify on Leave Request', type: 'boolean', isPublic: false },
  { settingKey: 'notify_leave_approval', settingValue: 'true', category: 'notifications', description: 'Notify on Leave Approval', type: 'boolean', isPublic: false },
  { settingKey: 'notify_birthday', settingValue: 'true', category: 'notifications', description: 'Send Birthday Wishes', type: 'boolean', isPublic: false },
  { settingKey: 'notify_anniversary', settingValue: 'true', category: 'notifications', description: 'Send Anniversary Wishes', type: 'boolean', isPublic: false },
  { settingKey: 'document_expiry_days', settingValue: '30', category: 'notifications', description: 'Document Expiry Alert Days', type: 'number', isPublic: false },
  
  // Security
  { settingKey: 'session_timeout', settingValue: '60', category: 'security', description: 'Session Timeout (minutes)', type: 'number', isPublic: false },
  { settingKey: 'password_min_length', settingValue: '8', category: 'security', description: 'Minimum Password Length', type: 'number', isPublic: false },
  { settingKey: 'password_require_uppercase', settingValue: 'true', category: 'security', description: 'Require Uppercase Letters', type: 'boolean', isPublic: false },
  { settingKey: 'password_require_number', settingValue: 'true', category: 'security', description: 'Require Numbers', type: 'boolean', isPublic: false },
  { settingKey: 'password_require_special', settingValue: 'true', category: 'security', description: 'Require Special Characters', type: 'boolean', isPublic: false },
  { settingKey: 'max_login_attempts', settingValue: '5', category: 'security', description: 'Max Login Attempts', type: 'number', isPublic: false },
  { settingKey: 'account_lockout_duration', settingValue: '30', category: 'security', description: 'Account Lockout Duration (minutes)', type: 'number', isPublic: false },
  { settingKey: 'two_factor_auth', settingValue: 'false', category: 'security', description: 'Two-Factor Authentication', type: 'boolean', isPublic: false },
  
  // Workflow
  { settingKey: 'leave_auto_approve', settingValue: 'false', category: 'workflow', description: 'Auto-approve Leaves', type: 'boolean', isPublic: false },
  { settingKey: 'attendance_auto_checkout', settingValue: 'true', category: 'workflow', description: 'Auto Checkout Employees', type: 'boolean', isPublic: false },
  { settingKey: 'document_verification_required', settingValue: 'true', category: 'workflow', description: 'Require Document Verification', type: 'boolean', isPublic: false },
  { settingKey: 'leave_approval_chain', settingValue: 'manager', category: 'workflow', description: 'Leave Approval Chain', type: 'text', isPublic: false },
  
  // Backup & Storage
  { settingKey: 'backup_enabled', settingValue: 'true', category: 'backup', description: 'Enable Automatic Backups', type: 'boolean', isPublic: false },
  { settingKey: 'backup_frequency', settingValue: 'daily', category: 'backup', description: 'Backup Frequency', type: 'text', isPublic: false },
  { settingKey: 'backup_time', settingValue: '02:00', category: 'backup', description: 'Backup Time', type: 'text', isPublic: false },
  { settingKey: 'backup_retention_days', settingValue: '30', category: 'backup', description: 'Backup Retention Days', type: 'number', isPublic: false },
  { settingKey: 'storage_provider', settingValue: 'local', category: 'backup', description: 'Storage Provider', type: 'text', isPublic: false },
  
  // Reports
  { settingKey: 'default_report_format', settingValue: 'pdf', category: 'reports', description: 'Default Report Format', type: 'text', isPublic: false },
  { settingKey: 'report_watermark', settingValue: 'CONFIDENTIAL', category: 'reports', description: 'Report Watermark', type: 'text', isPublic: false },
  { settingKey: 'report_logo_enabled', settingValue: 'true', category: 'reports', description: 'Include Logo in Reports', type: 'boolean', isPublic: false },
  
  // Integrations - Slack
  { settingKey: 'slack_enabled', settingValue: 'false', category: 'integrations', description: 'Enable Slack Integration', type: 'boolean', isPublic: false },
  { settingKey: 'slack_webhook', settingValue: '', category: 'integrations', description: 'Slack Webhook URL', type: 'text', isPublic: false },
  
  // Integrations - Pusher
  { settingKey: 'pusher_enabled', settingValue: 'false', category: 'integrations', description: 'Enable Pusher', type: 'boolean', isPublic: false },
  { settingKey: 'pusher_app_id', settingValue: '', category: 'integrations', description: 'Pusher App ID', type: 'text', isPublic: false },
  { settingKey: 'pusher_key', settingValue: '', category: 'integrations', description: 'Pusher Key', type: 'text', isPublic: false },
  { settingKey: 'pusher_secret', settingValue: '', category: 'integrations', description: 'Pusher Secret', type: 'text', isPublic: false },
  { settingKey: 'pusher_cluster', settingValue: 'us2', category: 'integrations', description: 'Pusher Cluster', type: 'text', isPublic: false },
  
  // Integrations - Microsoft Teams
  { settingKey: 'teams_enabled', settingValue: 'false', category: 'integrations', description: 'Enable Microsoft Teams', type: 'boolean', isPublic: false },
  { settingKey: 'teams_webhook', settingValue: '', category: 'integrations', description: 'Microsoft Teams Webhook URL', type: 'text', isPublic: false },
  
  // Integrations - Zoom
  { settingKey: 'zoom_enabled', settingValue: 'false', category: 'integrations', description: 'Enable Zoom Integration', type: 'boolean', isPublic: false },
  { settingKey: 'zoom_api_key', settingValue: '', category: 'integrations', description: 'Zoom API Key', type: 'text', isPublic: false },
  
  // API Management
  { settingKey: 'api_enabled', settingValue: 'true', category: 'api', description: 'Enable API Access', type: 'boolean', isPublic: false },
  { settingKey: 'api_rate_limit', settingValue: '1000', category: 'api', description: 'API Rate Limit (requests/hour)', type: 'number', isPublic: false },
  { settingKey: 'api_version', settingValue: 'v1', category: 'api', description: 'API Version', type: 'text', isPublic: true },
  
  // Google Calendar
  { settingKey: 'google_calendar_enabled', settingValue: 'false', category: 'google', description: 'Enable Google Calendar Sync', type: 'boolean', isPublic: false },
  
  // SEO
  { settingKey: 'seo_title', settingValue: 'HRMS Go V5 - Complete HR Management System', category: 'seo', description: 'SEO Title', type: 'text', isPublic: true },
  { settingKey: 'seo_description', settingValue: 'Comprehensive HR Management System for modern businesses', category: 'seo', description: 'SEO Description', type: 'text', isPublic: true },
  
  // Cache
  { settingKey: 'cache_enabled', settingValue: 'true', category: 'cache', description: 'Enable Caching', type: 'boolean', isPublic: false },
  
  // Webhooks
  { settingKey: 'webhooks_enabled', settingValue: 'false', category: 'webhook', description: 'Enable Webhooks', type: 'boolean', isPublic: false },
  
  // Cookie Consent
  { settingKey: 'cookie_consent_enabled', settingValue: 'true', category: 'cookie', description: 'Enable Cookie Consent', type: 'boolean', isPublic: true },
  
  // ChatGPT/AI
  { settingKey: 'ai_enabled', settingValue: 'false', category: 'chatgpt', description: 'Enable AI Features', type: 'boolean', isPublic: false },
  { settingKey: 'openai_api_key', settingValue: '', category: 'chatgpt', description: 'OpenAI API Key', type: 'text', isPublic: false },
  
  // Offer Letter
  { settingKey: 'offer_letter_auto_send', settingValue: 'false', category: 'offer', description: 'Auto Send Offer Letters', type: 'boolean', isPublic: false },
  { settingKey: 'offer_letter_validity_days', settingValue: '15', category: 'offer', description: 'Offer Letter Validity (days)', type: 'number', isPublic: false },
  
  // Joining Letter
  { settingKey: 'joining_letter_auto_send', settingValue: 'true', category: 'joining', description: 'Auto Send Joining Letters', type: 'boolean', isPublic: false },
  
  // Experience Certificate
  { settingKey: 'experience_cert_signatory', settingValue: 'HR Manager', category: 'experience', description: 'Certificate Signatory', type: 'text', isPublic: false },
  
  // NOC
  { settingKey: 'noc_approval_required', settingValue: 'true', category: 'noc', description: 'NOC Approval Required', type: 'boolean', isPublic: false },
  
  // Export/Import
  { settingKey: 'export_max_rows', settingValue: '10000', category: 'export', description: 'Max Export Rows', type: 'number', isPublic: false },
];

async function seedGeneralSettings() {
  try {
    console.log('🌱 Seeding general settings...');
    
    // Sync the model
    await GeneralSetting.sync({ force: true });
    console.log('✅ GeneralSetting table created/synced');
    
    // Insert seed data
    await GeneralSetting.bulkCreate(seedData);
    console.log(`✅ Inserted ${seedData.length} general settings`);
    
    console.log('🎉 General settings seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding general settings:', error);
    process.exit(1);
  }
}

// Export for use in setup scripts
module.exports = {
  seedGeneralSettings,
};

// Run if executed directly
if (require.main === module) {
  seedGeneralSettings();
}

