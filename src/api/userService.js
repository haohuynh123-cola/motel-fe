import apiClient from './axios';

export default {
  async getUsers() {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch danh sách người dùng:', error);
      throw error;
    }
  },

  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }
};
