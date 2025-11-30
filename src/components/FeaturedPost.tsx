
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from './ui/skeleton';
import { useEffect, useState } from 'react';

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
    <section className="py-16">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
           <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 inline mr-1" />
              {t('featuredPost')}
            </span>
          <h2 className="font-display text-3xl md:text-4xl mb-3">
            {t('glimpseIntoAnnals')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('featuredPostDesc')}
          </p>
        </motion.div>
        <div className="max-w-xl mx-auto">
          {isLoading || !featuredPost ? (
            <div className="bg-card rounded-2xl p-0 overflow-hidden border border-border shadow-sm">
              <Skeleton className="h-48 w-full" />
              <div className="p-5">
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
