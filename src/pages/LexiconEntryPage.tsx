
import React, { useMemo, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { lexicon } from '@/data/lexicon';
import { posts } from '@/data/posts';
import { ArrowLeft, Newspaper, BookOpen } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { LexiconSidebar } from '@/components/LexiconSidebar';
import { motion } from 'framer-motion';
import NotFound from './NotFound';
import { useAuthor } from '@/context/AuthorContext';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

function LexiconTerm({ term, definition, slug }: { term: string, definition: string, slug: string }) {
  const location = useLocation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link 
          to={`/lexicon/${slug}`} 
          state={{ from: location.pathname + location.search }}
          className="inline text-primary border-b border-primary/50 border-dashed cursor-pointer"
        >
          {term}
        </Link>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="p-2">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Lexikon
          </h4>
          <p className="text-sm">{definition}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function formatContent(content: string, currentSlug?: string): React.ReactNode[] {
    const lexiconTerms = lexicon
      .filter(entry => entry.slug !== currentSlug) // Exclude the current term to prevent self-linking
      .map(entry => entry.term)
      .sort((a, b) => b.length - a.length);
      
    if (lexiconTerms.length === 0) {
      return [<p key="line-0">{content}</p>];
    }
      
    const regex = new RegExp(`\\b(${lexiconTerms.join('|')})\\b`, 'gi');

    return content.split(/(\n)/).map((line, lineIndex) => {
        if (line === '\n') {
            return <br key={lineIndex} />;
        }
        
        let processedLine = line;

        const parts: (string | React.ReactNode)[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(processedLine)) !== null) {
            if (match.index > lastIndex) {
                parts.push(processedLine.substring(lastIndex, match.index));
            }

            const term = match[0];
            const lexiconEntry = lexicon.find(entry => entry.term.toLowerCase() === term.toLowerCase());

            if (lexiconEntry) {
                parts.push(
                    <LexiconTerm
                        key={`${lineIndex}-${match.index}`}
                        term={term}
                        definition={lexiconEntry.definition}
                        slug={lexiconEntry.slug}
                    />
                );
            } else {
                parts.push(term);
            }

            lastIndex = match.index + term.length;
        }

        if (lastIndex < processedLine.length) {
            parts.push(processedLine.substring(lastIndex));
        }

        if (line.trim() !== '') {
            return React.createElement('p', { key: lineIndex }, ...parts);
        }

        return null;
    }).filter(Boolean);
}

export default function LexiconEntryPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentAuthor } = useAuthor();

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  const entry = lexicon.find(e => e.slug === slug);
  const fromPost = location.state?.from as string;

  const handleBackClick = () => {
    if (fromPost) {
      navigate(fromPost);
    } else {
      navigate('/lexicon');
    }
  };


  const relatedPosts = useMemo(() => {
    if (!entry) return [];
    const searchTerm = entry.term.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.diary.toLowerCase().includes(searchTerm) ||
      post.content.scientific.toLowerCase().includes(searchTerm)
    ).slice(0, 5);
  }, [entry]);

  const formattedContent = useMemo(() => {
    if (!entry) return [];
    return formatContent(entry.definition, entry.slug);
  }, [entry]);

  if (!entry) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {fromPost ? 'Zurück zum Artikel' : 'Zurück zum Lexikon'}
          </button>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            <article>
              <header className="mb-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Link to={`/search?category=${encodeURIComponent(entry.category)}`}>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 inline-block hover:bg-primary/20 transition-colors">
                      {entry.category}
                    </span>
                  </Link>
                  <h1 className="font-display text-4xl md:text-5xl">{entry.term}</h1>
                </motion.div>
              </header>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose-blog text-lg"
              >
                {formattedContent}
              </motion.div>

              {relatedPosts.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-16"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl font-medium">Relevante Einträge</h2>
                  </div>
                  <div className="relative">
                    <div className="grid md:grid-cols-2 gap-6">
                      {relatedPosts.slice(0,2).map((post, index) => (
                        <BlogCard post={post} index={index} />
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}
            </article>
            
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <LexiconSidebar entry={entry} />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
