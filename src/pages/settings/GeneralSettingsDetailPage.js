import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import {
  Container,
  Card,
  Typography,
  Box,
  Button,
  Stack,
  Grid,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar';
// services
import generalSettingsService from '../../services/api/generalSettingsService';
import ImageUpload from '../../components/settings/ImageUpload';
import TemplatePreview from '../../components/settings/TemplatePreview';

// ----------------------------------------------------------------------

// Currency symbol mapping
const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AED: 'د.إ',
  JPY: '¥',
  CNY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'Fr',
};

const CATEGORIES = {
  general: { 
    label: 'General Settings', 
    icon: 'eva:settings-2-fill', 
    color: '#1976d2',
    fields: [
      { key: 'app_name', label: 'Application Name', type: 'text' },
      { key: 'app_version', label: 'Application Version', type: 'text' },
      { key: 'app_url', label: 'Application URL', type: 'text' },
      { key: 'app_logo', label: 'Application Logo', type: 'image', helperText: 'Recommended: 200x60px, PNG or SVG' },
      { key: 'app_favicon', label: 'Favicon', type: 'image', helperText: 'Recommended: 32x32px or 16x16px, ICO or PNG' },
      { key: 'app_logo_dark', label: 'Dark Theme Logo', type: 'image', helperText: 'Logo for dark mode, same size as main logo' },
      { key: 'app_small_logo', label: 'Small Logo (Mobile)', type: 'image', helperText: 'Recommended: 48x48px, for mobile view' },
      { key: 'admin_email', label: 'Admin Email', type: 'text' },
      { key: 'support_email', label: 'Support Email', type: 'text' },
      { key: 'timezone', label: 'Timezone', type: 'select', options: [
        'America/New_York', 'America/Chicago', 'America/Los_Angeles', 
        'Europe/London', 'Asia/Dubai', 'Asia/Kolkata', 'UTC'
      ]},
      { key: 'date_format', label: 'Date Format', type: 'select', options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] },
      { key: 'time_format', label: 'Time Format', type: 'select', options: ['12', '24'] },
    ]
  },
  company: {
    label: 'Company Information',
    icon: 'eva:briefcase-fill',
    color: '#2e7d32',
    fields: [
      { key: 'company_name', label: 'Company Name', type: 'text' },
      { key: 'company_email', label: 'Company Email', type: 'text' },
      { key: 'company_phone', label: 'Company Phone', type: 'text' },
      { key: 'company_address', label: 'Company Address', type: 'textarea' },
      { key: 'company_website', label: 'Company Website', type: 'text' },
    ]
  },
  localization: {
    label: 'Localization',
    icon: 'eva:globe-fill',
    color: '#f57c00',
    fields: [
      { key: 'default_language', label: 'Default Language', type: 'select', options: ['en', 'es', 'fr', 'de', 'zh'] },
      { key: 'default_currency', label: 'Default Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'INR', 'AED', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF'] },
      { key: 'currency_symbol', label: 'Currency Symbol (auto-updates)', type: 'text', helperText: 'Automatically updates when currency changes' },
      { key: 'currency_position', label: 'Currency Position', type: 'select', options: ['before', 'after'] },
      { key: 'thousands_separator', label: 'Thousands Separator', type: 'text' },
      { key: 'decimal_separator', label: 'Decimal Separator', type: 'text' },
      { key: 'number_of_decimals', label: 'Number of Decimals', type: 'number' },
    ]
  },
  email: {
    label: 'Email Configuration',
    icon: 'eva:email-fill',
    color: '#7b1fa2',
    fields: [
      { key: 'email_from_name', label: 'From Name', type: 'text' },
      { key: 'email_from_address', label: 'From Email', type: 'text' },
      { key: 'smtp_host', label: 'SMTP Host', type: 'text' },
      { key: 'smtp_port', label: 'SMTP Port', type: 'number' },
      { key: 'smtp_encryption', label: 'Encryption', type: 'select', options: ['tls', 'ssl', 'none'] },
      { key: 'smtp_username', label: 'SMTP Username', type: 'text' },
      { key: 'smtp_password', label: 'SMTP Password', type: 'password' },
    ]
  },
  notifications: {
    label: 'Notifications',
    icon: 'eva:bell-fill',
    color: '#c62828',
    fields: [
      { key: 'enable_email_notifications', label: 'Enable Email Notifications', type: 'boolean' },
      { key: 'enable_browser_notifications', label: 'Enable Browser Notifications', type: 'boolean' },
      { key: 'notify_employee_leave', label: 'Notify on Leave Requests', type: 'boolean' },
      { key: 'notify_employee_attendance', label: 'Notify on Attendance', type: 'boolean' },
      { key: 'notify_payroll', label: 'Notify on Payroll', type: 'boolean' },
      { key: 'notify_document_upload', label: 'Notify on Document Upload', type: 'boolean' },
    ]
  },
  integrations: {
    label: 'Integrations',
    icon: 'eva:link-2-fill',
    color: '#00796b',
    fields: [
      { key: 'slack_enabled', label: 'Enable Slack', type: 'boolean' },
      { key: 'slack_webhook_url', label: 'Slack Webhook URL', type: 'text' },
      { key: 'pusher_enabled', label: 'Enable Pusher', type: 'boolean' },
      { key: 'pusher_app_id', label: 'Pusher App ID', type: 'text' },
      { key: 'pusher_key', label: 'Pusher Key', type: 'text' },
      { key: 'pusher_secret', label: 'Pusher Secret', type: 'text' },
      { key: 'pusher_cluster', label: 'Pusher Cluster', type: 'text' },
      { key: 'msteams_enabled', label: 'Enable Microsoft Teams', type: 'boolean' },
      { key: 'msteams_webhook_url', label: 'MS Teams Webhook URL', type: 'text' },
      { key: 'zoom_enabled', label: 'Enable Zoom', type: 'boolean' },
      { key: 'zoom_api_key', label: 'Zoom API Key', type: 'text' },
    ]
  },
  security: {
    label: 'Security',
    icon: 'eva:shield-fill',
    color: '#d32f2f',
    fields: [
      { key: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number' },
      { key: 'password_min_length', label: 'Min Password Length', type: 'number' },
      { key: 'password_require_uppercase', label: 'Require Uppercase', type: 'boolean' },
      { key: 'password_require_number', label: 'Require Numbers', type: 'boolean' },
      { key: 'password_require_special', label: 'Require Special Characters', type: 'boolean' },
      { key: 'max_login_attempts', label: 'Max Login Attempts', type: 'number' },
      { key: 'account_lockout_duration', label: 'Lockout Duration (minutes)', type: 'number' },
      { key: 'two_factor_auth', label: 'Enable 2FA', type: 'boolean' },
    ]
  },
  backup: {
    label: 'Backup & Storage',
    icon: 'eva:cloud-upload-fill',
    color: '#0288d1',
    fields: [
      { key: 'backup_enabled', label: 'Enable Auto Backup', type: 'boolean' },
      { key: 'backup_frequency', label: 'Backup Frequency', type: 'select', options: ['daily', 'weekly', 'monthly'] },
      { key: 'backup_time', label: 'Backup Time', type: 'time' },
      { key: 'backup_retention_days', label: 'Retention Days', type: 'number' },
      { key: 'storage_provider', label: 'Storage Provider', type: 'select', options: ['local', 's3', 'azure'] },
    ]
  },
  api: {
    label: 'API Management',
    icon: 'eva:code-fill',
    color: '#5e35b1',
    fields: [
      { key: 'api_enabled', label: 'Enable API', type: 'boolean' },
      { key: 'api_rate_limit', label: 'Rate Limit (req/hour)', type: 'number' },
      { key: 'api_version', label: 'API Version', type: 'text' },
    ]
  },
  workflow: {
    label: 'Workflow',
    icon: 'eva:share-fill',
    color: '#0097a7',
    fields: [
      { key: 'leave_auto_approve', label: 'Auto-approve Leaves', type: 'boolean' },
      { key: 'attendance_auto_checkout', label: 'Auto Checkout', type: 'boolean' },
      { key: 'document_verification_required', label: 'Require Document Verification', type: 'boolean' },
      { key: 'leave_approval_chain', label: 'Leave Approval Chain', type: 'select', options: ['manager', 'hr', 'both'] },
    ]
  },
  reports: {
    label: 'Reports',
    icon: 'eva:bar-chart-fill',
    color: '#388e3c',
    fields: [
      { key: 'default_report_format', label: 'Default Report Format', type: 'select', options: ['pdf', 'excel', 'csv'] },
      { key: 'report_watermark', label: 'Report Watermark', type: 'text' },
      { key: 'report_logo_enabled', label: 'Include Logo in Reports', type: 'boolean' },
    ]
  },
  offer: {
    label: 'Offer Letter',
    icon: 'eva:file-text-fill',
    color: '#f4511e',
    fields: [
      { key: 'offer_letter_template', label: 'Offer Letter Template', type: 'textarea', helperText: 'HTML template with variables: {candidate_name}, {position}, {salary}, {joining_date}, {company_name}' },
      { key: 'offer_letter_subject', label: 'Email Subject', type: 'text' },
      { key: 'offer_letter_auto_send', label: 'Auto Send Offer Letters', type: 'boolean' },
      { key: 'offer_letter_validity_days', label: 'Validity (days)', type: 'number' },
      { key: 'offer_letter_footer', label: 'Footer Text', type: 'textarea' },
    ]
  },
  joining: {
    label: 'Joining Letter',
    icon: 'eva:file-add-fill',
    color: '#1565c0',
    fields: [
      { key: 'joining_letter_template', label: 'Joining Letter Template', type: 'textarea', helperText: 'HTML template with variables: {employee_name}, {position}, {joining_date}, {department}, {company_name}' },
      { key: 'joining_letter_subject', label: 'Email Subject', type: 'text' },
      { key: 'joining_letter_auto_send', label: 'Auto Send Joining Letters', type: 'boolean' },
      { key: 'joining_checklist_enabled', label: 'Enable Joining Checklist', type: 'boolean' },
    ]
  },
  experience: {
    label: 'Experience Certificate',
    icon: 'eva:award-fill',
    color: '#fbc02d',
    fields: [
      { key: 'experience_cert_template', label: 'Experience Certificate Template', type: 'textarea', helperText: 'HTML template with variables: {employee_name}, {position}, {join_date}, {end_date}, {duration}, {company_name}' },
      { key: 'experience_cert_signatory', label: 'Certificate Signatory', type: 'text' },
      { key: 'experience_cert_auto_generate', label: 'Auto Generate on Exit', type: 'boolean' },
    ]
  },
  noc: {
    label: 'NOC Settings',
    icon: 'eva:checkmark-circle-fill',
    color: '#512da8',
    fields: [
      { key: 'noc_template', label: 'NOC Template', type: 'textarea', helperText: 'HTML template with variables: {employee_name}, {position}, {purpose}, {company_name}' },
      { key: 'noc_approval_required', label: 'Approval Required', type: 'boolean' },
      { key: 'noc_validity_days', label: 'NOC Validity (days)', type: 'number' },
    ]
  },
  google: {
    label: 'Google Calendar',
    icon: 'eva:calendar-fill',
    color: '#4285f4',
    fields: [
      { key: 'google_calendar_enabled', label: 'Enable Google Calendar', type: 'boolean' },
    ]
  },
  seo: {
    label: 'SEO',
    icon: 'eva:search-fill',
    color: '#00897b',
    fields: [
      { key: 'seo_title', label: 'SEO Title', type: 'text' },
      { key: 'seo_description', label: 'SEO Description', type: 'textarea' },
    ]
  },
  cache: {
    label: 'Cache',
    icon: 'eva:flash-fill',
    color: '#6d4c41',
    fields: [
      { key: 'cache_enabled', label: 'Enable Cache', type: 'boolean' },
    ]
  },
  webhook: {
    label: 'Webhooks',
    icon: 'eva:radio-fill',
    color: '#7b1fa2',
    fields: [
      { key: 'webhooks_enabled', label: 'Enable Webhooks', type: 'boolean' },
    ]
  },
  cookie: {
    label: 'Cookie Consent',
    icon: 'eva:info-fill',
    color: '#f57f17',
    fields: [
      { key: 'cookie_consent_enabled', label: 'Enable Cookie Consent', type: 'boolean' },
      { key: 'cookie_consent_message', label: 'Consent Message', type: 'textarea', helperText: 'Message shown in cookie consent banner' },
      { key: 'cookie_consent_button_text', label: 'Accept Button Text', type: 'text' },
      { key: 'cookie_consent_position', label: 'Banner Position', type: 'select', options: ['bottom', 'top'] },
    ]
  },
  chatgpt: {
    label: 'ChatGPT/AI',
    icon: 'eva:message-square-fill',
    color: '#10a37f',
    fields: [
      { key: 'ai_enabled', label: 'Enable AI Features', type: 'boolean' },
      { key: 'openai_api_key', label: 'OpenAI API Key', type: 'password' },
    ]
  },
  export: {
    label: 'Export/Import',
    icon: 'eva:download-fill',
    color: '#455a64',
    fields: [
      { key: 'export_max_rows', label: 'Max Export Rows', type: 'number' },
    ]
  },
};

