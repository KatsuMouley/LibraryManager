//services/api.ts
import axios from 'axios';
import { getToken } from '@/utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:5257/api',
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
