import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

// Import all locales
import enOnboarding from './EN/onboarding.json';
import arOnboarding from './AR/onboarding.json';
import enOnboarding2 from './EN/onboarding2.json';
import arOnboarding2 from './AR/onboarding2.json';
import enOnboarding3 from './EN/onboarding3.json';
import arOnboarding3 from './AR/onboarding3.json';
import enCommon from './EN/common.json';
import arCommon from './AR/common.json';
import enAdd from './EN/add.json';
import arAdd from './AR/add.json';
import enHome from './EN/home.json';
import arHome from './AR/home.json';

const resources = {
  en: {
    onboarding: enOnboarding,
    onboarding2: enOnboarding2,
    onboarding3: enOnboarding3,
    common: enCommon,
    add: enAdd,
    home: enHome,
  },
  ar: {
    onboarding: arOnboarding,
    onboarding2: arOnboarding2,
    onboarding3: arOnboarding3,
    common: arCommon,
    add: arAdd,
    home: arHome,
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
  }
};

export const getStoredLanguage = async () => {
  return (await AsyncStorage.getItem(LANGUAGE_KEY)) || 'auto';
};

export default i18n;
