import { useState, useMemo, useEffect, useRef } from 'react';
import { timelineEvents as staticTimelineEvents } from '@/data/timeline';
import { authors as baseAuthors } from '@/data/authors';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Star,
  BookOpen,
  Skull,
  Filter,
  X,
  BookMarked,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Author, TimelineEvent, AuthorInfo, BlogPost } from '@/types/blog';
import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/use-posts';
import slugify from 'slugify';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedTimeline, getTranslatedAuthors } from '@/lib/translator';
import { buildTimelineEvents } from '@/lib/timeline-builder';

type ContentFilter = 'all' | 'diary' | 'scientific';
type FilterType = 'all' | 'birth' | 'event' | 'work' | 'death';

const typeIcons = {
  birth: Star,
  death: Skull,
  event: Calendar,
  work: BookOpen,
};

const findPostByEvent = (event: TimelineEvent, posts: BlogPost[]) => {
  const eventSlug = slugify(event.title, { lower: true, strict: true });
  return posts.find(
    (p) =>
      p.slug === eventSlug ||
      p.title === event.title ||
      (p.historicalYear === event.year && p.author === event.author),
  );
};

const hasContent = (post: BlogPost, perspective: 'diary' | 'scientific') => {
  const content = post?.content?.[perspective];
  return content != null && typeof content === 'string' && content.trim().length > 0;
};

