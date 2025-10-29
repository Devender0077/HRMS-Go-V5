import apiClient from '../apiClient';

const holidayService = {
  // Get all holidays
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/holidays', { params });
      return response.data;
    } catch (error) {
      console.error('❌ [Holiday Service] Get all error:', error);
      throw error;
    }
  },

  // Get holiday by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/holidays/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [Holiday Service] Get by ID error:', error);
      throw error;
    }
  },

  // Create holiday
  create: async (data) => {
    try {
      const response = await apiClient.post('/holidays', data);
      return response.data;
    } catch (error) {
      console.error('❌ [Holiday Service] Create error:', error);
      throw error;
    }
  },

  // Update holiday
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/holidays/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [Holiday Service] Update error:', error);
      throw error;
    }
  },

  // Delete holiday
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/holidays/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [Holiday Service] Delete error:', error);
      throw error;
    }
  },

  // Get upcoming holidays
  getUpcoming: async (limit = 5, region = null) => {
    try {
      const params = { limit };
      if (region) params.region = region;
      const response = await apiClient.get('/holidays/upcoming', { params });
      return response.data;
    } catch (error) {
      console.error('❌ [Holiday Service] Get upcoming error:', error);
      throw error;
    }
  },

  // Bulk import holidays
  bulkImport: async (holidays) => {
    try {
      const response = await apiClient.post('/holidays/bulk-import', { holidays });
      return response.data;
    } catch (error) {
      console.error('❌ [Holiday Service] Bulk import error:', error);
      throw error;
    }
  },
};

export default holidayService;

