
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { lexicon, LexiconEntry } from '@/data/lexicon';
import { posts, BlogPost } from '@/data/posts';
import { authors } from '@/data/authors';
import { BookMarked, Search, ArrowRight, BookText, Tags, Landmark, Scale, Shield, Users, VenetianMask, MessageSquare, BrainCircuit, Mountain, Star, Skull, BookOpen, Drama, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type SearchResult = 
  | { type: 'post', data: BlogPost }
  | { type: 'lexicon', data: LexiconEntry };

const postToSearchResult = (post: BlogPost): SearchResult => ({type: 'post', data: post});
const lexiconToSearchResult = (entry: LexiconEntry): SearchResult => ({type: 'lexicon', data: entry});

const allCategories = [...new Set([...posts.flatMap(p => p.tags), ...lexicon.map(l => l.category)])].sort();

const categoryIcons: { [key: string]: React.ElementType } = {
  'Politik': Landmark,
  'Militär': Shield,
  'Gesellschaft': Users,
  'Recht': Scale,
  'Philosophie': MessageSquare,
  'Bürgerkrieg': Shield,
  'Entscheidung': BrainCircuit,
  'Gallischer Krieg': Mountain,
  'Belagerung': Mountain,
  'Attentat': Skull,
  'Tod': Skull,
  'Rede': VenetianMask,
  'Verschwörung': Drama,
  'Marcus Antonius': Users,
  'Seeschlacht': Shield,
  'Autobiografie': BookOpen,
  'Vermächtnis': Star,
  'Frieden': Star,
  'Prinzipat': Landmark,
  'Zeit': BookOpen,
  'Nero': Users,
  'Geburt': Star,
  'Rhetorik': VenetianMask,
  'Abenteuer': Mountain,
  'Piraten': Skull,
  'Aufstand': Shield,
  'Sklaven': Users,
  'Korruption': Scale,
  'Bündnis': Users,
  'Krieg': Shield,
  'Ingenieurskunst': BrainCircuit,
  'Britannien': Mountain,
  'Sieg': Star,
  'Spruch': MessageSquare,
  'Pompeius': Users,
  'Rache': Drama,
  'Kunst': BookOpen,
  'Germanien': Mountain,
  'Niederlage': Skull,
  'Exil': Mountain,
  'Ethik': BrainCircuit
};

const popularCategories = ['Politik', 'Philosophie', 'Bürgerkrieg', 'Gallischer Krieg', 'Rede'];


export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || null);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

  const { setCurrentAuthor } = useAuthor();

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setActiveCategory(searchParams.get('category') || null);
  }, [searchParams]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    const newParams = new URLSearchParams(searchParams);
    if (newQuery) {
        newParams.set('q', newQuery);
    } else {
        newParams.delete('q');
    }
    // Debounce updating URL
    const handler = setTimeout(() => {
        setSearchParams(newParams, { replace: true });
    }, 300);
    return () => clearTimeout(handler);
  };

  const handleCategoryChange = (newCategory: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (newCategory) {
        newParams.set('category', newCategory);
        setActiveCategory(newCategory);
    } else {
        newParams.delete('category');
        setActiveCategory(null);
    }
    setSearchParams(newParams, { replace: true });
    setCategoryPopoverOpen(false);
  }

  const results: SearchResult[] = useMemo(() => {
    const searchQuery = (searchParams.get('q') || '').toLowerCase();
    const categoryQuery = (searchParams.get('category') || '').toLowerCase();
    
    let filteredPosts: BlogPost[] = posts;
    let filteredLexicon: LexiconEntry[] = lexicon;

    // Filter by category first
    if (categoryQuery) {
        filteredPosts = filteredPosts.filter(post => 
            post.tags.some(tag => tag.toLowerCase() === categoryQuery)
        );
        filteredLexicon = filteredLexicon.filter(entry =>
            entry.category.toLowerCase() === categoryQuery
        );
    }

    // Then filter by search query
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchQuery) ||
          post.excerpt.toLowerCase().includes(searchQuery) ||
          post.content.diary.toLowerCase().includes(searchQuery) ||
          post.content.scientific.toLowerCase().includes(searchQuery) ||
          authors[post.author].name.toLowerCase().includes(searchQuery)
        );

        filteredLexicon = filteredLexicon.filter(entry =>
          entry.term.toLowerCase().includes(searchQuery) ||
          entry.definition.toLowerCase().includes(searchQuery) ||
          (entry.etymology && entry.etymology.toLowerCase().includes(searchQuery))
        );
    }
    
    if (!searchQuery && !categoryQuery) return [];

    return [...filteredPosts.map(postToSearchResult), ...filteredLexicon.map(lexiconToSearchResult)];

  }, [searchParams]);

  const displayQuery = searchParams.get('q') || searchParams.get('category') || '';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* Hero */}
        <section className="pt-32 pb-16 hero-gradient">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-4xl md:text-5xl mb-4 text-center">
                Suche
              </h1>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Durchsuche die gesamten Annalen..."
                  className="w-full pl-12 pr-4 py-6 text-base rounded-xl"
                  value={query}
                  onChange={handleQueryChange}
                  autoFocus
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Results */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl">
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="flex items-center gap-2 self-start">
                <Tags className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Kategorie:</h3>
              </div>
              
              {activeCategory ? (
                <div className="flex items-center gap-2 p-2 pl-3 rounded-lg bg-primary text-primary-foreground">
                  <span className="font-medium text-sm">{activeCategory}</span>
                  <button onClick={() => handleCategoryChange(null)} className="h-6 w-6 rounded-md bg-black/10 hover:bg-black/20 flex items-center justify-center">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full sm:w-auto text-left justify-start flex-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                      Kategorie auswählen...
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Kategorie suchen..." />
                      <CommandList>
                        <CommandEmpty>Keine Kategorie gefunden.</CommandEmpty>
                        <CommandGroup heading="Beliebte Kategorien">
                          {popularCategories.map((cat) => (
                            <CommandItem key={cat} onSelect={() => handleCategoryChange(cat)}>
                              {cat}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        <CommandGroup heading="Alle Kategorien">
                          {allCategories.map((cat) => (
                             <CommandItem key={cat} onSelect={() => handleCategoryChange(cat)}>
                              {cat}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </motion.div>

            {/* Results */}
            <div className='max-w-2xl mx-auto'>
                {displayQuery ? (
                results.length > 0 ? (
                    <div>
                    <p className="text-sm text-muted-foreground mb-4">
                        {results.length} Ergebnis(se) gefunden
                    </p>
                    <div className="space-y-4">
                        {results.map((result, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            {result.type === 'post' ? (
                            <Link to={`/${result.data.author}/${result.data.slug}`} className="block p-4 rounded-xl bg-card border border-border/50 hover:bg-secondary/50 hover:border-border transition-all group">
                                <div className="flex items-center gap-4">
                                <BookText className="h-5 w-5 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-base group-hover:text-primary transition-colors">{result.data.title}</p>
                                    <p className="text-sm text-muted-foreground truncate">{authors[result.data.author].name} • {result.data.historicalDate}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                            ) : (
                            <Link to={`/lexicon/${result.data.slug}`} className="block p-4 rounded-xl bg-card border border-border/50 hover:bg-secondary/50 hover:border-border transition-all group">
                                <div className="flex items-center gap-4">
                                <BookMarked className="h-5 w-5 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-base group-hover:text-primary transition-colors">{result.data.term}</p>
                                    <p className="text-sm text-muted-foreground truncate">{result.data.category}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                            )}
                        </motion.div>
                        ))}
                    </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                    <p className="text-muted-foreground">
                        Keine Ergebnisse für Ihre Auswahl gefunden.
                    </p>
                    </div>
                )
                ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">
                    Bitte geben Sie einen Suchbegriff ein oder wählen Sie eine Kategorie.
                    </p>
                </div>
                )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