export function Timeline() {
  const { language, t } = useLanguage();
  const { posts } = usePosts();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(staticTimelineEvents);
  const [authors, setAuthors] = useState<Record<string, AuthorInfo>>(baseAuthors);

  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
  const [selectedType, setSelectedType] = useState<FilterType>('all');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function updateTimeline() {
      const translatedStatic = await getTranslatedTimeline(language);
      const translatedAuthors = await getTranslatedAuthors(language);
      setAuthors(translatedAuthors);
      const merged = buildTimelineEvents(language, posts, translatedStatic, { deduplicate: true });
      setTimelineEvents(merged);
    }
    updateTimeline();
  }, [language, posts]);

  const typeLabels: Record<string, string> = {
    birth: t('birth'),
    death: t('death'),
    event: t('event'),
    work: t('work'),
  };

  const filteredEvents = useMemo(() => {
    return timelineEvents
      .slice()
      .sort((a, b) => a.year - b.year)
      .filter((event) => {
        const authorMatch = selectedAuthors.length === 0 || selectedAuthors.includes(event.author);
        const typeMatch = selectedType === 'all' || event.type === selectedType;

        const searchMatch = !searchTerm ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase());

        let contentMatch = true;
        if (contentFilter !== 'all') {
          const post = findPostByEvent(event, posts);
          if (post) {
            contentMatch = hasContent(post, contentFilter);
          } else {
            contentMatch = false;
          }
        }

        return authorMatch && typeMatch && contentMatch && searchMatch;
      });
  }, [timelineEvents, selectedAuthors, selectedType, contentFilter, posts, searchTerm]);

  const toggleAuthor = (authorId: Author) => {
    setSelectedAuthors((prev) =>
      prev.includes(authorId) ? prev.filter((a) => a !== authorId) : [...prev, authorId],
    );
  };

  const clearFilters = () => {
    setSelectedAuthors([]);
    setSelectedType('all');
    setContentFilter('all');
    setSearchTerm('');
  };

  const hasFilters = selectedAuthors.length > 0 || selectedType !== 'all' || contentFilter !== 'all' || searchTerm !== '';

  const formatYear = (year: number) => {
    if (!Number.isFinite(year)) return '—';
    return year > 0 ? `${year} n. Chr.` : `${Math.abs(year)} v. Chr.`;
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="timeline-content" ref={containerRef} className="py-10 sm:py-14 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-center mb-3">
            {t('timelineHeading') ?? 'Chronologische Timeline'}
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Alle Ereignisse in chronologischer Reihenfolge.
          </p>
        </div>

        {/* Filter-Card */}
        <div className="mb-10 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 sm:p-5 max-w-3xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                {t('filter')}
              </span>
              <span className="text-xs text-muted-foreground">
                {filteredEvents.length} {t('events')}
              </span>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                {t('clearFilters')}
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="mb-6 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchTimeline') ?? 'Ereignisse durchsuchen...'}
              className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          </div>

          {/* Author Filter */}
          <div className="mb-3 flex flex-wrap gap-2">
            {Object.values(authors).map((author) => {
              const isSelected = selectedAuthors.includes(author.id as Author);
              return (
                <button
                  key={author.id}
                  onClick={() => toggleAuthor(author.id as Author)}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors touch-manipulation',
                    'border border-border/50 backdrop-blur',
                    isSelected
                      ? `bg-author-${author.id} text-white shadow-[0_14px_40px_-22px_rgba(0,0,0,0.9)]`
                      : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary/90',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      isSelected ? 'bg-white' : `bg-author-${author.id}`,
                    )}
                  />
                  <span className="whitespace-nowrap">{author.name}</span>
                </button>
              );
            })}
          </div>

          {/* Type + Content Filter */}
          <div className="flex flex-col gap-3 border-t border-border/40 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'birth', 'event', 'work', 'death'] as FilterType[]).map((type) => {
                const Icon = type === 'all' ? Calendar : typeIcons[type as keyof typeof typeIcons];
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:text-sm transition-colors touch-manipulation',
                      'border border-border/60',
                      selectedType === type
                        ? 'bg-primary text-primary-foreground shadow-[0_12px_40px_-22px_rgba(0,0,0,0.9)]'
                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary/80',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="whitespace-nowrap">
                      {type === 'all' ? t('all') : typeLabels[type as keyof typeof typeLabels]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setContentFilter('all')}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:text-sm transition-colors touch-manipulation',
                  'border border-border/60',
                  contentFilter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary/80',
                )}
              >
                <BookMarked className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Alle</span>
              </button>
              <button
                onClick={() => setContentFilter('diary')}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:text-sm transition-colors touch-manipulation',
                  'border border-border/60',
                  contentFilter === 'diary'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary/80',
                )}
              >
                <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                <span>📔 Tagebuch</span>
              </button>
              <button
                onClick={() => setContentFilter('scientific')}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:text-sm transition-colors touch-manipulation',
                  'border border-border/60',
                  contentFilter === 'scientific'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary/80',
                )}
              >
                <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
                <span>📚 Wissenschaftlich</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modern Vertical Timeline */}
        <div className="mx-auto max-w-5xl relative">
          {/* Central Line Base */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border/20 md:-translate-x-1/2 hidden sm:block" />

          {/* Central Line Progress */}
          <motion.div
            style={{ scaleY }}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary to-primary/20 md:-translate-x-1/2 hidden sm:block origin-top"
          />

          <AnimatePresence>
            {filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-16 text-center"
              >
                <Calendar className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">{t('noEventsFound')}</p>
              </motion.div>
            ) : (
              <div className="relative space-y-16">
                {Object.entries(
                  filteredEvents.reduce((acc, event, index) => {
                    const decade = Math.floor(event.year / 10) * 10;
                    const decadeKey = `${decade}s`;

                    if (!acc[decadeKey]) {
                      acc[decadeKey] = [];
                    }
                    acc[decadeKey].push({ event, index });
                    return acc;
                  }, {} as Record<string, Array<{ event: typeof filteredEvents[0], index: number }>>)
                ).map(([decadeKey, events]) => {
                  const decade = parseInt(decadeKey);
                  const isBC = decade < 0;
                  const displayDecade = isBC ? Math.abs(decade) : decade;

                  return (
                    <div key={decadeKey} className="relative">
                      {/* Decade Sticky Header */}
                      <div className="sticky top-20 z-20 mb-12 flex justify-start md:justify-center">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          className="px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-primary/20 shadow-sm flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm font-bold tracking-tight text-foreground">
                            {isBC ? `${displayDecade}er v. Chr.` : `${displayDecade}er n. Chr.`}
                          </span>
                        </motion.div>
                      </div>

                      <div className="space-y-12 relative">
                        {events.map(({ event, index }, eventIdx) => {
                          const author = event.author ? authors[event.author] : null;
                          const Icon = typeIcons[event.type as keyof typeof typeIcons];
                          const post = findPostByEvent(event, posts);
                          const isOdd = eventIdx % 2 !== 0;

                          const cardContent = (
                            <motion.div
                              whileHover={{ y: -4, scale: 1.01 }}
                              className={cn(
                                'group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-6 overflow-hidden',
                                'transition-all duration-300',
                                post && 'cursor-pointer hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5',
                              )}
                            >
                              {/* Author accent line */}
                              <div className="absolute top-0 left-0 w-1.5 h-full opacity-60"
                                style={{ backgroundColor: author?.color }} />

                              <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                                  style={{ backgroundColor: `${author?.color}15` }}>
                                  <Icon className="h-5 w-5" style={{ color: author?.color }} />
                                </div>
                                <div>
                                  <div className="text-lg font-bold" style={{ color: author?.color }}>
                                    {formatYear(event.year)}
                                  </div>
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {typeLabels[event.type]}
                                  </div>
                                </div>
                              </div>

                              <h3 className={cn(
                                'font-display text-lg font-bold text-foreground mb-3 leading-tight',
                                post && 'group-hover:text-primary transition-colors',
                              )}>
                                {event.title}
                              </h3>

                              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                                {event.description}
                              </p>

                              {post && (
                                <div className="flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                  {t('readMore')}
                                  <ArrowRight className="h-4 w-4" />
                                </div>
                              )}
                            </motion.div>
                          );

                          return (
                            <section
                              key={`${event.year}-${event.title}`}
                              className={cn(
                                "relative flex flex-col md:flex-row items-start md:items-center gap-8",
                                isOdd ? "md:flex-row-reverse" : ""
                              )}
                            >
                              {/* Timeline Node (Bullet) */}
                              <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 w-3 h-3 rounded-full bg-background border-2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 hidden sm:block"
                                style={{ borderColor: author?.color || 'var(--primary)' }} />

                              {/* Card Container */}
                              <div className="w-full md:w-[45%] ml-10 md:ml-0">
                                <motion.article
                                  initial={{ opacity: 0, x: isOdd ? 20 : -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true, margin: "-50px" }}
                                  transition={{ duration: 0.4, delay: eventIdx * 0.05 }}
                                >
                                  {post ? (
                                    <Link to={`/${post.author}/${post.slug}`} className="block">
                                      {cardContent}
                                    </Link>
                                  ) : (
                                    <div className="block">
                                      {cardContent}
                                    </div>
                                  )}
                                </motion.article>
                              </div>

                              {/* Date Spacer for Desktop */}
                              <div className="hidden md:block md:w-[45%]" />
                            </section>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
