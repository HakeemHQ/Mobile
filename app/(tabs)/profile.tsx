import { Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { apiFetch, clearTokens } from '../../lib/api';
export default function ProfileScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
      await clearTokens();
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Logout Failed', error.message || 'Something went wrong');
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-bg" edges={['top', 'left', 'right']}>
      <Text className="text-header font-jakarta-bold text-text mb-8">Profile</Text>
      <Pressable 
        className={`bg-red-500 h-14 w-11/12 rounded-2xl items-center justify-center ${isLoggingOut ? 'opacity-70' : ''}`}
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-jakarta-bold text-lg">Log Out</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}
