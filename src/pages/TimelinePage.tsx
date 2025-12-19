import { Footer } from '@/components/layout/Footer';
import { Timeline } from '@/components/Timeline';
import { ShareButton } from '@/components/ShareButton';
import { Calendar, Clock, Users, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';
import { timelineEvents as staticTimelineEvents } from '@/data/timeline';
import { useEffect, useState, useMemo } from 'react';
import { usePosts } from '@/hooks/use-posts';
import { buildTimelineEvents } from '@/lib/timeline-builder';
import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedTimeline } from '@/lib/translator';
import { TimelineEvent } from '@/types/blog';
import { PageHero } from '@/components/layout/PageHero';

export default function TimelinePage() {
  const { setCurrentAuthor } = useAuthor();
  const { language, t } = useLanguage();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(staticTimelineEvents);
  const { posts } = usePosts();

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  useEffect(() => {
    async function translateAndMerge() {
      const translatedStatic = await getTranslatedTimeline(language);
      const merged = buildTimelineEvents(language, posts, translatedStatic, { deduplicate: true });
      setTimelineEvents(merged);
    }
    translateAndMerge();
  }, [language, posts]);

  const stats = useMemo(() => {
    const totalEvents = timelineEvents.length;
    const minYear = timelineEvents.length > 0 ? Math.min(...timelineEvents.map(e => e.year)) : 0;
    const maxYear = timelineEvents.length > 0 ? Math.max(...timelineEvents.map(e => e.year)) : 0;
    
    return [
      { icon: BookMarked, value: totalEvents, label: t('events') },
      { icon: Users, value: '4', label: t('personalities') },
      { icon: Clock, value: `${Math.abs(minYear)} v. Chr.`, label: t('start') },
      { icon: Calendar, value: `${maxYear} n. Chr.`, label: t('end') },
    ];
  }, [timelineEvents, t]);


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <PageHero
          eyebrow={t('interactiveChronology')}
          title={t('navTimeline')}
          description={t('timelinePageDesc')}
          backgroundImage="https://images.unsplash.com/photo-1459347752559-33f83bb9fa6e?q=80&w=2400&auto=format&fit=crop"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="glass-panel p-4 flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="mt-8">
            <ShareButton 
              title="Zeitstrahl der Antike - Meum Diarium"
              text="Entdecken Sie die wichtigsten Ereignisse des antiken Roms auf einem interaktiven Zeitstrahl."
            />
          </div>
        </PageHero>

        <Timeline />
      </main>
      <Footer />
    </div>
  );
}

    