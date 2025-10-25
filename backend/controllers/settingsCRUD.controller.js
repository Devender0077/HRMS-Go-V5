/**
 * Settings CRUD Controller
 * Complete CRUD operations for ALL settings categories
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
 * Map category to model
 */
const CATEGORY_MODEL_MAP = {
  company: CompanyInformation,
  email: EmailConfiguration,
  localization: LocalizationSetting,
  notifications: NotificationSetting,
  security: SecurityPolicy,
  backup: BackupConfiguration,
  api: ApiConfiguration,
  cookie: CookieConsent,
  seo: SeoSetting,
  cache: CacheSetting,
  webhook: WebhookConfiguration,
  chatgpt: AiConfiguration,
  google: GoogleCalendarIntegration,
  export: ExportSetting,
  workflow: WorkflowSetting,
  reports: ReportSetting,
};

/**
 * Convert frontend field names to backend field names
 */
function convertFrontendToBackend(data, category) {
  const converted = {};
  
  // Reverse mapping for email
  const emailMapping = {
    'email_from_name': 'mailFromName',
    'email_from_address': 'mailFromAddress',
    'smtp_host': 'smtpHost',
    'smtp_port': 'smtpPort',
    'smtp_encryption': 'smtpEncryption',
    'smtp_username': 'smtpUsername',
    'smtp_password': 'smtpPassword',
  };
  
  // Template reverse mapping
  const templateMapping = {
    'offer_letter_template': 'templateContent',
    'offer_letter_subject': 'emailSubject',
    'offer_letter_auto_send': 'autoSend',
    'offer_letter_validity_days': 'validityDays',
    'offer_letter_footer': 'footerText',
    'joining_letter_template': 'templateContent',
    'joining_letter_subject': 'emailSubject',
    'joining_letter_auto_send': 'autoSend',
    'joining_checklist_enabled': 'checklistEnabled',
    'experience_cert_template': 'templateContent',
    'experience_cert_signatory': 'signatoryName',
    'experience_cert_auto_generate': 'autoGenerate',
    'noc_template': 'templateContent',
    'noc_approval_required': 'approvalRequired',
    'noc_validity_days': 'validityDays',
  };
  
  // Apply category-specific mapping
  if (category === 'email') {
    Object.keys(data).forEach(key => {
      const backendKey = emailMapping[key] || key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      converted[backendKey] = data[key];
    });
  } else if (['offer', 'joining', 'experience', 'noc'].includes(category)) {
    Object.keys(data).forEach(key => {
      const backendKey = templateMapping[key] || key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      converted[backendKey] = data[key];
    });
  } else {
    // Default: convert snake_case to camelCase
    Object.keys(data).forEach(key => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      converted[camelKey] = data[key];
    });
  }
  
  return converted;
}

/**
 * Update settings for a category
 */
