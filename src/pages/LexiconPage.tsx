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
        <section className="pt-32 pb-16 hero-gradient">
          <div className="container mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <BookMarked className="h-4 w-4" />
                <span>{t('lexiconGlossary')}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">{t('navLexicon')}</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('lexiconDescription')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="text" placeholder={t('searchPlaceholder')} className="w-full pl-12 pr-4 py-6 text-base rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <Tags className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">{t('filterByCategory')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleCategoryChange(null)} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", !activeCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                  {t('all')}
                </button>
                {allCategories.slice(0, 5).map(category => (
                  <button key={category} onClick={() => handleCategoryChange(category)} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", activeCategory === category ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-10">
              {alphabet.map(letter => (
                <button key={letter} onClick={() => handleLetterClick(letter)} disabled={!groupedLexicon[letter]} className={cn("h-8 w-8 sm:h-9 sm:w-9 rounded-md text-sm font-medium transition-colors", "disabled:opacity-30 disabled:cursor-not-allowed", activeLetter === letter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                  {letter}
                </button>
              ))}
            </motion.div>

            {Object.keys(groupedLexicon).length > 0 ? (
              <div className="space-y-8">
                {Object.keys(groupedLexicon).map((letter, index) => (
                  <motion.div key={letter} id={`letter-${letter}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                    <h2 className="font-display text-2xl font-bold text-primary mb-4 pb-2 border-b-2 border-primary/20">{letter}</h2>
                    <div className="grid gap-2">
                      {groupedLexicon[letter].map(entry => (
                        <Link key={entry.slug} to={`/lexicon/${entry.slug}`} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border/50 hover:bg-secondary/50 hover:border-border transition-all group">
                          <span className="font-medium text-base group-hover:text-primary transition-colors">{entry.term}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">{t('noEntriesFound')}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
