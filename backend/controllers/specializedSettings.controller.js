/**
 * Specialized Settings Controller
 * Returns counts and data from specialized settings tables
 */

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
const WorkflowSetting = require('../models/WorkflowSetting');
const ReportSetting = require('../models/ReportSetting');
const GeneralSetting = require('../models/GeneralSetting');

/**
 * Convert camelCase to snake_case
 */
function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Field mappings to match frontend expectations
 * Maps backend field names to frontend expected names
 */
const FIELD_MAPPINGS = {
  // Email category
  'mail_from_name': 'email_from_name',
  'mail_from_address': 'email_from_address',
  
  // Integrations - Slack
  'slack_is_enabled': 'slack_enabled',
  'slack_is_active': 'slack_enabled',
  
  // Integrations - Pusher
  'pusher_app_key': 'pusher_key',
  'pusher_app_secret': 'pusher_secret',
  'pusher_app_cluster': 'pusher_cluster',
  'pusher_is_enabled': 'pusher_enabled',
  'pusher_is_active': 'pusher_enabled',
  
  // Integrations - MS Teams
  'msteams_is_enabled': 'msteams_enabled',
  'msteams_is_active': 'msteams_enabled',
  
  // Integrations - Zoom
  'zoom_is_enabled': 'zoom_enabled',
  'zoom_is_active': 'zoom_enabled',
  
  // Backup
  'backup_frequency': 'backup_frequency',
  'backup_retention_days': 'backup_retention_days',
  'backup_location': 'storage_provider', // Map to frontend expected name
  'storage_type': 'storage_provider',
  
  // API
  'api_enabled': 'api_enabled',
  'rate_limit': 'api_rate_limit',
  'api_version': 'api_version',
  
  // Google Calendar
  'is_active': 'google_calendar_enabled',
  'sync_enabled': 'google_calendar_enabled',
  
  // SEO
  'meta_title': 'seo_title',
  'meta_description': 'seo_description',
  
  // Cache
  'cache_enabled': 'cache_enabled',
  
  // Webhook
  'webhook_enabled': 'webhooks_enabled',
  
  // Cookie
  'enabled': 'cookie_consent_enabled',
  'message': 'cookie_consent_message',
  'button_text': 'cookie_consent_button_text',
  'position': 'cookie_consent_position',
  
  // ChatGPT/AI
  'ai_enabled': 'chatgpt_enabled',
  'api_key': 'chatgpt_api_key',
  'model': 'chatgpt_model',
  
  // Export
  'default_format': 'export_default_format',
  'max_export_rows': 'export_max_rows',
};

/**
 * Frontend expected fields for each category
 * Only these fields will be counted as "configured"
 */
const FRONTEND_FIELDS = {
  general: ['app_name', 'app_version', 'app_url', 'app_logo', 'app_favicon', 'app_logo_dark', 'app_small_logo', 'admin_email', 'support_email', 'timezone', 'date_format', 'time_format'],
  company: ['company_name', 'company_email', 'company_phone', 'company_address', 'company_website'],
  localization: ['default_language', 'default_currency', 'currency_symbol', 'currency_position', 'thousands_separator', 'decimal_separator', 'number_of_decimals'],
  email: ['email_from_name', 'email_from_address', 'smtp_host', 'smtp_port', 'smtp_encryption', 'smtp_username', 'smtp_password'],
  notifications: ['enable_email_notifications', 'enable_browser_notifications', 'notify_employee_leave', 'notify_employee_attendance', 'notify_payroll', 'notify_document_upload'],
  integrations: ['slack_enabled', 'slack_webhook_url', 'pusher_enabled', 'pusher_app_id', 'pusher_key', 'pusher_secret', 'pusher_cluster', 'msteams_enabled', 'msteams_webhook_url', 'zoom_enabled', 'zoom_api_key'],
  security: ['session_timeout', 'password_min_length', 'password_require_uppercase', 'password_require_number', 'password_require_special', 'max_login_attempts', 'account_lockout_duration', 'two_factor_auth'],
  backup: ['backup_enabled', 'backup_frequency', 'backup_time', 'backup_retention_days', 'storage_provider'],
  api: ['api_enabled', 'api_rate_limit', 'api_version'],
  workflow: ['leave_auto_approve', 'attendance_auto_checkout'],
  reports: ['default_report_format', 'report_watermark', 'report_logo_enabled'],
  offer: ['offer_letter_template', 'offer_letter_subject', 'offer_letter_auto_send', 'offer_letter_validity_days', 'offer_letter_footer'],
  joining: ['joining_letter_template', 'joining_letter_subject', 'joining_letter_auto_send', 'joining_checklist_enabled'],
  experience: ['experience_cert_template', 'experience_cert_signatory', 'experience_cert_auto_generate'],
  noc: ['noc_template', 'noc_approval_required', 'noc_validity_days'],
  google: ['google_calendar_enabled'],
  seo: ['seo_title', 'seo_description'],
  cache: ['cache_enabled'],
  webhook: ['webhooks_enabled'],
  cookie: ['cookie_consent_enabled', 'cookie_consent_message', 'cookie_consent_button_text', 'cookie_consent_position'],
  chatgpt: ['chatgpt_enabled', 'chatgpt_api_key', 'chatgpt_model'],
  export: ['export_default_format', 'export_max_rows'],
};

