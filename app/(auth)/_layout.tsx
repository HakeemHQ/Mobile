import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { resetLogoutFlag } from '@/lib/api';

export default function AuthLayout() {
  useEffect(() => {
    resetLogoutFlag();
  }, []);

  return (
    <Stack screenOptions={{ animation: 'none' }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
    </Stack>
  );
}

