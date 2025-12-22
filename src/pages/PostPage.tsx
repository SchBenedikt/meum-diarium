

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { BlogSidebar } from '@/components/BlogSidebar';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedPost } from '@/lib/translator';
import { authors as authorData } from '@/data/authors';
import { usePosts } from '@/hooks/use-posts';
import { Author, Perspective, BlogPost } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, Clock, BookText } from 'lucide-react';
import NotFound from './NotFound';
import { formatContent } from '@/lib/content-formatter';
import { PerspectiveToggle } from '@/components/PerspectiveToggle';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShareButton } from '@/components/ShareButton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BlogCard } from '@/components/BlogCard';

const calculateReadingTime = (text: string): number => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

function PostContent({ post }: { post: BlogPost }) {
  const { t, language } = useLanguage();
  const { posts: allPosts } = usePosts();
  const hasDiary = post?.content?.diary && post.content.diary.trim().length > 0;
  const hasScientific = post?.content?.scientific && post.content.scientific.trim().length > 0;
  const defaultPerspective: Perspective = hasDiary ? 'diary' : (hasScientific ? 'scientific' : 'diary');
  const [perspective, setPerspective] = useState<Perspective>(defaultPerspective);

  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['9vh', '0%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 3]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const contentToDisplay = post?.content[perspective];

  const readingTime = useMemo(() => {
    if (!contentToDisplay) return 0;
    return calculateReadingTime(contentToDisplay);
  }, [contentToDisplay]);

  const formattedContent = useMemo(() => {
    if (!contentToDisplay) return [];
    return formatContent(contentToDisplay, t, language);
  }, [contentToDisplay, t, language]);

  const relatedPosts = allPosts
    .filter(p => p.author === post.author && p.id !== post.id)
    .slice(0, 6);

  return (
    <div ref={targetRef} className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
          <motion.img
            src={post.coverImage}
            alt={post.title}
            style={{
              y: imageY,
              scale: imageScale,
              opacity: imageOpacity,
            }}
            className="w-full h-full absolute top-0 left-0 object-cover object-top"
          />

          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="bg-background pb-12">
          <div className="container mx-auto px-4">
            <div className="relative lg:grid lg:grid-cols-[70%_30%] gap-12">
              <motion.article
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative bg-card p-4 sm:p-6 md:p-10 rounded-lg  lg:-mt-32 pb-12 md:pb-16"
              >
                <header className="mb-8 md:mb-10 text-left">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className='flex-1'>
                      {post.latinTitle && (
                        <p className="font-display italic text-base sm:text-lg mb-2 sm:mb-3 text-primary">
                          „{post.latinTitle}"
                        </p>
                      )}

                      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
                        {post.title}
                      </h1>
                      {post.contentTitles?.[perspective] && (
                        <p className="text-base sm:text-lg text-muted-foreground italic mt-2">
                          {post.contentTitles[perspective]}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4 mb-6 sm:mb-8">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>{post.historicalDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>{t('readingTime', { minutes: String(readingTime) })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-0 sm:pt-2 flex sm:block justify-end flex-shrink-0">
                      <ShareButton
                        title={post.title}
                        text={`Schau mal, was ich gefunden habe: ${window.location.href}`}
                        variant="compact"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <PerspectiveToggle value={perspective} onChange={setPerspective} />
                  </div>
                </header>

                <div className="prose-blog">
                  {formattedContent}
                </div>

              </motion.article>

              {/* Sidebar - below content on mobile, sticky on desktop */}
              <aside className="lg:mt-0 mt-8">
                <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                  <BlogSidebar post={post} />
                </div>
              </aside>
            </div>
          </div>

          <section className="container mx-auto mt-12 sm:mt-16 md:mt-20 px-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <BookText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-medium">{t('morePostsFrom', { name: authorData[post.author].name.split(' ').pop() || '' })}</h2>
            </div>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full -mx-2 sm:mx-0"
            >
              <CarouselContent className="ml-2 sm:-ml-2">
                {relatedPosts.map((relatedPost, index) => (
                  <CarouselItem key={index} className="basis-[85%] sm:basis-1/2 md:basis-1/2 lg:basis-1/3 pl-2 sm:pl-2 py-4">
                    <BlogCard post={relatedPost} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12" />
              <CarouselNext className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12" />
            </Carousel>
          </section>

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
