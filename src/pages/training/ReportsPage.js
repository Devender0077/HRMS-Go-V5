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
  { title: 'Total Programs', value: 24, icon: 'eva:book-fill', color: 'primary' },
  { title: 'Active Sessions', value: 12, icon: 'eva:video-fill', color: 'info' },
  { title: 'Total Enrollments', value: 156, icon: 'eva:people-fill', color: 'success' },
  { title: 'Completed', value: 89, icon: 'eva:checkmark-circle-fill', color: 'warning' },
];

const REPORT_TYPES = [
  { id: 1, title: 'Training Completion Report', description: 'Track completion rates across all training programs', icon: 'eva:checkmark-square-fill' },
  { id: 2, title: 'Employee Training History', description: 'View complete training history for each employee', icon: 'eva:person-done-fill' },
  { id: 3, title: 'Training Effectiveness Report', description: 'Analyze training impact on performance metrics', icon: 'eva:trending-up-fill' },
  { id: 4, title: 'Program Enrollment Report', description: 'Track enrollment trends and capacity utilization', icon: 'eva:pie-chart-fill' },
  { id: 5, title: 'Certification Report', description: 'Monitor employee certifications and renewals', icon: 'eva:award-fill' },
  { id: 6, title: 'Training Budget Report', description: 'Analyze training costs and ROI', icon: 'eva:credit-card-fill' },
];

// ----------------------------------------------------------------------

export default function TrainingReportsPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Training: Reports | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Training Reports"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Training' },
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
                    <Typography variant="h3" color={`${stat.color}.main`}>
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

