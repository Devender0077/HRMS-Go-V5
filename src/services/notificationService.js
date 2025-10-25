import axios from '../utils/axios';

const notificationService = {
  // Get all notifications
  getAll: async (unreadOnly = false) => {
    try {
      const response = await axios.get('/notifications', {
        params: { unreadOnly },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const response = await axios.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await axios.patch('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  },

  // Delete notification
  delete: async (id) => {
    try {
      const response = await axios.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Create notification (for testing)
  create: async (notificationData) => {
    try {
      const response = await axios.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },
};

export default notificationService;

