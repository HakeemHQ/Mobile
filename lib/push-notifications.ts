import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { setSecureItem, getSecureItem, deleteSecureItem } from './storage';
import { registerPushToken, unregisterPushToken } from './api/notifications';

const PUSH_TOKEN_KEY = 'expoPushToken';

/**
 * Register for push notifications and return the Expo Push Token.
 *
 * 1. Check if running on a physical device (iOS Simulator can't receive push).
 * 2. Request notification permissions.
 * 3. Retrieve the Expo Push Token.
 * 4. Cache it locally via AsyncStorage.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice && Platform.OS === 'ios') {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId ?? undefined,
    });

    const token = tokenData.data;
    await setSecureItem(PUSH_TOKEN_KEY, token);
    return token;
  } catch {
    return null;
  }
}

/**
 * Get the locally cached Expo Push Token.
 */
export async function getStoredPushToken(): Promise<string | null> {
  try {
    return await getSecureItem(PUSH_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Clear the locally cached push token.
 */
export async function clearStoredPushToken(): Promise<void> {
  try {
    await deleteSecureItem(PUSH_TOKEN_KEY);
  } catch {
    // Intentionally left clean
  }
}

/**
 * Register the push token with the Hakeem backend.
 */
export async function sendPushTokenToBackend(token: string): Promise<void> {
  try {
    const platform = Platform.OS;
    await registerPushToken(token, platform);
  } catch {
    // Silently ignore or handle error quietly
  }
}

/**
 * Unregister the push token from the backend (call on logout).
 */
export async function removePushTokenFromBackend(): Promise<void> {
  try {
    const token = await getStoredPushToken();
    if (token) {
      await unregisterPushToken(token);
    }
  } catch {
    // Silently ignore or handle error quietly
  }
}

import { router } from 'expo-router';

/**
 * Setup listener for remote push notification taps (e.g. doctor access requests).
 * Filters out local reminder alarms/notifications.
 */
export function setupPushNotificationResponseListener(): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    const actionId = response.actionIdentifier;

    // Ignore reminder notifications (they have scheduleId, reminderId, or deliveryMode)
    const isReminder = Boolean(data?.scheduleId || data?.reminderId || data?.deliveryMode);
    if (isReminder) {
      return;
    }

    if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      // Use setTimeout like alarm-engine to ensure router/navigator is mounted
      setTimeout(() => {
        router.push('/access-requests' as any);
      }, 300);
    }
  });

  return () => {
    subscription.remove();
  };
}

/**
 * Full registration flow: get token → send to backend (only if authenticated).
 */
export async function initPushNotifications(): Promise<void> {
  const token = await registerForPushNotificationsAsync();
  if (token) {
    const { verifyStoredToken } = await import('./api/auth');
    const isAuthenticated = await verifyStoredToken();
    if (isAuthenticated) {
      await sendPushTokenToBackend(token);
    }
  }
}
