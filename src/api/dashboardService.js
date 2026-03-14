import apiClient from './axios';

export default {
  async getStats() {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch thống kê dashboard:', error);
      throw error;
    }
  }
};
