import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { colors } from '@/lib/theme/colors';
import { ArrowLeft02Icon } from '@/components/icons/ArrowLeft02Icon';
import { ShieldIcon } from '@/components/icons/ShieldIcon';

export default function PrivacyScreen() {
  const { t, i18n } = useTranslation('profile');
  const isRTL = i18n.language === 'ar';

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

      <ScrollView 
        className="flex-1 px-6 mt-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }}
      >
        {/* HIPAA Compliance Card */}
        <View className="bg-surface rounded-[32px] border border-bg-600 items-center p-8 shadow-sm">
          <View className="w-16 h-16 rounded-full bg-primary-900 items-center justify-center mb-4">
            <ShieldIcon size={28} color={colors.surface.DEFAULT} />
          </View>
          <Text className={`w-full text-[17px] font-jakarta-bold text-primary-900 mb-2 ${isRTL ? 'text-right' : 'text-center'}`}>{t('profileScreens.privacy.hipaaTitle')}</Text>
          <Text className={`w-full text-[13px] font-inter-regular text-text2-500 leading-5 ${isRTL ? 'text-right' : 'text-center'}`}>
            {t('profileScreens.privacy.hipaaDescription')}
          </Text>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
