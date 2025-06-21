import axios from 'axios';

// Vite, ortam değişkenlerini import.meta.env üzerinden sağlar.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5008/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// JWT token'ını her isteğe eklemek için bir interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient; 