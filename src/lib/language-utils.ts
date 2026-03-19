/**
 * Safe Language Utilities
 * Bietet defensive Funktionen für Language-Handling
 */

export type SupportedLanguage = 'de' | 'en' | 'la';

/**
 * Sicheres Aufteilen von Language Strings mit Fallback
 */
export function safeLanguageSplit(language: string | undefined | null): SupportedLanguage {
  if (!language || typeof language !== 'string') {
    return 'de'; // Default fallback
  }
  
  const baseLang = language.split('-')[0];
  return ['de', 'en', 'la'].includes(baseLang) ? baseLang as SupportedLanguage : 'de';
}

/**
 * Prüft ob ein Language String gültig ist
 */
export function isValidLanguage(language: string | undefined | null): language is SupportedLanguage {
  if (!language || typeof language !== 'string') {
    return false;
  }
  return ['de', 'en', 'la'].includes(language.split('-')[0] as SupportedLanguage);
}

/**
 * Gibt sicheren Language String zurück mit Fallback
 */
export function getSafeLanguage(language: string | undefined | null): SupportedLanguage {
  return isValidLanguage(language) ? language.split('-')[0] as SupportedLanguage : 'de';
}
