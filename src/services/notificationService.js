import { apiClient } from './api/authService';

const notificationService = {
  // Get all notifications
  getAll: async (unreadOnly = false) => {
    try {
      console.log('🔄 [Notifications] Fetching notifications...');
      const response = await apiClient.get('/notifications', {
        params: { unreadOnly },
      });
      console.log('📥 [Notifications] Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Notifications] Error fetching:', error);
      return {
        success: false,
        data: [],
        unreadCount: 0,
      };
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      console.log('🔄 [Notifications] Marking as read:', id);
      const response = await apiClient.patch(`/notifications/${id}/read`);
      console.log('✅ [Notifications] Marked as read');
      return response.data;
    } catch (error) {
      console.error('❌ [Notifications] Error marking as read:', error);
      return { success: false };
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      console.log('🔄 [Notifications] Marking all as read...');
      const response = await apiClient.patch('/notifications/mark-all-read');
      console.log('✅ [Notifications] All marked as read');
      return response.data;
    } catch (error) {
      console.error('❌ [Notifications] Error marking all as read:', error);
      return { success: false };
    }
  },

  // Delete notification
  delete: async (id) => {
    try {
      console.log('🔄 [Notifications] Deleting:', id);
      const response = await apiClient.delete(`/notifications/${id}`);
      console.log('✅ [Notifications] Deleted');
      return response.data;
    } catch (error) {
      console.error('❌ [Notifications] Error deleting:', error);
      return { success: false };
    }
  },

  // Create notification (for testing)
  create: async (notificationData) => {
    try {
      console.log('🔄 [Notifications] Creating notification:', notificationData);
      const response = await apiClient.post('/notifications', notificationData);
      console.log('✅ [Notifications] Created');
      return response.data;
    } catch (error) {
      console.error('❌ [Notifications] Error creating:', error);
      return { success: false };
    }
  },
};

export default notificationService;

