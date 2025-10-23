import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const permissionService = {
  // Get all permissions
  getAllPermissions: async () => {
    try {
      const response = await axios.get(`${API_URL}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  },

  // Get permissions by module
  getPermissionsByModule: async () => {
    try {
      const response = await axios.get(`${API_URL}/permissions/by-module`);
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions by module:', error);
      throw error;
    }
  },

  // Get permission by ID
  getPermissionById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/permissions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching permission:', error);
      throw error;
    }
  },

  // Create permission
  createPermission: async (permissionData) => {
    try {
      const response = await axios.post(`${API_URL}/permissions`, permissionData);
      return response.data;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  },

  // Update permission
  updatePermission: async (id, permissionData) => {
    try {
      const response = await axios.put(`${API_URL}/permissions/${id}`, permissionData);
      return response.data;
    } catch (error) {
      console.error('Error updating permission:', error);
      throw error;
    }
  },

  // Delete permission
  deletePermission: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/permissions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting permission:', error);
      throw error;
    }
  },

  // Toggle permission status
  togglePermissionStatus: async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/permissions/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling permission status:', error);
      throw error;
    }
  },
};

export default permissionService;

