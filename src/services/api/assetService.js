import { apiClient } from './authService';

// Asset endpoints
const assetService = {
  // Get all assets
  getAll: async (params = {}) => {
    try {
      console.log('📊 Fetching all assets...');
      const response = await apiClient.get('/assets', { params });
      console.log('📦 Backend response:', response.data);
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error fetching assets:', error);
      throw error;
    }
  },

  // Get asset by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/assets/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`❌ Error fetching asset ${id}:`, error);
      throw error;
    }
  },

  // Create asset
  create: async (data) => {
    try {
      console.log('➕ Creating asset:', data);
      const response = await apiClient.post('/assets', data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating asset:', error);
      throw error;
    }
  },

  // Update asset
  update: async (id, data) => {
    try {
      console.log(`✏️ Updating asset ${id}:`, data);
      const response = await apiClient.put(`/assets/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating asset ${id}:`, error);
      throw error;
    }
  },

  // Delete asset
  delete: async (id) => {
    try {
      console.log(`🗑️ Deleting asset ${id}`);
      const response = await apiClient.delete(`/assets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting asset ${id}:`, error);
      throw error;
    }
  },

  // Get asset statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get('/assets/statistics');
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      throw error;
    }
  },
};

export default assetService;
