import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function OnboardingStep1() {
  const handleNext = () => {
    router.push('/(onboarding)/step2');
  };

  const handleSkip = () => {
    router.replace('/(auth)/register');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-row justify-end p-4">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="font-jakarta-bold text-text">Skip</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-header font-jakarta-bold text-text mb-4 text-center">
          All your records, one place.
        </Text>
      </View>
      <View className="p-6 pb-10">
        <TouchableOpacity 
          className="w-full bg-primary py-4 rounded-xl items-center"
          onPress={handleNext}
        >
          <Text className="text-white font-inter-semibold text-lg">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
