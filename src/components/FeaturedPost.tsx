
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { posts } from '@/data/posts';
import { useMemo } from 'react';
import { BlogCard } from './BlogCard';
import { useLanguage } from '@/context/LanguageContext';

export function FeaturedPost() {
  const { t } = useLanguage();
  // Get a "featured" post - for now, rotate based on date
  const featuredPost = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return posts[dayOfYear % posts.length];
  }, []);

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
          <BlogCard post={featuredPost} />
        </div>
      </div>
    </section>
  );
}
