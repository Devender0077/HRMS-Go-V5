import axios from '../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const departmentService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/departments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getAllDepartments: async () => {
    try {
      const response = await axios.get(`${API_URL}/departments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getDepartmentById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department:', error);
      throw error;
    }
  },

  createDepartment: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/departments`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  },

  updateDepartment: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/departments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  },

  deleteDepartment: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  },
};

export default departmentService;

