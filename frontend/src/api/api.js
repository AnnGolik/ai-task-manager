import axios from 'axios';

// Базовый URL нашего backend
const API_URL = 'http://localhost:5000';

// Создаём экземпляр axios с настройками
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor — перехватывает каждый запрос ПЕРЕД отправкой
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;