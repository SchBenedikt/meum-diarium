
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
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {t('featuredPost')}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 tracking-tight px-4">
            {t('glimpseIntoAnnals')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg leading-relaxed px-4">
            {t('featuredPostDesc')}
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          {isLoading || !featuredPost ? (
            <div className="bg-card rounded-lg p-0 overflow-hidden border border-border/50">
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
