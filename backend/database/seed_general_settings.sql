-- General Settings Seed Data
-- This file contains comprehensive settings for all categories

TRUNCATE TABLE general_settings;

INSERT INTO `general_settings` (`setting_key`, `setting_value`, `category`, `description`, `type`, `is_public`, `status`, `created_at`, `updated_at`) VALUES

-- General Settings
('app_name', 'HRMS Go V5', 'general', 'Application Name', 'text', 1, 'active', NOW(), NOW()),
('app_version', '5.0.0', 'general', 'Application Version', 'text', 1, 'active', NOW(), NOW()),
('app_url', 'http://localhost:3000', 'general', 'Application URL', 'text', 0, 'active', NOW(), NOW()),
('app_logo', '', 'general', 'Application Logo Path', 'image', 1, 'active', NOW(), NOW()),
('app_favicon', '', 'general', 'Application Favicon Path', 'image', 1, 'active', NOW(), NOW()),
('app_logo_dark', '', 'general', 'Dark Theme Logo Path', 'image', 1, 'active', NOW(), NOW()),
('app_small_logo', '', 'general', 'Small Logo for Mobile', 'image', 1, 'active', NOW(), NOW()),
('admin_email', 'admin@hrmsgo.com', 'general', 'Admin Email Address', 'text', 0, 'active', NOW(), NOW()),
('support_email', 'support@hrmsgo.com', 'general', 'Support Email Address', 'text', 1, 'active', NOW(), NOW()),
('timezone', 'America/New_York', 'general', 'Default Timezone', 'text', 1, 'active', NOW(), NOW()),
('date_format', 'MM/DD/YYYY', 'general', 'Date Format', 'text', 1, 'active', NOW(), NOW()),
('time_format', '12', 'general', 'Time Format (12 or 24 hour)', 'text', 1, 'active', NOW(), NOW()),
('maintenance_mode', 'false', 'general', 'Maintenance Mode', 'boolean', 0, 'active', NOW(), NOW()),
('force_https', 'false', 'general', 'Force HTTPS', 'boolean', 0, 'active', NOW(), NOW()),

-- Company Info
('company_name', 'HRMS Go Inc.', 'company', 'Company Name', 'text', 1, 'active', NOW(), NOW()),
('company_email', 'info@hrmsgo.com', 'company', 'Company Email', 'text', 1, 'active', NOW(), NOW()),
('company_phone', '+1 (555) 123-4567', 'company', 'Company Phone', 'text', 1, 'active', NOW(), NOW()),
('company_address', '123 Business Street, Suite 100', 'company', 'Company Address', 'text', 1, 'active', NOW(), NOW()),
('company_city', 'New York', 'company', 'Company City', 'text', 1, 'active', NOW(), NOW()),
('company_state', 'NY', 'company', 'Company State', 'text', 1, 'active', NOW(), NOW()),
('company_zip', '10001', 'company', 'Company ZIP Code', 'text', 1, 'active', NOW(), NOW()),
('company_country', 'United States', 'company', 'Company Country', 'text', 1, 'active', NOW(), NOW()),
('company_website', 'https://www.hrmsgo.com', 'company', 'Company Website', 'text', 1, 'active', NOW(), NOW()),
('company_registration', 'REG-2025-001', 'company', 'Company Registration Number', 'text', 0, 'active', NOW(), NOW()),
('company_tax_id', 'TAX-123456', 'company', 'Company Tax ID', 'text', 0, 'active', NOW(), NOW()),

-- Localization
('default_language', 'en', 'localization', 'Default Language', 'text', 1, 'active', NOW(), NOW()),
('default_currency', 'USD', 'localization', 'Default Currency', 'text', 1, 'active', NOW(), NOW()),
('currency_symbol', '$', 'localization', 'Currency Symbol', 'text', 1, 'active', NOW(), NOW()),
('currency_position', 'before', 'localization', 'Currency Position (before/after)', 'text', 1, 'active', NOW(), NOW()),
('thousands_separator', ',', 'localization', 'Thousands Separator', 'text', 1, 'active', NOW(), NOW()),
('decimal_separator', '.', 'localization', 'Decimal Separator', 'text', 1, 'active', NOW(), NOW()),
('number_of_decimals', '2', 'localization', 'Number of Decimals', 'number', 1, 'active', NOW(), NOW()),

