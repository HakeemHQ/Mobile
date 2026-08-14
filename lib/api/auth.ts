import { setSecureItem, getSecureItem, deleteSecureItem } from '../storage';

export const saveTokens = async (accessToken: string, refreshToken?: string) => {
  try {
    if (accessToken) {
      await setSecureItem('accessToken', accessToken);
    }
    if (refreshToken) {
      await setSecureItem('refreshToken', refreshToken);
    }
    const { initPushNotifications } = await import('../push-notifications');
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
    const { removePushTokenFromBackend, clearStoredPushToken } = await import('../push-notifications');
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
      return payload.exp <= nowInSeconds;
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
    await clearTokens();
    return false;
  }
  return true;
};
