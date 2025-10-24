import PropTypes from 'prop-types';
// @mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Divider,
  Grid,
  Chip,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
// utils
import { fDate, fTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

AttendanceDetailsDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  attendance: PropTypes.object,
};

export default function AttendanceDetailsDialog({ open, onClose, attendance }) {
  if (!attendance) return null;

  const totalHours = parseFloat(attendance.totalHours || attendance.total_hours || 0);
  const overtime = parseFloat(attendance.overtime || 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Attendance Details</Typography>
          <Label color={attendance.status === 'present' ? 'success' : 'error'}>
            {(attendance.status || 'unknown').replace('_', ' ')}
          </Label>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Employee Info */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Employee Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Employee Name
                </Typography>
                <Typography variant="body2">
                  {attendance.employeeName || attendance.employee_name || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Employee ID
                </Typography>
                <Typography variant="body2">
                  {attendance.employeeId || attendance.employee_id || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Stack>

          <Divider />

          {/* Date & Time */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Date & Time
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body2">
                  {fDate(attendance.date)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Clock In
                </Typography>
                <Typography variant="body2">
                  {attendance.clockIn ? fTime(attendance.clockIn) : '-'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Clock Out
                </Typography>
                <Typography variant="body2">
                  {attendance.clockOut ? fTime(attendance.clockOut) : '-'}
                </Typography>
              </Grid>
            </Grid>
          </Stack>

          <Divider />

          {/* Hours */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Hours Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Total Hours
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {totalHours > 0 ? `${totalHours.toFixed(2)}h` : '-'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Overtime
                </Typography>
                <Typography variant="h6" color={overtime > 0 ? 'success.main' : 'text.secondary'}>
                  {overtime > 0 ? `${overtime.toFixed(2)}h` : '-'}
                </Typography>
              </Grid>
            </Grid>
          </Stack>

          <Divider />

          {/* Location Info */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Location Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Clock In Location
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="eva:pin-fill" width={16} color="text.secondary" />
                  <Typography variant="body2">
                    {attendance.clockInLocation || attendance.clock_in_location || '-'}
                  </Typography>
                </Stack>
              </Grid>
              {attendance.clockInIp && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    IP Address
                  </Typography>
                  <Typography variant="body2">
                    {attendance.clockInIp || attendance.clock_in_ip}
                  </Typography>
                </Grid>
              )}
              {attendance.deviceInfo && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Device Info
                  </Typography>
                  <Typography variant="body2">
                    {attendance.deviceInfo || attendance.device_info}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Stack>

          {/* Additional Flags */}
          {(attendance.isLate || attendance.is_late || attendance.isEarlyOut || attendance.is_early_out) && (
            <>
              <Divider />
              <Stack direction="row" spacing={1}>
                {(attendance.isLate || attendance.is_late) && (
                  <Chip
                    label="Late Arrival"
                    color="warning"
                    size="small"
                    icon={<Iconify icon="eva:clock-outline" />}
                  />
                )}
                {(attendance.isEarlyOut || attendance.is_early_out) && (
                  <Chip
                    label="Early Departure"
                    color="info"
                    size="small"
                    icon={<Iconify icon="eva:clock-outline" />}
                  />
                )}
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

