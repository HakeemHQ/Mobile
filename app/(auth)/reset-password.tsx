import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';
import { Mail01Icon } from '../../components/icons/Mail01Icon';

function InputField({ 
  label, 
  icon: Icon, 
  placeholder, 
  keyboardType = 'default' 
}: any) {
  return (
    <View className="mb-4 mt-6">
      <Text className="text-[10px] font-jakarta-bold text-text-500 mb-2 uppercase">{label}</Text>
      <View className="flex-row items-center bg-[#F1F5F4] rounded-2xl px-4 h-14">
        <Icon size={20} color="text2.500" />
        <TextInput 
          className="flex-1 ml-3 text-base font-inter-regular text-text-500 placeholder:text-text2-400"
          placeholder={placeholder}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

export default function ResetPasswordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Back Button */}
      <View className="px-6 pt-2">
        <Pressable 
          className="w-10 h-10 rounded-full border border-bg-600 items-center justify-center"
          onPress={() => router.back()}
        >
          <ArrowLeft02Icon size={20} color="text.500" />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }} 
        className="px-6" 
        showsVerticalScrollIndicator={false}
      >
        <View className="-mt-10">
          {/* Mail Icon Box */}
          <View className="w-12 h-12 bg-[#D1F1E3] rounded-xl items-center justify-center mb-6">
            <Mail01Icon size={24} color="secondary.900" />
          </View>

          {/* Header */}
          <Text className="text-[28px] font-jakarta-bold text-secondary-900 mb-2">Reset password</Text>
          <Text className="text-sm font-inter-regular text-text2-500 mb-2">
            Enter your email and we'll send a secure link. The link expires in 15 minutes.
          </Text>

          {/* Form Fields */}
          <InputField 
            label="Email Address" 
            icon={Mail01Icon} 
            placeholder="you@example.com" 
            keyboardType="email-address"
          />

          {/* Send Reset Link Button */}
          <Pressable className="bg-secondary-900 h-14 rounded-2xl items-center justify-center mb-8">
            <Text className="text-white font-jakarta-bold text-lg">Send reset link</Text>
          </Pressable>

          {/* Warning Box */}
          <View className="bg-[#FFF8EA] rounded-2xl p-4 flex-row">
            <Text className="text-xs font-inter-regular text-[#9F6B20] leading-5 flex-1">
              <Text className="font-inter-bold">Don't see the email? </Text>
              Check your spam folder. Make sure you're using the address you signed up with.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
