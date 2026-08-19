import '@/global.css';

import { useEffect, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';
import { Stack, router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import '../localization/i18n';
import { AlarmEngine } from '@/lib/alarm-engine';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { initPushNotifications } from '@/lib/push-notifications';
import { ObserveRoot } from 'expo-observe';

SplashScreen.preventAutoHideAsync();

export {
  ErrorBoundary,
} from 'expo-router';

// Global memory tracker to survive hot reloads during development
const handledNotificationIds = new Set<string>();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'PlusJakarta-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakarta-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakarta-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakarta-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      try {
        await Asset.loadAsync([
          require('../assets/images/remindersEmptyList.png'),
          require('../assets/images/documentEmptyList.png'),
          require('../assets/images/emptyList.png'),
          require('../assets/images/record-detailEmptyState.png'),
          require('../assets/images/Pending.webp')
        ]);
      } catch (e) {
        console.warn('Failed to load assets', e);
      } finally {
        setAssetsLoaded(true);
      }
    }
    loadAssets();
  }, []);

  // useLastNotificationResponse is the correct modern hook — works for both
  // foreground taps AND cold-start (app opened by tapping a push notification)
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!lastNotificationResponse) return;

    const notifId = lastNotificationResponse.notification.request.identifier;
    // Deduplicate: don't navigate twice for the same notification
    if (handledNotificationIds.has(notifId)) return;
    handledNotificationIds.add(notifId);

    const data = lastNotificationResponse.notification.request.content.data;
    const actionId = lastNotificationResponse.actionIdentifier;

    // Only handle DEFAULT tap (not dismiss/cancel actions)
    if (actionId !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;

    // Ignore local reminder notifications — they have reminder-specific data fields
    const isReminder = Boolean(data?.scheduleId || data?.reminderId || data?.deliveryMode);
    if (isReminder) return;

    // It's a remote push notification (e.g. doctor access request) → navigate
    setTimeout(() => {
      router.push('/access-requests' as any);
    }, 300);
  }, [lastNotificationResponse]);

  useEffect(() => {
    void AlarmEngine.init();
  }, []);

  useEffect(() => {
    void initPushNotifications();
  }, []);

  useEffect(() => {
    if ((loaded && assetsLoaded) || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, assetsLoaded, error]);

  if ((!loaded || !assetsLoaded) && !error) {
    return null;
  }

  return (
    <ObserveRoot>
      <KeyboardProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="reminders" options={{ headerShown: false }} />
          <Stack.Screen name="record-detail" options={{ headerShown: false }} />
          <Stack.Screen name="documents" options={{ headerShown: false }} />
          <Stack.Screen name="access-requests" options={{ headerShown: false }} />
        </Stack>
      </KeyboardProvider>
    </ObserveRoot>
  );
}
