export type PageLanguage = 'de';

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
}