export default function GeneralSettingsDetailPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState('');
  const [previewType, setPreviewType] = useState('');

  const categoryConfig = CATEGORIES[categoryId];

  useEffect(() => {
    if (categoryId && categoryConfig) {
      fetchCategorySettings();
    }
  }, [categoryId]);

  const fetchCategorySettings = async () => {
    try {
      setLoading(true);
      const response = await generalSettingsService.getByCategory(categoryId);
      console.log(`${categoryId} settings:`, response);
      
      if (response && response.settings) {
        setSettings(response.settings);
        setFormData(response.settings);
      }
    } catch (error) {
      console.error('Error fetching category settings:', error);
      enqueueSnackbar(`Failed to load settings: ${error.message}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData(prev => {
      const newData = { ...prev, [key]: value };
      
      // Auto-update currency symbol when default_currency changes
      if (key === 'default_currency' && CURRENCY_SYMBOLS[value]) {
        newData.currency_symbol = CURRENCY_SYMBOLS[value];
        enqueueSnackbar(`Currency symbol automatically updated to ${CURRENCY_SYMBOLS[value]}`, { variant: 'info' });
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Convert formData to settings array
      const settingsArray = categoryConfig.fields.map(field => ({
        key: field.key,
        value: formData[field.key] || '',
        category: categoryId,
        description: field.label,
        type: field.type === 'boolean' ? 'boolean' : field.type === 'number' ? 'number' : 'text',
      }));

      await generalSettingsService.updateMultiple(settingsArray);
      
      enqueueSnackbar('Settings saved successfully', { variant: 'success' });
      await fetchCategorySettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      enqueueSnackbar('Failed to save settings', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (field) => {
    setSelectedSetting(field);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedSetting(null);
  };

  const handleDialogSave = async () => {
    await handleSave();
    handleDialogClose();
  };

  const handlePreview = (field) => {
    setPreviewTemplate(formData[field.key] || '');
    setPreviewType(field.key);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewTemplate('');
    setPreviewType('');
  };

  if (!categoryConfig) {
    return (
      <Container>
        <Alert severity="error">Category not found</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title> {categoryConfig.label} | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={categoryConfig.label}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Settings' },
            { name: 'General', href: '/dashboard/settings/general' },
            { name: categoryConfig.label },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard/settings/general')}
                startIcon={<Iconify icon="eva:arrow-back-fill" />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : <Iconify icon="eva:save-fill" />}
              >
                {saving ? 'Saving...' : 'Save All Changes'}
              </Button>
            </Stack>
          }
        />

        {/* Settings Table */}
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Setting</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryConfig.fields.map((field) => (
                    <TableRow key={field.key} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{field.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {field.key}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {field.type === 'image' ? (
                          <ImageUpload
                            value={formData[field.key] || ''}
                            onChange={(value) => handleChange(field.key, value)}
                            label={field.label}
                            helperText={field.helperText || 'Upload image file (JPEG, PNG, GIF, SVG, ICO - Max 5MB)'}
                            type={field.key.includes('favicon') ? 'favicon' : 'logo'}
                          />
                        ) : field.type === 'boolean' ? (
                          <Switch
                            checked={formData[field.key] === 'true' || formData[field.key] === true}
                            onChange={(e) => handleChange(field.key, e.target.checked ? 'true' : 'false')}
                          />
                        ) : field.type === 'select' ? (
                          <TextField
                            select
                            size="small"
                            value={formData[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            sx={{ minWidth: 200 }}
                          >
                            {field.options.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : field.type === 'textarea' ? (
                          <TextField
                            fullWidth
                            multiline
                            rows={field.key.includes('template') ? 6 : 3}
                            value={formData[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            size="small"
                            helperText={field.helperText}
                            sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                          />
                        ) : (
                          <TextField
                            fullWidth
                            type={field.type === 'password' ? 'password' : field.type === 'number' ? 'number' : 'text'}
                            value={formData[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            size="small"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {field.key.includes('template') && (
                            <Tooltip title="Preview Template">
                              <IconButton 
                                onClick={() => handlePreview(field)} 
                                color="info"
                                size="small"
                              >
                                <Iconify icon="eva:eye-fill" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(field)} color="primary" size="small">
                              <Iconify icon="eva:edit-fill" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>

        {/* Info */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 Settings Information
          </Typography>
          <Typography variant="body2">
            Changes are saved to the database. Click "Save All Changes" to persist your modifications.
          </Typography>
        </Alert>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit {selectedSetting?.label}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedSetting && selectedSetting.type === 'image' ? (
              <ImageUpload
                value={formData[selectedSetting.key] || ''}
                onChange={(value) => handleChange(selectedSetting.key, value)}
                label={selectedSetting.label}
                helperText={selectedSetting.helperText || 'Upload image file'}
                type={selectedSetting.key.includes('favicon') ? 'favicon' : 'logo'}
              />
            ) : selectedSetting && selectedSetting.type === 'boolean' ? (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData[selectedSetting.key] === 'true' || formData[selectedSetting.key] === true}
                    onChange={(e) => handleChange(selectedSetting.key, e.target.checked ? 'true' : 'false')}
                  />
                }
                label={selectedSetting.label}
              />
            ) : selectedSetting && selectedSetting.type === 'select' ? (
              <TextField
                select
                fullWidth
                label={selectedSetting.label}
                value={formData[selectedSetting.key] || ''}
                onChange={(e) => handleChange(selectedSetting.key, e.target.value)}
              >
                {selectedSetting.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : selectedSetting && selectedSetting.type === 'textarea' ? (
              <TextField
                fullWidth
                multiline
                rows={selectedSetting.key.includes('template') ? 12 : 4}
                label={selectedSetting.label}
                value={formData[selectedSetting.key] || ''}
                onChange={(e) => handleChange(selectedSetting.key, e.target.value)}
                helperText={selectedSetting.helperText}
                sx={{ 
                  '& textarea': { 
                    fontFamily: selectedSetting.key.includes('template') ? 'monospace' : 'inherit',
                    fontSize: '0.875rem'
                  } 
                }}
              />
            ) : selectedSetting ? (
              <TextField
                fullWidth
                type={selectedSetting.type === 'password' ? 'password' : selectedSetting.type === 'number' ? 'number' : 'text'}
                label={selectedSetting.label}
                value={formData[selectedSetting.key] || ''}
                onChange={(e) => handleChange(selectedSetting.key, e.target.value)}
              />
            ) : null}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Preview Dialog */}
      <TemplatePreview
        open={previewOpen}
        template={previewTemplate}
        templateType={previewType}
        onClose={handlePreviewClose}
      />
    </>
  );
}

