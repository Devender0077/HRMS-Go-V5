import axios from '../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const assetService = {
  getAllAssets: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/assets`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  getAssetById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/assets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw error;
    }
  },

  createAsset: async (assetData) => {
    try {
      const response = await axios.post(`${API_URL}/assets`, assetData);
      return response.data;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  updateAsset: async (id, assetData) => {
    try {
      const response = await axios.put(`${API_URL}/assets/${id}`, assetData);
      return response.data;
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  },

  deleteAsset: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/assets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  },
};

export default assetService;

