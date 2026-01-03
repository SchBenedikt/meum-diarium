import { TimelineEvent, LexiconEntry, Work, Language } from '@/types/blog';

/**
 * Gibt ein übersetztes Timeline-Event zurück
 */
export function getTranslatedTimelineEvent(event: TimelineEvent, language: Language): TimelineEvent {
  const baseLang = language.split('-')[0] as 'de' | 'en' | 'la';

  // Wenn keine Übersetzungen vorhanden sind oder die Sprache Deutsch ist, gib das Original zurück
  if (!event.translations || baseLang === 'de') {
    return event;
  }

  const translation = event.translations[baseLang];

  // Wenn keine Übersetzung für diese Sprache existiert, gib das Original zurück
  if (!translation) {
    return event;
  }

  // Erstelle ein neues Event mit übersetzten Inhalten
  return {
    ...event,
    title: translation.title && translation.title.trim() !== "" ? translation.title : event.title,
    description: translation.description && translation.description.trim() !== "" ? translation.description : event.description,
  };
}

/**
 * Übersetzt ein Array von Timeline-Events
 */
export function getTranslatedTimelineEvents(events: TimelineEvent[], language: Language): TimelineEvent[] {
  return events.map(event => getTranslatedTimelineEvent(event, language));
}

/**
 * Gibt einen übersetzten Lexikon-Eintrag zurück
 */
export function getTranslatedLexiconEntry(entry: LexiconEntry, language: Language): LexiconEntry {
  const baseLang = language.split('-')[0] as 'de' | 'en' | 'la';

  // Wenn keine Übersetzungen vorhanden sind oder die Sprache Deutsch ist, gib das Original zurück
  if (!entry.translations || baseLang === 'de') {
    return entry;
  }

  const translation = entry.translations[baseLang];

  // Wenn keine Übersetzung für diese Sprache existiert, gib das Original zurück
  if (!translation) {
    return entry;
  }

  // Erstelle einen neuen Eintrag mit übersetzten Inhalten
  // Verwende nur dann die Übersetzung, wenn sie nicht leer ist
  return {
    ...entry,
    term: translation.term && translation.term.trim() !== "" ? translation.term : entry.term,
    definition: translation.definition && translation.definition.trim() !== "" ? translation.definition : entry.definition,
    category: translation.category && translation.category.trim() !== "" ? translation.category : entry.category,
    etymology: translation.etymology && translation.etymology.trim() !== "" ? translation.etymology : entry.etymology,
    variants: translation.variants && translation.variants.length > 0 ? translation.variants : entry.variants,
  };
}

/**
 * Übersetzt ein Array von Lexikon-Einträgen
 */
export function getTranslatedLexiconEntries(entries: LexiconEntry[], language: Language): LexiconEntry[] {
  return entries.map(entry => getTranslatedLexiconEntry(entry, language));
}

/**
 * Gibt ein übersetztes Werk zurück
 */
export function getTranslatedWork(work: Work, language: Language): Work {
  const baseLang = language.split('-')[0] as 'de' | 'en' | 'la';

  // Wenn keine Übersetzungen vorhanden sind oder die Sprache Deutsch ist, gib das Original zurück
  if (!work.translations || baseLang === 'de') {
    return work;
  }

  const translation = work.translations[baseLang];

  // Wenn keine Übersetzung für diese Sprache existiert, gib das Original zurück
  if (!translation) {
    return work;
  }

  // Erstelle ein neues Werk mit übersetzten Inhalten
  return {
    ...work,
    title: translation.title && translation.title.trim() !== "" ? translation.title : work.title,
    summary: translation.summary && translation.summary.trim() !== "" ? translation.summary : work.summary,
    takeaway: translation.takeaway && translation.takeaway.trim() !== "" ? translation.takeaway : work.takeaway,
    structure: translation.structure && translation.structure.length > 0 ? translation.structure : work.structure,
  };
}

/**
 * Übersetzt ein Record von Werken
 */
export function getTranslatedWorks(works: Record<string, Work>, language: Language): Record<string, Work> {
  const translated: Record<string, Work> = {};

  for (const key in works) {
    translated[key] = getTranslatedWork(works[key], language);
  }

  return translated;
}
