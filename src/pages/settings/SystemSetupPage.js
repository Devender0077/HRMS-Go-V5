import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  LinearProgress,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// services
import { getSystemSetupCounts } from '../../services/api/systemSetupService';

// ----------------------------------------------------------------------

const CONFIG_ITEMS = [
  // Organization
  { title: 'Branches', icon: 'eva:pin-fill', color: '#1976d2', category: 'organization', key: 'branches', route: '/dashboard/settings/configuration', tab: 'branches' },
  { title: 'Departments', icon: 'eva:briefcase-fill', color: '#1976d2', category: 'organization', key: 'departments', route: '/dashboard/settings/configuration', tab: 'departments' },
  { title: 'Designations', icon: 'eva:award-outline', color: '#1976d2', category: 'organization', key: 'designations', route: '/dashboard/settings/configuration', tab: 'designations' },
  
  // Attendance
  { title: 'Shifts', icon: 'eva:clock-fill', color: '#2e7d32', category: 'attendance', key: 'shifts', route: '/dashboard/settings/configuration', tab: 'shifts' },
  { title: 'Attendance Policies', icon: 'eva:checkmark-circle-fill', color: '#2e7d32', category: 'attendance', key: 'policies', route: '/dashboard/settings/configuration', tab: 'policies' },
  
  // Leave
  { title: 'Leave Types', icon: 'eva:calendar-fill', color: '#f57c00', category: 'leave', key: 'leaveTypes', route: '/dashboard/settings/configuration', tab: 'leaveTypes' },
  { title: 'Leave Policies', icon: 'eva:file-text-outline', color: '#f57c00', category: 'leave', key: 'leavePolicies', route: '/dashboard/settings/configuration', tab: 'leavePolicies' },
  
  // Payroll
  { title: 'Salary Components', icon: 'eva:credit-card-fill', color: '#7b1fa2', category: 'payroll', key: 'salaryComponents', route: '/dashboard/settings/configuration', tab: 'salary' },
  { title: 'Tax Settings', icon: 'eva:percent-outline', color: '#7b1fa2', category: 'payroll', key: 'taxSettings', route: '/dashboard/settings/configuration', tab: 'tax' },
  { title: 'Payment Methods', icon: 'eva:shopping-bag-fill', color: '#7b1fa2', category: 'payroll', key: 'paymentMethods', route: '/dashboard/settings/configuration', tab: 'payment' },
  
  // Recruitment
  { title: 'Job Categories', icon: 'eva:layers-outline', color: '#c62828', category: 'recruitment', key: 'jobCategories', route: '/dashboard/settings/configuration', tab: 'jobCategories' },
  { title: 'Job Types', icon: 'eva:briefcase-outline', color: '#c62828', category: 'recruitment', key: 'jobTypes', route: '/dashboard/settings/configuration', tab: 'jobTypes' },
  { title: 'Hiring Stages', icon: 'eva:trending-up-outline', color: '#c62828', category: 'recruitment', key: 'hiringStages', route: '/dashboard/settings/configuration', tab: 'hiringStages' },
  
  // Performance
  { title: 'KPI Indicators', icon: 'eva:pie-chart-fill', color: '#00796b', category: 'performance', key: 'kpiIndicators', route: '/dashboard/settings/configuration', tab: 'kpiIndicators' },
  { title: 'Review Cycles', icon: 'eva:sync-fill', color: '#00796b', category: 'performance', key: 'reviewCycles', route: '/dashboard/settings/configuration', tab: 'reviewCycles' },
  { title: 'Goal Categories', icon: 'eva:flag-fill', color: '#00796b', category: 'performance', key: 'goalCategories', route: '/dashboard/settings/configuration', tab: 'goalCategories' },
  
  // Training
  { title: 'Training Types', icon: 'eva:book-open-fill', color: '#0288d1', category: 'training', key: 'trainingTypes', route: '/dashboard/settings/configuration', tab: 'trainingTypes' },
  
  // Documents
  { title: 'Document Categories', icon: 'eva:folder-fill', color: '#5e35b1', category: 'documents', key: 'documentCategories', route: '/dashboard/settings/configuration', tab: 'documentCategories' },
  { title: 'Document Types', icon: 'eva:file-text-fill', color: '#5e35b1', category: 'documents', key: 'documentTypes', route: '/dashboard/settings/configuration', tab: 'documentTypes' },
  { title: 'Company Policies', icon: 'eva:shield-fill', color: '#5e35b1', category: 'documents', key: 'companyPolicies', route: '/dashboard/settings/configuration', tab: 'companyPolicies' },
  
  // Awards
  { title: 'Award Types', icon: 'eva:star-fill', color: '#fbc02d', category: 'awards', key: 'awardTypes', route: '/dashboard/settings/configuration', tab: 'awardTypes' },
  
  // Termination
  { title: 'Termination Types', icon: 'eva:close-circle-fill', color: '#d32f2f', category: 'termination', key: 'terminationTypes', route: '/dashboard/settings/configuration', tab: 'terminationTypes' },
  { title: 'Termination Reasons', icon: 'eva:alert-circle-fill', color: '#d32f2f', category: 'termination', key: 'terminationReasons', route: '/dashboard/settings/configuration', tab: 'terminationReasons' },
  
  // Expense
  { title: 'Expense Categories', icon: 'eva:trending-down-fill', color: '#f4511e', category: 'expense', key: 'expenseCategories', route: '/dashboard/settings/configuration', tab: 'expenseCategories' },
  { title: 'Expense Limits', icon: 'eva:pricetags-fill', color: '#f4511e', category: 'expense', key: 'expenseLimits', route: '/dashboard/settings/configuration', tab: 'expenseLimits' },
  
  // Income
  { title: 'Income Categories', icon: 'eva:trending-up-fill', color: '#388e3c', category: 'income', key: 'incomeCategories', route: '/dashboard/settings/configuration', tab: 'incomeCategories' },
  { title: 'Income Sources', icon: 'eva:flash-fill', color: '#388e3c', category: 'income', key: 'incomeSources', route: '/dashboard/settings/configuration', tab: 'incomeSources' },
  
  // Contract
  { title: 'Contract Types', icon: 'eva:file-add-fill', color: '#512da8', category: 'contract', key: 'contractTypes', route: '/dashboard/settings/configuration', tab: 'contractTypes' },
  
  // Messenger
  { title: 'Message Templates', icon: 'eva:message-square-fill', color: '#1565c0', category: 'messenger', key: 'messageTemplates', route: '/dashboard/settings/configuration', tab: 'messageTemplates' },
  { title: 'Notification Settings', icon: 'eva:bell-fill', color: '#1565c0', category: 'messenger', key: 'notificationSettings', route: '/dashboard/settings/configuration', tab: 'notificationSettings' },
];

