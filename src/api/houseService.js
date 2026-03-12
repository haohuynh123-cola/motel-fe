import apiClient from './axios';

export default {
  // Lấy danh sách tất cả các nhà trọ có phân trang cursor
  async getHouses(cursor = 0, limit = 10) {
    try {
      const params = { limit };
      if (cursor > 0) {
        params.cursor = cursor;
      }      const response = await apiClient.get('/houses', { params });
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