-- Email Configuration
('email_from_name', 'HRMS Go', 'email', 'Email From Name', 'text', 0, 'active', NOW(), NOW()),
('email_from_address', 'noreply@hrmsgo.com', 'email', 'Email From Address', 'text', 0, 'active', NOW(), NOW()),
('smtp_host', 'smtp.gmail.com', 'email', 'SMTP Host', 'text', 0, 'active', NOW(), NOW()),
('smtp_port', '587', 'email', 'SMTP Port', 'number', 0, 'active', NOW(), NOW()),
('smtp_encryption', 'tls', 'email', 'SMTP Encryption', 'text', 0, 'active', NOW(), NOW()),
('smtp_username', '', 'email', 'SMTP Username', 'text', 0, 'active', NOW(), NOW()),
('smtp_password', '', 'email', 'SMTP Password', 'text', 0, 'active', NOW(), NOW()),
('email_test_mode', 'false', 'email', 'Email Test Mode', 'boolean', 0, 'active', NOW(), NOW()),

-- Notifications
('notify_new_employee', 'true', 'notifications', 'Notify on New Employee', 'boolean', 0, 'active', NOW(), NOW()),
('notify_leave_request', 'true', 'notifications', 'Notify on Leave Request', 'boolean', 0, 'active', NOW(), NOW()),
('notify_leave_approval', 'true', 'notifications', 'Notify on Leave Approval', 'boolean', 0, 'active', NOW(), NOW()),
('notify_birthday', 'true', 'notifications', 'Send Birthday Wishes', 'boolean', 0, 'active', NOW(), NOW()),
('notify_anniversary', 'true', 'notifications', 'Send Anniversary Wishes', 'boolean', 0, 'active', NOW(), NOW()),
('notify_document_expiry', 'true', 'notifications', 'Notify Document Expiry', 'boolean', 0, 'active', NOW(), NOW()),
('document_expiry_days', '30', 'notifications', 'Document Expiry Alert Days', 'number', 0, 'active', NOW(), NOW()),
('notify_payroll', 'true', 'notifications', 'Notify on Payroll', 'boolean', 0, 'active', NOW(), NOW()),
('notify_attendance_anomaly', 'true', 'notifications', 'Notify Attendance Anomaly', 'boolean', 0, 'active', NOW(), NOW()),

-- Security
('session_timeout', '60', 'security', 'Session Timeout (minutes)', 'number', 0, 'active', NOW(), NOW()),
('password_min_length', '8', 'security', 'Minimum Password Length', 'number', 0, 'active', NOW(), NOW()),
('password_require_uppercase', 'true', 'security', 'Require Uppercase Letters', 'boolean', 0, 'active', NOW(), NOW()),
('password_require_number', 'true', 'security', 'Require Numbers', 'boolean', 0, 'active', NOW(), NOW()),
('password_require_special', 'true', 'security', 'Require Special Characters', 'boolean', 0, 'active', NOW(), NOW()),
('max_login_attempts', '5', 'security', 'Max Login Attempts', 'number', 0, 'active', NOW(), NOW()),
('account_lockout_duration', '30', 'security', 'Account Lockout Duration (minutes)', 'number', 0, 'active', NOW(), NOW()),
('two_factor_auth', 'false', 'security', 'Two-Factor Authentication', 'boolean', 0, 'active', NOW(), NOW()),
('password_expiry_days', '90', 'security', 'Password Expiry Days', 'number', 0, 'active', NOW(), NOW()),
('ip_whitelist_enabled', 'false', 'security', 'IP Whitelist Enabled', 'boolean', 0, 'active', NOW(), NOW()),

-- Workflow
('leave_auto_approve', 'false', 'workflow', 'Auto-approve Leaves', 'boolean', 0, 'active', NOW(), NOW()),
('attendance_auto_checkout', 'true', 'workflow', 'Auto Checkout Employees', 'boolean', 0, 'active', NOW(), NOW()),
('document_verification_required', 'true', 'workflow', 'Require Document Verification', 'boolean', 0, 'active', NOW(), NOW()),
('leave_approval_chain', 'manager', 'workflow', 'Leave Approval Chain', 'text', 0, 'active', NOW(), NOW()),
('expense_approval_required', 'true', 'workflow', 'Expense Approval Required', 'boolean', 0, 'active', NOW(), NOW()),
('timesheet_approval_required', 'true', 'workflow', 'Timesheet Approval Required', 'boolean', 0, 'active', NOW(), NOW()),

-- Backup & Storage
('backup_enabled', 'true', 'backup', 'Enable Automatic Backups', 'boolean', 0, 'active', NOW(), NOW()),
('backup_frequency', 'daily', 'backup', 'Backup Frequency', 'text', 0, 'active', NOW(), NOW()),
('backup_time', '02:00', 'backup', 'Backup Time', 'text', 0, 'active', NOW(), NOW()),
('backup_retention_days', '30', 'backup', 'Backup Retention Days', 'number', 0, 'active', NOW(), NOW()),
('storage_provider', 'local', 'backup', 'Storage Provider', 'text', 0, 'active', NOW(), NOW()),
('s3_bucket', '', 'backup', 'AWS S3 Bucket Name', 'text', 0, 'active', NOW(), NOW()),
('s3_region', 'us-east-1', 'backup', 'AWS S3 Region', 'text', 0, 'active', NOW(), NOW()),
('s3_access_key', '', 'backup', 'AWS S3 Access Key', 'text', 0, 'active', NOW(), NOW()),
('s3_secret_key', '', 'backup', 'AWS S3 Secret Key', 'text', 0, 'active', NOW(), NOW()),

