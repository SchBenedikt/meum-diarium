
import { Link } from 'react-router-dom';
import { Scroll, Github, Twitter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border py-12 sm:py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 touch-manipulation">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Scroll className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg">{t('appName')}</span>
            </Link>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm leading-relaxed">
              {t('footerDescription')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-medium mb-4 text-sm sm:text-base uppercase tracking-wider">{t('navigation')}</h4>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <Link to="/" className="font-display text-muted-foreground hover:text-foreground transition-colors inline-block py-1 touch-manipulation">
                  {t('authors')}
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="font-display text-muted-foreground hover:text-foreground transition-colors inline-block py-1 touch-manipulation">
                  {t('navTimeline')}
                </Link>
              </li>
              <li>
                <Link to="/lexicon" className="font-display text-muted-foreground hover:text-foreground transition-colors inline-block py-1 touch-manipulation">
                  {t('navLexicon')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="font-display text-muted-foreground hover:text-foreground transition-colors inline-block py-1 touch-manipulation">
                  {t('navAbout')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-medium mb-4 text-sm sm:text-base uppercase tracking-wider">{t('followUs')}</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors active:scale-95 touch-manipulation"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors active:scale-95 touch-manipulation"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            {t('copyright', { year: new Date().getFullYear().toString() })}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
            {t('spqr')}
          </p>
        </div>
      </div>
    </footer>
  );
}
