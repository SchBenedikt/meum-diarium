import { Author, Language } from '@/types/blog';
import { TranslationKey } from '@/locales/translations';

/**
 * Gibt die Übersetzungsschlüssel für Autoren-Informationen zurück
 */
export function getAuthorTranslationKeys(authorId: Author) {
  return {
    name: `${authorId}_name` as TranslationKey,
    latinName: `${authorId}_latinName` as TranslationKey,
    title: `${authorId}_title` as TranslationKey,
    description: `${authorId}_description` as TranslationKey,
    achievements: `${authorId}_achievements` as TranslationKey,
    birthplace: `${authorId}_birthplace` as TranslationKey,
    years: `${authorId}_years` as TranslationKey,
  };
}

/**
 * Hilfsfunktion für übersetzte Autoren-Informationen
 */
export interface TranslatedAuthorInfo {
  name: string;
  latinName: string;
  title: string;
  years: string;
  description: string;
  achievements: string;
  birthplace: string;
}

export function getTranslatedAuthorInfo(
  authorId: Author,
  t: (key: TranslationKey) => string
): TranslatedAuthorInfo {
  const keys = getAuthorTranslationKeys(authorId);

  return {
    name: t(keys.name),
    latinName: t(keys.latinName),
    title: t(keys.title),
    years: t(keys.years),
    description: t(keys.description),
    achievements: t(keys.achievements),
    birthplace: t(keys.birthplace),
  };
}
