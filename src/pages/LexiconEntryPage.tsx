import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, Newspaper, Tag, BookMarked } from 'lucide-react';
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
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToLexicon')}
          </button>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            <article>
              <header className="mb-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
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
                  <h1 className="font-display text-4xl md:text-5xl">{entry.term}</h1>
                </motion.div>
              </header>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose-blog text-lg"
              >
                {formattedContent}
              </motion.div>

              {relatedPosts.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-16"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl font-medium">{t('relatedEntries')}</h2>
                  </div>
                  <div className="relative">
                    <div className="grid md:grid-cols-2 gap-6">
                      {relatedPosts.slice(0,2).map((post) => (
                        <BlogCard post={post} key={post.id} />
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}
            </article>
            
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <LexiconSidebar entry={entry} />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
