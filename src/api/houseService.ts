import apiClient from './axios'

export interface House {
  id: number
  name: string
  address: string
  created_at: string
}

export default {
  // Lấy danh sách tất cả các nhà trọ có phân trang cursor
  async getHouses(params: { cursor?: number; limit?: number } = { limit: 10 }) {
    try {
      const response = await apiClient.get('/houses', { params })
      return response.data
    } catch (error) {
      console.error('Lỗi khi fetch data nhà trọ:', error)
      throw error
    }
  },

  async getHouseById(id: number | string) {
    const response = await apiClient.get(`/houses/${id}`)
    return response.data
  },

  async createHouse(data: any) {
    const response = await apiClient.post('/houses', data)
    return response.data
  },

  async updateHouse(id: number | string, data: any) {
    const response = await apiClient.put(`/houses/${id}`, data)
    return response.data
  },

  async deleteHouse(id: number | string) {
    const response = await apiClient.delete(`/houses/${id}`)
    return response.data
  },
}
