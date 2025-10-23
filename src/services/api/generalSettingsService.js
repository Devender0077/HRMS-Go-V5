import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const generalSettingsService = {
  // Get all settings
  getAll: async () => {
    const response = await axios.get(`${API_URL}/general-settings`);
    return response.data;
  },

  // Get settings by category
  getByCategory: async (category) => {
    const response = await axios.get(`${API_URL}/general-settings/category/${category}`);
    return response.data;
  },

  // Create or update single setting
  updateSetting: async (data) => {
    const response = await axios.post(`${API_URL}/general-settings`, data);
    return response.data;
  },

  // Update multiple settings at once
  updateMultiple: async (settings) => {
    const response = await axios.post(`${API_URL}/general-settings/bulk`, { settings });
    return response.data;
  },

  // Delete setting
  deleteSetting: async (key) => {
    const response = await axios.delete(`${API_URL}/general-settings/key/${key}`);
    return response.data;
  },
  
  // Get public settings
  getPublic: async () => {
    const response = await axios.get(`${API_URL}/general-settings/public`);
    return response.data;
  },
  
  // Get setting by key
  getByKey: async (key) => {
    const response = await axios.get(`${API_URL}/general-settings/key/${key}`);
    return response.data;
  },
};

export default generalSettingsService;

