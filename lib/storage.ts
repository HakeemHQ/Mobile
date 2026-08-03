import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Re-enable expo-secure-store once iOS development build is available
// Currently disabled because it causes native crashes in Expo Go on iOS

export const setSecureItem = async (key: string, value: string): Promise<void> => {
  await AsyncStorage.setItem(key, value);
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  return await AsyncStorage.getItem(key);
};

export const deleteSecureItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};

