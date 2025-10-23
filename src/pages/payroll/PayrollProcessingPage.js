import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  Container,
  Button,
  Stack,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

const STEPS = ['Select Period', 'Review Employees', 'Process Payroll'];

const MOCK_EMPLOYEES = [
  { id: 1, name: 'John Doe', empId: 'EMP001', designation: 'Software Engineer', basic: 50000, gross: 75000, deductions: 8500, net: 66500, selected: true },
  { id: 2, name: 'Jane Smith', empId: 'EMP002', designation: 'HR Manager', basic: 60000, gross: 90000, deductions: 10200, net: 79800, selected: true },
  { id: 3, name: 'Bob Johnson', empId: 'EMP003', designation: 'Marketing Lead', basic: 55000, gross: 82500, deductions: 9350, net: 73150, selected: true },
];

// ----------------------------------------------------------------------

export default function PayrollProcessingPage() {
  const { themeStretch } = useSettingsContext();
  const [activeStep, setActiveStep] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [processing, setProcessing] = useState(false);

  const handleNext = () => {
    if (activeStep === STEPS.length - 1) {
      handleProcessPayroll();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleToggleEmployee = (id) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, selected: !emp.selected } : emp));
  };

  const handleProcessPayroll = async () => {
    setProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    alert('Payroll processed successfully!');
    setActiveStep(0);
  };

  const selectedEmployees = employees.filter(e => e.selected);
  const totalGross = selectedEmployees.reduce((sum, e) => sum + e.gross, 0);
  const totalDeductions = selectedEmployees.reduce((sum, e) => sum + e.deductions, 0);
  const totalNet = selectedEmployees.reduce((sum, e) => sum + e.net, 0);

  return (
    <>
      <Helmet>
        <title> Payroll: Processing | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Process Payroll"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Payroll', href: PATH_DASHBOARD.payroll.root },
            { name: 'Process Payroll' },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1: Select Period */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Payroll Period
              </Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <MenuItem key={m} value={m}>
                        {new Date(2024, m - 1).toLocaleString('default', { month: 'long' })}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Paper sx={{ p: 3, mt: 3, bgcolor: 'primary.lighter' }}>
                <Typography variant="body2" color="text.secondary">
                  Payroll will be processed for: <strong>{new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</strong>
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Step 2: Review Employees */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Employees for Payroll
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedEmployees.length === employees.length}
                          onChange={(e) => setEmployees(employees.map(emp => ({ ...emp, selected: e.target.checked })))}
                        />
                      </TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell align="right">Basic</TableCell>
                      <TableCell align="right">Gross</TableCell>
                      <TableCell align="right">Deductions</TableCell>
                      <TableCell align="right">Net Salary</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={emp.id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={emp.selected}
                            onChange={() => handleToggleEmployee(emp.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{emp.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{emp.empId}</Typography>
                        </TableCell>
                        <TableCell>{emp.designation}</TableCell>
                        <TableCell align="right">${emp.basic.toLocaleString()}</TableCell>
                        <TableCell align="right">${emp.gross.toLocaleString()}</TableCell>
                        <TableCell align="right">${emp.deductions.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" color="primary.main">
                            ${emp.net.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  {selectedEmployees.length} of {employees.length} employees selected
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Step 3: Process */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review & Process Payroll
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">${totalGross.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Gross</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">${totalDeductions.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Deductions</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">${totalNet.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Net Payable</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Paper sx={{ p: 3, mt: 3, bgcolor: 'warning.lighter' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Iconify icon="eva:alert-triangle-fill" width={24} sx={{ color: 'warning.main' }} />
                  <Box>
                    <Typography variant="subtitle2">
                      Processing payroll for {selectedEmployees.length} employees
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      This action will generate payslips and mark payroll as processed for {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          )}

          {/* Navigation */}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
            >
              Back
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button variant="outlined" onClick={() => setActiveStep(0)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<Iconify icon={activeStep === STEPS.length - 1 ? 'eva:checkmark-fill' : 'eva:arrow-forward-fill'} />}
              disabled={processing}
            >
              {processing ? 'Processing...' : activeStep === STEPS.length - 1 ? 'Process Payroll' : 'Next'}
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
}

