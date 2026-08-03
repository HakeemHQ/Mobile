import axios from 'axios';
import { router } from 'expo-router';
import { getSecureItem } from '../storage';
import { isTokenExpired, clearTokens } from './auth';

export const BASE_URL = 'http://hakeem1.runasp.net';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getSecureItem('accessToken');
      if (token) {
        if (isTokenExpired(token)) {
          await clearTokens();
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // Intentionally left clean
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await clearTokens();
      const url = error?.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        try {
          router.replace('/(auth)/login');
        } catch (e) {
          // Intentionally left clean
        }
      }
    }
    return Promise.reject(error);
  }
);

export const apiFetch = async (endpoint: string, options: any = {}) => {
  try {
    const response = await apiClient({
      url: endpoint,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : options.data,
      headers: options.headers,
    });
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    throw {
      message: data?.message || error?.message || 'Something went wrong',
      errorList: data?.errorList || [],
    };
  }
};
