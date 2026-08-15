import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

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
import enProfile from './EN/profile.json';
import arProfile from './AR/profile.json';
import enTimeline from './EN/timeline.json';
import arTimeline from './AR/timeline.json';
import enMedicalCv from './EN/medical-cv.json';
import arMedicalCv from './AR/medical-cv.json';
import enReminders from './EN/reminders.json';
import arReminders from './AR/reminders.json';
import enAuth from './EN/auth.json';
import arAuth from './AR/auth.json';
import enTabs from './EN/tabs.json';
import arTabs from './AR/tabs.json';
import enChatbot from './EN/chatbot.json';
import arChatbot from './AR/chatbot.json';
import enAccessRequests from './EN/access-requests.json';
import arAccessRequests from './AR/access-requests.json';

const resources = {
  en: {
    onboarding: enOnboarding,
    onboarding2: enOnboarding2,
    onboarding3: enOnboarding3,
    common: enCommon,
    add: enAdd,
    home: enHome,
    profile: enProfile,
    timeline: enTimeline,
    medicalCv: enMedicalCv,
    reminders: enReminders,
    auth: enAuth,
    tabs: enTabs,
    chatbot: enChatbot,
    accessRequests: enAccessRequests,
  },
  ar: {
    onboarding: arOnboarding,
    onboarding2: arOnboarding2,
    onboarding3: arOnboarding3,
    common: arCommon,
    add: arAdd,
    home: arHome,
    profile: arProfile,
    timeline: arTimeline,
    medicalCv: arMedicalCv,
    reminders: arReminders,
    auth: arAuth,
    tabs: arTabs,
    chatbot: arChatbot,
    accessRequests: arAccessRequests,
  },
};

const LANGUAGE_KEY = 'APP_LANGUAGE';

// Get system language or fallback to en
const getSystemLanguage = (): 'ar' | 'en' => {
  try {
    const locales = Localization.getLocales();
    const firstLocale = locales[0];
    const langCode = (firstLocale?.languageCode || firstLocale?.languageTag || '').toLowerCase();
    return langCode.startsWith('ar') ? 'ar' : 'en';
  } catch (error) {
    return 'en';
  }
};

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLanguage && storedLanguage !== 'auto') {
        callback(storedLanguage.startsWith('ar') ? 'ar' : 'en');
      } else {
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
    resources: {
      ...resources,
      'ar-EG': resources.ar,
      'ar-SA': resources.ar,
      'ar-AE': resources.ar,
      'en-US': resources.en,
      'en-GB': resources.en,
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    defaultNS: 'reminders',
    fallbackNS: ['reminders', 'common', 'add', 'home', 'profile'],
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });

export const setLanguage = async (lng: 'ar' | 'en' | 'auto') => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
    const targetLanguage = lng === 'auto' ? getSystemLanguage() : (lng.startsWith('ar') ? 'ar' : 'en');
    await i18n.changeLanguage(targetLanguage);
  } catch (err) {
    console.warn('Error changing language:', err);
  }
};

export const getStoredLanguage = async () => {
  return (await AsyncStorage.getItem(LANGUAGE_KEY)) || 'auto';
};

export default i18n;
