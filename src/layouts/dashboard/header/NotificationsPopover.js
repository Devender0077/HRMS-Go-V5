import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useState, useEffect, useCallback } from 'react';
// @mui
import {
  Box,
  Stack,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// services
import notificationService from '../../../services/notificationService';
// hooks
import usePusherNotifications from '../../../hooks/usePusherNotifications';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [openPopover, setOpenPopover] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [totalUnRead, setTotalUnRead] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle real-time notifications from Pusher
  const handlePusherNotification = useCallback((newNotification) => {
    console.log('📬 Real-time notification:', newNotification);
    
    // Add to notifications list
    setNotifications(prev => [newNotification, ...prev]);
    setTotalUnRead(prev => prev + 1);
  }, []);

  // Subscribe to Pusher notifications
  usePusherNotifications(handlePusherNotification);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log('🔔 [NotificationsPopover] Fetching notifications...');
      
      const response = await notificationService.getAll();
      console.log('📥 [NotificationsPopover] Response:', response);
      
      if (response.success) {
        const notifs = response.data || [];
        const unread = response.unreadCount || 0;
        
        console.log(`✅ [NotificationsPopover] Loaded ${notifs.length} notifications (${unread} unread)`);
        setNotifications(notifs);
        setTotalUnRead(unread);
      } else {
        console.log('⚠️ [NotificationsPopover] No success response');
        setNotifications([]);
        setTotalUnRead(0);
      }
    } catch (error) {
      console.error('❌ [NotificationsPopover] Error loading:', error);
      setNotifications([]);
      setTotalUnRead(0);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
      setTotalUnRead(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      setTotalUnRead(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifications.slice(0, 2).map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string,
    avatar: PropTypes.node,
    type: PropTypes.string,
    title: PropTypes.string,
    isUnRead: PropTypes.bool,
    description: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
  }),
};

NotificationItem.propTypes = {
  notification: PropTypes.object,
  onMarkAsRead: PropTypes.func,
};

function NotificationItem({ notification, onMarkAsRead }) {
  const { avatar, title } = renderContent(notification);

  const handleClick = () => {
    if (!notification.isRead && !notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  const isUnread = notification.isRead === false || notification.is_read === false;

  return (
    <ListItemButton
      onClick={handleClick}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(isUnread && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">
              {fToNow(notification.createdAt || notification.created_at)}
            </Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description || '')}
      </Typography>
    </Typography>
  );

  // Map notification types to icons
  const iconMap = {
    leave_request: '/assets/icons/notification/ic_mail.svg',
    leave_approved: '/assets/icons/notification/ic_chat.svg',
    leave_rejected: '/assets/icons/notification/ic_mail.svg',
    attendance_alert: '/assets/icons/notification/ic_package.svg',
    payroll_generated: '/assets/icons/notification/ic_shipping.svg',
    document_uploaded: '/assets/icons/notification/ic_mail.svg',
    system_announcement: '/assets/icons/notification/ic_chat.svg',
    task_assigned: '/assets/icons/notification/ic_package.svg',
    performance_review: '/assets/icons/notification/ic_mail.svg',
    training_enrollment: '/assets/icons/notification/ic_chat.svg',
  };

  const iconSrc = notification.avatar || iconMap[notification.type] || '/assets/icons/notification/ic_mail.svg';

  return {
    avatar: <img alt={notification.title} src={iconSrc} />,
    title,
  };
}
