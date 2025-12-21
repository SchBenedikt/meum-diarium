import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { de } from './locales/de';
import { en } from './locales/en';
import { la } from './locales/la';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            de: { translation: de },
            en: { translation: en },
            la: { translation: la },
        },
        fallbackLng: 'de',
        debug: false,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        detection: {
            // Disable native storage lookups to prevent "Access to storage denied" errors
            order: ['navigator', 'htmlTag'],
            caches: [], // No caching to storage
            lookupLocalStorage: undefined,
            lookupSessionStorage: undefined,
        }
    });

export default i18n;
