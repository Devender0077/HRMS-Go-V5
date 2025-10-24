import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TableRow,
  TableCell,
  Stack,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  Chip,
  TableHead,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
// date
import { format } from 'date-fns';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
// services
import attendanceService from '../../services/attendanceService';
import employeeService from '../../services/api/employeeService';
import departmentService from '../../services/api/departmentService';
import generalSettingsService from '../../services/api/generalSettingsService';

// ----------------------------------------------------------------------

// Status codes and their meanings
const STATUS_CODES = {
  present: { label: 'Present', color: '#4caf50', bgColor: '#e8f5e9', code: 'P' },
  absent: { label: 'Absent', color: '#f44336', bgColor: '#ffebee', code: 'A' },
  half_day: { label: 'Half Day', color: '#ff9800', bgColor: '#fff3e0', code: 'HD' },
  leave: { label: 'Leave', color: '#2196f3', bgColor: '#e3f2fd', code: 'L' },
  late: { label: 'Late', color: '#ff5722', bgColor: '#fbe9e7', code: 'LT' },
  null: { label: 'No Data', color: '#bdbdbd', bgColor: '#fafafa', code: '-' },
};

// ----------------------------------------------------------------------

export default function AttendanceCalendarPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const currentDate = new Date();
  const [filterMonth, setFilterMonth] = useState(currentDate.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(currentDate.getFullYear());
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterEmployee, setFilterEmployee] = useState('all');

  const [loading, setLoading] = useState(false);
  const [monthData, setMonthData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(31);
  
  // Edit dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [editFormData, setEditFormData] = useState({
    clockIn: '',
    clockOut: '',
    status: 'present',
    notes: '',
  });

  // Load departments and employees on mount
  useEffect(() => {
    loadDepartments();
    loadEmployees();
  }, []);

  // Load attendance when filters change
  useEffect(() => {
    loadAttendanceData();
  }, [filterMonth, filterYear, filterDepartment, filterEmployee]);

  const loadDepartments = async () => {
    try {
      const response = await departmentService.getAll();
      if (response.success) {
        setDepartments(response.data || []);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      if (response.success) {
        setEmployees(response.data || []);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      const days = new Date(filterYear, filterMonth, 0).getDate();
      setDaysInMonth(days);

      const startDate = `${filterYear}-${String(filterMonth).padStart(2, '0')}-01`;
      const endDate = `${filterYear}-${String(filterMonth).padStart(2, '0')}-${String(days).padStart(2, '0')}`;

      const params = {
        startDate,
        endDate,
      };

      if (filterDepartment !== 'all') {
        params.departmentId = filterDepartment;
      }
      if (filterEmployee !== 'all') {
        params.employeeId = filterEmployee;
      }

      const response = await attendanceService.getAttendanceRecords(params);
      
      if (response.success) {
        // Group attendance by employee
        const employeeMap = {};
        
        response.data.forEach((record) => {
          const empId = record.employeeId || record.employee_id;
          if (!employeeMap[empId]) {
            employeeMap[empId] = {
              id: empId,
              name: record.Employee?.name || record.employee?.name || `Employee ${empId}`,
              empId: record.Employee?.employee_id || record.employee?.employee_id || `EMP${empId}`,
              department: record.Employee?.Department?.name || record.employee?.department || '-',
              attendance: {},
            };
          }
          
          const day = new Date(record.date).getDate();
          employeeMap[empId].attendance[day] = {
            status: record.status,
            id: record.id,
            clockIn: record.clockIn,
            clockOut: record.clockOut,
            totalHours: record.totalHours,
            date: record.date,
          };
        });

        setMonthData(Object.values(employeeMap));
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      enqueueSnackbar('Failed to load attendance data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadAttendanceData();
  };

  const handleExport = async () => {
    try {
      // Get export format from settings
      const settingsResponse = await generalSettingsService.getByCategory('export');
      const exportFormat = settingsResponse?.settings?.export_default_format || 'excel';
      
      if (exportFormat === 'excel') {
        // Export to Excel
        enqueueSnackbar('Exporting to Excel...', { variant: 'info' });
        // TODO: Implement Excel export
      } else if (exportFormat === 'csv') {
        // Export to CSV
        enqueueSnackbar('Exporting to CSV...', { variant: 'info' });
        // TODO: Implement CSV export
      }
    } catch (error) {
      console.error('Export error:', error);
      enqueueSnackbar('Export failed', { variant: 'error' });
    }
  };

  const handleCellClick = (employee, day) => {
    const attendanceRecord = employee.attendance[day];
    if (!attendanceRecord) {
      enqueueSnackbar('No attendance record for this day', { variant: 'warning' });
      return;
    }

    setSelectedAttendance({
      ...attendanceRecord,
      employeeName: employee.name,
      employeeId: employee.id,
      day,
    });
    
    setEditFormData({
      clockIn: attendanceRecord.clockIn ? format(new Date(attendanceRecord.clockIn), 'HH:mm') : '',
      clockOut: attendanceRecord.clockOut ? format(new Date(attendanceRecord.clockOut), 'HH:mm') : '',
      status: attendanceRecord.status || 'present',
      notes: attendanceRecord.notes || '',
    });
    
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setSelectedAttendance(null);
    setEditFormData({
      clockIn: '',
      clockOut: '',
      status: 'present',
      notes: '',
    });
  };

  const handleEditSave = async () => {
    try {
      const updateData = {
        clockIn: editFormData.clockIn ? `${selectedAttendance.date}T${editFormData.clockIn}:00` : null,
        clockOut: editFormData.clockOut ? `${selectedAttendance.date}T${editFormData.clockOut}:00` : null,
        status: editFormData.status,
        notes: editFormData.notes,
      };

      await attendanceService.updateAttendance(selectedAttendance.id, updateData);
      enqueueSnackbar('Attendance updated successfully', { variant: 'success' });
      handleEditClose();
      loadAttendanceData(); // Refresh data
    } catch (error) {
      console.error('Error updating attendance:', error);
      enqueueSnackbar('Failed to update attendance', { variant: 'error' });
    }
  };

  // Get day of week
  const getDayOfWeek = (day) => {
    const date = new Date(filterYear, filterMonth - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Calculate summary for each employee
  const calculateSummary = (attendance) => {
    const summary = {
      P: 0,
      A: 0,
      HD: 0,
      L: 0,
      LT: 0,
    };
    
    Object.values(attendance).forEach((record) => {
      const status = record.status || '-';
      const statusInfo = STATUS_CODES[status];
      if (statusInfo && summary[statusInfo.code] !== undefined) {
        summary[statusInfo.code] += 1;
      }
    });
    
    return summary;
  };

  // Render status cell
  const renderStatusCell = (employee, day) => {
    const attendanceRecord = employee.attendance[day];
    const status = attendanceRecord?.status || null;
    const statusInfo = STATUS_CODES[status] || STATUS_CODES.null;
    
    return (
      <Box
        sx={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          bgcolor: statusInfo.bgColor,
          color: statusInfo.color,
          fontWeight: 600,
          fontSize: '0.75rem',
          cursor: attendanceRecord ? 'pointer' : 'default',
          transition: 'all 0.2s',
          '&:hover': attendanceRecord ? {
            transform: 'scale(1.1)',
            boxShadow: 1,
          } : {},
        }}
        title={statusInfo.label}
        onClick={() => attendanceRecord && handleCellClick(employee, day)}
      >
        {statusInfo.code}
      </Box>
    );
  };

  const filteredEmployees = employees.filter(emp => {
    if (filterDepartment !== 'all' && emp.departmentId !== parseInt(filterDepartment)) {
      return false;
    }
    if (filterEmployee !== 'all' && emp.id !== parseInt(filterEmployee)) {
      return false;
    }
    return true;
  });

  return (
    <>
      <Helmet>
        <title> Attendance: Calendar Muster | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : false}>
        <CustomBreadcrumbs
          heading="Attendance Calendar Muster"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Attendance', href: PATH_DASHBOARD.attendance.root },
            { name: 'Calendar Muster' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:download-fill" />}
                onClick={handleExport}
              >
                Export
              </Button>
            </Stack>
          }
        />

        {/* Filters & Search */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2.5}>
              <TextField
                select
                fullWidth
                label="Month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <MenuItem key={month} value={month}>
                    {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2.5}>
              <TextField
                select
                fullWidth
                label="Year"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i).map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2.5}>
              <TextField
                select
                fullWidth
                label="Department"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <MenuItem value="all">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2.5}>
              <TextField
                select
                fullWidth
                label="Employee"
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
              >
                <MenuItem value="all">All Employees</MenuItem>
                {filteredEmployees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employee_id})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Iconify icon="eva:search-fill" />}
                onClick={handleSearch}
                disabled={loading}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Legend */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Legend:
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {Object.entries(STATUS_CODES).map(([key, value]) => (
              <Chip
                key={key}
                label={`${value.code} = ${value.label}`}
                size="small"
                sx={{
                  bgcolor: value.bgColor,
                  color: value.color,
                  fontWeight: 600,
                }}
              />
            ))}
          </Stack>
        </Card>

        {/* Calendar Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : monthData.length === 0 ? (
          <Alert severity="info">No attendance data found for the selected period</Alert>
        ) : (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 150, position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 3 }}>
                        <strong>Employee</strong>
                      </TableCell>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                        <TableCell key={day} align="center" sx={{ minWidth: 40, px: 0.5 }}>
                          <Stack spacing={0.5}>
                            <Typography variant="caption" fontWeight={600}>
                              {day}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                              {getDayOfWeek(day)}
                            </Typography>
                          </Stack>
                        </TableCell>
                      ))}
                      <TableCell align="center" sx={{ minWidth: 80, position: 'sticky', right: 0, bgcolor: 'background.paper', zIndex: 3 }}>
                        <strong>Summary</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {monthData.map((employee) => {
                      const summary = calculateSummary(employee.attendance);
                      return (
                        <TableRow key={employee.id} hover>
                          <TableCell sx={{ position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 2 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {employee.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {employee.empId} • {employee.department}
                            </Typography>
                          </TableCell>
                          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                            <TableCell key={day} align="center" sx={{ px: 0.5 }}>
                              {renderStatusCell(employee, day)}
                            </TableCell>
                          ))}
                          <TableCell align="center" sx={{ position: 'sticky', right: 0, bgcolor: 'background.paper', zIndex: 2 }}>
                            <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap">
                              <Chip label={`P:${summary.P}`} size="small" sx={{ bgcolor: STATUS_CODES.present.bgColor, color: STATUS_CODES.present.color }} />
                              <Chip label={`A:${summary.A}`} size="small" sx={{ bgcolor: STATUS_CODES.absent.bgColor, color: STATUS_CODES.absent.color }} />
                              <Chip label={`L:${summary.L}`} size="small" sx={{ bgcolor: STATUS_CODES.leave.bgColor, color: STATUS_CODES.leave.color }} />
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
        )}

        {/* Edit Attendance Dialog */}
        <Dialog open={openEditDialog} onClose={handleEditClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            Edit Attendance
            {selectedAttendance && (
              <Typography variant="caption" display="block" color="text.secondary">
                {selectedAttendance.employeeName} - {format(new Date(filterYear, filterMonth - 1, selectedAttendance.day), 'MMM dd, yyyy')}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Clock In Time"
                type="time"
                value={editFormData.clockIn}
                onChange={(e) => setEditFormData({ ...editFormData, clockIn: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Clock Out Time"
                type="time"
                value={editFormData.clockOut}
                onChange={(e) => setEditFormData({ ...editFormData, clockOut: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                fullWidth
                label="Status"
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="half_day">Half Day</MenuItem>
                <MenuItem value="leave">Leave</MenuItem>
                <MenuItem value="late">Late</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSave}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

