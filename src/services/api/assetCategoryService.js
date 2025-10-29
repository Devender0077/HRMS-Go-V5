import { apiClient } from './authService';

const assetCategoryService = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await apiClient.get('/asset-categories');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching asset categories:', error);
      throw error;
    }
  },

  // Get single category
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/asset-categories/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  // Create category
  create: async (data) => {
    try {
      const response = await apiClient.post('/asset-categories', data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update category
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/asset-categories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/asset-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};

export default assetCategoryService;

