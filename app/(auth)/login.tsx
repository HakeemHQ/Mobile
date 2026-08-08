import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { InputField } from '../../components/ui/InputField';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { apiFetch, saveTokens } from '../../lib/api';
import { GoogleIcon } from '../../components/icons/GoogleIcon';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';
import { Mail01Icon } from '../../components/icons/Mail01Icon';
import { LockOpenIcon } from '../../components/icons/LockOpenIcon';
import { EyeOffIcon } from '../../components/icons/EyeOffIcon';
import { ViewIcon } from '../../components/icons/ViewIcon';
import { AddIcon } from '../../components/icons/AddIcon';
import { ShieldIcon } from '../../components/icons/ShieldIcon';
import { useProfileStore } from '../../store/useProfileStore';

export default function LoginScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: any) => {
    setGlobalError('');
    setIsLoading(true);
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response && response.success && response.data) {
        const token =
          response.data.accessToken ||
          response.data.token ||
          (typeof response.data === 'string' ? response.data : '');
        const refreshToken = response.data.refreshToken || '';
        await saveTokens(token, refreshToken);
        await useProfileStore.getState().fetchProfile(true);
        router.replace('/(tabs)');
      } else {
        setGlobalError(response.message || 'Something went wrong');
      }
    } catch (error: any) {
      if (error.errorList && error.errorList.length > 0) {
        error.errorList.forEach((err: any) => {
          const propName = (err.propertyName || '').toLowerCase();
          if (propName.includes('email')) {
            setError('email', { type: 'server', message: err.message });
          } else if (propName.includes('password')) {
            setError('password', { type: 'server', message: err.message });
          } else {
            setGlobalError(err.message);
          }
        });
      } else {
        setGlobalError(error.message || 'Something went wrong');
      }
    } finally {
      setIsLoading(false);
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
            <ArrowLeft02Icon size={20} color="primary.900" />
          </Pressable>

          {/* Logo */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-primary-50 items-center justify-center mr-3">
              <AddIcon size={20} color="primary.900" />
            </View>
            <Text className="text-2xl font-jakarta-bold text-primary-900">Hakeem</Text>
          </View>

          {/* Header */}
          <View>
            <Text className="text-[28px] font-jakarta-bold text-primary-900 mb-2">Welcome back</Text>
            <Text className="text-sm font-inter-regular text-text2-500">
              Sign in to access your medical records
            </Text>
            {globalError ? (
              <Text className="text-sm font-inter-regular text-red-500 mt-2">{globalError}</Text>
            ) : null}
          </View>

          {/* Form Fields */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Email Address"
                icon={Mail01Icon}
                placeholder="you@example.com"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message as string}
                autoCapitalize="none"
                containerClassName=""
                bgClassName="bg-primary-50"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Password"
                icon={LockOpenIcon}
                placeholder="At least 8 characters"
                secureTextEntry={!isPasswordVisible}
                rightIcon={isPasswordVisible ? ViewIcon : EyeOffIcon}
                onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
                value={value}
                onChangeText={onChange}
                error={errors.password?.message as string}
                containerClassName=""
                bgClassName="bg-primary-50"
              />
            )}
          />

          {/* Forgot password */}
          <View className="items-end">
            <Pressable onPress={() => router.push('/(auth)/reset-password')}>
              <Text className="text-sm font-jakarta-bold text-primary-900">Forgot password?</Text>
            </Pressable>
          </View>

          {/* Continue Button */}
          <Pressable
            className={`bg-primary h-14 rounded-2xl items-center justify-center ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-jakarta-bold text-lg">Continue</Text>
            )}
          </Pressable>

          {/* Or continue with */}
          <View className="items-center">
            <Text className="text-sm font-inter-regular text-text2-500">or continue with</Text>
          </View>

          {/* Social Login Buttons */}
          <Pressable className="h-14 border border-text2-100 rounded-2xl flex-row items-center justify-center mt-2 mb-2">
            <GoogleIcon />
            <Text className="font-jakarta-bold text-text-900 ml-3 text-base">Continue with Google</Text>
          </Pressable>

          {/* Encryption Banner */}
          <View className="bg-primary-50 h-12 rounded-xl flex-row items-center justify-center px-4">
            <ShieldIcon size={20} color="primary.900" />
            <Text className="text-[11px] font-jakarta-bold text-primary-900 ml-2">
              256-bit encrypted, Your data is never sold or shared
            </Text>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-sm font-inter-regular text-text2-500">
              Don't have account?{' '}
            </Text>
            <Pressable onPress={() => router.replace('/(auth)/register')}>
              <Text className="text-sm font-jakarta-bold text-primary-900">Sign up free</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
