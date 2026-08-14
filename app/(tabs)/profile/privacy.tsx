import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { colors } from '@/lib/theme/colors';
import { ArrowLeft02Icon } from '@/components/icons/ArrowLeft02Icon';
import { LockIcon } from '@/components/icons/LockIcon';
import { FaceIdIcon } from '@/components/icons/FaceIdIcon';
import { SecurityCheckIcon } from '@/components/icons/SecurityCheckIcon';
import { LaptopIcon } from '@/components/icons/LaptopIcon';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { ShieldIcon } from '@/components/icons/ShieldIcon';
import { Delete02Icon } from '@/components/icons/Delete02Icon';
import { Alert01Icon } from '@/components/icons/Alert01Icon';

export default function PrivacyScreen() {
  const { t, i18n } = useTranslation('profile');
  const isRTL = i18n.language === 'ar';
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {/* Header */}
      <View className={`flex-row items-center px-6 mt-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Pressable
          accessibilityLabel={t('profileScreens.privacy.backToProfile')}
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
        <Text className={`text-[22px] font-jakarta-bold text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.privacy.title')}</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* PASSWORD */}
        <Text className={`text-xs font-jakarta-bold text-text2-500 mb-3 uppercase tracking-wider ${isRTL ? 'mr-2 text-right' : 'ml-2 text-left'}`}>{t('profileScreens.privacy.passwordSection')}</Text>
        <Pressable
          onPress={() => router.push('/profile/change-password')}
          className={`bg-surface rounded-[28px] border border-bg-600 flex-row items-center px-5 py-[18px] mb-8 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.bg[100] : colors.surface.DEFAULT,
          })}
        >
          <View className={`w-12 h-12 rounded-[18px] bg-primary-50 items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
            <LockIcon size={22} color={colors.primary[900]} />
          </View>
          <View className="flex-1">
            <Text className={`text-[15px] font-jakarta-semibold text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.privacy.changePassword')}</Text>
            <Text className={`text-[12px] font-inter-regular text-text2-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.privacy.lastChanged')}</Text>
          </View>
          <View
            style={
              isRTL
                ? {
                  transform: [{ scaleX: -1 }],
                }
                : undefined
            }
          >
            <ChevronRightIcon size={20} color={colors.text2[500]} />
          </View>
        </Pressable>

        {/* AUTHENTICATION */}
        <Text className={`text-xs font-jakarta-bold text-text2-500 mb-3 uppercase tracking-wider ${isRTL ? 'mr-2 text-right' : 'ml-2 text-left'}`}>{t('profileScreens.privacy.authenticationSection')}</Text>
        <View className="bg-surface rounded-[28px] border border-bg-600 overflow-hidden mb-8 shadow-sm">
          <View className={`flex-row items-center px-5 py-[18px] border-b border-bg-600/40 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <View className={`w-12 h-12 rounded-[18px] bg-primary-50 items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
              <FaceIdIcon size={22} color={colors.primary[900]} />
            </View>
            <Text className={`flex-1 text-[15px] font-jakarta-semibold text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.privacy.biometrics')}</Text>
            <Switch
              value={faceIdEnabled}
              onValueChange={setFaceIdEnabled}
              trackColor={{ false: colors.bg[600], true: colors.primary[900] }}
              thumbColor={colors.surface.DEFAULT}
            />
          </View>
          <View className={`flex-row items-center px-5 py-[18px] ${isRTL ? 'flex-row-reverse' : ''}`}>
            <View className={`w-12 h-12 rounded-[18px] bg-primary-50 items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
              <SecurityCheckIcon size={22} color={colors.primary[900]} />
            </View>
            <View className="flex-1">
              <Text className={`text-[15px] font-jakarta-semibold text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.privacy.twoFactor')}</Text>
              <Text className={`text-[12px] font-inter-regular text-text2-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.privacy.twoFactorDescription')}</Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: colors.bg[600], true: colors.primary[900] }}
              thumbColor={colors.surface.DEFAULT}
            />
          </View>
        </View>

        {/* SESSION */}
        <Text className={`text-xs font-jakarta-bold text-text2-500 mb-3 uppercase tracking-wider ${isRTL ? 'mr-2 text-right' : 'ml-2 text-left'}`}>{t('profileScreens.privacy.sessionSection')}</Text>
        <Pressable
          className={`bg-surface rounded-[28px] border border-bg-600 flex-row items-center px-5 py-[18px] mb-8 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.bg[100] : colors.surface.DEFAULT,
          })}
        >
          <View className={`w-12 h-12 rounded-[18px] bg-primary-50 items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
            <LaptopIcon size={22} color={colors.primary[900]} />
          </View>
          <View className="flex-1">
            <Text className={`text-[15px] font-jakarta-semibold text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.privacy.manageDevices')}</Text>
            <Text className={`text-[12px] font-inter-regular text-text2-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.privacy.activeSessions')}</Text>
          </View>
          <View
            style={
              isRTL
                ? {
                  transform: [{ scaleX: -1 }],
                }
                : undefined
            }
          >
            <ChevronRightIcon size={20} color={colors.text2[500]} />
          </View>
        </Pressable>

        {/* HIPAA Compliance Card */}
        <View className="bg-surface rounded-[32px] border border-bg-600 items-center p-8 mb-8 shadow-sm">
          <View className="w-16 h-16 rounded-full bg-primary-900 items-center justify-center mb-4">
            <ShieldIcon size={28} color={colors.surface.DEFAULT} />
          </View>
          <Text className={`w-full text-[17px] font-jakarta-bold text-primary-900 mb-2 ${isRTL ? 'text-right' : 'text-center'}`}>{t('profileScreens.privacy.hipaaTitle')}</Text>
          <Text className={`w-full text-[13px] font-inter-regular text-text2-500 leading-5 ${isRTL ? 'text-right' : 'text-center'}`}>
            {t('profileScreens.privacy.hipaaDescription')}
          </Text>
        </View>

        {/* Delete Account */}
        <Pressable
          onPress={() => router.push('/profile/delete-account')}
          className={`bg-danger-50 rounded-[28px] border border-danger-200 flex-row items-center px-5 py-5 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View className={`w-12 h-12 rounded-[18px] bg-danger-100 items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
            <Delete02Icon size={22} color={colors.danger.DEFAULT} />
          </View>
          <View className="flex-1">
            <Text className={`text-[15px] font-jakarta-bold text-danger ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.privacy.deleteAccount')}</Text>
            <Text className={`text-[12px] font-inter-regular text-gray-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.privacy.deleteDescription')}</Text>
          </View>
          <Alert01Icon size={22} color={colors.danger.DEFAULT} />
        </Pressable>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
