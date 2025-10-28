import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState } from 'react';
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
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import {
  useTable,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
} from '../../components/table';
import { useSettingsContext } from '../../components/settings';

// services
import attendanceService from '../../services/attendanceService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', align: 'left' },
  { id: 'dept', label: 'Department', align: 'left' },
  { id: 'present', label: 'Present', align: 'center' },
  { id: 'absent', label: 'Absent', align: 'center' },
  { id: 'halfDay', label: 'Half Day', align: 'center' },
  { id: 'late', label: 'Late', align: 'center' },
  { id: 'onLeave', label: 'On Leave', align: 'center' },
  { id: 'totalHours', label: 'Total Hours', align: 'center' },
];

// Map codes to muster buckets
const CODE_BUCKET = {
  P: 'present',
  A: 'absent',
  HD: 'halfDay',
  LT: 'late',
  L: 'onLeave',
  // WD/H/EO/OT don't affect the 5 buckets here
};

// ----------------------------------------------------------------------

export default function AttendanceMusterPage() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1); // 1..12
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterDepartment, setFilterDepartment] = useState('all');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]); // from /calendar
  const [hoursByEmployee, setHoursByEmployee] = useState({}); // id -> totalHours number
  const [dataLoaded, setDataLoaded] = useState(false); // Track if data has been generated

  // Helpers for month window
  const startDateISO = useMemo(
    () => new Date(filterYear, filterMonth - 1, 1).toISOString().slice(0, 10),
    [filterYear, filterMonth]
  );
  const endDateISO = useMemo(
    () => new Date(filterYear, filterMonth, 0).toISOString().slice(0, 10),
    [filterYear, filterMonth]
  );

  // Fetch calendar (employee + statusByDate) and records (hours) then merge
  const handleGenerateReport = async () => {
    setLoading(true);
    setError('');
    setDataLoaded(false);
    
    console.log('🔄 [Muster] Generating report for:', {
      year: filterYear,
      month: filterMonth,
      department: filterDepartment,
      dateRange: `${startDateISO} to ${endDateISO}`,
    });

    try {
      // 1) Calendar: employees + attendanceByDate
      console.log('📥 [Muster] Fetching calendar data...');
      const calendar = await attendanceService.getCalendar({
        year: filterYear,
        month: filterMonth,
        department: filterDepartment,
      });

      console.log('✅ [Muster] Calendar data received:', calendar);
      const employeeList = Array.isArray(calendar) ? calendar : [];
      setEmployees(employeeList);
      console.log(`📊 [Muster] Loaded ${employeeList.length} employees`);

      // 2) Hours: sum totalHours by employeeId in range
      console.log('📥 [Muster] Fetching attendance records...');
      const recordsRes = await attendanceService.getAttendanceRecordsFiltered({
        startDate: startDateISO,
        endDate: endDateISO,
      });

      console.log('✅ [Muster] Records data received:', recordsRes);
      
      const rows = recordsRes?.data?.attendance || recordsRes?.attendance || [];
      console.log(`📊 [Muster] Processing ${rows.length} attendance records`);
      
      const hoursAgg = rows.reduce((acc, r) => {
        const id = r.employeeId;
        const hrs = parseFloat(r.totalHours ?? r.total_hours ?? 0) || 0;
        acc[id] = (acc[id] || 0) + hrs;
        return acc;
      }, {});

      console.log('✅ [Muster] Hours aggregated:', hoursAgg);
      setHoursByEmployee(hoursAgg);
      setDataLoaded(true);
      console.log('✅ [Muster] Report generated successfully!');
    } catch (e) {
      console.error('❌ [Muster] Error generating report:', e);
      const errorMsg = e?.response?.data?.message || e.message || 'Failed to load muster data';
      setError(errorMsg);
      setEmployees([]);
      setHoursByEmployee({});
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate report on mount
  useEffect(() => {
    handleGenerateReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build table rows from employees + hours + status counts
  const tableData = useMemo(() => {
    // client-side department filter in case API doesn't filter
    const list = (filterDepartment === 'all')
      ? employees
      : employees.filter(e => String(e.department || '').toLowerCase() === String(filterDepartment).toLowerCase());

    return list.map((emp) => {
      const byDate = emp.attendanceByDate || {};
      const buckets = { present: 0, absent: 0, halfDay: 0, late: 0, onLeave: 0 };

      Object.values(byDate).forEach((code) => {
        const key = CODE_BUCKET[code];
        if (key) buckets[key] += 1;
      });

      const totalHours = hoursByEmployee[emp.id] || 0;

      return {
        id: String(emp.id),
        employeeName: emp.name || `Employee ${emp.id}`,
        employeeId: emp.empId || `EMP${emp.id}`,
        department: emp.department || '',
        present: buckets.present,
        absent: buckets.absent,
        halfDay: buckets.halfDay,
        late: buckets.late,
        onLeave: buckets.onLeave,
        totalHours,
      };
    });
  }, [employees, hoursByEmployee, filterDepartment]);

  // Summary cards from tableData
  const summary = useMemo(() => ({
    totalEmployees: tableData.length,
    totalPresent: tableData.reduce((sum, r) => sum + r.present, 0),
    totalAbsent: tableData.reduce((sum, r) => sum + r.absent, 0),
    totalHalfDay: tableData.reduce((sum, r) => sum + r.halfDay, 0),
    totalLate: tableData.reduce((sum, r) => sum + r.late, 0),
    totalHours: tableData.reduce((sum, r) => sum + r.totalHours, 0),
  }), [tableData]);

  const handleExport = async () => {
    try {
      // Dynamically import xlsx library
      const XLSX = await import('xlsx');
      
      // Prepare data for export
      const exportData = tableData.map(row => ({
        'Employee Name': row.employeeName,
        'Employee ID': row.employeeId,
        'Department': row.department,
        'Present': row.present,
        'Absent': row.absent,
        'Half Day': row.halfDay,
        'Late': row.late,
        'On Leave': row.onLeave,
        'Total Hours': row.totalHours.toFixed(2),
      }));

      // Add summary row
      exportData.push({});
      exportData.push({
        'Employee Name': 'SUMMARY',
        'Employee ID': '',
        'Department': `Total Employees: ${summary.totalEmployees}`,
        'Present': summary.totalPresent,
        'Absent': summary.totalAbsent,
        'Half Day': summary.totalHalfDay,
        'Late': summary.totalLate,
        'On Leave': '',
        'Total Hours': summary.totalHours.toFixed(2),
      });

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Muster Report');

      // Generate filename with month and year
      const monthName = new Date(filterYear, filterMonth - 1).toLocaleString('default', { month: 'long' });
      const filename = `Attendance_Muster_${monthName}_${filterYear}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);
      
      console.log('✅ Muster report exported successfully');
    } catch (error) {
      console.error('❌ Error exporting muster report:', error);
      setError('Failed to export report. Please try again.');
    }
  };

  const paged = useMemo(
    () => tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [tableData, page, rowsPerPage]
  );

  return (
    <>
      <Helmet>
        <title> Attendance: Muster Report | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Attendance Muster Report"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Attendance', href: PATH_DASHBOARD.attendance.root },
            { name: 'Muster Report' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:download-fill" />}
              onClick={handleExport}
              disabled={loading || tableData.length === 0}
            >
              Export
            </Button>
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
                onChange={(e) => setFilterMonth(Number(e.target.value))}
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
                onChange={(e) => setFilterYear(Number(e.target.value))}
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
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
              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                onClick={handleGenerateReport}
                disabled={loading}
                startIcon={loading ? <Iconify icon="eos-icons:loading" /> : <Iconify icon="eva:refresh-fill" />}
              >
                {loading ? 'Loading...' : 'Generate Report'}
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">{summary.totalEmployees}</Typography>
              <Typography variant="body2" color="text.secondary">Total Employees</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{summary.totalPresent}</Typography>
              <Typography variant="body2" color="text.secondary">Total Present</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">{summary.totalAbsent}</Typography>
              <Typography variant="body2" color="text.secondary">Total Absent</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">{summary.totalHalfDay}</Typography>
              <Typography variant="body2" color="text.secondary">Half Days</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">{summary.totalLate}</Typography>
              <Typography variant="body2" color="text.secondary">Late Count</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">{summary.totalHours.toFixed(1)}h</Typography>
              <Typography variant="body2" color="text.secondary">Total Hours</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Table */}
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length} align="center">
                        Loading muster data…
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && error && (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ color: 'error.main' }}>
                        {error}
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && !error && paged.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <strong>{row.employeeName}</strong>
                        <br />
                        <span style={{ fontSize: '0.75rem', color: '#637381' }}>
                          {row.employeeId}
        </span>
                      </TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: 'success.lighter',
                            color: 'success.darker',
                            fontWeight: 600,
                          }}
                        >
                          {row.present}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: 'error.lighter',
                            color: 'error.darker',
                            fontWeight: 600,
                          }}
                        >
                          {row.absent}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: 'warning.lighter',
                            color: 'warning.darker',
                            fontWeight: 600,
                          }}
                        >
                          {row.halfDay}
                        </Box>
                      </TableCell>
                      <TableCell align="center">{row.late}</TableCell>
                      <TableCell align="center">{row.onLeave}</TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2">{row.totalHours.toFixed(1)}h</Typography>
                      </TableCell>
                    </TableRow>
                  ))}

                  {!loading && !error && tableData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 8 }}>
                        <Box>
                          <Iconify 
                            icon="eva:file-text-outline" 
                            sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} 
                          />
                          <Typography variant="h6" color="text.secondary">
                            {dataLoaded ? 'No attendance data found' : 'Click "Generate Report" to load attendance data'}
                          </Typography>
                          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                            {dataLoaded 
                              ? 'Try changing the filters and generating the report again'
                              : 'Select month, year, and department, then click the button above'
                            }
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePaginationCustom
            count={tableData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}