import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Author } from '@/types/blog';
import { authors } from '@/data/authors';

interface AuthorContextType {
  currentAuthor: Author | null;
  setCurrentAuthor: (author: Author | null) => void;
  authorInfo: typeof authors[string] | null;
}

const AuthorContext = createContext<AuthorContextType | undefined>(undefined);

export function AuthorProvider({ children }: { children: ReactNode }) {
  const [currentAuthor, setCurrentAuthor] = useState<Author | null>(null);

  const authorInfo = currentAuthor ? authors[currentAuthor] : null;

  useEffect(() => {
    // Remove all theme classes and default class
    document.documentElement.classList.remove('theme-default', 'theme-caesar', 'theme-cicero', 'theme-augustus', 'theme-seneca');
    
    // Add current author theme if selected, otherwise default
    if (currentAuthor) {
      document.documentElement.classList.add(`theme-${currentAuthor}`);
    } else {
      document.documentElement.classList.add('theme-default');
    }
  }, [currentAuthor]);

  return (
    <AuthorContext.Provider value={{ currentAuthor, setCurrentAuthor, authorInfo }}>
      {children}
    </AuthorContext.Provider>
  );
}

export function useAuthor() {
  const context = useContext(AuthorContext);
  if (context === undefined) {
    throw new Error('useAuthor must be used within an AuthorProvider');
  }
  return context;
}
