import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="delete-account" />
      <Stack.Screen name="help" />
    </Stack>
  );
}