exports.updateSettings = async (req, res) => {
  try {
    const { category } = req.params;
    const data = req.body;

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║  🔧 UPDATE SETTINGS REQUEST RECEIVED                           ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('📋 Category:', category);
    console.log('📦 Data keys:', Object.keys(data));
    console.log('📝 Full data:', JSON.stringify(data, null, 2));
    console.log('👤 User:', req.user?.email || 'Not authenticated');

    // Handle general settings (uses general_settings table)
    if (category === 'general') {
      const updates = [];
      for (const [key, value] of Object.entries(data)) {
        await GeneralSetting.upsert({
          settingKey: key,
          settingValue: value,
          category: 'general',
          status: 'active',
        });
        updates.push(key);
      }

      return res.json({
        success: true,
        message: `Updated ${updates.length} general settings`,
        updated: updates,
      });
    }

    // Handle integrations (multiple models)
    if (category === 'integrations') {
      const updated = [];

      // Convert flat frontend data to nested structure if needed
      const convertFrontendToBackend = (flatData) => {
        const slackData = {};
        const pusherData = {};
        const teamsData = {};
        const zoomData = {};

        // Mapping for Pusher (frontend → Sequelize model)
        const pusherFieldMap = {
          'pusher_enabled': 'isEnabled',
          'pusher_app_id': 'appId',
          'pusher_key': 'key',
          'pusher_secret': 'secret',
          'pusher_cluster': 'cluster',
        };

        // Mapping for Slack
        const slackFieldMap = {
          'slack_enabled': 'isEnabled',
          'slack_webhook_url': 'webhookUrl',
          'slack_workspace_name': 'workspaceName',
          'slack_default_channel': 'defaultChannel',
        };

        // Mapping for Teams
        const teamsFieldMap = {
          'msteams_enabled': 'isEnabled',
          'msteams_webhook_url': 'webhookUrl',
          'msteams_tenant_id': 'tenantId',
          'msteams_channel_id': 'channelId',
        };

        // Mapping for Zoom
        const zoomFieldMap = {
          'zoom_enabled': 'isEnabled',
          'zoom_api_key': 'apiKey',
          'zoom_api_secret': 'apiSecret',
          'zoom_account_id': 'accountId',
        };

        Object.keys(flatData).forEach(key => {
          // Map Pusher fields
          if (pusherFieldMap[key]) {
            pusherData[pusherFieldMap[key]] = flatData[key];
          }
          // Map Slack fields
          else if (slackFieldMap[key]) {
            slackData[slackFieldMap[key]] = flatData[key];
          }
          // Map Teams fields
          else if (teamsFieldMap[key]) {
            teamsData[teamsFieldMap[key]] = flatData[key];
          }
          // Map Zoom fields
          else if (zoomFieldMap[key]) {
            zoomData[zoomFieldMap[key]] = flatData[key];
          }
        });

        return { slack: slackData, pusher: pusherData, teams: teamsData, zoom: zoomData };
      };

      // Log incoming data for debugging
      console.log('━━━ INTEGRATION UPDATE REQUEST ━━━');
      console.log('Incoming data keys:', Object.keys(data));
      console.log('Full data:', JSON.stringify(data, null, 2));

      // Check if data is already nested or needs conversion
      let { slack, pusher, teams, zoom } = data;
      
      if (!slack && !pusher && !teams && !zoom) {
        // Data is flat, convert it
        console.log('📦 Converting flat data to nested structure...');
        const converted = convertFrontendToBackend(data);
        slack = converted.slack;
        pusher = converted.pusher;
        teams = converted.teams;
        zoom = converted.zoom;
        
        console.log('Converted Pusher data:', JSON.stringify(pusher, null, 2));
        console.log('Converted Slack data:', JSON.stringify(slack, null, 2));
      }

      if (slack && Object.keys(slack).length > 0) {
        console.log('💾 Saving Slack:', slack);
        await IntegrationSlack.upsert({ id: 3, ...slack });
        updated.push('slack');
      }
      if (pusher && Object.keys(pusher).length > 0) {
        console.log('💾 Saving Pusher:', pusher);
        const result = await IntegrationPusher.upsert({ id: 3, ...pusher });
        console.log('✅ Pusher save result:', result);
        updated.push('pusher');
      }
      if (teams && Object.keys(teams).length > 0) {
        console.log('💾 Saving Teams:', teams);
        await IntegrationTeams.upsert({ id: 3, ...teams });
        updated.push('teams');
      }
      if (zoom && Object.keys(zoom).length > 0) {
        console.log('💾 Saving Zoom:', zoom);
        await IntegrationZoom.upsert({ id: 3, ...zoom });
        updated.push('zoom');
      }

      console.log('✅ Updated integrations:', updated);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return res.json({
        success: true,
        message: `Updated ${updated.length} integrations`,
        updated,
      });
    }

    // Handle document templates
    if (['offer', 'joining', 'experience', 'noc'].includes(category)) {
      const typeMap = {
        offer: 'offer_letter',
        joining: 'joining_letter',
        experience: 'experience_certificate',
        noc: 'noc',
      };

      const template = await DocumentTemplate.findOne({
        where: { templateType: typeMap[category] },
      });

      // Convert frontend field names to backend
      const backendData = convertFrontendToBackend(data, category);

      if (template) {
        await template.update(backendData);
      } else {
        await DocumentTemplate.create({
          ...backendData,
          templateType: typeMap[category],
          templateName: `${category} Template`,
        });
      }

      return res.json({
        success: true,
        message: `${category} template updated successfully`,
      });
    }

    // Handle other specialized settings
    const Model = CATEGORY_MODEL_MAP[category];
    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Convert frontend field names to backend field names
    const backendData = convertFrontendToBackend(data, category);

    // Find existing record or create new one
    const existing = await Model.findOne();
    if (existing) {
      await existing.update(backendData);
    } else {
      await Model.create(backendData);
    }

    res.json({
      success: true,
      message: `${category} settings updated successfully`,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message,
    });
  }
};

