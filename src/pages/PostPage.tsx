import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { BlogSidebar } from '@/components/BlogSidebar';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedPost } from '@/lib/translator';
import { authors as authorData } from '@/data/authors';
import { Author, Perspective, BlogPost } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, Clock } from 'lucide-react';
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
  const { language, t } = useLanguage();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  
  useEffect(() => {
    async function translatePost() {
      const translated = await getTranslatedPost(language, authorId as Author, slug as string);
      setPost(translated);
    }
    translatePost();
  }, [language, authorId, slug]);

  const author = post ? authorData[post.author] : null;

  const contentToDisplay = post?.content[perspective];

  const readingTime = useMemo(() => {
    if (!contentToDisplay) return 0;
    return calculateReadingTime(contentToDisplay);
  }, [contentToDisplay]);

  useEffect(() => {
    if (authorId && authorData[authorId as Author]) {
      setCurrentAuthor(authorId as Author);
    }
  }, [authorId, setCurrentAuthor]);

  const formattedContent = useMemo(() => {
    if (!contentToDisplay) return [];
    return formatContent(contentToDisplay, t);
  }, [contentToDisplay, t]);

  if (post === undefined) {
    // Still loading
    return <div className="min-h-screen bg-background" />;
  }

  if (!post || !author) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="absolute top-0 left-0 right-0 h-[60vh] min-h-[400px] w-full">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
        
        <div className="container mx-auto pb-12 pt-20 relative z-10">
          <div className="h-[calc(60vh-80px)] min-h-[320px] w-full"></div>
          
          <div className="grid lg:grid-cols-[1fr_320px] gap-12 -mt-16 md:-mt-24">
            <article>
              <header className="mb-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}}>
                  {post.latinTitle && (
                    <p className="font-display italic text-lg mb-3 text-primary">
                      „{post.latinTitle}"
                    </p>
                  )}

                  <div className="flex items-start justify-between gap-4 mb-6">
                    <h1 className="font-display text-3xl md:text-4xl lg:text-5xl">
                      {post.title}
                    </h1>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.historicalDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{t('readingTime', { minutes: String(readingTime) })}</span>
                    </div>
                  </div>

                  <PerspectiveToggle value={perspective} onChange={setPerspective} />
                </motion.div>
              </header>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{delay: 0.2}}
                className="prose-blog"
              >
                {formattedContent}
              </motion.div>
            </article>

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
