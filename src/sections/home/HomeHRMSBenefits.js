import { m } from 'framer-motion';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Container, Typography, Grid, Stack } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const BENEFITS = [
  {
    icon: 'eva:person-done-fill',
    title: 'Face Recognition',
    description: 'Advanced biometric authentication for secure and contactless attendance',
  },
  {
    icon: 'eva:globe-2-fill',
    title: 'Multi-Language Support',
    description: 'Support for 18 languages with RTL for global workforce management',
  },
  {
    icon: 'eva:bulb-fill',
    title: 'AI-Powered Insights',
    description: 'Smart analytics and predictions to optimize HR decisions',
  },
  {
    icon: 'eva:cloud-upload-fill',
    title: 'Cloud Storage',
    description: 'Secure document storage with AWS, Wasabi, or local options',
  },
  {
    icon: 'eva:smartphone-fill',
    title: 'Mobile Ready',
    description: 'Access from anywhere with responsive web and mobile apps',
  },
  {
    icon: 'eva:lock-fill',
    title: 'Role-Based Access',
    description: 'Granular permissions and security controls for data protection',
  },
];

const StyledRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

const StyledIcon = styled('div')(({ theme }) => ({
  width: 64,
  height: 64,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  justifyContent: 'center',
  color: theme.palette.primary.main,
  background: alpha(theme.palette.primary.main, 0.08),
}));

// ----------------------------------------------------------------------

export default function HomeHRMSBenefits() {
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
              Why Choose Us
            </Typography>
          </m.div>

          <m.div variants={varFade().inDown}>
            <Typography variant="h2">
              Advanced Features for <br /> Modern HR Teams
            </Typography>
          </m.div>
        </Stack>

        <Box sx={{ position: 'relative' }}>
          <Grid container spacing={{ xs: 4, md: 8 }}>
            {BENEFITS.map((benefit, index) => (
              <Grid key={benefit.title} item xs={12} sm={6} md={4}>
                <m.div variants={varFade().inUp}>
                  <Stack spacing={2} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <StyledIcon sx={{ mx: { xs: 'auto', md: 0 } }}>
                      <Iconify icon={benefit.icon} width={32} />
                    </StyledIcon>

                    <Typography variant="h5">{benefit.title}</Typography>

                    <Typography sx={{ color: 'text.secondary' }}>
                      {benefit.description}
                    </Typography>
                  </Stack>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </StyledRoot>
  );
}

