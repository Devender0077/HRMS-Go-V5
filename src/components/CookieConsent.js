import { useState, useEffect } from 'react';
// @mui
import { Box, Button, Paper, Typography, Stack, IconButton, Slide } from '@mui/material';
// components
import Iconify from './iconify';
// services
import generalSettingsService from '../services/api/generalSettingsService';

// ----------------------------------------------------------------------

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    message: 'We use cookies to enhance your experience and analyze our traffic.',
    buttonText: 'Accept',
    position: 'bottom',
  });

  useEffect(() => {
    // Check if user has already accepted
    const accepted = localStorage.getItem('cookieConsent');
    if (accepted === 'true') {
      return;
    }

    // Fetch cookie consent settings
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await generalSettingsService.getByCategory('cookie');
      console.log('Cookie settings:', response);
      
      if (response && response.settings) {
        const enabled = response.settings.cookie_consent_enabled === 'true';
        const message = response.settings.cookie_consent_message || settings.message;
        const buttonText = response.settings.cookie_consent_button_text || settings.buttonText;
        const position = response.settings.cookie_consent_position || settings.position;
        
        setSettings({ enabled, message, buttonText, position });
        
        // Only show if enabled
        if (enabled) {
          setShow(true);
        }
      }
    } catch (error) {
      console.error('Error fetching cookie settings:', error);
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <Slide direction="up" in={show} mountOnEnter unmountOnExit>
      <Paper
        sx={{
          position: 'fixed',
          [settings.position]: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          p: 3,
          m: 2,
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows.z24,
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <Iconify
                icon="eva:info-fill"
                width={24}
                sx={{ color: 'info.main', mt: 0.5, flexShrink: 0 }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Cookie Notice
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {settings.message}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} flexShrink={0}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleDecline}
              sx={{ minWidth: 100 }}
            >
              Decline
            </Button>
            <Button
              variant="contained"
              onClick={handleAccept}
              sx={{ minWidth: 100 }}
            >
              {settings.buttonText}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Slide>
  );
}

