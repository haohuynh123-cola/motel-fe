import apiClient from './axios'

export interface LoginResponse {
  data: {
    token: string
    user?: any
  }
  status: boolean
  message?: string
}

export interface RegisterResponse {
  status: boolean
  message: string
  data?: any
}

export default {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      username,
      password,
    })
    // Lưu token vào localStorage để dùng cho các request sau
    if (response.data.status && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token)
    }
    return response.data
  },

  async register(userData: {
    username: string
    password: string
    email: string
    full_name: string
  }): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', userData)
    return response.data
  },

  async verifyOtp(email: string, otpCode: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/verify-otp', {
      email,
      otp_code: otpCode,
    })
    if (response.data.status && response.data.data.token) {
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
