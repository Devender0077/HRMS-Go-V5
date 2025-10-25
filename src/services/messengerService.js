import axios from '../utils/axios';
import { API_URL } from '../config-global';

// API Client
const apiClient = axios.create({
  baseURL: `${API_URL}/messenger`,
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

// Messenger Service
class MessengerService {
  /**
   * Get all conversations
   * @returns {Promise} Conversations list
   */
  async getConversations() {
    try {
      const response = await apiClient.get('/conversations');
      // Backend returns {success: true, data: [...]}
      return {
        success: true,
        data: response.data?.data || response.data || [],
      };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch conversations',
        error,
      };
    }
  }

  /**
   * Get messages for a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} Messages list
   */
  async getMessages(conversationId) {
    try {
      const response = await apiClient.get(`/conversations/${conversationId}/messages`);
      // Backend returns {success: true, data: [...]}
      return {
        success: true,
        data: response.data?.data || response.data || [],
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch messages',
        error,
      };
    }
  }

  /**
   * Send a message
   * @param {string} conversationId - Conversation ID
   * @param {string} message - Message content
   * @param {string} type - Message type (text, image, file)
   * @returns {Promise} Send response
   */
  async sendMessage(conversationId, message, type = 'text') {
    try {
      const response = await apiClient.post(`/conversations/${conversationId}/messages`, {
        content: message,
        type,
      });
      // Backend returns {success: true, data: {...}}
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message',
        error,
      };
    }
  }

  /**
   * Create a new conversation
   * @param {string} participantId - Participant user ID (for direct chats)
   * @param {string} type - Conversation type ('direct' or 'group')
   * @param {object} groupData - Group data (name, participants) for group chats
   * @returns {Promise} Create response
   */
  async createConversation(participantId, type = 'direct', groupData = null) {
    try {
      const payload = type === 'group' && groupData
        ? {
            type: 'group',
            name: groupData.name,
            participants: groupData.participants,
          }
        : {
            participantId,
            type: 'direct',
          };

      const response = await apiClient.post('/conversations', payload);
      // Backend returns {success: true, data: {...}}
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error) {
      console.error('Error creating conversation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create conversation',
        error,
      };
    }
  }

  /**
   * Mark messages as read
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} Mark read response
   */
  async markAsRead(conversationId) {
    try {
      const response = await apiClient.put(`/conversations/${conversationId}/read`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark messages as read',
        error,
      };
    }
  }

  /**
   * Search conversations
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  async searchConversations(query) {
    try {
      const response = await apiClient.get(`/conversations/search?q=${encodeURIComponent(query)}`);
      // Backend returns {success: true, data: [...]}
      return {
        success: true,
        data: response.data?.data || response.data || [],
      };
    } catch (error) {
      console.error('Error searching conversations:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search conversations',
        error,
      };
    }
  }

  /**
   * Get online users
   * @returns {Promise} Online users list
   */
  async getOnlineUsers() {
    try {
      const response = await apiClient.get('/users/online');
      // Backend returns {success: true, data: [...]}
      // We need to extract the data array
      return {
        success: true,
        data: response.data?.data || response.data || [],
      };
    } catch (error) {
      console.error('Error fetching online users:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch online users',
        error,
      };
    }
  }
}

export default new MessengerService();
