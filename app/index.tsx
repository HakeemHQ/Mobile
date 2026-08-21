import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyStoredToken, resetLogoutFlag } from '@/lib/api';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [authState, setAuthState] = useState<{
    isFirstLaunch: boolean;
    isAuthenticated: boolean;
  } | null>(null);

  useEffect(() => {
    async function checkAuthAndLaunchStatus() {
      // Ensure the logout guard is cleared on fresh app start
      resetLogoutFlag();
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const isAuthenticated = await verifyStoredToken();

        setAuthState({
          isFirstLaunch: hasLaunched === null,
          isAuthenticated,
        });
      } catch (error) {
        setAuthState({
          isFirstLaunch: false,
          isAuthenticated: false,
        });
      }
    }

    checkAuthAndLaunchStatus();
  }, []);

  if (authState === null) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" color="#1A56DB" />
      </View>
    );
  }

  if (authState.isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  if (authState.isFirstLaunch) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
