import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingStep3() {
  const handleComplete = async (route: '/(auth)/register' | '/(auth)/login') => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    router.replace(route);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-header font-jakarta-bold text-text mb-4 text-center">
          Your Medical CV, when you need it.
        </Text>
      </View>
      <View className="p-6 pb-10 gap-4">
        <TouchableOpacity 
          className="w-full bg-[#1F2937] py-4 rounded-xl items-center"
          onPress={() => handleComplete('/(auth)/register')}
        >
          <Text className="text-white font-inter-semibold text-lg">Create An Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="w-full bg-transparent py-4 rounded-xl items-center border border-gray-300"
          onPress={() => handleComplete('/(auth)/login')}
        >
          <Text className="text-[#1F2937] font-inter-semibold text-lg">I Already have an Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
