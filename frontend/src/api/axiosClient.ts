import axios from 'axios';
import { API_BASE_URL } from '@/lib/env';

export const api = axios.create({
  baseURL: API_BASE_URL,
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
