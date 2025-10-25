import { useEffect } from 'react';
import { usePusher } from '../contexts/PusherContext';
import { useAuthContext } from '../auth/useAuthContext';
import { useSnackbar } from 'notistack';

/**
 * Hook to subscribe to real-time notifications via Pusher
 * @param {Function} onNotification - Callback when notification received
 */
export default function usePusherNotifications(onNotification) {
  const { pusher, subscribe, unsubscribe } = usePusher();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!pusher || !user) return;

    const userId = user.id;
    const channelName = `private-user-${userId}`;

    // Subscribe to user's private notification channel
    const channel = subscribe(channelName, 'notification', (data) => {
      console.log('🔔 Real-time notification received:', data);
      
      // Show toast notification
      enqueueSnackbar(data.title, {
        variant: getNotificationVariant(data.type),
        autoHideDuration: 5000,
      });

      // Call custom callback if provided
      if (onNotification) {
        onNotification(data);
      }
    });

    // Subscribe to global announcements
    subscribe('announcement-channel', 'new-announcement', (data) => {
      console.log('📢 Announcement received:', data);
      
      enqueueSnackbar(`📢 ${data.title}`, {
        variant: 'info',
        autoHideDuration: 8000,
      });

      if (onNotification) {
        onNotification(data);
      }
    });

    // Cleanup on unmount
    return () => {
      if (channel) {
        unsubscribe(channelName);
        unsubscribe('announcement-channel');
      }
    };
  }, [pusher, user, subscribe, unsubscribe, onNotification, enqueueSnackbar]);
}

// Helper to map notification types to snackbar variants
function getNotificationVariant(type) {
  const variantMap = {
    leave_approved: 'success',
    leave_rejected: 'error',
    attendance_alert: 'warning',
    payroll_generated: 'success',
    document_uploaded: 'info',
    system_announcement: 'info',
    task_assigned: 'info',
    performance_review: 'warning',
    training_enrollment: 'success',
    leave_request: 'info',
  };

  return variantMap[type] || 'default';
}

