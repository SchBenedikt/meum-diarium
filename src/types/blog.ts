

export type Author = 'caesar' | 'cicero' | 'augustus' | 'seneca';

export type Perspective = 'diary' | 'scientific';

export interface AuthorInfo {
  id: Author;
  name: string;
  latinName: string;
  title: string;
  years: string;
  birthYear: number;
  deathYear: number;
  description: string;
  heroImage: string;
  theme: string;
  color: string;
  translations?: {
    de?: {
      name?: string;
      title?: string;
      years?: string;
      description?: string;
    };
    en?: {
      name?: string;
      title?: string;
      years?: string;
      description?: string;
    };
    la?: {
      name?: string;
      title?: string;
      years?: string;
      description?: string;
    };
  };
}

export interface SidebarFact {
  label: string;
  value: string;
}

export interface BlogPostTranslations {
  title?: string; // Kept for backward compatibility
  diaryTitle?: string;
  scientificTitle?: string;
  excerpt: string;
  content: {
    diary: string;
    scientific: string;
  };
  tags?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string; // Kept for backward compatibility - can fallback to diaryTitle
  diaryTitle?: string; // Title for diary perspective
  scientificTitle?: string; // Title for scientific perspective
  latinTitle?: string;
  excerpt: string;
  date: string;
  historicalDate: string;
  historicalYear: number;
  author: Author;
  tags: string[];
  readingTime: number;
  coverImage?: string;
  content: {
    diary: string;
    scientific: string;
  };
  // Optional perspective-specific subtitles to keep both views clear and concise
  contentTitles?: {
    diary: string;
    scientific: string;
  };
  translations?: {
    de?: BlogPostTranslations;
    en?: BlogPostTranslations;
    la?: BlogPostTranslations;
  };
  sidebar?: {
    facts: SidebarFact[];
    relatedPosts?: string[];
    quote?: {
      text: string;
      translation?: string;
      source?: string;
      author?: string;
      date?: string;
    };
  };
}

export interface TimelineEventTranslations {
  title: string;
  description: string;
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  author?: Author;
  type: 'birth' | 'death' | 'event' | 'work';
  translations?: {
    de?: TimelineEventTranslations;
    en?: TimelineEventTranslations;
    la?: TimelineEventTranslations;
  };
}

export interface LexiconEntryTranslations {
  term: string;
  definition: string;
  category: string;
  etymology?: string;
  variants?: string[];
}

export interface LexiconEntry {
  term: string;
  slug: string;
  definition: string;
  category: string;
  etymology?: string;
  relatedTerms?: string[];
  variants?: string[];
  translations?: {
    de?: LexiconEntryTranslations;
    en?: LexiconEntryTranslations;
    la?: LexiconEntryTranslations;
  };
}

export interface WorkTranslations {
  title: string;
  summary: string;
  takeaway: string;
  structure: { title: string; content: string }[];
}

export interface Work {
  title: string;
  author: Author;
  year: string;
  summary: string;
  takeaway: string;
  structure: { title: string; content: string }[];
  translations?: {
    de?: WorkTranslations;
    en?: WorkTranslations;
    la?: WorkTranslations;
  };
}

export type Language = 'de' | 'de-la' | 'en' | 'en-la' | 'la';
