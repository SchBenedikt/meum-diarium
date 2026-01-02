'use client';

import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Menu,
  Search,
  Settings,
  Sun,
  Moon,
  Globe,
  Home,
  BookOpen,
  Info,
  Users,
} from 'lucide-react';
import { SearchDialog } from '@/components/SearchDialog';
import { AuthorSwitcher } from '@/components/AuthorSwitcher';

export function Header() {
  const { setCurrentAuthor } = useAuthor();
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isIpad, setIsIpad] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const headerRef = useRef<HTMLDivElement>(null);

  // iPad Detection (inkl. iPadOS 13+)
  useEffect(() => {
    const iPad =
      /iPad/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIpad(!!iPad);
  }, []);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem('theme') as 'light' | 'dark' | 'system') ||
      'system';
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const htmlElement = document.documentElement;
    let effectiveTheme = newTheme;

    if (newTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    if (effectiveTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for search
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

  const navItems = [
    { href: '/timeline', label: t('navTimeline'), icon: Home },
    { href: '/lexicon', label: t('navLexicon'), icon: BookOpen },
    { href: '/about', label: t('navAbout'), icon: Info },
  ];

  const handleLogoClick = useCallback(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  const handleNavClick = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  // Hilfsflag: iPad soll wie Desktop behandelt werden
  const isDesktopLike = !isIpad; // DU kannst das bei Bedarf anpassen, z.B. immer Desktop auf iPad

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'bg-background/70 backdrop-blur-xl border-b border-border/40', // vereinheitlichter Look
          isScrolled && 'shadow-lg'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              onClick={handleLogoClick}
              className="group flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity duration-200"
              aria-label={t('appName')}
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="inline-block text-sm sm:text-base font-bold text-primary-foreground transform transition-transform duration-300 ease-out group-hover:rotate-180">
                  MD
                </span>
              </div>
              <span className="hidden xs:block font-display text-base sm:text-lg truncate font-semibold">
                {t('appName')}
              </span>
            </Link>

            {/* Desktop Navigation (inkl. iPad) */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium',
                      active
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {active && (
                      <span className="ml-1 inline-block w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg hover:bg-secondary/50 hover:border-border/50 border border-transparent touch-manipulation"
                aria-label={t('search')}
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              {/* Desktop Controls (inkl. iPad) */}
              <div className="hidden md:flex items-center gap-2">
                <AuthorSwitcher />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg"
                      aria-label="Settings"
                    >
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {t('language')}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={language === 'de'}
                      onCheckedChange={() => setLanguage('de')}
                    >
                      Deutsch 🇩🇪
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={language === 'en'}
                      onCheckedChange={() => setLanguage('en')}
                    >
                      English 🇬🇧
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuLabel className="flex items-center gap-2">
                      {theme === 'dark' ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                      Theme
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={theme === 'light'}
                      onCheckedChange={() => setTheme('light')}
                    >
                      Light ☀️
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={theme === 'dark'}
                      onCheckedChange={() => setTheme('dark')}
                    >
                      Dark 🌙
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={theme === 'system'}
                      onCheckedChange={() => setTheme('system')}
                    >
                      System 🖥️
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu (nur < md, auch auf iPad im Portrait sinnvoll) */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg"
                      aria-label="Menu"
                    >
                      <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full p-0 sm:w-80">
                    <div className="flex flex-col h-full">
                      {/* Sheet Header */}
                      <div className="flex items-center justify-between p-6 border-b border-border/30">
                        <Link
                          to="/"
                          onClick={handleNavClick}
                          className="flex items-center gap-2"
                        >
                          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold text-primary-foreground">
                              MD
                            </span>
                          </div>
                          <span className="font-display text-lg font-semibold">
                            {t('appName')}
                          </span>
                        </Link>
                      </div>

                      {/* Mobile Navigation */}
                      <nav className="flex flex-col gap-2 py-6 px-4">
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.href);

                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={handleNavClick}
                              className={cn(
                                'px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-base font-medium',
                                active
                                  ? 'bg-primary/10 text-primary border border-primary/20'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                              )}
                            >
                              <Icon className="w-5 h-5" />
                              {item.label}
                              {active && (
                                <span className="ml-auto inline-block w-2 h-2 bg-primary rounded-full" />
                              )}
                            </Link>
                          );
                        })}
                      </nav>

                      {/* Mobile Settings */}
                      <div className="mt-auto p-6 border-t border-border/30 space-y-6">
                        {/* Author Selector */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {t('author')}
                          </h3>
                          <AuthorSwitcher />
                        </div>

                        {/* Language Selector */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            {t('language')}
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={
                                language === 'de' ? 'default' : 'outline'
                              }
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                setLanguage('de');
                                handleNavClick();
                              }}
                            >
                              🇩🇪 Deutsch
                            </Button>
                            <Button
                              variant={
                                language === 'en' ? 'default' : 'outline'
                              }
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                setLanguage('en');
                                handleNavClick();
                              }}
                            >
                              🇬🇧 English
                            </Button>
                          </div>
                        </div>

                        {/* Theme Selector */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            {theme === 'dark' ? (
                              <Moon className="w-4 h-4" />
                            ) : (
                              <Sun className="w-4 h-4" />
                            )}
                            Theme
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              variant={
                                theme === 'light' ? 'default' : 'outline'
                              }
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                setTheme('light');
                                handleNavClick();
                              }}
                            >
                              ☀️ Light
                            </Button>
                            <Button
                              variant={
                                theme === 'dark' ? 'default' : 'outline'
                              }
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                setTheme('dark');
                                handleNavClick();
                              }}
                            >
                              🌙 Dark
                            </Button>
                            <Button
                              variant={
                                theme === 'system' ? 'default' : 'outline'
                              }
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                setTheme('system');
                                handleNavClick();
                              }}
                            >
                              🖥️ System
                            </Button>
                          </div>
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

      {/* Spacing after fixed header */}
      <div className="h-16 sm:h-18" />

      {/* Search Dialog */}
      <SearchDialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
