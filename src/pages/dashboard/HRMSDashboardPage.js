import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button, CircularProgress, Box } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
// services
import employeeService from '../../services/employeeService';
import attendanceService from '../../services/attendanceService';
import leaveService from '../../services/leaveService';
// sections
import {
  AppWidget,
  AppWelcome,
  AppWidgetSummary,
} from '../../sections/@dashboard/general/app';
import {
  HRMSRecentActivities,
  HRMSQuickActions,
} from '../../sections/@dashboard/hrms';
// assets
import { SeoIllustration } from '../../assets/illustrations';

// ----------------------------------------------------------------------

export default function HRMSDashboardPage() {
  const { user } = useAuthContext();
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingApprovals: 0,
    newApplications: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [employeeStats, attendanceStats, leaveStats] = await Promise.all([
        employeeService.getEmployeeStats().catch(() => ({ data: { total: 0 } })),
        attendanceService.getAttendanceStats({ date: new Date().toISOString().split('T')[0] }).catch(() => ({ data: { present: 0 } })),
        leaveService.getLeaveStats().catch(() => ({ data: { onLeave: 0, pending: 0 } })),
      ]);

      setStats({
        totalEmployees: employeeStats?.data?.total || 0,
        presentToday: attendanceStats?.data?.present || 0,
        onLeave: leaveStats?.data?.onLeave || 0,
        pendingApprovals: leaveStats?.data?.pending || 0,
        newApplications: employeeStats?.data?.newApplications || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {/* Welcome Card - Same beautiful design */}
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.displayName || 'User'}`}
              description="Manage your human resources efficiently with our comprehensive HRMS platform. Track employees, attendance, leaves, and more."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={
                <Button 
                  variant="contained"
                  onClick={() => navigate(PATH_DASHBOARD.hr.employees.list)}
                >
                  View Employees
                </Button>
              }
            />
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <HRMSQuickActions />
          </Grid>

          {/* HRMS Statistics */}
          {loading ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="Total Employees"
                  percent={2.6}
                  total={stats.totalEmployees}
                  chart={{
                    colors: [theme.palette.primary.main],
                    series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="Present Today"
                  percent={stats.totalEmployees ? ((stats.presentToday / stats.totalEmployees) * 100).toFixed(1) : 0}
                  total={stats.presentToday}
                  chart={{
                    colors: [theme.palette.success.main],
                    series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="On Leave"
                  percent={stats.totalEmployees ? ((stats.onLeave / stats.totalEmployees) * 100).toFixed(1) : 0}
                  total={stats.onLeave}
                  chart={{
                    colors: [theme.palette.warning.main],
                    series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
                  }}
                />
              </Grid>
            </>
          )}

          {/* Recent Activities */}
          <Grid item xs={12} md={6} lg={8}>
            <HRMSRecentActivities />
          </Grid>

          {/* Quick Stats Widgets */}
          <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget
                title="Pending Approvals"
                total={stats.pendingApprovals}
                icon="eva:checkmark-circle-fill"
                chart={{
                  series: stats.pendingApprovals > 0 ? Math.min((stats.pendingApprovals / 25) * 100, 100) : 0,
                }}
              />

              <AppWidget
                title="New Applications"
                total={stats.newApplications}
                icon="eva:file-text-fill"
                color="info"
                chart={{
                  series: stats.newApplications > 0 ? Math.min((stats.newApplications / 40) * 100, 100) : 0,
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

