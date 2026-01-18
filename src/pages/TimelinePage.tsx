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
      <main className="container mx-auto px-4 pt-32 pb-24 max-w-5xl">
        {/* Minimalist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              CHRONOLOGIA
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              Der <span className="text-primary italic">Zeitstrahl</span>
            </h1>
            <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
              {t('timelineDescription') || 'Eine chronologische Reise durch die Geschichte Roms. Von der Gründung bis zum Fall.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4 items-end"
          >
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              <div className="flex flex-col items-end">
                <span className="text-foreground">{stats[0].value}</span>
                <span>{stats[0].label}</span>
              </div>
              <div className="w-px h-6 bg-border/40" />
              <div className="flex flex-col items-end">
                <span className="text-foreground">{stats[2].value}</span>
                <span>{stats[2].label}</span>
              </div>
              <div className="w-px h-6 bg-border/40" />
              <div className="flex flex-col items-end">
                <span className="text-foreground">{stats[3].value}</span>
                <span>{stats[3].label}</span>
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