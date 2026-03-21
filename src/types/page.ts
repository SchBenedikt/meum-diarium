export type PageLanguage = 'de' | 'en' | 'la';

export interface PageTranslation {
  heroTitle?: string;
  heroSubtitle?: string;
  projectDescription?: string;
  highlights?: { title: string; description: string }[];
}

export interface PageHighlight {
  title: string;
  description: string;
}

export interface PageContent {
  slug: string;
  heroTitle: string;
  heroSubtitle: string;
  projectDescription?: string;
  introText?: string;
  heroImage?: string;
  highlights: PageHighlight[];
  sections?: any[];
  translations?: Partial<Record<PageLanguage, PageTranslation>>;
}
