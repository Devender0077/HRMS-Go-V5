import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Container,
  Grid,
  Card,
  CardHeader,
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  LinearProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import reportsService from '../../services/api/reportsService';
// utils
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ----------------------------------------------------------------------

const REPORT_CATEGORIES = [
  {
    id: 'attendance',
    title: 'Attendance Reports',
    description: 'Employee attendance, overtime, and time tracking reports',
    icon: 'eva:clock-outline',
    color: 'primary',
    reports: [
      { 
        id: 'daily_attendance', 
        name: 'Daily Attendance Report', 
        description: 'Daily attendance summary',
        params: ['date'],
      },
      { 
        id: 'monthly_attendance', 
        name: 'Monthly Attendance Report', 
        description: 'Monthly attendance overview',
        params: ['month', 'year'],
      },
      { 
        id: 'overtime', 
        name: 'Overtime Report', 
        description: 'Overtime hours and costs',
        params: ['start_date', 'end_date'],
      },
      { 
        id: 'late_arrivals', 
        name: 'Late Arrivals Report', 
        description: 'Late arrival patterns',
        params: ['start_date', 'end_date'],
      },
    ],
  },
  {
    id: 'payroll',
    title: 'Payroll Reports',
    description: 'Salary, deductions, and payroll processing reports',
    icon: 'eva:credit-card-outline',
    color: 'success',
    reports: [
      { 
        id: 'payroll_summary', 
        name: 'Payroll Summary', 
        description: 'Monthly payroll overview',
        params: ['month', 'year'],
      },
      { 
        id: 'salary_analysis', 
        name: 'Salary Analysis', 
        description: 'Salary distribution analysis',
        params: [],
      },
      { 
        id: 'tax_reports', 
        name: 'Tax Reports', 
        description: 'Tax deductions and filings',
        params: ['month', 'year'],
      },
      { 
        id: 'bonus_reports', 
        name: 'Bonus Reports', 
        description: 'Bonus and incentive tracking',
        params: ['year'],
      },
    ],
  },
  {
    id: 'hr',
    title: 'HR Reports',
    description: 'Employee data, performance, and HR analytics',
    icon: 'eva:people-outline',
    color: 'info',
    reports: [
      { 
        id: 'employee_directory', 
        name: 'Employee Directory', 
        description: 'Complete employee listing',
        params: [],
      },
      { 
        id: 'performance_reviews', 
        name: 'Performance Reviews', 
        description: 'Performance evaluation reports',
        params: ['year'],
      },
      { 
        id: 'training_reports', 
        name: 'Training Reports', 
        description: 'Training completion and progress',
        params: [],
      },
      { 
        id: 'turnover_analysis', 
        name: 'Turnover Analysis', 
        description: 'Employee turnover statistics',
        params: ['year'],
      },
    ],
  },
  {
    id: 'leaves',
    title: 'Leave Reports',
    description: 'Leave balances, requests, and leave analytics',
    icon: 'eva:calendar-outline',
    color: 'warning',
    reports: [
      { 
        id: 'leave_balance', 
        name: 'Leave Balance Report', 
        description: 'Employee leave balances',
        params: [],
      },
      { 
        id: 'leave_usage', 
        name: 'Leave Usage Report', 
        description: 'Leave usage patterns',
        params: ['start_date', 'end_date'],
      },
      { 
        id: 'leave_approvals', 
        name: 'Leave Approvals', 
        description: 'Leave approval workflow',
        params: ['status'],
      },
      { 
        id: 'holiday_calendar', 
        name: 'Holiday Calendar', 
        description: 'Company holidays and events',
        params: ['year'],
      },
    ],
  },
  {
    id: 'recruitment',
    title: 'Recruitment Reports',
    description: 'Hiring, applications, and recruitment analytics',
    icon: 'eva:person-add-outline',
    color: 'secondary',
    reports: [
      { 
        id: 'job_posting', 
        name: 'Job Posting Report', 
        description: 'Active job postings',
        params: [],
      },
      { 
        id: 'application_summary', 
        name: 'Application Summary', 
        description: 'Application statistics',
        params: [],
      },
      { 
        id: 'hiring_pipeline', 
        name: 'Hiring Pipeline', 
        description: 'Recruitment pipeline status',
        params: [],
      },
      { 
        id: 'cost_per_hire', 
        name: 'Cost per Hire', 
        description: 'Recruitment cost analysis',
        params: ['year'],
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance Reports',
    description: 'Legal compliance and audit reports',
    icon: 'eva:shield-outline',
    color: 'error',
    reports: [
      { 
        id: 'employee_directory', 
        name: 'Labor Law Compliance', 
        description: 'Labor law adherence reports (Uses Employee Directory data)',
        params: [],
      },
      { 
        id: 'employee_directory', 
        name: 'Audit Trail', 
        description: 'System audit logs (Uses Employee Directory data)',
        params: [],
      },
      { 
        id: 'employee_directory', 
        name: 'Document Compliance', 
        description: 'Document verification status (Uses Employee Directory data)',
        params: [],
      },
      { 
        id: 'employee_directory', 
        name: 'Policy Adherence', 
        description: 'Policy compliance tracking (Uses Employee Directory data)',
        params: [],
      },
    ],
  },
];

// ----------------------------------------------------------------------

export default function ReportsDashboardPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportParams, setReportParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [loadingRecentReports, setLoadingRecentReports] = useState(true);

  // Get current date defaults
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Fetch recent reports on component mount
  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        setLoadingRecentReports(true);
        console.log('📊 Fetching recent reports from backend...');
        const response = await reportsService.getRecentReports();
        
        if (response.success && response.data) {
          console.log('✅ Recent reports loaded:', response.data.length);
          setRecentReports(response.data);
        } else {
          console.error('❌ Failed to load recent reports:', response.message);
          // Keep empty array
        }
      } catch (error) {
        console.error('❌ Error fetching recent reports:', error);
      } finally {
        setLoadingRecentReports(false);
      }
    };

    fetchRecentReports();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleGenerateReport = (category, report) => {
    console.log('📊 Opening report dialog:', report.id, report);
    setSelectedReport({ ...report, category: category.title });
    
    // Set default parameters - safely handle undefined params
    const defaults = {};
    const reportParams = report.params || [];
    
    if (reportParams.includes('date')) {
      defaults.date = today.toISOString().split('T')[0];
    }
    if (reportParams.includes('month')) {
      defaults.month = currentMonth;
    }
    if (reportParams.includes('year')) {
      defaults.year = currentYear;
    }
    if (reportParams.includes('start_date')) {
      const firstDay = new Date(currentYear, currentMonth - 1, 1);
      defaults.start_date = firstDay.toISOString().split('T')[0];
    }
    if (reportParams.includes('end_date')) {
      defaults.end_date = today.toISOString().split('T')[0];
    }
    if (reportParams.includes('status')) {
      defaults.status = 'all';
    }
    
    console.log('📋 Report parameters set:', defaults);
    setReportParams(defaults);
    setOpenDialog(true);
    setViewMode(false);
    setReportData(null);
  };

  const handleParamChange = (param, value) => {
    setReportParams(prev => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
    setReportData(null);
    setViewMode(false);
  };

  const handleSubmitReport = async () => {
    setLoading(true);
    try {
      console.log('🔄 Generating report:', selectedReport.id, 'with params:', reportParams);
      
      const response = await reportsService.generateReport(selectedReport.id, reportParams);
      
      console.log('📊 Report generation response:', response);
      
      if (response.success && response.data) {
        console.log('✅ Report data received:', response.data);
        setReportData(response.data);
        setViewMode(true);
        enqueueSnackbar('Report generated successfully!', { variant: 'success' });
      } else {
        console.error('❌ Report generation failed:', response);
        enqueueSnackbar(response.message || 'Failed to generate report', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ Report generation error:', error);
      console.error('Error details:', error.response || error.message || error);
      enqueueSnackbar(
        error.response?.data?.message || error.message || 'An error occurred while generating the report', 
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (format = 'pdf') => {
    if (!reportData || !reportData.data || reportData.data.length === 0) {
      enqueueSnackbar('No data to download', { variant: 'warning' });
      return;
    }
    
    const fileName = `${selectedReport.name}_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'pdf') {
      handleDownloadPDF();
    } else if (format === 'excel') {
      handleDownloadExcel();
    } else if (format === 'json') {
      handleDownloadJSON();
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
      const fileName = `${selectedReport.name}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Add title
      doc.setFontSize(16);
      doc.text(selectedReport.name, 14, 15);
      
      // Add metadata
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date(reportData.generated_at).toLocaleString()}`, 14, 22);
      doc.text(`Category: ${selectedReport.category}`, 14, 27);
      
      // Add summary if exists
      let startY = 35;
      if (reportData.summary) {
        doc.setFontSize(12);
        doc.text('Summary:', 14, startY);
        startY += 7;
        
        const summaryData = Object.entries(reportData.summary).map(([key, value]) => [
          key.replace(/_/g, ' ').toUpperCase(),
          typeof value === 'number' ? value.toLocaleString() : value
        ]);
        
        doc.autoTable({
          startY,
          head: [['Metric', 'Value']],
          body: summaryData,
          theme: 'grid',
          headStyles: { fillColor: [0, 123, 255] },
        });
        
        startY = doc.lastAutoTable.finalY + 10;
      }
      
      // Add data table
      if (reportData.data && reportData.data.length > 0) {
        const columns = Object.keys(reportData.data[0]);
        const headers = columns.map(col => col.replace(/_/g, ' ').toUpperCase());
        const rows = reportData.data.map(row => columns.map(col => row[col] || ''));
        
        doc.setFontSize(12);
        doc.text(`Data (${reportData.data.length} records):`, 14, startY);
        
        doc.autoTable({
          startY: startY + 5,
          head: [headers],
          body: rows,
          theme: 'striped',
          headStyles: { fillColor: [0, 123, 255] },
          styles: { fontSize: 8 },
        });
      }
      
      doc.save(fileName);
      enqueueSnackbar('PDF downloaded successfully!', { variant: 'success' });
    } catch (error) {
      console.error('PDF generation error:', error);
      enqueueSnackbar('Failed to generate PDF', { variant: 'error' });
    }
  };

  const handleDownloadExcel = () => {
    try {
      const fileName = `${selectedReport.name}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Add summary sheet if exists
      if (reportData.summary) {
        const summaryData = Object.entries(reportData.summary).map(([key, value]) => ({
          Metric: key.replace(/_/g, ' ').toUpperCase(),
          Value: value,
        }));
        const summaryWs = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
      }
      
      // Add data sheet
      if (reportData.data && reportData.data.length > 0) {
        const dataWs = XLSX.utils.json_to_sheet(reportData.data);
        XLSX.utils.book_append_sheet(wb, dataWs, 'Data');
      }
      
      // Save file
      XLSX.writeFile(wb, fileName);
      enqueueSnackbar('Excel downloaded successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Excel generation error:', error);
      enqueueSnackbar('Failed to generate Excel', { variant: 'error' });
    }
  };

  const handleDownloadJSON = () => {
    try {
      const fileName = `${selectedReport.name}_${new Date().toISOString().split('T')[0]}.json`;
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      enqueueSnackbar('JSON downloaded successfully!', { variant: 'success' });
    } catch (error) {
      console.error('JSON download error:', error);
      enqueueSnackbar('Failed to download JSON', { variant: 'error' });
    }
  };

  const handleDownloadRecentReport = (report) => {
    console.log('📥 Downloading report:', report.name);
    enqueueSnackbar(`Downloading ${report.name}...`, { variant: 'info' });
    // In real implementation, this would download the actual file
  };

  const handleShareReport = (report) => {
    console.log('📤 Sharing report:', report.name);
    enqueueSnackbar('Share link copied to clipboard!', { variant: 'success' });
    // In real implementation, this would copy share link
  };

  const handleDeleteReport = (reportId) => {
    console.log('🗑️ Deleting report:', reportId);
    setRecentReports(prev => prev.filter(r => r.id !== reportId));
    enqueueSnackbar('Report deleted successfully!', { variant: 'success' });
  };

  const handleRefreshReports = async () => {
    try {
      setLoadingRecentReports(true);
      console.log('🔄 Refreshing recent reports...');
      const response = await reportsService.getRecentReports();
      
      if (response.success && response.data) {
        console.log('✅ Recent reports refreshed:', response.data.length);
        setRecentReports(response.data);
        enqueueSnackbar('Reports refreshed!', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to refresh reports', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ Error refreshing reports:', error);
      enqueueSnackbar('Error refreshing reports', { variant: 'error' });
    } finally {
      setLoadingRecentReports(false);
    }
  };

  const filteredCategories = selectedCategory === 'all' 
    ? REPORT_CATEGORIES 
    : REPORT_CATEGORIES.filter(cat => cat.id === selectedCategory);

  const renderParamInput = (param) => {
    switch (param) {
      case 'date':
      case 'start_date':
      case 'end_date':
        return (
          <TextField
            key={param}
            fullWidth
            type="date"
            label={param.replace('_', ' ').toUpperCase()}
            value={reportParams[param] || ''}
            onChange={(e) => handleParamChange(param, e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        );
      
      case 'month':
        return (
          <TextField
            key={param}
            fullWidth
            select
            label="Month"
            value={reportParams[param] || currentMonth}
            onChange={(e) => handleParamChange(param, e.target.value)}
            sx={{ mb: 2 }}
          >
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </TextField>
        );
      
      case 'year':
        return (
          <TextField
            key={param}
            fullWidth
            select
            label="Year"
            value={reportParams[param] || currentYear}
            onChange={(e) => handleParamChange(param, e.target.value)}
            sx={{ mb: 2 }}
          >
            {[...Array(5)].map((_, i) => {
              const year = currentYear - i;
              return (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              );
            })}
          </TextField>
        );
      
      case 'status':
        return (
          <TextField
            key={param}
            fullWidth
            select
            label="Status"
            value={reportParams[param] || 'all'}
            onChange={(e) => handleParamChange(param, e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>
        );
      
      default:
        return (
          <TextField
            key={param}
            fullWidth
            label={param.replace('_', ' ').toUpperCase()}
            value={reportParams[param] || ''}
            onChange={(e) => handleParamChange(param, e.target.value)}
            sx={{ mb: 2 }}
          />
        );
    }
  };

  const renderReportData = () => {
    if (!reportData) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Report Type: {reportData.report_type} | Generated: {new Date(reportData.generated_at).toLocaleString()}
        </Alert>
        
        {reportData.summary && (
          <Card sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>Summary</Typography>
            <Grid container spacing={2}>
              {Object.entries(reportData.summary).map(([key, value]) => (
                <Grid item xs={6} md={4} key={key}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </Typography>
                    <Typography variant="h6">
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        )}
        
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Data ({reportData.data?.length || 0} records)
          </Typography>
          
          {reportData.data && reportData.data.length > 0 ? (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: 400, mt: 2 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {Object.keys(reportData.data[0]).map((key) => (
                        <TableCell key={key} sx={{ fontWeight: 'bold', bgcolor: 'primary.lighter' }}>
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.data.slice(0, 20).map((row, index) => (
                      <TableRow key={index} hover>
                        {Object.values(row).map((value, cellIndex) => (
                          <TableCell key={cellIndex}>
                            {value !== null && value !== undefined 
                              ? (typeof value === 'number' ? value.toLocaleString() : String(value))
                              : '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {reportData.data.length > 20 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                  Showing first 20 of {reportData.data.length} records. Download PDF/Excel for complete data.
                </Typography>
              )}
            </>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No data available for this report
            </Typography>
          )}
        </Card>
      </Box>
    );
  };

  return (
    <>
      <Helmet>
        <title>Reports Dashboard | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Reports Dashboard"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Reports' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <TextField
                select
                size="small"
                value={selectedCategory}
                onChange={handleCategoryChange}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {REPORT_CATEGORIES.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.title}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          }
        />

        <Grid container spacing={3}>
          {/* Report Categories */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {filteredCategories.map((category) => (
                <Grid item xs={12} md={6} lg={4} key={category.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardHeader
                      avatar={
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: `${category.color}.lighter`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Iconify 
                            icon={category.icon} 
                            sx={{ color: `${category.color}.main`, fontSize: 24 }}
                          />
                        </Box>
                      }
                      title={
                        <Typography variant="h6" gutterBottom>
                          {category.title}
                        </Typography>
                      }
                      subheader={
                        <Typography variant="body2" color="text.secondary">
                          {category.description}
                        </Typography>
                      }
                    />
                    
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Stack spacing={2}>
                        {category.reports.map((report, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              '&:hover': {
                                bgcolor: 'action.hover',
                                cursor: 'pointer',
                              },
                            }}
                            onClick={() => handleGenerateReport(category, report)}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                  {report.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {report.description}
                                </Typography>
                              </Box>
                              <IconButton size="small">
                                <Iconify icon="eva:arrow-forward-outline" />
                              </IconButton>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Recent Reports */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Recent Reports"
                subheader="Recently generated reports"
                action={
                  <Button 
                    size="small" 
                    startIcon={<Iconify icon="eva:refresh-outline" />}
                    onClick={handleRefreshReports}
                  >
                    Refresh
                  </Button>
                }
              />
              
              <Box sx={{ p: 3 }}>
                {loadingRecentReports ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : recentReports.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                    No recent reports available
                  </Typography>
                ) : (
                <Stack spacing={2}>
                    {recentReports.map((report) => (
                    <Box
                      key={report.id}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2">
                              {report.name}
                            </Typography>
                            <Chip
                              label={report.category}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={report.status}
                              size="small"
                              color={report.status === 'completed' ? 'success' : 'warning'}
                            />
                          </Stack>
                          
                          <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              By: {report.generated_by}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {report.generated_at}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Size: {report.file_size}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Downloads: {report.download_count}
                            </Typography>
                          </Stack>
                        </Box>
                        
                        <Stack direction="row" spacing={1}>
                          <IconButton 
                            size="small"
                            onClick={() => handleDownloadRecentReport(report)}
                          >
                            <Iconify icon="eva:download-outline" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => handleShareReport(report)}
                          >
                            <Iconify icon="eva:share-outline" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => handleDeleteReport(report.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Report Generation Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {viewMode ? 'Report Results' : 'Generate Report'}
          {selectedReport && (
            <Typography variant="body2" color="text.secondary">
              {selectedReport.category} → {selectedReport.name}
            </Typography>
          )}
        </DialogTitle>
        
        <DialogContent>
          {!viewMode ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedReport?.description}
              </Typography>
              
              {selectedReport?.params && selectedReport.params.length > 0 ? (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Report Parameters:
                  </Typography>
                  {selectedReport.params.map(param => renderParamInput(param))}
                </Box>
              ) : (
                <Alert severity="info">
                  This report requires no parameters. Click "Generate Report" to proceed.
                </Alert>
              )}
            </>
          ) : (
            renderReportData()
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {viewMode ? 'Close' : 'Cancel'}
          </Button>
          
          {viewMode && reportData && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="vscode-icons:file-type-pdf2" />}
                onClick={() => handleDownloadReport('pdf')}
              >
                Download PDF
              </Button>
              <Button
                variant="outlined"
                color="success"
                startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
                onClick={() => handleDownloadReport('excel')}
              >
                Download Excel
              </Button>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="vscode-icons:file-type-json" />}
                onClick={() => handleDownloadReport('json')}
              >
                Download JSON
              </Button>
            </>
          )}
          
          {!viewMode && (
            <Button
              variant="contained"
              onClick={handleSubmitReport}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Iconify icon="eva:bar-chart-outline" />}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