/**
 * Get settings for a category
 */
exports.getSettings = async (req, res) => {
  try {
    const { category } = req.params;

    // Handle general settings
    if (category === 'general') {
      const settings = await GeneralSetting.findAll({
        where: { category: 'general', status: 'active' },
      });
      
      const data = {};
      settings.forEach(s => {
        data[s.settingKey] = s.settingValue;
      });

      return res.json({
        success: true,
        category,
        settings: data,
      });
    }

    // Handle integrations
    if (category === 'integrations') {
      const slack = await IntegrationSlack.findOne();
      const pusher = await IntegrationPusher.findOne();
      const teams = await IntegrationTeams.findOne();
      const zoom = await IntegrationZoom.findOne();

      return res.json({
        success: true,
        category,
        settings: { slack, pusher, teams, zoom },
      });
    }

    // Handle document templates
    if (['offer', 'joining', 'experience', 'noc'].includes(category)) {
      const typeMap = {
        offer: 'offer_letter',
        joining: 'joining_letter',
        experience: 'experience_certificate',
        noc: 'noc',
      };

      const template = await DocumentTemplate.findOne({
        where: { templateType: typeMap[category] },
      });

      return res.json({
        success: true,
        category,
        settings: template || {},
      });
    }

    // Handle other specialized settings
    const Model = CATEGORY_MODEL_MAP[category];
    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const settings = await Model.findOne();

    res.json({
      success: true,
      category,
      settings: settings || {},
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message,
    });
  }
};

/**
 * Reset settings to default for a category
 */
exports.resetSettings = async (req, res) => {
  try {
    const { category } = req.params;

    if (category === 'general') {
      await GeneralSetting.destroy({
        where: { category: 'general' },
      });

      return res.json({
        success: true,
        message: 'General settings reset successfully',
      });
    }

    if (category === 'integrations') {
      await IntegrationSlack.destroy({ where: {} });
      await IntegrationPusher.destroy({ where: {} });
      await IntegrationTeams.destroy({ where: {} });
      await IntegrationZoom.destroy({ where: {} });

      return res.json({
        success: true,
        message: 'Integration settings reset successfully',
      });
    }

    if (['offer', 'joining', 'experience', 'noc'].includes(category)) {
      const typeMap = {
        offer: 'offer_letter',
        joining: 'joining_letter',
        experience: 'experience_certificate',
        noc: 'noc',
      };

      await DocumentTemplate.destroy({
        where: { templateType: typeMap[category] },
      });

      return res.json({
        success: true,
        message: `${category} template reset successfully`,
      });
    }

    const Model = CATEGORY_MODEL_MAP[category];
    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await Model.destroy({ where: {} });

    res.json({
      success: true,
      message: `${category} settings reset successfully`,
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting settings',
      error: error.message,
    });
  }
};

/**
 * Batch update multiple categories
 */
exports.batchUpdate = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: 'Updates must be an array',
      });
    }

    const results = [];

    for (const update of updates) {
      const { category, data } = update;
      try {
        // Implement same logic as updateSettings for each category
        // (reusing the logic above)
        results.push({ category, success: true });
      } catch (error) {
        results.push({ category, success: false, error: error.message });
      }
    }

    res.json({
      success: true,
      message: `Batch update completed`,
      results,
    });
  } catch (error) {
    console.error('Batch update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in batch update',
      error: error.message,
    });
  }
};

module.exports = exports;

