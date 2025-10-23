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
import LeaveApplyForm from '../../sections/@dashboard/leave/LeaveApplyForm';

// ----------------------------------------------------------------------

export default function LeaveApplyPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title> Leave: Apply | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Apply for Leave"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Leaves', href: PATH_DASHBOARD.leaves.root },
            { name: 'Apply' },
          ]}
        />

        <LeaveApplyForm />
      </Container>
    </>
  );
}

