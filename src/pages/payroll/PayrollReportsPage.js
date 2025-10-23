import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  Paper,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

export default function PayrollReportsPage() {
  const { themeStretch } = useSettingsContext();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [department, setDepartment] = useState('all');

  // Mock data
  const stats = {
    totalEmployees: 125,
    totalGross: 8750000,
    totalDeductions: 1050000,
    totalNet: 7700000,
    avgSalary: 61600,
    highestSalary: 150000,
    lowestSalary: 35000,
  };

  return (
    <>
      <Helmet>
        <title> Payroll: Reports | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Payroll Reports"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Payroll', href: PATH_DASHBOARD.payroll.root },
            { name: 'Reports' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<Iconify icon="eva:printer-fill" />}>
                Print
              </Button>
              <Button variant="contained" startIcon={<Iconify icon="eva:download-fill" />}>
                Export
              </Button>
            </Stack>
          }
        />

        {/* Filters */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <MenuItem value="all">All Departments</MenuItem>
                <MenuItem value="engineering">Engineering</MenuItem>
                <MenuItem value="hr">Human Resources</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
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
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main">
                  {stats.totalEmployees}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main">
                  ${(stats.totalGross / 1000000).toFixed(2)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Gross Salary
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="error.main">
                  ${(stats.totalDeductions / 1000000).toFixed(2)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Deductions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="info.main">
                  ${(stats.totalNet / 1000000).toFixed(2)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Net Payable
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="eva:bar-chart-2-fill" width={32} sx={{ color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h4">${stats.avgSalary.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Salary
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'success.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="eva:trending-up-fill" width={32} sx={{ color: 'success.main' }} />
                </Box>
                <Box>
                  <Typography variant="h4">${(stats.highestSalary / 1000).toFixed(0)}K</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Highest Salary
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'warning.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="eva:trending-down-fill" width={32} sx={{ color: 'warning.main' }} />
                </Box>
                <Box>
                  <Typography variant="h4">${(stats.lowestSalary / 1000).toFixed(0)}K</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lowest Salary
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Reports */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Iconify icon="eva:file-text-fill" width={40} sx={{ color: 'primary.main' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">Salary Register</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Detailed salary register for all employees
                  </Typography>
                </Box>
                <Iconify icon="eva:arrow-forward-fill" width={24} />
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Iconify icon="eva:pie-chart-fill" width={40} sx={{ color: 'success.main' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">Department-wise Report</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Salary breakdown by department
                  </Typography>
                </Box>
                <Iconify icon="eva:arrow-forward-fill" width={24} />
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Iconify icon="eva:activity-fill" width={40} sx={{ color: 'error.main' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">Tax Report</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tax deductions and compliance report
                  </Typography>
                </Box>
                <Iconify icon="eva:arrow-forward-fill" width={24} />
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Iconify icon="eva:trending-up-fill" width={40} sx={{ color: 'info.main' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">Payroll Trends</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Month-over-month payroll analysis
                  </Typography>
                </Box>
                <Iconify icon="eva:arrow-forward-fill" width={24} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

