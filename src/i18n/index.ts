/**
 * i18next configuration for internationalization
 * Supports Norwegian, English, and Polish
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedLanguage } from '../types';

// Import language resources
import no from './locales/no.json';
import en from './locales/en.json';
import pl from './locales/pl.json';

// Language detector configuration
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage) {
        callback(savedLanguage);
      } else {
        // Default to Norwegian
        callback('no');
      }
    } catch (error) {
      callback('no');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('user-language', lng);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      no: { translation: no },
      en: { translation: en },
      pl: { translation: pl },
    },
    fallbackLng: 'no',
    debug: __DEV__,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    compatibilityJSON: 'v3',
  });

export default i18n;
export { SupportedLanguage };

