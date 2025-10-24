import axios from '../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const branchService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/branches`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },

  getAllBranches: async () => {
    try {
      const response = await axios.get(`${API_URL}/branches`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },

  getBranchById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch:', error);
      throw error;
    }
  },

  createBranch: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/branches`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  },

  updateBranch: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/branches/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  },

  deleteBranch: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  },
};

export default branchService;

