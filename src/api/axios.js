import axios from 'axios';

// Tạo một bản instance của axios với cấu hình mặc định
const apiClient = axios.create({
  // Tạm thời gọi vào cổng 8080 (Docker Backend)
  // Nếu có domain thực tế, hãy đổi thành https://api.motel.codetoolkit.org/api/v1
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000, // Timeout sau 10s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bạn có thể thêm Interceptor ở đây để tự động đính kèm Token JWT sau này
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
