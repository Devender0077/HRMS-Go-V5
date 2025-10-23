import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import EmployeeNewEditForm from '../../sections/@dashboard/employee/EmployeeNewEditForm';

// ----------------------------------------------------------------------

export default function EmployeeCreatePage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title> Employee: Create New | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create New Employee"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Employees', href: PATH_DASHBOARD.hr.employees.list },
            { name: 'New Employee' },
          ]}
        />

        <EmployeeNewEditForm />
      </Container>
    </>
  );
}

