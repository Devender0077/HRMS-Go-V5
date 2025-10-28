import { apiClient } from './authService';

// Leave Service
class LeaveService {
  /**
   * Get all leave applications
   * @param {Object} params - Query parameters
   * @returns {Promise} Leave applications response
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/leaves', { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch leave applications',
        error,
      };
    }
  }

  /**
   * Get all leave types
   * @returns {Promise} Leave types response
   */
  async getLeaveTypes() {
    try {
      const response = await apiClient.get('/leaves/types');
      // Return the API response directly (it has {success: true, types: [...]})
      return response.data;
    } catch (error) {
      console.error('Error fetching leave types:', error);
      return {
        success: false,
        types: [],
        message: error.response?.data?.message || 'Failed to fetch leave types',
        error,
      };
    }
  }

  /**
   * Create new leave type (organization-wide)
   * @param {Object} data - Leave type data
   * @returns {Promise} Create response
   */
  async createLeaveType(data) {
    try {
      console.log('➕ [Leave Service] Creating leave type:', data);
      const response = await apiClient.post('/leaves/types', data);
      console.log('✅ [Leave Service] Create successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Leave Service] Create error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create leave type',
        error,
      };
    }
  }

  /**
   * Update leave type (organization-wide default)
   * @param {number} id - Leave type ID
   * @param {Object} data - Update data
   * @returns {Promise} Update response
   */
  async updateLeaveType(id, data) {
    try {
      console.log('🔄 [Leave Service] Updating leave type:', id, data);
      const response = await apiClient.put(`/leaves/types/${id}`, data);
      console.log('✅ [Leave Service] Update successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Leave Service] Update error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update leave type',
        error,
      };
    }
  }

  /**
   * Get leave application by ID
   * @param {number} id - Leave application ID
   * @returns {Promise} Leave application response
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/leaves/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch leave application',
        error,
      };
    }
  }

  /**
   * Apply for leave
   * @param {Object} leaveData - Leave application data
   * @returns {Promise} Application response
   */
  async apply(leaveData) {
    try {
      const response = await apiClient.post('/leaves', leaveData);
      return {
        success: true,
        data: response.data,
        message: 'Leave application submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit leave application',
        error,
      };
    }
  }

  /**
   * Update leave application
   * @param {number} id - Leave application ID
   * @param {Object} leaveData - Updated leave data
   * @returns {Promise} Update response
   */
  async update(id, leaveData) {
    try {
      const response = await apiClient.put(`/leaves/${id}`, leaveData);
      return {
        success: true,
        data: response.data,
        message: 'Leave application updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update leave application',
        error,
      };
    }
  }

  /**
   * Approve leave application
   * @param {number} id - Leave application ID
   * @returns {Promise} Approval response
   */
  async approve(id) {
    try {
      const response = await apiClient.post(`/leaves/${id}/approve`);
      return {
        success: true,
        data: response.data,
        message: 'Leave application approved',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve leave',
        error,
      };
    }
  }

  /**
   * Reject leave application
   * @param {number} id - Leave application ID
   * @param {string} reason - Rejection reason
   * @returns {Promise} Rejection response
   */
  async reject(id, reason) {
    try {
      const response = await apiClient.post(`/leaves/${id}/reject`, { reason });
      return {
        success: true,
        data: response.data,
        message: 'Leave application rejected',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reject leave',
        error,
      };
    }
  }

  /**
   * Get leave balances
   * @param {number} employeeId - Employee ID (optional)
   * @returns {Promise} Leave balances response
   */
  async getBalances(employeeId = null) {
    try {
      const url = employeeId ? `/leaves/balances/${employeeId}` : '/leaves/balances';
      const response = await apiClient.get(url);
      // Backend returns {success: true, balances: [...], year: 2025}
      // Return it directly
      return response.data;
    } catch (error) {
      return {
        success: false,
        balances: [],
        message: error.response?.data?.message || 'Failed to fetch leave balances',
        error,
      };
    }
  }

  /**
   * Cancel leave application
   * @param {number} id - Leave application ID
   * @returns {Promise} Cancel response
   */
  async cancel(id) {
    try {
      const response = await apiClient.post(`/leaves/${id}/cancel`);
      return {
        success: true,
        data: response.data,
        message: 'Leave application cancelled',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel leave',
        error,
      };
    }
  }

}

export default new LeaveService();

