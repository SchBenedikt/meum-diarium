import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from '@/types/blog';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: <T = string>(key: string, options?: any) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { t: i18nT, i18n } = useTranslation();

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    // localStorage and document.lang are handled by i18next detection now, 
    // but for safety/redundancy or specific logic we can keep effects if needed.
    // i18next-browser-languagedetector handles localStorage.
  };

  // Sync document lang
  useEffect(() => {
    const baseLang = i18n.language.split('-')[0];
    document.documentElement.lang = baseLang;
    document.documentElement.dir = ['ar', 'fa', 'he', 'ur'].includes(baseLang) ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const t = <T = string>(key: string, options?: any): T => {
    return i18nT(key, options) as T;
  };

  return (
    <LanguageContext.Provider value={{ language: i18n.language as Language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