/**
 * Convert object keys from camelCase to snake_case and apply field mappings
 */
function convertKeysToSnakeCase(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const converted = {};
  Object.keys(obj).forEach(key => {
    let snakeKey = toSnakeCase(key);
    
    // Apply field mapping if exists
    if (FIELD_MAPPINGS[snakeKey]) {
      snakeKey = FIELD_MAPPINGS[snakeKey];
    }
    
    converted[snakeKey] = obj[key];
  });
  
  return converted;
}

/**
 * Count configured fields based on frontend expectations
 * Only counts fields that:
 * 1. Are defined in FRONTEND_FIELDS for this category
 * 2. Have non-empty values
 * 
 * @param {Object} record - The database record
 * @param {string} category - The category name (to lookup expected fields)
 * @returns {number} Count of configured fields
 */
function countConfiguredFields(record, category) {
  if (!record) return 0;
  
  const data = record.toJSON ? record.toJSON() : record;
  const snakeData = convertKeysToSnakeCase(data);
  
  // Get expected fields for this category
  const expectedFields = FRONTEND_FIELDS[category];
  
  // If no expected fields defined (like templates), count all non-empty, non-system fields
  if (!expectedFields) {
    const excludeFields = ['id', 'created_at', 'updated_at', 'status'];
    let count = 0;
    Object.keys(snakeData).forEach(key => {
      const value = snakeData[key];
      if (excludeFields.includes(key)) return;
      if (value === null || value === undefined) return;
      if (typeof value === 'string' && value.trim() === '') return;
      count++;
    });
    return count;
  }
  
  // Count only expected fields that have values
  let count = 0;
  expectedFields.forEach(field => {
    const value = snakeData[field];
    
    // Skip if null or undefined
    if (value === null || value === undefined) return;
    
    // Skip if empty string
    if (typeof value === 'string' && value.trim() === '') return;
    
    // For boolean fields: Only count if true (enabled)
    // This makes the count reflect "active/enabled" settings rather than just "configured"
    if (typeof value === 'boolean') {
      if (value === true) {
        count++;
      }
      return;
    }
    
    // For number fields: Count even if 0 (0 is a valid configuration)
    // For other types: Count if has value
    count++;
  });
  
  return count;
}

/**
 * Get all settings with category counts from specialized tables
 */
