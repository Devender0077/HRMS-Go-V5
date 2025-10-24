/**
 * Data Migration Script
 * Migrates data from general_settings to specialized tables
 */

const sequelize = require('../config/database2');
const db = require('../config/database');

// Import all models
const CompanyInformation = require('../models/CompanyInformation');
const EmailConfiguration = require('../models/EmailConfiguration');
const LocalizationSetting = require('../models/LocalizationSetting');
const NotificationSetting = require('../models/NotificationSetting');
const IntegrationSlack = require('../models/IntegrationSlack');
const IntegrationPusher = require('../models/IntegrationPusher');
const IntegrationTeams = require('../models/IntegrationTeams');
const IntegrationZoom = require('../models/IntegrationZoom');
const SecurityPolicy = require('../models/SecurityPolicy');
const BackupConfiguration = require('../models/BackupConfiguration');
const ApiConfiguration = require('../models/ApiConfiguration');
const DocumentTemplate = require('../models/DocumentTemplate');
const CookieConsent = require('../models/CookieConsent');
const SeoSetting = require('../models/SeoSetting');
const CacheSetting = require('../models/CacheSetting');
const WebhookConfiguration = require('../models/WebhookConfiguration');
const AiConfiguration = require('../models/AiConfiguration');
const GoogleCalendarIntegration = require('../models/GoogleCalendarIntegration');
const ExportSetting = require('../models/ExportSetting');

