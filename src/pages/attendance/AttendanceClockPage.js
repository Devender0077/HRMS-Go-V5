import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
// @mui
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Divider,
  Alert,
} from '@mui/material';
// redux
import {
  selectClockedIn,
  selectCurrentClockInTime,
  selectTodayHours,
  clockInSuccess,
  clockOutSuccess,
  updateTodayHours,
} from '../../redux/slices/attendanceSlice';
import { selectUser } from '../../redux/slices/authSlice';
// components
import { useSettingsContext } from '../../components/settings';
import Iconify from '../../components/iconify';
// utils
import { fDateTime } from '../../utils/formatTime';
import { getAttendanceTrackingData } from '../../utils/locationService';

// ----------------------------------------------------------------------

export default function AttendanceClockPage() {
  const { themeStretch } = useSettingsContext();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const clockedIn = useSelector(selectClockedIn);
  const clockInTime = useSelector(selectCurrentClockInTime);
  const todayHours = useSelector(selectTodayHours);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationData, setLocationData] = useState(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate elapsed time
  useEffect(() => {
    if (clockedIn && clockInTime) {
      const elapsed = Math.floor((currentTime - new Date(clockInTime)) / 1000);
      setElapsedTime(elapsed);
    }
  }, [clockedIn, clockInTime, currentTime]);

  const handleClockIn = async () => {
    setIsProcessing(true);
    try {
      // Get location and IP tracking data
      const trackingData = await getAttendanceTrackingData();
      setLocationData(trackingData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const now = new Date().toISOString();
      dispatch(
        clockInSuccess({
          clockInTime: now,
          employeeId: user?.id,
          date: new Date().toDateString(),
          location: trackingData.location,
          ipAddress: trackingData.ipAddress,
          latitude: trackingData.latitude,
          longitude: trackingData.longitude,
          deviceInfo: trackingData.deviceInfo,
        })
      );
    } catch (error) {
      console.error('Clock in error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClockOut = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const totalHours = (elapsedTime / 3600).toFixed(2);
      dispatch(
        clockOutSuccess({
          clockOutTime: new Date().toISOString(),
          totalHours: parseFloat(totalHours),
        })
      );
      dispatch(updateTodayHours(parseFloat(totalHours)));
    } catch (error) {
      console.error('Clock out error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  };

  return (
    <>
      <Helmet>
        <title> Attendance: Clock In/Out | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {t('attendance.clock_in')} / {t('attendance.clock_out')}
        </Typography>

        <Grid container spacing={3}>
          {/* Current Time Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack spacing={2} alignItems="center">
                  <Iconify
                    icon="eva:clock-outline"
                    width={64}
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography variant="h6">Current Time</Typography>
                  <Typography variant="h3" sx={{ color: 'primary.main' }}>
                    {currentTime.toLocaleTimeString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentTime.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Status Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack spacing={2} alignItems="center">
                  <Iconify
                    icon={clockedIn ? 'eva:checkmark-circle-2-fill' : 'eva:clock-fill'}
                    width={64}
                    sx={{ color: clockedIn ? 'success.main' : 'warning.main' }}
                  />
                  <Typography variant="h6">
                    {clockedIn ? 'Clocked In' : 'Not Clocked In'}
                  </Typography>
                  
                  {clockedIn ? (
                    <>
                      <Typography variant="h3" sx={{ color: 'success.main' }}>
                        {formatElapsedTime(elapsedTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Working since: {fDateTime(clockInTime)}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Click the button below to start your work day
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Clock In/Out Button */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack spacing={3} alignItems="center">
                  <Typography variant="h5">
                    {clockedIn ? 'End Your Work Day' : 'Start Your Work Day'}
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    color={clockedIn ? 'error' : 'success'}
                    startIcon={
                      <Iconify
                        icon={clockedIn ? 'eva:log-out-outline' : 'eva:log-in-outline'}
                      />
                    }
                    onClick={clockedIn ? handleClockOut : handleClockIn}
                    disabled={isProcessing}
                    sx={{
                      minWidth: 200,
                      minHeight: 56,
                      fontSize: '1.1rem',
                    }}
                  >
                    {isProcessing
                      ? 'Processing...'
                      : clockedIn
                      ? 'Clock Out'
                      : 'Clock In'}
                  </Button>

                  {clockedIn && (
                    <Alert severity="info" sx={{ width: '100%' }}>
                      Don't forget to clock out at the end of your work day!
                    </Alert>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Location Tracking Info */}
          {locationData && clockedIn && (
            <Grid item xs={12}>
              <Alert severity="success" icon={<Iconify icon="eva:pin-fill" />}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">
                    Location Tracked Successfully
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {locationData.location}
                  </Typography>
                  <Typography variant="body2">
                    <strong>IP Address:</strong> {locationData.ipAddress}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Device:</strong> {locationData.deviceInfo}
                  </Typography>
                </Stack>
              </Alert>
            </Grid>
          )}

          {/* Today's Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Today's Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: 'primary.main' }}>
                        {clockedIn ? formatElapsedTime(elapsedTime) : '00:00:00'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hours Worked Today
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: 'success.main' }}>
                        {todayHours.toFixed(2)}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Hours (Completed)
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: 'warning.main' }}>
                        {clockedIn ? '1' : '0'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Sessions
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

