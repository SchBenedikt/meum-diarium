import { useState, useEffect, useMemo } from 'react';
import { Search, X, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { posts } from '@/data/posts';
import { authors } from '@/data/authors';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      authors[post.author].name.toLowerCase().includes(searchTerm)
    ).slice(0, 6);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuery('');
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const authorColorClasses: Record<string, string> = {
    caesar: 'bg-author-caesar',
    cicero: 'bg-author-cicero',
    augustus: 'bg-author-augustus',
    seneca: 'bg-author-seneca',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Dialog Wrapper for centering */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-xl"
            >
              <div className="overflow-hidden rounded-2xl bg-card border border-border shadow-2xl">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Suche nach Einträgen, Autoren, Tags..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                  />
                  {query && (
                    <button 
                      onClick={() => setQuery('')}
                      className="p-1 rounded-md hover:bg-secondary transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded bg-secondary px-2 text-xs text-muted-foreground">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {query.trim() === '' ? (
                    <div className="p-8 text-center">
                      <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Beginne mit der Eingabe, um Tagebucheinträge zu finden
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {['Caesar', 'Gallien', 'Philosophie', 'Senat'].map(term => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 rounded-full bg-secondary text-sm text-secondary-foreground hover:bg-secondary/80 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : results.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        Keine Ergebnisse für "{query}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {results.map((post, index) => (
                        <Link
                          key={post.id}
                          to={`/post/${post.slug}`}
                          onClick={onClose}
                          className="flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
                        >
                          <div className={`h-10 w-10 rounded-xl ${authorColorClasses[post.author]} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white font-semibold text-sm">
                              {authors[post.author].name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <User className="h-3 w-3" />
                                {authors[post.author].name}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {post.readingTime} Min.
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-border bg-secondary/30">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{results.length} Ergebnisse</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <kbd className="h-5 px-1.5 rounded bg-secondary">↑</kbd>
                        <kbd className="h-5 px-1.5 rounded bg-secondary">↓</kbd>
                        navigieren
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="h-5 px-1.5 rounded bg-secondary">↵</kbd>
                        öffnen
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
