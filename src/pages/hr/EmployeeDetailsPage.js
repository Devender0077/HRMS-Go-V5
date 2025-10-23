import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import {
  Container,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  Divider,
  Box,
  Avatar,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Chip,
  IconButton,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
// services
import employeeService from '../../services/api/employeeService';
import attendanceService from '../../services/api/attendanceService';
import leaveBalanceService from '../../services/api/leaveBalanceService';
import documentService from '../../services/api/documentService';
import { fDate, fDateTime } from '../../utils/formatTime';
import { fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  
  const [currentTab, setCurrentTab] = useState('profile');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab-specific data
  const [attendanceData, setAttendanceData] = useState({ records: [], stats: null });
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState({ history: [], pagination: null });
  const [leaveStats, setLeaveStats] = useState(null);
  const [documents, setDocuments] = useState({ documents: [], pagination: null });
  const [documentStats, setDocumentStats] = useState(null);

  // Fetch employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getById(id);
        setEmployee(data);
      } catch (err) {
        console.error('Fetch employee error:', err);
        setError(err.message || 'Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  // Fetch attendance data when tab changes
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const records = await attendanceService.getAttendanceRecords({
          employeeId: id,
          startDate: fDate(firstDay, 'yyyy-MM-dd'),
          endDate: fDate(lastDay, 'yyyy-MM-dd'),
          limit: 30,
        });

        setAttendanceData({
          records: records.records || [],
          stats: records.statistics || null,
        });
      } catch (err) {
        console.error('Fetch attendance error:', err);
      }
    };

    if (currentTab === 'attendance' && id) {
      fetchAttendance();
    }
  }, [currentTab, id]);

  // Fetch leave data when tab changes
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const [balance, history, stats] = await Promise.all([
          leaveBalanceService.getEmployeeLeaveBalance(id),
          leaveBalanceService.getEmployeeLeaveHistory(id, { limit: 10 }),
          leaveBalanceService.getEmployeeLeaveStats(id),
        ]);

        setLeaveBalance(balance);
        setLeaveHistory(history);
        setLeaveStats(stats);
      } catch (err) {
        console.error('Fetch leaves error:', err);
      }
    };

    if (currentTab === 'leaves' && id) {
      fetchLeaves();
    }
  }, [currentTab, id]);

  // Fetch documents when tab changes
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const [docs, stats] = await Promise.all([
          documentService.getEmployeeDocuments(id, { limit: 10 }),
          documentService.getEmployeeDocumentStats(id),
        ]);

        setDocuments(docs);
        setDocumentStats(stats);
      } catch (err) {
        console.error('Fetch documents error:', err);
      }
    };

    if (currentTab === 'documents' && id) {
      fetchDocuments();
    }
  }, [currentTab, id]);

  const TABS = [
    { value: 'profile', label: 'Overview', icon: 'eva:person-fill' },
    { value: 'attendance', label: 'Attendance', icon: 'eva:clock-fill' },
    { value: 'leaves', label: 'Leaves', icon: 'eva:calendar-fill' },
    { value: 'salary', label: 'Salary', icon: 'eva:credit-card-fill' },
    { value: 'documents', label: 'Documents', icon: 'eva:file-text-fill' },
    { value: 'performance', label: 'Performance', icon: 'eva:trending-up-fill' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      inactive: 'error',
      on_leave: 'warning',
      terminated: 'error',
    };
    return colors[status?.toLowerCase()] || 'default';
  };

  const getLeaveStatusColor = (status) => {
    const colors = {
      approved: 'success',
      pending: 'warning',
      rejected: 'error',
      cancelled: 'default',
    };
    return colors[status?.toLowerCase()] || 'default';
  };

  const getDocumentStatusColor = (status) => {
    const colors = {
      verified: 'success',
      pending: 'warning',
      rejected: 'error',
      expired: 'error',
    };
    return colors[status?.toLowerCase()] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !employee) {
    return (
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error || 'Employee not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title> Employee Details | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Employee Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Employees', href: PATH_DASHBOARD.hr.employees.list },
            { name: `${employee.first_name} ${employee.last_name}` },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:edit-fill" />}
              onClick={() => navigate(PATH_DASHBOARD.hr.employees.edit(id))}
            >
              Edit Employee
            </Button>
          }
        />

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
              <Avatar
                alt={employee.first_name}
                src={employee.photo_url || '/assets/images/avatars/avatar_default.jpg'}
                sx={{
                  width: 128,
                  height: 128,
                  mx: 'auto',
                  mb: 2,
                }}
              />

              <Typography variant="h4" sx={{ mb: 0.5 }}>
                {employee.first_name} {employee.last_name}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {employee.designation_name || employee.designation}
              </Typography>

              <Label
                color={getStatusColor(employee.status)}
                sx={{ mb: 3, textTransform: 'capitalize' }}
              >
                {employee.status}
              </Label>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Iconify icon="eva:email-fill" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">{employee.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Iconify icon="eva:phone-fill" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">{employee.phone || 'N/A'}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Iconify icon="eva:pin-fill" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {employee.city || 'N/A'}, {employee.country || 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Iconify icon="eva:briefcase-fill" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {employee.department_name || employee.department || 'N/A'}
                  </Typography>
                </Stack>
              </Stack>

              {employee.basic_salary && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Monthly Salary</Typography>
                    <Typography variant="h5" color="primary.main">
                      {fCurrency(employee.basic_salary)}
                    </Typography>
                  </Box>
                </>
              )}
            </Card>
          </Grid>

          {/* Details Card */}
          <Grid item xs={12} md={8}>
            <Card>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{ px: 3, bgcolor: 'background.neutral' }}
              >
                {TABS.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    icon={<Iconify icon={tab.icon} width={20} />}
                    iconPosition="start"
                  />
                ))}
              </Tabs>

              <Box sx={{ p: 3 }}>
                {/* PROFILE TAB */}
                {currentTab === 'profile' && (
                  <Stack spacing={3}>
                    <Typography variant="h6">Basic Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Employee ID</Typography>
                        <Typography variant="body1">{employee.employee_id}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                        <Typography variant="body1">
                          {employee.date_of_birth ? fDate(employee.date_of_birth) : 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Gender</Typography>
                        <Typography variant="body1">{employee.gender || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Status</Typography>
                        <Label color={getStatusColor(employee.status)} sx={{ textTransform: 'capitalize' }}>
                          {employee.status}
                        </Label>
                      </Grid>
                    </Grid>

                    <Divider />

                    <Typography variant="h6">Employment Details</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Department</Typography>
                        <Typography variant="body1">{employee.department_name || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Designation</Typography>
                        <Typography variant="body1">{employee.designation_name || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Branch</Typography>
                        <Typography variant="body1">{employee.branch_name || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Employment Type</Typography>
                        <Typography variant="body1">{employee.employment_type || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Joining Date</Typography>
                        <Typography variant="body1">
                          {employee.joining_date ? fDate(employee.joining_date) : 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Shift</Typography>
                        <Typography variant="body1">{employee.shift || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Reports To</Typography>
                        <Typography variant="body1">{employee.manager_name || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                        <Typography variant="body1">{employee.payment_method || 'N/A'}</Typography>
                      </Grid>
                    </Grid>

                    <Divider />

                    <Typography variant="h6">Address</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {employee.address || 'N/A'}<br />
                      {employee.city}, {employee.state} {employee.postal_code}<br />
                      {employee.country}
                    </Typography>

                    {employee.bank_name && (
                      <>
                        <Divider />
                        <Typography variant="h6">Bank Information</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Bank Name</Typography>
                            <Typography variant="body1">{employee.bank_name}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Account Number</Typography>
                            <Typography variant="body1">{employee.account_number || 'N/A'}</Typography>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Stack>
                )}

                {/* ATTENDANCE TAB */}
                {currentTab === 'attendance' && (
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2 }}>Attendance Summary (This Month)</Typography>
                      {attendanceData.stats && (
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
                              <Typography variant="h4" color="success.main">
                                {attendanceData.stats.present || 0}
                              </Typography>
                              <Typography variant="caption">Present</Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'error.lighter' }}>
                              <Typography variant="h4" color="error.main">
                                {attendanceData.stats.absent || 0}
                              </Typography>
                              <Typography variant="caption">Absent</Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                              <Typography variant="h4" color="warning.main">
                                {attendanceData.stats.late || 0}
                              </Typography>
                              <Typography variant="caption">Late</Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'info.lighter' }}>
                              <Typography variant="h4" color="info.main">
                                {attendanceData.stats.halfDay || 0}
                              </Typography>
                              <Typography variant="caption">Half Day</Typography>
                            </Card>
                          </Grid>
                        </Grid>
                      )}
                    </Box>

                    <Divider />

                    <Typography variant="h6">Recent Attendance (Last 30 Days)</Typography>
                    <Scrollbar>
                      <TableContainer sx={{ minWidth: 600 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Clock In</TableCell>
                              <TableCell>Clock Out</TableCell>
                              <TableCell>Hours</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {attendanceData.records.slice(0, 10).map((record) => (
                              <TableRow key={record.id} hover>
                                <TableCell>{fDate(record.date)}</TableCell>
                                <TableCell>{record.clock_in ? fDateTime(record.clock_in, 'HH:mm') : '-'}</TableCell>
                                <TableCell>{record.clock_out ? fDateTime(record.clock_out, 'HH:mm') : '-'}</TableCell>
                                <TableCell>{record.total_hours || '-'}</TableCell>
                                <TableCell>
                                  <Label color={record.status === 'present' ? 'success' : 'error'}>
                                    {record.status}
                                  </Label>
                                </TableCell>
                              </TableRow>
                            ))}
                            {attendanceData.records.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={5} align="center">
                                  <Typography variant="body2" color="text.secondary">
                                    No attendance records found
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Scrollbar>
                  </Stack>
                )}

                {/* LEAVES TAB */}
                {currentTab === 'leaves' && (
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2 }}>Leave Balance (Current Year)</Typography>
                      <Grid container spacing={2}>
                        {leaveBalance.map((balance) => (
                          <Grid item xs={12} md={6} key={balance.leave_type_id}>
                            <Card sx={{ p: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {balance.leave_type}
                              </Typography>
                              <Stack spacing={1}>
                                <Box>
                                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {balance.used} used of {balance.allocated} days
                                    </Typography>
                                    <Typography variant="caption" color="primary.main">
                                      {balance.remaining} remaining
                                    </Typography>
                                  </Stack>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={(balance.used / balance.allocated) * 100}
                                    color={balance.remaining > 5 ? 'primary' : 'warning'}
                                    sx={{ height: 8, borderRadius: 1 }}
                                  />
                                </Box>
                                {balance.pending > 0 && (
                                  <Typography variant="caption" color="warning.main">
                                    {balance.pending} days pending approval
                                  </Typography>
                                )}
                              </Stack>
                            </Card>
                          </Grid>
                        ))}
                        {leaveBalance.length === 0 && (
                          <Grid item xs={12}>
                            <Alert severity="info">No leave types configured</Alert>
                          </Grid>
                        )}
                      </Grid>
                    </Box>

                    {leaveStats && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>Leave Statistics</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Card sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h4">{leaveStats.total_requests || 0}</Typography>
                              <Typography variant="caption">Total Requests</Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
                              <Typography variant="h4" color="success.main">{leaveStats.approved || 0}</Typography>
                              <Typography variant="caption">Approved</Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                              <Typography variant="h4" color="warning.main">{leaveStats.pending || 0}</Typography>
                              <Typography variant="caption">Pending</Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'error.lighter' }}>
                              <Typography variant="h4" color="error.main">{leaveStats.rejected || 0}</Typography>
                              <Typography variant="caption">Rejected</Typography>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    <Divider />

                    <Typography variant="h6">Leave History</Typography>
                    <Scrollbar>
                      <TableContainer sx={{ minWidth: 600 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Leave Type</TableCell>
                              <TableCell>From</TableCell>
                              <TableCell>To</TableCell>
                              <TableCell>Days</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {leaveHistory.history?.map((leave) => (
                              <TableRow key={leave.id} hover>
                                <TableCell>
                                  <Typography variant="subtitle2">{leave.leave_type_name}</Typography>
                                </TableCell>
                                <TableCell>{fDate(leave.start_date)}</TableCell>
                                <TableCell>{fDate(leave.end_date)}</TableCell>
                                <TableCell>{leave.days}</TableCell>
                                <TableCell>
                                  <Label color={getLeaveStatusColor(leave.status)}>
                                    {leave.status}
                                  </Label>
                                </TableCell>
                              </TableRow>
                            ))}
                            {!leaveHistory.history || leaveHistory.history.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={5} align="center">
                                  <Typography variant="body2" color="text.secondary">
                                    No leave history found
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Scrollbar>
                  </Stack>
                )}

                {/* SALARY TAB */}
                {currentTab === 'salary' && (
                  <Stack spacing={3}>
                    <Typography variant="h6">Salary Breakdown</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, bgcolor: 'primary.lighter' }}>
                          <Typography variant="caption" color="text.secondary">Basic Salary (Monthly)</Typography>
                          <Typography variant="h4" color="primary.main">
                            {employee.basic_salary ? fCurrency(employee.basic_salary) : 'N/A'}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3 }}>
                          <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                          <Typography variant="h6">
                            {employee.payment_method || 'Not Configured'}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                    <Alert severity="info">
                      Salary components and payroll details will be configured based on system settings
                    </Alert>
                  </Stack>
                )}

                {/* DOCUMENTS TAB */}
                {currentTab === 'documents' && (
                  <Stack spacing={3}>
                    {documentStats && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>Document Summary</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={2.4}>
                            <Card sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h4">{documentStats.total || 0}</Typography>
                              <Typography variant="caption">Total</Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={2.4}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
                              <Typography variant="h4" color="success.main">{documentStats.verified || 0}</Typography>
                              <Typography variant="caption">Verified</Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={2.4}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                              <Typography variant="h4" color="warning.main">{documentStats.pending || 0}</Typography>
                              <Typography variant="caption">Pending</Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={2.4}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'error.lighter' }}>
                              <Typography variant="h4" color="error.main">{documentStats.expired || 0}</Typography>
                              <Typography variant="caption">Expired</Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={2.4}>
                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                              <Typography variant="h4" color="warning.main">{documentStats.expiring_soon || 0}</Typography>
                              <Typography variant="caption">Expiring Soon</Typography>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">Documents</Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                      >
                        Upload Document
                      </Button>
                    </Box>

                    <Scrollbar>
                      <TableContainer sx={{ minWidth: 600 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Document</TableCell>
                              <TableCell>Category</TableCell>
                              <TableCell>Upload Date</TableCell>
                              <TableCell>Expiry Date</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {documents.documents?.map((doc) => (
                              <TableRow key={doc.id} hover>
                                <TableCell>
                                  <Typography variant="subtitle2">{doc.document_name}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip label={doc.category_name} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>{fDate(doc.upload_date)}</TableCell>
                                <TableCell>
                                  {doc.expiry_date ? (
                                    <Typography 
                                      variant="body2" 
                                      color={new Date(doc.expiry_date) < new Date() ? 'error.main' : 'text.primary'}
                                    >
                                      {fDate(doc.expiry_date)}
                                    </Typography>
                                  ) : (
                                    '-'
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Label color={getDocumentStatusColor(doc.status)}>
                                    {doc.status}
                                  </Label>
                                </TableCell>
                                <TableCell align="right">
                                  <IconButton size="small">
                                    <Iconify icon="eva:eye-fill" />
                                  </IconButton>
                                  <IconButton size="small">
                                    <Iconify icon="eva:download-fill" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                            {!documents.documents || documents.documents.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={6} align="center">
                                  <Typography variant="body2" color="text.secondary">
                                    No documents uploaded
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Scrollbar>
                  </Stack>
                )}

                {/* PERFORMANCE TAB */}
                {currentTab === 'performance' && (
                  <Alert severity="info">
                    Performance goals and reviews will be displayed here
                  </Alert>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