-- Reports
('default_report_format', 'pdf', 'reports', 'Default Report Format', 'text', 0, 'active', NOW(), NOW()),
('report_watermark', 'CONFIDENTIAL', 'reports', 'Report Watermark', 'text', 0, 'active', NOW(), NOW()),
('report_logo_enabled', 'true', 'reports', 'Include Logo in Reports', 'boolean', 0, 'active', NOW(), NOW()),
('report_footer_text', 'Generated by HRMS Go V5', 'reports', 'Report Footer Text', 'text', 0, 'active', NOW(), NOW()),
('report_header_color', '#1976d2', 'reports', 'Report Header Color', 'text', 0, 'active', NOW(), NOW()),

-- Integrations - Slack
('slack_enabled', 'false', 'integrations', 'Enable Slack Integration', 'boolean', 0, 'active', NOW(), NOW()),
('slack_webhook', '', 'integrations', 'Slack Webhook URL', 'text', 0, 'active', NOW(), NOW()),
('slack_channel', '#general', 'integrations', 'Slack Channel', 'text', 0, 'active', NOW(), NOW()),
('slack_notify_leave', 'true', 'integrations', 'Slack Notify Leave Requests', 'boolean', 0, 'active', NOW(), NOW()),

-- Integrations - Pusher
('pusher_enabled', 'false', 'integrations', 'Enable Pusher', 'boolean', 0, 'active', NOW(), NOW()),
('pusher_app_id', '', 'integrations', 'Pusher App ID', 'text', 0, 'active', NOW(), NOW()),
('pusher_key', '', 'integrations', 'Pusher Key', 'text', 0, 'active', NOW(), NOW()),
('pusher_secret', '', 'integrations', 'Pusher Secret', 'text', 0, 'active', NOW(), NOW()),
('pusher_cluster', 'us2', 'integrations', 'Pusher Cluster', 'text', 0, 'active', NOW(), NOW()),

-- Integrations - Microsoft Teams
('teams_enabled', 'false', 'integrations', 'Enable Microsoft Teams', 'boolean', 0, 'active', NOW(), NOW()),
('teams_webhook', '', 'integrations', 'Microsoft Teams Webhook URL', 'text', 0, 'active', NOW(), NOW()),
('teams_notify_announcements', 'true', 'integrations', 'Teams Notify Announcements', 'boolean', 0, 'active', NOW(), NOW()),

-- Integrations - Zoom
('zoom_enabled', 'false', 'integrations', 'Enable Zoom Integration', 'boolean', 0, 'active', NOW(), NOW()),
('zoom_api_key', '', 'integrations', 'Zoom API Key', 'text', 0, 'active', NOW(), NOW()),
('zoom_api_secret', '', 'integrations', 'Zoom API Secret', 'text', 0, 'active', NOW(), NOW()),

-- Integrations - Google Meet
('google_meet_enabled', 'false', 'integrations', 'Enable Google Meet', 'boolean', 0, 'active', NOW(), NOW()),
('google_client_id', '', 'integrations', 'Google Client ID', 'text', 0, 'active', NOW(), NOW()),
('google_client_secret', '', 'integrations', 'Google Client Secret', 'text', 0, 'active', NOW(), NOW()),

-- API Management
('api_enabled', 'true', 'api', 'Enable API Access', 'boolean', 0, 'active', NOW(), NOW()),
('api_rate_limit', '1000', 'api', 'API Rate Limit (requests/hour)', 'number', 0, 'active', NOW(), NOW()),
('api_version', 'v1', 'api', 'API Version', 'text', 1, 'active', NOW(), NOW()),
('api_documentation_url', '/api/docs', 'api', 'API Documentation URL', 'text', 1, 'active', NOW(), NOW()),
('api_key_expiry_days', '365', 'api', 'API Key Expiry Days', 'number', 0, 'active', NOW(), NOW()),

-- Google Calendar
('google_calendar_enabled', 'false', 'google', 'Enable Google Calendar Sync', 'boolean', 0, 'active', NOW(), NOW()),
('google_calendar_id', '', 'google', 'Google Calendar ID', 'text', 0, 'active', NOW(), NOW()),
('google_service_account', '', 'google', 'Google Service Account JSON', 'json', 0, 'active', NOW(), NOW()),

