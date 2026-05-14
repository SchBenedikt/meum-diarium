export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  defaultLanguage: string;
  enableTranslations: boolean;
  enableNotifications: boolean;
  theme: string;
  accentColor: string;
  footerText: string;
}
export const defaultSettings: SiteSettings = {
  siteName: 'Meum Diarium',
  siteDescription: 'Antikes Rom interaktiv erleben: Tagebücher, KI-Chats, Latein-Reader & Lexikon',
  siteUrl: 'https://example.com',
  defaultLanguage: 'de',
  enableTranslations: true,
  enableNotifications: true,
  theme: 'system',
  accentColor: '#ea580c',
  footerText: '© 2024 Meum Diarium. Alle Rechte vorbehalten.',
};
