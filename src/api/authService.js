import apiClient from './axios';

export default {
  async login(username, password) {
    const response = await apiClient.post('/auth/login', {
      username,
      password
    });
    // Lưu token vào localStorage để dùng cho các request sau
    if (response.data.status) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
