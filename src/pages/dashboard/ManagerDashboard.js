import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, CardContent, Stack, Button } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import Iconify from '../../components/iconify';
// sections
import {
  AppWidgetSummary,
  AppCurrentVisits,
  AppWebsiteVisits,
} from '../../sections/@dashboard/general/app';

// ----------------------------------------------------------------------

export default function ManagerDashboard() {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  
  const [stats, setStats] = useState({
    teamSize: 0,
    presentToday: 0,
    onLeave: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    // Fetch manager team stats
    // This would call APIs to get team data
    setStats({
      teamSize: 12,
      presentToday: 10,
      onLeave: 2,
      pendingApprovals: 3,
    });
  }, []);

  return (
    <>
      <Helmet>
        <title> Manager Dashboard | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Team Overview 👥
        </Typography>

        <Grid container spacing={3}>
          {/* Team Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Team Size"
              percent={0}
              total={stats.teamSize}
              chart={{
                colors: [theme.palette.primary.main],
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Present Today"
              percent={stats.teamSize ? parseFloat(((stats.presentToday / stats.teamSize) * 100).toFixed(1)) : 0}
              total={stats.presentToday}
              chart={{
                colors: [theme.palette.success.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="On Leave"
              percent={stats.teamSize ? parseFloat(((stats.onLeave / stats.teamSize) * 100).toFixed(1)) : 0}
              total={stats.onLeave}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Pending Approvals"
              percent={0}
              total={stats.pendingApprovals}
              chart={{
                colors: [theme.palette.error.main],
                series: [15, 18, 22, 31, 28, 25, 30, 36, 21, 16],
              }}
            />
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Manager Actions
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:checkmark-circle-fill" />}
                    href="/dashboard/leaves/applications"
                  >
                    Approve Leaves
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:people-fill" />}
                    href="/dashboard/hr/employees"
                  >
                    View Team
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:calendar-fill" />}
                    href="/dashboard/attendance/calendar"
                  >
                    Team Attendance
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:bar-chart-fill" />}
                    href="/dashboard/performance/reviews"
                  >
                    Performance Reviews
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Team Attendance Trend */}
          <Grid item xs={12} md={8}>
            <AppWebsiteVisits
              title="Team Attendance Trend"
              subheader="Last 10 Days"
              chart={{
                labels: [
                  '01/01', '01/02', '01/03', '01/04', '01/05',
                  '01/06', '01/07', '01/08', '01/09', '01/10',
                ],
                series: [
                  {
                    name: 'Present',
                    type: 'area',
                    fill: 'gradient',
                    data: [10, 11, 9, 10, 12, 10, 11, 10, 11, 10],
                  },
                  {
                    name: 'On Leave',
                    type: 'area',
                    fill: 'gradient',
                    data: [2, 1, 3, 2, 0, 2, 1, 2, 1, 2],
                  },
                ],
              }}
            />
          </Grid>

          {/* Leave Status Breakdown */}
          <Grid item xs={12} md={4}>
            <AppCurrentVisits
              title="Leave Requests"
              chart={{
                series: [
                  { label: 'Pending', value: 3 },
                  { label: 'Approved', value: 5 },
                  { label: 'Rejected', value: 1 },
                ],
                colors: [
                  theme.palette.warning.main,
                  theme.palette.success.main,
                  theme.palette.error.main,
                ],
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

