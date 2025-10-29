import { apiClient } from './authService';

const assetAssignmentService = {
  // Get all assignments
  getAll: async () => {
    try {
      const response = await apiClient.get('/asset-assignments');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching asset assignments:', error);
      throw error;
    }
  },

  // Get single assignment
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/asset-assignments/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error);
      throw error;
    }
  },

  // Create assignment
  create: async (data) => {
    try {
      const response = await apiClient.post('/asset-assignments', data);
      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  // Update assignment
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/asset-assignments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating assignment ${id}:`, error);
      throw error;
    }
  },

  // Delete assignment
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/asset-assignments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting assignment ${id}:`, error);
      throw error;
    }
  },

  // Return asset
  returnAsset: async (id) => {
    try {
      const response = await apiClient.post(`/asset-assignments/${id}/return`);
      return response.data;
    } catch (error) {
      console.error(`Error returning asset ${id}:`, error);
      throw error;
    }
  },
};

export default assetAssignmentService;

