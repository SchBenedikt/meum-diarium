import { useLanguage } from '@/context/LanguageContext';

export const useAuthorDetails = (t: (key: string, params?: any) => string) => {
  return {
    caesar: {
      birthPlace: 'Rom, Italien',
      deathPlace: 'Rom, Italien',
      occupation: 'Feldherr, Staatsmann, Schriftsteller',
      era: 'Späte Republik',
    },
    cicero: {
      birthPlace: 'Arpinum, Italien',
      deathPlace: 'Formiae, Italien',
      occupation: 'Redner, Philosoph, Politiker',
      era: 'Späte Republik',
    },
    augustus: {
      birthPlace: 'Rom, Italien',
      deathPlace: 'Nola, Kampanien',
      occupation: 'Staatsoberhaupt, Kaiser',
      era: 'Principat',
    },
    seneca: {
      birthPlace: 'Córdoba, Hispanien',
      deathPlace: 'Rom, Italien',
      occupation: 'Philosoph, Tragödiendichter, Staatsmann',
      era: 'Frühkaiserzeit',
    },
    catilina: {
      birthPlace: 'Rom, Italien',
      deathPlace: 'Pistoria, Etrurien',
      occupation: 'Senator, Politiker',
      era: 'Späte Republik',
    },
    sallust: {
      birthPlace: 'Amiternum, Sabinerland',
      deathPlace: 'Rom, Italien',
      occupation: 'Geschichtsschreiber, Politiker',
      era: 'Späte Republik',
    },
    sokrates: {
      birthPlace: 'Alopeke bei Athen',
      deathPlace: 'Athen, Griechenland',
      occupation: 'Philosoph',
      era: 'Klassisches Athen',
    },
  };
};
