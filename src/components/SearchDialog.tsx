import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, BookText, BookMarked, User, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { posts } from '@/data/posts';
import { authors } from '@/data/authors';
import { lexicon, LexiconEntry } from '@/data/lexicon';
import { BlogPost, Author } from '@/types/blog';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResult = 
  | { type: 'post', data: BlogPost }
  | { type: 'lexicon', data: LexiconEntry }
  | { type: 'author', data: typeof authors[Author] };

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();

    const postResults: SearchResult[] = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.diary.toLowerCase().includes(searchTerm) ||
      post.content.scientific.toLowerCase().includes(searchTerm) ||
      authors[post.author].name.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    ).map(post => ({ type: 'post', data: post }));

    const lexiconResults: SearchResult[] = lexicon.filter(entry =>
      entry.term.toLowerCase().includes(searchTerm) ||
      entry.definition.toLowerCase().includes(searchTerm) ||
      (entry.etymology && entry.etymology.toLowerCase().includes(searchTerm))
    ).map(entry => ({ type: 'lexicon', data: entry }));
    
    const authorResults: SearchResult[] = Object.values(authors).filter(author =>
        author.name.toLowerCase().includes(searchTerm) ||
        author.description.toLowerCase().includes(searchTerm) ||
        author.title.toLowerCase().includes(searchTerm)
    ).map(author => ({type: 'author', data: author}));

    return [...postResults, ...lexiconResults, ...authorResults].slice(0, 7);
  }, [query]);

  const handleNavigation = (index: number) => {
    if (index < 0 || index >= results.length) return;
    const result = results[index];
    let path = '/';
    if (result.type === 'post') path = `/${result.data.author}/${result.data.slug}`;
    if (result.type === 'lexicon') path = `/lexicon/${result.data.slug}`;
    if (result.type === 'author') path = `/${result.data.id}`;
    
    navigate(path);
    onClose();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      // Logic to open/close is in Header.tsx
    }
    if (results.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (query.trim()) {
           if (e.shiftKey) {
             navigate(`/search?q=${encodeURIComponent(query)}`);
             onClose();
           } else {
             handleNavigation(activeIndex);
           }
        }
      }
    } else if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  }, [onClose, results, activeIndex, query, navigate]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
    setActiveIndex(0);
  }, [isOpen]);
  
  // This resets the active index when the query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);


  const groupedResults = useMemo(() => {
    return results.reduce((acc, result) => {
      const key = result.type === 'post' ? 'Tagebucheinträge' : result.type === 'lexicon' ? 'Lexikoneinträge' : 'Autoren';
      if (!acc[key]) acc[key] = [];
      acc[key].push(result);
      return acc;
    }, {} as Record<string, SearchResult[]>);
  }, [results]);
  
  const getGlobalIndex = (groupKey: string, localIndex: number) => {
    let globalIndex = 0;
    for (const key of ['Tagebucheinträge', 'Lexikoneinträge', 'Autoren']) {
      if (key === groupKey) {
        globalIndex += localIndex;
        break;
      }
      globalIndex += (groupedResults[key]?.length || 0);
    }
    return globalIndex;
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] sm:pt-[15vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl"
            >
              <div className="overflow-hidden rounded-2xl bg-card border border-border shadow-2xl">
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Suche nach Einträgen, Autoren, Lexikon..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                  />
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded bg-secondary px-2 text-xs text-muted-foreground">
                    ESC
                  </kbd>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  {query.trim() === '' ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        Beginne mit der Eingabe, um zu suchen.
                      </p>
                    </div>
                  ) : results.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        Keine Ergebnisse für "{query}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                       {Object.entries(groupedResults).map(([groupName, groupResults]) => (
                        <div key={groupName} className="mb-2 last:mb-0">
                          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">{groupName}</p>
                          {groupResults.map((result, index) => {
                            const globalIndex = getGlobalIndex(groupName, index);
                            if (result.type === 'post') {
                              return (
                                <Link
                                  key={result.data.id}
                                  to={`/${result.data.author}/${result.data.slug}`}
                                  onClick={onClose}
                                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors group ${globalIndex === activeIndex ? 'bg-secondary' : ''}`}
                                  onMouseMove={() => setActiveIndex(globalIndex)}
                                >
                                  <BookText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-foreground truncate">{result.data.title}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{authors[result.data.author].name}</p>
                                  </div>
                                </Link>
                              )
                            }
                            if (result.type === 'lexicon') {
                              return (
                                <Link
                                  key={result.data.slug}
                                  to={`/lexicon/${result.data.slug}`}
                                  onClick={onClose}
                                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors group ${globalIndex === activeIndex ? 'bg-secondary' : ''}`}
                                  onMouseMove={() => setActiveIndex(globalIndex)}
                                >
                                  <BookMarked className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-foreground truncate">{result.data.term}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{result.data.category}</p>
                                  </div>
                                </Link>
                              )
                            }
                            if (result.type === 'author') {
                                return (
                                <Link
                                  key={result.data.id}
                                  to={`/${result.data.id}`}
                                  onClick={onClose}
                                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors group ${globalIndex === activeIndex ? 'bg-secondary' : ''}`}
                                  onMouseMove={() => setActiveIndex(globalIndex)}
                                >
                                  <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-foreground truncate">{result.data.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{result.data.title}</p>
                                  </div>
                                </Link>
                              )
                            }
                            return null;
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {query && (
                    <div className="p-2 border-t border-border">
                        <Link 
                            to={`/search?q=${encodeURIComponent(query)}`}
                            onClick={onClose}
                            className={`flex w-full items-center justify-between p-3 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground`}
                        >
                            <span className="flex items-center gap-2">
                                <Search className="h-4 w-4"/>
                                Suche nach "{query}"
                            </span>
                            <CornerDownLeft className="h-4 w-4"/>
                        </Link>
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
