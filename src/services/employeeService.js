import axios from '../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const employeeService = {
  // Get all employees
  getAllEmployees: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/employees`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  // Create employee
  createEmployee: async (employeeData) => {
    try {
      const response = await axios.post(`${API_URL}/employees`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await axios.put(`${API_URL}/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/employees/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      throw error;
    }
  },
};

export default employeeService;

