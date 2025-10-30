import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
// services
import assetAssignmentService from '../../../services/api/assetAssignmentService';
import assetService from '../../../services/api/assetService';
import employeeService from '../../../services/api/employeeService';

// ----------------------------------------------------------------------

AssetAssignmentNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAssignment: PropTypes.object,
};

export default function AssetAssignmentNewEditForm({ isEdit = false, currentAssignment }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchAssets();
    fetchEmployees();
  }, []);

  const fetchAssets = async () => {
    try {
      const data = await assetService.getAll();
      console.log('✅ Assets loaded:', data);
      
      // Handle different response formats
      let assetsData = [];
      if (Array.isArray(data)) {
        assetsData = data;
      } else if (data && Array.isArray(data.data)) {
        assetsData = data.data;
      } else if (data && data.assets && Array.isArray(data.assets)) {
        assetsData = data.assets;
      }
      
      // Filter only available assets for new assignments
      const availableAssets = isEdit 
        ? assetsData 
        : assetsData.filter(asset => asset.current_status === 'available');
      
      setAssets(Array.isArray(availableAssets) ? availableAssets : []);
    } catch (error) {
      console.error('❌ Error fetching assets:', error);
      setAssets([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      console.log('✅ Employees loaded:', data);
      
      // Handle different response formats
      let employeesData = [];
      if (Array.isArray(data)) {
        employeesData = data;
      } else if (data && Array.isArray(data.data)) {
        employeesData = data.data;
      } else if (data && data.employees && Array.isArray(data.employees)) {
        employeesData = data.employees;
      }
      
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
    } catch (error) {
      console.error('❌ Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const NewAssignmentSchema = Yup.object().shape({
    asset_id: Yup.number().required('Asset is required'),
    employee_id: Yup.number().required('Employee is required'),
    assigned_date: Yup.date().required('Assigned date is required'),
    expected_return_date: Yup.date().nullable(),
    condition_at_assignment: Yup.string().required('Condition is required'),
    assignment_notes: Yup.string(),
    status: Yup.string().required('Status is required'),
  });

  const defaultValues = useMemo(
    () => ({
      asset_id: currentAssignment?.asset_id || '',
      employee_id: currentAssignment?.employee_id || '',
      assigned_date: currentAssignment?.assigned_date ? new Date(currentAssignment.assigned_date) : new Date(),
      expected_return_date: currentAssignment?.expected_return_date ? new Date(currentAssignment.expected_return_date) : null,
      condition_at_assignment: currentAssignment?.condition_at_assignment || 'good',
      assignment_notes: currentAssignment?.assignment_notes || '',
      status: currentAssignment?.status || 'active',
    }),
    [currentAssignment]
  );

  const methods = useForm({
    resolver: yupResolver(NewAssignmentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  // Log validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('❌ Form validation errors:', errors);
    }
  }, [errors]);

  const values = watch();

  useEffect(() => {
    if (isEdit && currentAssignment) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentAssignment, reset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      console.log('📝 Form submitted with data:', data);

      // Format dates
      const formattedData = {
        ...data,
        assigned_date: data.assigned_date ? new Date(data.assigned_date).toISOString().split('T')[0] : null,
        expected_return_date: data.expected_return_date ? new Date(data.expected_return_date).toISOString().split('T')[0] : null,
      };

      console.log('📤 Sending to backend:', formattedData);

      if (isEdit) {
        const response = await assetAssignmentService.update(currentAssignment.id, formattedData);
        console.log('✅ Update response:', response);
        enqueueSnackbar('Assignment updated successfully!', { variant: 'success' });
      } else {
        const response = await assetAssignmentService.create(formattedData);
        console.log('✅ Create response:', response);
        enqueueSnackbar('Assignment created successfully!', { variant: 'success' });
      }

      navigate('/dashboard/assets/assignments');
    } catch (error) {
      console.error('❌ Error saving assignment:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save assignment';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Assignment Information</Typography>

              <RHFSelect name="asset_id" label="Asset">
                <MenuItem value="">-- Select Asset --</MenuItem>
                {Array.isArray(assets) && assets.map((asset) => (
                  <MenuItem key={asset.id} value={asset.id}>
                    {asset.asset_name} ({asset.asset_code}) - {asset.category?.name || asset.category_name || 'No Category'}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="employee_id" label="Employee">
                <MenuItem value="">-- Select Employee --</MenuItem>
                {Array.isArray(employees) && employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} - {employee.department?.name || employee.department_name || 'No Dept'}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Assigned Date"
                    value={values.assigned_date}
                    onChange={(newValue) => setValue('assigned_date', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Expected Return Date"
                    value={values.expected_return_date}
                    onChange={(newValue) => setValue('expected_return_date', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="condition_at_assignment" label="Condition at Assignment">
                    <MenuItem value="excellent">Excellent</MenuItem>
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="fair">Fair</MenuItem>
                    <MenuItem value="poor">Poor</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="status" label="Status">
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="returned">Returned</MenuItem>
                    <MenuItem value="lost">Lost</MenuItem>
                    <MenuItem value="damaged">Damaged</MenuItem>
                  </RHFSelect>
                </Grid>
              </Grid>

              <RHFTextField
                name="assignment_notes"
                label="Assignment Notes"
                multiline
                rows={4}
              />
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
              >
                {!isEdit ? 'Create Assignment' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

