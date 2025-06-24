// services/api.ts
import axios from 'axios';
import { getToken } from '@/utils/auth';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
});

console.log('>>> API baseURL =', API.defaults.baseURL);

API.interceptors.request.use(config => {
  const token = getToken();
  console.log('enviando token:', token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export default API;
