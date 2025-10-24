import axios from '../utils/axios';
import { API_URL } from '../config-global';

// API Client
const apiClient = axios.create({
  baseURL: `${API_URL}/training`,
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

// Training Service
class TrainingService {
  /**
   * Get all training programs
   * @returns {Promise} Training programs list
   */
  async getTrainingPrograms() {
    try {
      const response = await apiClient.get('/programs');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching training programs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch training programs',
        error,
      };
    }
  }

  /**
   * Get training program by ID
   * @param {string} id - Program ID
   * @returns {Promise} Program details
   */
  async getTrainingProgram(id) {
    try {
      const response = await apiClient.get(`/programs/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching training program:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch training program',
        error,
      };
    }
  }

  /**
   * Create training program
   * @param {Object} program - Program data
   * @returns {Promise} Create response
   */
  async createTrainingProgram(program) {
    try {
      const response = await apiClient.post('/programs', program);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating training program:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create training program',
        error,
      };
    }
  }

  /**
   * Update training program
   * @param {string} id - Program ID
   * @param {Object} program - Updated program data
   * @returns {Promise} Update response
   */
  async updateTrainingProgram(id, program) {
    try {
      const response = await apiClient.put(`/programs/${id}`, program);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating training program:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update training program',
        error,
      };
    }
  }

  /**
   * Delete training program
   * @param {string} id - Program ID
   * @returns {Promise} Delete response
   */
  async deleteTrainingProgram(id) {
    try {
      const response = await apiClient.delete(`/programs/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting training program:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete training program',
        error,
      };
    }
  }

  /**
   * Get all training sessions
   * @returns {Promise} Training sessions list
   */
  async getTrainingSessions() {
    try {
      const response = await apiClient.get('/sessions');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch training sessions',
        error,
      };
    }
  }

  /**
   * Get training session by ID
   * @param {string} id - Session ID
   * @returns {Promise} Session details
   */
  async getTrainingSession(id) {
    try {
      const response = await apiClient.get(`/sessions/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching training session:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch training session',
        error,
      };
    }
  }

  /**
   * Create training session
   * @param {Object} session - Session data
   * @returns {Promise} Create response
   */
  async createTrainingSession(session) {
    try {
      const response = await apiClient.post('/sessions', session);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating training session:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create training session',
        error,
      };
    }
  }

  /**
   * Update training session
   * @param {string} id - Session ID
   * @param {Object} session - Updated session data
   * @returns {Promise} Update response
   */
  async updateTrainingSession(id, session) {
    try {
      const response = await apiClient.put(`/sessions/${id}`, session);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating training session:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update training session',
        error,
      };
    }
  }

  /**
   * Delete training session
   * @param {string} id - Session ID
   * @returns {Promise} Delete response
   */
  async deleteTrainingSession(id) {
    try {
      const response = await apiClient.delete(`/sessions/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting training session:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete training session',
        error,
      };
    }
  }

  /**
   * Get employee training records
   * @returns {Promise} Employee training list
   */
  async getEmployeeTraining() {
    try {
      const response = await apiClient.get('/employee-training');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching employee training:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch employee training',
        error,
      };
    }
  }

  /**
   * Enroll employee in training
   * @param {Object} enrollment - Enrollment data
   * @returns {Promise} Create response
   */
  async enrollEmployee(enrollment) {
    try {
      const response = await apiClient.post('/employee-training', enrollment);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error enrolling employee:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to enroll employee',
        error,
      };
    }
  }

  /**
   * Update training progress
   * @param {string} id - Enrollment ID
   * @param {Object} progress - Progress data
   * @returns {Promise} Update response
   */
  async updateTrainingProgress(id, progress) {
    try {
      const response = await apiClient.put(`/employee-training/${id}/progress`, progress);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating training progress:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update training progress',
        error,
      };
    }
  }

  /**
   * Get training reports
   * @returns {Promise} Reports data
   */
  async getTrainingReports() {
    try {
      const response = await apiClient.get('/reports');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching training reports:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch training reports',
        error,
      };
    }
  }

  /**
   * Get training statistics
   * @returns {Promise} Statistics data
   */
  async getTrainingStats() {
    try {
      const response = await apiClient.get('/stats');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching training stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch training stats',
        error,
      };
    }
  }

  /**
   * Get programs (alias for getTrainingPrograms)
   * @returns {Promise} Programs list
   */
  async getPrograms() {
    return this.getTrainingPrograms();
  }
}

export default new TrainingService();