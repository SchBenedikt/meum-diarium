
import { Book, Users, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePosts } from '@/hooks/use-posts';
import { authors } from '@/data/authors';
import { timelineEvents } from '@/data/timeline';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useMemo } from 'react';

export function ReadingStats() {
  const { t } = useLanguage();
  const { posts, isLoading } = usePosts();

  const totalReadingTime = useMemo(() => {
    if (!posts) return 0;
    return posts.reduce((acc, post) => acc + post.readingTime, 0)
  }, [posts]);

  const uniqueTags = useMemo(() => {
    if (!posts) return [];
    return [...new Set(posts.flatMap(post => post.tags))]
  }, [posts]);

  const stats = [
    {
      icon: FileText,
      value: isLoading ? '...' : posts.length,
      label: t('diaryEntriesStat'),
      description: t('diaryEntriesStatDesc')
    },
    {
      icon: Users,
      value: Object.keys(authors).length,
      label: t('historicalAuthorsStat'),
      description: t('historicalAuthorsStatDesc')
    },
    {
      icon: Book,
      value: isLoading ? '...' : `${totalReadingTime} ${t('minutes')}`,
      label: t('totalReadingTimeStat'),
      description: t('totalReadingTimeStatDesc')
    },
    {
      icon: Calendar,
      value: timelineEvents.length,
      label: t('historicalEventsStat'),
      description: t('historicalEventsStatDesc')
    },
  ];

  return (
    <section className="py-20 border-t border-border">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-2xl md:text-3xl mb-3 tracking-tight">
            {t('collectionInsights')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('collectionStats')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="group p-6 rounded-lg bg-card border border-border/50 transition-all duration-300 hover:elevation-1 hover:border-border"
            >
              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-5 transition-colors group-hover:bg-primary/10">
                <stat.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="font-display text-3xl font-semibold mb-1 tracking-tight">{stat.value}</p>
              <p className="font-medium text-sm mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tags Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mt-14 text-center"
        >
          <p className="text-sm text-muted-foreground mb-5">{t('popularTopics')}</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {uniqueTags.slice(0, 12).map(tag => (
              <Link
                key={tag}
                to={`/search?category=${encodeURIComponent(tag)}`}
                className="px-4 py-2 rounded-full bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
