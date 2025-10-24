import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { 
  Container, Grid, Stack, Button, CircularProgress, Box, Typography,
  Card, CardHeader, CardContent, List, ListItem, ListItemText, Chip, Divider, alpha 
} from '@mui/material';
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
  const [dashboardData, setDashboardData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [statsResponse, activitiesResponse, eventsResponse] = await Promise.all([
        dashboardService.getStats().catch(() => ({ data: null })),
        dashboardService.getRecentActivities(10).catch(() => ({ data: [] })),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/calendar/events?limit=5`)
          .then(res => res.json())
          .catch(() => []),
      ]);
      
      console.log('Dashboard stats:', statsResponse);
      console.log('Activities:', activitiesResponse);
      console.log('Calendar events:', eventsResponse);
      
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
      } else if (eventsResponse.data) {
        setCalendarEvents(eventsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

          {/* Quick Widgets */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <AppWidget
                title="Active Employees"
                total={stats.totalEmployees}
                icon="eva:people-fill"
                chart={{
                  series: stats.totalEmployees > 0 ? 75 : 0,
                }}
              />

              <AppWidget
                title="Pending Approvals"
                total={stats.pendingApprovals}
                icon="eva:checkmark-circle-fill"
                color="warning"
                chart={{
                  series: stats.pendingApprovals > 0 ? Math.min((stats.pendingApprovals / 20) * 100, 100) : 0,
                }}
              />
            </Stack>
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
                action={
                  <Button size="small" onClick={() => navigate(PATH_DASHBOARD.calendar)}>
                    View All
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                {calendarEvents.length > 0 ? (
                  <List sx={{ py: 0 }}>
                    {calendarEvents.slice(0, 5).map((event, index) => (
                      <Box key={event.id || index}>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <Box sx={{ mr: 2, minWidth: 40 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: (theme) => alpha(theme.palette.info.main, 0.16),
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
              <CardHeader title="⚡ Recent Activities" />
              <Divider />
              <CardContent>
                {activities.length > 0 ? (
                  <List sx={{ py: 0 }}>
                    {activities.slice(0, 8).map((activity, index) => (
                      <Box key={activity.id || index}>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <Box sx={{ mr: 2, minWidth: 40 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: (theme) => alpha(
                                  activity.type === 'leave' ? theme.palette.warning.main :
                                  activity.type === 'attendance' ? theme.palette.success.main :
                                  theme.palette.primary.main, 
                                  0.16
                                ),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Iconify 
                                icon={
                                  activity.type === 'leave' ? 'eva:calendar-outline' :
                                  activity.type === 'attendance' ? 'eva:clock-outline' :
                                  'eva:person-add-outline'
                                }
                                width={24}
                                sx={{ 
                                  color: activity.type === 'leave' ? 'warning.main' :
                                  activity.type === 'attendance' ? 'success.main' :
                                  'primary.main'
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

