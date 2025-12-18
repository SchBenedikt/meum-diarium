
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from './ui/skeleton';

export function FeaturedPost() {
  const { t } = useLanguage();
  const { posts, isLoading } = usePosts();

  const featuredPost = useMemo(() => {
    if (isLoading || posts.length === 0) return null;
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return posts[dayOfYear % posts.length];
  }, [posts, isLoading]);

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="flex items-center justify-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t('featuredPost')}</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            {t('glimpseIntoAnnals') || (
              <>
                Der <span className="text-primary italic">Blick</span> in die Annalen
              </>
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            {t('featuredPostDesc')}
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          {isLoading || !featuredPost ? (
            <div className="bg-card/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-0 overflow-hidden border border-border/40">
              <Skeleton className="h-52 w-full" />
              <div className="p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-4 w-4/5 mb-4" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          ) : (
            <BlogCard post={featuredPost} />
          )}
        </div>
      </div>
    </section>
  );
}
