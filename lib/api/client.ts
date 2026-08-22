import axios from 'axios';
import { router } from 'expo-router';
import { getSecureItem } from '../storage';
import { isTokenExpired, clearTokens, refreshAccessToken } from './auth';
import i18n from '@/localization/i18n';

export const BASE_URL = 'https://hakeem1.runasp.net';

// ── Global logout guard ────────────────────────────────────────────
// Prevents multiple 401 responses from racing each other and
// triggering duplicate clearTokens / router.replace calls.
let isLoggingOut = false;

export const resetLogoutFlag = () => {
  isLoggingOut = false;
};

/**
 * One-shot forced logout: clears tokens, resets every in-memory store,
 * and navigates to the login screen.  Subsequent calls while a logout
 * is already in progress are silently ignored.
 */
const forceLogout = async () => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  await clearTokens();

  // Reset all Zustand stores so the next user never sees stale data
  try {
    const { useProfileStore } = require('@/store/useProfileStore');
    useProfileStore.getState().resetProfile();
  } catch {}
  try {
    const { useReminderStore } = require('@/store/useReminderStore');
    useReminderStore.getState().resetReminders();
  } catch {}
  try {
    const { useDocumentStore } = require('@/store/useDocumentStore');
    useDocumentStore.getState().reset();
  } catch {}
  try {
    const { useMedicationDraftStore } = require('@/store/useMedicationDraftStore');
    useMedicationDraftStore.getState().resetWorkflow();
  } catch {}

  try {
    router.replace('/(auth)/login');
  } catch {}
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const url = config.url || '';
    const isAuthRequest = url.includes('/auth/') || url.includes('/refresh');

    // If a forced logout is already underway, don't even try to attach a token,
    // unless it is an authentication request (like login, register, or logout).
    if (isLoggingOut && !isAuthRequest) {
      return Promise.reject(new axios.Cancel('Logging out'));
    }


    const isPublicAuthRequest = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/password-reset/');

    if (!isPublicAuthRequest) {
      try {
        let token = await getSecureItem('accessToken');
        if (token) {
          if (isTokenExpired(token)) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              token = await getSecureItem('accessToken');
              config.headers.Authorization = `Bearer ${token}`;
            } else {
              // Refresh failed — force logout once
              await forceLogout();
              return Promise.reject(new axios.Cancel(i18n.t('common:sessionExpired', { defaultValue: 'Session expired' })));
            }
          } else {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (e) {
        if (axios.isCancel(e)) throw e;
        // Intentionally left clean
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we are already logging out, don't process further 401s
    if (isLoggingOut) return Promise.reject(error);

    const originalRequest = error.config;
    
    if (error?.response?.status === 401) {
      const url = originalRequest?.url || '';
      const isAuthEndpoint = url.includes('/auth/') || url.includes('/refresh');


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
        await forceLogout();
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
      message: data?.message || error?.message || i18n.t('common:somethingWentWrong', { defaultValue: 'Something went wrong' }),
      errorList: data?.errorList || [],
    };
  }
};
