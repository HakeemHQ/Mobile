import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { InputField } from '../../components/ui/InputField';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../../lib/api';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';
import { User02Icon } from '../../components/icons/User02Icon';
import { Mail01Icon } from '../../components/icons/Mail01Icon';
import { Call02Icon } from '../../components/icons/Call02Icon';
import { LockOpenIcon } from '../../components/icons/LockOpenIcon';
import { EyeOffIcon } from '../../components/icons/EyeOffIcon';
import { ViewIcon } from '../../components/icons/ViewIcon';
import { Calendar03Icon } from '../../components/icons/Calendar03Icon';
import { MaleIcon } from '../../components/icons/MaleIcon';
import { FemaleIcon } from '../../components/icons/FemaleIcon';

export default function RegisterScreen() {
  const { t, i18n } = useTranslation('auth');
  const isRTL = i18n.language === 'ar';

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      nationalId: '',
      birthDate: '',
      password: '',
      gender: '',
      isChecked: false
    }
  });

  const onSubmit = async (data: any) => {
    setGlobalError('');
    setIsLoading(true);

    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          birthDate: data.birthDate,
          nationalId: data.nationalId
        }),
      });

      if (response.success) {
        Alert.alert(t('success'), t('accountCreatedSuccess'), [
          { text: t('ok'), onPress: () => router.replace('/(auth)/login') }
        ]);
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
          } else if (propName.includes('first')) {
            setError('firstName', { type: 'server', message: err.message });
          } else if (propName.includes('last')) {
            setError('lastName', { type: 'server', message: err.message });
          } else if (propName.includes('phone')) {
            setError('phoneNumber', { type: 'server', message: err.message });
          } else if (propName.includes('national')) {
            setError('nationalId', { type: 'server', message: err.message });
          } else if (propName.includes('birth')) {
            setError('birthDate', { type: 'server', message: err.message });
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
      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <Pressable
          accessibilityLabel={t('goBack')}
          accessibilityRole="button"
          className="w-10 h-10 rounded-full border border-bg-600 items-center justify-center mb-6"
          onPress={() => router.back()}
        >
          <ArrowLeft02Icon size={20} color="primary.900" />
        </Pressable>

        {/* Header */}
        <Text className={`text-[28px] font-jakarta-bold text-primary-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('createAccountTitle')}
        </Text>

        <Text className={`text-sm font-inter-regular text-text2-500 ${globalError ? 'mb-2' : 'mb-8'} ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('createAccountSubtitle')}
        </Text>

        {globalError ? (
          <Text className={`text-sm font-inter-regular text-red-500 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            {globalError}
          </Text>
        ) : null}

        <View className={`justify-between w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <View className={`flex-1 ${isRTL ? 'ml-2' : 'mr-2'}`}>
            <Controller
              control={control}
              name="firstName"
              rules={{ required: t('required') }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  label={t('firstName')}
                  icon={User02Icon}
                  placeholder={t('firstNamePlaceholder')}
                  value={value}
                  onChangeText={onChange}
                  error={errors.firstName?.message as string}
                  bgClassName="bg-primary-50"
                />
              )}
            />
          </View>

          <View className={`flex-1 ${isRTL ? 'mr-2' : 'ml-2'}`}>
            <Controller
              control={control}
              name="lastName"
              rules={{ required: t('required') }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  label={t('lastName')}
                  icon={User02Icon}
                  placeholder={t('lastNamePlaceholder')}
                  value={value}
                  onChangeText={onChange}
                  error={errors.lastName?.message as string}
                  bgClassName="bg-primary-50"
                />
              )}
            />
          </View>
        </View>

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
              bgClassName="bg-primary-50"
            />
          )}
        />

        {/* Gender Selection */}
        <Controller
          control={control}
          name="gender"
          rules={{ required: t('genderRequired') }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <Text className={`text-xs font-jakarta-medium text-text-500 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('gender')}
              </Text>

              <View className={`justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <Pressable
                  onPress={() => onChange('Male')}
                  className={`flex-1 h-14 rounded-2xl items-center justify-center border ${isRTL ? 'flex-row-reverse ml-2' : 'flex-row mr-2'} ${value === 'Male' ? 'bg-primary-50 border-primary-900' : errors.gender ? 'bg-bg border-red-500' : 'bg-bg border-transparent'}`}
                >
                  <MaleIcon
                    size={20}
                    color={value === 'Male' ? 'primary-900' : 'text-text-500'}
                    className={isRTL ? 'ml-2' : 'mr-2'}
                  />
                  <Text className={`text-base font-inter-regular ${value === 'Male' ? 'text-primary-900 font-inter-bold' : 'text-text-500'}`}>
                    {t('male')}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => onChange('Female')}
                  className={`flex-1 h-14 rounded-2xl items-center justify-center border ${isRTL ? 'flex-row-reverse mr-2' : 'flex-row ml-2'} ${value === 'Female' ? 'bg-primary-50 border-primary-900' : errors.gender ? 'bg-bg border-red-500' : 'bg-bg border-transparent'}`}
                >
                  <FemaleIcon
                    size={20}
                    color={value === 'Female' ? 'text2-500' : 'text-text-500'}
                    className={isRTL ? 'ml-2' : 'mr-2'}
                  />
                  <Text className={`text-base font-inter-regular ${value === 'Female' ? 'text-primary-900 font-inter-bold' : 'text-text-500'}`}>
                    {t('female')}
                  </Text>
                </Pressable>
              </View>

              {errors.gender ? (
                <Text className={`text-xs font-inter-regular text-red-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {errors.gender.message as string}
                </Text>
              ) : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="nationalId"
          rules={{ required: t('nationalIdRequired') }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label={t('nationalId')}
              icon={User02Icon}
              placeholder={t('nationalIdPlaceholder')}
              keyboardType="number-pad"
              value={value}
              onChangeText={onChange}
              error={errors.nationalId?.message as string}
              bgClassName="bg-primary-50"
            />
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <InputField
              label={t('phoneOptional')}
              icon={Call02Icon}
              placeholder={t('phonePlaceholder')}
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              error={errors.phoneNumber?.message as string}
              bgClassName="bg-primary-50"
            />
          )}
        />

        <Controller
          control={control}
          name="birthDate"
          rules={{ required: t('birthDateRequired') }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                  <InputField
                    label={t('birthDate')}
                    icon={Calendar03Icon}
                    placeholder={t('birthDatePlaceholder')}
                    value={value}
                    error={errors.birthDate?.message as string}
                    editable={false}
                    bgClassName="bg-primary-50"
                  />
                </View>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') {
                      setShowDatePicker(false);
                    }

                    if (selectedDate) {
                      // Format to YYYY-MM-DD
                      const formattedDate = selectedDate.toISOString().split('T')[0];
                      onChange(formattedDate);
                    }
                  }}
                />
              )}

              {Platform.OS === 'ios' && showDatePicker && (
                <Pressable
                  className="bg-primary-100 rounded-xl py-2 px-4 self-end mb-4 mr-2"
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text className="text-primary-900 font-jakarta-bold">
                    {t('done')}
                  </Text>
                </Pressable>
              )}
            </View>
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
              bgClassName="bg-primary-50"
            />
          )}
        />

        {/* Terms and Conditions */}
        <Controller
          control={control}
          name="isChecked"
          rules={{ required: t('termsRequired') }}
          render={({ field: { onChange, value } }) => (
            <View className={`mt-2 mb-8 ${isRTL ? 'pl-4' : 'pr-4'}`}>
              <Pressable
                className={`items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                onPress={() => onChange(!value)}
              >
                <View
                  className={`w-5 h-5 rounded-md border-2 items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'} ${value ? 'bg-primary-900 border-primary-900' : errors.isChecked ? 'border-red-500' : 'border-text2-200'}`}
                >
                  {value && <Text className="text-white text-xs">✓</Text>}
                </View>

                <Text className={`text-sm font-inter-regular text-text2-500 leading-5 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('termsPrefix')}
                  <Text className="font-inter-bold text-primary-900">
                    {t('termsOfService')}
                  </Text>
                  {t('termsAnd')}
                  <Text className="font-inter-bold text-primary-900">
                    {t('privacyPolicy')}
                  </Text>
                  {t('termsSuffix')}
                </Text>
              </Pressable>

              {errors.isChecked ? (
                <Text className={`text-xs font-inter-regular text-red-500 mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {errors.isChecked.message as string}
                </Text>
              ) : null}
            </View>
          )}
        />

        {/* Create Account Button */}
        <Pressable
          className={`bg-primary h-14 rounded-2xl items-center justify-center mb-6 ${isLoading ? 'opacity-70' : ''}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-jakarta-bold text-lg">
              {t('createAccountButton')}
            </Text>
          )}
        </Pressable>

        {/* Sign In Link */}
        <View className={`justify-center pb-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Text className="text-sm font-inter-regular text-text2-500">
            {t('alreadyHaveAccount')}
          </Text>

          <Pressable
            className={isRTL ? 'mr-1' : 'ml-1'}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text className="text-sm font-jakarta-bold text-primary-900">
              {t('signIn')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}