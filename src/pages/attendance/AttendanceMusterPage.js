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
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
} from '../../components/table';

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

const MOCK_MUSTER_DATA = [
  {
    id: '1',
    employeeName: 'John Doe',
    employeeId: 'EMP001',
    department: 'Engineering',
    present: 22,
    absent: 2,
    halfDay: 1,
    late: 3,
    onLeave: 2,
    totalHours: 176.5,
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    employeeId: 'EMP002',
    department: 'Marketing',
    present: 24,
    absent: 0,
    halfDay: 0,
    late: 1,
    onLeave: 1,
    totalHours: 192.0,
  },
  {
    id: '3',
    employeeName: 'Bob Johnson',
    employeeId: 'EMP003',
    department: 'Engineering',
    present: 20,
    absent: 3,
    halfDay: 2,
    late: 5,
    onLeave: 0,
    totalHours: 160.0,
  },
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

  const [tableData] = useState(MOCK_MUSTER_DATA);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterDepartment, setFilterDepartment] = useState('all');

  const handleExport = () => {
    console.log('Export muster report');
  };

  const handlePrint = () => {
    window.print();
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
              <Button fullWidth variant="contained" size="large">
                Generate Report
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
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
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

                  {tableData.length === 0 && (
                    <TableNoData isNotFound={true} />
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

