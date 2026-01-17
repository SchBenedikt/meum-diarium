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
    <footer className="relative mt-32 border-t border-border bg-card overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Scroll className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-extrabold tracking-tighter text-foreground">
                {appName}
              </span>
            </Link>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm font-light italic">
              "{description}"
            </p>

            <div className="pt-4 flex items-center gap-4">
              {/* Minimalist social indicators removal confirmed */}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
            {footerLinks.map((column) => (
              <div key={column.title} className="space-y-8">
                <h4 className="font-display text-xs uppercase tracking-[0.3em] font-bold text-primary">
                  {column.title}
                </h4>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground/80 hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        {link.icon && <link.icon className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />}
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 sm:mt-32 pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
              © {new Date().getFullYear()} {appName}
            </p>
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
              <Link to="/legal" className="text-muted-foreground hover:text-primary transition-colors">Impressum</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Datenschutz</Link>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-primary/40 font-black italic">
              <Globe className="h-3 w-3" />
              <span>{t('spqr')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
