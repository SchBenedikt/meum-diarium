import React, { useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { BlogSidebar } from '@/components/BlogSidebar';
import { posts } from '@/data/posts';
import { authors } from '@/data/authors';
import { Author } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, Clock } from 'lucide-react';
import { ShareButton } from '@/components/ShareButton';
import NotFound from './NotFound';
import { formatContent } from '@/lib/content-formatter';

export default function PostPage() {
  const { slug, authorId } = useParams<{ slug: string, authorId: string }>();
  const { setCurrentAuthor } = useAuthor();

  const post = posts.find((p) => p.slug === slug && p.author === authorId);
  const author = post ? authors[post.author] : null;

  const readingTime = post ? post.readingTime : 0;

  useEffect(() => {
    if (authorId && authors[authorId as Author]) {
      setCurrentAuthor(authorId as Author);
    }
    
  }, [authorId, setCurrentAuthor]);

  const formattedContent = useMemo(() => {
    if (!post) return [];
    const contentToFormat = post.content.diary;
    return formatContent(contentToFormat);
  }, [post]);

  if (!post || !author) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-28 pb-12">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Main Content */}
            <article>
              {/* Header */}
              <header className="mb-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 mb-6 animate-in">
                    <img src={author.heroImage} alt={author.name} className="h-12 w-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-medium">{author.name}</p>
                      <p className="text-sm text-muted-foreground">{author.title}</p>
                    </div>
                  </div>
                  <div className="animate-in stagger-1">
                    <ShareButton 
                      title={post.title}
                      text={`Schau mal, was ich gefunden habe: ${window.location.href}`}
                    />
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
              <div className="sticky top-28">
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
