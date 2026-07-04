import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BlogSidebar } from '@/components/BlogSidebar';
import { CommentSection } from '@/components/CommentSection';
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
import { motion } from 'framer-motion';
import { ShareButton } from '@/components/ShareButton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BlogCard } from '@/components/BlogCard';
import { SEO } from '@/components/SEO';
import { PostTags } from '@/components/PostTags';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { getApiBase } from '@/lib/api';
import { usePageTracking } from '@/hooks/usePageTracking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const calculateReadingTime = (text: string): number => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
function PostContent({ post }: { post: BlogPost }) {
  const { t, language } = useLanguage();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [searchParams] = useSearchParams();
  const [chatQuestion, setChatQuestion] = useState('');
  // Compute content availability once; used for initial perspective and the toggle visibility.
  const hasDiary = Boolean(post?.content?.diary?.trim()?.length);
  const hasScientific = Boolean(post?.content?.scientific?.trim()?.length);

  // Initialise perspective to the first available content type so the first
  // render is never shown an empty/null content string (which would crash).
  const [perspective, setPerspective] = useState<Perspective>(hasDiary ? 'diary' : 'scientific');
  const targetRef = useRef<HTMLDivElement>(null);

  const contentToDisplay = useMemo(() => post?.content?.[perspective] ?? '', [post?.content, perspective]);
  
  // Calculate reading time separately to avoid dependency issues
  const readingTime = useMemo(() => calculateReadingTime(contentToDisplay), [contentToDisplay]);

  const [showVideo, setShowVideo] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showImageLightbox, setShowImageLightbox] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoSrc = useMemo(() => {
    const m = contentToDisplay?.match(/^Video:\s*\[[^\]]+\]\(([^)]+)\)/m);
    return m ? m[1] : null;
  }, [contentToDisplay]);

  // When user requests playback, show a 3s KI notice overlay; only after timeout or skip start playback
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    if (showVideo && videoSrc && !videoPlaying) {
      setShowNotice(true);
      t = setTimeout(() => {
        setShowNotice(false);
        setVideoPlaying(true);
      }, 3000);
    }
    return () => { if (t) clearTimeout(t); };
  }, [showVideo, videoSrc, videoPlaying]);

  // Start playback when videoPlaying becomes true
  useEffect(() => {
    if (videoPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoPlaying]);
  
  // Page Tracking
  usePageTracking({
    type: 'post',
    itemId: post.slug,
    title: post.title,
    metadata: {
      author: post.author,
      perspective: perspective,
      readingTime: readingTime
    }
  });
  
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
  
  // Determine which title to display - always use main title for consistency
  const getDisplayTitle = useCallback(() => {
    return post?.title || 'Untitled';
  }, [post?.title]);
  
  // Update perspective based on URL params, user preference and content availability
  useEffect(() => {
    if (!post) return;
    
    const hasDiary = Boolean(post?.content?.diary?.trim());
    const hasScientific = Boolean(post?.content?.scientific?.trim());
    const requested = (searchParams.get('p') as Perspective | null);

    // Read saved user preference (if any)
    const savedPref = (typeof window !== 'undefined' ? (localStorage.getItem('defaultArticleMode') as 'auto' | 'diary' | 'scientific' | null) : null) || 'auto';

    let initialPerspective: Perspective;
    if (requested === 'scientific' && hasScientific) {
      initialPerspective = 'scientific';
    } else if (requested === 'diary' && hasDiary) {
      initialPerspective = 'diary';
    } else if (savedPref === 'diary' && hasDiary) {
      initialPerspective = 'diary';
    } else if (savedPref === 'scientific' && hasScientific) {
      initialPerspective = 'scientific';
    } else {
      initialPerspective = hasDiary ? 'diary' : (hasScientific ? 'scientific' : 'diary');
    }

    if (perspective !== initialPerspective) {
      setPerspective(initialPerspective);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, searchParams]);
  
  if (!post) {
    console.error('[PostContent] Post is null/undefined');
    return <NotFound />;
  }
  
  const author = post?.author ? authorData[post.author as Author] : null;
  const authorColor = author?.color || '#000000';
  const overlayBg = authorColor.length === 7 ? `${authorColor}CC` : `${authorColor}`;
  const overlayTextColor = '#ffffff';
  const excerpt = contentToDisplay?.substring(0, 160) || '';
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';
  const finalImage = `${baseUrl}/images/caesar-hero.png`;
  const currentUrl = window.location.href;
  const chatAuthorName = author?.name?.split(' ')[0] || post?.author || t('index.chatWithDefaultName');

  const openAuthorChat = () => {
    const authorId = post?.author;
    if (!authorId) return;
    const question = chatQuestion.trim();
    const context = encodeURIComponent(`${post.title}${post.tags?.length ? ' - ' + post.tags.join(', ') : ''}`);
    navigate(question.length > 0
      ? `/${authorId}/chat?q=${encodeURIComponent(question)}&ref=${context}`
      : `/${authorId}/chat?ref=${context}`
    );
  };

  return (
    <div ref={targetRef} className="min-h-screen flex flex-col bg-background">
      <SEO
        title={getDisplayTitle()}
        description={contentToDisplay?.substring(0, 160)}
        author={post?.author}
        image={post?.coverImage ? `${baseUrl}/images/${post.coverImage}` : finalImage}
        type="article"
        publishedTime={post?.date}
        section={post?.historicalYear ? 'ancient-history' : 'roman-literature'}
        tags={post?.tags || ['Latein', 'antike Geschichte', 'römisches Reich']}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": getDisplayTitle(),
          "description": contentToDisplay?.substring(0, 160),
          "articleBody": contentToDisplay?.substring(0, 5000),
          "wordCount": contentToDisplay?.split(/\s+/).length || 0,
          "image": post?.coverImage ? `${baseUrl}/images/${post.coverImage}` : finalImage,
          "author": {
            "@type": "Person",
            "name": post?.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "Meum Diarium",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/icons/favicon.svg`
            }
          },
          "datePublished": post?.date,
          "dateModified": post?.updatedAt || post?.date,
          "url": currentUrl,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl,
            "name": `${post?.author} - ${getDisplayTitle()}`,
            "description": contentToDisplay?.substring(0, 500)
          },
          "about": [
            {
              "@type": "Thing",
              "name": post?.historicalYear ? "Antike Geschichte" : "Römische Literatur",
              "description": post?.historicalYear
                ? `Historischer Kontext aus dem Jahr ${post.historicalYear}`
                : "Literarische Analyse und Interpretation"
            }
          ],
          "keywords": post?.tags || ["Latein", "Antike Geschichte", "Römisches Reich"],
          "inLanguage": language === 'de' ? 'de-DE' : language === 'en' ? 'en-US' : 'la',
          "isAccessibleForFree": true
        }}
        canonical={currentUrl}
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
                  {/* Beitragsbild unter dem Titel – nur anzeigen wenn coverImage vorhanden */}
                  {post.coverImage && (
                    <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-border/40">
                      {videoSrc && showVideo ? (
                        <div className="relative w-full h-full">
                          {/* Full-area notice overlay while waiting */}
                          {showNotice && (
                            <>
                              {/* Blurred background */}
                              <div className="absolute inset-0 z-40 pointer-events-none" style={{ backgroundColor: overlayBg, filter: 'blur(8px)' }} />
                              {/* Overlay content */}
                              <div className="absolute inset-0 z-50 flex items-center justify-center">
                                <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                                  <p className="text-lg sm:text-xl font-semibold text-white mb-2">Achtung: Das Video wurde mithilfe von KI erstellt.</p>
                                  <p className="text-sm text-white mb-4">Weitere Informationen zur Nutzung von KI sind <a href="/ki" className="underline font-semibold text-white">hier</a>.</p>
                                  <div className="flex gap-3">
                                    <button onClick={() => { setShowNotice(false); setVideoPlaying(true); }} className="px-4 py-2 rounded bg-white text-black font-medium">Überspringen</button>
                                    <div className="px-3 py-2 rounded border border-white text-white">Startet in 3 Sekunden...</div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          <video
                            ref={videoRef}
                            controls={videoPlaying}
                            className="w-full h-full object-cover rounded-xl"
                            playsInline
                          >
                            <source src={videoSrc} />
                            Dein Browser unterstützt das Video-Tag nicht. <a href={videoSrc} className="text-primary underline">Link zum Video</a>
                          </video>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => setShowImageLightbox(true)}
                            className="relative w-full h-full group"
                            aria-label="Bild vergrößern"
                          >
                            <ImageWithFallback
                              src={post.coverImage.startsWith('/') || post.coverImage.startsWith('http://') || post.coverImage.startsWith('https://') ? post.coverImage : `/images/${post.coverImage}`}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                          </button>
                          {videoSrc && (
                            <button onClick={() => { setShowVideo(true); setVideoPlaying(false); }} aria-label="Play video" className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <svg className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.6)" />
                                <path d="M10 8L16 12L10 16V8Z" fill="white" />
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  <div className="rounded-2xl border border-border/50 bg-white/80 dark:bg-card/85 backdrop-blur-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
                        {t('index.historicalChat')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={chatQuestion}
                        onChange={(e) => setChatQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') openAuthorChat();
                        }}
                        placeholder={t('index.chatPlaceholder', { name: chatAuthorName })}
                        className="h-11 bg-white/85 dark:bg-card/90 border-border/60 focus-visible:ring-primary/30"
                      />
                      <Button type="button" size="icon" className="h-11 w-11 rounded-xl" onClick={openAuthorChat}>
                        <BookText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {post.historicalDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {calculateReadingTime(contentToDisplay)} min
                      </span>
                    </div>
                    <ShareButton
                      title={post.title}
                      text={`Schau mal, was ich gefunden habe: ${window.location.href}`}
                      variant="compact"
                    />
                  </div>
                  <PerspectiveToggle value={perspective} onChange={setPerspective} hasDiary={hasDiary} hasScientific={hasScientific} />
                </header>
                <div className="space-y-8">
                  {/* Optional inline video: markdown line like `Video: [label](/videos/file.mp4)` at the top of the content will be rendered as a player */}
                  {(() => {
                    // when there's an inline video (no coverImage), render player with a short KI notice overlay
                    if (videoSrc && !post.coverImage) {
                      return (
                        <div className="mb-6">
                          {!showVideo ? (
                            <div className="rounded-lg border border-border/40 bg-secondary/20 h-64 flex items-center justify-center">
                              <button onClick={() => { setShowVideo(true); setVideoPlaying(false); }} aria-label="Play video" className="flex items-center gap-3 bg-primary/80 hover:bg-primary text-white px-4 py-2 rounded">
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
                                </svg>
                                Video abspielen
                              </button>
                            </div>
                          ) : (
                            <div className="relative mb-6">
                              {showNotice && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: overlayBg }}>
                                  <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                                    <p className="text-lg sm:text-xl font-semibold text-white mb-2">Achtung: Das Video wurde mithilfe von KI erstellt.</p>
                                    <p className="text-sm text-white mb-4">Weitere Informationen zur Nutzung von KI sind <a href="/ki" className="underline font-semibold text-white">hier</a>.</p>
                                    <div className="flex gap-3">
                                      <button onClick={() => { setShowNotice(false); setVideoPlaying(true); }} className="px-4 py-2 rounded bg-white text-black font-medium">Überspringen</button>
                                      <div className="px-3 py-2 rounded border border-white text-white">Startet in 3 Sekunden...</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <video ref={videoRef} controls={videoPlaying} className="w-full rounded-lg border border-border/40" playsInline>
                                <source src={videoSrc} />
                                Dein Browser unterstützt das Video-Tag nicht. Folge dem <a href={videoSrc} className="text-primary underline">Link zum Video</a>.
                              </video>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}

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

            {/* Comments Section - Before Related Articles */}
            {post && (
              <div className="max-w-4xl mx-auto">
                <CommentSection postId={post.id} />
              </div>
            )}

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
                  className="w-full max-w-6xl mx-auto"
                >
                  <CarouselContent className="-ml-4">
                    {relatedPosts.map((relatedPost, index) => (
                      <CarouselItem key={index} className="basis-full md:basis-1/2 pl-4">
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

      {showImageLightbox && post.coverImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowImageLightbox(false)}
        >
          <button
            onClick={() => setShowImageLightbox(false)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            aria-label="Schließen"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <img
            src={post.coverImage.startsWith('/') || post.coverImage.startsWith('http://') || post.coverImage.startsWith('https://') ? post.coverImage : `/images/${post.coverImage}`}
            alt={post.title}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
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
  // Load post directly from API by author + slug
  useEffect(() => {
    if (!slug || !authorId) {
      setError('Missing route parameters');
      setIsLoadingPost(false);
      return;
    }
    const loadPost = async () => {
      try {
        setIsLoadingPost(true);
        setError(null);
        const apiUrl = `${getApiBase()}/posts/${encodeURIComponent(authorId)}/${encodeURIComponent(slug)}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorMsg = `Post not found (${response.status})`;
          console.error(`[PostPage] API error: ${errorMsg}`);
          throw new Error(errorMsg);
        }
        const data = await response.json();
        const loadedPost = data as BlogPost;

        if (loadedPost && loadedPost.id) {
          setPost(loadedPost);
        } else {
          console.warn(`[PostPage] Invalid post data structure`);
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
  }, [slug, authorId]);
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
