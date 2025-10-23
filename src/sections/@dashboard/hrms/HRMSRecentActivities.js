import { useTranslation } from 'react-i18next';
// @mui
import {
  Card,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
// utils
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

export default function HRMSRecentActivities() {
  const { t } = useTranslation();

  const ACTIVITIES = [
    {
      id: 1,
      title: 'New employee John Doe added',
      time: new Date(Date.now() - 3600000),
      color: 'primary',
      icon: 'eva:person-add-fill',
    },
    {
      id: 2,
      title: 'Leave application approved for Jane Smith',
      time: new Date(Date.now() - 7200000),
      color: 'success',
      icon: 'eva:checkmark-circle-2-fill',
    },
    {
      id: 3,
      title: 'Attendance regularization requested',
      time: new Date(Date.now() - 10800000),
      color: 'warning',
      icon: 'eva:clock-fill',
    },
    {
      id: 4,
      title: 'New job posting created',
      time: new Date(Date.now() - 14400000),
      color: 'info',
      icon: 'eva:briefcase-fill',
    },
  ];

  return (
    <Card>
      <CardHeader title={t('dashboard.recent_activities')} />

      <List sx={{ p: 2 }}>
        {ACTIVITIES.map((activity) => (
          <ListItem
            key={activity.id}
            sx={{
              py: 2,
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  bgcolor: (theme) => theme.palette[activity.color].lighter,
                  color: (theme) => theme.palette[activity.color].main,
                }}
              >
                <Iconify icon={activity.icon} width={24} />
              </Avatar>
            </ListItemIcon>

            <ListItemText
              primary={
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {activity.title}
                </Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {fDateTime(activity.time)}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

