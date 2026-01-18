import { useState, useMemo, useEffect, useRef } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { BookMarked, Search, ArrowRight, Tags, X, Check, Landmark, Scale, Sword, Brain, BookHeart, Drama, ChevronsRight, Users } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedLexicon } from '@/lib/translator';
import { lexicon as baseLexicon } from '@/data/lexicon';
import { LexiconEntry } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/layout/PageHero';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const categoryIcons: Record<string, React.ElementType> = {
  'Politik': Landmark,
  'Recht': Scale,
  'Militär': Sword,
  'Philosophie': Brain,
  'Gesellschaft': Users,
  'Rede': BookHeart,
  'Drama': Drama,
  'Bürgerkrieg': ChevronsRight,
};

const topCategories = ['Politik', 'Philosophie', 'Militär', 'Bürgerkrieg', 'Gesellschaft'];

export default function LexiconPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(searchParams.get('category'));
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setCurrentAuthor } = useAuthor();
  const { language, t } = useLanguage();

  const [lexicon, setLexicon] = useState<LexiconEntry[]>(baseLexicon);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  useEffect(() => {
    async function translateLexicon() {
      const translated = await getTranslatedLexicon(language);
      setLexicon(translated);
    }
    translateLexicon();
  }, [language]);

  useEffect(() => {
    const category = searchParams.get('category');
    setActiveCategory(category);
  }, [searchParams]);

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const allCategories = useMemo(() => [...new Set(lexicon.map(e => e.category))].sort(), [lexicon]);

  const filteredLexicon = useMemo(() => {
    return lexicon
      .filter(entry => {
        const categoryMatch = !activeCategory || entry.category === activeCategory;
        const searchMatch =
          (entry.term || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (entry.definition || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (entry.variants || []).some(v => (v || "").toLowerCase().includes(searchTerm.toLowerCase()));
        return categoryMatch && searchMatch;
      })
      .sort((a, b) => (a.term || "").localeCompare(b.term || ""));
  }, [searchTerm, activeCategory, lexicon]);

  const groupedLexicon = useMemo(() => {
    return filteredLexicon.reduce((acc, entry) => {
      const firstLetter = entry.term && entry.term.length > 0 ? entry.term[0].toUpperCase() : '?';
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(entry);
      return acc;
    }, {} as Record<string, LexiconEntry[]>);
  }, [filteredLexicon]);

  const handleLetterClick = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 140,
        behavior: 'smooth'
      });
      setActiveLetter(letter);
      setTimeout(() => setActiveLetter(null), 1000);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    handleCategoryChange(null);
  };

  const totalEntries = lexicon.length;
  const searchPlaceholder = t('lexiconSearchPlaceholder') || 'In den Annalen suchen...';

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <main className="container mx-auto px-4 pt-32 pb-24 max-w-5xl">

        {/* Minimalist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              {t('lexiconGlossary') || 'Glossarium'}
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              Das <span className="text-primary italic">Lexikon</span>
            </h1>
            <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
              {t('lexiconDescription') || 'Entdecken Sie die Begriffe, die das antike Rom prägten. Von Politik bis Philosophie.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4 items-end"
          >
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              <div className="flex flex-col items-end">
                <span className="text-foreground">{totalEntries}</span>
                <span>{t('posts') || 'Begriffe'}</span>
              </div>
              <div className="w-px h-6 bg-border/40" />
              <div className="flex flex-col items-end">
                <span className="text-foreground">{allCategories.length}</span>
                <span>{t('allCategories') || 'Kategorien'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filter Bar */}
        <div className="sticky top-20 z-50 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-4 p-2 rounded-3xl bg-card border border-border/40 shadow-2xl shadow-primary/5 backdrop-blur-xl"
          >
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full bg-transparent border-none h-12 pl-11 pr-4 focus-visible:ring-0 text-base placeholder:text-muted-foreground/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 p-1 md:border-l border-border/40 w-full md:w-auto overflow-x-auto no-scrollbar">
              <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-2xl h-10 px-4 text-xs font-bold uppercase tracking-widest hover:bg-secondary">
                    {activeCategory || t('allCategories') || 'Kategorien'}
                    <Tags className="ml-2 h-3.5 w-3.5 opacity-40" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 rounded-2xl border-border/40 bg-card/95 backdrop-blur-sm shadow-2xl" align="end">
                  <Command className="bg-transparent">
                    <CommandList>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => { handleCategoryChange(null); setCategoryPopoverOpen(false); }}
                          className="rounded-xl cursor-pointer"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Alle Kategorien
                        </CommandItem>
                        {allCategories.map(cat => (
                          <CommandItem
                            key={cat}
                            onSelect={() => { handleCategoryChange(cat); setCategoryPopoverOpen(false); }}
                            className="rounded-xl cursor-pointer"
                          >
                            <Check className={cn("mr-2 h-4 w-4", activeCategory === cat ? "opacity-100" : "opacity-0")} />
                            {cat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {(activeCategory || searchTerm) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-10 w-10 hover:bg-destructive/5 hover:text-destructive text-muted-foreground/40"
                  onClick={handleResetFilters}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Minimalist Alphabet Nav */}
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 mb-16 text-[10px] font-black uppercase tracking-tighter">
          {alphabet.map(letter => {
            const hasMatches = !!groupedLexicon[letter];
            return (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={!hasMatches}
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300",
                  hasMatches
                    ? "hover:bg-primary/10 hover:text-primary cursor-pointer text-foreground/40"
                    : "opacity-5 cursor-not-allowed",
                  activeLetter === letter && "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20",
                )}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Entries */}
        <div className="space-y-24">
          {Object.keys(groupedLexicon).length > 0 ? (
            Object.keys(groupedLexicon).sort().map(letter => (
              <div key={letter} id={`letter-${letter}`} className="group/section">
                <div className="flex items-baseline gap-4 mb-10">
                  <span className="text-6xl font-black text-foreground/5 group-hover/section:text-primary/10 transition-colors duration-500 font-display italic">
                    {letter}
                  </span>
                  <div className="h-[1px] flex-1 bg-border/40" />
                </div>

                <div className="grid gap-px bg-border/40 border border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
                  {groupedLexicon[letter].map(entry => (
                    <Link
                      key={entry.slug}
                      to={`/lexicon/${entry.slug}`}
                      className="group/entry relative bg-card p-8 sm:p-10 transition-all duration-500 hover:z-10 hover:bg-card/80"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/entry:opacity-100 transition-opacity duration-500" />
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover/entry:scale-y-100 transition-transform duration-500 origin-top" />

                      <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">
                              {entry.category}
                            </span>
                          </div>
                          <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight group-hover/entry:text-primary transition-colors">
                            {entry.term}
                          </h3>
                          <p className="text-muted-foreground/60 font-light leading-relaxed max-w-2xl text-base group-hover/entry:text-foreground/80 transition-colors">
                            {entry.definition.slice(0, 120)}{entry.definition.length > 120 ? '...' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-primary/0 group-hover/entry:text-primary/100 transition-all duration-500 -translate-x-4 group-hover/entry:translate-x-0 self-end sm:self-center">
                          <span className="text-[10px] font-black uppercase tracking-widest">{t('readMore') || 'Details'}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('noEntriesFound') || 'Nicht gefunden'}</h3>
                <p className="text-muted-foreground/60 font-light">{t('searchOrSelectCategory') || 'Versuchen Sie einen anderen Begriff.'}</p>
              </div>
              <Button variant="outline" onClick={handleResetFilters} className="rounded-full px-8">
                Filter zurücksetzen
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
