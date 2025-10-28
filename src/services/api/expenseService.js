import { apiClient } from './authService';

class ExpenseService {
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/expenses', { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch expenses',
        error,
      };
    }
  }

  async getById(id) {
    try {
      const response = await apiClient.get(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch expense',
        error,
      };
    }
  }

  async create(data) {
    try {
      const response = await apiClient.post('/expenses', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create expense',
        error,
      };
    }
  }

  async update(id, data) {
    try {
      const response = await apiClient.put(`/expenses/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update expense',
        error,
      };
    }
  }

  async delete(id) {
    try {
      const response = await apiClient.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete expense',
        error,
      };
    }
  }

  async approve(id) {
    try {
      const response = await apiClient.put(`/expenses/${id}/approve`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve expense',
        error,
      };
    }
  }

  async reject(id, reason) {
    try {
      const response = await apiClient.put(`/expenses/${id}/reject`, { rejectionReason: reason });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reject expense',
        error,
      };
    }
  }
}

export default new ExpenseService();

