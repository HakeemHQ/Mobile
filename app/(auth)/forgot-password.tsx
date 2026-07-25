import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';

export default function ForgotPasswordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 pt-2">
        {/* Back Button */}
        <Pressable 
          className="w-10 h-10 rounded-full border border-bg-600 items-center justify-center mb-6"
          onPress={() => router.back()}
        >
          <ArrowLeft02Icon size={20} color="secondary.900" />
        </Pressable>

        <Text className="text-[28px] font-jakarta-bold text-secondary-900 mb-2">Forgot Password</Text>
      </View>
    </SafeAreaView>
  );
}