export default function SystemSetupPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSystemSetupCounts();
      
      if (response.success && response.data) {
        console.log('System Setup - All Counts:', response.data.counts);
        setCounts(response.data.counts);
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching counts:', err);
      setError('Failed to load configuration status');
    } finally {
      setLoading(false);
    }
  };

  const getCount = (category, key) => {
    return counts[category]?.[key] || 0;
  };

  const handleNavigate = (item) => {
    navigate(item.route, { state: { tab: item.tab } });
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
        <title> System Setup | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="System Setup"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Settings' },
            { name: 'System Setup' },
          ]}
          action={
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:settings-2-fill" />}
              onClick={() => navigate('/dashboard/settings/general')}
            >
              General Settings
            </Button>
          }
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.lighter' }}>
              <Typography variant="h2" color="primary.main">{stats.totalItems || CONFIG_ITEMS.length}</Typography>
              <Typography variant="caption" color="text.secondary">Total Settings</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'success.lighter' }}>
              <Typography variant="h2" color="success.main">{stats.configuredItems || stats.configured || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Configured</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.lighter' }}>
              <Typography variant="h2" color="warning.main">{stats.pending || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Pending</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'info.lighter' }}>
              <Typography variant="h2" color="info.main">{stats.completion || 0}%</Typography>
              <Typography variant="caption" color="text.secondary">Completion</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Configuration Items Grid */}
        <Typography variant="h5" sx={{ mb: 3 }}>Configuration Categories</Typography>
        <Grid container spacing={2}>
          {CONFIG_ITEMS.map((item) => {
            const count = getCount(item.category, item.key);
            const isConfigured = count > 0;
                  
                  return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.key}>
                <Card
                        sx={{
                    p: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: '2px solid transparent',
                          '&:hover': {
                      borderColor: item.color,
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                          },
                        }}
                  onClick={() => handleNavigate(item)}
                      >
                  <Stack spacing={1.5}>
                    {/* Icon and Count */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 1.5,
                          bgcolor: alpha(item.color, 0.12),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                        <Iconify icon={item.icon} width={24} sx={{ color: item.color }} />
                    </Box>
                      <Typography variant="h3" color={isConfigured ? 'primary.main' : 'text.disabled'}>
                        {count}
                      </Typography>
                  </Stack>

                    {/* Title */}
                    <Typography variant="subtitle2" noWrap>
                      {item.title}
                    </Typography>

                    {/* Status Indicator */}
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Chip
                        label={isConfigured ? 'Configured' : 'Not Set'}
                                  size="small"
                        color={isConfigured ? 'success' : 'default'}
                        sx={{ height: 20 }}
                      />
                      <Iconify icon="eva:arrow-forward-outline" width={16} sx={{ color: 'text.secondary' }} />
                            </Stack>
                          </Stack>
                        </Card>
                      </Grid>
            );
          })}
                  </Grid>

        {/* Quick Actions */}
        <Card sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:settings-2-fill" />}
              onClick={() => navigate('/dashboard/settings/general')}
            >
              General Settings
            </Button>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:people-fill" />}
              onClick={() => navigate('/dashboard/hr/employees')}
            >
              Manage Employees
            </Button>
                  <Button
                    variant="outlined"
              startIcon={<Iconify icon="eva:file-text-fill" />}
              onClick={() => navigate('/dashboard/documents/employee-documents')}
                  >
              Documents
                  </Button>
                    <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:calendar-fill" />}
              onClick={() => navigate('/dashboard/calendar')}
                    >
              Calendar
                    </Button>
          </Stack>
        </Card>

        {/* Help Section */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>How to Use System Setup</Typography>
          <Typography variant="body2">
            • Click any configuration card to manage that setting<br />
            • Green "Configured" chip indicates items are set up<br />
            • Gray "Not Set" chip indicates items need configuration<br />
            • All changes are saved to database and reflect across the entire application
          </Typography>
        </Alert>
      </Container>
    </>
  );
}
