import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container, Grid, Button, CircularProgress, Box, Typography,
  Card, CardHeader, CardContent, List, ListItem, ListItemText, Chip, Divider, alpha,
} from '@mui/material';
// date pickers
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import Iconify from '../../components/iconify';
import { fDate, fDateTime } from '../../utils/formatTime';
// services
import dashboardService from '../../services/api/dashboardService';
// sections
import {
  AppWidget,
  AppWelcome,
  AppWidgetSummary,
} from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../assets/illustrations';
// Role-based dashboards
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';

// ----------------------------------------------------------------------

export default function HRMSDashboardPage() {
  const { user } = useAuthContext();
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  // All hooks must be called before any conditional returns
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingApprovals: 0,
    newApplications: 0,
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Route to role-based dashboard (check BEFORE fetching data)
  const userType = user?.userType;

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all dashboard data in parallel
      const [statsResponse, activitiesResponse, eventsResponse] = await Promise.all([
        dashboardService.getStats().catch(() => ({ data: null })),
        dashboardService.getRecentActivities(10).catch(() => ({ data: [] })),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/calendar/events?limit=5`)
          .then((res) => res.json())
          .catch(() => []),
      ]);

      if (statsResponse && statsResponse.data) {
        const { employees, attendance, leaves, recruitment } = statsResponse.data;
        setDashboardData(statsResponse.data);

        setStats({
          totalEmployees: employees?.total || 0,
          presentToday: employees?.presentToday || attendance?.presentToday || 0,
          onLeave: employees?.onLeave || leaves?.onLeaveToday || 0,
          pendingApprovals: leaves?.pending || 0,
          newApplications: recruitment?.pendingApplications || 0,
        });
      }

      if (activitiesResponse && activitiesResponse.data) {
        setActivities(activitiesResponse.data);
      }

      if (Array.isArray(eventsResponse)) {
        setCalendarEvents(eventsResponse);
      } else if (eventsResponse?.data) {
        setCalendarEvents(eventsResponse.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data for HR/Admin roles
    if (userType !== 'employee' && userType !== 'manager') {
      fetchAllDashboardData();
    }
  }, [userType]);

  // Render role-specific dashboard for employees and managers
  if (userType === 'employee') {
    return <EmployeeDashboard />;
  }

  if (userType === 'manager') {
    return <ManagerDashboard />;
  }

  // HR, HR Manager, and Super Admin see the full dashboard below

  return (
    <>
      <Helmet>
        <title> Dashboard | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'} disableGutters={themeStretch}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.displayName || 'User'}`}
              description="Manage your human resources efficiently with our comprehensive HRMS platform. Track employees, attendance, leaves, and more."
              img={
                <SeoIllustration
                  sx={{
                    p: 2,
                    width: 320,
                    maxWidth: '100%',
                    height: 'auto',
                    margin: { xs: 'auto', md: 0 },
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

          {/* Calendar beside Welcome Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="📅 Calendar" sx={{ mb: 1 }} />
              <Divider />
              <CardContent
                sx={{
                  p: 2,
                  pt: 1.5,
                  '&:last-child': { pb: 2 },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <CalendarPicker
                    date={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    sx={{
                      width: '100%',
                      maxWidth: 320,
                      m: 0,
                      '& .MuiPickersCalendarHeader-root': { 
                        px: 1,
                        mb: 1.5,
                        justifyContent: 'space-between'
                      },
                      '& .MuiPickersCalendarHeader-label': { 
                        fontSize: 15,
                        fontWeight: 600
                      },
                      '& .MuiDayCalendar-header': { 
                        justifyContent: 'space-around',
                        mb: 1
                      },
                      '& .MuiPickersDay-root': { 
                        fontSize: 13,
                        margin: '2px'
                      },
                      '& .MuiDayCalendar-weekContainer': {
                        justifyContent: 'space-around'
                      }
                    }}
                  />
                </LocalizationProvider>
              </CardContent>
            </Card>
          </Grid>

          {/* Key widgets */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <AppWidget
                  title="Active Employees"
                  total={stats.totalEmployees}
                  icon="eva:people-fill"
                  chart={{ series: stats.totalEmployees > 0 ? 75 : 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <AppWidget
                  title="Pending Approvals"
                  total={stats.pendingApprovals}
                  icon="eva:checkmark-circle-fill"
                  color="warning"
                  chart={{ series: stats.pendingApprovals > 0 ? Math.min((stats.pendingApprovals / 20) * 100, 100) : 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <AppWidget
                  title="New Applications"
                  total={stats.newApplications}
                  icon="eva:file-text-fill"
                  color="info"
                  chart={{ series: stats.newApplications > 0 ? Math.min((stats.newApplications / 40) * 100, 100) : 0 }}
                />
              </Grid>
            </Grid>
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
                  percent={stats.totalEmployees ? parseFloat(((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)) : 0}
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
                  percent={stats.totalEmployees ? parseFloat(((stats.onLeave / stats.totalEmployees) * 100).toFixed(1)) : 0}
                  total={stats.onLeave}
                  chart={{
                    colors: [theme.palette.warning.main],
                    series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
                  }}
                />
              </Grid>
            </>
          )}

          {/* Calendar Events */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="📅 Upcoming Events"
                sx={{ mb: 1 }}
                action={
                  <Button size="small" onClick={() => navigate(PATH_DASHBOARD.calendar)}>
                    View All
                  </Button>
                }
              />
              <Divider />
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {calendarEvents.length > 0 ? (
                  <List disablePadding>
                    {calendarEvents.slice(0, 5).map((event, index) => (
                      <Box key={event.id || index}>
                        <ListItem sx={{ px: 0, py: 1.25 }}>
                          <Box sx={{ mr: 2, minWidth: 40 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: (t) => alpha(t.palette.info.main, 0.16),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Iconify icon="eva:calendar-fill" width={24} sx={{ color: 'info.main' }} />
                            </Box>
                          </Box>
                          <ListItemText
                            primary={event.title}
                            secondary={event.start_date ? fDate(event.start_date) : 'No date'}
                            primaryTypographyProps={{ variant: 'subtitle2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                          <Chip label={event.event_type || event.eventType || 'event'} size="small" variant="outlined" />
                        </ListItem>
                        {index < calendarEvents.length - 1 && <Divider component="li" />}
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    No upcoming events. Add events in Calendar module.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="⚡ Recent Activities" sx={{ mb: 1 }} />
              <Divider />
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {activities.length > 0 ? (
                  <List disablePadding>
                    {activities.slice(0, 8).map((activity, index) => (
                      <Box key={activity.id || index}>
                        <ListItem sx={{ px: 0, py: 1.25 }}>
                          <Box sx={{ mr: 2, minWidth: 40 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: (t) =>
                                  alpha(
                                    activity.type === 'leave' ? t.palette.warning.main
                                      : activity.type === 'attendance' ? t.palette.success.main
                                      : t.palette.primary.main,
                                    0.16
                                  ),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Iconify
                                icon={
                                  activity.type === 'leave' ? 'eva:calendar-outline'
                                    : activity.type === 'attendance' ? 'eva:clock-outline'
                                    : 'eva:person-add-outline'
                                }
                                width={24}
                                sx={{
                                  color:
                                    activity.type === 'leave' ? 'warning.main'
                                      : activity.type === 'attendance' ? 'success.main'
                                      : 'primary.main',
                                }}
                              />
                            </Box>
                          </Box>
                          <ListItemText
                            primary={`${activity.employee_name} ${activity.action}`}
                            secondary={activity.created_at ? fDateTime(activity.created_at) : 'Just now'}
                            primaryTypographyProps={{ variant: 'subtitle2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                        {index < activities.length - 1 && <Divider component="li" />}
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    No recent activities. Activities appear as employees use the system.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}