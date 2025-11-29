
import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { BlogSidebar } from '@/components/BlogSidebar';
import { posts } from '@/data/posts';
import { authors } from '@/data/authors';
import { Author, Perspective } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, Clock } from 'lucide-react';
import { ShareButton } from '@/components/ShareButton';
import NotFound from './NotFound';
import { formatContent } from '@/lib/content-formatter';
import { PerspectiveToggle } from '@/components/PerspectiveToggle';
import { motion } from 'framer-motion';


const calculateReadingTime = (text: string): number => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};


export default function PostPage() {
  const { slug, authorId } = useParams<{ slug: string, authorId: string }>();
  const { setCurrentAuthor } = useAuthor();
  const [perspective, setPerspective] = useState<Perspective>('diary');

  const post = posts.find((p) => p.slug === slug && p.author === authorId);
  const author = post ? authors[post.author] : null;

  const contentToDisplay = post?.content[perspective];

  const readingTime = useMemo(() => {
    return calculateReadingTime(contentToDisplay || '');
  }, [contentToDisplay]);


  useEffect(() => {
    if (authorId && authors[authorId as Author]) {
      setCurrentAuthor(authorId as Author);
    }
  }, [authorId, setCurrentAuthor]);

  const formattedContent = useMemo(() => {
    if (!contentToDisplay) return [];
    return formatContent(contentToDisplay);
  }, [contentToDisplay]);

  if (!post || !author) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">

        {/* Hero Image Section */}
        <section className="relative h-[60vh] min-h-[400px] w-full pt-16">
          <div className="absolute inset-0">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>
        </section>
        
        <div className="container mx-auto pb-12 -mt-24 md:-mt-32">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Main Content */}
            <article>
              {/* Header */}
              <header className="mb-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 mb-6">
                      <img src={author.heroImage} alt={author.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-medium">{author.name}</p>
                        <p className="text-sm text-muted-foreground">{author.title}</p>
                      </div>
                    </div>
                    <ShareButton 
                      title={post.title}
                      text={`Schau mal, was ich gefunden habe: ${window.location.href}`}
                    />
                  </div>

                  {post.latinTitle && (
                    <p className="font-display italic text-lg mb-3 text-primary">
                      „{post.latinTitle}"
                    </p>
                  )}

                  <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-6">
                    {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.historicalDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} Min. Lesezeit</span>
                    </div>
                  </div>

                  <PerspectiveToggle value={perspective} onChange={setPerspective} />
                </motion.div>
              </header>

              {/* Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{delay: 0.2}}
                className="prose-blog"
              >
                {formattedContent}
              </motion.div>

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
