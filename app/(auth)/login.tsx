import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { InputField } from '../../components/ui/InputField';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';
import { Mail01Icon } from '../../components/icons/Mail01Icon';
import { LockOpenIcon } from '../../components/icons/LockOpenIcon';
import { EyeOffIcon } from '../../components/icons/EyeOffIcon';
import { ViewIcon } from '../../components/icons/ViewIcon';
import { AddIcon } from '../../components/icons/AddIcon';
import { ShieldIcon } from '../../components/icons/ShieldIcon';

export default function LoginScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (text: string) => {
    setEmail(text);
    if (!text) {
      setEmailError('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password is required');
    } else if (text.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = () => {
    let valid = true;
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    }

    if (valid) {
      router.push('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView 
        className="flex-1 px-6 pt-2" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View className="gap-8 py-8">
          {/* Back Button */}
          <Pressable 
            className="w-10 h-10 rounded-full border border-bg-600 items-center justify-center"
            onPress={() => router.back()}
          >
            <ArrowLeft02Icon size={20} color="secondary.900" />
          </Pressable>

          {/* Logo */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-secondary-50 items-center justify-center mr-3">
              <AddIcon size={20} color="secondary.900" />
            </View>
            <Text className="text-2xl font-jakarta-bold text-secondary-900">Hakeem</Text>
          </View>

          {/* Header */}
          <View>
            <Text className="text-[28px] font-jakarta-bold text-secondary-900 mb-2">Welcome back</Text>
            <Text className="text-sm font-inter-regular text-text2-500">
              Sign in to access your medical records
            </Text>
          </View>

          {/* Form Fields */}
          <InputField 
            label="Email Address" 
            icon={Mail01Icon} 
            placeholder="you@example.com" 
            keyboardType="email-address"
            value={email}
            onChangeText={validateEmail}
            error={emailError}
            autoCapitalize="none"
            containerClassName=""
          />
          <InputField 
            label="Password" 
            icon={LockOpenIcon} 
            placeholder="At least 8 characters" 
            secureTextEntry={!isPasswordVisible}
            rightIcon={isPasswordVisible ? ViewIcon : EyeOffIcon}
            onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
            value={password}
            onChangeText={validatePassword}
            error={passwordError}
            containerClassName=""
          />
          
          {/* Forgot password */}
          <View className="items-end">
            <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
              <Text className="text-sm font-jakarta-bold text-secondary-900">Forgot password?</Text>
            </Pressable>
          </View>

          {/* Continue Button */}
          <Pressable 
            className="bg-secondary-900 h-14 rounded-2xl items-center justify-center"
            onPress={handleLogin}
          >
            <Text className="text-white font-jakarta-bold text-lg">Continue</Text>
          </Pressable>

          {/* Or continue with */}
          <View className="items-center">
            <Text className="text-sm font-inter-regular text-text2-500">or continue with</Text>
          </View>

          {/* Social Login Buttons */}
          <View className="flex-row justify-between">
            <Pressable className="flex-1 h-14 border border-text2-100 rounded-2xl items-center justify-center mr-2">
              <Text className="font-jakarta-bold text-text-900">Apple</Text>
            </Pressable>
            <Pressable className="flex-1 h-14 border border-text2-100 rounded-2xl items-center justify-center ml-2">
              <Text className="font-jakarta-bold text-text-900">Google</Text>
            </Pressable>
          </View>

          {/* Encryption Banner */}
          <View className="bg-[#E6F4EA] h-12 rounded-xl flex-row items-center justify-center px-4">
            <ShieldIcon size={20} color="secondary.900" />
            <Text className="text-[11px] font-jakarta-bold text-secondary-900 ml-2">
              256-bit encrypted, Your data is never sold or shared
            </Text>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-sm font-inter-regular text-text2-500">
              Don't have account?{' '}
            </Text>
            <Pressable onPress={() => router.replace('/(auth)/register')}>
              <Text className="text-sm font-jakarta-bold text-secondary-900">Sign up free</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
