import { Footer } from '@/components/layout/Footer';
import { Timeline } from '@/components/Timeline';
import { ShareButton } from '@/components/ShareButton';
import { Calendar, Clock, Users, BookMarked, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { timelineEvents as staticTimelineEvents } from '@/data/timeline';
import { useEffect, useState, useMemo } from 'react';
import { usePosts } from '@/hooks/use-posts';
import { buildTimelineEvents } from '@/lib/timeline-builder';
import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedTimeline } from '@/lib/translator';
import { TimelineEvent } from '@/types/blog';

export default function TimelinePage() {
  const { setCurrentAuthor } = useAuthor();
  const { language, t } = useLanguage();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(staticTimelineEvents);
  const { posts } = usePosts();
  const heroPreview = useMemo(() => timelineEvents.slice(0, 4), [timelineEvents]);

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

  const formatYear = (year: number) => year > 0 ? `${year} n. Chr.` : `${Math.abs(year)} v. Chr.`;

  const stats = useMemo(() => {
    const totalEvents = timelineEvents.length;
    const safeYears = timelineEvents.filter(e => Number.isFinite(e.year)).map(e => e.year);
    const minYear = safeYears.length ? Math.min(...safeYears) : -100;
    const maxYear = safeYears.length ? Math.max(...safeYears) : 100;

    return [
      { icon: BookMarked, value: totalEvents.toString(), label: t('events') },
      { icon: Users, value: '4', label: t('personalities') },
      { icon: Clock, value: formatYear(minYear), label: t('start') },
      { icon: Calendar, value: formatYear(maxYear), label: t('end') },
    ];
  }, [timelineEvents, t]);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <main className="flex-1 pt-16 sm:pt-24">
        {/* Compact, Integrated Header */}
        <div className="container mx-auto px-4 max-w-5xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-8 sm:p-12 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-border/40 shadow-2xl overflow-hidden"
          >
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.3em]">
                <Calendar className="w-3 h-3" />
                {t('interactiveChronology') || 'Interaktive Chronologie'}
              </div>

              <div>
                <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter text-foreground mb-4">
                  Der <span className="text-primary italic">Zeitstrahl</span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                  {t('timelinePageDesc') || 'Eintauchen in das goldene Zeitalter. Feldzüge, Intrigen und die Geburt einer Weltmacht.'}
                </p>
              </div>

              {/* Minimal Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="p-4 rounded-2xl bg-background/50 border border-border/20"
                  >
                    <div className="font-display text-xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timeline Content */}
        <div id="timeline-content">
          <Timeline />
        </div>
      </main>
      <Footer />
    </div>
  );
}