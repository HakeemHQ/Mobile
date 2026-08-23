import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../../lib/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';
import { Mail01Icon } from '../../components/icons/Mail01Icon';

function InputField({
  label,
  icon: Icon,
  placeholder,
  keyboardType = 'default',
  value,
  onChangeText,
  autoCapitalize,
  error
}: any) {
  const { i18n } = useTranslation('auth');
  const isRTL = i18n.language === 'ar';

  return (
    <View className="mb-4 mt-6">
      <Text className={`text-[10px] font-jakarta-bold text-text-500 mb-2 uppercase ${isRTL ? 'text-right' : 'text-left'}`}>
        {label}
      </Text>

      <View className={`items-center bg-primary-50 rounded-2xl px-4 h-14 ${isRTL ? 'flex-row-reverse' : 'flex-row'} ${error ? 'border border-red-500' : 'border border-transparent'}`}>
        <Icon size={20} color="text2.500" />

        <TextInput
          className={`flex-1 text-base font-inter-regular text-text-500 placeholder:text-text2-400 ${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'}`}
          placeholder={placeholder}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
        />
      </View>

      {error ? (
        <Text className={`text-xs font-inter-regular text-red-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export default function ResetPasswordScreen() {
  const { t, i18n } = useTranslation('auth');
  const isRTL = i18n.language === 'ar';

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: any) => {
    setGlobalError('');
    setIsLoading(true);

    try {
      await apiFetch('/auth/password-reset/request', {
        method: 'POST',
        body: JSON.stringify({ email: data.email }),
      });

      Alert.alert(t('success'), t('resetLinkSuccess'), [
        { text: t('ok'), onPress: () => router.back() }
      ]);
    } catch (error: any) {
      if (error.errorList && error.errorList.length > 0) {
        error.errorList.forEach((err: any) => {
          const propName = (err.propertyName || '').toLowerCase();

          if (propName.includes('email')) {
            setError('email', { type: 'server', message: err.message });
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
      {/* Back Button */}
      <View className="px-6 pt-2">
        <Pressable
          accessibilityLabel={t('goBack')}
          accessibilityRole="button"
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
          <View className="w-12 h-12 bg-primary-50 rounded-xl items-center justify-center mb-6">
            <Mail01Icon size={24} color="primary.900" />
          </View>

          {/* Header */}
          <Text className={`text-[28px] font-jakarta-bold text-primary-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('resetPasswordTitle')}
          </Text>

          <Text className={`text-sm font-inter-regular text-text2-500 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('resetPasswordSubtitle')}
          </Text>

          {globalError ? (
            <Text className={`text-sm font-inter-regular text-red-500 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {globalError}
            </Text>
          ) : null}

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
                autoCapitalize="none"
                error={errors.email?.message as string}
              />
            )}
          />

          {/* Send Reset Link Button */}
          <Pressable
            className={`bg-primary h-14 rounded-2xl items-center justify-center mb-8 ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-jakarta-bold text-lg">
                {t('sendResetLink')}
              </Text>
            )}
          </Pressable>

          {/* Warning Box */}
          <View className="bg-[#FFF8EA] rounded-2xl p-4 flex-row">
            <Text className={`text-xs font-inter-regular text-[#9F6B20] leading-5 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Text className="font-inter-bold">
                {t('dontSeeEmail')}{' '}
              </Text>
              {t('checkSpam')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}