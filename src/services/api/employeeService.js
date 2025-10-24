import { apiClient } from './authService';

// Employee Service
class EmployeeService {
  /**
   * Get all employees
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise} Employee list response
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/employees', { params });
      // Handle both formats: array or {employees: [], ...}
      const employees = Array.isArray(response.data) 
        ? response.data 
        : response.data?.employees || response.data?.data || [];
      
      return {
        success: true,
        data: employees,
        totalCount: response.data?.totalCount || employees.length,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch employees',
        error,
      };
    }
  }

  /**
   * Get all employees (alias for backwards compatibility)
   * @param {Object} params - Query parameters
   * @returns {Promise} Employee list response
   */
  async getAllEmployees(params = {}) {
    return this.getAll(params);
  }

  /**
   * Get employee by ID
   * @param {number} id - Employee ID
   * @returns {Promise} Employee response
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/employees/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch employee',
        error,
      };
    }
  }

  /**
   * Create new employee
   * @param {Object} employeeData - Employee data
   * @returns {Promise} Create response
   */
  async create(employeeData) {
    try {
      const response = await apiClient.post('/employees', employeeData);
      return {
        success: true,
        data: response.data,
        message: 'Employee created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create employee',
        error,
      };
    }
  }

  /**
   * Update employee
   * @param {number} id - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @returns {Promise} Update response
   */
  async update(id, employeeData) {
    try {
      const response = await apiClient.put(`/employees/${id}`, employeeData);
      return {
        success: true,
        data: response.data,
        message: 'Employee updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update employee',
        error,
      };
    }
  }

  /**
   * Delete employee
   * @param {number} id - Employee ID
   * @returns {Promise} Delete response
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/employees/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Employee deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete employee',
        error,
      };
    }
  }

  /**
   * Get employee statistics
   * @returns {Promise} Statistics response
   */
  async getStatistics() {
    try {
      const response = await apiClient.get('/employees/statistics');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch statistics',
        error,
      };
    }
  }
}

export default new EmployeeService();

