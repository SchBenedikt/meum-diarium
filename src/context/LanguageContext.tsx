import React, { createContext, useContext, ReactNode } from 'react';
import { de } from '@/locales/de';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: <T = string>(key: string, options?: any) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested property from object using dot notation
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// German-only translation context
export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = 'de';
  
  const setLanguage = () => {
    // No-op - always German
  };

  const t = <T = string>(key: string, options?: any): T => {
    // Look up the translation in the German translations object
    const translation = getNestedProperty(de, key);
    
    // If translation found, handle variable replacement
    if (translation) {
      if (typeof translation === 'string' && options) {
        // Replace variables like {{minutes}} with actual values
        let result = translation;
        Object.keys(options).forEach(optionKey => {
          result = result.replace(new RegExp(`{{${optionKey}}}`, 'g'), options[optionKey]);
        });
        return result as T;
      }
      return translation as T;
    }
    
    // Fallback to key if translation not found
    return key as T;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
