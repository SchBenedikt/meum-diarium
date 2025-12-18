
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
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={defaultTransition}
          className="max-w-4xl mb-20"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Entdecke die <span className="text-primary italic">Sammlung.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl">
            {t('collectionStats') || 'Ein wachsendes Archiv der Antike. Jede Zahl repräsentiert eine Brücke in eine vergangene Welt, bereit für deine Erkundung.'}
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={fadeUp(index * 0.08, 20)}
              className="group relative p-8 rounded-3xl bg-card/40 backdrop-blur-2xl border border-border/40 transition-all duration-700 hover:border-primary/40 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-700" />

              <div className="relative z-10">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>

                <div className="space-y-4">
                  <p className="font-display text-4xl font-bold tracking-tighter group-hover:text-primary transition-colors duration-500">
                    {stat.value}
                  </p>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/80 mb-2">
                      {stat.label}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </motion.div>

        {/* Tags Cloud - Refined */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={defaultTransition}
          className="mt-24 pt-16 border-t border-white/5"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 text-center">{t('popularTopics')}</p>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {uniqueTags.slice(0, 15).map(tag => (
              <Link
                key={tag}
                to={`/search?category=${encodeURIComponent(tag)}`}
                className="px-8 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/5 text-sm font-display font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 hover:scale-110 active:scale-95"
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
