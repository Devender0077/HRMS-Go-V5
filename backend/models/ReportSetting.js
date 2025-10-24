const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const ReportSetting = sequelize.define('ReportSetting', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  // Report Formats
  defaultReportFormat: {
    type: DataTypes.ENUM('pdf', 'excel', 'csv'),
    defaultValue: 'pdf',
    field: 'default_report_format',
  },
  enablePdfReports: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'enable_pdf_reports',
  },
  enableExcelReports: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'enable_excel_reports',
  },
  enableCsvReports: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'enable_csv_reports',
  },
  
  // PDF Settings
  pdfOrientation: {
    type: DataTypes.ENUM('portrait', 'landscape'),
    defaultValue: 'portrait',
    field: 'pdf_orientation',
  },
  pdfPageSize: {
    type: DataTypes.ENUM('A4', 'letter', 'legal'),
    defaultValue: 'A4',
    field: 'pdf_page_size',
  },
  pdfIncludeHeader: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'pdf_include_header',
  },
  pdfIncludeFooter: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'pdf_include_footer',
  },
  pdfIncludeLogo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'pdf_include_logo',
  },
  pdfWatermark: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'pdf_watermark',
    comment: 'Watermark text for PDFs (e.g., "CONFIDENTIAL")',
  },
  
  // Excel Settings
  excelIncludeCharts: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'excel_include_charts',
  },
  excelAutoFilter: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'excel_auto_filter',
  },
  excelFreezeHeader: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'excel_freeze_header',
  },
  
  // Report Scheduling
  enableScheduledReports: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'enable_scheduled_reports',
  },
  scheduledReportFrequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    defaultValue: 'weekly',
    field: 'scheduled_report_frequency',
  },
  scheduledReportTime: {
    type: DataTypes.TIME,
    allowNull: true,
    field: 'scheduled_report_time',
  },
  scheduledReportRecipients: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'scheduled_report_recipients',
    comment: 'Array of email addresses',
  },
  
  // Data Privacy
  includeEmployeeSalary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'include_employee_salary',
    comment: 'Include salary data in reports',
  },
  includePersonalInfo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'include_personal_info',
    comment: 'Include personal information in reports',
  },
  maskSensitiveData: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'mask_sensitive_data',
    comment: 'Mask sensitive data (e.g., SSN, bank details)',
  },
  
  // Report Storage
  reportRetentionDays: {
    type: DataTypes.INTEGER,
    defaultValue: 90,
    field: 'report_retention_days',
    comment: 'Number of days to keep generated reports',
  },
  autoDeleteOldReports: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'auto_delete_old_reports',
  },
  
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'report_settings',
  timestamps: true,
  underscored: true,
});

module.exports = ReportSetting;

