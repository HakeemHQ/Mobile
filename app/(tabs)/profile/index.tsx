import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronRight, ChevronLeft } from 'lucide-react-native';

import { useProfileStore } from '@/store/useProfileStore';
import { ProfileSummaryCard } from '@/components/personal-info/ProfileSummaryCard';
import { logoutApi, clearTokens } from '@/lib/api';
import { colors } from '@/lib/theme/colors';
import { setLanguage, getStoredLanguage } from '@/localization/i18n';

import { User02Icon } from '@/components/icons/User02Icon';
import { SecurityCheckIcon } from '@/components/icons/SecurityCheckIcon';
import { Stethoscope02Icon } from '@/components/icons/Stethoscope02Icon';

type LanguageOption = 'auto' | 'ar' | 'en';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation('profile');
  const isRTL = i18n.language === 'ar';

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [activeLang, setActiveLang] = useState<LanguageOption>('auto');

  const profile = useProfileStore((state) => state.profile);
  const fetchStatus = useProfileStore((state) => state.fetchStatus);
  const fetchError = useProfileStore((state) => state.fetchError);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    void fetchProfile();
    getStoredLanguage().then((lang) => {
      setActiveLang(lang as LanguageOption);
    });
  }, [fetchProfile]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } finally {
      await clearTokens();
      router.replace('/(auth)/login');
    }
  };

  const handleSelectLanguage = async (lng: LanguageOption) => {
    setActiveLang(lng);
    setShowLanguageModal(false);
    await setLanguage(lng);
  };

  const getLanguageLabel = (code: LanguageOption) => {
    switch (code) {
      case 'ar':
        return t('profileScreens.index.language.arabicCode');
      case 'en':
        return t('profileScreens.index.language.englishCode');
      case 'auto':
      default:
        return t('languageModal.auto');
    }
  };

  const menuItems = [
    { key: 'personalInfo', title: t('menu.personalInfo'), icon: User02Icon, type: 'link', route: '/profile/personal-info' },
    { key: 'privacy', title: t('menu.privacy'), icon: SecurityCheckIcon, type: 'link', route: '/profile/privacy' },
    { key: 'language', title: t('menu.language'), icon: null, customIcon: Globe, type: 'action', action: () => setShowLanguageModal(true) },
    { key: 'helpSupport', title: t('menu.helpSupport'), icon: Stethoscope02Icon, type: 'link', route: '/profile/help' },
  ];

  const languageOptions: { id: LanguageOption; label: string; subLabel: string; flag: string }[] = [
    { id: 'en', label: t('profileScreens.index.language.english'), subLabel: t('profileScreens.index.language.englishUS'), flag: '🇺🇸' },
    { id: 'ar', label: t('profileScreens.index.language.arabic'), subLabel: t('profileScreens.index.language.arabicDescription'), flag: '🇸🇦' },
    { id: 'auto', label: t('languageModal.auto'), subLabel: t('profileScreens.index.language.systemLanguage'), flag: '🌐' },
  ];

  const isLoading = fetchStatus === 'loading' && !profile;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className={`text-[28px] font-jakarta-bold text-primary-900 mt-2 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('title')}
        </Text>

        {/* User Card */}
        {isLoading ? (
          <View className="bg-primary-900 rounded-[28px] p-6 mb-6 items-center justify-center min-h-[110px]">
            <ActivityIndicator size="small" color={colors.surface.DEFAULT} />
            <Text className={`text-surface/80 text-[12px] font-inter-regular mt-2 ${isRTL ? 'self-stretch text-right' : ''}`}>
              {t('loading')}
            </Text>
          </View>
        ) : profile ? (
          <ProfileSummaryCard profile={profile} />
        ) : (
          <View className={`bg-primary-900 rounded-[28px] p-5 flex-row items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <View className={`bg-primary-800 rounded-[20px] w-[68px] h-[68px] items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
              <Text className="text-surface text-2xl font-jakarta-bold">HK</Text>
            </View>
            <View className={`flex-1 ${isRTL ? 'items-end' : 'items-start'}`}>
              <Text className={`text-surface text-[17px] font-jakarta-bold ${isRTL ? 'text-right' : 'text-left'}`}>{t('profileScreens.index.fallbackUserName')}</Text>
              <Text className={`text-surface/70 text-[11px] font-inter-regular mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {fetchError || t('unableToLoad')}
              </Text>
            </View>
          </View>
        )}

        {/* Menu Items (All options grouped in one unified container) */}
        <View className="bg-surface rounded-[28px] border border-bg-600 overflow-hidden mb-6 shadow-sm">
          {menuItems.map((item, index) => {
            const isLast = index === menuItems.length - 1;
            const IconComponent = item.icon;
            const CustomIconComponent = item.customIcon;

            return (
              <Pressable
                key={item.key}
                onPress={() => {
                  if (item.type === 'action' && item.action) {
                    item.action();
                  } else if (item.route) {
                    router.push(item.route as any);
                  }
                }}
                className={`flex-row items-center px-5 py-[18px] ${isRTL ? 'flex-row-reverse' : ''} ${!isLast ? 'border-b border-bg-600/40' : ''
                  }`}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? colors.bg[100] : colors.surface.DEFAULT,
                })}
              >
                <View className={`w-[42px] h-[42px] rounded-full bg-primary-50 items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
                  {CustomIconComponent ? (
                    <CustomIconComponent size={20} color={colors.primary[900]} />
                  ) : IconComponent ? (
                    <IconComponent size={20} color={colors.primary[900]} />
                  ) : null}
                </View>

                <Text className={`flex-1 text-[15px] font-jakarta-semibold text-text-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {item.title}
                </Text>

                {item.key === 'language' && (
                  <View className={`bg-bg-600/40 px-2.5 py-1 rounded-lg ${isRTL ? 'ml-2' : 'mr-2'}`}>
                    <Text className={`text-[12px] font-jakarta-semibold text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {getLanguageLabel(activeLang)}
                    </Text>
                  </View>
                )}

                {isRTL ? (
                  <ChevronLeft size={20} color={colors.primary[900]} />
                ) : (
                  <ChevronRight size={20} color={colors.primary[900]} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Sign Out Button */}
        <Pressable
          className={`bg-surface border border-bg-600 h-[56px] rounded-[28px] items-center justify-center mb-6 shadow-sm ${isLoggingOut ? 'opacity-70' : ''
            }`}
          onPress={handleLogout}
          disabled={isLoggingOut}
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.bg[100] : colors.surface.DEFAULT,
          })}
        >
          {isLoggingOut ? (
            <ActivityIndicator color={colors.primary[900]} />
          ) : (
            <Text className="text-primary-900 font-jakarta-semibold text-[15px]">
              {t('signOut')}
            </Text>
          )}
        </Pressable>

        <Text className="text-center text-[11px] font-inter-regular text-text2-500 mb-8">
          {t('version')}
        </Text>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <Pressable
            className="absolute inset-0"
            onPress={() => setShowLanguageModal(false)}
          />
          <View className="bg-surface rounded-t-[32px] p-6 pb-10 border-t border-bg-600 shadow-2xl">
            {/* Header */}
            <View className="items-center mb-5">
              <View className="w-10 h-1.5 bg-bg-600/70 rounded-full mb-4" />
              <Text className={`text-[20px] font-jakarta-bold text-primary-900 mb-1 ${isRTL ? 'self-stretch text-right' : 'text-center'}`}>
                {t('languageModal.title')}
              </Text>
              <Text className={`text-[13px] font-inter-regular text-text2-500 ${isRTL ? 'self-stretch text-right' : 'text-center'}`}>
                {t('languageModal.subtitle')}
              </Text>
            </View>

            {/* Language Options */}
            <View className="mb-6">
              {languageOptions.map((opt, index) => {
                const isSelected = activeLang === opt.id;
                const isLast = index === languageOptions.length - 1;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => handleSelectLanguage(opt.id)}
                    className={`flex-row items-center p-4 rounded-2xl border ${!isLast ? 'mb-3' : ''
                      } ${isRTL ? 'flex-row-reverse' : ''
                      } ${isSelected
                        ? 'bg-primary-50/60 border-primary-800'
                        : 'bg-bg-600/20 border-bg-600/60'
                      }`}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Text className={`text-2xl ${isRTL ? 'ml-3' : 'mr-3'}`}>
                      {opt.flag}
                    </Text>
                    <View className={`flex-1 ${isRTL ? 'items-end' : 'items-start'}`}>
                      <Text
                        className={`text-[16px] font-jakarta-semibold ${isRTL ? 'text-right' : 'text-left'} ${isSelected ? 'text-primary-900' : 'text-text2-900'
                          }`}
                      >
                        {opt.label}
                      </Text>
                      <Text className={`text-[12px] font-inter-regular text-text2-500 mt-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {opt.subLabel}
                      </Text>
                    </View>
                    {isSelected && (
                      <View className="w-7 h-7 rounded-full bg-primary-800 items-center justify-center">
                        <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Close Button */}
            <Pressable
              onPress={() => setShowLanguageModal(false)}
              className="bg-bg-600/40 h-[50px] rounded-2xl items-center justify-center"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text className="text-primary-900 font-jakarta-semibold text-[15px]">
                {t('languageModal.cancel')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
