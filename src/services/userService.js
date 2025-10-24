import axios from '../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const userService = {
  getAllUsers: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/users`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  toggleUserStatus: async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  resetPassword: async (id, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/users/${id}/reset-password`, { newPassword });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  loginAsUser: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/users/${id}/login-as`);
      return response.data;
    } catch (error) {
      console.error('Error logging in as user:', error);
      throw error;
    }
  },
};

export default userService;

