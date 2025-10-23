import { apiClient } from './authService';

// Attendance Service
class AttendanceService {
  /**
   * Clock in
   * @param {Object} data - Clock in data
   * @returns {Promise} Clock in response
   */
  async clockIn(data = {}) {
    try {
      const response = await apiClient.post('/attendance/clock-in', data);
      return {
        success: true,
        data: response.data,
        message: 'Clocked in successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clock in',
        error,
      };
    }
  }

  /**
   * Clock out
   * @param {Object} data - Clock out data
   * @returns {Promise} Clock out response
   */
  async clockOut(data = {}) {
    try {
      const response = await apiClient.post('/attendance/clock-out', data);
      return {
        success: true,
        data: response.data,
        message: 'Clocked out successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clock out',
        error,
      };
    }
  }

  /**
   * Get attendance records
   * @param {Object} params - Query parameters
   * @returns {Promise} Attendance records response
   */
  async getRecords(params = {}) {
    try {
      const response = await apiClient.get('/attendance', { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch attendance records',
        error,
      };
    }
  }

  /**
   * Get today's status
   * @returns {Promise} Today's attendance status
   */
  async getTodayStatus() {
    try {
      const response = await apiClient.get('/attendance/today');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch today\'s status',
        error,
      };
    }
  }

  /**
   * Get attendance statistics
   * @returns {Promise} Statistics response
   */
  async getStatistics() {
    try {
      const response = await apiClient.get('/attendance/statistics');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch statistics',
        error,
      };
    }
  }
}

export default new AttendanceService();

