import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import {
  Container,
  Card,
  Typography,
  Box,
  Button,
  Stack,
  Grid,
  alpha,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
// services
import generalSettingsService from '../../services/api/generalSettingsService';

// ----------------------------------------------------------------------

const SETTING_CATEGORIES = [
  { id: 'general', label: 'General', icon: 'eva:settings-2-fill', color: '#1976d2', description: 'App name, logo, favicon, timezone' },
  { id: 'company', label: 'Company Info', icon: 'eva:briefcase-fill', color: '#2e7d32', description: 'Company details, address, contact' },
  { id: 'localization', label: 'Localization', icon: 'eva:globe-fill', color: '#f57c00', description: 'Language, currency, number formats' },
  { id: 'email', label: 'Email Config', icon: 'eva:email-fill', color: '#7b1fa2', description: 'SMTP and email settings' },
  { id: 'notifications', label: 'Notifications', icon: 'eva:bell-fill', color: '#c62828', description: 'Email and push notifications' },
  { id: 'integrations', label: 'Integrations', icon: 'eva:link-2-fill', color: '#00796b', description: 'Slack, Pusher, MS Teams, Zoom' },
  { id: 'security', label: 'Security', icon: 'eva:shield-fill', color: '#d32f2f', description: 'Password policies, 2FA, session' },
  { id: 'backup', label: 'Backup & Storage', icon: 'eva:cloud-upload-fill', color: '#0288d1', description: 'Automated backups, cloud storage' },
  { id: 'api', label: 'API Management', icon: 'eva:code-fill', color: '#5e35b1', description: 'API access, rate limits' },
  { id: 'workflow', label: 'Workflow', icon: 'eva:share-fill', color: '#0097a7', description: 'Approval chains, auto-approve' },
  { id: 'reports', label: 'Reports', icon: 'eva:bar-chart-fill', color: '#388e3c', description: 'Report formats, watermarks' },
  { id: 'offer', label: 'Offer Letter', icon: 'eva:file-text-fill', color: '#f4511e', description: 'Offer letter templates' },
  { id: 'joining', label: 'Joining Letter', icon: 'eva:file-add-fill', color: '#1565c0', description: 'Joining letter templates' },
  { id: 'experience', label: 'Experience Cert', icon: 'eva:award-fill', color: '#fbc02d', description: 'Experience certificates' },
  { id: 'noc', label: 'NOC Settings', icon: 'eva:checkmark-circle-fill', color: '#512da8', description: 'No Objection Certificate' },
  { id: 'google', label: 'Google Calendar', icon: 'eva:calendar-fill', color: '#4285f4', description: 'Google Calendar sync' },
  { id: 'seo', label: 'SEO', icon: 'eva:search-fill', color: '#00897b', description: 'SEO meta tags' },
  { id: 'cache', label: 'Cache', icon: 'eva:flash-fill', color: '#6d4c41', description: 'Cache management' },
  { id: 'webhook', label: 'Webhooks', icon: 'eva:radio-fill', color: '#7b1fa2', description: 'Webhook configuration' },
  { id: 'cookie', label: 'Cookie Consent', icon: 'eva:info-fill', color: '#f57f17', description: 'Cookie consent banner' },
  { id: 'chatgpt', label: 'ChatGPT/AI', icon: 'eva:message-square-fill', color: '#10a37f', description: 'AI features, OpenAI' },
  { id: 'export', label: 'Export/Import', icon: 'eva:download-fill', color: '#455a64', description: 'Data export and import' },
];

export default function GeneralSettingsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [stats, setStats] = useState({ 
    total: SETTING_CATEGORIES.length, 
    configured: 0, 
    pending: 0, 
    completion: 0 
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await generalSettingsService.getAll();
      console.log('General Settings Response:', response);
      
      if (response && response.settings) {
        setSettings(response.settings);
        
        // Calculate stats
        const configured = Object.keys(response.settings).filter(
          key => response.settings[key] && Object.keys(response.settings[key]).length > 0
        ).length;
        
        const pending = SETTING_CATEGORIES.length - configured;
        const completion = Math.round((configured / SETTING_CATEGORIES.length) * 100);
        
        setStats({ 
          total: SETTING_CATEGORIES.length, 
          configured, 
          pending, 
          completion 
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      enqueueSnackbar(`Failed to load settings: ${error.message}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/dashboard/settings/general/${categoryId}`);
  };

  if (loading) {
    return (
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title> General Settings | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="General Settings"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Settings' },
            { name: 'General' },
          ]}
          action={
            <Button
              variant="outlined"
              onClick={fetchSettings}
              startIcon={<Iconify icon="eva:refresh-fill" />}
            >
              Refresh
            </Button>
          }
        />

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.lighter' }}>
              <Typography variant="h2" color="primary.main">{stats.total}</Typography>
              <Typography variant="caption" color="text.secondary">Total Categories</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'success.lighter' }}>
              <Typography variant="h2" color="success.main">{stats.configured}</Typography>
              <Typography variant="caption" color="text.secondary">Configured</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.lighter' }}>
              <Typography variant="h2" color="warning.main">{stats.pending}</Typography>
              <Typography variant="caption" color="text.secondary">Pending</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'info.lighter' }}>
              <Typography variant="h2" color="info.main">{stats.completion}%</Typography>
              <Typography variant="caption" color="text.secondary">Completion</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Settings Categories Grid */}
        <Typography variant="h5" sx={{ mb: 3 }}>
                Settings Categories
              </Typography>

        <Grid container spacing={3}>
          {SETTING_CATEGORIES.map((category) => {
            const categorySettings = settings[category.id] || {};
            const settingCount = Object.keys(categorySettings).length;
            const isConfigured = settingCount > 0;

            return (
              <Grid key={category.id} item xs={12} sm={6} md={4} lg={3}>
                <Card
                    sx={{
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.customShadows.z24,
                    },
                  }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <Stack spacing={2}>
                    {/* Icon */}
                      <Box
                        sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: (theme) => alpha(category.color, 0.16),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                      <Iconify icon={category.icon} width={32} sx={{ color: category.color }} />
                      </Box>
                    
                    {/* Title and Count */}
                    <Box>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="h6" noWrap>{category.label}</Typography>
                        <Chip 
                          label={settingCount} 
                          size="small" 
                          color={isConfigured ? 'success' : 'default'}
                          sx={{ minWidth: 32 }}
                        />
                      </Stack>
                      
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                sx={{
                          display: 'block', 
                          minHeight: 40,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {category.description}
                  </Typography>
                </Box>

                    <Divider />

                    {/* Status */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Chip
                        label={isConfigured ? 'Configured' : 'Not Set'}
                        size="small"
                        color={isConfigured ? 'success' : 'warning'}
                        variant={isConfigured ? 'filled' : 'outlined'}
                      />
                      <Iconify icon="eva:arrow-forward-fill" width={20} sx={{ color: 'text.secondary' }} />
                </Stack>
              </Stack>
                </Card>
                  </Grid>
            );
          })}
                </Grid>

        {/* Info Alert */}
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" icon={<Iconify icon="eva:info-fill" width={24} />}>
            <Typography variant="subtitle2" gutterBottom>
              💡 Quick Tips
            </Typography>
            <Typography variant="body2" component="div">
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>Click on any category card to configure its settings</li>
                <li><strong>Logo & Favicon:</strong> Upload in the "General" category</li>
                <li><strong>Integrations:</strong> Configure Slack, Pusher, MS Teams, Zoom in "Integrations"</li>
                <li><strong>Document Templates:</strong> Offer Letter, Joining Letter, Experience Certificate, NOC</li>
                <li>All changes are saved to the database automatically</li>
              </ul>
            </Typography>
                </Alert>
        </Box>

        {/* Quick Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 3, gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:settings-2-fill" />}
            onClick={() => navigate('/dashboard/settings/configuration')}
          >
            System Configuration
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:layers-fill" />}
            onClick={() => navigate('/dashboard/settings/system-setup')}
          >
            System Setup
                </Button>
        </Stack>
      </Container>
    </>
  );
}

