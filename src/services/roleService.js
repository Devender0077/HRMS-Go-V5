import axios from '../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const roleService = {
  // Get all roles
  getAllRoles: async () => {
    try {
      const response = await axios.get(`${API_URL}/roles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Get role by ID
  getRoleById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  },

  // Create role
  createRole: async (roleData) => {
    try {
      const response = await axios.post(`${API_URL}/roles`, roleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  // Update role
  updateRole: async (id, roleData) => {
    try {
      const response = await axios.put(`${API_URL}/roles/${id}`, roleData);
      return response.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  // Delete role
  deleteRole: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },

  // Toggle role status
  toggleRoleStatus: async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/roles/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling role status:', error);
      throw error;
    }
  },
};

export default roleService;

