import axios from '../../utils/axios';

// Note: axios instance already has baseURL configured, so we only need the path
const generalSettingsService = {
  // Get all settings
  getAll: async () => {
    const response = await axios.get('/general-settings');
    return response.data;
  },

  // Get settings by category
  getByCategory: async (category) => {
    const response = await axios.get(`/general-settings/category/${category}`);
    return response.data;
  },

  // Create or update single setting
  updateSetting: async (data) => {
    const response = await axios.post('/general-settings', data);
    return response.data;
  },

  // Update multiple settings at once (LEGACY)
  updateMultiple: async (settings) => {
    const response = await axios.post('/general-settings/bulk', { settings });
    return response.data;
  },

  // Update category settings (SPECIALIZED - uses specialized tables)
  updateCategory: async (category, data) => {
    console.log('🔵 updateCategory called:', { category, data });
    const response = await axios.put(`/general-settings/category/${category}`, data);
    console.log('🔵 updateCategory response:', response.data);
    return response.data;
  },

  // Reset category settings
  resetCategory: async (category) => {
    const response = await axios.delete(`/general-settings/category/${category}/reset`);
    return response.data;
  },

  // Batch update multiple categories
  batchUpdate: async (updates) => {
    const response = await axios.post('/general-settings/batch', { updates });
    return response.data;
  },

  // Delete setting
  deleteSetting: async (key) => {
    const response = await axios.delete(`/general-settings/key/${key}`);
    return response.data;
  },
  
  // Get public settings
  getPublic: async () => {
    const response = await axios.get('/general-settings/public');
    return response.data;
  },
  
  // Get setting by key
  getByKey: async (key) => {
    const response = await axios.get(`/general-settings/key/${key}`);
    return response.data;
  },
};

export default generalSettingsService;

