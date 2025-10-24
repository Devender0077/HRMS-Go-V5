/**
 * Seed ALL Specialized Tables with Comprehensive Sample Data
 * Ensures every category has data for proper count display
 */

const sequelize = require('../config/database2');
const db = require('../config/database');
const PROFESSIONAL_TEMPLATES = require('./professionalTemplates');

async function seedAllTables() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    🌱 Seeding ALL Specialized Tables with Sample Data         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // 1. COMPANY INFORMATION
    console.log('1️⃣  Seeding company_information...');
    await db.query(`
      INSERT INTO company_information (
        company_name, legal_name, email, phone, website, address, city, state, postal_code, country,
        tax_id, registration_number, founded_year, employee_count, industry, description,
        logo_url, favicon_url, timezone, currency, date_format, time_format,
        fiscal_year_start, fiscal_year_end,
        created_at, updated_at
      ) VALUES (
        'TechCorp Solutions Inc',
        'TechCorp Solutions Incorporated',
        'contact@techcorp.com',
        '+1-555-0100',
        'https://techcorp.com',
        '123 Innovation Drive, Suite 500',
        'San Francisco',
        'California',
        '94102',
        'United States',
        '12-3456789',
        'REG123456',
        2020,
        250,
        'Technology',
        'Leading provider of enterprise software solutions',
        '/logo/logo_full.svg',
        '/favicon/favicon.ico',
        'America/Los_Angeles',
        'USD',
        'MM/DD/YYYY',
        '12',
        '01-01',
        '12-31',
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        company_name = VALUES(company_name),
        updated_at = NOW()
    `);
    console.log('   ✅ Company information seeded\n');

    // 2. EMAIL CONFIGURATION
    console.log('2️⃣  Seeding email_configurations...');
    await db.query(`
      INSERT INTO email_configurations (
        smtp_host, smtp_port, smtp_user, smtp_password, smtp_encryption,
        from_email, from_name, reply_to_email,
        is_enabled, use_queue, send_test_emails,
        created_at, updated_at
      ) VALUES (
        'smtp.gmail.com',
        587,
        'noreply@techcorp.com',
        'encrypted_password_here',
        'tls',
        'noreply@techcorp.com',
        'TechCorp HRMS',
        'support@techcorp.com',
        1,
        1,
        0,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        smtp_host = VALUES(smtp_host),
        updated_at = NOW()
    `);
    console.log('   ✅ Email configuration seeded\n');

    // 3. LOCALIZATION SETTINGS
    console.log('3️⃣  Seeding localization_settings...');
    await db.query(`
      INSERT INTO localization_settings (
        language, timezone, currency, currency_symbol, currency_position,
        date_format, time_format, week_start,
        number_format, decimal_separator, thousand_separator, decimal_places,
        created_at, updated_at
      ) VALUES (
        'en',
        'America/Los_Angeles',
        'USD',
        '$',
        'before',
        'MM/DD/YYYY',
        '12',
        'monday',
        'en-US',
        '.',
        ',',
        2,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        language = VALUES(language),
        updated_at = NOW()
    `);
    console.log('   ✅ Localization settings seeded\n');

    // 4. NOTIFICATION SETTINGS
    console.log('4️⃣  Seeding notification_settings...');
    await db.query(`
      INSERT INTO notification_settings (
        email_notifications, push_notifications, sms_notifications, in_app_notifications,
        leave_request_notification, leave_approval_notification,
        attendance_notification, payroll_notification,
        birthday_notification, work_anniversary_notification,
        document_expiry_notification, task_assignment_notification,
        created_at, updated_at
      ) VALUES (
        1, 1, 0, 1,
        1, 1,
        1, 1,
        1, 1,
        1, 1,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        email_notifications = VALUES(email_notifications),
        updated_at = NOW()
    `);
    console.log('   ✅ Notification settings seeded\n');

    // 5. INTEGRATION SLACK
    console.log('5️⃣  Seeding integration_slack...');
    await db.query(`
      INSERT INTO integration_slack (
        is_enabled, webhook_url, bot_token, channel,
        notify_leaves, notify_attendance, notify_announcements,
        created_at, updated_at
      ) VALUES (
        1,
        'https://hooks.slack.com/services/YOUR/WEBHOOK/URL',
        'xoxb-your-bot-token',
        '#general',
        1, 1, 1,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        webhook_url = VALUES(webhook_url),
        updated_at = NOW()
    `);
    console.log('   ✅ Slack integration seeded\n');

    // 6. INTEGRATION PUSHER
    console.log('6️⃣  Seeding integration_pusher...');
    await db.query(`
      INSERT INTO integration_pusher (
        is_enabled, app_id, app_key, app_secret, cluster,
        use_tls, enable_logging,
        created_at, updated_at
      ) VALUES (
        1,
        '123456',
        'your-app-key',
        'your-app-secret',
        'us2',
        1, 0,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        app_id = VALUES(app_id),
        updated_at = NOW()
    `);
    console.log('   ✅ Pusher integration seeded\n');

    // 7. INTEGRATION TEAMS
    console.log('7️⃣  Seeding integration_teams...');
    await db.query(`
      INSERT INTO integration_teams (
        is_enabled, webhook_url, notify_leaves, notify_attendance,
        created_at, updated_at
      ) VALUES (
        1,
        'https://outlook.office.com/webhook/YOUR-WEBHOOK-URL',
        1, 1,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        webhook_url = VALUES(webhook_url),
        updated_at = NOW()
    `);
    console.log('   ✅ MS Teams integration seeded\n');

    // 8. INTEGRATION ZOOM
    console.log('8️⃣  Seeding integration_zoom...');
    await db.query(`
      INSERT INTO integration_zoom (
        is_enabled, api_key, api_secret, account_id,
        auto_create_meetings, default_meeting_duration,
        created_at, updated_at
      ) VALUES (
        1,
        'your-zoom-api-key',
        'your-zoom-api-secret',
        'your-account-id',
        1, 60,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        api_key = VALUES(api_key),
        updated_at = NOW()
    `);
    console.log('   ✅ Zoom integration seeded\n');

    // 9. SECURITY POLICIES
    console.log('9️⃣  Seeding security_policies...');
    await db.query(`
      INSERT INTO security_policies (
        min_password_length, require_uppercase, require_lowercase,
        require_numbers, require_special_chars, password_expiry_days,
        two_factor_authentication, session_timeout_minutes,
        max_login_attempts, lockout_duration_minutes,
        ip_whitelist_enabled, allowed_ips,
        created_at, updated_at
      ) VALUES (
        8, 1, 1, 1, 1, 90,
        0, 30,
        5, 15,
        0, NULL,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        min_password_length = VALUES(min_password_length),
        updated_at = NOW()
    `);
    console.log('   ✅ Security policies seeded\n');

    // 10. BACKUP CONFIGURATION
    console.log('🔟 Seeding backup_configurations...');
    await db.query(`
      INSERT INTO backup_configurations (
        is_enabled, frequency, backup_time, retention_days,
        storage_type, storage_path, cloud_provider, cloud_bucket,
        include_uploads, compress_backups,
        created_at, updated_at
      ) VALUES (
        1,
        'daily',
        '02:00:00',
        30,
        'local',
        '/backups',
        NULL,
        NULL,
        1, 1,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        frequency = VALUES(frequency),
        updated_at = NOW()
    `);
    console.log('   ✅ Backup configuration seeded\n');

    // 11. API CONFIGURATION
    console.log('1️⃣1️⃣ Seeding api_configurations...');
    await db.query(`
      INSERT INTO api_configurations (
        is_enabled, api_version, rate_limit, rate_window_minutes,
        require_api_key, api_key_header, allow_cors, allowed_origins,
        enable_documentation, documentation_url,
        created_at, updated_at
      ) VALUES (
        1,
        'v1',
        1000,
        60,
        1,
        'X-API-Key',
        1,
        '*',
        1,
        '/api/docs',
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        api_version = VALUES(api_version),
        updated_at = NOW()
    `);
    console.log('   ✅ API configuration seeded\n');

    // 12. DOCUMENT TEMPLATES (4 templates)
    console.log('1️⃣2️⃣ Seeding document_templates...');
    await db.query(`
      INSERT INTO document_templates (
        template_name, template_type, template_content,
        subject, variables, is_active, version,
        created_at, updated_at
      ) VALUES 
      ('Offer Letter', 'offer_letter', ?, 'Job Offer - {designation} Position at {company_name}', 
       '["employee_name","company_name","designation","salary","start_date","offer_letter_footer"]', 1, '1.0', NOW(), NOW()),
      ('Joining Letter', 'joining_letter', ?, 'Welcome to {company_name} - Joining Instructions',
       '["employee_name","company_name","designation","start_date","joining_letter_footer"]', 1, '1.0', NOW(), NOW()),
      ('Experience Certificate', 'experience_certificate', ?, 'Experience Certificate for {employee_name}',
       '["employee_name","company_name","designation","join_date","last_date","experience_certificate_footer"]', 1, '1.0', NOW(), NOW()),
      ('No Objection Certificate', 'noc', ?, 'No Objection Certificate for {employee_name}',
       '["employee_name","company_name","purpose","noc_footer"]', 1, '1.0', NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        template_content = VALUES(template_content),
        updated_at = NOW()
    `, [
      PROFESSIONAL_TEMPLATES.offer_letter,
      PROFESSIONAL_TEMPLATES.joining_letter,
      PROFESSIONAL_TEMPLATES.experience_certificate,
      PROFESSIONAL_TEMPLATES.noc
    ]);
    console.log('   ✅ Document templates seeded (4 templates)\n');

    // 13. COOKIE CONSENT
    console.log('1️⃣3️⃣ Seeding cookie_consent...');
    await db.query(`
      INSERT INTO cookie_consent (
        is_enabled, message, button_text, learn_more_url,
        position, theme,
        created_at, updated_at
      ) VALUES (
        1,
        'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
        'Accept',
        '/privacy-policy',
        'bottom',
        'dark',
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        message = VALUES(message),
        updated_at = NOW()
    `);
    console.log('   ✅ Cookie consent seeded\n');

    // 14. SEO SETTINGS
    console.log('1️⃣4️⃣ Seeding seo_settings...');
    await db.query(`
      INSERT INTO seo_settings (
        meta_title, meta_description, meta_keywords,
        og_title, og_description, og_image,
        twitter_card, twitter_site, robots_txt, sitemap_enabled,
        created_at, updated_at
      ) VALUES (
        'HRMS Go V5 - Complete HR Management System',
        'Modern, cloud-based HRMS solution for managing employees, payroll, attendance, and more',
        'HRMS, HR software, employee management, payroll, attendance',
        'HRMS Go V5 - Transform Your HR Operations',
        'Streamline your HR processes with our comprehensive HRMS platform',
        '/images/og-image.png',
        'summary_large_image',
        '@techcorp',
        'User-agent: *\\nAllow: /',
        1,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        meta_title = VALUES(meta_title),
        updated_at = NOW()
    `);
    console.log('   ✅ SEO settings seeded\n');

    // 15. CACHE SETTINGS
    console.log('1️⃣5️⃣ Seeding cache_settings...');
    await db.query(`
      INSERT INTO cache_settings (
        is_enabled, cache_driver, cache_ttl_minutes,
        cache_prefix, clear_cache_on_deploy,
        created_at, updated_at
      ) VALUES (
        1,
        'redis',
        60,
        'hrms_',
        1,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        cache_driver = VALUES(cache_driver),
        updated_at = NOW()
    `);
    console.log('   ✅ Cache settings seeded\n');

    // 16. WEBHOOK CONFIGURATION
    console.log('1️⃣6️⃣ Seeding webhook_configurations...');
    await db.query(`
      INSERT INTO webhook_configurations (
        is_enabled, url, secret, events,
        retry_attempts, timeout_seconds,
        created_at, updated_at
      ) VALUES (
        1,
        'https://your-app.com/webhooks',
        'your-webhook-secret',
        '["employee.created","employee.updated","leave.requested","attendance.marked"]',
        3, 30,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        url = VALUES(url),
        updated_at = NOW()
    `);
    console.log('   ✅ Webhook configuration seeded\n');

    // 17. AI CONFIGURATION
    console.log('1️⃣7️⃣ Seeding ai_configurations...');
    await db.query(`
      INSERT INTO ai_configurations (
        is_enabled, provider, api_key, model,
        max_tokens, temperature, features,
        created_at, updated_at
      ) VALUES (
        1,
        'openai',
        'sk-your-openai-api-key',
        'gpt-4',
        2000, 0.7,
        '["chat_support","document_generation","analytics"]',
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        provider = VALUES(provider),
        updated_at = NOW()
    `);
    console.log('   ✅ AI configuration seeded\n');

    // 18. GOOGLE CALENDAR INTEGRATION
    console.log('1️⃣8️⃣ Seeding google_calendar_integrations...');
    await db.query(`
      INSERT INTO google_calendar_integrations (
        is_enabled, client_id, client_secret,
        calendar_id, sync_enabled, sync_interval_minutes,
        created_at, updated_at
      ) VALUES (
        1,
        'your-google-client-id',
        'your-google-client-secret',
        'primary',
        1, 15,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        client_id = VALUES(client_id),
        updated_at = NOW()
    `);
    console.log('   ✅ Google Calendar integration seeded\n');

    // 19. EXPORT SETTINGS
    console.log('1️⃣9️⃣ Seeding export_settings...');
    await db.query(`
      INSERT INTO export_settings (
        default_format, include_headers, date_format,
        csv_delimiter, csv_encoding, excel_format,
        pdf_orientation, pdf_page_size, max_export_rows,
        created_at, updated_at
      ) VALUES (
        'excel',
        1,
        'YYYY-MM-DD',
        ',',
        'utf-8',
        'xlsx',
        'portrait',
        'A4',
        10000,
        NOW(),
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        default_format = VALUES(default_format),
        updated_at = NOW()
    `);
    console.log('   ✅ Export settings seeded\n');

    // Verify counts
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                 📊 VERIFICATION                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const tables = [
      'company_information', 'email_configurations', 'localization_settings',
      'notification_settings', 'integration_slack', 'integration_pusher',
      'integration_teams', 'integration_zoom', 'security_policies',
      'backup_configurations', 'api_configurations', 'document_templates',
      'cookie_consent', 'seo_settings', 'cache_settings',
      'webhook_configurations', 'ai_configurations', 'google_calendar_integrations',
      'export_settings'
    ];

    let totalRows = 0;
    for (const table of tables) {
      const [[result]] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table.padEnd(35)}: ${result.count} row(s)`);
      totalRows += result.count;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  ✅ TOTAL: ${totalRows} rows across 19 specialized tables\n`);

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║            ✅ SEEDING COMPLETE!                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedAllTables();
}

module.exports = { seedAllTables };

