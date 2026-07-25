import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { InputField } from '../../components/ui/InputField';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';
import { User02Icon } from '../../components/icons/User02Icon';
import { Mail01Icon } from '../../components/icons/Mail01Icon';
import { Call02Icon } from '../../components/icons/Call02Icon';
import { LockOpenIcon } from '../../components/icons/LockOpenIcon';
import { EyeOffIcon } from '../../components/icons/EyeOffIcon';
import { ViewIcon } from '../../components/icons/ViewIcon';


export default function RegisterScreen() {
  const [isChecked, setIsChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <Pressable 
          className="w-10 h-10 rounded-full border border-bg-600 items-center justify-center mb-6"
          onPress={() => router.back()}
        >
          <ArrowLeft02Icon size={20} color="secondary.900" />
        </Pressable>

        {/* Header */}
        <Text className="text-[28px] font-jakarta-bold text-secondary-900 mb-2">Create account</Text>
        <Text className="text-sm font-inter-regular text-text2-500 mb-8">
          Start organizing your medical history for free
        </Text>

        {/* Form Fields */}
        <InputField 
          label="Full Name" 
          icon={User02Icon} 
          placeholder="Youssef Tarek" 
        />
        <InputField 
          label="Email Address" 
          icon={Mail01Icon} 
          placeholder="you@example.com" 
          keyboardType="email-address"
        />
        <InputField 
          label="Phone (OPTIONAL)" 
          icon={Call02Icon} 
          placeholder="0123 456 7890" 
          keyboardType="phone-pad"
        />
        <InputField 
          label="Password" 
          icon={LockOpenIcon} 
          placeholder="At least 8 characters" 
          secureTextEntry={!isPasswordVisible}
          rightIcon={isPasswordVisible ? ViewIcon : EyeOffIcon}
          onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
        />

        {/* Terms and Conditions */}
        <Pressable 
          className="flex-row mt-2 mb-8 pr-4 items-center"
          onPress={() => setIsChecked(!isChecked)}
        >
          <View 
            className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${isChecked ? 'bg-secondary-900 border-secondary-900' : 'border-text2-200'}`}
          >
            {isChecked && <Text className="text-white text-xs">✓</Text>}
          </View>
          <Text className="text-sm font-inter-regular text-text2-500 leading-5 flex-1">
            I agree to Hakeem's <Text className="font-inter-bold text-secondary-900">Terms of Service</Text> and <Text className="font-inter-bold text-secondary-900">Privacy Policy.</Text> My data is never sold or used for advertising.
          </Text>
        </Pressable>

        {/* Create Account Button */}
        <Pressable className="bg-secondary-900 h-14 rounded-2xl items-center justify-center mb-6">
          <Text className="text-white font-jakarta-bold text-lg">Create Account</Text>
        </Pressable>

        {/* Sign In Link */}
        <View className="flex-row justify-center pb-8">
          <Text className="text-sm font-inter-regular text-text2-500">
            Already have an account?{' '}
          </Text>
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text className="text-sm font-jakarta-bold text-secondary-900">Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