-- SEO
('seo_title', 'HRMS Go V5 - Complete HR Management System', 'seo', 'SEO Title', 'text', 1, 'active', NOW(), NOW()),
('seo_description', 'Comprehensive HR Management System for modern businesses', 'seo', 'SEO Description', 'text', 1, 'active', NOW(), NOW()),
('seo_keywords', 'HRMS, HR Software, Employee Management, Payroll', 'seo', 'SEO Keywords', 'text', 1, 'active', NOW(), NOW()),
('seo_robots', 'index, follow', 'seo', 'SEO Robots Meta', 'text', 1, 'active', NOW(), NOW()),
('seo_og_image', '', 'seo', 'Open Graph Image', 'image', 1, 'active', NOW(), NOW()),

-- Cache
('cache_enabled', 'true', 'cache', 'Enable Caching', 'boolean', 0, 'active', NOW(), NOW()),
('cache_driver', 'file', 'cache', 'Cache Driver', 'text', 0, 'active', NOW(), NOW()),
('cache_ttl', '3600', 'cache', 'Cache TTL (seconds)', 'number', 0, 'active', NOW(), NOW()),

-- Webhooks
('webhooks_enabled', 'false', 'webhook', 'Enable Webhooks', 'boolean', 0, 'active', NOW(), NOW()),
('webhook_secret', '', 'webhook', 'Webhook Secret Key', 'text', 0, 'active', NOW(), NOW()),

-- Cookie Consent
('cookie_consent_enabled', 'true', 'cookie', 'Enable Cookie Consent', 'boolean', 1, 'active', NOW(), NOW()),
('cookie_consent_message', 'We use cookies to enhance your experience', 'cookie', 'Cookie Consent Message', 'text', 1, 'active', NOW(), NOW()),

-- ChatGPT/AI
('ai_enabled', 'false', 'chatgpt', 'Enable AI Features', 'boolean', 0, 'active', NOW(), NOW()),
('openai_api_key', '', 'chatgpt', 'OpenAI API Key', 'text', 0, 'active', NOW(), NOW()),
('ai_model', 'gpt-4', 'chatgpt', 'AI Model', 'text', 0, 'active', NOW(), NOW()),
('ai_max_tokens', '2000', 'chatgpt', 'AI Max Tokens', 'number', 0, 'active', NOW(), NOW()),

-- Offer Letter
('offer_letter_template', '', 'offer', 'Offer Letter Template', 'text', 0, 'active', NOW(), NOW()),
('offer_letter_footer', 'Thank you for joining our team!', 'offer', 'Offer Letter Footer', 'text', 0, 'active', NOW(), NOW()),
('offer_letter_auto_send', 'false', 'offer', 'Auto Send Offer Letters', 'boolean', 0, 'active', NOW(), NOW()),
('offer_letter_validity_days', '15', 'offer', 'Offer Letter Validity (days)', 'number', 0, 'active', NOW(), NOW()),

-- Joining Letter
('joining_letter_template', '', 'joining', 'Joining Letter Template', 'text', 0, 'active', NOW(), NOW()),
('joining_letter_auto_send', 'true', 'joining', 'Auto Send Joining Letters', 'boolean', 0, 'active', NOW(), NOW()),
('joining_checklist_enabled', 'true', 'joining', 'Enable Joining Checklist', 'boolean', 0, 'active', NOW(), NOW()),

-- Experience Certificate
('experience_cert_template', '', 'experience', 'Experience Certificate Template', 'text', 0, 'active', NOW(), NOW()),
('experience_cert_signatory', 'HR Manager', 'experience', 'Certificate Signatory', 'text', 0, 'active', NOW(), NOW()),
('experience_cert_auto_generate', 'false', 'experience', 'Auto Generate on Exit', 'boolean', 0, 'active', NOW(), NOW()),

-- NOC (No Objection Certificate)
('noc_template', '', 'noc', 'NOC Template', 'text', 0, 'active', NOW(), NOW()),
('noc_approval_required', 'true', 'noc', 'NOC Approval Required', 'boolean', 0, 'active', NOW(), NOW()),
('noc_validity_days', '30', 'noc', 'NOC Validity (days)', 'number', 0, 'active', NOW(), NOW()),

-- Export/Import
('export_max_rows', '10000', 'export', 'Max Export Rows', 'number', 0, 'active', NOW(), NOW()),
('export_formats', 'excel,csv,pdf', 'export', 'Allowed Export Formats', 'text', 0, 'active', NOW(), NOW()),
('import_batch_size', '1000', 'export', 'Import Batch Size', 'number', 0, 'active', NOW(), NOW());

