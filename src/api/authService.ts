import apiClient from './axios'

export interface LoginResponse {
  data: {
    token: string
  }
  status: boolean
}

export default {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      username,
      password,
    })
    // Lưu token vào localStorage để dùng cho các request sau
    if (response.data.status) {
      localStorage.setItem('token', response.data.data.token)
    }
    return response.data
  },

  logout(): void {
    localStorage.removeItem('token')
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },
}
