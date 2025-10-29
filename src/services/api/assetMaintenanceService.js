import { apiClient } from './authService';

const assetMaintenanceService = {
  // Get all maintenance records
  getAll: async () => {
    try {
      console.log('📊 Fetching asset maintenance records...');
      const response = await apiClient.get('/asset-maintenance');
      console.log('📦 Maintenance backend response:', response.data);
      
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
      console.error('❌ Error fetching asset maintenance records:', error);
      throw error;
    }
  },

  // Get single maintenance record
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/asset-maintenance/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching maintenance ${id}:`, error);
      throw error;
    }
  },

  // Create maintenance record
  create: async (data) => {
    try {
      const response = await apiClient.post('/asset-maintenance', data);
      return response.data;
    } catch (error) {
      console.error('Error creating maintenance:', error);
      throw error;
    }
  },

  // Update maintenance record
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/asset-maintenance/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating maintenance ${id}:`, error);
      throw error;
    }
  },

  // Delete maintenance record
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/asset-maintenance/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting maintenance ${id}:`, error);
      throw error;
    }
  },

  // Complete maintenance
  complete: async (id) => {
    try {
      const response = await apiClient.post(`/asset-maintenance/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error completing maintenance ${id}:`, error);
      throw error;
    }
  },
};

export default assetMaintenanceService;

