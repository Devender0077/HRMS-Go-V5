import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const payrollService = {
  getAllPayrolls: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/payroll`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      throw error;
    }
  },

  getPayrollById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/payroll/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payroll:', error);
      throw error;
    }
  },

  processPayroll: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/payroll/process`, data);
      return response.data;
    } catch (error) {
      console.error('Error processing payroll:', error);
      throw error;
    }
  },

  generatePayslip: async (employeeId, month, year) => {
    try {
      const response = await axios.post(`${API_URL}/payroll/payslip`, { employeeId, month, year });
      return response.data;
    } catch (error) {
      console.error('Error generating payslip:', error);
      throw error;
    }
  },

  getSalaryComponents: async () => {
    try {
      const response = await axios.get(`${API_URL}/payroll/components`);
      return response.data;
    } catch (error) {
      console.error('Error fetching salary components:', error);
      throw error;
    }
  },

  getPayslips: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/payroll`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payslips:', error);
      throw error;
    }
  },
};

export default payrollService;

