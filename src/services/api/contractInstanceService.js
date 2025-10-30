import { apiClient } from './authService';

/**
 * Contract Instance Service
 * Manages actual contracts sent to employees/vendors
 */
class ContractInstanceService {
  /**
   * Get all contract instances
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/contract-instances', { params });
      return {
        success: true,
        data: response.data?.data || [],
        totalCount: response.data?.totalCount || 0,
        currentPage: response.data?.currentPage || 1,
        totalPages: response.data?.totalPages || 1,
      };
    } catch (error) {
      console.error('❌ Get instances error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contracts',
        error,
      };
    }
  }

  /**
   * Get instance by ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/contract-instances/${id}`);
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error) {
      console.error('❌ Get instance error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contract',
        error,
      };
    }
  }

  /**
   * Create contract instance
   */
  async create(data) {
    try {
      const response = await apiClient.post('/contract-instances', data);
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Contract created successfully',
      };
    } catch (error) {
      console.error('❌ Create instance error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create contract',
        error,
      };
    }
  }

  /**
   * Send contract
   */
  async send(id) {
    try {
      const response = await apiClient.post(`/contract-instances/${id}/send`);
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Contract sent successfully',
      };
    } catch (error) {
      console.error('❌ Send contract error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send contract',
        error,
      };
    }
  }

  /**
   * Mark as viewed
   */
  async markViewed(id) {
    try {
      const response = await apiClient.post(`/contract-instances/${id}/viewed`);
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error) {
      console.error('❌ Mark viewed error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark as viewed',
        error,
      };
    }
  }

  /**
   * Complete contract (after signing)
   */
  async complete(id, signedFilePath) {
    try {
      const response = await apiClient.post(`/contract-instances/${id}/complete`, {
        signedFilePath,
      });
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Contract completed successfully',
      };
    } catch (error) {
      console.error('❌ Complete contract error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to complete contract',
        error,
      };
    }
  }

  /**
   * Decline contract
   */
  async decline(id, reason) {
    try {
      const response = await apiClient.post(`/contract-instances/${id}/decline`, {
        reason,
      });
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Contract declined',
      };
    } catch (error) {
      console.error('❌ Decline contract error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to decline contract',
        error,
      };
    }
  }

  /**
   * Cancel contract
   */
  async cancel(id) {
    try {
      const response = await apiClient.post(`/contract-instances/${id}/cancel`);
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Contract cancelled successfully',
      };
    } catch (error) {
      console.error('❌ Cancel contract error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel contract',
        error,
      };
    }
  }

  /**
   * Get audit trail
   */
  async getAuditTrail(id) {
    try {
      const response = await apiClient.get(`/contract-instances/${id}/audit-trail`);
      return {
        success: true,
        data: response.data?.data || [],
        totalCount: response.data?.totalCount || 0,
      };
    } catch (error) {
      console.error('❌ Get audit trail error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch audit trail',
        error,
      };
    }
  }

  /**
   * Get dashboard stats
   */
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/contract-instances/stats/dashboard');
      return {
        success: true,
        data: response.data?.data || {},
      };
    } catch (error) {
      console.error('❌ Get dashboard stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stats',
        error,
      };
    }
  }
}

export default new ContractInstanceService();

