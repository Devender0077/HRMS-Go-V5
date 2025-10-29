import { apiClient } from './api/authService';

const userService = {
  getAllUsers: async (params = {}) => {
    try {
      console.log('👥 [User Service] Fetching all users with params:', params);
      const response = await apiClient.get('/users', { params });
      console.log('✅ [User Service] Get all users response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [User Service] Error fetching users:', error);
      console.error('❌ [User Service] Error details:', error.response?.data);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      console.log('👥 [User Service] Fetching user by ID:', id);
      const response = await apiClient.get(`/users/${id}`);
      console.log('✅ [User Service] Get user by ID response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [User Service] Error fetching user:', error);
      console.error('❌ [User Service] Error details:', error.response?.data);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      console.log('➕ [User Service] Creating user with data:', { ...userData, password: '***' });
      const response = await apiClient.post('/users', userData);
      console.log('✅ [User Service] Create user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [User Service] Error creating user:', error);
      console.error('❌ [User Service] Error details:', error.response?.data);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      console.log('📝 [User Service] Updating user ID:', id, 'with data:', { ...userData, password: userData.password ? '***' : undefined });
      const response = await apiClient.put(`/users/${id}`, userData);
      console.log('✅ [User Service] Update user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [User Service] Error updating user:', error);
      console.error('❌ [User Service] Error details:', error.response?.data);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      console.log('🗑️ [User Service] Deleting user ID:', id);
      const response = await apiClient.delete(`/users/${id}`);
      console.log('✅ [User Service] Delete user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [User Service] Error deleting user:', error);
      console.error('❌ [User Service] Error details:', error.response?.data);
      throw error;
    }
  },

  toggleUserStatus: async (id) => {
    try {
      console.log('🔄 [User Service] Toggling status for user ID:', id);
      const response = await apiClient.patch(`/users/${id}/toggle-status`);
      console.log('✅ [User Service] Toggle status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [User Service] Error toggling user status:', error);
      console.error('❌ [User Service] Error details:', error.response?.data);
      throw error;
    }
  },

  resetPassword: async (id, newPassword) => {
    try {
      console.log('🔐 [User Service] Resetting password for user ID:', id);
      const response = await apiClient.post(`/users/${id}/reset-password`, { newPassword });
      console.log('✅ [User Service] Reset password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [User Service] Error resetting password:', error);
      console.error('❌ [User Service] Error details:', error.response?.data);
      throw error;
    }
  },

  loginAsUser: async (id) => {
    try {
      console.log('🔑 [User Service] Login as user ID:', id);
      const response = await apiClient.post(`/users/${id}/login-as`);
      console.log('✅ [User Service] Login as user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [User Service] Error logging in as user:', error);
      console.error('❌ [User Service] Error details:', error.response?.data);
      throw error;
    }
  },

  changeUserRole: async (id, roleId) => {
    try {
      console.log('👤 [User Service] Changing role for user ID:', id, 'to role:', roleId);
      const response = await apiClient.patch(`/users/${id}/change-role`, { role_id: roleId });
      console.log('✅ [User Service] Change role response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [User Service] Error changing user role:', error);
      console.error('❌ [User Service] Error details:', error.response?.data);
      throw error;
    }
  },
};

export default userService;

