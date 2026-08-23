import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { colors } from '@/lib/theme/colors';
import { ArrowLeft02Icon } from '@/components/icons/ArrowLeft02Icon';
import { Alert01Icon } from '@/components/icons/Alert01Icon';
import { Delete02Icon } from '@/components/icons/Delete02Icon';
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon';
import { clearTokens } from '@/lib/api';

export default function DeleteAccountScreen() {
  const { t, i18n } = useTranslation('profile');
  const isRTL = i18n.language === 'ar';
  const [understood, setUnderstood] = useState(false);

  const handleDelete = async () => {
    if (!understood) return;
    await clearTokens();
    router.replace('/(auth)/register');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {/* Header */}
      <View className={`flex-row items-center px-6 mt-2 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Pressable
          accessibilityLabel={t('profileScreens.deleteAccount.backToPrivacy')}
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
        <Text className={`text-[22px] font-jakarta-bold text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.deleteAccount.title')}</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Warning Icon and Title */}
        <View className="items-center mb-8">
          <View className="w-[60px] h-[60px] rounded-full bg-danger-50 items-center justify-center mb-6">
            <Alert01Icon size={28} color={colors.danger.DEFAULT} />
          </View>
          <Text className={`text-[26px] font-jakarta-bold text-primary-900 ${isRTL ? 'self-stretch text-right' : ''}`}>{t('profileScreens.deleteAccount.confirmTitle')}</Text>
        </View>

        {/* Checkbox Card */}
        <View className="bg-surface rounded-[28px] border border-bg-600 p-6 mb-6 shadow-sm">
          <Text className={`text-[13px] font-inter-regular text-text2-500 leading-5 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('profileScreens.deleteAccount.warning')}
          </Text>

          <View className="h-[1px] bg-bg-600/40 mb-6" />

          <Pressable
            className={`flex-row items-start ${isRTL ? 'flex-row-reverse' : ''}`}
            onPress={() => setUnderstood(!understood)}
          >
            <View className={`w-5 h-5 rounded-[4px] border-[1.5px] items-center justify-center mt-0.5 ${isRTL ? 'ml-4' : 'mr-4'} ${understood ? 'bg-primary-900 border-primary-900' : 'bg-surface border-bg-600'}`}>
              {understood && <Text className="text-surface text-[10px] font-bold">✓</Text>}
            </View>
            <Text className={`flex-1 text-[13px] font-inter-medium text-text2-500 leading-5 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('profileScreens.deleteAccount.acknowledgement')}
            </Text>
          </Pressable>
        </View>

        {/* Info Card */}
        <View className={`bg-surface rounded-[20px] p-5 flex-row items-start mb-8 border border-bg-600 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <View className={`${isRTL ? 'ml-3' : 'mr-3'} mt-0.5`}>
            <InfoCircleIcon size={20} color={colors.text2[500]} />
          </View>
          <Text className={`flex-1 text-[13px] font-inter-regular text-text2-500 leading-5 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('profileScreens.deleteAccount.retentionNotice')}
          </Text>
        </View>

        {/* Action Buttons */}
        <Pressable
          className={`flex-row h-14 rounded-3xl items-center justify-center mb-4 ${isRTL ? 'flex-row-reverse' : ''} ${understood ? 'bg-danger-50' : 'bg-danger-50 opacity-50'}`}
          onPress={handleDelete}
          disabled={!understood}
          style={({ pressed }) => ({
            opacity: understood && pressed ? 0.8 : understood ? 1 : 0.5,
          })}
        >
          <Delete02Icon size={20} color={colors.danger.DEFAULT} className={isRTL ? "ml-2" : "mr-2"} />
          <Text className="font-jakarta-bold text-[15px] text-danger-500">{t('profileScreens.deleteAccount.title')}</Text>
        </Pressable>

        <Pressable
          className="bg-bg-600 h-14 rounded-3xl items-center justify-center mb-8"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-primary-900 font-jakarta-bold text-[15px]">{t('profileScreens.deleteAccount.cancel')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
