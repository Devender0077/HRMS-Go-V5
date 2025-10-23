import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// @mui
import { Card, CardHeader, Stack, Button } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function HRMSQuickActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const ACTIONS = [
    {
      label: 'Clock In/Out',
      icon: 'eva:clock-fill',
      path: PATH_DASHBOARD.attendance.clock,
      color: 'primary',
    },
    {
      label: 'Apply Leave',
      icon: 'eva:calendar-fill',
      path: PATH_DASHBOARD.leaves.applications.new,
      color: 'success',
    },
    {
      label: 'Add Employee',
      icon: 'eva:person-add-fill',
      path: PATH_DASHBOARD.hr.employees.new,
      color: 'info',
    },
    {
      label: 'Schedule Meeting',
      icon: 'eva:video-fill',
      path: PATH_DASHBOARD.meetings.new,
      color: 'warning',
    },
  ];

  return (
    <Card>
      <CardHeader title={t('dashboard.quick_actions')} />

      <Stack spacing={2} sx={{ p: 3 }}>
        {ACTIONS.map((action) => (
          <Button
            key={action.label}
            variant="outlined"
            color={action.color}
            size="large"
            startIcon={<Iconify icon={action.icon} />}
            onClick={() => navigate(action.path)}
            fullWidth
          >
            {action.label}
          </Button>
        ))}
      </Stack>
    </Card>
  );
}

