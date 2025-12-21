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
    const safeYears = timelineEvents.filter(e => Number.isFinite(e.year)).map(e => e.year);
    const minYear = safeYears.length ? Math.min(...safeYears) : -100;
    const maxYear = safeYears.length ? Math.max(...safeYears) : 100;

    const formatYear = (year: number) => year > 0 ? `${year} n. Chr.` : `${Math.abs(year)} v. Chr.`;

    return [
      { icon: BookMarked, value: totalEvents.toString(), label: t('events') },
      { icon: Users, value: '4', label: t('personalities') },
      { icon: Clock, value: formatYear(minYear), label: t('start') },
      { icon: Calendar, value: formatYear(maxYear), label: t('end') },
    ];
  }, [timelineEvents, t]);

  const scrollToTimeline = () => {
    document.getElementById('timeline-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center bg-muted/30 overflow-hidden">
          {/* Simple pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container mx-auto px-4 py-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                <Calendar className="w-3.5 h-3.5" />
                {t('interactiveChronology') || 'INTERAKTIVE CHRONOLOGIE'}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {t('navTimeline') || 'Zeitstrahl'}
              </h1>

              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                {t('timelinePageDesc') || 'Erkunde die wichtigsten Ereignisse im Leben von Caesar, Cicero, Augustus und Seneca.'}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-display text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={scrollToTimeline}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2"
                >
                  Zeitstrahl erkunden
                  <ChevronDown className="h-4 w-4" />
                </button>
                <ShareButton
                  title="Zeitstrahl der Antike - Meum Diarium"
                  text="Entdecke wichtige Ereignisse des antiken Roms."
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Content */}
        <div id="timeline-content">
          <Timeline />
        </div>
      </main>
      <Footer />
    </div>
  );
}