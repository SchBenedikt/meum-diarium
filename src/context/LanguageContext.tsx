import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: <T = string>(key: string, options?: any) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simplified stub - always returns German, no actual translation
export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = 'de';
  
  const setLanguage = () => {
    // No-op - always German
  };

  const t = <T = string>(key: string, options?: any): T => {
    // Return key as fallback
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
