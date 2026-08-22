import { setSecureItem, getSecureItem, deleteSecureItem } from '../storage';

const BASE_URL = 'https://hakeem1.runasp.net';

export const saveTokens = async (accessToken: string, refreshToken?: string) => {
  try {
    if (accessToken) {
      await setSecureItem('accessToken', accessToken);
    }
    if (refreshToken) {
      await setSecureItem('refreshToken', refreshToken);
    }
    const { initPushNotifications } = require('../push-notifications');
    void initPushNotifications();
  } catch (e) {
    // Intentionally left clean
  }
};

let isClearingTokens = false;

export const clearTokens = async () => {
  if (isClearingTokens) return;
  isClearingTokens = true;
  try {
    const { removePushTokenFromBackend, clearStoredPushToken } = require('../push-notifications');
    await removePushTokenFromBackend();
    await clearStoredPushToken();
    await deleteSecureItem('accessToken');
    await deleteSecureItem('refreshToken');
  } catch (e) {
    // Intentionally left clean
  } finally {
    isClearingTokens = false;
  }
};

/**
 * Lightweight token wipe — skips push-token network calls.
 * Used when the refresh flow fails and we just need to clear
 * stored JWT tokens without triggering any API calls.
 */
const clearTokensQuietly = async () => {
  try {
    await deleteSecureItem('accessToken');
    await deleteSecureItem('refreshToken');
  } catch {
    // Intentionally left clean
  }
};

export const getAccessToken = async () => {
  try {
    return await getSecureItem('accessToken');
  } catch (e) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  if (!token || typeof token !== 'string') return true;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    let jsonString = '';

    if (typeof atob === 'function') {
      try {
        jsonString = decodeURIComponent(
          atob(payloadBase64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      } catch {
        jsonString = atob(payloadBase64);
      }
    }

    if (!jsonString) {
      return false;
    }

    const payload = JSON.parse(jsonString);

    if (payload && typeof payload.exp === 'number') {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      // Add a 10-second buffer so we refresh *before* it expires mid-request
      return payload.exp <= nowInSeconds + 10;
    }

    return false;
  } catch (e) {
    return false;
  }
};

export const verifyStoredToken = async (): Promise<boolean> => {
  const token = await getAccessToken();
  if (!token) {
    return false;
  }
  if (isTokenExpired(token)) {
    const refreshed = await refreshAccessToken();
    return refreshed;
  }
  return true;
};

let refreshLock: Promise<boolean> | null = null;

export const refreshAccessToken = async (): Promise<boolean> => {
  // If a refresh is already in-flight, piggyback on it
  if (refreshLock) return refreshLock;

  const promise = (async (): Promise<boolean> => {
    try {
      const refreshToken = await getSecureItem('refreshToken');
      if (!refreshToken) {
        await clearTokensQuietly();
        return false;
      }

      const response = await fetch(`${BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        await clearTokensQuietly();
        return false;
      }

      const text = await response.text();
      let newAccessToken = '';
      
      try {
        const data = JSON.parse(text);
        // The API wraps tokens inside a `data` property: { success, data: { accessToken, refreshToken } }
        newAccessToken = data?.data?.accessToken || data?.accessToken || data?.token;
        if (!newAccessToken) {
          throw new Error('No token found in JSON');
        }
        const newRefreshToken = data?.data?.refreshToken || data?.refreshToken;
        if (newRefreshToken) {
          await setSecureItem('refreshToken', newRefreshToken);
        }
      } catch (e: any) {
        if (e.message === 'No token found in JSON') {
          newAccessToken = ''; // Invalid response
        } else {
          newAccessToken = text; // Fallback to raw string
        }
      }

      if (newAccessToken) {
        await setSecureItem('accessToken', newAccessToken);
        // Re-register push token with the backend under the refreshed session
        try {
          const { initPushNotifications } = require('../push-notifications');
          void initPushNotifications();
        } catch {}
        return true;
      }

      await clearTokensQuietly();
      return false;
    } catch (e) {
      await clearTokensQuietly();
      return false;
    } finally {
      refreshLock = null;
    }
  })();

  refreshLock = promise;
  return promise;
};