exports.getAllSpecialized = async (req, res) => {
  try {
    const categoryCounts = {};
    const settings = {};
    
    // General (from general_settings table)
    const generalSettings = await GeneralSetting.findAll({
      where: { category: 'general', status: 'active' }
    });
    // Only count settings with non-empty values
    let generalConfiguredCount = 0;
    settings.general = {};
    generalSettings.forEach(s => {
      settings.general[s.settingKey] = s.settingValue;
      if (s.settingValue && s.settingValue.trim() !== '') {
        generalConfiguredCount++;
      }
    });
    categoryCounts.general = generalConfiguredCount;

    // Company
    const company = await CompanyInformation.findOne();
    categoryCounts.company = company ? countConfiguredFields(company, 'company') : 0;
    settings.company = company ? convertKeysToSnakeCase(company.toJSON()) : {};

    // Localization
    const localization = await LocalizationSetting.findOne();
    categoryCounts.localization = localization ? countConfiguredFields(localization, 'localization') : 0;
    settings.localization = localization ? convertKeysToSnakeCase(localization.toJSON()) : {};

    // Email
    const email = await EmailConfiguration.findOne();
    categoryCounts.email = email ? countConfiguredFields(email, 'email') : 0;
    settings.email = email ? convertKeysToSnakeCase(email.toJSON()) : {};

    // Notifications
    const notifications = await NotificationSetting.findOne();
    categoryCounts.notifications = notifications ? countConfiguredFields(notifications, 'notifications') : 0;
    settings.notifications = notifications ? convertKeysToSnakeCase(notifications.toJSON()) : {};

    // Integrations (4 integrations combined - count all together)
    const slack = await IntegrationSlack.findOne();
    const pusher = await IntegrationPusher.findOne();
    const teams = await IntegrationTeams.findOne();
    const zoom = await IntegrationZoom.findOne();
    
    // Helper function to prefix integration fields
    const prefixKeys = (obj, prefix) => {
      if (!obj) return {};
      const result = {};
      Object.keys(obj).forEach(key => {
        result[`${prefix}_${key}`] = obj[key];
      });
      return result;
    };
    
    // Combine all integrations with prefixed field names
    const combinedIntegrations = {
      ...prefixKeys(convertKeysToSnakeCase(slack?.toJSON() || {}), 'slack'),
      ...prefixKeys(convertKeysToSnakeCase(pusher?.toJSON() || {}), 'pusher'),
      ...prefixKeys(convertKeysToSnakeCase(teams?.toJSON() || {}), 'msteams'),
      ...prefixKeys(convertKeysToSnakeCase(zoom?.toJSON() || {}), 'zoom'),
    };
    
    categoryCounts.integrations = countConfiguredFields({ toJSON: () => combinedIntegrations }, 'integrations');
    
    // Flatten integrations for frontend (frontend expects flat structure)
    const slackData = slack ? convertKeysToSnakeCase(slack.toJSON()) : {};
    const pusherData = pusher ? convertKeysToSnakeCase(pusher.toJSON()) : {};
    const teamsData = teams ? convertKeysToSnakeCase(teams.toJSON()) : {};
    const zoomData = zoom ? convertKeysToSnakeCase(zoom.toJSON()) : {};
    
    console.log('🔍 GET Integration - Pusher raw data:', pusher ? pusher.toJSON() : 'null');
    console.log('🔍 GET Integration - Pusher converted:', pusherData);
    
    settings.integrations = {
      // Slack fields
      slack_enabled: slackData.is_enabled || false,
      slack_webhook_url: slackData.webhook_url || '',
      slack_workspace_name: slackData.workspace_name || '',
      slack_default_channel: slackData.default_channel || '',
      
      // Pusher fields
      pusher_enabled: pusherData.is_enabled || false,
      pusher_app_id: pusherData.app_id || '',
      pusher_key: pusherData.key || '',
      pusher_secret: pusherData.secret || '',
      pusher_cluster: pusherData.cluster || '',
      
      // MS Teams fields
      msteams_enabled: teamsData.is_enabled || false,
      msteams_webhook_url: teamsData.webhook_url || '',
      msteams_tenant_id: teamsData.tenant_id || '',
      msteams_channel_id: teamsData.channel_id || '',
      
      // Zoom fields
      zoom_enabled: zoomData.is_enabled || false,
      zoom_api_key: zoomData.api_key || '',
      zoom_api_secret: zoomData.api_secret || '',
      zoom_account_id: zoomData.account_id || '',
    };
    
    console.log('🔍 GET Integration - Final settings.integrations:', settings.integrations);

    // Security
    const security = await SecurityPolicy.findOne();
    const securityConverted = security ? {
      session_timeout: security.sessionTimeout || '',
      password_min_length: security.passwordMinLength || '',
      password_require_uppercase: security.passwordRequireUppercase || false,
      password_require_number: security.passwordRequireNumbers || false,
      password_require_special: security.passwordRequireSpecial || false,
      max_login_attempts: security.maxLoginAttempts || '',
      account_lockout_duration: security.lockoutDuration || '',
      two_factor_auth: security.twoFactorAuth || false,
      ...convertKeysToSnakeCase(security.toJSON())
    } : {};
    categoryCounts.security = security ? countConfiguredFields({ toJSON: () => securityConverted }, 'security') : 0;
    settings.security = securityConverted;

    // Backup
    const backup = await BackupConfiguration.findOne();
    const backupConverted = backup ? {
      backup_enabled: backup.backupEnabled || false,
      backup_frequency: backup.backupFrequency || '',
      backup_time: backup.backupTime || '',
      backup_retention_days: backup.backupRetentionDays || '',
      storage_provider: backup.storageType || '',
      ...convertKeysToSnakeCase(backup.toJSON())
    } : {};
    categoryCounts.backup = backup ? countConfiguredFields({ toJSON: () => backupConverted }, 'backup') : 0;
    settings.backup = backupConverted;

    // API
    const api = await ApiConfiguration.findOne();
    const apiConverted = api ? {
      api_enabled: api.apiEnabled || false,
      api_rate_limit: api.rateLimit || '',
      api_version: api.apiVersion || '',
      ...convertKeysToSnakeCase(api.toJSON())
    } : {};
    categoryCounts.api = api ? countConfiguredFields({ toJSON: () => apiConverted }, 'api') : 0;
    settings.api = apiConverted;

    // Document Templates
    const offerTemplate = await DocumentTemplate.findOne({ where: { templateType: 'offer_letter' } });
    const joiningTemplate = await DocumentTemplate.findOne({ where: { templateType: 'joining_letter' } });
    const experienceTemplate = await DocumentTemplate.findOne({ where: { templateType: 'experience_certificate' } });
    const nocTemplate = await DocumentTemplate.findOne({ where: { templateType: 'noc' } });

    // Helper function to convert template data to frontend format
    const convertTemplateToFrontend = (template, prefix) => {
      if (!template) return {};
      const data = template.toJSON();
      return {
        [`${prefix}_template`]: data.templateContent || '',
        [`${prefix}_subject`]: data.emailSubject || '',
        [`${prefix}_auto_send`]: data.autoSend || false,
        [`${prefix}_validity_days`]: data.validityDays || '',
        [`${prefix}_footer`]: data.footerText || '',
        // Additional fields
        [`${prefix}_enabled`]: data.isActive || false,
        [`${prefix}_version`]: data.version || '1.0',
      };
    };

    categoryCounts.offer = offerTemplate ? countConfiguredFields({ toJSON: () => convertTemplateToFrontend(offerTemplate, 'offer_letter') }, 'offer') : 0;
    categoryCounts.joining = joiningTemplate ? countConfiguredFields({ toJSON: () => convertTemplateToFrontend(joiningTemplate, 'joining_letter') }, 'joining') : 0;
    categoryCounts.experience = experienceTemplate ? countConfiguredFields({ toJSON: () => convertTemplateToFrontend(experienceTemplate, 'experience_cert') }, 'experience') : 0;
    categoryCounts.noc = nocTemplate ? countConfiguredFields({ toJSON: () => convertTemplateToFrontend(nocTemplate, 'noc') }, 'noc') : 0;

    settings.offer = offerTemplate ? convertTemplateToFrontend(offerTemplate, 'offer_letter') : {};
    settings.joining = joiningTemplate ? convertTemplateToFrontend(joiningTemplate, 'joining_letter') : {};
    settings.experience = experienceTemplate ? convertTemplateToFrontend(experienceTemplate, 'experience_cert') : {};
    settings.noc = nocTemplate ? convertTemplateToFrontend(nocTemplate, 'noc') : {};

    // Google Calendar
    const google = await GoogleCalendarIntegration.findOne();
    const googleConverted = google ? {
      google_calendar_enabled: google.isActive || google.syncEnabled || false,
      ...convertKeysToSnakeCase(google.toJSON())
    } : {};
    categoryCounts.google = google ? countConfiguredFields({ toJSON: () => googleConverted }, 'google') : 0;
    settings.google = googleConverted;

    // SEO
    const seo = await SeoSetting.findOne();
    const seoConverted = seo ? {
      seo_title: seo.metaTitle || '',
      seo_description: seo.metaDescription || '',
      ...convertKeysToSnakeCase(seo.toJSON())
    } : {};
    categoryCounts.seo = seo ? countConfiguredFields({ toJSON: () => seoConverted }, 'seo') : 0;
    settings.seo = seoConverted;

    // Cache
    const cache = await CacheSetting.findOne();
    const cacheConverted = cache ? {
      cache_enabled: cache.cacheEnabled || false,
      ...convertKeysToSnakeCase(cache.toJSON())
    } : {};
    categoryCounts.cache = cache ? countConfiguredFields({ toJSON: () => cacheConverted }, 'cache') : 0;
    settings.cache = cacheConverted;

    // Webhook
    const webhook = await WebhookConfiguration.findOne();
    const webhookConverted = webhook ? {
      webhooks_enabled: webhook.webhookEnabled || false,
      ...convertKeysToSnakeCase(webhook.toJSON())
    } : {};
    categoryCounts.webhook = webhook ? countConfiguredFields({ toJSON: () => webhookConverted }, 'webhook') : 0;
    settings.webhook = webhookConverted;

    // Cookie
    const cookie = await CookieConsent.findOne();
    const cookieConverted = cookie ? {
      cookie_consent_enabled: cookie.enabled || false,
      cookie_consent_message: cookie.message || '',
      cookie_consent_button_text: cookie.buttonText || '',
      cookie_consent_position: cookie.position || '',
      ...convertKeysToSnakeCase(cookie.toJSON())
    } : {};
    categoryCounts.cookie = cookie ? countConfiguredFields({ toJSON: () => cookieConverted }, 'cookie') : 0;
    settings.cookie = cookieConverted;

    // ChatGPT/AI
    const chatgpt = await AiConfiguration.findOne();
    const chatgptConverted = chatgpt ? {
      chatgpt_enabled: chatgpt.aiEnabled || false,
      chatgpt_api_key: chatgpt.apiKey || '',
      chatgpt_model: chatgpt.model || '',
      ...convertKeysToSnakeCase(chatgpt.toJSON())
    } : {};
    categoryCounts.chatgpt = chatgpt ? countConfiguredFields({ toJSON: () => chatgptConverted }, 'chatgpt') : 0;
    settings.chatgpt = chatgptConverted;

    // Export
    const exportSetting = await ExportSetting.findOne();
    const exportConverted = exportSetting ? {
      export_default_format: exportSetting.defaultFormat || '',
      export_max_rows: exportSetting.maxExportRows || '',
      ...convertKeysToSnakeCase(exportSetting.toJSON())
    } : {};
    categoryCounts.export = exportSetting ? countConfiguredFields({ toJSON: () => exportConverted }, 'export') : 0;
    settings.export = exportConverted;

    // Workflow
    const workflow = await WorkflowSetting.findOne();
    const workflowConverted = workflow ? {
      leave_auto_approve: workflow.leaveAutoApproval || false,
      attendance_auto_checkout: workflow.attendanceAutoApproval || false,
      ...convertKeysToSnakeCase(workflow.toJSON())
    } : {};
    categoryCounts.workflow = workflow ? countConfiguredFields({ toJSON: () => workflowConverted }, 'workflow') : 0;
    settings.workflow = workflowConverted;

    // Reports
    const reports = await ReportSetting.findOne();
    const reportsConverted = reports ? {
      default_report_format: reports.defaultReportFormat || '',
      report_watermark: reports.pdfWatermark || '',
      report_logo_enabled: reports.pdfIncludeLogo || false,
      ...convertKeysToSnakeCase(reports.toJSON())
    } : {};
    categoryCounts.reports = reports ? countConfiguredFields({ toJSON: () => reportsConverted }, 'reports') : 0;
    settings.reports = reportsConverted;

    // Calculate totals
    const totalConfigured = Object.values(categoryCounts).filter(c => c > 0).length;
    const totalSettings = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

    res.json({
      success: true,
      settings,
      categoryCounts,
      total: totalSettings,
      configured: totalConfigured,
      categories: Object.keys(settings).length,
    });
  } catch (error) {
    console.error('Get specialized settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching specialized settings',
      error: error.message,
    });
  }
};

