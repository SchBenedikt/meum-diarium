export type PageLanguage = 'de' | 'en' | 'la';

export interface PageHighlight {
  title: string;
  description: string;
}

export interface PageTranslation {
  heroTitle?: string;
  heroSubtitle?: string;
  projectDescription?: string;
  highlights?: PageHighlight[];
}

export interface PageContent {
  slug: string;
  heroTitle: string;
  heroSubtitle: string;
  projectDescription: string;
  highlights: PageHighlight[];
  translations?: Partial<Record<PageLanguage, PageTranslation>>;
}
