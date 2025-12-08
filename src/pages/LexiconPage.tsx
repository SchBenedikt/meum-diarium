import { useState, useMemo, useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { BookMarked, Search, ArrowRight, Tags, X, Check, Landmark, Scale, Sword, Brain, BookHeart, Drama, ChevronsRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedLexicon } from '@/lib/translator';
import { lexicon as baseLexicon } from '@/data/lexicon';
import { LexiconEntry } from '@/types/blog';
import { Button } from '@/components/ui/button';
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
          entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.definition.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, activeCategory, lexicon]);

  const groupedLexicon = useMemo(() => {
    return filteredLexicon.reduce((acc, entry) => {
      const firstLetter = entry.term[0].toUpperCase();
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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveLetter(letter);
      setTimeout(() => setActiveLetter(null), 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm border border-primary/20">
                <BookMarked className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{t('lexiconGlossary')}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl mb-4 sm:mb-6 tracking-tight">{t('navLexicon')}</h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                {t('lexiconDescription')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-8 -mt-8 relative z-20">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative shadow-2xl rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-xl opacity-50"></div>
              <div className="relative bg-card/80 backdrop-blur-xl border border-primary/20 rounded-xl flex items-center p-2">
                <Search className="h-6 w-6 text-muted-foreground ml-3" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="border-none bg-transparent shadow-none text-lg h-12 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto">

            {/* Categories Grid */}
            {!searchTerm && !activeCategory && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mb-16">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6 text-center">{t('allCategories')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {topCategories.map((cat, i) => {
                    const Icon = categoryIcons[cat] || Tags;
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className="flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-secondary/30 transition-all group"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-display font-medium text-lg">{cat}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Alphabet Filter */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-12 sticky top-20 z-30 py-4 bg-background/80 backdrop-blur-md border-b border-border/50">
              <button
                onClick={() => handleCategoryChange(null)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  !activeCategory ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground"
                )}
              >
                {t('all')}
              </button>
              <div className="w-px h-6 bg-border mx-2"></div>
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  disabled={!groupedLexicon[letter]}
                  className={cn(
                    "w-8 h-8 rounded-full text-sm font-medium transition-all",
                    "disabled:opacity-20 disabled:cursor-not-allowed",
                    activeLetter === letter
                      ? "bg-primary text-primary-foreground scale-110 shadow-md"
                      : "hover:bg-secondary text-foreground/70"
                  )}
                >
                  {letter}
                </button>
              ))}
            </motion.div>

            {/* Results Grid */}
            {Object.keys(groupedLexicon).length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-12">
                {Object.keys(groupedLexicon).map((letter, index) => (
                  <motion.div key={letter} id={`letter-${letter}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="scroll-mt-48">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-display text-2xl font-bold border border-primary/20">
                        {letter}
                      </span>
                      <div className="h-px flex-1 bg-border/50"></div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {groupedLexicon[letter].map(entry => {
                        const Icon = categoryIcons[entry.category] || Tags;
                        return (
                          <Link key={entry.slug} to={`/lexicon/${entry.slug}`} className="block p-5 rounded-xl bg-card border border-border/50 hover:border-primary/40 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                              <Icon className="h-14 w-14 text-primary" />
                            </div>
                            <div className="relative z-10">
                              <h3 className="font-display text-lg font-medium mb-2 group-hover:text-primary transition-colors">{entry.term}</h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                <span className="px-2 py-0.5 rounded-full bg-secondary border border-border">{entry.category}</span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{entry.definition}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">{t('noEntriesFound')}</h3>
                <p className="text-muted-foreground">{t('searchOrSelectCategory')}</p>
                <button onClick={() => { setSearchTerm(''); setActiveCategory(null); }} className="mt-4 text-primary hover:underline">
                  Suche zurücksetzen
                </button>
              </div>
            )}

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
