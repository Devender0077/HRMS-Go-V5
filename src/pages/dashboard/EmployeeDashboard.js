import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, CardHeader, CardContent, Stack, Button, Divider } from '@mui/material';
// date pickers
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
// components
import { useSettingsContext } from '../../components/settings';
import Iconify from '../../components/iconify';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// sections
import {
  AppWidgetSummary,
  AppCurrentDownload,
  AppAreaInstalled,
} from '../../sections/@dashboard/general/app';
import { AppWelcome } from '../../sections/@dashboard/general/app';
// services
import attendanceService from '../../services/attendanceService';
import leaveService from '../../services/leaveService';

// assets
import { SeoIllustration } from '../../assets/illustrations';

// ----------------------------------------------------------------------

export default function EmployeeDashboard() {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [stats, setStats] = useState({
    presentDays: 0,
    totalDays: 22, // Current month
    pendingLeaves: 0,
    approvedLeaves: 0,
    leaveBalance: 0,
  });
  
  // loading state removed (not required here)

  useEffect(() => {
    fetchEmployeeStats();
  }, []);

  const fetchEmployeeStats = async () => {
    try {
      
      // Fetch attendance
      const attendanceData = await attendanceService.getAttendanceRecords();
      const presentDays = attendanceData?.data?.attendance?.filter(a => a.status === 'present').length || 0;
      
      // Fetch leaves
      const leaveData = await leaveService.getAll({ page: 1, limit: 100 });
      const leaves = leaveData?.data?.leaves || [];
      const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
      const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
      
      setStats({
        presentDays,
        totalDays: 22,
        pendingLeaves,
        approvedLeaves,
        leaveBalance: 15 - approvedLeaves, // Assuming 15 total days
      });
    } catch (error) {
      console.error('Error fetching employee stats:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title> My Dashboard | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
  <Grid container spacing={3} sx={{ py: 3 }}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.displayName || user?.name || 'User'}`}
              description="Manage your human resources efficiently with your personal dashboard. Track attendance, leaves, and more."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 240,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={<Button variant="contained" href="/dashboard/user/profile">My Profile</Button>}
              sx={{ p: 3 }}
            />
          </Grid>

          {/* Calendar beside Welcome Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title=" Calendar" sx={{ mb: 1 }} />
              <Divider />
              <CardContent
                sx={{
                  p: 0,
                  pt: 1,
                  '&:last-child': { p: 0 },
                  '.MuiPickersCalendarHeader-root': { mb: 1, pb: 0 },
                  '.MuiDayCalendar-header': { mb: 0 },
                  '.MuiDayCalendar-weekContainer': { mb: 0 },
                  '.MuiDayCalendar-week': { mb: 0 },
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <CalendarPicker
                    date={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    sx={{
                      p: 0,
                      m: 0,
                      width: '100%',
                      // Ensure the picker doesn't enforce a fixed min width
                      '.MuiCalendarPicker-root': { width: '100%', minWidth: 0 },
                      // Make the day calendar expand and distribute 7 equal columns
                      '.MuiDayCalendar-root': { width: '100%' },
                      '.MuiDayCalendar-weekContainer': {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 0,
                      },
                      // Make the weekday header align to the same 7-column grid and center labels
                      '.MuiDayCalendar-header': {
                          display: 'grid !important',
                          gridTemplateColumns: 'repeat(7, 1fr) !important',
                          alignItems: 'center !important',
                          gap: '0 !important',
                          width: '100% !important',
                          minWidth: '0 !important',
                          maxWidth: '100% !important',
                          overflow: 'hidden',
                          '& .MuiTypography-root': {
                            width: '100% !important',
                            textAlign: 'center !important',
                            fontSize: 'clamp(10px, 2vw, 16px) !important',
                            fontWeight: 500,
                            letterSpacing: 1,
                            m: 0,
                            p: 0,
                            lineHeight: 1.2,
                            display: 'block',
                          },
                      },
                      // Make each pickers day fill its grid cell
                      '.MuiPickersDay-root': {
                        width: '100%',
                        minWidth: '24px',
                        maxWidth: '100%',
                        height: 'auto',
                        aspectRatio: '1 / 1',
                        fontSize: 'clamp(10px, 2vw, 16px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                      },
                      '& .MuiTypography-root': { fontSize: { xs: 12, sm: 13 } },
                    }}
                  />
                </LocalizationProvider>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Attendance This Month"
              percent={stats.totalDays ? (stats.presentDays / stats.totalDays * 100) : 0}
              total={stats.presentDays}
              chart={{
                colors: [theme.palette.success.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Leave Balance"
              percent={stats.leaveBalance > 10 ? 5 : -2}
              total={stats.leaveBalance}
              chart={{
                colors: [theme.palette.info.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Pending Leaves"
              percent={0}
              total={stats.pendingLeaves}
              chart={{
                colors: [theme.palette.warning.main],
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Approved Leaves"
              percent={0}
              total={stats.approvedLeaves}
              chart={{
                colors: [theme.palette.primary.main],
                series: [15, 18, 22, 31, 28, 25, 30, 36, 21, 16],
              }}
            />
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:clock-fill" />}
                    href="/dashboard/attendance/clock"
                  >
                    Clock In/Out
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:calendar-fill" />}
                    href="/dashboard/leaves/apply"
                  >
                    Apply for Leave
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:file-text-fill" />}
                    href="/dashboard/payroll/history"
                  >
                    View Payslips
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:person-fill" />}
                    href="/dashboard/user/profile"
                  >
                    My Profile
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Attendance Chart */}
          <Grid item xs={12} md={6}>
            <AppAreaInstalled
              title="My Attendance (Last 30 Days)"
              subheader="Present vs Absent"
              chart={{
                labels: [
                  '01/01', '01/02', '01/03', '01/04', '01/05',
                  '01/06', '01/07', '01/08', '01/09', '01/10',
                ],
                series: [
                  {
                    name: 'Present',
                    data: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
                  },
                ],
              }}
            />
          </Grid>

          {/* Leave Breakdown */}
          <Grid item xs={12} md={6}>
            <AppCurrentDownload
              title="Leave Balance Breakdown"
              chart={{
                series: [
                  { label: 'Available', value: stats.leaveBalance },
                  { label: 'Used', value: stats.approvedLeaves },
                  { label: 'Pending', value: stats.pendingLeaves },
                ],
                colors: [
                  theme.palette.success.main,
                  theme.palette.error.main,
                  theme.palette.warning.main,
                ],
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

