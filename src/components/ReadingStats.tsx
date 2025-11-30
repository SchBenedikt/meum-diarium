
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
      value: isLoading ? '...' : `${totalReadingTime} Min.`, 
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
    <section className="py-16 border-t border-border">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl md:text-3xl mb-2">
            {t('collectionInsights')}
          </h2>
          <p className="text-muted-foreground">
            {t('collectionStats')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="font-display text-3xl font-bold mb-1">{stat.value}</p>
              <p className="font-medium text-sm mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tags Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">{t('popularTopics')}</p>
          <div className="flex flex-wrap justify-center gap-2">
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
