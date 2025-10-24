/**
 * Seed ALL Specialized Tables Using Sequelize Models
 * Ensures field names are correct and data is properly inserted
 */

const sequelize = require('../config/database2');
const PROFESSIONAL_TEMPLATES = require('./professionalTemplates');

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
const WorkflowSetting = require('../models/WorkflowSetting');
const ReportSetting = require('../models/ReportSetting');

async function seedAllModels() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    🌱 Seeding ALL Tables Using Sequelize Models               ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    let seededCount = 0;

    // 1. Company Information
    console.log('1️⃣  Seeding CompanyInformation...');
    await CompanyInformation.upsert({
      companyName: 'TechCorp Solutions Inc',
      companyLegalName: 'TechCorp Solutions Incorporated',
      companyEmail: 'contact@techcorp.com',
      companyPhone: '+1-555-0100',
      companyWebsite: 'https://techcorp.com',
      companyAddress: '123 Innovation Drive, Suite 500',
      companyCity: 'San Francisco',
      companyState: 'California',
      companyPostalCode: '94102',
      companyCountry: 'United States',
      companyTaxId: '12-3456789',
      companyRegistrationNumber: 'REG123456',
      status: 'active',
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 2. Email Configuration
    console.log('2️⃣  Seeding EmailConfiguration...');
    await EmailConfiguration.upsert({
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'noreply@techcorp.com',
      smtpPassword: 'encrypted_password_here',
      smtpEncryption: 'tls',
      mailFromName: 'TechCorp HRMS',
      mailFromAddress: 'noreply@techcorp.com',
      isActive: true,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 3. Localization Settings
    console.log('3️⃣  Seeding LocalizationSetting...');
    await LocalizationSetting.upsert({
      defaultLanguage: 'en',
      defaultTimezone: 'America/Los_Angeles',
      defaultCurrency: 'USD',
      currencySymbol: '$',
      currencyPosition: 'before',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12',
      weekStart: 'monday',
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 4. Notification Settings
    console.log('4️⃣  Seeding NotificationSetting...');
    await NotificationSetting.upsert({
      enableEmailNotifications: true,
      enableBrowserNotifications: true,
      notifyEmployeeLeave: true,
      notifyEmployeeAttendance: true,
      notifyPayroll: true,
      notifyDocumentUpload: true,
      status: 'active',
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 5. Slack Integration
    console.log('5️⃣  Seeding IntegrationSlack...');
    await IntegrationSlack.upsert({
      webhookUrl: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL',
      botToken: 'xoxb-your-bot-token',
      defaultChannel: '#general',
      notifyOnLeave: true,
      notifyOnAttendance: true,
      notifyOnAnnouncements: true,
      isActive: true,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 6. Pusher Integration
    console.log('6️⃣  Seeding IntegrationPusher...');
    await IntegrationPusher.upsert({
      appId: '123456',
      appKey: 'your-app-key',
      appSecret: 'your-app-secret',
      appCluster: 'us2',
      encrypted: true,
      isActive: true,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 7. MS Teams Integration
    console.log('7️⃣  Seeding IntegrationTeams...');
    await IntegrationTeams.upsert({
      webhookUrl: 'https://outlook.office.com/webhook/YOUR-WEBHOOK-URL',
      notifyOnLeave: true,
      notifyOnAttendance: true,
      isActive: true,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 8. Zoom Integration
    console.log('8️⃣  Seeding IntegrationZoom...');
    await IntegrationZoom.upsert({
      apiKey: 'your-zoom-api-key',
      apiSecret: 'your-zoom-api-secret',
      accountId: 'your-account-id',
      autoCreateMeetings: true,
      defaultMeetingDuration: 60,
      isActive: true,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 9. Security Policies
    console.log('9️⃣  Seeding SecurityPolicy...');
    await SecurityPolicy.upsert({
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSpecial: true,
      passwordExpiryDays: 90,
      twoFactorAuth: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      status: 'active',
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 10. Backup Configuration
    console.log('🔟 Seeding BackupConfiguration...');
    await BackupConfiguration.upsert({
      backupEnabled: true,
      backupFrequency: 'daily',
      backupTime: '02:00:00',
      backupRetentionDays: 30,
      backupLocation: '/backups',
      storageType: 'local',
      compressBackups: true,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 11. API Configuration
    console.log('1️⃣1️⃣ Seeding ApiConfiguration...');
    await ApiConfiguration.upsert({
      apiEnabled: true,
      apiVersion: 'v1',
      rateLimit: 1000,
      rateLimitWindow: 60,
      requireApiKey: true,
      enableCors: true,
      allowedOrigins: '*',
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 12. Document Templates (4 templates)
    console.log('1️⃣2️⃣ Seeding DocumentTemplates...');
    const templates = [
      {
        templateName: 'Offer Letter',
        templateType: 'offer_letter',
        templateContent: PROFESSIONAL_TEMPLATES.offer_letter,
        emailSubject: 'Job Offer - {designation} Position at {company_name}',
        templateVariables: JSON.stringify(['employee_name', 'company_name', 'designation', 'salary', 'start_date', 'offer_letter_footer']),
        isActive: true,
        version: '1.0',
      },
      {
        templateName: 'Joining Letter',
        templateType: 'joining_letter',
        templateContent: PROFESSIONAL_TEMPLATES.joining_letter,
        emailSubject: 'Welcome to {company_name} - Joining Instructions',
        templateVariables: JSON.stringify(['employee_name', 'company_name', 'designation', 'start_date', 'joining_letter_footer']),
        isActive: true,
        version: '1.0',
      },
      {
        templateName: 'Experience Certificate',
        templateType: 'experience_certificate',
        templateContent: PROFESSIONAL_TEMPLATES.experience_certificate,
        emailSubject: 'Experience Certificate for {employee_name}',
        templateVariables: JSON.stringify(['employee_name', 'company_name', 'designation', 'join_date', 'last_date', 'experience_certificate_footer']),
        isActive: true,
        version: '1.0',
      },
      {
        templateName: 'No Objection Certificate',
        templateType: 'noc',
        templateContent: PROFESSIONAL_TEMPLATES.noc,
        emailSubject: 'No Objection Certificate for {employee_name}',
        templateVariables: JSON.stringify(['employee_name', 'company_name', 'purpose', 'noc_footer']),
        isActive: true,
        version: '1.0',
      },
    ];

    for (const template of templates) {
      await DocumentTemplate.upsert(template);
    }
    console.log('   ✅ Done (4 templates)\n');
    seededCount++;

    // 13. Cookie Consent
    console.log('1️⃣3️⃣ Seeding CookieConsent...');
    await CookieConsent.upsert({
      enabled: true,
      message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
      buttonText: 'Accept',
      learnMoreUrl: '/privacy-policy',
      position: 'bottom',
      theme: 'dark',
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 14. SEO Settings
    console.log('1️⃣4️⃣ Seeding SeoSetting...');
    await SeoSetting.upsert({
      metaTitle: 'HRMS Go V5 - Complete HR Management System',
      metaDescription: 'Modern, cloud-based HRMS solution for managing employees, payroll, attendance, and more',
      metaKeywords: 'HRMS, HR software, employee management, payroll, attendance',
      ogTitle: 'HRMS Go V5 - Transform Your HR Operations',
      ogDescription: 'Streamline your HR processes with our comprehensive HRMS platform',
      ogImage: '/images/og-image.png',
      twitterCard: 'summary_large_image',
      twitterSite: '@techcorp',
      robotsTxt: 'User-agent: *\\nAllow: /',
      sitemapEnabled: true,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 15. Cache Settings
    console.log('1️⃣5️⃣ Seeding CacheSetting...');
    await CacheSetting.upsert({
      cacheEnabled: true,
      cacheDriver: 'redis',
      cacheTtl: 60,
      cachePrefix: 'hrms_',
      clearOnDeploy: true,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 16. Webhook Configuration
    console.log('1️⃣6️⃣ Seeding WebhookConfiguration...');
    await WebhookConfiguration.upsert({
      webhookEnabled: true,
      webhookUrl: 'https://your-app.com/webhooks',
      webhookSecret: 'your-webhook-secret',
      webhookEvents: JSON.stringify(['employee.created', 'employee.updated', 'leave.requested', 'attendance.marked']),
      retryAttempts: 3,
      timeoutSeconds: 30,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 17. AI Configuration
    console.log('1️⃣7️⃣ Seeding AiConfiguration...');
    await AiConfiguration.upsert({
      aiEnabled: true,
      provider: 'openai',
      apiKey: 'sk-your-openai-api-key',
      model: 'gpt-4',
      maxTokens: 2000,
      temperature: 0.7,
      features: JSON.stringify(['chat_support', 'document_generation', 'analytics']),
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 18. Google Calendar Integration
    console.log('1️⃣8️⃣ Seeding GoogleCalendarIntegration...');
    await GoogleCalendarIntegration.upsert({
      clientId: 'your-google-client-id',
      clientSecret: 'your-google-client-secret',
      calendarId: 'primary',
      syncEnabled: true,
      syncInterval: 15,
      isActive: true,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 19. Export Settings
    console.log('1️⃣9️⃣ Seeding ExportSetting...');
    await ExportSetting.upsert({
      defaultFormat: 'excel',
      includeHeaders: true,
      dateFormat: 'YYYY-MM-DD',
      csvDelimiter: ',',
      csvEncoding: 'utf-8',
      excelFormat: 'xlsx',
      pdfOrientation: 'portrait',
      pdfPageSize: 'A4',
      maxExportRows: 10000,
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 20. Workflow Settings
    console.log('2️⃣0️⃣ Seeding WorkflowSetting...');
    await WorkflowSetting.upsert({
      leaveAutoApproval: false,
      leaveApprovalChain: JSON.stringify(['reporting_manager', 'hr_manager']),
      leaveRequiresManagerApproval: true,
      leaveRequiresHrApproval: true,
      attendanceAutoApproval: true,
      attendanceRequiresManagerApproval: false,
      expenseAutoApproval: false,
      expenseApprovalLimit: 100.00,
      expenseRequiresManagerApproval: true,
      expenseRequiresFinanceApproval: true,
      documentAutoApproval: false,
      documentRequiresHrApproval: true,
      notifyApproversEmail: true,
      notifyApproversPush: true,
      notifyRequesterOnApproval: true,
      notifyRequesterOnRejection: true,
      status: 'active',
    });
    console.log('   ✅ Done\n');
    seededCount++;

    // 21. Report Settings
    console.log('2️⃣1️⃣ Seeding ReportSetting...');
    await ReportSetting.upsert({
      defaultReportFormat: 'pdf',
      enablePdfReports: true,
      enableExcelReports: true,
      enableCsvReports: true,
      pdfOrientation: 'portrait',
      pdfPageSize: 'A4',
      pdfIncludeHeader: true,
      pdfIncludeFooter: true,
      pdfIncludeLogo: true,
      pdfWatermark: 'CONFIDENTIAL',
      excelIncludeCharts: true,
      excelAutoFilter: true,
      excelFreezeHeader: true,
      enableScheduledReports: true,
      scheduledReportFrequency: 'weekly',
      scheduledReportTime: '08:00:00',
      scheduledReportRecipients: JSON.stringify(['reports@techcorp.com']),
      includeEmployeeSalary: false,
      includePersonalInfo: true,
      maskSensitiveData: true,
      reportRetentionDays: 90,
      autoDeleteOldReports: true,
      status: 'active',
    });
    console.log('   ✅ Done\n');
    seededCount++;

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║            ✅ SEEDING COMPLETE!                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log(`\n  ✅ Seeded ${seededCount} categories/models successfully!\n`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  seedAllModels();
}

module.exports = { seedAllModels };

