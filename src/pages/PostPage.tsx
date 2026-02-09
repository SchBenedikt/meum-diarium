import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BlogSidebar } from '@/components/BlogSidebar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { authors as authorData } from '@/data/authors';
import { usePosts } from '@/hooks/use-posts';
import { Author, Perspective, BlogPost, Language } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, Clock, BookText } from 'lucide-react';
import NotFound from './NotFound';
import { FormattedContent } from '@/components/FormattedContent';
import { PerspectiveToggle } from '@/components/PerspectiveToggle';
import { TableOfContents } from '@/components/TableOfContents';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShareButton } from '@/components/ShareButton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BlogCard } from '@/components/BlogCard';
import { SEO } from '@/components/SEO';
import { PostTags } from '@/components/PostTags';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { CommentSection } from '@/components/CommentSection';
import { getApiBase } from '@/lib/api';
const calculateReadingTime = (text: string): number => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
function PostContent({ post }: { post: BlogPost }) {
  const { t, language } = useLanguage();
  const { user, token } = useAuth();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [searchParams] = useSearchParams();
  const [perspective, setPerspective] = useState<Perspective>('diary');
  const targetRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const lastProgressRef = useRef<number>(0);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['9vh', '0%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 3]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  
  // Track reading progress
  const trackReadingProgress = useCallback(async () => {
    if (!user || !token || !post?.id) return;
    
    const currentTime = Date.now();
    const readingTimeSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);
    const progressPercentage = Math.round(scrollYProgress.get() * 100);
    
    // Only track if there's meaningful progress or time spent
    if (readingTimeSeconds > 5 || progressPercentage > lastProgressRef.current) {
      try {
        await fetch('/api/reading-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            postId: post.id,
            readingTimeSeconds: Math.max(0, readingTimeSeconds),
            progressPercentage,
            lastPosition: Math.round(progressPercentage * 100), // Store as 0-10000 for more precision
          }),
        });
        
        lastProgressRef.current = progressPercentage;
        startTimeRef.current = currentTime; // Reset start time for next tracking
      } catch (error) {
        console.error('Error tracking reading progress:', error);
      }
    }
  }, [user, token, post?.id, scrollYProgress]);

  // Track progress on scroll and on unmount
  useEffect(() => {
    const handleScroll = () => {
      trackReadingProgress();
    };

    const handleBeforeUnload = () => {
      trackReadingProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackReadingProgress(); // Final progress update
    };
  }, [trackReadingProgress]);

  // Track completion when reaching 100%
  useEffect(() => {
    const progress = Math.round(scrollYProgress.get() * 100);
    if (progress === 100 && lastProgressRef.current < 100) {
      trackReadingProgress();
    }
  }, [scrollYProgress, trackReadingProgress]);
  
  const contentToDisplay = useMemo(() => post?.content?.[perspective], [post, perspective]);
  
  const readingTime = useMemo(() => {
    if (!contentToDisplay) return 0;
    return calculateReadingTime(contentToDisplay);
  }, [contentToDisplay]);
  
  // Safely get related posts, fallback to empty array if allPosts loading
  const relatedPosts = useMemo(() => {
    if (!Array.isArray(allPosts) || !post?.author || !post?.slug) {
      console.warn('[PostContent] Cannot filter posts:', { 
        allPostsArray: Array.isArray(allPosts),
        author: post?.author,
        slug: post?.slug 
      });
      return [];
    }
    return allPosts
      .filter(p => p?.author === post.author && p?.slug !== post.slug)
      .slice(0, 6);
  }, [allPosts, post?.author, post?.slug]);
  
  // Determine which title to display based on perspective
  const getDisplayTitle = useCallback(() => {
    if (perspective === 'diary' && post?.diaryTitle) {
      return post.diaryTitle;
    } else if (perspective === 'scientific' && post?.scientificTitle) {
      return post.scientificTitle;
    }
    return post?.title || 'Untitled'; // Fallback
  }, [perspective, post]);
  
  // Update perspective based on URL params and content availability
  useEffect(() => {
    if (!post) return;
    
    const hasDiary = post?.content?.diary && post.content.diary.trim().length > 0;
    const hasScientific = post?.content?.scientific && post.content.scientific.trim().length > 0;
    const defaultPerspective: Perspective = hasDiary ? 'diary' : (hasScientific ? 'scientific' : 'diary');
    const requested = (searchParams.get('p') as Perspective | null);
    const initialPerspective: Perspective = requested === 'scientific' && hasScientific
      ? 'scientific'
      : requested === 'diary' && hasDiary
        ? 'diary'
        : defaultPerspective;
    
    if (perspective !== initialPerspective) {
      setPerspective(initialPerspective);
    }
  }, [post, searchParams, perspective]);
  
  if (!post) {
    console.error('[PostContent] Post is null/undefined');
    return <NotFound />;
  }
  
  const author = post?.author ? authorData[post.author as Author] : null;
  const excerpt = post?.excerpt || contentToDisplay?.substring(0, 160) || '';
  return (
    <div ref={targetRef} className="min-h-screen flex flex-col bg-background">
      <SEO
        title={getDisplayTitle()}
        description={excerpt}
        author={author?.name}
        image={post?.coverImage}
        type="article"
        publishedTime={post?.date}
        section={perspective === 'diary' ? 'Tagebuch' : 'Wissenschaftlich'}
        tags={post?.tagsWithTranslations && post.tagsWithTranslations.length > 0
          ? post.tagsWithTranslations.map(t => t.translations.de)
          : (post?.tags || [])}
      />
      <main className="flex-1">
        <div className="bg-background pb-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-24 md:py-28">
            <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-[1fr_350px]">
              <motion.article
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="prose-blog space-y-7 min-w-0"
              >
                <header className="space-y-5 pb-8 border-b border-border/40">
                  <div className="space-y-4">
                    {post.latinTitle && (
                      <p className="font-display italic text-base text-primary/80 font-light">
                        „{post.latinTitle}“
                      </p>
                    )}
                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                      {getDisplayTitle()}
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  {/* Beitragsbild unter dem Titel */}
                  <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-border/40">
                    <ImageWithFallback
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {post.historicalDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {readingTime} min
                      </span>
                    </div>
                    <ShareButton
                      title={post.title}
                      text={`Schau mal, was ich gefunden habe: ${window.location.href}`}
                      variant="compact"
                    />
                  </div>
                  <PerspectiveToggle value={perspective} onChange={setPerspective} />
                </header>
                <div className="space-y-8">
                  <TableOfContents content={contentToDisplay} title={t('tableOfContents') || 'Inhaltsverzeichnis'} />
                  <FormattedContent content={contentToDisplay} language={language as Language} currentSlug={post?.slug} />
                </div>
              </motion.article>
              {/* Sidebar - below content on mobile, sticky on desktop */}
              <aside className="order-last lg:order-none">
                <div className="lg:sticky lg:top-24 space-y-6">
                  <BlogSidebar post={post} />
                </div>
              </aside>
            </div>
            
            {/* Comments Section */}
            <CommentSection postId={post.id} />
            
            {/* Related Articles Section */}
            {relatedPosts.length > 0 && post?.author && (
              <section className="mt-16 pt-10 border-t border-border/40">
                <div className="mb-8">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                    Mehr von {authorData[post.author as Author]?.name?.split(' ').pop() || 'dem Autor'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
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
                      <CarouselItem key={index} className="basis-full lg:basis-1/2 pl-4">
                        <BlogCard post={relatedPost} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {relatedPosts.length > 2 && (
                    <>
                      <CarouselPrevious className="hidden sm:flex" />
                      <CarouselNext className="hidden sm:flex" />
                    </>
                  )}
                </Carousel>
              </section>
            )}
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
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Load post directly from API by slug
  useEffect(() => {
    if (!slug) {
      setError('No slug provided');
      setIsLoadingPost(false);
      return;
    }
    const loadPost = async () => {
      try {
        setIsLoadingPost(true);
        setError(null);
        const apiUrl = `${getApiBase()}/posts?slug=${encodeURIComponent(slug)}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Post not found (${response.status})`);
        }
        const data = await response.json();
        if (!data || (Array.isArray(data) && data.length === 0)) {
          setPost(null);
          setIsLoadingPost(false);
          return;
        }
        // API returns single object for slug query
        const loadedPost = Array.isArray(data) ? data[0] : data;
        if (loadedPost && loadedPost.id) {
          setPost(loadedPost as BlogPost);
        } else {
          setPost(null);
        }
      } catch (err: unknown) {
        console.error(`[PostPage] Error loading post:`, err instanceof Error ? err.message : String(err));
        setError(err instanceof Error ? err.message : 'Failed to load post');
        setPost(null);
      } finally {
        setIsLoadingPost(false);
      }
    };
    loadPost();
  }, [slug]);
  // Set current author if authorId is available
  useEffect(() => {
    if (authorId && authorData[authorId as Author]) {
      setCurrentAuthor(authorId as Author);
    } else if (post?.author) {
      setCurrentAuthor(post.author as Author);
    }
  }, [authorId, post?.author, setCurrentAuthor]);
  // Determine proper loading state
  const isLoading = isLoadingPost || postsLoading;
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ScrollProgress />
          <p className="text-muted-foreground mt-4">Post wird geladen...</p>
        </div>
      </div>
    );
  }
  // Show error if post failed to load
  if (error) {
    console.error(`[PostPage] Final error state:`, error);
    return <NotFound />;
  }
  // Show 404 if no post was found
  if (!post) {
    return <NotFound />;
  }
  return <PostContent post={post} />;
}
