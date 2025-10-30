import { m, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Button, Box, Container, Typography, Stack } from '@mui/material';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// utils
import { textGradient, bgGradient } from '../../utils/cssStyles';
// components
import Iconify from '../../components/iconify';
import { MotionContainer, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/overlay_2.jpg',
  }),
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    position: 'fixed',
  },
}));

const StyledDescription = styled('div')(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(15, 3),
  textAlign: 'center',
}));

const StyledGradientText = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: '400%',
  fontFamily: "'Barlow', sans-serif",
  fontSize: `${64 / 16}rem`,
  textAlign: 'center',
  lineHeight: 1,
  padding: 0,
  marginTop: 8,
  marginBottom: 24,
  letterSpacing: 8,
  [theme.breakpoints.up('md')]: {
    fontSize: `${96 / 16}rem`,
  },
}));

const StyledEllipseTop = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: 480,
  height: 480,
  top: -80,
  right: -80,
  borderRadius: '50%',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
  // Make decorative element non-interactive so it doesn't block buttons
  pointerEvents: 'none',
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  position: 'absolute',
  height: 400,
  bottom: -200,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.08),
  // Make decorative element non-interactive so it doesn't block buttons
  pointerEvents: 'none',
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const { scrollYProgress } = useScroll();

  const [hide, setHide] = useState(false);

  useEffect(
    () =>
      scrollYProgress.onChange((scrollHeight) => {
        if (scrollHeight > 0.8) {
          setHide(true);
        } else {
          setHide(false);
        }
      }),
    [scrollYProgress]
  );

  if (hide) {
    return null;
  }

  return (
    <>
      <StyledRoot>
            <Container component={MotionContainer} sx={{ height: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <Description />
        </Container>

        <StyledEllipseTop />

        <StyledEllipseBottom />
      </StyledRoot>

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}

// ----------------------------------------------------------------------

function Description() {
  const { isAuthenticated } = useAuthContext();

  return (
    <StyledDescription>
      <m.div variants={varFade().in}>
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 2 }}>
          Complete Human Resource <br />
          Management System
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <StyledGradientText
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            repeatType: 'reverse',
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
        >
          HRMS Go V5
        </StyledGradientText>
      </m.div>

      <m.div variants={varFade().in}>
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 5, px: 2 }}>
          Transform your HR operations from recruitment to retirement with advanced features
          including face recognition, multi-language support, and AI-powered insights.
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 5 }}>
          {isAuthenticated ? (
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.general.app}
              color="inherit"
              size="large"
              variant="contained"
              startIcon={<Iconify icon="eva:grid-fill" width={24} />}
              sx={{
                bgcolor: 'text.primary',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                '&:hover': {
                  bgcolor: 'text.primary',
                },
                px: 4,
              }}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                component={RouterLink}
                to={PATH_AUTH.login}
                color="inherit"
                size="large"
                variant="contained"
                startIcon={<Iconify icon="eva:log-in-fill" width={24} />}
                sx={{
                  bgcolor: 'text.primary',
                  color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                  '&:hover': {
                    bgcolor: 'text.primary',
                  },
                  px: 4,
                }}
              >
                Login to Dashboard
              </Button>

              <Button
                color="inherit"
                size="large"
                variant="outlined"
                component={RouterLink}
                to={PATH_AUTH.register}
                startIcon={<Iconify icon="eva:person-add-fill" width={24} />}
                sx={{ borderColor: 'text.primary', px: 4 }}
              >
                Get Started Free
              </Button>
            </>
          )}
        </Stack>
      </m.div>

    </StyledDescription>
  );
}
