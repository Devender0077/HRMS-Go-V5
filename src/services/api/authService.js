import axios from '../../utils/axios';
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
    // Try to get token from accessToken (primary) or redux-auth (fallback)
    let token = localStorage.getItem('accessToken');
    
    if (!token && localStorage.getItem('redux-auth')) {
      try {
        token = JSON.parse(localStorage.getItem('redux-auth')).token;
      } catch (e) {
        console.error('Failed to parse redux-auth:', e);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 [API Client] Token attached to request:', config.method?.toUpperCase(), config.url);
    } else {
      console.warn('⚠️ [API Client] No token found in localStorage');
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
        // Try to get refresh token from localStorage
        let refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken && localStorage.getItem('redux-auth')) {
          try {
            refreshToken = JSON.parse(localStorage.getItem('redux-auth')).refreshToken;
          } catch (e) {
            console.error('Failed to parse redux-auth for refresh token:', e);
          }
        }

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data;

          // Update stored auth data (both formats for compatibility)
          localStorage.setItem('accessToken', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Also update redux-auth if it exists
          if (localStorage.getItem('redux-auth')) {
            const authData = JSON.parse(localStorage.getItem('redux-auth'));
            authData.token = token;
            authData.refreshToken = newRefreshToken;
            localStorage.setItem('redux-auth', JSON.stringify(authData));
          }

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        console.error('❌ [API Client] Token refresh failed, redirecting to login');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('redux-auth');
        localStorage.removeItem('user');
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
      console.log('🔐 [Auth Service] Logging in:', email);
      
      // Call actual API (NO MOCK!)
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      console.log('✅ [Auth Service] Login successful:', response.data);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Auth Service] Login failed:', error.response?.data || error.message);
      
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
      
      // Clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('redux-auth');
      localStorage.removeItem('user');

      return {
        success: true,
      };
    } catch (error) {
      // Clear local data even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('redux-auth');
      localStorage.removeItem('user');
      
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