/**
 * Get settings by category from specialized table
 */
exports.getByCategorySpecialized = async (req, res) => {
  try {
    const { category } = req.params;
    let data = null;
    let count = 0;

    switch (category) {
      case 'general':
        const generalSettings = await GeneralSetting.findAll({
          where: { category: 'general', status: 'active' }
        });
        data = {};
        let configuredCount = 0;
        generalSettings.forEach(s => {
          data[s.settingKey] = s.settingValue;
          if (s.settingValue && s.settingValue.trim() !== '') {
            configuredCount++;
          }
        });
        count = configuredCount;
        break;

      case 'company':
        data = await CompanyInformation.findOne();
        count = data ? countConfiguredFields(data, 'company') : 0;
        break;

      case 'localization':
        data = await LocalizationSetting.findOne();
        count = data ? countConfiguredFields(data, 'localization') : 0;
        break;

      case 'email':
        data = await EmailConfiguration.findOne();
        count = data ? countConfiguredFields(data, 'email') : 0;
        break;

      case 'notifications':
        data = await NotificationSetting.findOne();
        count = data ? countConfiguredFields(data, 'notifications') : 0;
        break;

      case 'integrations':
        const slack = await IntegrationSlack.findOne();
        const pusher = await IntegrationPusher.findOne();
        const teams = await IntegrationTeams.findOne();
        const zoom = await IntegrationZoom.findOne();
        data = { slack, pusher, teams, zoom };
        
        // Helper to prefix keys
        const prefixKeys2 = (obj, prefix) => {
          if (!obj) return {};
          const result = {};
          Object.keys(obj).forEach(key => {
            result[`${prefix}_${key}`] = obj[key];
          });
          return result;
        };
        
        // Count integrations based on frontend fields with prefixes
        const combinedInt = {
          ...prefixKeys2(convertKeysToSnakeCase(slack?.toJSON() || {}), 'slack'),
          ...prefixKeys2(convertKeysToSnakeCase(pusher?.toJSON() || {}), 'pusher'),
          ...prefixKeys2(convertKeysToSnakeCase(teams?.toJSON() || {}), 'msteams'),
          ...prefixKeys2(convertKeysToSnakeCase(zoom?.toJSON() || {}), 'zoom'),
        };
        count = countConfiguredFields({ toJSON: () => combinedInt }, 'integrations');
        break;

      case 'attendance':
        // Attendance settings are stored in general_settings table
        const db = require('../config/database');
        const [attendanceSettings] = await db.query(
          "SELECT setting_key, setting_value FROM general_settings WHERE category = 'attendance'"
        );
        data = {};
        attendanceSettings.forEach(setting => {
          data[setting.setting_key] = setting.setting_value;
        });
        count = attendanceSettings.filter(s => s.setting_value && s.setting_value !== '').length;
        break;

      case 'security':
        const secData = await SecurityPolicy.findOne();
        data = secData ? {
          session_timeout: secData.sessionTimeout || '',
          password_min_length: secData.passwordMinLength || '',
          password_require_uppercase: secData.passwordRequireUppercase || false,
          password_require_number: secData.passwordRequireNumbers || false,
          password_require_special: secData.passwordRequireSpecial || false,
          max_login_attempts: secData.maxLoginAttempts || '',
          account_lockout_duration: secData.lockoutDuration || '',
          two_factor_auth: secData.twoFactorAuth || false,
          ...convertKeysToSnakeCase(secData.toJSON())
        } : {};
        count = secData ? countConfiguredFields({ toJSON: () => data }, 'security') : 0;
        break;

      case 'backup':
        const backData = await BackupConfiguration.findOne();
        data = backData ? {
          backup_enabled: backData.backupEnabled || false,
          backup_frequency: backData.backupFrequency || '',
          backup_time: backData.backupTime || '',
          backup_retention_days: backData.backupRetentionDays || '',
          storage_provider: backData.storageType || '',
          ...convertKeysToSnakeCase(backData.toJSON())
        } : {};
        count = backData ? countConfiguredFields({ toJSON: () => data }, 'backup') : 0;
        break;

      case 'api':
        const apiData = await ApiConfiguration.findOne();
        data = apiData ? {
          api_enabled: apiData.apiEnabled || false,
          api_rate_limit: apiData.rateLimit || '',
          api_version: apiData.apiVersion || '',
          ...convertKeysToSnakeCase(apiData.toJSON())
        } : {};
        count = apiData ? countConfiguredFields({ toJSON: () => data }, 'api') : 0;
        break;

      case 'offer':
      case 'joining':
      case 'experience':
      case 'noc':
        const typeMap = {
          offer: 'offer_letter',
          joining: 'joining_letter',
          experience: 'experience_certificate',
          noc: 'noc',
        };
        const prefixMap = {
          offer: 'offer_letter',
          joining: 'joining_letter',
          experience: 'experience_cert',
          noc: 'noc',
        };
        
        // Helper to convert template
        const convertTemplateToFrontend2 = (template, prefix) => {
          if (!template) return {};
          const tdata = template.toJSON();
          return {
            [`${prefix}_template`]: tdata.templateContent || '',
            [`${prefix}_subject`]: tdata.emailSubject || '',
            [`${prefix}_auto_send`]: tdata.autoSend || false,
            [`${prefix}_validity_days`]: tdata.validityDays || '',
            [`${prefix}_footer`]: tdata.footerText || '',
            [`${prefix}_enabled`]: tdata.isActive || false,
            [`${prefix}_version`]: tdata.version || '1.0',
            // For experience cert
            [`${prefix}_signatory`]: tdata.signatoryName || '',
            [`${prefix}_auto_generate`]: tdata.autoGenerate || false,
            // For NOC
            [`${prefix}_approval_required`]: tdata.approvalRequired || false,
            // For joining
            [`${prefix}_checklist_enabled`]: tdata.checklistEnabled || false,
          };
        };
        
        const templateData = await DocumentTemplate.findOne({ where: { templateType: typeMap[category] } });
        const frontendData = convertTemplateToFrontend2(templateData, prefixMap[category]);
        data = frontendData;
        count = countConfiguredFields({ toJSON: () => frontendData }, category);
        break;

      case 'google':
        const googleData = await GoogleCalendarIntegration.findOne();
        data = googleData ? {
          google_calendar_enabled: googleData.isActive || googleData.syncEnabled || false,
          ...convertKeysToSnakeCase(googleData.toJSON())
        } : {};
        count = data ? countConfiguredFields({ toJSON: () => data }, 'google') : 0;
        break;

      case 'seo':
        const seoData = await SeoSetting.findOne();
        data = seoData ? {
          seo_title: seoData.metaTitle || '',
          seo_description: seoData.metaDescription || '',
          ...convertKeysToSnakeCase(seoData.toJSON())
        } : {};
        count = data ? countConfiguredFields({ toJSON: () => data }, 'seo') : 0;
        break;

      case 'cache':
        const cacheData = await CacheSetting.findOne();
        data = cacheData ? {
          cache_enabled: cacheData.cacheEnabled || false,
          ...convertKeysToSnakeCase(cacheData.toJSON())
        } : {};
        count = data ? countConfiguredFields({ toJSON: () => data }, 'cache') : 0;
        break;

      case 'webhook':
        const webhookData = await WebhookConfiguration.findOne();
        data = webhookData ? {
          webhooks_enabled: webhookData.webhookEnabled || false,
          ...convertKeysToSnakeCase(webhookData.toJSON())
        } : {};
        count = data ? countConfiguredFields({ toJSON: () => data }, 'webhook') : 0;
        break;

      case 'cookie':
        const cookieData = await CookieConsent.findOne();
        data = cookieData ? {
          cookie_consent_enabled: cookieData.enabled || false,
          cookie_consent_message: cookieData.message || '',
          cookie_consent_button_text: cookieData.buttonText || '',
          cookie_consent_position: cookieData.position || '',
          ...convertKeysToSnakeCase(cookieData.toJSON())
        } : {};
        count = data ? countConfiguredFields({ toJSON: () => data }, 'cookie') : 0;
        break;

      case 'chatgpt':
        const aiData = await AiConfiguration.findOne();
        data = aiData ? {
          chatgpt_enabled: aiData.aiEnabled || false,
          chatgpt_api_key: aiData.apiKey || '',
          chatgpt_model: aiData.model || '',
          ...convertKeysToSnakeCase(aiData.toJSON())
        } : {};
        count = data ? countConfiguredFields({ toJSON: () => data }, 'chatgpt') : 0;
        break;

      case 'export':
        const exportData = await ExportSetting.findOne();
        data = exportData ? {
          export_default_format: exportData.defaultFormat || '',
          export_max_rows: exportData.maxExportRows || '',
          ...convertKeysToSnakeCase(exportData.toJSON())
        } : {};
        count = data ? countConfiguredFields({ toJSON: () => data }, 'export') : 0;
        break;

      case 'workflow':
        const workData = await WorkflowSetting.findOne();
        data = workData ? {
          leave_auto_approve: workData.leaveAutoApproval || false,
          attendance_auto_checkout: workData.attendanceAutoApproval || false,
          ...convertKeysToSnakeCase(workData.toJSON())
        } : {};
        count = workData ? countConfiguredFields({ toJSON: () => data }, 'workflow') : 0;
        break;

      case 'reports':
        const repData = await ReportSetting.findOne();
        data = repData ? {
          default_report_format: repData.defaultReportFormat || '',
          report_watermark: repData.pdfWatermark || '',
          report_logo_enabled: repData.pdfIncludeLogo || false,
          ...convertKeysToSnakeCase(repData.toJSON())
        } : {};
        count = repData ? countConfiguredFields({ toJSON: () => data }, 'reports') : 0;
        break;

      default:
        return res.status(404).json({
          success: false,
          message: 'Category not found or not yet implemented',
        });
    }

    // Convert to snake_case before returning
    let responseData = data;
    if (data && typeof data === 'object') {
      if (data.toJSON) {
        responseData = convertKeysToSnakeCase(data.toJSON());
      } else if (category === 'integrations' && data.slack) {
        // Special handling for integrations - FLATTEN for frontend
        const slackData = data.slack ? convertKeysToSnakeCase(data.slack.toJSON ? data.slack.toJSON() : data.slack) : {};
        const pusherData = data.pusher ? convertKeysToSnakeCase(data.pusher.toJSON ? data.pusher.toJSON() : data.pusher) : {};
        const teamsData = data.teams ? convertKeysToSnakeCase(data.teams.toJSON ? data.teams.toJSON() : data.teams) : {};
        const zoomData = data.zoom ? convertKeysToSnakeCase(data.zoom.toJSON ? data.zoom.toJSON() : data.zoom) : {};
        
        // Flatten to match frontend expectations
        responseData = {
          // Slack fields
          slack_enabled: slackData.is_enabled || false,
          slack_webhook_url: slackData.webhook_url || '',
          slack_workspace_name: slackData.workspace_name || '',
          slack_default_channel: slackData.default_channel || '',
          
          // Pusher fields
          pusher_enabled: pusherData.is_enabled || false,
          pusher_app_id: pusherData.app_id || '',
          pusher_key: pusherData.key || '',
          pusher_secret: pusherData.secret || '',
          pusher_cluster: pusherData.cluster || '',
          
          // MS Teams fields
          msteams_enabled: teamsData.is_enabled || false,
          msteams_webhook_url: teamsData.webhook_url || '',
          msteams_tenant_id: teamsData.tenant_id || '',
          msteams_channel_id: teamsData.channel_id || '',
          
          // Zoom fields
          zoom_enabled: zoomData.is_enabled || false,
          zoom_api_key: zoomData.api_key || '',
          zoom_api_secret: zoomData.api_secret || '',
          zoom_account_id: zoomData.account_id || '',
        };
        
        console.log('🔍 Flattened integration data for frontend:', responseData);
      } else {
        responseData = data; // Already converted (like general settings)
      }
    }

    res.json({
      success: true,
      category,
      settings: responseData || {},
      count,
    });
  } catch (error) {
    console.error('Get category specialized settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category settings',
      error: error.message,
    });
  }
};

module.exports = exports;