async function migrateData() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    🔄 Migrating Data to Specialized Tables                    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Fetch all settings from general_settings
    const [settings] = await db.query('SELECT * FROM general_settings WHERE status = "active"');
    console.log(`📊 Found ${settings.length} settings to migrate\n`);

    // Group settings by category
    const grouped = {};
    settings.forEach(setting => {
      const cat = setting.category;
      if (!grouped[cat]) grouped[cat] = {};
      grouped[cat][setting.setting_key] = setting.setting_value;
    });

    let migrated = 0;

    // 1. Migrate Company Information
    if (grouped.company) {
      console.log('📝 Migrating Company Information...');
      await CompanyInformation.destroy({ where: {} }); // Clear existing
      await CompanyInformation.create({
        companyName: grouped.company.company_name || 'HRMS Technologies Inc.',
        companyLegalName: grouped.company.company_legal_name || 'HRMS Technologies Incorporated',
        companyEmail: grouped.company.company_email || 'contact@hrms.com',
        companyPhone: grouped.company.company_phone || '+1 (555) 123-4567',
        companyAddress: grouped.company.company_address || '123 Business Ave',
        companyCity: grouped.company.company_city || 'New York',
        companyState: grouped.company.company_state || 'NY',
        companyCountry: grouped.company.company_country || 'United States',
        companyPostalCode: grouped.company.company_postal_code || '10001',
        companyWebsite: grouped.company.company_website || 'https://www.hrmstech.com',
        companyTaxId: grouped.company.company_tax_id || '12-3456789',
        companyRegistrationNumber: grouped.company.company_registration_number || 'REG-2024-001',
      });
      console.log('✅ Company Information migrated');
      migrated++;
    }

    // 2. Migrate Email Configuration
    if (grouped.email) {
      console.log('📝 Migrating Email Configuration...');
      await EmailConfiguration.destroy({ where: {} });
      await EmailConfiguration.create({
        smtpHost: grouped.email.smtp_host || 'smtp.gmail.com',
        smtpPort: parseInt(grouped.email.smtp_port) || 587,
        smtpUsername: grouped.email.smtp_username || 'noreply@hrms.com',
        smtpPassword: grouped.email.smtp_password || '',
        smtpEncryption: grouped.email.smtp_encryption || 'tls',
        mailFromName: grouped.email.mail_from_name || 'HRMS Go System',
        mailFromAddress: grouped.email.mail_from_address || 'noreply@hrms.com',
      });
      console.log('✅ Email Configuration migrated');
      migrated++;
    }

    // 3. Migrate Localization
    if (grouped.localization) {
      console.log('📝 Migrating Localization Settings...');
      await LocalizationSetting.destroy({ where: {} });
      await LocalizationSetting.create({
        defaultLanguage: grouped.localization.default_language || 'en',
        defaultCurrency: grouped.localization.default_currency || 'USD',
        currencySymbol: grouped.localization.currency_symbol || '$',
        currencyPosition: grouped.localization.currency_position || 'before',
        thousandsSeparator: grouped.localization.thousand_separator || ',',
        decimalSeparator: grouped.localization.decimal_separator || '.',
        numberOfDecimals: parseInt(grouped.localization.number_of_decimals) || 2,
      });
      console.log('✅ Localization Settings migrated');
      migrated++;
    }

    // 4. Migrate Notifications
    if (grouped.notifications) {
      console.log('📝 Migrating Notification Settings...');
      await NotificationSetting.destroy({ where: {} });
      await NotificationSetting.create({
        enableEmailNotifications: grouped.notifications.enable_email_notifications === 'true',
        enableBrowserNotifications: grouped.notifications.enable_browser_notifications === 'true',
        notifyEmployeeLeave: grouped.notifications.notify_employee_leave === 'true',
        notifyEmployeeAttendance: grouped.notifications.notify_employee_attendance === 'true',
        notifyPayroll: grouped.notifications.notify_payroll === 'true',
        notifyDocumentUpload: grouped.notifications.notify_document_upload === 'true',
      });
      console.log('✅ Notification Settings migrated');
      migrated++;
    }

    // 5. Migrate Slack Integration
    if (grouped.integrations) {
      console.log('📝 Migrating Slack Integration...');
      await IntegrationSlack.destroy({ where: {} });
      await IntegrationSlack.create({
        webhookUrl: grouped.integrations.slack_webhook_url || '',
        isEnabled: grouped.integrations.slack_enabled === 'true',
      });
      console.log('✅ Slack Integration migrated');
      migrated++;
    }

    // 6. Migrate Pusher Integration
    if (grouped.integrations) {
      console.log('📝 Migrating Pusher Integration...');
      await IntegrationPusher.destroy({ where: {} });
      await IntegrationPusher.create({
        appId: grouped.integrations.pusher_app_id || '',
        key: grouped.integrations.pusher_key || '',
        secret: grouped.integrations.pusher_secret || '',
        cluster: grouped.integrations.pusher_cluster || 'us2',
        isEnabled: grouped.integrations.pusher_enabled === 'true',
      });
      console.log('✅ Pusher Integration migrated');
      migrated++;
    }

    // 7. Migrate MS Teams Integration
    if (grouped.integrations) {
      console.log('📝 Migrating MS Teams Integration...');
      await IntegrationTeams.destroy({ where: {} });
      await IntegrationTeams.create({
        webhookUrl: grouped.integrations.msteams_webhook_url || '',
        isEnabled: grouped.integrations.msteams_enabled === 'true',
      });
      console.log('✅ MS Teams Integration migrated');
      migrated++;
    }

    // 8. Migrate Zoom Integration
    if (grouped.integrations) {
      console.log('📝 Migrating Zoom Integration...');
      await IntegrationZoom.destroy({ where: {} });
      await IntegrationZoom.create({
        apiKey: grouped.integrations.zoom_api_key || '',
        isEnabled: grouped.integrations.zoom_enabled === 'true',
      });
      console.log('✅ Zoom Integration migrated');
      migrated++;
    }

    // 9. Migrate Security Policy
    if (grouped.security) {
      console.log('📝 Migrating Security Policy...');
      await SecurityPolicy.destroy({ where: {} });
      await SecurityPolicy.create({
        passwordMinLength: parseInt(grouped.security.password_min_length) || 8,
        passwordRequireUppercase: grouped.security.password_require_uppercase === 'true',
        passwordRequireLowercase: grouped.security.password_require_lowercase === 'true',
        passwordRequireNumbers: grouped.security.password_require_numbers === 'true',
        passwordRequireSpecial: grouped.security.password_require_special === 'true',
        passwordExpiryDays: parseInt(grouped.security.password_expiry_days) || 90,
        twoFactorAuth: grouped.security.two_factor_auth === 'true',
        sessionTimeout: parseInt(grouped.security.session_timeout) || 30,
        maxLoginAttempts: parseInt(grouped.security.max_login_attempts) || 5,
      });
      console.log('✅ Security Policy migrated');
      migrated++;
    }

    // 10. Migrate Backup Configuration
    if (grouped.backup) {
      console.log('📝 Migrating Backup Configuration...');
      await BackupConfiguration.destroy({ where: {} });
      await BackupConfiguration.create({
        autoBackupEnabled: grouped.backup.auto_backup_enabled === 'true',
        backupFrequency: grouped.backup.backup_frequency || 'daily',
        backupTime: grouped.backup.backup_time || '02:00:00',
        backupRetentionDays: parseInt(grouped.backup.backup_retention_days) || 30,
        storageType: grouped.backup.storage_type || 'local',
        s3Bucket: grouped.backup.s3_bucket || '',
        s3Region: grouped.backup.s3_region || 'us-east-1',
      });
      console.log('✅ Backup Configuration migrated');
      migrated++;
    }

    // 11. Migrate API Configuration
    if (grouped.api) {
      console.log('📝 Migrating API Configuration...');
      await ApiConfiguration.destroy({ where: {} });
      await ApiConfiguration.create({
        apiEnabled: grouped.api.api_enabled === 'true',
        apiRateLimit: parseInt(grouped.api.api_rate_limit) || 1000,
        apiVersion: grouped.api.api_version || 'v1',
        apiDocumentationUrl: grouped.api.api_documentation_url || '/api/docs',
      });
      console.log('✅ API Configuration migrated');
      migrated++;
    }

    // 12. Migrate Document Templates
    if (grouped.offer || grouped.joining || grouped.experience || grouped.noc) {
      console.log('📝 Migrating Document Templates...');
      await DocumentTemplate.destroy({ where: {} });
      
      if (grouped.offer && grouped.offer.offer_letter_template) {
        await DocumentTemplate.create({
          templateName: 'Default Offer Letter',
          templateType: 'offer_letter',
          templateContent: grouped.offer.offer_letter_template,
          emailSubject: grouped.offer.offer_letter_subject || 'Job Offer',
          autoSend: grouped.offer.offer_letter_auto_send === 'true',
          validityDays: parseInt(grouped.offer.offer_letter_validity_days) || 7,
          footerText: grouped.offer.offer_letter_footer || '',
          isDefault: true,
          version: 1,
        });
      }

      if (grouped.joining && grouped.joining.joining_letter_template) {
        await DocumentTemplate.create({
          templateName: 'Default Joining Letter',
          templateType: 'joining_letter',
          templateContent: grouped.joining.joining_letter_template,
          emailSubject: grouped.joining.joining_letter_subject || 'Welcome',
          autoSend: grouped.joining.joining_letter_auto_send === 'true',
          isDefault: true,
          version: 1,
        });
      }

      if (grouped.experience && grouped.experience.experience_cert_template) {
        await DocumentTemplate.create({
          templateName: 'Default Experience Certificate',
          templateType: 'experience_certificate',
          templateContent: grouped.experience.experience_cert_template,
          isDefault: true,
          version: 1,
        });
      }

      if (grouped.noc && grouped.noc.noc_template) {
        await DocumentTemplate.create({
          templateName: 'Default NOC',
          templateType: 'noc',
          templateContent: grouped.noc.noc_template,
          validityDays: parseInt(grouped.noc.noc_validity_days) || 180,
          isDefault: true,
          version: 1,
        });
      }
      
      console.log('✅ Document Templates migrated');
      migrated++;
    }

    // 13. Migrate Cookie Consent
    if (grouped.cookies || grouped.cookie) {
      console.log('📝 Migrating Cookie Consent...');
      const cookieData = grouped.cookies || grouped.cookie;
      await CookieConsent.destroy({ where: {} });
      await CookieConsent.create({
        enabled: cookieData.cookie_consent_enabled === 'true',
        message: cookieData.cookie_consent_message || 'We use cookies.',
        buttonText: cookieData.cookie_consent_button_text || 'Accept',
        position: cookieData.cookie_consent_position || 'bottom',
      });
      console.log('✅ Cookie Consent migrated');
      migrated++;
    }

    // 14. Migrate SEO Settings
    if (grouped.seo) {
      console.log('📝 Migrating SEO Settings...');
      await SeoSetting.destroy({ where: {} });
      await SeoSetting.create({
        seoTitle: grouped.seo.seo_title || 'HRMS Go V5',
        seoDescription: grouped.seo.seo_description || 'HR Management System',
      });
      console.log('✅ SEO Settings migrated');
      migrated++;
    }

    // 15. Migrate Cache Settings
    if (grouped.cache) {
      console.log('📝 Migrating Cache Settings...');
      await CacheSetting.destroy({ where: {} });
      await CacheSetting.create({
        cacheEnabled: grouped.cache.cache_enabled === 'true',
      });
      console.log('✅ Cache Settings migrated');
      migrated++;
    }

    // 16. Migrate Webhook Configuration
    if (grouped.webhook) {
      console.log('📝 Migrating Webhook Configuration...');
      await WebhookConfiguration.destroy({ where: {} });
      await WebhookConfiguration.create({
        webhooksEnabled: grouped.webhook.webhooks_enabled === 'true',
      });
      console.log('✅ Webhook Configuration migrated');
      migrated++;
    }

    // 17. Migrate AI Configuration
    if (grouped.chatgpt) {
      console.log('📝 Migrating AI Configuration...');
      await AiConfiguration.destroy({ where: {} });
      await AiConfiguration.create({
        aiEnabled: grouped.chatgpt.ai_enabled === 'true',
        openaiApiKey: grouped.chatgpt.openai_api_key || '',
      });
      console.log('✅ AI Configuration migrated');
      migrated++;
    }

    // 18. Migrate Google Calendar
    if (grouped.google) {
      console.log('📝 Migrating Google Calendar Integration...');
      await GoogleCalendarIntegration.destroy({ where: {} });
      await GoogleCalendarIntegration.create({
        enabled: grouped.google.google_calendar_enabled === 'true',
      });
      console.log('✅ Google Calendar Integration migrated');
      migrated++;
    }

    // 19. Migrate Export Settings
    if (grouped.export) {
      console.log('📝 Migrating Export Settings...');
      await ExportSetting.destroy({ where: {} });
      await ExportSetting.create({
        exportMaxRows: parseInt(grouped.export.export_max_rows) || 10000,
      });
      console.log('✅ Export Settings migrated');
      migrated++;
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║    ✅ Migration Complete - ${migrated} Categories Migrated        ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝');

    console.log('\n📊 DATA MIGRATION SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ✅ company_information (1 row)');
    console.log('  ✅ email_configurations (1 row)');
    console.log('  ✅ localization_settings (1 row)');
    console.log('  ✅ notification_settings (1 row)');
    console.log('  ✅ integration_slack (1 row)');
    console.log('  ✅ integration_pusher (1 row)');
    console.log('  ✅ integration_teams (1 row)');
    console.log('  ✅ integration_zoom (1 row)');
    console.log('  ✅ security_policies (1 row)');
    console.log('  ✅ backup_configurations (1 row)');
    console.log('  ✅ api_configurations (1 row)');
    console.log('  ✅ document_templates (4 rows - offer, joining, exp, noc)');
    console.log('  ✅ cookie_consent (1 row)');
    console.log('  ✅ seo_settings (1 row)');
    console.log('  ✅ cache_settings (1 row)');
    console.log('  ✅ webhook_configurations (1 row)');
    console.log('  ✅ ai_configurations (1 row)');
    console.log('  ✅ google_calendar_integrations (1 row)');
    console.log('  ✅ export_settings (1 row)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n  Total: ~${migrated + 3} rows across ${migrated} specialized tables\n`);

    console.log('⚠️  IMPORTANT: general_settings table is still intact');
    console.log('   You can keep it for simple settings (app_name, logo, etc.)');
    console.log('   or delete it if you\'ve migrated everything.\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrateData();
}

module.exports = { migrateData };

