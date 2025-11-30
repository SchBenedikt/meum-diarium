
import { Link } from 'react-router-dom';
import { Scroll, Github, Twitter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border py-12 bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Scroll className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg">{t('appName')}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t('footerDescription')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium mb-4 text-sm">{t('navigation')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('authors')}
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('navTimeline')}
                </Link>
              </li>
              <li>
                <Link to="/lexicon" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('navLexicon')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('navAbout')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-medium mb-4 text-sm">{t('followUs')}</h4>
            <div className="flex gap-2">
              <a 
                href="#" 
                className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            {t('copyright', { year: new Date().getFullYear().toString() })}
          </p>
          <p className="text-sm text-muted-foreground text-center sm:text-right">
            {t('spqr')}
          </p>
        </div>
      </div>
    </footer>
  );
}
