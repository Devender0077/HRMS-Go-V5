import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Stack,
  Link,
  Typography,
  Tabs,
  Tab,
  Box,
  Alert,
} from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// layouts
import LoginLayout from '../../layouts/login';
// components
import Iconify from '../../components/iconify';
// sections
import AuthLoginForm from './AuthLoginForm';
import FaceLoginForm from './FaceLoginForm';

// ----------------------------------------------------------------------

export default function HRMSLogin() {
  const [currentTab, setCurrentTab] = useState('traditional');

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const TABS = [
    {
      value: 'traditional',
      label: 'Email & Password',
      icon: <Iconify icon="eva:email-fill" width={20} />,
    },
    {
      value: 'face',
      label: 'Face Recognition',
      icon: <Iconify icon="eva:person-fill" width={20} />,
    },
  ];

  return (
    <LoginLayout
      title="Welcome to HRMS Go V5"
      illustration="/assets/illustrations/illustration_dashboard.png"
    >
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign in to HRMS</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">New user?</Typography>

          <Link component={RouterLink} to={PATH_AUTH.register} variant="subtitle2">
            Create an account
          </Link>
        </Stack>
      </Stack>

      <Tabs 
        value={currentTab} 
        onChange={handleChangeTab}
        sx={{ mb: 3 }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            icon={tab.icon}
            value={tab.value}
            iconPosition="start"
          />
        ))}
      </Tabs>

      <Box>
        {currentTab === 'traditional' && <AuthLoginForm />}
        {currentTab === 'face' && <FaceLoginForm />}
      </Box>
    </LoginLayout>
  );
}

