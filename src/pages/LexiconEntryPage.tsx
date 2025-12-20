import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { LexiconSidebar } from '@/components/LexiconSidebar';
import { motion } from 'framer-motion';
import NotFound from './NotFound';
import { useAuthor } from '@/context/AuthorContext';
import { formatContent } from '@/lib/content-formatter';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedLexiconEntry, getTranslatedPost } from '@/lib/translator';
import { LexiconEntry, BlogPost } from '@/types/blog';
import { usePosts } from '@/hooks/use-posts';
import { PageHero } from '@/components/layout/PageHero';

export default function LexiconEntryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { setCurrentAuthor } = useAuthor();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();

  const [entry, setEntry] = useState<LexiconEntry | null | undefined>(undefined);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  useEffect(() => {
    async function translateContent() {
      const translatedEntry = await getTranslatedLexiconEntry(language, slug as string);
      setEntry(translatedEntry);

      if (translatedEntry && !postsLoading) {
        const searchTerms = [translatedEntry.term.toLowerCase(), ...(translatedEntry.variants?.map(v => v.toLowerCase()) || [])];
        const postsToSearch = allPosts;
        const foundPosts = [];
        for (const post of postsToSearch) {
          const translatedPost = await getTranslatedPost(language, post.author, post.slug);
          if (translatedPost) {
            const isRelated = searchTerms.some(term => 
              translatedPost.title.toLowerCase().includes(term) ||
              translatedPost.excerpt.toLowerCase().includes(term) ||
              translatedPost.content.diary.toLowerCase().includes(term) ||
              translatedPost.content.scientific.toLowerCase().includes(term)
            );
            if (isRelated) {
              foundPosts.push(translatedPost);
            }
          }
        }
        setRelatedPosts(foundPosts.slice(0, 5));
      }
    }
    translateContent();
  }, [language, slug, allPosts, postsLoading]);


  const handleBackClick = () => {
    navigate('/lexicon');
  };

  const formattedContent = useMemo(() => {
    if (!entry) return [];
    return formatContent(entry.definition, t, entry.slug);
  }, [entry, t]);

  if (entry === undefined) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!entry) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-16">
        <PageHero
          eyebrow={entry.category}
          title={entry.term}
          description={t('lexiconDescription') || 'Eindeutig definiert und mit Kontext versehen.'}
          kicker={
            <button
              onClick={handleBackClick}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> {t('backToLexicon')}
            </button>
          }
        />

        <section className="section-shell -mt-10">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            <article>
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card space-y-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/search?category=${encodeURIComponent(entry.category)}`} className="group">
                    <span className="inline-flex justify-center items-center px-4 py-1.5 min-h-[28px] rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/15 transition-colors border border-primary/20 leading-tight">
                      {entry.category}
                    </span>
                  </Link>
                  {entry.variants?.slice(0, 4).map((v, i) => (
                    <Link key={i} to={`/search?q=${encodeURIComponent(v)}`} className="group">
                      <span className="inline-flex justify-center items-center px-4 py-1.5 min-h-[28px] rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors border border-border/60 leading-tight">
                        {v}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="prose-blog text-lg">
                  {formattedContent}
                </div>

                {relatedPosts.length > 0 && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                      <Newspaper className="h-5 w-5 text-primary" />
                      <h2 className="font-display text-2xl font-medium">{t('relatedEntries')}</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {relatedPosts.slice(0,2).map((post) => (
                        <BlogCard post={post} key={post.id} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </article>
            
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <LexiconSidebar entry={entry} />
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
