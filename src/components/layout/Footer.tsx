import { Link } from 'react-router-dom';
import { Scroll, Github, Twitter, Mail, ExternalLink, Sparkles, BookOpen, Clock, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export function Footer() {
  const { t } = useLanguage();

  const text = (key: string, fallback: string) => {
    const val = t(key);
    return typeof val === 'string' ? val : fallback;
  };

  const appName = text('appName', 'Meum Diarium');
  const description = text('footerDescription', 'Erleben Sie Geschichte durch die Augen der größten Persönlichkeiten des antiken Roms.');

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
    <footer className="border-t border-border mt-20 bg-secondary/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-primary/20">
                <Scroll className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {appName}
              </span>
            </Link>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm">
              {description}
            </p>

            <div className="flex flex-col space-y-3">
              <div className="inline-flex items-center gap-2.5 text-xs text-primary font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 w-fit">
                <Mail className="h-3.5 w-3.5" />
                contact@meum-diarium.de
              </div>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://github.com/SchBenedikt/meum-diarium"
                  className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shadow-sm"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://twitter.com"
                  className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shadow-sm"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-6">
              <h4 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-foreground/50">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      {link.icon && <link.icon className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <p className="text-xs text-muted-foreground font-medium">
              {t('copyright', { year: new Date().getFullYear().toString() })}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link to="/legal" className="hover:text-foreground transition-colors">Impressum</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Datenschutz</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/60">
              <Globe className="h-3 w-3" />
              <span>{t('spqr')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
