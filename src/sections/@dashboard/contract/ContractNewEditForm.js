import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, MenuItem, TextField, Button, Box, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/iconify';
// services
import contractService from '../../../services/api/contractService';
import employeeService from '../../../services/api/employeeService';

// ----------------------------------------------------------------------

const CONTRACT_TYPES = [
  { value: 'permanent', label: 'Permanent' },
  { value: 'contract', label: 'Contract' },
  { value: 'probation', label: 'Probation' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
];

const CONTRACT_STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'terminated', label: 'Terminated' },
];

// ----------------------------------------------------------------------

ContractNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentContract: PropTypes.object,
};

export default function ContractNewEditForm({ isEdit = false, isView = false, currentContract }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [employees, setEmployees] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(currentContract?.filePath || null);

  useEffect(() => {
    fetchEmployees();
  }, [currentContract]); // Re-fetch when currentContract changes

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      console.log('✅ Employees loaded for dropdown:', response);
      
      const employeesData = response?.data || [];
      const employeesList = Array.isArray(employeesData) ? employeesData : [];
      
      // If editing and contract has employee data, ensure it's in the list
      if (currentContract?.employee && currentContract.employee.id) {
        const employeeExists = employeesList.find(emp => emp.id === currentContract.employee.id);
        if (!employeeExists) {
          console.log('ℹ️ Adding contract employee to dropdown:', currentContract.employee);
          employeesList.unshift(currentContract.employee);
        }
      }
      
      console.log(`📋 Total employees in dropdown: ${employeesList.length}`);
      setEmployees(employeesList);
    } catch (error) {
      console.error('❌ Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const NewContractSchema = Yup.object().shape({
    employeeId: Yup.number().required('Employee is required'),
    contractType: Yup.string().required('Contract type is required'),
    contractNumber: Yup.string(),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().nullable(),
    salary: Yup.number().min(0, 'Salary must be positive'),
    terms: Yup.string(),
    status: Yup.string().required('Status is required'),
  });

  const defaultValues = useMemo(
    () => ({
      employeeId: currentContract?.employeeId || '',
      contractType: currentContract?.contractType || 'permanent',
      contractNumber: currentContract?.contractNumber || '',
      startDate: currentContract?.startDate ? new Date(currentContract.startDate) : new Date(),
      endDate: currentContract?.endDate ? new Date(currentContract.endDate) : null,
      salary: currentContract?.salary || '',
      terms: currentContract?.terms || '',
      status: currentContract?.status || 'active',
    }),
    [currentContract]
  );

  const methods = useForm({
    resolver: yupResolver(NewContractSchema),
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
    if (isEdit && currentContract) {
      console.log('📝 Resetting form with contract data:', currentContract);
      console.log('📝 Default values:', defaultValues);
      reset(defaultValues);
      setCurrentFile(currentContract.filePath || null);
    }
    if (!isEdit) {
      reset(defaultValues);
      setCurrentFile(null);
    }
  }, [isEdit, currentContract, reset, defaultValues]);

  // Debug log for current employee value
  useEffect(() => {
    if (values.employeeId) {
      console.log('👤 Current employeeId in form:', values.employeeId);
      const selectedEmployee = employees.find(emp => emp.id === values.employeeId);
      console.log('👤 Selected employee object:', selectedEmployee);
    }
  }, [values.employeeId, employees]);

  const onSubmit = async (data) => {
    try {
      console.log('📝 Form submitted with data:', data);

      // Format dates
      const formattedData = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : null,
        endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : null,
      };

      // If file is selected, create FormData for multipart upload
      let submitData;
      if (selectedFile) {
        console.log('📎 Uploading file:', selectedFile.name);
        submitData = new FormData();
        Object.keys(formattedData).forEach(key => {
          if (formattedData[key] !== null && formattedData[key] !== undefined) {
            submitData.append(key, formattedData[key]);
          }
        });
        submitData.append('contractFile', selectedFile);
      } else {
        submitData = formattedData;
      }

      console.log('📤 Sending to backend:', selectedFile ? 'FormData with file' : formattedData);

      if (isEdit) {
        const response = await contractService.update(currentContract.id, submitData);
        console.log('✅ Update response:', response);
        if (response.success) {
          enqueueSnackbar('Contract updated successfully!', { variant: 'success' });
        } else {
          throw new Error(response.message);
        }
      } else {
        const response = await contractService.create(submitData);
        console.log('✅ Create response:', response);
        if (response.success) {
          enqueueSnackbar('Contract created successfully!', { variant: 'success' });
        } else {
          throw new Error(response.message);
        }
      }

      navigate('/dashboard/contracts');
    } catch (error) {
      console.error('❌ Error saving contract:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save contract';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Contract Information</Typography>

              <RHFSelect name="employeeId" label="Employee" disabled={isView}>
                <MenuItem value="">-- Select Employee --</MenuItem>
                {Array.isArray(employees) && employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} - {employee.employee_id}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="contractType" label="Contract Type" disabled={isView}>
                    {CONTRACT_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="contractNumber" label="Contract Number" disabled={isView} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Start Date"
                    value={values.startDate}
                    onChange={(newValue) => setValue('startDate', newValue)}
                    disabled={isView}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="End Date"
                    value={values.endDate}
                    onChange={(newValue) => setValue('endDate', newValue)}
                    disabled={isView}
                    renderInput={(params) => <TextField {...params} fullWidth helperText="Leave empty for permanent contracts" />}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFTextField 
                    name="salary" 
                    label="Salary" 
                    type="number"
                    disabled={isView}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="status" label="Status" disabled={isView}>
                    {CONTRACT_STATUS.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
              </Grid>

              <RHFTextField
                name="terms"
                label="Terms and Conditions"
                multiline
                rows={6}
                placeholder="Enter contract terms and conditions..."
                disabled={isView}
              />

              {/* File Upload Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Contract Document
                </Typography>
                
                {currentFile && !selectedFile && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Current file: {currentFile.split('/').pop()}
                  </Alert>
                )}

                {!isView && (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                    fullWidth
                  >
                    {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload Contract Document'}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          console.log('📎 File selected:', file.name);
                          setSelectedFile(file);
                        }
                      }}
                    />
                  </Button>
                )}

                {selectedFile && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </Typography>
                )}
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              {isView ? (
                <LoadingButton
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/dashboard/contracts')}
                >
                  Back to List
                </LoadingButton>
              ) : (
                <LoadingButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  {!isEdit ? 'Create Contract' : 'Save Changes'}
                </LoadingButton>
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

