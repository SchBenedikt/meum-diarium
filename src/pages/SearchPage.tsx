import { useState, useMemo, useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { lexicon, LexiconEntry } from '@/data/lexicon';
import { posts, BlogPost } from '@/data/posts';
import { authors } from '@/data/authors';
import { BookMarked, Search, ArrowRight, BookText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { Author } from '@/types/blog';

type SearchResult = 
  | { type: 'post', data: BlogPost }
  | { type: 'lexicon', data: LexiconEntry };

const postToSearchResult = (post: BlogPost): SearchResult => ({type: 'post', data: post});
const lexiconToSearchResult = (entry: LexiconEntry): SearchResult => ({type: 'lexicon', data: entry});


export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const [query, setQuery] = useState(q || category);
  const { setCurrentAuthor } = useAuthor();

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  useEffect(() => {
    setQuery(q || category)
  }, [q, category])

  useEffect(() => {
    // This effect keeps the URL query parameter in sync with the input field
    const handler = setTimeout(() => {
      // Only update 'q' param, clear category if user is typing
      if (query !== category) {
        if (query) {
          setSearchParams({ q: query }, { replace: true });
        } else {
          setSearchParams({}, { replace: true });
        }
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, category, setSearchParams]);


  const results: SearchResult[] = useMemo(() => {
    const searchQuery = searchParams.get('q');
    const categoryQuery = searchParams.get('category');
    
    if (!searchQuery && !categoryQuery) return [];

    let postResults: SearchResult[] = [];
    let lexiconResults: SearchResult[] = [];

    if (categoryQuery) {
        const categoryTerm = categoryQuery.toLowerCase();
        postResults = posts.filter(post => 
            post.tags.some(tag => tag.toLowerCase() === categoryTerm)
        ).map(postToSearchResult);
        
        lexiconResults = lexicon.filter(entry =>
            entry.category.toLowerCase() === categoryTerm
        ).map(lexiconToSearchResult);

    } else if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();

        const postResultsByTerm = posts.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.content.diary.toLowerCase().includes(searchTerm) ||
          post.content.scientific.toLowerCase().includes(searchTerm) ||
          authors[post.author].name.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        ).map(postToSearchResult);

        const lexiconResultsByTerm = lexicon.filter(entry =>
          entry.term.toLowerCase().includes(searchTerm) ||
          entry.definition.toLowerCase().includes(searchTerm) ||
          (entry.etymology && entry.etymology.toLowerCase().includes(searchTerm))
        ).map(lexiconToSearchResult);

        const authorResultsPosts = Object.values(authors).filter(author =>
          author.name.toLowerCase().includes(searchTerm) ||
          author.description.toLowerCase().includes(searchTerm) ||
          author.title.toLowerCase().includes(searchTerm)
        ).flatMap(author => posts.filter(p => p.author === author.id)).map(postToSearchResult);
        
        const allPostIds = new Set([...postResultsByTerm, ...authorResultsPosts].map(p => p.data.id));

        postResults = Array.from(allPostIds).map(id => posts.find(p => p.id === id)).map(p => postToSearchResult(p!));
        lexiconResults = lexiconResultsByTerm;
    }
    
    return [...postResults, ...lexiconResults];

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

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto max-w-2xl">
            {displayQuery ? (
              results.length > 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {results.length} Ergebnis(se) für "{displayQuery}"
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
                  Bitte gib einen Suchbegriff ein.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
