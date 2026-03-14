import apiClient from './axios';

export default {
  async getAllContracts() {
    try {
      const response = await apiClient.get('/contracts');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch tất cả hợp đồng:', error);
      throw error;
    }
  },

  async getContractsByHouse(houseId) {
    try {
      const response = await apiClient.get(`/api/v1/houses/${houseId}/contracts`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi fetch hợp đồng của nhà ${houseId}:`, error);
      throw error;
    }
  },

  async getContractById(id) {
    const response = await apiClient.get(`/api/v1/contracts/${id}`);
    return response.data;
  },

  async createContract(contractData) {
    const response = await apiClient.post('/api/v1/contracts', contractData);
    return response.data;
  }
};
