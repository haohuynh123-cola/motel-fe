import apiClient from './axios'

export interface User {
  id: number
  username: string
  email: string
  role: string
  created_at: string
}

export default {
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/users')
      return response.data
    } catch (error) {
      console.error('Lỗi khi fetch danh sách người dùng:', error)
      throw error
    }
  },

  async register(userData: any): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', userData)
    return response.data
  },
}
