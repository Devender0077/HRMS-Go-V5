import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Card, CardContent } from '@mui/material';
// redux
import { selectUser } from '../../../redux/slices/authSlice';
// utils
import { bgGradient } from '../../../utils/cssStyles';

// ----------------------------------------------------------------------

const StyledRoot = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
  ...bgGradient({
    direction: '135deg',
    startColor: theme.palette.primary.light,
    endColor: theme.palette.primary.main,
  }),
}));

// ----------------------------------------------------------------------

export default function HRMSWelcome() {
  const { t } = useTranslation();
  const user = useSelector(selectUser);

  const currentHour = new Date().getHours();
  let greeting = t('dashboard.welcome_back');
  
  if (currentHour < 12) {
    greeting = 'Good Morning';
  } else if (currentHour < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }

  return (
    <StyledRoot>
      <CardContent>
        <Typography variant="h3" sx={{ color: 'common.white', mb: 2 }}>
          {greeting}, {user?.name || 'User'}! 👋
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.9, color: 'common.white' }}>
          Welcome to your HRMS dashboard. Here's an overview of your HR metrics.
        </Typography>
      </CardContent>
    </StyledRoot>
  );
}

