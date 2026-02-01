import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, BookText, BookMarked, User, CornerDownLeft, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/use-posts';
import { useLexicon } from '@/hooks/use-lexicon';
import { authors } from '@/data/authors';
import { works } from '@/data/works';
import { workDetails } from '@/data/work-details';
import { BlogPost, Author, LexiconEntry, Work } from '@/types/blog';
import { getPostTags } from '@/lib/tag-utils';
import { useLanguage } from '@/context/LanguageContext';
import slugify from 'slugify';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResult =
  | { type: 'post', data: BlogPost }
  | { type: 'lexicon', data: LexiconEntry }
  | { type: 'author', data: typeof authors[Author] }
  | { type: 'work', data: Work, authorId: string };

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { posts, isLoading } = usePosts();
  const { lexicon = [] } = useLexicon();
  const { language } = useLanguage();

  // Helper function to extract searchable text from work details
  const getWorkSearchableContent = (slug: string): string => {
    const detail = workDetails[slug as keyof typeof workDetails];
    if (!detail) return '';

    const parts: string[] = [];

    // Add context paragraphs
    if (detail.context?.paragraphs) {
      parts.push(...detail.context.paragraphs);
    }

    // Add quotes
    if (detail.quotes) {
      detail.quotes.forEach(q => {
        parts.push(q.latin, q.translation, q.context);
      });
    }

    // Add sections
    if (detail.sections) {
      detail.sections.forEach(s => {
        parts.push(s.title, ...s.content);
      });
    }

    // Add key moments
    if (detail.keyMoments) {
      detail.keyMoments.forEach(m => {
        parts.push(m.title, m.description, m.significance);
      });
    }

    // Add literary features
    if (detail.literaryFeatures) {
      detail.literaryFeatures.forEach(f => {
        parts.push(f.title, f.description);
        if (f.examples) parts.push(...f.examples);
      });
    }

    // Add book chapters
    if (detail.bookChapters) {
      detail.bookChapters.forEach(b => {
        parts.push(b.title, b.description);
        if (b.keyEvents) parts.push(...b.keyEvents);
      });
    }

    // Add impact
    if (detail.impact) {
      parts.push(detail.impact.title);
      parts.push(...detail.impact.paragraphs);
      parts.push(...detail.impact.highlights);
    }

    return parts.join(' ').toLowerCase();
  };

  const results: SearchResult[] = useMemo(() => {
    if (isLoading || !query.trim()) return [];

    const searchTerm = query.toLowerCase();

    const postResults: SearchResult[] = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.diary.toLowerCase().includes(searchTerm) ||
      (authors[post.author]?.name || '').toLowerCase().includes(searchTerm) ||
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
    ).map(author => ({ type: 'author', data: author }));

    const workResults: SearchResult[] = Object.entries(works).filter(([slug, work]) => {
      const searchableText = [
        work.title,
        work.summary,
        work.takeaway,
        ...(work.structure?.map(s => s.title + ' ' + s.content) || []),
        authors[work.author as Author]?.name || '',
        getWorkSearchableContent(slug)
      ].map(t => (t || '').toString().toLowerCase()).join(' ');
      return searchableText.includes(searchTerm);
    }).map(([slug, work]) => ({ 
      type: 'work', 
      data: work, 
      authorId: work.author as string 
    }));

    return [...postResults, ...workResults, ...lexiconResults, ...authorResults].slice(0, 8);
  }, [query, posts, isLoading]);

  const handleNavigation = (index: number) => {
    if (index < 0 || index >= results.length) return;
    const result = results[index];
    let path = '/';
    if (result.type === 'post') path = `/${result.data.author}/${result.data.slug}`;
    if (result.type === 'lexicon') path = `/lexicon/${result.data.slug}`;
    if (result.type === 'author') path = `/${result.data.id}`;
    if (result.type === 'work') {
      const workSlug = slugify(result.data.title, { lower: true, strict: true });
      path = `/${result.authorId}/works/${workSlug}`;
    }

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
  }, [results.length, activeIndex, onClose, handleNavigation]); // Added handleNavigation to dependencies

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            className="bg-background border border-border rounded-[var(--radius)] w-full max-w-2xl mx-4 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center border-b border-border px-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suche nach Einträgen, Werken, Lexikon, Autoren..."
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
                        result.type === 'work' ? `/${result.authorId}/works/${slugify(result.data.title, { lower: true, strict: true })}` :
                          `/${result.data.id}`
                  }
                  onClick={onClose}
                  className={`block px-4 py-3 border-b border-border last:border-b-0 ${index === activeIndex ? 'bg-secondary' : ''
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-primary">
                      {result.type === 'post' && <BookText className="h-4 w-4" />}
                      {result.type === 'lexicon' && <BookMarked className="h-4 w-4" />}
                      {result.type === 'author' && <User className="h-4 w-4" />}
                      {result.type === 'work' && <Book className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {result.type === 'post' && result.data.title}
                        {result.type === 'lexicon' && result.data.term}
                        {result.type === 'author' && result.data.name}
                        {result.type === 'work' && result.data.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {result.type === 'post' && result.data.excerpt}
                        {result.type === 'lexicon' && result.data.definition}
                        {result.type === 'author' && result.data.description}
                        {result.type === 'work' && result.data.summary}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.type === 'post' && `Eintrag • ${authors[result.data.author]?.name || result.data.author}`}
                        {result.type === 'lexicon' && `Lexikon • ${result.data.category}`}
                        {result.type === 'author' && `Autor • ${result.data.title}`}
                        {result.type === 'work' && `Werk • ${authors[result.authorId as Author]?.name || result.authorId}`}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
