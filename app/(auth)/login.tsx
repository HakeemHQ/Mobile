import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { InputField } from '../../components/ui/InputField';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { apiFetch, saveTokens, resetLogoutFlag } from '../../lib/api';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';
import { Mail01Icon } from '../../components/icons/Mail01Icon';
import { LockOpenIcon } from '../../components/icons/LockOpenIcon';
import { EyeOffIcon } from '../../components/icons/EyeOffIcon';
import { ViewIcon } from '../../components/icons/ViewIcon';
import { AddIcon } from '../../components/icons/AddIcon';
import { ShieldIcon } from '../../components/icons/ShieldIcon';
import { useProfileStore } from '../../store/useProfileStore';

export default function LoginScreen() {
  const { t, i18n } = useTranslation('auth');
  const isRTL = i18n.language === 'ar';

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

    // Reset the forced-logout flag so interceptors allow requests again
    resetLogoutFlag();

    // Clear all stale in-memory data from a previous session
    useProfileStore.getState().resetProfile();
    try {
      const { useReminderStore } = require('@/store/useReminderStore');
      useReminderStore.getState().resetReminders();
    } catch { }
    try {
      const { useDocumentStore } = require('@/store/useDocumentStore');
      useDocumentStore.getState().reset();
    } catch { }

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

        // Best-effort profile fetch — don't let it block or break login
        try {
          await useProfileStore.getState().fetchProfile(true);
        } catch { }

        router.replace('/(tabs)');
      } else {
        setGlobalError(response.message || t('somethingWentWrong'));
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
        setGlobalError(error.message || t('somethingWentWrong'));
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
          {/* Back Button (Only if there is a screen to go back to) */}
          {router.canGoBack() && (
            <Pressable
              accessibilityLabel={t('goBack')}
              accessibilityRole="button"
              className="w-10 h-10 rounded-full border border-bg-600 items-center justify-center"
              onPress={() => router.back()}
            >
              <ArrowLeft02Icon size={20} color="primary.900" />
            </Pressable>
          )}

          {/* Logo */}
          <View className={`items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <View className={`w-8 h-8 rounded-lg bg-primary-50 items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <AddIcon size={20} color="primary.900" />
            </View>
            <Text className="text-2xl font-jakarta-bold text-primary-900">
              {t('brandName')}
            </Text>
          </View>

          {/* Header */}
          <View>
            <Text className={`text-[28px] font-jakarta-bold text-primary-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('welcomeBack')}
            </Text>
            <Text className={`text-sm font-inter-regular text-text2-500 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('loginSubtitle')}
            </Text>

            {globalError ? (
              <Text className={`text-sm font-inter-regular text-red-500 mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {globalError}
              </Text>
            ) : null}
          </View>

          {/* Form Fields */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: t('emailRequired'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('invalidEmail')
              }
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label={t('emailAddress')}
                icon={Mail01Icon}
                placeholder={t('emailPlaceholder')}
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
              required: t('passwordRequired'),
              minLength: {
                value: 8,
                message: t('passwordMinLength')
              }
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label={t('password')}
                icon={LockOpenIcon}
                placeholder={t('passwordPlaceholder')}
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
          <View className={isRTL ? 'items-start' : 'items-end'}>
            <Pressable onPress={() => router.push('/(auth)/reset-password')}>
              <Text className="text-sm font-jakarta-bold text-primary-900">
                {t('forgotPassword')}
              </Text>
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
              <Text className="text-white font-jakarta-bold text-lg">
                {t('continue')}
              </Text>
            )}
          </Pressable>

          {/* Encryption Banner */}
          <View className={`bg-primary-50 h-12 rounded-xl items-center justify-center px-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <ShieldIcon size={20} color="primary.900" />
            <Text className={`flex-1 text-[11px] font-jakarta-bold text-primary-900 ${isRTL ? 'mr-2 text-right' : 'ml-2 text-left'}`}>
              {t('encryptionNotice')}
            </Text>
          </View>

          {/* Sign Up Link */}
          <View className={`justify-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Text className="text-sm font-inter-regular text-text2-500">
              {t('dontHaveAccount')}
            </Text>
            <Pressable
              className={isRTL ? 'mr-1' : 'ml-1'}
              onPress={() => router.replace('/(auth)/register')}
            >
              <Text className="text-sm font-jakarta-bold text-primary-900">
                {t('signUpFree')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}