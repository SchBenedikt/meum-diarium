import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AuthorSwitcher } from '@/components/AuthorSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchDialog } from '@/components/SearchDialog';
import { cn } from '@/lib/utils';
import { X, Search } from 'lucide-react';
import { useAuthor } from '@/context/AuthorContext';

export function Header() {
  const { setCurrentAuthor } = useAuthor();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Autoren' },
    { href: '/timeline', label: 'Zeitstrahl' },
    { href: '/lexicon', label: 'Lexikon' },
    { href: '/about', label: 'Über' },
  ];

  const handleLogoClick = () => {
    // Only reset author if we are not on the homepage
    if (location.pathname !== '/') {
      setCurrentAuthor(null);
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-primary-foreground font-display text-base font-semibold">M</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-lg">Meum Diarium</span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => item.href === '/' && setCurrentAuthor(null)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                    location.pathname === item.href
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="h-10 px-3 flex items-center gap-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Suchen</span>
                <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded bg-background/50 px-1.5 text-[10px]">
                  ⌘K
                </kbd>
              </button>
              
              <ThemeToggle />
              <AuthorSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
