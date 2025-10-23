import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Alert } from '@mui/material';
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

  const LeaveSchema = Yup.object().shape({
    leaveType: Yup.string().required('Leave type is required'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required'),
    reason: Yup.string().required('Reason is required').min(10, 'Reason must be at least 10 characters'),
  });

  const defaultValues = {
    leaveType: '',
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await leaveService.apply(data);

      if (response.success) {
        reset();
        enqueueSnackbar(response.message || 'Leave application submitted successfully!');
        navigate(PATH_DASHBOARD.leaves.applications.list);
      } else {
        enqueueSnackbar(response.message || 'Failed to submit leave application', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('An error occurred', { variant: 'error' });
    }
  };

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
              <RHFSelect native name="leaveType" label="Leave Type">
                <option value="" />
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </RHFSelect>

              <Box /> {/* Empty space for grid layout */}

              <RHFTextField 
                name="startDate" 
                label="Start Date" 
                type="date" 
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField 
                name="endDate" 
                label="End Date" 
                type="date" 
                InputLabelProps={{ shrink: true }}
              />

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
              Leave Balance
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Annual Leave
                </Typography>
                <Typography variant="h6">12 days remaining</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Sick Leave
                </Typography>
                <Typography variant="h6">8 days remaining</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Casual Leave
                </Typography>
                <Typography variant="h6">5 days remaining</Typography>
              </Box>
            </Stack>
          </Card>

          <Alert severity="info">
            <Typography variant="caption">
              <strong>Important:</strong>
              <br />
              • Apply at least 2 days in advance
              <br />
              • Emergency leaves will be reviewed separately
              <br />
              • You'll receive notification once approved
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

