import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container, Grid, Button, CircularProgress, Box, Typography,
  Card, CardHeader, CardContent, List, ListItem, ListItemText, Chip, Divider, alpha, Stack,
  Avatar, AvatarGroup, LinearProgress, IconButton, Popover, Dialog, DialogTitle, DialogContent,
  DialogActions, Drawer, Badge,
} from '@mui/material';
// date pickers
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
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

  // All hooks must be called before any conditional returns
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
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  
  // Calendar interaction states
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Role checks
  const isEmployee = user?.userType === 'employee';
  const isManager = user?.userType === 'manager';
  const isHR = user?.userType === 'hr';
  const isHRManager = user?.userType === 'hr_manager';
  const isAdmin = user?.userType === 'super_admin';
  const isManagerOrHR = isManager || isHR || isHRManager || isAdmin;

  // Helper function to get event color based on type
  const getEventColor = (eventType) => {
    const type = (eventType || 'meeting').toLowerCase();
    if (type.includes('meeting') || type.includes('conference')) return theme.palette.info.main;
    if (type.includes('birthday') || type.includes('personal')) return theme.palette.success.main;
    if (type.includes('deadline') || type.includes('due')) return theme.palette.warning.main;
    if (type.includes('holiday') || type.includes('important')) return theme.palette.error.main;
    return theme.palette.primary.main;
  };
  
  // Handle day click on calendar
  const handleDayClick = (day, event) => {
    const dayEvents = calendarEvents.filter((evt) => {
      const eventDate = new Date(evt.start || evt.startDate);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });
    
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
      setSelectedDate(day);
      setPopoverAnchor(event.currentTarget);
    }
  };
  
  // Close popover
  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };
  
  // Open event modal
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEventModalOpen(true);
    handlePopoverClose();
  };
  
  // Close event modal
  const handleModalClose = () => {
    setEventModalOpen(false);
    setSelectedEvent(null);
  };
  
  // Open drawer
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    handlePopoverClose();
  };
  
  // Close drawer
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

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
      
      // Mock upcoming birthdays (will be real data later)
      setUpcomingBirthdays([
        { id: 1, name: 'John Doe', date: 'Nov 15', avatar: '/assets/images/avatars/avatar_1.jpg' },
        { id: 2, name: 'Jane Smith', date: 'Nov 18', avatar: '/assets/images/avatars/avatar_2.jpg' },
        { id: 3, name: 'Mike Johnson', date: 'Nov 22', avatar: '/assets/images/avatars/avatar_3.jpg' },
      ]);
      
      // Mock pending leaves for managers
      if (isManagerOrHR) {
        setPendingLeaves([
          { id: 1, employeeName: 'Sarah Wilson', leaveType: 'Annual Leave', days: 3, startDate: 'Nov 10' },
          { id: 2, employeeName: 'Tom Brown', leaveType: 'Sick Leave', days: 1, startDate: 'Nov 12' },
        ]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data for all roles now (unified dashboard)
    fetchAllDashboardData();
  }, []);

  // Unified dashboard for all roles (no more separate dashboards)

  return (
    <>
      <Helmet>
        <title> Dashboard | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'} disableGutters={themeStretch}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12} lg={8}>
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
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader 
                title="Calendar" 
                subheader={calendarEvents.length > 0 ? `${calendarEvents.length} upcoming events` : 'No events scheduled'}
                sx={{ pb: 1 }} 
              />
              <Divider />
              <Box sx={{ px: 1.5, py: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <StaticDatePicker
                    orientation="portrait"
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    displayStaticWrapperAs="desktop"
                    renderInput={(params) => <Box {...params} />}
                    renderDay={(day, _value, DayComponentProps) => {
                      const dayEvents = calendarEvents.filter((event) => {
                        const eventDate = new Date(event.start || event.startDate);
                        return (
                          eventDate.getDate() === day.getDate() &&
                          eventDate.getMonth() === day.getMonth() &&
                          eventDate.getFullYear() === day.getFullYear()
                        );
                      });
                      
                      const hasEvents = dayEvents.length > 0;
                      const primaryEvent = dayEvents[0];
                      const badgeColor = hasEvents ? getEventColor(primaryEvent?.event_type || primaryEvent?.eventType) : '';
                      
                      return (
                        <Box 
                          sx={{ position: 'relative' }}
                          onClick={(e) => {
                            if (hasEvents) {
                              e.stopPropagation();
                              handleDayClick(day, e);
                            }
                          }}
                        >
                          <Button
                            {...DayComponentProps}
                            sx={{
                              ...DayComponentProps.sx,
                              cursor: hasEvents ? 'pointer' : 'default',
                            }}
                          />
                          {hasEvents && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 4,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: badgeColor,
                                pointerEvents: 'none',
                              }}
                            />
                          )}
                        </Box>
                      );
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiCalendarPicker-root': {
                        width: '100%',
                        maxWidth: '100%',
                        margin: 0,
                      },
                      '& .MuiPickersCalendarHeader-root': {
                        paddingLeft: 1,
                        paddingRight: 1,
                        marginTop: 0,
                        marginBottom: 1,
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      },
                      '& .MuiDayCalendar-header': {
                        justifyContent: 'space-between',
                        paddingLeft: 0.5,
                        paddingRight: 0.5,
                      },
                      '& .MuiDayCalendar-weekContainer': {
                        justifyContent: 'space-between',
                        margin: 0,
                      },
                      '& .MuiDayCalendar-slideTransition': {
                        minHeight: 220,
                      },
                      '& .MuiPickersDay-root': {
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        margin: 0,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                      },
                      '& .MuiPickersDay-today': {
                        borderColor: theme.palette.primary.main,
                        fontWeight: 600,
                      },
                      '& .Mui-selected': {
                        backgroundColor: `${theme.palette.primary.main} !important`,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
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

          {/* 1. Upcoming Birthdays Widget - All Roles */}
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardHeader 
                title={isEmployee ? "Team Birthdays" : "Upcoming Birthdays"} 
                avatar={
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Iconify icon="eva:gift-outline" width={24} sx={{ color: 'error.main' }} />
                  </Box>
                }
                sx={{ mb: 1 }} 
              />
              <Divider />
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {upcomingBirthdays.length > 0 ? (
                  <List disablePadding>
                    {upcomingBirthdays.map((birthday, index) => (
                      <Box key={birthday.id}>
                        <ListItem
                          sx={{
                            px: 0,
                            py: 1.5,
                          }}
                        >
                          <Avatar
                            alt={birthday.name}
                            src={birthday.avatar}
                            sx={{ width: 40, height: 40, mr: 2 }}
                          >
                            {birthday.name.charAt(0)}
                          </Avatar>
                          <ListItemText
                            primary={birthday.name}
                            secondary={birthday.date}
                            primaryTypographyProps={{ variant: 'subtitle2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                          <IconButton size="small" color="error">
                            <Iconify icon="eva:gift-fill" width={20} />
                          </IconButton>
                        </ListItem>
                        {index < upcomingBirthdays.length - 1 && <Divider component="li" />}
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    No upcoming birthdays this week
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* 2. Leave Approvals (Managers/HR Only) */}
          {isManagerOrHR && (
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardHeader 
                  title="Pending Leave Approvals" 
                  avatar={
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.warning.main, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Iconify icon="eva:clock-outline" width={24} sx={{ color: 'warning.main' }} />
                    </Box>
                  }
                  action={
                    <Chip label={pendingLeaves.length} size="small" color="warning" />
                  }
                  sx={{ mb: 1 }} 
                />
                <Divider />
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  {pendingLeaves.length > 0 ? (
                    <Stack spacing={2}>
                      {pendingLeaves.map((leave) => (
                        <Box
                          key={leave.id}
                          sx={{
                            p: 2,
                            borderRadius: 1.5,
                            bgcolor: 'background.neutral',
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">{leave.employeeName}</Typography>
                            <Chip label={`${leave.days}d`} size="small" />
                          </Stack>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            {leave.leaveType} • From {leave.startDate}
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Button size="small" variant="contained" color="success" fullWidth>
                              Approve
                            </Button>
                            <Button size="small" variant="outlined" color="error" fullWidth>
                              Reject
                            </Button>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      No pending leave requests
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* 3. Performance Overview - All Roles */}
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardHeader 
                title={isEmployee ? "My Performance" : isManager ? "Team Performance" : "Performance Overview"} 
                avatar={
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Iconify icon="eva:trending-up-outline" width={24} sx={{ color: 'primary.main' }} />
                  </Box>
                }
                sx={{ mb: 1 }} 
              />
              <Divider />
              <CardContent>
                <Stack spacing={2.5}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">Goals Completed</Typography>
                      <Typography variant="subtitle2" color="primary.main">75%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={75} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">Tasks Completed</Typography>
                      <Typography variant="subtitle2" color="success.main">85%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={85} color="success" sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">Training Progress</Typography>
                      <Typography variant="subtitle2" color="info.main">60%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={60} color="info" sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Calendar Events */}
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardHeader
                title="Upcoming Events"
                avatar={
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.info.main, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Iconify icon="eva:calendar-outline" width={24} sx={{ color: 'info.main' }} />
                  </Box>
                }
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
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardHeader 
                title="Recent Activities" 
                avatar={
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.warning.main, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Iconify icon="eva:activity-outline" width={24} sx={{ color: 'warning.main' }} />
                  </Box>
                }
                sx={{ mb: 1 }} 
              />
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

      {/* Event Popover (A) */}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ p: 2, minWidth: 300, maxWidth: 400 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {fDate(selectedDate)} - {selectedDayEvents.length} Event{selectedDayEvents.length > 1 ? 's' : ''}
          </Typography>
          <List disablePadding>
            {selectedDayEvents.map((event, index) => (
              <Box key={event.id || index}>
                <ListItem
                  sx={{ px: 0, py: 1, cursor: 'pointer' }}
                  onClick={() => handleEventClick(event)}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: getEventColor(event.event_type || event.eventType),
                      mr: 1.5,
                    }}
                  />
                  <ListItemText
                    primary={event.title || event.eventTitle}
                    secondary={event.start_time || event.startTime || 'All Day'}
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Chip
                    label={event.event_type || event.eventType || 'Event'}
                    size="small"
                    sx={{ bgcolor: alpha(getEventColor(event.event_type || event.eventType), 0.1) }}
                  />
                </ListItem>
                {index < selectedDayEvents.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={handleOpenDrawer}
              startIcon={<Iconify icon="eva:clock-outline" />}
            >
              Timeline
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={() => navigate(PATH_DASHBOARD.calendar)}
              startIcon={<Iconify icon="eva:plus-outline" />}
            >
              Add Event
            </Button>
          </Stack>
        </Box>
      </Popover>

      {/* Event Modal (B) */}
      <Dialog
        open={eventModalOpen}
        onClose={handleModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: getEventColor(selectedEvent?.event_type || selectedEvent?.eventType),
              }}
            />
            <Typography variant="h6">{selectedEvent?.title || selectedEvent?.eventTitle}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Date & Time</Typography>
              <Typography variant="body2">
                {selectedEvent && fDateTime(selectedEvent.start || selectedEvent.startDate)}
                {selectedEvent?.end && ` - ${fDateTime(selectedEvent.end || selectedEvent.endDate)}`}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Type</Typography>
              <Chip
                label={selectedEvent?.event_type || selectedEvent?.eventType || 'Event'}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: alpha(getEventColor(selectedEvent?.event_type || selectedEvent?.eventType), 0.1),
                }}
              />
            </Box>
            {selectedEvent?.description && (
              <Box>
                <Typography variant="caption" color="text.secondary">Description</Typography>
                <Typography variant="body2">{selectedEvent.description}</Typography>
              </Box>
            )}
            {selectedEvent?.location && (
              <Box>
                <Typography variant="caption" color="text.secondary">Location</Typography>
                <Typography variant="body2">{selectedEvent.location}</Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Close</Button>
          <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.calendar)}>
            Edit Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Side Drawer Timeline (C) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
      >
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h6">
              {fDate(selectedDate)} - Timeline
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          </Stack>

          <Box sx={{ mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="eva:plus-outline" />}
              onClick={() => navigate(PATH_DASHBOARD.calendar)}
            >
              Add New Event
            </Button>
          </Box>

          <Stack spacing={2}>
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((event, index) => (
                <Card key={event.id || index} sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 4,
                        bgcolor: getEventColor(event.event_type || event.eventType),
                        borderRadius: 2,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">{event.title || event.eventTitle}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.start_time || event.startTime || 'All Day'}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip
                          label={event.event_type || event.eventType || 'Event'}
                          size="small"
                          sx={{
                            bgcolor: alpha(getEventColor(event.event_type || event.eventType), 0.1),
                            fontSize: '0.7rem',
                          }}
                        />
                      </Stack>
                    </Box>
                    <IconButton size="small" onClick={() => handleEventClick(event)}>
                      <Iconify icon="eva:more-vertical-outline" />
                    </IconButton>
                  </Stack>
                </Card>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No events scheduled for this day
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}