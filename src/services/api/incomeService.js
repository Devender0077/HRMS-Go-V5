import { apiClient } from './authService';

class IncomeService {
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/income', { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch income',
        error,
      };
    }
  }

  async getById(id) {
    try {
      const response = await apiClient.get(`/income/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch income',
        error,
      };
    }
  }

  async create(data) {
    try {
      const response = await apiClient.post('/income', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create income',
        error,
      };
    }
  }

  async update(id, data) {
    try {
      const response = await apiClient.put(`/income/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update income',
        error,
      };
    }
  }

  async delete(id) {
    try {
      const response = await apiClient.delete(`/income/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete income',
        error,
      };
    }
  }
}

export default new IncomeService();

