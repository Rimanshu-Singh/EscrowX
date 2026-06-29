import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to attach the auth token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('escrowx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
