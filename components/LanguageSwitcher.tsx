import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { setLanguage, getStoredLanguage } from '../localization/i18n';

export default function LanguageSwitcher() {
  const { t } = useTranslation('common');
  const [activeLang, setActiveLang] = useState<string>('auto');

  useEffect(() => {
    getStoredLanguage().then(setActiveLang);
  }, []);

  const handleLanguageChange = async (lng: 'ar' | 'en' | 'auto') => {
    await setLanguage(lng);
    setActiveLang(lng);
  };

  const buttons: { id: 'auto' | 'ar' | 'en'; label: string }[] = [
    { id: 'auto', label: t('auto') },
    { id: 'ar', label: t('arabic') },
    { id: 'en', label: t('english') },
  ];

  return (
    <View className="flex-row items-center gap-1 bg-gray-100 p-1 rounded-xl">
      {buttons.map((btn) => {
        const isActive = activeLang === btn.id;
        return (
          <Pressable
            key={btn.id}
            onPress={() => handleLanguageChange(btn.id)}
            className={`px-3 py-1.5 rounded-lg ${isActive ? 'bg-primary-800' : 'bg-transparent'}`}
          >
            <Text
              className={`font-inter-semibold text-sm ${isActive ? 'text-white' : 'text-primary-900'}`}
            >
              {btn.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
