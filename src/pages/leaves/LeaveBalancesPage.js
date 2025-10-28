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
  TextField,
  MenuItem,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import leaveService from '../../services/api/leaveService';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function LeaveBalancesPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      console.log('🔄 [Leave Balances] Fetching for year:', selectedYear);
      const response = await leaveService.getBalances();
      console.log('📥 [Leave Balances] FULL Response:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        const balancesArray = response.balances || [];
        setBalances(balancesArray);
        console.log(`✅ [Leave Balances] Loaded ${balancesArray.length} balances`);
        console.log('📋 [Leave Balances] Data:', balancesArray.map(b => ({
          id: b.id,
          type: b.leaveType || b.leave_type_name,
          allocated: b.allocated,
          used: b.used,
          remaining: b.remaining
        })));
        
        if (balancesArray.length === 0) {
          console.warn('⚠️  [Leave Balances] Response successful but balances array is empty');
          console.warn('    This might mean:');
          console.warn('    1. User has no employee profile');
          console.warn('    2. No leave types configured');
          console.warn('    3. Backend calculation returned empty array');
        }
      } else {
        console.error('❌ [Leave Balances] API returned success=false:', response);
        setBalances([]);
        enqueueSnackbar(response.message || 'No leave balance data available', { variant: 'info' });
      }
    } catch (error) {
      console.error('❌ [Leave Balances] Error:', error);
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
          action={
            <TextField
              select
              label="Year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              sx={{ minWidth: 150 }}
              size="small"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          }
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : balances.length === 0 ? (
          <Card sx={{ p: 5, textAlign: 'center' }}>
            <Iconify icon="eva:inbox-outline" sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No leave balance data available
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Leave balances will be allocated by HR for year {selectedYear}
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {balances.map((balance) => {
              const usedPercentage = balance.allocated > 0 
                ? (balance.used / balance.allocated) * 100 
                : 0;

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

                      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="space-between">
                        <Chip
                          label={`Allocated: ${balance.allocated}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`Used: ${balance.used}`}
                          size="small"
                          color={balance.color || 'default'}
                        />
                        {balance.pending > 0 && (
                          <Chip
                            label={`Pending: ${balance.pending}`}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
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

