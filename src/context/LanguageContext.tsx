import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types/blog';
import { translations, TranslationKey } from '@/locales/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('meum-diarium-language');
    return (savedLang as Language) || 'de';
  });

  useEffect(() => {
    localStorage.setItem('meum-diarium-language', language);
    document.documentElement.lang = language.split('-')[0];
  }, [language]);
  
  const t = (key: TranslationKey, replacements?: Record<string, string>): string => {
    const langKey = language as keyof typeof translations;
    let translation = translations[langKey][key] || translations.de[key];
    
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            translation = translation.replace(`{${rKey}}`, replacements[rKey]);
        });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </Language-Context.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
