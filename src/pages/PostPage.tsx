import React, { useMemo, useState, useEffect, useRef } from 'react';
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
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShareButton } from '@/components/ShareButton';

const calculateReadingTime = (text: string): number => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

function PostContent({ post }: { post: BlogPost }) {
  const { t } = useLanguage();
  const [perspective, setPerspective] = useState<Perspective>('diary');
  
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const contentToDisplay = post?.content[perspective];

  const readingTime = useMemo(() => {
    if (!contentToDisplay) return 0;
    return calculateReadingTime(contentToDisplay);
  }, [contentToDisplay]);

  const formattedContent = useMemo(() => {
    if (!contentToDisplay) return [];
    return formatContent(contentToDisplay, t);
  }, [contentToDisplay, t]);

  return (
    <div ref={targetRef} className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-16">
        
        <div className="relative">
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <motion.img
              src={post.coverImage}
              alt={post.title}
              style={{ 
                y: imageY,
                scale: imageScale,
                opacity: imageOpacity,
                transformOrigin: 'center',
              }}
              className="w-full h-full absolute top-0 left-0 object-cover"
            />
          </div>

          <div className="container mx-auto pb-12">
            <div className="grid lg:grid-cols-[1fr_320px] gap-12">
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative bg-card p-6 md:p-10 rounded-2xl -mt-24 md:-mt-32"
              >
                <header className="mb-10 text-center">
                  <div>
                    {post.latinTitle && (
                      <p className="font-display italic text-lg mb-3 text-primary">
                        „{post.latinTitle}"
                      </p>
                    )}

                    <div className="flex items-start justify-center gap-4 mb-6">
                      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl">
                        {post.title}
                      </h1>
                      <div className="pt-2 hidden sm:block">
                        <ShareButton
                          title={post.title}
                          text={`Schau mal, was ich gefunden habe: ${window.location.href}`}
                          variant="compact"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
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
                  </div>
                </header>

                <div className="prose-blog">
                  {formattedContent}
                </div>
              </motion.article>

              <aside className="hidden lg:block">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="sticky top-28"
                >
                  <BlogSidebar post={post} />
                </motion.div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


export default function PostPage() {
  const { slug, authorId } = useParams<{ slug: string, authorId: string }>();
  const { setCurrentAuthor } = useAuthor();
  const { language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  
  useEffect(() => {
    async function translatePost() {
      const translated = await getTranslatedPost(language, authorId as Author, slug as string);
      setPost(translated);
    }
    translatePost();
  }, [language, authorId, slug]);

  useEffect(() => {
    if (authorId && authorData[authorId as Author]) {
      setCurrentAuthor(authorId as Author);
    }
  }, [authorId, setCurrentAuthor]);

  if (post === undefined) {
    // Still loading
    return <div className="min-h-screen bg-background" />;
  }

  if (!post) {
    return <NotFound />;
  }

  return <PostContent post={post} />;
}
