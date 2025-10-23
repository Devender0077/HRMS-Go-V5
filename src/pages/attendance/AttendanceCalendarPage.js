import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
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
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

// Status codes and their meanings
const STATUS_CODES = {
  P: { label: 'Present', color: '#4caf50', bgColor: '#e8f5e9' },
  A: { label: 'Absent', color: '#f44336', bgColor: '#ffebee' },
  HD: { label: 'Half Day', color: '#ff9800', bgColor: '#fff3e0' },
  WD: { label: 'Weekly Off', color: '#9e9e9e', bgColor: '#f5f5f5' },
  L: { label: 'Leave', color: '#2196f3', bgColor: '#e3f2fd' },
  H: { label: 'Holiday', color: '#9c27b0', bgColor: '#f3e5f5' },
  LT: { label: 'Late', color: '#ff5722', bgColor: '#fbe9e7' },
  EO: { label: 'Early Out', color: '#ff6f00', bgColor: '#fff8e1' },
  OT: { label: 'Overtime', color: '#00bcd4', bgColor: '#e0f7fa' },
  '-': { label: 'No Data', color: '#bdbdbd', bgColor: '#fafafa' },
};

// Generate mock attendance data for a month
const generateMonthData = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const employees = [
    { id: 1, name: 'John Doe', empId: 'EMP001', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', empId: 'EMP002', department: 'Marketing' },
    { id: 3, name: 'Bob Johnson', empId: 'EMP003', department: 'Engineering' },
    { id: 4, name: 'Alice Williams', empId: 'EMP004', department: 'HR' },
    { id: 5, name: 'Charlie Brown', empId: 'EMP005', department: 'Sales' },
  ];

  return employees.map((emp) => {
    const attendance = {};
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      
      // Sunday = Weekly Off
      if (dayOfWeek === 0) {
        attendance[day] = 'WD';
      }
      // Random attendance for demo
      else {
        const random = Math.random();
        if (random > 0.9) attendance[day] = 'A';
        else if (random > 0.85) attendance[day] = 'HD';
        else if (random > 0.8) attendance[day] = 'L';
        else if (random > 0.75) attendance[day] = 'LT';
        else if (random > 0.7) attendance[day] = 'EO';
        else if (random > 0.65) attendance[day] = 'OT';
        else attendance[day] = 'P';
      }
    }
    return {
      ...emp,
      attendance,
    };
  });
};

// ----------------------------------------------------------------------

export default function AttendanceCalendarPage() {
  const { themeStretch } = useSettingsContext();

  const currentDate = new Date();
  const [filterMonth, setFilterMonth] = useState(currentDate.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(currentDate.getFullYear());
  const [filterDepartment, setFilterDepartment] = useState('all');

  const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();
  const monthData = generateMonthData(filterYear, filterMonth);

  const handleExport = () => {
    console.log('Export calendar');
  };

  const handlePrint = () => {
    window.print();
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
      WD: 0,
      L: 0,
      H: 0,
      LT: 0,
      EO: 0,
      OT: 0,
    };
    
    Object.values(attendance).forEach((status) => {
      if (summary[status] !== undefined) {
        summary[status] += 1;
      }
    });
    
    return summary;
  };

  // Render status cell
  const renderStatusCell = (status) => {
    const statusInfo = STATUS_CODES[status] || STATUS_CODES['-'];
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
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: 1,
          },
        }}
        title={statusInfo.label}
      >
        {status}
      </Box>
    );
  };

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
                variant="outlined"
                startIcon={<Iconify icon="eva:printer-fill" />}
                onClick={handlePrint}
              >
                Print
              </Button>
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

        {/* Filters */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Department"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <MenuItem value="all">All Departments</MenuItem>
                <MenuItem value="engineering">Engineering</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="hr">Human Resources</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button fullWidth variant="contained" size="large">
                Generate Calendar
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Legend */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Legend:
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {Object.entries(STATUS_CODES).map(([code, info]) => (
              code !== '-' && (
                <Chip
                  key={code}
                  label={`${code} - ${info.label}`}
                  size="small"
                  sx={{
                    bgcolor: info.bgColor,
                    color: info.color,
                    fontWeight: 600,
                    border: `1px solid ${info.color}`,
                  }}
                />
              )
            ))}
          </Stack>
        </Card>

        {/* Calendar Table */}
        <Card sx={{ p: 2 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 1200 }}>
              <Table size="small" sx={{ '& .MuiTableCell-root': { px: 1, py: 1.5 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        position: 'sticky',
                        left: 0,
                        bgcolor: 'background.paper',
                        zIndex: 2,
                        minWidth: 180,
                        borderRight: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="subtitle2">Employee</Typography>
                    </TableCell>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      const dayOfWeek = getDayOfWeek(day);
                      const isWeekend = dayOfWeek === 'Sun';
                      return (
                        <TableCell
                          key={day}
                          align="center"
                          sx={{
                            minWidth: 40,
                            bgcolor: isWeekend ? 'action.hover' : 'background.paper',
                            borderLeft: day === 1 ? '2px solid' : '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Typography variant="caption" fontWeight={600}>
                            {day}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {dayOfWeek}
                          </Typography>
                        </TableCell>
                      );
                    })}
                    <TableCell
                      sx={{
                        position: 'sticky',
                        right: 0,
                        bgcolor: 'background.paper',
                        zIndex: 2,
                        minWidth: 150,
                        borderLeft: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="subtitle2">Summary</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {monthData.map((employee) => {
                    const summary = calculateSummary(employee.attendance);
                    return (
                      <TableRow key={employee.id} hover>
                        <TableCell
                          sx={{
                            position: 'sticky',
                            left: 0,
                            bgcolor: 'background.paper',
                            zIndex: 1,
                            borderRight: '2px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" noWrap>
                              {employee.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {employee.empId}
                            </Typography>
                          </Box>
                        </TableCell>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                          const dayOfWeek = getDayOfWeek(day);
                          const isWeekend = dayOfWeek === 'Sun';
                          return (
                            <TableCell
                              key={day}
                              align="center"
                              sx={{
                                bgcolor: isWeekend ? 'action.hover' : 'background.paper',
                                borderLeft: day === 1 ? '2px solid' : '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              {renderStatusCell(employee.attendance[day] || '-')}
                            </TableCell>
                          );
                        })}
                        <TableCell
                          sx={{
                            position: 'sticky',
                            right: 0,
                            bgcolor: 'background.paper',
                            zIndex: 1,
                            borderLeft: '2px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Stack spacing={0.25}>
                            <Typography variant="caption">
                              <strong>P:</strong> {summary.P} | <strong>A:</strong> {summary.A} | <strong>HD:</strong> {summary.HD}
                            </Typography>
                            <Typography variant="caption">
                              <strong>L:</strong> {summary.L} | <strong>WD:</strong> {summary.WD} | <strong>LT:</strong> {summary.LT}
                            </Typography>
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

        {/* Footer Info */}
        <Card sx={{ p: 2, mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            * Click on any date cell to view detailed attendance information
          </Typography>
        </Card>
      </Container>
    </>
  );
}

