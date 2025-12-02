import { BlogPost, TimelineEvent, Language } from '@/types/blog';
import slugify from 'slugify';

// Known work slugs to classify posts as 'work'
const WORK_SLUGS = new Set([
  'de-republica',
  'de-legibus',
  'tusculanae-disputationes',
  'de-officiis',
  'de-brevitate-vitae',
  'de-clementia',
  'briefe-an-lucilius',
  'res-gestae'
]);

function classifyPost(post: BlogPost): TimelineEvent['type'] {
  if (post.tags.includes('Geburt')) return 'birth';
  if (post.tags.includes('Tod')) return 'death';
  if (post.tags.includes('Werk') || WORK_SLUGS.has(post.slug)) return 'work';
  return 'event';
}

function baseLanguage(lang: Language): 'de' | 'en' | 'la' {
  return (lang.split('-')[0] as 'de' | 'en' | 'la');
}

export interface BuildTimelineOptions {
  deduplicate?: boolean; // skip if same year+slugified title already present
}

export function buildTimelineEvents(language: Language, posts: BlogPost[], base: TimelineEvent[], options: BuildTimelineOptions = {}): TimelineEvent[] {
  const { deduplicate = true } = options;
  const lang = baseLanguage(language);

  // Map of existing keys to avoid duplicates when dynamic generation matches static events
  const existingKeys = new Set(base.map(e => `${e.year}|${slugify(e.title, { lower: true, strict: true })}`));

  const dynamicEvents: TimelineEvent[] = posts.map(post => {
    const type = classifyPost(post);
    const titleForEvent = post.title; // Display title
    const description = post.excerpt;
    const translations = post.translations ? {
      de: post.translations.de ? { title: post.translations.de.title, description: post.translations.de.excerpt } : undefined,
      en: post.translations.en ? { title: post.translations.en.title, description: post.translations.en.excerpt } : undefined,
      la: post.translations.la ? { title: post.translations.la.title, description: post.translations.la.excerpt } : undefined,
    } : undefined;
    return {
      year: post.historicalYear,
      title: titleForEvent,
      description,
      author: post.author,
      type,
      translations
    } as TimelineEvent;
  });

  const merged = deduplicate
    ? [
        ...base,
        ...dynamicEvents.filter(e => !existingKeys.has(`${e.year}|${slugify(e.title, { lower: true, strict: true })}`))
      ]
    : [...base, ...dynamicEvents];

  merged.sort((a, b) => a.year - b.year);
  return merged;
}
