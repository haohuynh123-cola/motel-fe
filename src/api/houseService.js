import apiClient from './axios';

export default {
  // Lấy danh sách tất cả các nhà trọ có phân trang page & limit
  async getHouses({ page = 1, limit = 10 } = {}) {
    try {
      const params = { page, limit };
      const response = await apiClient.get('/houses', { params });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch data nhà trọ:', error);
      throw error;
    }
  },

  async getHouseById(id) {
    const response = await apiClient.get(`/houses/${id}`);
    return response.data;
  },
};
