/**
 * i18next configuration for internationalization
 * Supports Norwegian, English, and Polish
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import type { SupportedLanguage } from '../types';

// Import language resources
import no from './locales/no.json';
import en from './locales/en.json';
import pl from './locales/pl.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      no: { translation: no },
      en: { translation: en },
      pl: { translation: pl },
    },
    fallbackLng: 'no',
    debug: (import.meta as any).env?.DEV || false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'user-language',
      // Normalize language codes (en-GB -> en, no-NO -> no, etc.)
      convertDetectedLanguage: (lng: string) => {
        // Extract base language code (e.g., "en" from "en-GB")
        const baseLang = lng.split('-')[0];
        // Map to supported languages
        if (baseLang === 'en') return 'en';
        if (baseLang === 'no' || baseLang === 'nb' || baseLang === 'nn') return 'no';
        if (baseLang === 'pl') return 'pl';
        // Default to Norwegian if not supported
        return 'no';
      },
    },
    // Load only base language (en instead of en-GB)
    load: 'languageOnly',
    // Supported languages
    supportedLngs: ['no', 'en', 'pl'],
    // Non-explicit supported languages (en-GB will use en)
    nonExplicitSupportedLngs: true,
  });

export default i18n;
export type { SupportedLanguage };
