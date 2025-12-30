
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthorSwitcher } from '@/components/AuthorSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchDialog } from '@/components/SearchDialog';
import { cn } from '@/lib/utils';
import { Menu, Search, Scroll } from 'lucide-react';
import { useAuthor } from '@/context/AuthorContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

export function Header() {
  const { setCurrentAuthor } = useAuthor();
  const location = useLocation();
  const { t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isIpad, setIsIpad] = useState(false);

  useEffect(() => {
    setIsIpad(/iPad/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  }, []);

  const navItems = [
    { href: '/timeline', label: t('navTimeline') },
    { href: '/lexicon', label: t('navLexicon') },
    { href: '/about', label: t('navAbout') },
  ];

  const handleLogoClick = () => {
    setCurrentAuthor(null);
  }

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/30 safe-top shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-3">
            {/* Logo */}
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3 group min-w-0 hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0 shadow-lg shadow-primary/20">
                <Scroll className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <div className="hidden xs:block min-w-0">
                <span className="font-display text-base sm:text-lg truncate font-semibold">{t('appName')}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {!isIpad && (
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-display font-medium rounded-lg transition-all duration-200",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button - optimized for touch */}
              <button
                onClick={() => setSearchOpen(true)}
                className="h-10 sm:h-11 min-w-[40px] sm:min-w-[44px] px-2 sm:px-3 flex items-center gap-2 rounded-lg bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:border-border/50 transition-all duration-200 active:scale-95 touch-manipulation border border-transparent"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">{t('search')}</span>
                <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded bg-background/50 px-1.5 text-[10px]">
                  ⌘K
                </kbd>
              </button>

              <div className="hidden md:flex items-center gap-2">
                <LanguageSwitcher />
                <AuthorSwitcher />
                <ThemeToggle />
              </div>

              {/* Mobile Menu Trigger - optimized touch target */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <button className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-xl hover:bg-secondary/80 active:scale-95 transition-all duration-200 touch-manipulation border border-border/30">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">{t('openMenu')}</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[90vw] sm:w-[80vw] max-w-md p-0">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between p-6 pb-6 border-b border-border/30">
                        <Link to="/" onClick={() => handleLinkClick()} className="flex items-center gap-3 group">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Scroll className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <span className="font-display text-lg font-semibold">{t('appName')}</span>
                        </Link>
                      </div>

                      <nav className="flex flex-col gap-3 my-8 px-6">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => handleLinkClick()}
                            className={cn(
                              "px-4 py-4 text-base font-medium rounded-xl transition-all duration-200",
                              location.pathname === item.href
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            )}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </nav>

                      <div className="mt-auto p-6 pt-6 border-t space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{t('language')}</span>
                          <LanguageSwitcher />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{t('author')}</span>
                          <AuthorSwitcher />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{t('theme')}</span>
                          <ThemeToggle />
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
