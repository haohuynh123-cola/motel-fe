import apiClient from './axios';

export default {
  async getRoomsByHouse(houseId) {
    try {
      const response = await apiClient.get(`/houses/${houseId}/rooms`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi fetch data phòng của nhà ${houseId}:`, error);
      throw error;
    }
  },

  async getRoomById(id) {
    const response = await apiClient.get(`/rooms/${id}`);
    return response.data;
  },

  async createRoom(roomData) {
    const response = await apiClient.post('/rooms', roomData);
    return response.data;
  }
};
