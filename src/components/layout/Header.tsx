
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

export function Header() {
  const { setCurrentAuthor } = useAuthor();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/timeline', label: 'Zeitstrahl' },
    { href: '/lexicon', label: 'Lexikon' },
    { href: '/about', label: 'Über' },
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Scroll className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-lg">Meum Diarium</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
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
                <span className="hidden sm:inline text-sm">Suche</span>
                <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded bg-background/50 px-1.5 text-[10px]">
                  ⌘K
                </kbd>
              </button>
              
              <div className="hidden md:flex items-center gap-2">
                <AuthorSwitcher />
                <ThemeToggle />
              </div>

              {/* Mobile Menu Trigger */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <button className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-secondary">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Menü öffnen</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[80vw] max-w-sm p-0">
                    <div className="flex flex-col h-full">
                       <div className="flex items-center justify-between p-6 pb-6 border-b">
                         <Link to="/" onClick={() => handleLinkClick()} className="flex items-center gap-3 group">
                           <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                              <Scroll className="h-4 w-4 text-primary-foreground" />
                            </div>
                           <span className="font-display text-lg">Meum Diarium</span>
                         </Link>
                       </div>
                      
                       <nav className="flex flex-col gap-2 my-8 px-6">
                         {navItems.map((item) => (
                           <Link
                             key={item.href}
                             to={item.href}
                             onClick={() => handleLinkClick()}
                             className={cn(
                               "px-4 py-3 text-base font-medium rounded-lg transition-all",
                               location.pathname === item.href
                                 ? "bg-secondary text-foreground"
                                 : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                             )}
                           >
                             {item.label}
                           </Link>
                         ))}
                       </nav>

                       <div className="mt-auto p-6 pt-6 border-t space-y-4">
                         <div className="flex justify-between items-center">
                           <span className="text-sm font-medium">Autor</span>
                           <AuthorSwitcher />
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-sm font-medium">Thema</span>
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
