import { apiClient } from './client';
import i18n from '@/localization/i18n';

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
  await apiClient.delete('/patient/push-devices', {
    data: { expoPushToken },
  });
};
