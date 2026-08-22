import { apiClient, BASE_URL } from './client';
import i18n from '@/localization/i18n';
import axios from 'axios';
import { getSecureItem } from '../storage';

/**
 * Register a device's Expo Push Token with the Hakeem backend.
 * PUT /patient/push-devices
 */
export const registerPushToken = async (
  expoPushToken: string,
  platform: string
): Promise<void> => {
  const language = i18n.language === 'ar' ? 'ar' : 'en';
  await apiClient.put('/patient/push-devices', {
    expoPushToken,
    platform,
    language,
  });
};

/**
 * Unregister a device's push token from the backend (e.g. on logout).
 * DELETE /patient/push-devices
 */
export const unregisterPushToken = async (
  expoPushToken: string
): Promise<void> => {
  try {
    const token = await getSecureItem('accessToken');
    await axios.delete(`${BASE_URL}/patient/push-devices`, {
      data: { expoPushToken },
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      }
    });
  } catch (error) {
    // Silently ignore as this is usually called during logout or token clear
  }
};
