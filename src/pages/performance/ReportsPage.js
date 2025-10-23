import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  Container,
  Grid,
  Card,
  CardHeader,
  Button,
  Stack,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import Iconify from '../../components/iconify';
import performanceService from '../../services/performanceService';

// ----------------------------------------------------------------------

const REPORT_TYPES = [
  { id: 1, title: 'Individual Performance Report', description: 'Detailed performance metrics for individual employees', icon: 'eva:person-fill' },
  { id: 2, title: 'Team Performance Report', description: 'Aggregate performance data for teams and departments', icon: 'eva:people-fill' },
  { id: 3, title: 'Goal Achievement Report', description: 'Track progress and completion of organizational goals', icon: 'eva:flag-fill' },
  { id: 4, title: 'Review Summary Report', description: 'Summary of all performance reviews conducted', icon: 'eva:file-text-fill' },
  { id: 5, title: '360 Feedback Report', description: 'Comprehensive 360-degree feedback analysis', icon: 'eva:pie-chart-fill' },
  { id: 6, title: 'KPI Dashboard Report', description: 'Key performance indicators across organization', icon: 'eva:bar-chart-fill' },
];

const QUICK_STATS = [
  { title: 'Total Reports', value: 156, icon: 'eva:file-text-fill', color: 'primary' },
  { title: 'This Month', value: 24, icon: 'eva:calendar-fill', color: 'info' },
  { title: 'Downloaded', value: 89, icon: 'eva:download-fill', color: 'success' },
  { title: 'Scheduled', value: 12, icon: 'eva:clock-fill', color: 'warning' },
];

// ----------------------------------------------------------------------

export default function PerformanceReportsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch report data
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [goalsResponse, reviewsResponse, feedbackResponse] = await Promise.all([
        performanceService.getGoals(),
        performanceService.getReviews(),
        performanceService.getFeedback()
      ]);

      if (goalsResponse.success && reviewsResponse.success && feedbackResponse.success) {
        setReportData({
          goals: goalsResponse.data || [],
          reviews: reviewsResponse.data || [],
          feedback: feedbackResponse.data || []
        });
      } else {
        enqueueSnackbar('Failed to load report data', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      enqueueSnackbar('Failed to load report data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <>
      <Helmet>
        <title> Performance: Reports | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Performance Reports"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Performance' },
            { name: 'Reports' },
          ]}
        />

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {QUICK_STATS.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Card sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      display: 'flex',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${stat.color}.lighter`,
                      color: `${stat.color}.main`,
                    }}
                  >
                    <Iconify icon={stat.icon} width={24} />
                  </Box>
                  <Box>
                    <Typography variant="h3" color={`${stat.color}.main`}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select label="Department" defaultValue="">
                <MenuItem value="">All Departments</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="engineering">Engineering</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Period</InputLabel>
              <Select label="Period" defaultValue="q4_2024">
                <MenuItem value="q4_2024">Q4 2024</MenuItem>
                <MenuItem value="q3_2024">Q3 2024</MenuItem>
                <MenuItem value="h2_2024">H2 2024</MenuItem>
                <MenuItem value="2024">Year 2024</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label="Status" defaultValue="">
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Card>

        {/* Report Types */}
        <Grid container spacing={3}>
          {REPORT_TYPES.map((report) => (
            <Grid item xs={12} md={6} key={report.id}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                      }}
                    >
                      <Iconify icon={report.icon} width={24} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{report.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {report.description}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" size="small" startIcon={<Iconify icon="eva:eye-fill" />}>
                      View
                    </Button>
                    <Button variant="outlined" size="small" startIcon={<Iconify icon="eva:download-fill" />}>
                      Download
                    </Button>
                    <Button variant="outlined" size="small" startIcon={<Iconify icon="eva:email-fill" />}>
                      Email
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

