import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  Container,
  Grid,
  Card,
  CardHeader,
  Stack,
  Typography,
  Box,
  LinearProgress,
  Divider,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import Iconify from '../../components/iconify';
import performanceService from '../../services/performanceService';

// ----------------------------------------------------------------------

const STATS = [
  { title: 'Total Goals', value: 24, icon: 'eva:flag-fill', color: 'primary' },
  { title: 'On Track', value: 18, icon: 'eva:checkmark-circle-fill', color: 'success' },
  { title: 'Behind Schedule', value: 4, icon: 'eva:alert-triangle-fill', color: 'warning' },
  { title: 'Completed', value: 2, icon: 'eva:star-fill', color: 'info' },
];

const RECENT_GOALS = [
  { title: 'Increase Sales by 20%', progress: 65, status: 'On Track' },
  { title: 'Complete React Certification', progress: 45, status: 'On Track' },
  { title: 'Reduce Customer Churn', progress: 80, status: 'Ahead' },
  { title: 'Launch New Product', progress: 30, status: 'Behind' },
];

const UPCOMING_REVIEWS = [
  { employee: 'John Doe', type: 'Annual Review', date: '2024-12-20' },
  { employee: 'Jane Smith', type: 'Quarterly Review', date: '2024-12-22' },
  { employee: 'Bob Johnson', type: 'Probation Review', date: '2024-12-25' },
];

// ----------------------------------------------------------------------

export default function PerformanceDashboardPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [stats, setStats] = useState(STATS);
  const [recentGoals, setRecentGoals] = useState(RECENT_GOALS);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [goalsResponse, reviewsResponse] = await Promise.all([
        performanceService.getGoals(),
        performanceService.getReviews()
      ]);

      if (goalsResponse.success && Array.isArray(goalsResponse.data)) {
        const goals = goalsResponse.data;
        const totalGoals = goals.length;
        const onTrack = goals.filter(g => g.status === 'on_track').length;
        const behindSchedule = goals.filter(g => g.status === 'behind_schedule').length;
        const completed = goals.filter(g => g.status === 'completed').length;

        setStats([
          { title: 'Total Goals', value: totalGoals, icon: 'eva:flag-fill', color: 'primary' },
          { title: 'On Track', value: onTrack, icon: 'eva:checkmark-circle-fill', color: 'success' },
          { title: 'Behind Schedule', value: behindSchedule, icon: 'eva:alert-triangle-fill', color: 'warning' },
          { title: 'Completed', value: completed, icon: 'eva:star-fill', color: 'info' },
        ]);

        // Set recent goals (last 5)
        setRecentGoals(goals.slice(0, 5));
      } else {
        enqueueSnackbar('Failed to load performance data', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <Helmet>
        <title> Performance: Dashboard | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Performance Dashboard"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Performance' },
            { name: 'Dashboard' },
          ]}
        />

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {STATS.map((stat) => (
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

        <Grid container spacing={3}>
          {/* Recent Goals */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <CardHeader title="Recent Goals" sx={{ p: 0, mb: 3 }} />
              <Stack spacing={2}>
                {RECENT_GOALS.map((goal, index) => (
                  <Box key={index}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">{goal.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {goal.progress}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={goal.progress}
                      color={
                        goal.progress >= 75 ? 'success' :
                        goal.progress >= 50 ? 'info' :
                        goal.progress >= 25 ? 'warning' : 'error'
                      }
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    {index < RECENT_GOALS.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>

          {/* Upcoming Reviews */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <CardHeader title="Upcoming Reviews" sx={{ p: 0, mb: 3 }} />
              <Stack spacing={2}>
                {UPCOMING_REVIEWS.map((review, index) => (
                  <Box key={index}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          display: 'flex',
                          borderRadius: '50%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'primary.lighter',
                          color: 'primary.main',
                        }}
                      >
                        <Iconify icon="eva:person-fill" width={20} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">{review.employee}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.type}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {review.date}
                      </Typography>
                    </Stack>
                    {index < UPCOMING_REVIEWS.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

