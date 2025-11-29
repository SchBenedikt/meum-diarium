import { de } from './de';
import { en } from './en';
import { la } from './la';

export const translations = {
  de,
  en,
  la,
  'de-la': {
    ...de,
    appName: 'Meum Diarium',
    navTimeline: 'Temporale',
    navLexicon: 'Lexicon',
    navAbout: 'De Proposito',
    diary: 'Diarium',
    scientific: 'Scientificum',
  },
  'en-la': {
    ...en,
    appName: 'Meum Diarium',
    navTimeline: 'Temporale',
    navLexicon: 'Lexicon',
    navAbout: 'De Proposito',
    diary: 'Diarium',
    scientific: 'Scientificum',
  },
};

export type TranslationKey = keyof typeof de;
