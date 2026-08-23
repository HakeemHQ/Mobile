import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { colors } from '@/lib/theme/colors';
import { ArrowLeft02Icon } from '@/components/icons/ArrowLeft02Icon';
import { LockOpenIcon } from '@/components/icons/LockOpenIcon';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { SecurityCheckIcon } from '@/components/icons/SecurityCheckIcon';
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { ViewIcon } from '@/components/icons/ViewIcon';
import { InputField } from '@/components/ui/InputField';

export default function ChangePasswordScreen() {
  const { t, i18n } = useTranslation('profile');
  const isRTL = i18n.language === 'ar';
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {/* Header */}
      <View className={`flex-row items-center px-6 mt-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Pressable
          accessibilityLabel={t('profileScreens.changePassword.backToPrivacy')}
          accessibilityRole="button"
          className={`w-10 h-10 rounded-full border border-bg-600 items-center justify-center bg-surface ${isRTL ? 'ml-4' : 'mr-4'}`}
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <View
            style={
              isRTL
                ? {
                  transform: [{ scaleX: -1 }],
                }
                : undefined
            }
          >
            <ArrowLeft02Icon size={20} color={colors.text[800]} />
          </View>
        </Pressable>
        <Text className={`text-[22px] font-jakarta-bold text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.changePassword.title')}</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Banner Card */}
        <View className="bg-primary rounded-[28px] py-8 px-6 items-center justify-center mb-8">
          <View className="w-[65px] h-[65px] rounded-full bg-primary-400 items-center justify-center mb-4">
            <View className="w-10 h-10 rounded-full bg-surface items-center justify-center">
              <SecurityCheckIcon size={20} color={colors.primary[900]} />
            </View>
          </View>
          <Text className={`text-[13px] font-inter-medium text-surface/70 leading-5 px-4 ${isRTL ? 'self-stretch text-right' : 'text-center'}`}>
            {t('profileScreens.changePassword.subtitle')}
          </Text>
        </View>

        {/* Form Fields */}
        <InputField
          label={t('profileScreens.changePassword.currentPassword')}
          icon={LockOpenIcon}
          placeholder={t('profileScreens.changePassword.currentPasswordPlaceholder')}
          secureTextEntry={!showCurrent}
          rightIcon={showCurrent ? ViewIcon : EyeOffIcon}
          onRightIconPress={() => setShowCurrent(!showCurrent)}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          bgClassName="bg-primary-50"
        />

        <InputField
          label={t('profileScreens.changePassword.newPassword')}
          icon={LockOpenIcon}
          placeholder={t('profileScreens.changePassword.newPasswordPlaceholder')}
          secureTextEntry={!showNew}
          rightIcon={showNew ? ViewIcon : EyeOffIcon}
          onRightIconPress={() => setShowNew(!showNew)}
          value={newPassword}
          onChangeText={setNewPassword}
          containerClassName="mb-1"
          bgClassName="bg-primary-50"
        />

        {/* Password Strength */}
        <View className={`flex-row items-center mt-2 mb-6 ${isRTL ? 'flex-row-reverse mr-2' : 'ml-2'}`}>
          <Text className={`text-[11px] font-inter-regular text-text2-500 ${isRTL ? 'ml-2 text-right' : 'mr-2 text-left'}`}>{t('profileScreens.changePassword.strengthNone')}</Text>
          <View className="flex-1 flex-row">
            <View className="flex-1 h-[3px] bg-bg-600 rounded-full mr-1" />
            <View className="flex-1 h-[3px] bg-bg-600 rounded-full mr-1" />
            <View className="flex-1 h-[3px] bg-bg-600 rounded-full mr-1" />
            <View className="flex-1 h-[3px] bg-bg-600 rounded-full" />
          </View>
        </View>

        <InputField
          label={t('profileScreens.changePassword.confirmNewPassword')}
          icon={SecurityCheckIcon}
          placeholder={t('profileScreens.changePassword.confirmNewPasswordPlaceholder')}
          secureTextEntry={!showNew}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          bgClassName="bg-primary-50"
        />

        {/* Info Box */}
        <View className={`bg-bg-500 rounded-[20px] p-5 flex-row items-start mb-8 border border-bg-600 mt-2 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <View className={`${isRTL ? 'ml-3' : 'mr-3'} mt-0.5`}>
            <InfoCircleIcon size={20} color={colors.text2[500]} />
          </View>
          <Text
            className={`flex-1 text-[12px] font-inter-regular text-text2-500 leading-5 ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ backgroundColor: 'transparent' }}
          >
            {t('profileScreens.changePassword.securityHint')}
          </Text>
        </View>

        {/* Update Button */}
        <Pressable
          className={`bg-primary h-[56px] rounded-[28px] flex-row items-center justify-center mb-8 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text className={`text-surface font-jakarta-bold text-[15px] ${isRTL ? 'ml-2' : 'mr-2'}`}>{t('profileScreens.changePassword.updatePassword')}</Text>
          <CheckCircleIcon size={20} color={colors.surface.DEFAULT} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
