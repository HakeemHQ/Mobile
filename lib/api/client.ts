import axios from 'axios';
import { router } from 'expo-router';
import { getSecureItem } from '../storage';
import { isTokenExpired, clearTokens, refreshAccessToken } from './auth';

export const BASE_URL = 'https://hakeem1.runasp.net';

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
      let token = await getSecureItem('accessToken');
      if (token) {
        if (isTokenExpired(token)) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            token = await getSecureItem('accessToken');
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            // refresh failed, clearTokens is already called inside refreshAccessToken
          }
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
    const originalRequest = error.config;
    
    if (error?.response?.status === 401) {
      const url = originalRequest?.url || '';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/refresh');

      if (!originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;
        
        const refreshed = await refreshAccessToken();
        
        if (refreshed) {
          // Token refreshed successfully, retry the original request
          const newToken = await getSecureItem('accessToken');
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
      }
      
      // If we reach here on a 401, either it's an auth endpoint, 
      // the refresh failed, OR we already retried and STILL got a 401.
      // In all these cases (except login/register endpoints), we should log out.
      if (!isAuthEndpoint) {
        await clearTokens();
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
