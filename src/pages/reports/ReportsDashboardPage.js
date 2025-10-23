import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Container,
  Grid,
  Card,
  CardHeader,
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  MenuItem,
  TextField,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const REPORT_CATEGORIES = [
  {
    id: 'attendance',
    title: 'Attendance Reports',
    description: 'Employee attendance, overtime, and time tracking reports',
    icon: 'eva:clock-outline',
    color: 'primary',
    reports: [
      { name: 'Daily Attendance Report', description: 'Daily attendance summary' },
      { name: 'Monthly Attendance Report', description: 'Monthly attendance overview' },
      { name: 'Overtime Report', description: 'Overtime hours and costs' },
      { name: 'Late Arrivals Report', description: 'Late arrival patterns' },
    ],
  },
  {
    id: 'payroll',
    title: 'Payroll Reports',
    description: 'Salary, deductions, and payroll processing reports',
    icon: 'eva:credit-card-outline',
    color: 'success',
    reports: [
      { name: 'Payroll Summary', description: 'Monthly payroll overview' },
      { name: 'Salary Analysis', description: 'Salary distribution analysis' },
      { name: 'Tax Reports', description: 'Tax deductions and filings' },
      { name: 'Bonus Reports', description: 'Bonus and incentive tracking' },
    ],
  },
  {
    id: 'hr',
    title: 'HR Reports',
    description: 'Employee data, performance, and HR analytics',
    icon: 'eva:people-outline',
    color: 'info',
    reports: [
      { name: 'Employee Directory', description: 'Complete employee listing' },
      { name: 'Performance Reviews', description: 'Performance evaluation reports' },
      { name: 'Training Reports', description: 'Training completion and progress' },
      { name: 'Turnover Analysis', description: 'Employee turnover statistics' },
    ],
  },
  {
    id: 'leaves',
    title: 'Leave Reports',
    description: 'Leave balances, requests, and leave analytics',
    icon: 'eva:calendar-outline',
    color: 'warning',
    reports: [
      { name: 'Leave Balance Report', description: 'Employee leave balances' },
      { name: 'Leave Usage Report', description: 'Leave usage patterns' },
      { name: 'Leave Approvals', description: 'Leave approval workflow' },
      { name: 'Holiday Calendar', description: 'Company holidays and events' },
    ],
  },
  {
    id: 'recruitment',
    title: 'Recruitment Reports',
    description: 'Hiring, applications, and recruitment analytics',
    icon: 'eva:person-add-outline',
    color: 'secondary',
    reports: [
      { name: 'Job Posting Report', description: 'Active job postings' },
      { name: 'Application Summary', description: 'Application statistics' },
      { name: 'Hiring Pipeline', description: 'Recruitment pipeline status' },
      { name: 'Cost per Hire', description: 'Recruitment cost analysis' },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance Reports',
    description: 'Legal compliance and audit reports',
    icon: 'eva:shield-outline',
    color: 'error',
    reports: [
      { name: 'Labor Law Compliance', description: 'Labor law adherence reports' },
      { name: 'Audit Trail', description: 'System audit logs' },
      { name: 'Document Compliance', description: 'Document verification status' },
      { name: 'Policy Adherence', description: 'Policy compliance tracking' },
    ],
  },
];

const RECENT_REPORTS = [
  {
    id: 1,
    name: 'Monthly Attendance Report',
    category: 'Attendance',
    generated_by: 'John Doe',
    generated_at: '2024-01-15 10:30 AM',
    status: 'completed',
    file_size: '2.5 MB',
    download_count: 5,
  },
  {
    id: 2,
    name: 'Payroll Summary - December 2023',
    category: 'Payroll',
    generated_by: 'Jane Smith',
    generated_at: '2024-01-14 2:15 PM',
    status: 'completed',
    file_size: '1.8 MB',
    download_count: 12,
  },
  {
    id: 3,
    name: 'Employee Performance Review',
    category: 'HR',
    generated_by: 'Mike Johnson',
    generated_at: '2024-01-13 9:45 AM',
    status: 'processing',
    file_size: '0 MB',
    download_count: 0,
  },
];

// ----------------------------------------------------------------------

export default function ReportsDashboardPage() {
  const { themeStretch } = useSettingsContext();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleGenerateReport = (reportName) => {
    console.log('Generating report:', reportName);
    // Implement report generation logic
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredCategories = selectedCategory === 'all' 
    ? REPORT_CATEGORIES 
    : REPORT_CATEGORIES.filter(cat => cat.id === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Reports Dashboard | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Reports Dashboard"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Reports' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <TextField
                select
                size="small"
                value={selectedCategory}
                onChange={handleCategoryChange}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {REPORT_CATEGORIES.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.title}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:download-outline" />}
              >
                Export All
              </Button>
            </Stack>
          }
        />

        <Grid container spacing={3}>
          {/* Report Categories */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {filteredCategories.map((category) => (
                <Grid item xs={12} md={6} lg={4} key={category.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardHeader
                      avatar={
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: `${category.color}.light`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Iconify 
                            icon={category.icon} 
                            sx={{ color: `${category.color}.main`, fontSize: 24 }}
                          />
                        </Box>
                      }
                      title={
                        <Typography variant="h6" gutterBottom>
                          {category.title}
                        </Typography>
                      }
                      subheader={
                        <Typography variant="body2" color="text.secondary">
                          {category.description}
                        </Typography>
                      }
                    />
                    
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Stack spacing={2}>
                        {category.reports.map((report, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              '&:hover': {
                                bgcolor: 'action.hover',
                                cursor: 'pointer',
                              },
                            }}
                            onClick={() => handleGenerateReport(report.name)}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                  {report.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {report.description}
                                </Typography>
                              </Box>
                              <IconButton size="small">
                                <Iconify icon="eva:arrow-forward-outline" />
                              </IconButton>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Recent Reports */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Recent Reports"
                subheader="Recently generated reports"
                action={
                  <Button size="small" startIcon={<Iconify icon="eva:refresh-outline" />}>
                    Refresh
                  </Button>
                }
              />
              
              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {RECENT_REPORTS.map((report) => (
                    <Box
                      key={report.id}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2">
                              {report.name}
                            </Typography>
                            <Chip
                              label={report.category}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={report.status}
                              size="small"
                              color={getStatusColor(report.status)}
                            />
                          </Stack>
                          
                          <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              By: {report.generated_by}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {report.generated_at}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Size: {report.file_size}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Downloads: {report.download_count}
                            </Typography>
                          </Stack>
                        </Box>
                        
                        <Stack direction="row" spacing={1}>
                          {report.status === 'processing' && (
                            <LinearProgress sx={{ width: 100 }} />
                          )}
                          <IconButton size="small">
                            <Iconify icon="eva:download-outline" />
                          </IconButton>
                          <IconButton size="small">
                            <Iconify icon="eva:share-outline" />
                          </IconButton>
                          <IconButton size="small">
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

