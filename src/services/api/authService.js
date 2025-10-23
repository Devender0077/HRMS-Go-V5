import axios from 'axios';
import { API_URL } from '../../config-global';

// API Client
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('redux-auth')
      ? JSON.parse(localStorage.getItem('redux-auth')).token
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('redux-auth')
          ? JSON.parse(localStorage.getItem('redux-auth')).refreshToken
          : null;

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data;

          // Update stored auth data
          const authData = JSON.parse(localStorage.getItem('redux-auth'));
          authData.token = token;
          authData.refreshToken = newRefreshToken;
          localStorage.setItem('redux-auth', JSON.stringify(authData));

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('redux-auth');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Authentication Service
class AuthService {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Login response
   */
  async login(email, password) {
    try {
      // Mock login for demo (remove when backend is ready)
      if (email === 'admin@hrms.com' && password === 'admin123') {
        const mockUser = {
          id: 1,
          email: 'admin@hrms.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          avatar: '/assets/images/avatars/avatar_default.jpg',
        };

        const mockToken = 'mock-jwt-token-' + Date.now();

        return {
          success: true,
          data: {
            user: mockUser,
            token: mockToken,
            refreshToken: 'mock-refresh-token-' + Date.now(),
          },
        };
      }

      // Try actual API call
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      // If API fails, check for mock credentials
      if (email === 'admin@hrms.com' && password === 'admin123') {
        const mockUser = {
          id: 1,
          email: 'admin@hrms.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          avatar: '/assets/images/avatars/avatar_default.jpg',
        };

        const mockToken = 'mock-jwt-token-' + Date.now();

        return {
          success: true,
          data: {
            user: mockUser,
            token: mockToken,
            refreshToken: 'mock-refresh-token-' + Date.now(),
          },
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Invalid credentials.',
        error,
      };
    }
  }

  /**
   * Login with face recognition
   * @param {string} faceDescriptor - Face descriptor array
   * @param {string} userId - User ID (optional)
   * @returns {Promise} Login response
   */
  async loginWithFace(faceDescriptor, userId = null) {
    try {
      const response = await apiClient.post('/auth/login/face', {
        faceDescriptor,
        userId,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Face login failed',
        error,
      };
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration response
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        error,
      };
    }
  }

  /**
   * Register face for user
   * @param {string} userId - User ID
   * @param {Array} faceDescriptor - Face descriptor
   * @returns {Promise} Registration response
   */
  async registerFace(userId, faceDescriptor) {
    try {
      const response = await apiClient.post('/auth/register/face', {
        userId,
        faceDescriptor,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Face registration failed',
        error,
      };
    }
  }

  /**
   * Logout user
   * @returns {Promise} Logout response
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('redux-auth');

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
        error,
      };
    }
  }

  /**
   * Forgot password
   * @param {string} email - User email
   * @returns {Promise} Response
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset link',
        error,
      };
    }
  }

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise} Response
   */
  async resetPassword(token, password) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password',
        error,
      };
    }
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Response
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password',
        error,
      };
    }
  }

  /**
   * Verify email
   * @param {string} token - Verification token
   * @returns {Promise} Response
   */
  async verifyEmail(token) {
    try {
      const response = await apiClient.post('/auth/verify-email', {
        token,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed',
        error,
      };
    }
  }

  /**
   * Refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} Response
   */
  async refreshToken(refreshToken) {
    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Token refresh failed',
        error,
      };
    }
  }

  /**
   * Get current user
   * @returns {Promise} User data
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user data',
        error,
      };
    }
  }

  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise} Response
   */
  async updateProfile(userData) {
    try {
      const response = await apiClient.put('/auth/profile', userData);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
        error,
      };
    }
  }
}

export default new AuthService();
export { apiClient };

