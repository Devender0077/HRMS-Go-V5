import axios from '../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const designationService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/designations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching designations:', error);
      throw error;
    }
  },

  getAllDesignations: async () => {
    try {
      const response = await axios.get(`${API_URL}/designations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching designations:', error);
      throw error;
    }
  },

  getDesignationById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/designations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching designation:', error);
      throw error;
    }
  },

  createDesignation: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/designations`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating designation:', error);
      throw error;
    }
  },

  updateDesignation: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/designations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating designation:', error);
      throw error;
    }
  },

  deleteDesignation: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/designations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting designation:', error);
      throw error;
    }
  },
};

export default designationService;

