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
  CircularProgress,
  Alert,
  TableHead,
  Chip,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import {
  useTable,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
} from '../../components/table';
// services
import attendanceService from '../../services/attendanceService';
import departmentService from '../../services/api/departmentService';
import employeeService from '../../services/api/employeeService';
import generalSettingsService from '../../services/api/generalSettingsService';
// utils
import * as XLSX from 'xlsx';

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
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

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

  const handleGenerateReport = async () => {
    setLoading(true);
    setHasGenerated(true);
    
    try {
      const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();
      const startDate = `${filterYear}-${String(filterMonth).padStart(2, '0')}-01`;
      const endDate = `${filterYear}-${String(filterMonth).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

      const params = {
        startDate,
        endDate,
      };

      if (filterDepartment !== 'all') {
        params.departmentId = filterDepartment;
      }

      // Fetch attendance records
      const attendanceResponse = await attendanceService.getAttendanceRecords(params);
      
      if (!attendanceResponse.success) {
        throw new Error('Failed to fetch attendance');
      }

      // Group by employee and calculate summary
      const employeeMap = {};
      
      attendanceResponse.data.forEach((record) => {
        const empId = record.employeeId || record.employee_id;
        const empName = record.Employee?.name || record.employee?.name || `Employee ${empId}`;
        const empEmployeeId = record.Employee?.employee_id || record.employee?.employee_id || `EMP${empId}`;
        const empDept = record.Employee?.Department?.name || record.employee?.department || '-';

        if (!employeeMap[empId]) {
          employeeMap[empId] = {
            id: empId,
            employeeName: empName,
            employeeId: empEmployeeId,
            department: empDept,
            present: 0,
            absent: 0,
            halfDay: 0,
            late: 0,
            onLeave: 0,
            totalHours: 0,
          };
        }

        // Count status
        if (record.status === 'present') employeeMap[empId].present += 1;
        else if (record.status === 'absent') employeeMap[empId].absent += 1;
        else if (record.status === 'half_day') employeeMap[empId].halfDay += 1;
        else if (record.status === 'late') employeeMap[empId].late += 1;
        else if (record.status === 'leave') employeeMap[empId].onLeave += 1;

        // Add total hours
        employeeMap[empId].totalHours += parseFloat(record.totalHours || 0);
      });

      setTableData(Object.values(employeeMap));
      enqueueSnackbar('Report generated successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error generating report:', error);
      enqueueSnackbar('Failed to generate report', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      // Get export format from settings
      const settingsResponse = await generalSettingsService.getByCategory('export');
      const exportFormat = settingsResponse?.settings?.export_default_format || 'excel';
      
      if (exportFormat === 'excel' || exportFormat === 'xlsx') {
        exportToExcel();
      } else if (exportFormat === 'csv') {
        exportToCSV();
      } else {
        exportToExcel(); // Default to Excel
      }
    } catch (error) {
      console.error('Export error:', error);
      enqueueSnackbar('Export failed', { variant: 'error' });
    }
  };

  const exportToExcel = () => {
    const monthName = new Date(filterYear, filterMonth - 1).toLocaleString('default', { month: 'long' });
    const fileName = `Attendance_Muster_${monthName}_${filterYear}.xlsx`;

    const wsData = [
      [`Attendance Muster Report - ${monthName} ${filterYear}`],
      [],
      ['Employee ID', 'Employee Name', 'Department', 'Present', 'Absent', 'Half Day', 'Late', 'On Leave', 'Total Hours'],
      ...tableData.map(row => [
        row.employeeId,
        row.employeeName,
        row.department,
        row.present,
        row.absent,
        row.halfDay,
        row.late,
        row.onLeave,
        row.totalHours.toFixed(2),
      ]),
      [],
      ['Summary'],
      ['Total Employees', tableData.length],
      ['Total Present', summary.totalPresent],
      ['Total Absent', summary.totalAbsent],
      ['Total Hours', summary.totalHours.toFixed(2)],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Muster Report');
    XLSX.writeFile(wb, fileName);

    enqueueSnackbar('Exported to Excel successfully', { variant: 'success' });
  };

  const exportToCSV = () => {
    const monthName = new Date(filterYear, filterMonth - 1).toLocaleString('default', { month: 'long' });
    const fileName = `Attendance_Muster_${monthName}_${filterYear}.csv`;

    const csvContent = [
      ['Employee ID', 'Employee Name', 'Department', 'Present', 'Absent', 'Half Day', 'Late', 'On Leave', 'Total Hours'].join(','),
      ...tableData.map(row => 
        [
          row.employeeId,
          row.employeeName,
          row.department,
          row.present,
          row.absent,
          row.halfDay,
          row.late,
          row.onLeave,
          row.totalHours.toFixed(2),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    enqueueSnackbar('Exported to CSV successfully', { variant: 'success' });
  };

  // Calculate summary
  const summary = {
    totalEmployees: tableData.length,
    totalPresent: tableData.reduce((sum, row) => sum + row.present, 0),
    totalAbsent: tableData.reduce((sum, row) => sum + row.absent, 0),
    totalHalfDay: tableData.reduce((sum, row) => sum + row.halfDay, 0),
    totalLate: tableData.reduce((sum, row) => sum + row.late, 0),
    totalHours: tableData.reduce((sum, row) => sum + row.totalHours, 0),
  };

  const isNotFound = !loading && tableData.length === 0;

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
            hasGenerated && tableData.length > 0 ? (
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:download-fill" />}
                onClick={handleExport}
              >
                Export
              </Button>
            ) : null
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
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Iconify icon="eva:bar-chart-fill" />}
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Summary Cards */}
        {hasGenerated && !loading && tableData.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main">{summary.totalEmployees}</Typography>
                <Typography variant="body2" color="text.secondary">Total Employees</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="success.main">{summary.totalPresent}</Typography>
                <Typography variant="body2" color="text.secondary">Total Present</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="error.main">{summary.totalAbsent}</Typography>
                <Typography variant="body2" color="text.secondary">Total Absent</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="warning.main">{summary.totalLate}</Typography>
                <Typography variant="body2" color="text.secondary">Total Late</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="info.main">{summary.totalHours.toFixed(1)}</Typography>
                <Typography variant="body2" color="text.secondary">Total Hours</Typography>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Table */}
        <Card>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : !hasGenerated ? (
            <Alert severity="info" sx={{ m: 3 }}>
              Select Month, Year, and Department (optional), then click "Generate Report" to view attendance muster
            </Alert>
          ) : (
            <>
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
                      {tableData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TableRow key={row.id} hover>
                            <TableCell>
                              <Typography variant="subtitle2">{row.employeeName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.employeeId}
                              </Typography>
                            </TableCell>
                            <TableCell>{row.department}</TableCell>
                            <TableCell align="center">
                              <Chip label={row.present} color="success" size="small" />
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={row.absent} color="error" size="small" />
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={row.halfDay} color="warning" size="small" />
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={row.late} color="warning" size="small" />
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={row.onLeave} color="info" size="small" />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="subtitle2">
                                {row.totalHours.toFixed(2)}h
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}

                      <TableNoData isNotFound={isNotFound} />
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
            </>
          )}
        </Card>
      </Container>
    </>
  );
}

