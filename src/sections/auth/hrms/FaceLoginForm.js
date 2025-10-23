// @mui
import {
  Stack,
  Alert,
  Typography,
  Box,
  Card,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function FaceLoginForm() {
  return (
    <Stack spacing={3}>
      <Alert severity="info">
        <Typography variant="body2">
          <strong>Face Recognition Available Soon</strong>
          <br />
          This feature will be enabled after face-api.js models are configured by your administrator.
        </Typography>
      </Alert>

      <Card sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="center" sx={{ py: 5 }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: 'primary.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify
              icon="eva:person-fill"
              width={64}
              sx={{ color: 'primary.main' }}
            />
          </Box>

          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Face Recognition Login
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 400 }}>
            Login securely using facial recognition technology. This feature will allow you to
            authenticate without typing your password.
          </Typography>

          <Alert severity="info" sx={{ width: '100%' }}>
            <Typography variant="caption">
              <strong>Features when enabled:</strong>
              <br />
              • Fast and secure authentication
              <br />
              • No password required
              <br />
              • High accuracy face detection
              <br />
              • Works in various lighting conditions
            </Typography>
          </Alert>
        </Stack>
      </Card>

      <Alert severity="info">
        <Typography variant="caption">
          To enable this feature, the administrator needs to:
          <br />
          1. Download face-api.js models
          <br />
          2. Configure the backend API
          <br />
          3. Enable face recognition in system settings
        </Typography>
      </Alert>
    </Stack>
  );
}

