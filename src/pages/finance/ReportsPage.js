import { Helmet } from 'react-helmet-async';
// @mui
import {
  Container,
  Grid,
  Card,
  Button,
  Stack,
  Typography,
  Box,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

const QUICK_STATS = [
  { title: 'Total Income', value: '$22,500', icon: 'eva:trending-up-fill', color: 'success' },
  { title: 'Total Expenses', value: '$8,455', icon: 'eva:trending-down-fill', color: 'error' },
  { title: 'Net Profit', value: '$14,045', icon: 'eva:award-fill', color: 'info' },
  { title: 'Pending', value: '$5,450', icon: 'eva:clock-fill', color: 'warning' },
];

const REPORT_TYPES = [
  { id: 1, title: 'Expense Summary Report', description: 'Detailed breakdown of all expenses by category', icon: 'eva:pie-chart-fill' },
  { id: 2, title: 'Income Statement', description: 'Comprehensive income and expense overview', icon: 'eva:file-text-fill' },
  { id: 3, title: 'Budget Analysis', description: 'Compare actual vs budgeted amounts', icon: 'eva:bar-chart-fill' },
  { id: 4, title: 'Profit & Loss', description: 'Monthly P&L statement with trends', icon: 'eva:trending-up-fill' },
  { id: 5, title: 'Cash Flow Report', description: 'Track cash inflows and outflows', icon: 'eva:swap-fill' },
  { id: 6, title: 'Employee Expense Report', description: 'Expenses by employee and department', icon: 'eva:people-fill' },
];

// ----------------------------------------------------------------------

export default function FinanceReportsPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Finance: Reports | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Financial Reports"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Finance' },
            { name: 'Reports' },
          ]}
        />

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {QUICK_STATS.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Card sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      display: 'flex',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${stat.color}.lighter`,
                      color: `${stat.color}.main`,
                    }}
                  >
                    <Iconify icon={stat.icon} width={24} />
                  </Box>
                  <Box>
                    <Typography variant="h4" color={`${stat.color}.main`}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Report Types */}
        <Grid container spacing={3}>
          {REPORT_TYPES.map((report) => (
            <Grid item xs={12} md={6} key={report.id}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                      }}
                    >
                      <Iconify icon={report.icon} width={24} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{report.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {report.description}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" size="small" startIcon={<Iconify icon="eva:eye-fill" />}>
                      View
                    </Button>
                    <Button variant="outlined" size="small" startIcon={<Iconify icon="eva:download-fill" />}>
                      Download
                    </Button>
                    <Button variant="outlined" size="small" startIcon={<Iconify icon="eva:email-fill" />}>
                      Email
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

