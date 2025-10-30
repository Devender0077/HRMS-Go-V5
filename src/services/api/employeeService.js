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
   * Get employees for dropdowns (no RBAC restrictions)
   * @returns {Promise} Employee list response for dropdowns
   */
  async getForDropdown() {
    try {
      console.log('📋 Calling /employees/dropdown endpoint...');
      const response = await apiClient.get('/employees/dropdown');
      console.log('📦 Dropdown endpoint response:', response.data);
      
      const employees = Array.isArray(response.data) 
        ? response.data 
        : response.data?.employees || response.data?.data || [];
      
      return {
        success: true,
        data: employees,
        totalCount: response.data?.totalCount || employees.length,
      };
    } catch (error) {
      console.error('❌ Error calling dropdown endpoint:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch employees for dropdown',
        error,
      };
    }
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

  /**
   * Grant system access to employee
   * @param {number} id - Employee ID
   * @param {string} temporaryPassword - Optional temporary password
   * @returns {Promise} Response with credentials
   */
  async grantSystemAccess(id, temporaryPassword = null) {
    try {
      console.log(`🔐 [Employee Service] Granting system access to employee ID: ${id}`);
      const response = await apiClient.post(`/employees/${id}/grant-access`, {
        temporaryPassword,
      });
      console.log('✅ [Employee Service] System access granted:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'System access granted successfully',
      };
    } catch (error) {
      console.error('❌ [Employee Service] Grant access error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to grant system access',
        error,
      };
    }
  }

  /**
   * Revoke system access from employee
   * @param {number} id - Employee ID
   * @returns {Promise} Revoke response
   */
  async revokeSystemAccess(id) {
    try {
      console.log(`⛔ [Employee Service] Revoking system access for employee ID: ${id}`);
      const response = await apiClient.post(`/employees/${id}/revoke-access`);
      console.log('✅ [Employee Service] System access revoked:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'System access revoked successfully',
      };
    } catch (error) {
      console.error('❌ [Employee Service] Revoke access error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to revoke system access',
        error,
      };
    }
  }
}

export default new EmployeeService();

