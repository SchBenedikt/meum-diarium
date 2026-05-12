export type Author = 'caesar' | 'cicero' | 'augustus' | 'seneca' | 'catilina' | 'sokrates' | 'sallust';
export type Perspective = 'diary' | 'scientific';
export type Language = 'de';

export interface TagWithTranslations {
  id: string;
  translations: {
    de: string;
    en?: string;
    la?: string;
    [key: string]: string | undefined;
  };
}

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
  highlights?: {
    title: string;
    description: string;
    link: string;
    icon: string;
  }[];
  translations?: Record<string, { title?: string; description?: string; name?: string }>;
}

export interface SidebarFact {
  label: string;
  value: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  diaryTitle?: string;
  scientificTitle?: string;
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
  contentTitles?: {
    diary: string;
    scientific: string;
  };
  sidebar?: {
    facts: SidebarFact[];
    relatedPosts?: string[];
    quote?: {
      text: string;
      source?: string;
      author?: string;
      date?: string;
    };
  };
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  author?: Author;
  type: 'birth' | 'death' | 'event' | 'work';
}

export interface LexiconEntry {
  term: string;
  slug: string;
  definition: string;
  category: string;
  etymology?: string;
  relatedTerms?: string[];
  variants?: string[];
}

export interface Work {
  slug: string;
  title: string;
  author: Author;
  year: string;
  summary: string;
  takeaway: string;
  structure: { title: string; content: string }[];
}
