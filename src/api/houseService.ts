import apiClient from './axios';

export interface House {
  id: number;
  name: string;
  address: string;
  created_at: string;
}

export default {
  // Lấy danh sách tất cả các nhà trọ có phân trang cursor
  async getHouses(params: { cursor?: number; limit?: number } = { limit: 10 }): Promise<House[]> {
    try {
      const response = await apiClient.get<House[]>('/houses', { params });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch data nhà trọ:', error);
      throw error;
    }
  },

  async getHouseById(id: number | string): Promise<House> {
    const response = await apiClient.get<House>(`/houses/${id}`);
    return response.data;
  },
};
