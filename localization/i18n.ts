import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

// Import all locales
import enOnboarding from './EN/onboarding.json';
import arOnboarding from './AR/onboarding.json';
import enCommon from './EN/common.json';
import arCommon from './AR/common.json';

const resources = {
  en: {
    onboarding: enOnboarding,
    common: enCommon,
  },
  ar: {
    onboarding: arOnboarding,
    common: arCommon,
  },
};

const LANGUAGE_KEY = 'APP_LANGUAGE';

// Get system language or fallback to en
const getSystemLanguage = () => {
  const locales = Localization.getLocales();
  const systemLanguage = locales[0]?.languageCode;
  return systemLanguage === 'ar' ? 'ar' : 'en';
};

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLanguage) {
        if (storedLanguage === 'auto') {
          callback(getSystemLanguage());
        } else {
          callback(storedLanguage);
        }
      } else {
        // Default to auto (system language)
        callback(getSystemLanguage());
      }
    } catch (error) {
      console.log('Error reading language', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false, 
    },
  });

export const setLanguage = async (lng: 'ar' | 'en' | 'auto') => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lng);
  const targetLanguage = lng === 'auto' ? getSystemLanguage() : lng;
  i18n.changeLanguage(targetLanguage);
  
  // Handle RTL for Arabic
  const isRTL = targetLanguage === 'ar';
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    // Reload the app to apply RTL changes
   
  }
};

export const getStoredLanguage = async () => {
  return (await AsyncStorage.getItem(LANGUAGE_KEY)) || 'auto';
};

export default i18n;
