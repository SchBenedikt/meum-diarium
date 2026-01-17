import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, BookText, BookMarked, User, CornerDownLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/use-posts';
import { authors } from '@/data/authors';
import { lexicon, LexiconEntry } from '@/data/lexicon';
import { BlogPost, Author } from '@/types/blog';
import { getPostTags } from '@/lib/tag-utils';
import { useLanguage } from '@/context/LanguageContext';

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
  const { posts, isLoading } = usePosts();
  const { language } = useLanguage();

  const results: SearchResult[] = useMemo(() => {
    if (isLoading || !query.trim()) return [];
    
    const searchTerm = query.toLowerCase();

    const postResults: SearchResult[] = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.diary.toLowerCase().includes(searchTerm) ||
      authors[post.author].name.toLowerCase().includes(searchTerm) ||
      getPostTags(post, language).some(tag => tag.toLowerCase().includes(searchTerm))
    ).map(post => ({ type: 'post', data: post }));

    const lexiconResults: SearchResult[] = lexicon.filter(entry =>
      entry.term.toLowerCase().includes(searchTerm) ||
      entry.definition.toLowerCase().includes(searchTerm) ||
      entry.category.toLowerCase().includes(searchTerm) ||
      (entry.etymology && entry.etymology.toLowerCase().includes(searchTerm))
    ).map(entry => ({ type: 'lexicon', data: entry }));
    
    const authorResults: SearchResult[] = Object.values(authors).filter(author =>
        author.name.toLowerCase().includes(searchTerm) ||
        author.description.toLowerCase().includes(searchTerm) ||
        author.title.toLowerCase().includes(searchTerm)
    ).map(author => ({type: 'author', data: author}));

    return [...postResults, ...lexiconResults, ...authorResults].slice(0, 8);
  }, [query, posts, isLoading]);

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
    if (results.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % results.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + results.length) % results.length);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNavigation(activeIndex);
      }
    }
  }, [results.length, activeIndex, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 flex items-start justify-center pt-[20vh]">
      <div
        className="bg-background border border-border rounded-[var(--radius)] w-full max-w-2xl mx-4 overflow-hidden"
      >
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach Einträgen, Lexikon, Autoren..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-sm"
            autoFocus
          />
          <button onClick={onClose} className="text-muted-foreground p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 && query.trim() && !isLoading && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Keine Ergebnisse gefunden
            </div>
          )}

          {results.length === 0 && !query.trim() && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Gib einen Suchbegriff ein
            </div>
          )}

          {isLoading && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Lädt...
            </div>
          )}

          {results.map((result, index) => (
            <Link
              key={index}
              to={
                result.type === 'post' ? `/${result.data.author}/${result.data.slug}` :
                result.type === 'lexicon' ? `/lexicon/${result.data.slug}` :
                `/${result.data.id}`
              }
              onClick={onClose}
              className={`block px-4 py-3 border-b border-border last:border-b-0 ${
                index === activeIndex ? 'bg-secondary' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">
                  {result.type === 'post' && <BookText className="h-4 w-4" />}
                  {result.type === 'lexicon' && <BookMarked className="h-4 w-4" />}
                  {result.type === 'author' && <User className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {result.type === 'post' && result.data.title}
                    {result.type === 'lexicon' && result.data.term}
                    {result.type === 'author' && result.data.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                    {result.type === 'post' && result.data.excerpt}
                    {result.type === 'lexicon' && result.data.definition}
                    {result.type === 'author' && result.data.description}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {result.type === 'post' && `Eintrag • ${authors[result.data.author].name}`}
                    {result.type === 'lexicon' && `Lexikon • ${result.data.category}`}
                    {result.type === 'author' && `Autor • ${result.data.title}`}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-border bg-secondary text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs">↓</kbd>
              <span>navigieren</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs">↵</kbd>
              <span>öffnen</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs">esc</kbd>
            <span>schließen</span>
          </span>
        </div>
      </div>
    </div>
  );
}
