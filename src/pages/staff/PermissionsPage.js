import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Stack,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const MOCK_PERMISSIONS = {
  dashboard: [
    { id: 1, name: 'View Dashboard', slug: 'view-dashboard', description: 'Access to main dashboard' },
    { id: 2, name: 'View Analytics', slug: 'view-analytics', description: 'View analytics and reports' },
  ],
  employees: [
    { id: 3, name: 'View Employees', slug: 'view-employees', description: 'View employee list' },
    { id: 4, name: 'Create Employee', slug: 'create-employee', description: 'Add new employees' },
    { id: 5, name: 'Edit Employee', slug: 'edit-employee', description: 'Edit employee details' },
    { id: 6, name: 'Delete Employee', slug: 'delete-employee', description: 'Delete employees' },
    { id: 7, name: 'View Employee Salary', slug: 'view-employee-salary', description: 'View salary information' },
    { id: 8, name: 'Edit Employee Salary', slug: 'edit-employee-salary', description: 'Edit employee salary' },
  ],
  attendance: [
    { id: 9, name: 'View Attendance', slug: 'view-attendance', description: 'View attendance records' },
    { id: 10, name: 'Manage Attendance', slug: 'manage-attendance', description: 'Create/edit attendance' },
    { id: 11, name: 'Approve Regularization', slug: 'approve-regularization', description: 'Approve requests' },
    { id: 12, name: 'Manage Shifts', slug: 'manage-shifts', description: 'Manage work shifts' },
  ],
  leaves: [
    { id: 13, name: 'View Leaves', slug: 'view-leaves', description: 'View leave requests' },
    { id: 14, name: 'Apply Leave', slug: 'apply-leave', description: 'Apply for leave' },
    { id: 15, name: 'Approve Leave', slug: 'approve-leave', description: 'Approve/reject leave' },
    { id: 16, name: 'Manage Leave Types', slug: 'manage-leave-types', description: 'Manage leave types' },
  ],
  payroll: [
    { id: 17, name: 'View Payroll', slug: 'view-payroll', description: 'View payroll records' },
    { id: 18, name: 'Process Payroll', slug: 'process-payroll', description: 'Process monthly payroll' },
    { id: 19, name: 'Manage Salary Components', slug: 'manage-salary-components', description: 'Manage components' },
    { id: 20, name: 'Generate Payslips', slug: 'generate-payslips', description: 'Generate payslips' },
  ],
  recruitment: [
    { id: 21, name: 'View Jobs', slug: 'view-jobs', description: 'View job postings' },
    { id: 22, name: 'Manage Jobs', slug: 'manage-jobs', description: 'Create/edit job postings' },
    { id: 23, name: 'View Applications', slug: 'view-applications', description: 'View applications' },
    { id: 24, name: 'Manage Applications', slug: 'manage-applications', description: 'Manage applications' },
  ],
  performance: [
    { id: 25, name: 'View Performance', slug: 'view-performance', description: 'View reviews' },
    { id: 26, name: 'Manage Performance', slug: 'manage-performance', description: 'Create/edit reviews' },
    { id: 27, name: 'View Goals', slug: 'view-goals', description: 'View goals' },
    { id: 28, name: 'Manage Goals', slug: 'manage-goals', description: 'Create/edit goals' },
  ],
  assets: [
    { id: 29, name: 'View Assets', slug: 'view-assets', description: 'View asset inventory' },
    { id: 30, name: 'Manage Assets', slug: 'manage-assets', description: 'Create/edit/delete assets' },
    { id: 31, name: 'Assign Assets', slug: 'assign-assets', description: 'Assign assets to employees' },
    { id: 32, name: 'Manage Maintenance', slug: 'manage-maintenance', description: 'Manage maintenance' },
  ],
  settings: [
    { id: 33, name: 'View Settings', slug: 'view-settings', description: 'View system settings' },
    { id: 34, name: 'Manage Settings', slug: 'manage-settings', description: 'Edit system settings' },
    { id: 35, name: 'Manage Roles', slug: 'manage-roles', description: 'Create/edit/delete roles' },
    { id: 36, name: 'Manage Permissions', slug: 'manage-permissions', description: 'Assign permissions' },
  ],
};

const MODULE_LABELS = {
  dashboard: 'Dashboard',
  employees: 'Employee Management',
  attendance: 'Attendance',
  leaves: 'Leave Management',
  payroll: 'Payroll',
  recruitment: 'Recruitment',
  performance: 'Performance',
  assets: 'Assets Management',
  settings: 'Settings & Administration',
};

// ----------------------------------------------------------------------

export default function PermissionsPage() {
  const { themeStretch } = useSettingsContext();
  const [expanded, setExpanded] = useState('dashboard');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Helmet>
        <title>Permissions | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="All Permissions"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Staff', href: PATH_DASHBOARD.staff.root },
            { name: 'Permissions' },
          ]}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          View all available permissions grouped by module. Permissions can be assigned to roles.
        </Typography>

        <Stack spacing={2}>
          {Object.entries(MOCK_PERMISSIONS).map(([module, permissions]) => (
            <Accordion
              key={module}
              expanded={expanded === module}
              onChange={handleChange(module)}
            >
              <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                sx={{
                  bgcolor: 'background.neutral',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                  <Typography variant="h6">{MODULE_LABELS[module]}</Typography>
                  <Chip
                    label={`${permissions.length} permissions`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container spacing={2}>
                  {permissions.map((permission) => (
                    <Grid item xs={12} sm={6} md={4} key={permission.id}>
                      <Card sx={{ p: 2, height: '100%' }}>
                        <Stack spacing={1}>
                          <Typography variant="subtitle2">{permission.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {permission.slug}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {permission.description}
                          </Typography>
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>
    </>
  );
}

