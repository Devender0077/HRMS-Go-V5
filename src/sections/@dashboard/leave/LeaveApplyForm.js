import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Alert, CircularProgress } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// services
import leaveService from '../../../services/api/leaveService';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSelect,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function LeaveApplyForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculatedDays, setCalculatedDays] = useState(0);

  const LeaveSchema = Yup.object().shape({
    leaveTypeId: Yup.string().required('Leave type is required'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required')
      .test('is-after-start', 'End date must be after start date', function(value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return new Date(value) >= new Date(startDate);
      }),
    reason: Yup.string().required('Reason is required').min(10, 'Reason must be at least 10 characters'),
  });

  const defaultValues = {
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
  };

  const methods = useForm({
    resolver: yupResolver(LeaveSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');
  const watchLeaveType = watch('leaveTypeId');

  // Load leave types and balances on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('🔄 [Leave Apply] Loading leave types and balances...');
        
        // Load leave types
        const typesResponse = await leaveService.getLeaveTypes();
        console.log('📥 [Leave Apply] Leave types response:', typesResponse);
        
        if (typesResponse.success) {
          setLeaveTypes(typesResponse.types || []);
          console.log(`✅ [Leave Apply] Loaded ${typesResponse.types?.length || 0} leave types`);
        }

        // Load leave balances
        const balancesResponse = await leaveService.getBalances();
        console.log('📥 [Leave Apply] Leave balances FULL response:', JSON.stringify(balancesResponse, null, 2));
        
        if (balancesResponse.success) {
          const balancesArray = balancesResponse.balances || [];
          setLeaveBalances(balancesArray);
          console.log(`✅ [Leave Apply] Loaded ${balancesArray.length} leave balances`);
          console.log('📋 [Leave Apply] Balances data:', balancesArray.map(b => ({
            id: b.id,
            type: b.leaveType || b.leave_type_name,
            allocated: b.allocated,
            used: b.used,
            remaining: b.remaining
          })));
        } else {
          console.error('❌ [Leave Apply] Failed to load balances:', balancesResponse);
          setLeaveBalances([]);
        }
      } catch (error) {
        console.error('❌ [Leave Apply] Error loading data:', error);
        enqueueSnackbar('Failed to load leave types or balances', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [enqueueSnackbar]);

  // Auto-calculate days when dates change
  useEffect(() => {
    if (watchStartDate && watchEndDate) {
      const start = new Date(watchStartDate);
      const end = new Date(watchEndDate);
      
      if (end >= start) {
        // Calculate working days (excluding weekends)
        let days = 0;
        const current = new Date(start);
        
        while (current <= end) {
          const dayOfWeek = current.getDay();
          // Count weekdays only (Monday=1 to Friday=5)
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            days++;
          }
          current.setDate(current.getDate() + 1);
        }
        
        setCalculatedDays(days);
        console.log(`📊 [Leave Apply] Calculated ${days} working days`);
      } else {
        setCalculatedDays(0);
      }
    } else {
      setCalculatedDays(0);
    }
  }, [watchStartDate, watchEndDate]);

  const onSubmit = async (data) => {
    try {
      console.log('🔄 [Leave Apply] Submitting leave application:', data);

      // Validate against balance
      const selectedBalance = leaveBalances.find(b => b.id === parseInt(data.leaveTypeId));
      
      if (selectedBalance && calculatedDays > selectedBalance.remaining) {
        enqueueSnackbar(
          `Insufficient leave balance. You have ${selectedBalance.remaining} days remaining but requested ${calculatedDays} days.`,
          { variant: 'error' }
        );
        return;
      }

      // Submit with calculated days
      const submitData = {
        leaveTypeId: parseInt(data.leaveTypeId),
        startDate: data.startDate,
        endDate: data.endDate,
        days: calculatedDays,
        reason: data.reason,
        emergencyContact: data.emergencyContact || null,
      };

      console.log('📤 [Leave Apply] Final submit data:', submitData);
      const response = await leaveService.apply(submitData);
      console.log('✅ [Leave Apply] Response:', response);

      if (response.success) {
        reset();
        enqueueSnackbar(response.message || 'Leave application submitted successfully!');
        navigate(PATH_DASHBOARD.leaves.root);
      } else {
        enqueueSnackbar(response.message || 'Failed to submit leave application', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ [Leave Apply] Error:', error);
      enqueueSnackbar(error.response?.data?.message || 'An error occurred', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const selectedBalance = leaveBalances.find(b => b.id === parseInt(watchLeaveType));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Leave Application Details
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect 
                native 
                name="leaveTypeId" 
                label="Leave Type" 
                disabled={leaveTypes.length === 0}
                sx={{ minWidth: 200 }}
                InputLabelProps={{ shrink: true }}
              >
                <option value="">-- Select --</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </RHFSelect>

              {selectedBalance && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Available:
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    {selectedBalance.remaining} days
                  </Typography>
                </Box>
              )}

              <RHFTextField 
                name="startDate" 
                label="Start Date" 
                type="date" 
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />

              <RHFTextField 
                name="endDate" 
                label="End Date" 
                type="date" 
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: watchStartDate || new Date().toISOString().split('T')[0] }}
              />

              {calculatedDays > 0 && (
                <Alert severity="info" sx={{ gridColumn: 'span 2' }}>
                  <Typography variant="body2">
                    <strong>Calculated Leave Days:</strong> {calculatedDays} working days
                    {selectedBalance && (
                      <> (You will have {selectedBalance.remaining - calculatedDays} days remaining)</>
                    )}
                  </Typography>
                </Alert>
              )}

              <RHFTextField 
                name="emergencyContact" 
                label="Emergency Contact (Optional)" 
                sx={{ gridColumn: 'span 2' }}
              />

              <RHFTextField
                name="reason"
                label="Reason for Leave"
                multiline
                rows={4}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                variant="outlined"
                onClick={() => navigate(PATH_DASHBOARD.leaves.applications.list)}
              >
                Cancel
              </LoadingButton>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Submit Application
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Leave Balance
            </Typography>
            
            {leaveBalances.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No leave balance data available
              </Typography>
            ) : (
              <Stack spacing={2}>
                {leaveBalances.map((balance) => (
                  <Box 
                    key={balance.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: parseInt(watchLeaveType) === balance.id ? 'action.selected' : 'transparent',
                      border: parseInt(watchLeaveType) === balance.id ? 1 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {balance.leaveType}
                      </Typography>
                      {balance.pending > 0 && (
                        <Typography variant="caption" color="warning.main" sx={{ fontSize: '0.7rem' }}>
                          ({balance.pending} pending)
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant="h6" color={balance.remaining > 0 ? 'success.main' : 'error.main'}>
                      {balance.remaining} / {balance.allocated} days
                    </Typography>
                    {balance.used > 0 && (
                      <Typography variant="caption" color="text.disabled">
                        Used: {balance.used} days
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </Card>

          <Alert severity="info">
            <Typography variant="caption">
              <strong>Important:</strong>
              <br />
              • Apply at least 2 days in advance
              <br />
              • Working days only (weekends excluded)
              <br />
              • You'll receive notification once approved
              <br />
              {calculatedDays > 0 && (
                <>• Requesting {calculatedDays} working days</>
              )}
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

