import '@/global.css';

import { useEffect, useRef } from 'react';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import '../localization/i18n';
import { AlarmEngine } from '@/lib/alarm-engine';
import { initPushNotifications } from '@/lib/push-notifications';

SplashScreen.preventAutoHideAsync();

export {
  ErrorBoundary,
} from 'expo-router';

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

  // Track whether we've already acted on the last notification response
  const lastNotifIdHandled = useRef<string | null>(null);

  // useLastNotificationResponse is the correct modern hook — works for both
  // foreground taps AND cold-start (app opened by tapping a push notification)
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!lastNotificationResponse) return;

    const notifId = lastNotificationResponse.notification.request.identifier;
    // Deduplicate: don't navigate twice for the same notification
    if (lastNotifIdHandled.current === notifId) return;
    lastNotifIdHandled.current = notifId;

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
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
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
  );
}
