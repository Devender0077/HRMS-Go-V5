import { apiClient } from './authService';

class ContractService {
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/contracts', { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contracts',
        error,
      };
    }
  }

  async getById(id) {
    try {
      const response = await apiClient.get(`/contracts/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contract',
        error,
      };
    }
  }

  async create(data) {
    try {
      const response = await apiClient.post('/contracts', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create contract',
        error,
      };
    }
  }

  async update(id, data) {
    try {
      const response = await apiClient.put(`/contracts/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contract',
        error,
      };
    }
  }

  async delete(id) {
    try {
      const response = await apiClient.delete(`/contracts/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete contract',
        error,
      };
    }
  }

  async download(id) {
    try {
      const response = await apiClient.get(`/contracts/${id}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }
}

export default new ContractService();

