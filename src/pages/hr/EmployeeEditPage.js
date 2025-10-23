import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import { Container, Box, Typography, CircularProgress } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import employeeService from '../../services/api/employeeService';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import EmployeeNewEditForm from '../../sections/@dashboard/employee/EmployeeNewEditForm';

// ----------------------------------------------------------------------

export default function EmployeeEditPage() {
  const { id } = useParams();
  const { themeStretch } = useSettingsContext();
  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const emp = await employeeService.getById(id);
        
        // Map database fields (snake_case) to form fields (camelCase)
        const employeeData = {
          id: emp.id,
          employeeId: emp.employeeId || emp.employee_id,
          firstName: emp.first_name,
          lastName: emp.last_name,
          email: emp.email,
          phone: emp.phone,
          dateOfBirth: emp.date_of_birth,
          gender: emp.gender,
          maritalStatus: emp.marital_status,
          status: emp.status,
          branch: emp.branch_id,
          department: emp.department_id,
          designation: emp.designation_id,
          shift: emp.shift,
          employmentType: emp.employment_type,
          attendancePolicy: emp.attendance_policy,
          joiningDate: emp.joining_date,
          reportsTo: emp.manager_id,
          address: emp.address,
          city: emp.city,
          state: emp.state,
          country: emp.country,
          zipCode: emp.postal_code,
          bankName: emp.bank_name,
          accountNumber: emp.account_number,
          routingNumber: emp.routing_number,
          swiftCode: emp.swift_code,
          bankAddress: emp.bank_address,
          basicSalary: emp.basic_salary,
          paymentMethod: emp.payment_method,
        };
        
        console.log('Loaded employee data for edit:', employeeData);
        setEmployee(employeeData);
      } catch (error) {
        console.error('Error fetching employee:', error);
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography color="error" variant="h6">
            Employee not found or error loading data. Please try again.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title> Employee: Edit | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Employee"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Employees', href: PATH_DASHBOARD.hr.employees.list },
            { name: employee ? `${employee.firstName} ${employee.lastName}` : 'Edit' },
          ]}
        />

        <EmployeeNewEditForm isEdit currentEmployee={employee} />
      </Container>
    </>
  );
}
