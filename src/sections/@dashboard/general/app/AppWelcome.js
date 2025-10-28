import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Box } from '@mui/material';
// utils
import { bgGradient } from '../../../../utils/cssStyles';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  color: theme.palette.primary.darker,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const StyledBg = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: -1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: theme.palette.common.white,
  '&:before': {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -2,
    content: '""',
    opacity: 0.2,
    ...bgGradient({
      direction: '135deg',
      startColor: theme.palette.primary.light,
      endColor: theme.palette.primary.main,
    }),
  },
}));

// ----------------------------------------------------------------------

AppWelcome.propTypes = {
  img: PropTypes.node,
  action: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default function AppWelcome({ title, description, action, img, ...other }) {
  return (
    <StyledRoot {...other}>
      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          pl: 5,
          // Reduce vertical padding to avoid large bottom space
          py: { xs: 2, md: 0 },
          pr: { xs: 5, md: 0 },
          textAlign: { xs: 'center', md: 'left' },
          // Limit content width on larger screens so it doesn't overlap the illustration
          maxWidth: { md: 'calc(100% - 400px)' },
        }}
      >
        <Typography
          paragraph
          variant="h4"
          sx={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
            // reduce bottom margin on small screens
            mb: { xs: 1.5, xl: 5 },
            // Ensure long text wraps and stays inside the card
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          {description}
        </Typography>

        {action && action}
      </Stack>

      {img && (
        <Box sx={{ flexShrink: 0, display: { xs: 'none', md: 'block' }, pl: { md: 3 }, pr: { md: 5 } }}>
          {img}
        </Box>
      )}

      <StyledBg />
    </StyledRoot>
  );
}
