import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { 
  Container, Grid, Stack, Button, CircularProgress, Box, Typography, 
  Card, CardHeader, CardContent, List, ListItem, ListItemText, Chip,
  Divider, alpha 
} from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import Iconify from '../../components/iconify';
import { fDate, fDateTime } from '../../utils/formatTime';
//  services
import dashboardService from '../../services/api/dashboardService';
// sections
import {
  AppWidget,
  AppWelcome,
  AppWidgetSummary,
  AppCurrentDownload,
  AppAreaInstalled,
} from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../assets/illustrations';

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const { user } = useAuthContext();
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
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
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/calendar/events?limit=5&upcoming=true`)
          .then(res => res.json())
          .catch(() => []),
      ]);
      
      console.log('Dashboard stats:', statsResponse);
      console.log('Activities:', activitiesResponse);
      console.log('Calendar events:', eventsResponse);
      
      if (statsResponse && statsResponse.data) {
        setDashboardData(statsResponse.data);
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
      enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
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

  const employees = dashboardData?.employees || {};
  const attendance = dashboardData?.attendance || {};
  const leaves = dashboardData?.leaves || {};
  const recruitment = dashboardData?.recruitment || {};
  const training = dashboardData?.training || {};
  const performance = dashboardData?.performance || {};
  const departmentBreakdown = dashboardData?.departmentBreakdown || [];
  const branchBreakdown = dashboardData?.branchBreakdown || [];
  const celebrations = dashboardData?.celebrations || {};

  // Calculate attendance trend for chart
  const attendanceTrendData = attendance.trend || [];
  const attendanceSeries = attendanceTrendData.map(item => item.count || 0);

  // Prepare department breakdown for pie chart
  const deptChartData = departmentBreakdown.slice(0, 5).map(dept => ({
    label: dept.name,
    value: parseInt(dept.count) || 0
  }));

  return (
    <>
      <Helmet>
        <title> Dashboard | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.displayName || user?.name || 'User'}`}
              description="Manage your human resources efficiently. Track employees, attendance, leaves, recruitment, and more all in one place."
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

          {/* Quick Stats Widget */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <AppWidget
                title="Active Employees"
                total={employees.active || 0}
                icon="eva:people-fill"
                chart={{
                  series: employees.total > 0 ? Math.round((employees.active / employees.total) * 100) : 0,
                }}
              />

              <AppWidget
                title="Job Applications"
                total={recruitment.totalApplications || 0}
                icon="eva:file-text-fill"
                color="info"
                chart={{
                  series: recruitment.totalApplications > 0 ? Math.min((recruitment.pendingApplications / recruitment.totalApplications) * 100, 100) : 0,
                }}
              />
            </Stack>
          </Grid>

          {/* Employee Statistics */}
          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Employees"
              percent={2.6}
              total={employees.total || 0}
              chart={{
                colors: [theme.palette.primary.main],
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Present Today"
              percent={parseFloat(attendance.attendanceRate) || 0}
              total={employees.presentToday || 0}
              chart={{
                colors: [theme.palette.success.main],
                series: attendanceSeries.length > 0 ? attendanceSeries : [20, 41, 63, 33, 28, 35, 50],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="On Leave Today"
              percent={employees.total > 0 ? ((employees.onLeave / employees.total) * 100).toFixed(1) : 0}
              total={employees.onLeave || 0}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          {/* Department Distribution */}
          {deptChartData.length > 0 && (
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
                title="Department Distribution"
              chart={{
                colors: [
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.error.main,
                  theme.palette.warning.main,
                    theme.palette.success.main,
                  ],
                  series: deptChartData,
              }}
            />
          </Grid>
          )}

          {/* Attendance Trend */}
          {attendanceTrendData.length > 0 && (
          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled
                title="Attendance Trend"
                subheader="Last 7 days"
              chart={{
                  categories: attendanceTrendData.map(item => {
                    const date = new Date(item.date);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }),
                series: [
                  {
                      year: new Date().getFullYear().toString(),
                    data: [
                        {
                          name: 'Present',
                          data: attendanceTrendData.map(item => item.count || 0)
                        }
                    ],
                  },
                ],
              }}
            />
          </Grid>
          )}

          {/* Additional Stats - Row 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              onClick={() => navigate(PATH_DASHBOARD.leaves.root)}
              sx={{
                p: 3,
                bgcolor: 'primary.lighter',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h3" color="primary.dark">{leaves.pending || 0}</Typography>
                <Typography variant="subtitle2" color="text.secondary">Pending Leave Approvals</Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              onClick={() => navigate(PATH_DASHBOARD.recruitment.root)}
              sx={{
                p: 3,
                bgcolor: 'info.lighter',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h3" color="info.dark">{recruitment.activeJobPostings || 0}</Typography>
                <Typography variant="subtitle2" color="text.secondary">Active Job Postings</Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              onClick={() => navigate(PATH_DASHBOARD.training.root)}
              sx={{
                p: 3,
                bgcolor: 'success.lighter',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h3" color="success.dark">{training.upcoming || 0}</Typography>
                <Typography variant="subtitle2" color="text.secondary">Upcoming Trainings</Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              onClick={() => navigate(PATH_DASHBOARD.performance.root)}
              sx={{
                p: 3,
                bgcolor: 'warning.lighter',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h3" color="warning.dark">{performance.activeGoals || 0}</Typography>
                <Typography variant="subtitle2" color="text.secondary">Active Performance Goals</Typography>
              </Stack>
            </Box>
          </Grid>

          {/* Celebrations */}
          {(celebrations.birthdays > 0 || celebrations.anniversaries > 0) && (
            <Grid item xs={12}>
              <Box sx={{ p: 3, bgcolor: 'background.neutral', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>🎉 Celebrations This Month</Typography>
                <Stack direction="row" spacing={4}>
                  {celebrations.birthdays > 0 && (
                    <Box>
                      <Typography variant="h4" color="primary.main">{celebrations.birthdays}</Typography>
                      <Typography variant="caption" color="text.secondary">Birthdays</Typography>
                    </Box>
                  )}
                  {celebrations.anniversaries > 0 && (
                    <Box>
                      <Typography variant="h4" color="success.main">{celebrations.anniversaries}</Typography>
                      <Typography variant="caption" color="text.secondary">Work Anniversaries</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Grid>
          )}

          {/* Calendar Events & Activities */}
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
                      <React.Fragment key={event.id || index}>
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
                      </React.Fragment>
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

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="⚡ Recent Activities" />
              <Divider />
              <CardContent>
                {activities.length > 0 ? (
                  <List sx={{ py: 0 }}>
                    {activities.slice(0, 5).map((activity, index) => (
                      <React.Fragment key={activity.id || index}>
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
                      </React.Fragment>
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

          {/* Celebrations */}
          {(celebrations.birthdays > 0 || celebrations.anniversaries > 0) && (
            <Grid item xs={12}>
              <Box sx={{ p: 3, bgcolor: 'background.neutral', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>🎉 Celebrations This Month</Typography>
                <Stack direction="row" spacing={4}>
                  {celebrations.birthdays > 0 && (
                    <Box>
                      <Typography variant="h4" color="primary.main">{celebrations.birthdays}</Typography>
                      <Typography variant="caption" color="text.secondary">Birthdays</Typography>
                    </Box>
                  )}
                  {celebrations.anniversaries > 0 && (
                    <Box>
                      <Typography variant="h4" color="success.main">{celebrations.anniversaries}</Typography>
                      <Typography variant="caption" color="text.secondary">Work Anniversaries</Typography>
                    </Box>
                  )}
            </Stack>
              </Box>
            </Grid>
          )}

          {/* Quick Stats Summary */}
          <Grid item xs={12}>
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>📊 Quick Overview</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">{employees.newThisMonth || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">New Hires (Month)</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">{recruitment.pendingApplications || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Pending Applications</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">{training.total || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Training Programs</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">{performance.totalGoals || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Performance Goals</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">{departmentBreakdown.length || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Departments</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">{branchBreakdown.length || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Branches</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
