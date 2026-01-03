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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveLetter(letter);
      setTimeout(() => setActiveLetter(null), 1000);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    handleCategoryChange(null);
  };

  const surpriseMe = () => {
    const pool = filteredLexicon.length > 0 ? filteredLexicon : lexicon;
    if (pool.length === 0) return;
    const random = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/lexicon/${random.slug}`);
  };

  const matchCount = filteredLexicon.length;
  const totalEntries = lexicon.length;
  const categoryCount = allCategories.length;

  return (
    <div ref={heroRef} className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <PageHero
          eyebrow={t('lexiconGlossary') as string}
          title="Das"
          highlight="Lexikon"
          description={t('lexiconDescription') || 'Ein Kompendium des antiken Wissens. Von politischen Institutionen bis hin zu philosophischen Strömungen.'}
          backgroundImage="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2670&auto=format&fit=crop"
          align="center"
          tall
          bgScale={1.4}
          parallaxY={bgY}
        />

        <section className="relative -mt-12 sm:-mt-16 z-10">
          <div className="section-shell max-w-3xl">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, delay: 0.1 }} className="glass-card flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="border-none bg-transparent text-base h-9 focus-visible:ring-0 placeholder:text-muted-foreground/40 font-light px-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: 0 }}
              />

              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="p-2 hover:bg-secondary rounded-lg transition-colors ml-auto">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </motion.div>
          </div>
        </section>

        <section className="section-shell max-w-5xl -mt-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="glass-card border-dashed">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl bg-primary/5 px-4 py-3 border border-primary/10">
                <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <BookMarked className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">Einträge</p>
                  <p className="text-xl font-display font-semibold">{totalEntries}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-secondary/30 px-4 py-3 border border-border/60">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Tags className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">Kategorien</p>
                  <p className="text-xl font-display font-semibold">{categoryCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 px-4 py-3 border border-emerald-500/30">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Check className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-700 font-bold">Treffer</p>
                  <p className="text-xl font-display font-semibold">{matchCount}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
              <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full border-dashed">
                    <Tags className="h-4 w-4 mr-2" />
                    {activeCategory || t('allCategories') || 'Kategorien'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Kategorie finden..." />
                    <CommandList>
                      <CommandEmpty>Keine Kategorie</CommandEmpty>
                      <CommandGroup heading="Kategorien">
                        <CommandItem onSelect={() => { handleCategoryChange(null); setCategoryPopoverOpen(false); }}>
                          <X className="mr-2 h-4 w-4" />
                          Alle Kategorien
                        </CommandItem>
                        {allCategories.map(cat => (
                          <CommandItem
                            key={cat}
                            onSelect={() => { handleCategoryChange(cat); setCategoryPopoverOpen(false); }}
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

              {activeCategory && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  {activeCategory}
                  <button onClick={() => handleCategoryChange(null)} className="hover:text-primary/70">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <Button variant="secondary" size="sm" className="rounded-full" onClick={surpriseMe}>
                Überrasch mich
              </Button>

              {(activeCategory || searchTerm) && (
                <Button variant="ghost" size="sm" className="rounded-full" onClick={handleResetFilters}>
                  Filter zurücksetzen
                </Button>
              )}

              <div className="ml-auto text-[11px] text-muted-foreground">
                {matchCount === totalEntries ? 'Alle Einträge sichtbar' : `${matchCount} ${t('results') || 'Treffer'}`}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="container mx-auto">

            {/* Categories Grid */}
            {!searchTerm && !activeCategory && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mb-20">
                <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-8 text-center">{t('allCategories') || 'KATEGORIEN'}</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto px-4">
                  {topCategories.map((cat, i) => {
                    const Icon = categoryIcons[cat] || Tags;
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl sm:rounded-3xl bg-card/30 backdrop-blur-xl border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 relative z-10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-display font-bold text-base group-hover:text-primary transition-colors relative z-10 italic">{cat}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-16 sticky top-24 z-40 px-4"
            >
              <div className="flex flex-wrap justify-center items-center gap-1 p-1.5 rounded-2xl bg-card/80 backdrop-blur-2xl border border-border/40 shadow-lg max-w-fit mx-auto overflow-hidden">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest",
                    !activeCategory && !searchTerm ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                  )}
                >
                  {t('all') || 'ALLES'}
                </button>
                <div className="w-px h-5 bg-border/40 mx-1 hidden sm:block"></div>
                {alphabet.map(letter => (
                  <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    disabled={!groupedLexicon[letter]}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                      "disabled:opacity-10 disabled:cursor-not-allowed",
                      activeLetter === letter
                        ? "bg-primary text-primary-foreground scale-105 shadow-md shadow-primary/20"
                        : "hover:bg-primary/10 text-foreground/60 hover:text-primary hover:scale-110 active:scale-95"
                    )}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Results Grid */}
            {Object.keys(groupedLexicon).length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-12">
                {Object.keys(groupedLexicon).map((letter, index) => (
                  <motion.div key={letter} id={`letter-${letter}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="scroll-mt-48">
                    <div className="flex items-center gap-4 mb-6 group/header">
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-display text-xl font-bold border border-primary/10 group-hover/header:scale-110 transition-transform duration-500">
                        {letter}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent"></div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {groupedLexicon[letter].map(entry => {
                        const Icon = categoryIcons[entry.category] || Tags;
                        return (
                          <Link key={entry.slug} to={`/lexicon/${entry.slug}`} className="block p-6 rounded-2xl sm:rounded-3xl bg-card/40 backdrop-blur-md border border-border/40 hover:border-primary/50 transition-colors duration-300 group relative overflow-hidden">
                            <div className="absolute top-2 right-2 p-2 opacity-10 group-hover:opacity-100 transition-transform duration-500">
                              <Icon className="h-12 w-12 text-primary icon-hover" />
                            </div>
                            <div className="relative z-10">
                              <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors italic">{entry.term}</h3>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold text-primary uppercase tracking-widest">{entry.category}</span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-3 font-light leading-relaxed">{entry.definition}</p>

                              <div className="mt-4 flex items-center text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                                Mehr erfahren <ArrowRight className="ml-1.5 h-3 w-3 icon-hover" />
                              </div>
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
