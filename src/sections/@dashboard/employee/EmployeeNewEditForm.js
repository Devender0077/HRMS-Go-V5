import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Divider, Alert, MenuItem, CircularProgress } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// services
import employeeService from '../../../services/api/employeeService';
import departmentService from '../../../services/departmentService';
import branchService from '../../../services/branchService';
import designationService from '../../../services/designationService';
import configurationService from '../../../services/api/configurationService';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSelect,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

EmployeeNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentEmployee: PropTypes.object,
};

export default function EmployeeNewEditForm({ isEdit = false, currentEmployee }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // State for dropdown options
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]); // For manager selection
  const [shifts, setShifts] = useState([]); // For shift selection
  const [attendancePolicies, setAttendancePolicies] = useState([]); // For attendance policy selection
  const [paymentMethods, setPaymentMethods] = useState([]); // For payment method selection

  // Fetch dropdown options from database
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [deptRes, branchRes, designRes, empRes, shiftsRes, policiesRes, paymentRes] = await Promise.all([
          departmentService.getAll().catch(() => ({ data: [], departments: [] })),
          branchService.getAll().catch(() => ({ data: [], branches: [] })),
          designationService.getAll().catch(() => ({ data: [], designations: [] })),
          employeeService.getAllEmployees().catch(() => ({ data: { employees: [] }, employees: [] })),
          configurationService.getShifts({ status: 'active' }).catch(() => ({ data: [], shifts: [] })),
          configurationService.getAttendancePolicies({ status: 'active' }).catch(() => ({ data: [], policies: [] })),
          configurationService.getPaymentMethods({ status: 'active' }).catch(() => ({ data: [], methods: [] })),
        ]);

        // Extract departments (handle multiple response formats)
        const depts = deptRes.data?.departments || deptRes.departments || deptRes.data || deptRes || [];
        setDepartments(Array.isArray(depts) ? depts : []);

        // Extract branches (handle multiple response formats)
        const branchesList = branchRes.data?.branches || branchRes.branches || branchRes.data || branchRes || [];
        setBranches(Array.isArray(branchesList) ? branchesList : []);

        // Extract designations (handle multiple response formats)
        const designsList = designRes.data?.designations || designRes.designations || designRes.data || designRes || [];
        setDesignations(Array.isArray(designsList) ? designsList : []);

        // Extract employees (handle multiple response formats)
        const empList = empRes.data?.employees || empRes.employees || empRes.data || empRes || [];
        setEmployees(Array.isArray(empList) ? empList : []);

        // Extract shifts (handle multiple response formats)
        const shiftsList = shiftsRes.data?.shifts || shiftsRes.data || shiftsRes.shifts || shiftsRes || [];
        setShifts(Array.isArray(shiftsList) ? shiftsList : []);

        // Extract policies (handle multiple response formats)
        const policiesList = policiesRes.data?.policies || policiesRes.data || policiesRes.policies || policiesRes || [];
        setAttendancePolicies(Array.isArray(policiesList) ? policiesList : []);

        // Extract payment methods (handle multiple response formats)
        const methodsList = paymentRes.data?.methods || paymentRes.data || paymentRes.methods || paymentRes || [];
        setPaymentMethods(Array.isArray(methodsList) ? methodsList : []);

        console.log('Fetched options:', {
          departments: depts,
          branches: branchesList,
          designations: designsList,
          employees: empList,
          shifts: shiftsList,
          policies: policiesList,
          methods: methodsList
        });
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const NewEmployeeSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email must be valid'),
    phone: Yup.string().required('Phone is required'),
    employeeId: Yup.string().required('Employee ID is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    branch: Yup.string().required('Branch is required'),
    department: Yup.string().required('Department is required'),
    designation: Yup.string().required('Designation is required'),
    joiningDate: Yup.string().required('Joining date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      // Basic Information
      firstName: currentEmployee?.firstName || currentEmployee?.first_name || '',
      lastName: currentEmployee?.lastName || currentEmployee?.last_name || '',
      email: currentEmployee?.email || '',
      phone: currentEmployee?.phone || '',
      employeeId: currentEmployee?.employeeId || currentEmployee?.employee_id || '',
      dateOfBirth: currentEmployee?.dateOfBirth || currentEmployee?.date_of_birth || '',
      gender: currentEmployee?.gender || '',
      maritalStatus: currentEmployee?.maritalStatus || currentEmployee?.marital_status || '',
      bloodGroup: currentEmployee?.bloodGroup || currentEmployee?.blood_group || '',
      nationality: currentEmployee?.nationality || '',
      status: currentEmployee?.status || 'Active',
      
      // Employment Details
      branch: currentEmployee?.branch || currentEmployee?.branch_id || '',
      department: currentEmployee?.department || currentEmployee?.department_id || '',
      designation: currentEmployee?.designation || currentEmployee?.designation_id || '',
      shift: currentEmployee?.shift || '',
      employmentType: currentEmployee?.employmentType || currentEmployee?.employment_type || 'full_time',
      attendancePolicy: currentEmployee?.attendancePolicy || currentEmployee?.attendance_policy || '',
      joiningDate: currentEmployee?.joiningDate || currentEmployee?.joining_date || '',
      reportsTo: currentEmployee?.reportsTo || currentEmployee?.manager_id || '',
      
      // Address Information
      address: currentEmployee?.address || '',
      city: currentEmployee?.city || '',
      state: currentEmployee?.state || '',
      country: currentEmployee?.country || '',
      zipCode: currentEmployee?.zipCode || currentEmployee?.postal_code || '',
      
      // Emergency Contact
      emergencyContactName: currentEmployee?.emergencyContactName || currentEmployee?.emergency_contact_name || '',
      emergencyContactPhone: currentEmployee?.emergencyContactPhone || currentEmployee?.emergency_contact_phone || '',
      emergencyContactRelation: currentEmployee?.emergencyContactRelation || currentEmployee?.emergency_contact_relation || '',
      
      // Bank Information
      bankName: currentEmployee?.bankName || currentEmployee?.bank_name || '',
      accountNumber: currentEmployee?.accountNumber || currentEmployee?.account_number || '',
      routingNumber: currentEmployee?.routingNumber || currentEmployee?.routing_number || '',
      swiftCode: currentEmployee?.swiftCode || currentEmployee?.swift_code || '',
      bankAddress: currentEmployee?.bankAddress || currentEmployee?.bank_address || '',
      
      // Salary Information
      basicSalary: currentEmployee?.basicSalary || currentEmployee?.basic_salary || '',
      paymentMethod: currentEmployee?.paymentMethod || currentEmployee?.payment_method || 'Bank Transfer',
      
      // Login Information
      temporaryPassword: '',
    }),
    [currentEmployee]
  );

  const methods = useForm({
    resolver: yupResolver(NewEmployeeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      let response;
      
      if (isEdit && currentEmployee?.id) {
        // Update existing employee
        response = await employeeService.update(currentEmployee.id, data);
      } else {
        // Create new employee
        response = await employeeService.create(data);
      }

      if (response.success) {
        reset();
        enqueueSnackbar(response.message || (!isEdit ? 'Employee created successfully!' : 'Employee updated successfully!'));
        navigate(PATH_DASHBOARD.hr.employees.list);
      } else {
        enqueueSnackbar(response.message || 'Operation failed', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('An error occurred', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            {/* BASIC INFORMATION */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Basic Information
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Enter the basic information of the employee
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              sx={{ mb: 3 }}
            >
              <RHFTextField name="firstName" label="First Name" placeholder="Enter first name" />
              <RHFTextField name="lastName" label="Last Name" placeholder="Enter last name" />
              <RHFTextField name="email" label="Email" placeholder="Enter email address" />
              <RHFTextField name="phone" label="Phone" placeholder="Enter phone number" />
              <RHFTextField name="employeeId" label="Employee ID" placeholder="Enter employee ID" />
              <RHFTextField 
                name="dateOfBirth" 
                label="Date of Birth" 
                type="date" 
                InputLabelProps={{ shrink: true }}
                placeholder="mm/dd/yyyy"
              />
              
              <RHFSelect name="gender" label="Gender">
                <MenuItem value="">Select gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </RHFSelect>

              <RHFSelect name="maritalStatus" label="Marital Status">
                <MenuItem value="">Select marital status</MenuItem>
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="married">Married</MenuItem>
                <MenuItem value="divorced">Divorced</MenuItem>
                <MenuItem value="widowed">Widowed</MenuItem>
              </RHFSelect>

              <RHFSelect name="bloodGroup" label="Blood Group">
                <MenuItem value="">Select blood group</MenuItem>
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </RHFSelect>

              <RHFTextField name="nationality" label="Nationality" placeholder="Enter nationality" />

              <RHFSelect name="status" label="Employment Status">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="terminated">Terminated</MenuItem>
              </RHFSelect>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* EMPLOYMENT DETAILS */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Employment Details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Enter the employment details of the employee
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              sx={{ mb: 3 }}
            >
              <RHFSelect name="branch" label="Branch / Location">
                <MenuItem value="">Select branch</MenuItem>
                {loading ? (
                  <MenuItem disabled><CircularProgress size={16} sx={{ mr: 1 }} /> Loading branches...</MenuItem>
                ) : branches.length > 0 ? (
                  branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name} {branch.city ? `- ${branch.city}, ${branch.state}` : ''}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No branches found - Add in System Setup</MenuItem>
                )}
              </RHFSelect>

              <RHFSelect name="department" label="Department">
                <MenuItem value="">Select department</MenuItem>
                {loading ? (
                  <MenuItem disabled><CircularProgress size={16} sx={{ mr: 1 }} /> Loading departments...</MenuItem>
                ) : departments.length > 0 ? (
                  departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name} {dept.code ? `(${dept.code})` : ''}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No departments found - Add in System Setup</MenuItem>
                )}
              </RHFSelect>

              <RHFSelect name="designation" label="Designation">
                <MenuItem value="">Select designation</MenuItem>
                {loading ? (
                  <MenuItem disabled><CircularProgress size={16} sx={{ mr: 1 }} /> Loading designations...</MenuItem>
                ) : designations.length > 0 ? (
                  designations.map((designation) => (
                    <MenuItem key={designation.id} value={designation.id}>
                      {designation.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No designations found - Add in System Setup</MenuItem>
                )}
              </RHFSelect>

              <RHFSelect name="shift" label="Shift">
                {loading ? (
                  <MenuItem value="">
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : shifts.length === 0 ? (
                  <MenuItem value="">No shifts configured</MenuItem>
                ) : [
                    <MenuItem key="empty" value="">Select shift</MenuItem>,
                    ...shifts.map((shift) => (
                      <MenuItem key={shift.id} value={shift.name}>
                        {shift.name} ({shift.start_time} - {shift.end_time})
                      </MenuItem>
                    ))
                  ]}
              </RHFSelect>

              <RHFSelect name="employmentType" label="Employment Type">
                <MenuItem value="full_time">Full Time</MenuItem>
                <MenuItem value="part_time">Part Time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="intern">Intern</MenuItem>
              </RHFSelect>

              <RHFSelect name="attendancePolicy" label="Attendance Policy">
                {loading ? (
                  <MenuItem value="">
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : attendancePolicies.length === 0 ? (
                  <MenuItem value="">No policies configured</MenuItem>
                ) : [
                    <MenuItem key="empty" value="">Select attendance policy</MenuItem>,
                    ...attendancePolicies.map((policy) => (
                      <MenuItem key={policy.id} value={policy.name}>
                        {policy.name}
                      </MenuItem>
                    ))
                  ]}
              </RHFSelect>

              <RHFTextField 
                name="joiningDate" 
                label="Joining Date" 
                type="date" 
                InputLabelProps={{ shrink: true }}
                placeholder="mm/dd/yyyy"
              />

              <Box>
                <RHFSelect name="reportsTo" label="Reports To">
                  <MenuItem value="">Select reporting manager</MenuItem>
                  {loading ? (
                    <MenuItem disabled>Loading employees...</MenuItem>
                  ) : employees.length > 0 ? (
                    employees
                      .filter(emp => !currentEmployee || emp.id !== currentEmployee.id) // Don't show self
                      .map((emp) => {
                        const firstName = emp.firstName || emp.first_name || '';
                        const lastName = emp.lastName || emp.last_name || '';
                        const designation = emp.designation || emp.designation_name || emp.designationName || '';
                        
                        return (
                          <MenuItem key={emp.id} value={emp.id}>
                            {firstName} {lastName}{designation ? ` (${designation})` : ''}
                          </MenuItem>
                        );
                      })
                  ) : (
                    <MenuItem disabled>No employees found - Run: npm run setup</MenuItem>
                  )}
                </RHFSelect>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                  Select the manager this employee reports to
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* ADDRESS INFORMATION */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Address Information
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Enter the address information of the employee
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              sx={{ mb: 3 }}
            >
              <RHFTextField 
                name="address" 
                label="Address" 
                placeholder="Enter address"
                sx={{ gridColumn: 'span 2' }}
              />
              <RHFTextField name="city" label="City" placeholder="Enter city" />
              <RHFTextField name="state" label="State/Province" placeholder="Enter state/province" />
              <RHFTextField name="country" label="Country" placeholder="Enter country" />
              <RHFTextField name="zipCode" label="ZIP/Postal Code" placeholder="Enter ZIP/postal code" />
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* EMERGENCY CONTACT */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Emergency Contact
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Enter emergency contact details for the employee
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              sx={{ mb: 3 }}
            >
              <RHFTextField name="emergencyContactName" label="Contact Name" placeholder="Enter emergency contact name" />
              <RHFTextField name="emergencyContactPhone" label="Contact Phone" placeholder="Enter emergency contact phone" />
              <RHFSelect name="emergencyContactRelation" label="Relationship">
                <MenuItem value="">Select relationship</MenuItem>
                <MenuItem value="Spouse">Spouse</MenuItem>
                <MenuItem value="Parent">Parent</MenuItem>
                <MenuItem value="Sibling">Sibling</MenuItem>
                <MenuItem value="Child">Child</MenuItem>
                <MenuItem value="Friend">Friend</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </RHFSelect>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* BANK INFORMATION */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Bank Information
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Enter the bank details of the employee
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              sx={{ mb: 3 }}
            >
              <RHFTextField name="bankName" label="Bank Name" placeholder="Enter bank name" />
              <RHFTextField name="accountNumber" label="Account Number" placeholder="Enter account number" />
              <RHFTextField name="routingNumber" label="Routing Number" placeholder="Enter routing number" />
              <RHFTextField name="swiftCode" label="SWIFT Code" placeholder="Enter SWIFT code" />
              <RHFTextField 
                name="bankAddress" 
                label="Bank Address" 
                placeholder="Enter bank address"
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* SALARY INFORMATION */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Salary Information
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Enter the salary details of the employee
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              sx={{ mb: 3 }}
            >
              <RHFTextField 
                name="basicSalary" 
                label="Basic Salary (Monthly)" 
                placeholder="Enter basic salary"
                type="number"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                }}
              />
              
              <RHFSelect name="paymentMethod" label="Payment Method">
                {loading ? (
                  <MenuItem value="">
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : paymentMethods.length === 0 ? (
                  <MenuItem value="">No payment methods configured</MenuItem>
                ) : [
                    <MenuItem key="empty" value="">Select payment method</MenuItem>,
                    ...paymentMethods.map((method) => (
                      <MenuItem key={method.id} value={method.name}>
                        {method.name}
                      </MenuItem>
                    ))
                  ]}
              </RHFSelect>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> The basic salary entered here will be used to calculate other salary components (HRA, allowances, deductions) based on the configured salary structure in System Setup.
              </Typography>
            </Alert>

            <Divider sx={{ my: 4 }} />

            {/* LOGIN INFORMATION */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Login Information
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Create login credentials for the employee
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              A login account will be created with the email address. You can either generate a random password or set a temporary password.
            </Alert>

            <Stack spacing={1}>
              <RHFTextField 
                name="temporaryPassword" 
                label="Temporary Password (Optional)" 
                type="password"
                placeholder="Leave empty for random password"
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', px: 1.5 }}>
                If left empty, a random password will be generated and sent to the employee's email
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                variant="outlined"
                onClick={() => navigate(PATH_DASHBOARD.hr.employees.list)}
              >
                Cancel
              </LoadingButton>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Employee' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

