import { m } from 'framer-motion';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Container, Typography, Stack } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: 'eva:people-fill',
    title: 'Employee Management',
    description: 'Complete employee lifecycle management from onboarding to retirement with detailed profiles and records.',
  },
  {
    icon: 'eva:clock-fill',
    title: 'Attendance & Time Tracking',
    description: 'Real-time attendance tracking with clock-in/out, biometric integration, and comprehensive reports.',
  },
  {
    icon: 'eva:calendar-fill',
    title: 'Leave Management',
    description: 'Automated leave requests, approvals, and balance tracking with customizable leave policies.',
  },
  {
    icon: 'eva:credit-card-fill',
    title: 'Payroll Processing',
    description: 'Streamlined payroll with automatic calculations, tax deductions, and detailed payslip generation.',
  },
  {
    icon: 'eva:person-add-fill',
    title: 'Recruitment Pipeline',
    description: 'End-to-end recruitment process from job posting to candidate onboarding with ATS integration.',
  },
  {
    icon: 'eva:trending-up-fill',
    title: 'Performance Management',
    description: 'Set goals, conduct reviews, and track employee performance with 360-degree feedback.',
  },
];

const StyledRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
  padding: theme.spacing(8, 5),
  boxShadow: theme.customShadows.z8,
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    boxShadow: theme.customShadows.z24,
    transform: 'translateY(-8px)',
  },
}));

const StyledIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(
    theme.palette.primary.main,
    0.24
  )} 100%)`,
}));

// ----------------------------------------------------------------------

export default function HomeHRMSFeatures() {
  return (
    <StyledRoot>
      <Container component={MotionViewport}>
        <Stack
          spacing={3}
          sx={{
            textAlign: 'center',
            mb: { xs: 5, md: 10 },
          }}
        >
          <m.div variants={varFade().inUp}>
            <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
              HRMS Go V5
            </Typography>
          </m.div>

          <m.div variants={varFade().inDown}>
            <Typography variant="h2">
              Complete HR Solutions <br /> for Modern Businesses
            </Typography>
          </m.div>

          <m.div variants={varFade().inDown}>
            <Typography sx={{ color: 'text.secondary', maxWidth: 720, mx: 'auto' }}>
              Streamline your HR operations with our comprehensive suite of tools designed to manage your workforce efficiently and effectively.
            </Typography>
          </m.div>
        </Stack>

        <Box
          gap={{ xs: 3, lg: 4 }}
          display="grid"
          alignItems="flex-start"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {CARDS.map((card) => (
            <m.div variants={varFade().inUp} key={card.title}>
              <StyledCard>
                <StyledIcon>
                  <Iconify icon={card.icon} width={48} color="primary.main" />
                </StyledIcon>

                <Typography variant="h5" sx={{ mb: 2 }}>
                  {card.title}
                </Typography>

                <Typography sx={{ color: 'text.secondary' }}>{card.description}</Typography>
              </StyledCard>
            </m.div>
          ))}
        </Box>
      </Container>
    </StyledRoot>
  );
}

