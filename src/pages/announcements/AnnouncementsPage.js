import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  Button,
  Container,
  Stack,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { getAvatar } from '../../utils/getAvatar';

// ----------------------------------------------------------------------

const MOCK_ANNOUNCEMENTS = [
  { 
    id: 1, 
    title: 'Company Holiday - Christmas', 
    content: 'Office will be closed on December 25th and 26th for Christmas holidays.', 
    category: 'Holiday',
    author: 'HR Admin',
    date: '2024-12-20',
    priority: 'high',
  },
  { 
    id: 2, 
    title: 'New Health Insurance Plan', 
    content: 'We are excited to announce our enhanced health insurance coverage starting January 2025.', 
    category: 'Benefits',
    author: 'Benefits Team',
    date: '2024-12-18',
    priority: 'medium',
  },
  { 
    id: 3, 
    title: 'Team Building Event', 
    content: 'Join us for the annual team building event on January 15th at Central Park.', 
    category: 'Event',
    author: 'HR Manager',
    date: '2024-12-15',
    priority: 'low',
  },
];

// ----------------------------------------------------------------------

export default function AnnouncementsPage() {
  const { themeStretch } = useSettingsContext();
  const [announcements] = useState(MOCK_ANNOUNCEMENTS);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Announcements | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Announcements"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Announcements' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Create Announcement
            </Button>
          }
        />

        <Stack spacing={3}>
          {announcements.map((announcement, index) => (
            <Card key={announcement.id} sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar src={getAvatar(index + 1)} />
                    <Box>
                      <Typography variant="h6">{announcement.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        By {announcement.author} • {announcement.date}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      label={announcement.category} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={announcement.priority} 
                      size="small" 
                      color={getPriorityColor(announcement.priority)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Stack>
                </Stack>

                <Divider />

                <Typography variant="body1" color="text.secondary">
                  {announcement.content}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <IconButton size="small">
                    <Iconify icon="eva:eye-fill" />
                  </IconButton>
                  <IconButton size="small">
                    <Iconify icon="eva:edit-fill" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Container>
    </>
  );
}

