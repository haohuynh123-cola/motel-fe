import apiClient from './axios'

export interface Room {
  id: number
  house_id: number
  name: string
  price: number
  status: string
  description?: string
  created_at: string
}

export default {
  async getRoomsByHouse(houseId: number | string): Promise<Room[]> {
    try {
      const response = await apiClient.get<Room[]>(`/houses/${houseId}/rooms`)
      return response.data
    } catch (error) {
      console.error(`Lỗi khi fetch data phòng của nhà ${houseId}:`, error)
      throw error
    }
  },

  async getRoomById(id: number | string): Promise<Room> {
    const response = await apiClient.get<Room>(`/rooms/${id}`)
    return response.data
  },

  async createRoom(roomData: Partial<Room>): Promise<Room> {
    const response = await apiClient.post<Room>('/rooms', roomData)
    return response.data
  },
}
