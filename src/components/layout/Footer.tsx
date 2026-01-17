import { Link } from 'react-router-dom';
import { Scroll, Github, Twitter, Mail, Globe, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const text = (key: string, fallback: string) => {
    const val = t(key);
    return typeof val === 'string' ? val : fallback;
  };

  const appName = text('appName', 'Meum Diarium');
  const description = text('footerDescription', 'Experience history through the eyes of the greatest figures of ancient Rome. Diaries and scholarly commentaries.');

  const footerLinks = [
    {
      title: text('footerNavigation', 'Navigation'),
      links: [
        { label: t('authors'), href: '/' },
        { label: t('navTimeline'), href: '/timeline' },
        { label: t('navLexicon'), href: '/lexicon' },
        { label: t('navAbout'), href: '/about' },
      ]
    },
    {
      title: 'Persönlichkeiten',
      links: [
        { label: 'Julius Caesar', href: '/caesar' },
        { label: 'Marcus Cicero', href: '/cicero' },
        { label: 'Kaiser Augustus', href: '/augustus' },
        { label: 'Seneca der Jüngere', href: '/seneca' },
      ]
    },
    {
      title: 'Interaktiv',
      links: [
        { label: 'Zeitreise Simulation', href: '/caesar/simulation', icon: Sparkles },
        { label: 'Sententia Diei', href: '/', icon: BookOpen },
      ]
    }
  ];

  return (
    <footer className="border-t border-border mt-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[var(--radius)] bg-primary flex items-center justify-center">
                <Scroll className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-sans text-2xl text-foreground">
                {appName}
              </span>
            </Link>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm">
              {description}
            </p>

            <div className="flex flex-col space-y-3">
              {/* Social links removed as requested */}
            </div>
          </div>

          {/* Navigation Columns */}
          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-6">
              <h4 className="font-sans text-xs uppercase tracking-wider text-foreground/50">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      {link.icon && <link.icon className="h-3.5 w-3.5 opacity-50" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <p className="text-xs text-muted-foreground">
              {t('copyright', { year: new Date().getFullYear().toString() })}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link to="/legal">Impressum</Link>
              <Link to="/privacy">Datenschutz</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary/60">
              <Globe className="h-3 w-3" />
              <span>{t('spqr')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
