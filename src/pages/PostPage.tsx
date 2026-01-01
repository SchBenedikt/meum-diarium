

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
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
import { TableOfContents } from '@/components/TableOfContents';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShareButton } from '@/components/ShareButton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BlogCard } from '@/components/BlogCard';
import { SEO } from '@/components/SEO';

const calculateReadingTime = (text: string): number => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

function PostContent({ post }: { post: BlogPost }) {
  const { t, language } = useLanguage();
  const { posts: allPosts } = usePosts();
  const [searchParams] = useSearchParams();
  const hasDiary = post?.content?.diary && post.content.diary.trim().length > 0;
  const hasScientific = post?.content?.scientific && post.content.scientific.trim().length > 0;
  const defaultPerspective: Perspective = hasDiary ? 'diary' : (hasScientific ? 'scientific' : 'diary');
  const requested = (searchParams.get('p') as Perspective | null);
  const initialPerspective: Perspective = requested === 'scientific' && hasScientific
    ? 'scientific'
    : requested === 'diary' && hasDiary
    ? 'diary'
    : defaultPerspective;
  const [perspective, setPerspective] = useState<Perspective>(initialPerspective);

  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['9vh', '0%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 3]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const contentToDisplay = post?.content[perspective];

  // Determine which title to display based on perspective
  const getDisplayTitle = () => {
    if (perspective === 'diary' && post.diaryTitle) {
      return post.diaryTitle;
    } else if (perspective === 'scientific' && post.scientificTitle) {
      return post.scientificTitle;
    }
    return post.title; // Fallback to default title
  };

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

  const author = authorData[post.author as Author];
  const excerpt = post.excerpt || contentToDisplay?.substring(0, 160) || '';

  return (
    <div ref={targetRef} className="min-h-screen flex flex-col bg-background">
      <SEO
        title={getDisplayTitle()}
        description={excerpt}
        author={author?.name}
        image={post.coverImage}
        type="article"
        publishedTime={post.date}
        section={perspective === 'diary' ? 'Tagebuch' : 'Wissenschaftlich'}
        tags={post.tags || []}
      />
      <main className="flex-1">
        <div className="bg-background pb-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-24 md:py-28">
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_350px]">
              <motion.article
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="prose-blog space-y-7 min-w-0"
              >

                <header className="space-y-6 pb-6 border-b border-border/40">
                  <div className="space-y-3">
                    {post.latinTitle && (
                      <p className="font-display italic text-base sm:text-lg text-primary font-light">
                        „{post.latinTitle}"
                      </p>
                    )}

                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                      {getDisplayTitle()}
                    </h1>

                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Beitragsbild unter dem Titel */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[1.25rem] border border-border/40">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        {post.historicalDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        {readingTime} min Lesedauer
                      </span>
                    </div>
                    <div className="pt-0 sm:pt-2 flex sm:block justify-end flex-shrink-0">
                      <ShareButton
                        title={post.title}
                        text={`Schau mal, was ich gefunden habe: ${window.location.href}`}
                        variant="compact"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <PerspectiveToggle value={perspective} onChange={setPerspective} />
                  </div>
                </header>

                <div className="space-y-8">
                  <TableOfContents content={contentToDisplay} title={t('tableOfContents') || 'Inhaltsverzeichnis'} />
                  {formattedContent}
                </div>

              </motion.article>

              {/* Sidebar - below content on mobile, sticky on desktop */}
              <aside className="lg:mt-0 mt-8">
                <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-6">
                  <BlogSidebar post={post} readingTime={readingTime} />
                </div>
              </aside>
            </div>

            {/* Related Articles Section */}
            <section className="mt-20 pt-12 border-t border-border/40">
              <div className="mb-8">
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                  Mehr von {authorData[post.author].name.split(' ').pop()}
                </h2>
                <p className="text-muted-foreground">
                  Weitere Einträge und Artikel zum Weiterlesen
                </p>
              </div>
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent>
                  {relatedPosts.map((relatedPost, index) => (
                    <CarouselItem key={index} className="basis-[100%] sm:basis-1/2 lg:basis-1/3 px-2">
                      <BlogCard post={relatedPost} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {relatedPosts.length > 3 && (
                  <>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                  </>
                )}
              </Carousel>
            </section>
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
