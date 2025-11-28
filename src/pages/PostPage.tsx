import React, { useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { PerspectiveToggle } from '@/components/PerspectiveToggle';
import { BlogSidebar } from '@/components/BlogSidebar';
import { posts } from '@/data/posts';
import { authors } from '@/data/authors';
import { lexicon } from '@/data/lexicon';
import { Perspective, Author } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { ArrowLeft, Clock, Calendar, BookOpen } from 'lucide-react';
import { ShareButton } from '@/components/ShareButton';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import NotFound from './NotFound';

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

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


function formatContent(content: string): React.ReactNode[] {
    const lexiconTerms = lexicon.map(entry => entry.term).sort((a, b) => b.length - a.length);
    const regex = new RegExp(`\\b(${lexiconTerms.join('|')})\\b`, 'gi');

    return content.split(/(\n)/).map((line, lineIndex) => {
        if (line === '\n') {
            return <br key={lineIndex} />;
        }
        
        let processedLine = line
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^### (.+)/, '<h3>$1</h3>')
            .replace(/^## (.+)/, '<h2>$1</h2>')
            .replace(/^> (.+)/, '<blockquote>$1</blockquote>');

        const parts: (string | React.ReactNode)[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(processedLine)) !== null) {
            if (match.index > lastIndex) {
                parts.push(<span key={`${lineIndex}-${lastIndex}`} dangerouslySetInnerHTML={{ __html: processedLine.substring(lastIndex, match.index) }} />);
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
            parts.push(<span key={`${lineIndex}-end`} dangerouslySetInnerHTML={{ __html: processedLine.substring(lastIndex) }} />);
        }

        if (line.trim() !== '') {
            if (line.startsWith('<h2>') || line.startsWith('<h3>') || line.startsWith('<blockquote>')) {
                 return <div key={lineIndex} dangerouslySetInnerHTML={{ __html: processedLine.replace(/<p>|<\/p>/g, '') }} />;
            }
            return React.createElement('p', { key: lineIndex }, ...parts);
        }

        return null;
    }).filter(Boolean);
}


export default function PostPage() {
  const { slug, authorId } = useParams<{ slug: string, authorId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setCurrentAuthor } = useAuthor();

  const perspectiveParam = searchParams.get('perspective') as Perspective | null;
  const [perspective, setPerspective] = useState<Perspective>(perspectiveParam || 'diary');

  const post = posts.find((p) => p.slug === slug && p.author === authorId);
  const author = post ? authors[post.author] : null;

  const readingTime = useMemo(() => {
    if (!post) return 0;
    const content = perspective === 'diary' ? post.content.diary : post.content.scientific;
    return calculateReadingTime(content);
  }, [post, perspective]);

  useEffect(() => {
    if (authorId && authors[authorId as Author]) {
      setCurrentAuthor(authorId as Author);
    }
    
  }, [authorId, setCurrentAuthor]);

  useEffect(() => {
    setSearchParams({ perspective });
  }, [perspective, setSearchParams]);

  const formattedContent = useMemo(() => {
    if (!post) return [];
    const contentToFormat = perspective === 'diary' ? post.content.diary : post.content.scientific;
    return formatContent(contentToFormat);
  }, [post, perspective]);

  if (!post || !author) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto">
          {/* Back link */}
          <Link 
            to={`/${authorId}`} 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zum Diarium von {author.name.split(' ').pop()}
          </Link>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Main Content */}
            <article>
              {/* Header */}
              <header className="mb-12">
                <div className="flex items-center gap-3 mb-6 animate-in">
                  <img src={author.heroImage} alt={author.name} className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-medium">{author.name}</p>
                    <p className="text-sm text-muted-foreground">{author.title}</p>
                  </div>
                </div>

                {post.latinTitle && (
                  <p className="font-display italic text-lg mb-3 text-primary animate-in stagger-1">
                    „{post.latinTitle}"
                  </p>
                )}

                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-6 animate-in stagger-2">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 animate-in stagger-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{post.historicalDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} Min. Lesezeit</span>
                  </div>
                </div>

                <div className="animate-in stagger-4 flex flex-wrap gap-4 items-center justify-between">
                  <div className="relative z-10">
                    <PerspectiveToggle value={perspective} onChange={setPerspective} />
                  </div>
                   <ShareButton 
                    title={post.title}
                    text={post.excerpt}
                    variant="compact"
                  />
                </div>
              </header>

              {/* Content */}
              <div className="animate-in stagger-5">
                <div className="prose-blog leading-relaxed">
                  {formattedContent}
                </div>
              </div>

            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-40">
                <BlogSidebar post={post} />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
