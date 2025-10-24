import axios from '../utils/axios';
import { API_URL } from '../config-global';

// API Client
const apiClient = axios.create({
  baseURL: `${API_URL}/performance`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Performance Service
class PerformanceService {
  /**
   * Get all performance reviews
   * @returns {Promise} Performance reviews list
   */
  async getPerformanceReviews() {
    try {
      const response = await apiClient.get('/reviews');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch performance reviews',
        error,
      };
    }
  }

  /**
   * Get performance review by ID
   * @param {string} id - Review ID
   * @returns {Promise} Review details
   */
  async getPerformanceReview(id) {
    try {
      const response = await apiClient.get(`/reviews/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching performance review:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch performance review',
        error,
      };
    }
  }

  /**
   * Create performance review
   * @param {Object} review - Review data
   * @returns {Promise} Create response
   */
  async createPerformanceReview(review) {
    try {
      const response = await apiClient.post('/reviews', review);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating performance review:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create performance review',
        error,
      };
    }
  }

  /**
   * Update performance review
   * @param {string} id - Review ID
   * @param {Object} review - Updated review data
   * @returns {Promise} Update response
   */
  async updatePerformanceReview(id, review) {
    try {
      const response = await apiClient.put(`/reviews/${id}`, review);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating performance review:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update performance review',
        error,
      };
    }
  }

  /**
   * Delete performance review
   * @param {string} id - Review ID
   * @returns {Promise} Delete response
   */
  async deletePerformanceReview(id) {
    try {
      const response = await apiClient.delete(`/reviews/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting performance review:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete performance review',
        error,
      };
    }
  }

  /**
   * Get all performance goals
   * @returns {Promise} Goals list
   */
  async getPerformanceGoals() {
    try {
      const response = await apiClient.get('/goals');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching performance goals:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch performance goals',
        error,
      };
    }
  }

  /**
   * Get performance goal by ID
   * @param {string} id - Goal ID
   * @returns {Promise} Goal details
   */
  async getPerformanceGoal(id) {
    try {
      const response = await apiClient.get(`/goals/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching performance goal:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch performance goal',
        error,
      };
    }
  }

  /**
   * Create performance goal
   * @param {Object} goal - Goal data
   * @returns {Promise} Create response
   */
  async createPerformanceGoal(goal) {
    try {
      const response = await apiClient.post('/goals', goal);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating performance goal:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create performance goal',
        error,
      };
    }
  }

  /**
   * Update performance goal
   * @param {string} id - Goal ID
   * @param {Object} goal - Updated goal data
   * @returns {Promise} Update response
   */
  async updatePerformanceGoal(id, goal) {
    try {
      const response = await apiClient.put(`/goals/${id}`, goal);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating performance goal:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update performance goal',
        error,
      };
    }
  }

  /**
   * Delete performance goal
   * @param {string} id - Goal ID
   * @returns {Promise} Delete response
   */
  async deletePerformanceGoal(id) {
    try {
      const response = await apiClient.delete(`/goals/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting performance goal:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete performance goal',
        error,
      };
    }
  }

  /**
   * Get performance feedback
   * @returns {Promise} Feedback list
   */
  async getPerformanceFeedback() {
    try {
      const response = await apiClient.get('/feedback');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching performance feedback:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch performance feedback',
        error,
      };
    }
  }

  /**
   * Create performance feedback
   * @param {Object} feedback - Feedback data
   * @returns {Promise} Create response
   */
  async createPerformanceFeedback(feedback) {
    try {
      const response = await apiClient.post('/feedback', feedback);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating performance feedback:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create performance feedback',
        error,
      };
    }
  }

  /**
   * Get performance reports
   * @returns {Promise} Reports data
   */
  async getPerformanceReports() {
    try {
      const response = await apiClient.get('/reports');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching performance reports:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch performance reports',
        error,
      };
    }
  }

  /**
   * Get performance dashboard data
   * @returns {Promise} Dashboard data
   */
  async getPerformanceDashboard() {
    try {
      const response = await apiClient.get('/dashboard');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching performance dashboard:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch performance dashboard',
        error,
      };
    }
  }

  /**
   * Get performance statistics
   * @returns {Promise} Statistics data
   */
  async getPerformanceStats() {
    try {
      const response = await apiClient.get('/stats');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching performance stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch performance stats',
        error,
      };
    }
  }

  /**
   * Get goals (alias for getPerformanceGoals)
   * @returns {Promise} Goals list
   */
  async getGoals() {
    return this.getPerformanceGoals();
  }

  /**
   * Get reviews (alias for getPerformanceReviews)
   * @returns {Promise} Reviews list
   */
  async getReviews() {
    return this.getPerformanceReviews();
  }

  /**
   * Get feedback (alias for getPerformanceFeedback)
   * @returns {Promise} Feedback list
   */
  async getFeedback() {
    return this.getPerformanceFeedback();
  }
}

export default new PerformanceService();