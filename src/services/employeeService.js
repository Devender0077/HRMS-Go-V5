import axios from '../utils/axios';

const employeeService = {
  // Get all employees
  getAllEmployees: async (params = {}) => {
    try {
      const response = await axios.get('/employees', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return { success: false, employees: [], data: [], message: error.message };
    }
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    try {
      const response = await axios.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      return { success: false, data: null, message: error.message };
    }
  },

  // Create employee
  createEmployee: async (employeeData) => {
    try {
      const response = await axios.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      return { success: false, message: error.message };
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await axios.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      return { success: false, message: error.message };
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      const response = await axios.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return { success: false, message: error.message };
    }
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    try {
      const response = await axios.get('/employees/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      return { success: false, data: {}, message: error.message };
    }
  },
};

export default employeeService;

