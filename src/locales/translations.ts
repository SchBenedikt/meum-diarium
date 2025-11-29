import { de } from './de';
import { en } from './en';

export const translations = {
  de,
  en,
  'de-la': {
    ...de,
    appName: 'Meum Diarium',
    navTimeline: 'Temporale',
    navLexicon: 'Lexicon',
    navAbout: 'De opere',
  },
  'en-la': {
    ...en,
    appName: 'Meum Diarium',
    navTimeline: 'Temporale',
    navLexicon: 'Lexicon',
    navAbout: 'De opere',
  },
};

export type TranslationKey = keyof typeof de;
