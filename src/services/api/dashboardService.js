import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get quick actions and notifications
   */
  getQuickActions: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/quick-actions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      throw error;
    }
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/recent-activities`, { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },
};

export default dashboardService;

