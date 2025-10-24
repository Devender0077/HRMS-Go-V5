import axios from '../utils/axios';
import { API_URL } from '../config-global';

// API Client
const apiClient = axios.create({
  baseURL: `${API_URL}/finance`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Finance Service
class FinanceService {
  /**
   * Get all expenses
   * @returns {Promise} Expenses list
   */
  async getExpenses() {
    try {
      const response = await apiClient.get('/expenses');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch expenses',
        error,
      };
    }
  }

  /**
   * Get expense by ID
   * @param {string} id - Expense ID
   * @returns {Promise} Expense details
   */
  async getExpense(id) {
    try {
      const response = await apiClient.get(`/expenses/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching expense:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch expense',
        error,
      };
    }
  }

  /**
   * Create expense
   * @param {Object} expense - Expense data
   * @returns {Promise} Create response
   */
  async createExpense(expense) {
    try {
      const response = await apiClient.post('/expenses', expense);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating expense:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create expense',
        error,
      };
    }
  }

  /**
   * Update expense
   * @param {string} id - Expense ID
   * @param {Object} expense - Updated expense data
   * @returns {Promise} Update response
   */
  async updateExpense(id, expense) {
    try {
      const response = await apiClient.put(`/expenses/${id}`, expense);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating expense:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update expense',
        error,
      };
    }
  }

  /**
   * Delete expense
   * @param {string} id - Expense ID
   * @returns {Promise} Delete response
   */
  async deleteExpense(id) {
    try {
      const response = await apiClient.delete(`/expenses/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting expense:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete expense',
        error,
      };
    }
  }

  /**
   * Get all income
   * @returns {Promise} Income list
   */
  async getIncome() {
    try {
      const response = await apiClient.get('/income');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching income:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch income',
        error,
      };
    }
  }

  /**
   * Get income by ID
   * @param {string} id - Income ID
   * @returns {Promise} Income details
   */
  async getIncomeRecord(id) {
    try {
      const response = await apiClient.get(`/income/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching income record:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch income record',
        error,
      };
    }
  }

  /**
   * Create income record
   * @param {Object} income - Income data
   * @returns {Promise} Create response
   */
  async createIncome(income) {
    try {
      const response = await apiClient.post('/income', income);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating income:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create income',
        error,
      };
    }
  }

  /**
   * Update income record
   * @param {string} id - Income ID
   * @param {Object} income - Updated income data
   * @returns {Promise} Update response
   */
  async updateIncome(id, income) {
    try {
      const response = await apiClient.put(`/income/${id}`, income);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating income:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update income',
        error,
      };
    }
  }

  /**
   * Delete income record
   * @param {string} id - Income ID
   * @returns {Promise} Delete response
   */
  async deleteIncome(id) {
    try {
      const response = await apiClient.delete(`/income/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting income:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete income',
        error,
      };
    }
  }

  /**
   * Get finance reports
   * @returns {Promise} Reports data
   */
  async getFinanceReports() {
    try {
      const response = await apiClient.get('/reports');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching finance reports:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch finance reports',
        error,
      };
    }
  }

  /**
   * Get expense categories
   * @returns {Promise} Categories list
   */
  async getExpenseCategories() {
    try {
      const response = await apiClient.get('/expense-categories');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching expense categories:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch expense categories',
        error,
      };
    }
  }

  /**
   * Get income categories
   * @returns {Promise} Categories list
   */
  async getIncomeCategories() {
    try {
      const response = await apiClient.get('/income-categories');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching income categories:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch income categories',
        error,
      };
    }
  }

  /**
   * Get finance statistics
   * @returns {Promise} Statistics data
   */
  async getFinanceStats() {
    try {
      const response = await apiClient.get('/stats');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching finance stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch finance stats',
        error,
      };
    }
  }

  /**
   * Get budget vs actual report
   * @returns {Promise} Budget report data
   */
  async getBudgetReport() {
    try {
      const response = await apiClient.get('/budget-report');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching budget report:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch budget report',
        error,
      };
    }
  }

  /**
   * Get profit and loss statement
   * @returns {Promise} P&L data
   */
  async getProfitLossStatement() {
    try {
      const response = await apiClient.get('/profit-loss');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching profit and loss statement:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profit and loss statement',
        error,
      };
    }
  }
}

export default new FinanceService();
