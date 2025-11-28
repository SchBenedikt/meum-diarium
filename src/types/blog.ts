
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
}

export interface SidebarFact {
  label: string;
  value: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
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
  sidebar?: {
    facts: SidebarFact[];
    relatedPosts?: string[];
    quote?: {
      text: string;
      source: string;
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
  title: string;
  author: Author;
  year: string;
  summary: string;
  takeaway: string;
  structure: { title: string; content: string }[];
}

export type Language = 'de' | 'en' | 'la' | 'la-de' | 'la-en';
