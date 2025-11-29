import { useState, useMemo, useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { lexicon as baseLexicon, LexiconEntry } from '@/data/lexicon';
import { posts as basePosts, BlogPost } from '@/data/posts';
import { authors } from '@/data/authors';
import { BookMarked, Search, ArrowRight, BookText, Tags, X, Check, Landmark, Scale, Sword, Brain, BookHeart, Drama, ChevronsRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedLexicon, getTranslatedPost } from '@/lib/translator';

type SearchResult = 
  | { type: 'post', data: BlogPost }
  | { type: 'lexicon', data: LexiconEntry };

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

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useLanguage();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeCategories, setActiveCategories] = useState<string[]>(searchParams.getAll('category') || []);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const { setCurrentAuthor } = useAuthor();

  const [posts, setPosts] = useState<BlogPost[]>(basePosts);
  const [lexicon, setLexicon] = useState<LexiconEntry[]>(baseLexicon);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  useEffect(() => {
    async function translateContent() {
      const translatedLexicon = await getTranslatedLexicon(language);
      setLexicon(translatedLexicon);
      const translatedPosts = await Promise.all(basePosts.map(p => getTranslatedPost(language, p.author, p.slug)));
      setPosts(translatedPosts.filter((p): p is BlogPost => p !== null));
    }
    translateContent();
  }, [language]);

  useEffect(() => {
      setAllCategories([...new Set([...posts.flatMap(p => p.tags), ...lexicon.map(l => l.category)])].sort());
  }, [posts, lexicon]);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setActiveCategories(searchParams.getAll('category') || []);
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
    const handler = setTimeout(() => {
        setSearchParams(newParams, { replace: true });
    }, 300);
    return () => clearTimeout(handler);
  };

  const toggleCategory = (category: string) => {
    const newActiveCategories = activeCategories.includes(category)
        ? activeCategories.filter(c => c !== category)
        : [...activeCategories, category];
    
    setActiveCategories(newActiveCategories);

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    newActiveCategories.forEach(cat => newParams.append('category', cat));
    setSearchParams(newParams, { replace: true });
  }

  const results: SearchResult[] = useMemo(() => {
    const searchQuery = (searchParams.get('q') || '').toLowerCase();
    const categoryQuery = searchParams.getAll('category');
    
    if (!searchQuery && categoryQuery.length === 0) return [];
    
    let filteredPosts: BlogPost[] = posts;
    let filteredLexicon: LexiconEntry[] = lexicon;

    if (categoryQuery.length > 0) {
        filteredPosts = filteredPosts.filter(post => 
            categoryQuery.some(cat => post.tags.includes(cat))
        );
        filteredLexicon = filteredLexicon.filter(entry =>
            categoryQuery.includes(entry.category)
        );
    }

    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchQuery) ||
          post.excerpt.toLowerCase().includes(searchQuery) ||
          post.content.diary.toLowerCase().includes(searchQuery) ||
          authors[post.author].name.toLowerCase().includes(searchQuery)
        );

        filteredLexicon = filteredLexicon.filter(entry =>
          entry.term.toLowerCase().includes(searchQuery) ||
          entry.definition.toLowerCase().includes(searchQuery) ||
          (entry.etymology && entry.etymology.toLowerCase().includes(searchQuery))
        );
    }
    
    return [...filteredPosts.map(p => ({type: 'post', data: p}) as SearchResult), ...filteredLexicon.map(l => ({type: 'lexicon', data: l}) as SearchResult)];

  }, [searchParams, posts, lexicon]);

  const displayQuery = query || activeCategories.join(', ');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="pt-32 pb-16 hero-gradient">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="font-display text-4xl md:text-5xl mb-4 text-center">{t('search')}</h1>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="text" placeholder={t('searchPlaceholder')} className="w-full pl-12 pr-4 py-6 text-base rounded-xl" value={query} onChange={handleQueryChange} autoFocus />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-4xl">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-10">
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                {topCategories.map(cat => {
                  const Icon = categoryIcons[cat] || BookMarked;
                  const isActive = activeCategories.includes(cat);
                  return (
                    <button key={cat} onClick={() => toggleCategory(cat)} className={cn('group flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all', isActive ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-border hover:bg-secondary/50')}>
                      <Icon className={cn('h-6 w-6 mb-2', isActive ? 'text-primary' : 'text-muted-foreground')} />
                      <span className={cn('text-sm font-medium', isActive ? 'text-primary' : 'text-foreground')}>{cat}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {activeCategories.map(cat => (
                    <div key={cat} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-primary/20 text-primary w-fit">
                      <span className="font-medium text-sm">{cat}</span>
                      <button onClick={() => toggleCategory(cat)} className="h-5 w-5 rounded-md bg-black/10 hover:bg-black/20 flex items-center justify-center text-primary/80 hover:text-primary"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
                <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                  <PopoverTrigger asChild><Button variant="outline" size="sm">{t('allCategories')}</Button></PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Kategorie suchen..." />
                      <CommandList>
                        <CommandEmpty>Keine Kategorie gefunden.</CommandEmpty>
                        <CommandGroup>
                          {allCategories.map((cat) => (
                             <CommandItem key={cat} onSelect={() => toggleCategory(cat)}>
                              <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", activeCategories.includes(cat) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")}><Check className={cn("h-4 w-4")} /></div>
                              {cat}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>

            <div className='max-w-2xl mx-auto'>
                {displayQuery ? (
                results.length > 0 ? (
                    <div>
                    <p className="text-sm text-muted-foreground mb-4">{t('resultsFound', { count: String(results.length) })}</p>
                    <div className="space-y-4">
                        {results.map((result, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
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
                    <div className="text-center py-16"><p className="text-muted-foreground">{t('noEntriesFound')}</p></div>
                )
                ) : (
                <div className="text-center py-16"><p className="text-muted-foreground">{t('searchOrSelectCategory')}</p></div>
                )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
