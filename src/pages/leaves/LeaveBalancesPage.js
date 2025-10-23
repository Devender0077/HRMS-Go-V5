import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import leaveService from '../../services/leaveService';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

const LEAVE_BALANCES = [
  {
    id: '1',
    leaveType: 'Annual Leave',
    allocated: 20,
    used: 8,
    remaining: 12,
    icon: 'eva:calendar-fill',
    color: 'primary',
  },
  {
    id: '2',
    leaveType: 'Sick Leave',
    allocated: 10,
    used: 3,
    remaining: 7,
    icon: 'eva:heart-fill',
    color: 'error',
  },
  {
    id: '3',
    leaveType: 'Casual Leave',
    allocated: 5,
    used: 2,
    remaining: 3,
    icon: 'eva:umbrella-fill',
    color: 'info',
  },
  {
    id: '4',
    leaveType: 'Maternity Leave',
    allocated: 90,
    used: 0,
    remaining: 90,
    icon: 'eva:person-add-fill',
    color: 'success',
  },
];

// ----------------------------------------------------------------------

export default function LeaveBalancesPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const response = await leaveService.getBalances();
      if (response.success) {
        setBalances(response.balances || []);
      } else {
        setBalances([]);
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
      enqueueSnackbar('Error loading leave balances', { variant: 'error' });
      setBalances([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> Leave: Balances | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Leave Balances"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Leaves', href: PATH_DASHBOARD.leaves.root },
            { name: 'Balances' },
          ]}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : balances.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <Typography variant="body2" color="text.secondary">
              No leave balance data available
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {balances.map((balance) => {
              const usedPercentage = (balance.used / balance.allocated) * 100;

              return (
                <Grid key={balance.id} item xs={12} sm={6} md={6}>
                <Card>
                  <CardHeader
                    avatar={
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: `${balance.color}.lighter`,
                        }}
                      >
                        <Iconify
                          icon={balance.icon}
                          width={24}
                          sx={{ color: `${balance.color}.main` }}
                        />
                      </Box>
                    }
                    title={balance.leaveType}
                    subheader={`${balance.remaining} days remaining`}
                  />

                  <CardContent>
                    <Stack spacing={2}>
                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Used: {balance.used} days
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {usedPercentage.toFixed(0)}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={usedPercentage}
                          color={balance.color}
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>

                      <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Chip
                          label={`Allocated: ${balance.allocated}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`Used: ${balance.used}`}
                          size="small"
                          color={balance.color}
                        />
                        <Chip
                          label={`Remaining: ${balance.remaining}`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
          </Grid>
        )}

        {/* Summary Card */}
        {!loading && balances.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardHeader title="Leave Balance Summary" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ color: 'primary.main' }}>
                      {balances.reduce((acc, b) => acc + (b.allocated || 0), 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Allocated Days
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ color: 'error.main' }}>
                      {balances.reduce((acc, b) => acc + (b.used || 0), 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Used Days
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ color: 'success.main' }}>
                      {balances.reduce((acc, b) => acc + (b.remaining || 0), 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Remaining Days
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}

