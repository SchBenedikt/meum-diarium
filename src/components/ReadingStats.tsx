
import { Book, Users, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePosts } from '@/hooks/use-posts';
import { authors } from '@/data/authors';
import { timelineEvents } from '@/data/timeline';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useMemo } from 'react';
import { fadeUp, staggerContainer, defaultTransition } from '@/lib/motion';
import { ModernBackground } from './ui/ModernBackground';

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
    <section className="py-24 relative overflow-hidden">
      <ModernBackground />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={defaultTransition}
          className="text-center mb-14"
        >
          <h2 className="font-display text-2xl md:text-3xl mb-3 tracking-tight">
            {t('collectionInsights')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('collectionStats')}
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={fadeUp(index * 0.08, 20)}
              className="group p-6 rounded-2xl bg-surface-container-low/30 backdrop-blur-md border border-white/5 transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <stat.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="font-display text-3xl font-semibold mb-1 tracking-tight group-hover:text-primary transition-colors">{stat.value}</p>
              <p className="font-medium text-sm mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tags Cloud */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={defaultTransition}
          className="mt-14 text-center"
        >
          <p className="text-sm text-muted-foreground mb-5">{t('popularTopics')}</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {uniqueTags.slice(0, 12).map(tag => (
              <Link
                key={tag}
                to={`/search?category=${encodeURIComponent(tag)}`}
                className="px-5 py-2.5 rounded-full bg-surface-container-low/40 backdrop-blur-sm border border-white/5 text-sm font-medium hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 active:scale-95 shadow-none"
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
