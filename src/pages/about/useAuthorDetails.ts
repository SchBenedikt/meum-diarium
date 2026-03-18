import { useLanguage } from '@/context/LanguageContext';

export const useAuthorDetails = (t: (key: string, params?: any) => string) => {
  return {
    caesar: {
      birthPlace: 'Rom, Italien',
      // Weitere Details können hier hinzugefügt werden
    },
    cicero: {
      birthPlace: 'Arpinum, Italien',
      // Weitere Details können hier hinzugefügt werden
    },
    augustus: {
      birthPlace: 'Rom, Italien',
      // Weitere Details können hier hinzugefügt werden
    },
    seneca: {
      birthPlace: 'Córdoba, Hispanien',
      // Weitere Details können hier hinzugefügt werden
    },
    catilina: {
      birthPlace: 'Rom, Italien',
      // Weitere Details können hier hinzugefügt werden
    }
  };
};
