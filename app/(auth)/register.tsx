import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { InputField } from '../../components/ui/InputField';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
        }),
      });

      if (response.success) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') }
        ]);
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
          } else if (propName.includes('first')) {
            setError('firstName', { type: 'server', message: err.message });
          } else if (propName.includes('last')) {
            setError('lastName', { type: 'server', message: err.message });
          } else if (propName.includes('phone')) {
            setError('phoneNumber', { type: 'server', message: err.message });
          } else if (propName.includes('birth')) {
            setError('birthDate', { type: 'server', message: err.message });
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
        <Text className={`text-sm font-inter-regular text-text2-500 ${globalError ? 'mb-2' : 'mb-8'}`}>
          Start organizing your medical history for free
        </Text>
        {globalError ? (
          <Text className="text-sm font-inter-regular text-red-500 mb-8">{globalError}</Text>
        ) : null}

        <View className="flex-row justify-between w-full">
          <View className="flex-1 mr-2">
            <Controller
              control={control}
              name="firstName"
              rules={{ required: 'Required' }}
              render={({ field: { onChange, value } }) => (
                <InputField 
                  label="First Name" 
                  icon={User02Icon} 
                  placeholder="Youssef"
                  value={value}
                  onChangeText={onChange}
                  error={errors.firstName?.message as string}
                />
              )}
            />
          </View>
          <View className="flex-1 ml-2">
            <Controller
              control={control}
              name="lastName"
              rules={{ required: 'Required' }}
              render={({ field: { onChange, value } }) => (
                <InputField 
                  label="Last Name" 
                  icon={User02Icon} 
                  placeholder="Tarek"
                  value={value}
                  onChangeText={onChange}
                  error={errors.lastName?.message as string}
                />
              )}
            />
          </View>
        </View>

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
              autoCapitalize="none"
              error={errors.email?.message as string}
            />
          )}
        />

        {/* Gender Selection */}
        <Controller
          control={control}
          name="gender"
          rules={{ required: 'Gender is required' }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <Text className="text-xs font-jakarta-medium text-text-500 mb-2">Gender</Text>
              <View className="flex-row justify-between">
                <Pressable 
                  onPress={() => onChange('Male')}
                  className={`flex-1 h-14 rounded-2xl flex-row items-center justify-center mr-2 border ${value === 'Male' ? 'bg-[#D1F1E3] border-secondary-900' : errors.gender ? 'bg-bg border-red-500' : 'bg-bg border-transparent'}`}
                >
                  <MaleIcon size={20} color={value === 'Male' ? '#111827' : '#6B7280'} className="mr-2" />
                  <Text className={`text-base font-inter-regular ${value === 'Male' ? 'text-secondary-900 font-inter-bold' : 'text-text-500'}`}>Male</Text>
                </Pressable>
                <Pressable 
                  onPress={() => onChange('Female')}
                  className={`flex-1 h-14 rounded-2xl flex-row items-center justify-center ml-2 border ${value === 'Female' ? 'bg-[#D1F1E3] border-secondary-900' : errors.gender ? 'bg-bg border-red-500' : 'bg-bg border-transparent'}`}
                >
                  <FemaleIcon size={20} color={value === 'Female' ? '#111827' : '#6B7280'} className="mr-2" />
                  <Text className={`text-base font-inter-regular ${value === 'Female' ? 'text-secondary-900 font-inter-bold' : 'text-text-500'}`}>Female</Text>
                </Pressable>
              </View>
              {errors.gender ? (
                <Text className="text-xs font-inter-regular text-red-500 mt-1">{errors.gender.message as string}</Text>
              ) : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <InputField 
              label="Phone (OPTIONAL)" 
              icon={Call02Icon} 
              placeholder="0123 456 7890" 
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              error={errors.phoneNumber?.message as string}
            />
          )}
        />
        <Controller
          control={control}
          name="birthDate"
          rules={{ required: 'Birth date is required' }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                  <InputField 
                    label="Birth Date" 
                    icon={Calendar03Icon} 
                    placeholder="YYYY-MM-DD" 
                    value={value}
                    error={errors.birthDate?.message as string}
                    editable={false}
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
                  className="bg-secondary-100 rounded-xl py-2 px-4 self-end mb-4 mr-2" 
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text className="text-secondary-900 font-jakarta-bold">Done</Text>
                </Pressable>
              )}
            </View>
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
            />
          )}
        />

        {/* Terms and Conditions */}
        <Controller
          control={control}
          name="isChecked"
          rules={{ required: 'You must agree to the Terms of Service' }}
          render={({ field: { onChange, value } }) => (
            <View className="mt-2 mb-8 pr-4">
              <Pressable 
                className="flex-row items-center"
                onPress={() => onChange(!value)}
              >
                <View 
                  className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${value ? 'bg-secondary-900 border-secondary-900' : errors.isChecked ? 'border-red-500' : 'border-text2-200'}`}
                >
                  {value && <Text className="text-white text-xs">✓</Text>}
                </View>
                <Text className="text-sm font-inter-regular text-text2-500 leading-5 flex-1">
                  I agree to Hakeem's <Text className="font-inter-bold text-secondary-900">Terms of Service</Text> and <Text className="font-inter-bold text-secondary-900">Privacy Policy.</Text> My data is never sold or used for advertising.
                </Text>
              </Pressable>
              {errors.isChecked ? (
                <Text className="text-xs font-inter-regular text-red-500 mt-2">{errors.isChecked.message as string}</Text>
              ) : null}
            </View>
          )}
        />

        {/* Create Account Button */}
        <Pressable 
          className={`bg-secondary-900 h-14 rounded-2xl items-center justify-center mb-6 ${isLoading ? 'opacity-70' : ''}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-jakarta-bold text-lg">Create Account</Text>
          )}
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
