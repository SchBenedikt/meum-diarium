import { useState, useMemo, useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { lexicon, LexiconEntry } from '@/data/lexicon';
import { posts, BlogPost } from '@/data/posts';
import { authors } from '@/data/authors';
import { BookMarked, Search, ArrowRight, BookText, Tags } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { cn } from '@/lib/utils';

type SearchResult = 
  | { type: 'post', data: BlogPost }
  | { type: 'lexicon', data: LexiconEntry };

const postToSearchResult = (post: BlogPost): SearchResult => ({type: 'post', data: post});
const lexiconToSearchResult = (entry: LexiconEntry): SearchResult => ({type: 'lexicon', data: entry});

const allCategories = [...new Set([...posts.flatMap(p => p.tags), ...lexicon.map(l => l.category)])].sort();

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const [query, setQuery] = useState(q);
  const [activeCategory, setActiveCategory] = useState(category);

  const { setCurrentAuthor } = useAuthor();

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  useEffect(() => {
    setQuery(q);
    setActiveCategory(category);
  }, [q, category]);

  useEffect(() => {
    const handler = setTimeout(() => {
        const newParams = new URLSearchParams(searchParams);
        if (query) {
            newParams.set('q', query);
        } else {
            newParams.delete('q');
        }
        setSearchParams(newParams, { replace: true });
    }, 300);

    return () => clearTimeout(handler);
  }, [query, setSearchParams]);

  const handleCategoryChange = (newCategory: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (newCategory) {
        newParams.set('category', newCategory);
    } else {
        newParams.delete('category');
    }
    setSearchParams(newParams, { replace: true });
  }

  const results: SearchResult[] = useMemo(() => {
    const searchQuery = searchParams.get('q')?.toLowerCase();
    const categoryQuery = searchParams.get('category')?.toLowerCase();
    
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
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Results */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl">
             {/* Category Filter */}
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-3">
                <Tags className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Nach Kategorie filtern</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    !activeCategory
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  Alle
                </button>
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
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
                        Keine Ergebnisse für "{displayQuery}" gefunden.
                    </p>
                    </div>
                )
                ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">
                    Bitte gib einen Suchbegriff ein oder wähle eine Kategorie.
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
