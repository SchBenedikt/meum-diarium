import { useState, useMemo, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
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

        let contentMatch = true;
        if (contentFilter !== 'all') {
          const post = findPostByEvent(event, posts);
          if (post) {
            contentMatch = hasContent(post, contentFilter);
          } else {
            contentMatch = false;
          }
        }

        return authorMatch && typeMatch && contentMatch;
      });
  }, [timelineEvents, selectedAuthors, selectedType, contentFilter, posts]);

  const toggleAuthor = (authorId: Author) => {
    setSelectedAuthors((prev) =>
      prev.includes(authorId) ? prev.filter((a) => a !== authorId) : [...prev, authorId],
    );
  };

  const clearFilters = () => {
    setSelectedAuthors([]);
    setSelectedType('all');
    setContentFilter('all');
  };

  const hasFilters = selectedAuthors.length > 0 || selectedType !== 'all' || contentFilter !== 'all';

  const formatYear = (year: number) => {
    if (!Number.isFinite(year)) return '—';
    return year > 0 ? `${year} n. Chr.` : `${Math.abs(year)} v. Chr.`;
  };

  return (
    <section className="py-10 sm:py-14">
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

        {/* Modern Event Grid */}
        <div className="mx-auto max-w-5xl">
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
              <div className="space-y-12">
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
                    <div key={decadeKey}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/60 border border-border/50">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">
                            {isBC ? `${displayDecade}er v. Chr.` : `${displayDecade}er n. Chr.`}
                          </span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map(({ event, index }) => {
                            const author = event.author ? authors[event.author] : null;
                            const Icon = typeIcons[event.type];
                            const post = findPostByEvent(event, posts);
                            const Wrapper = post ? Link : 'div';
                            const wrapperProps = post
                              ? { to: `/${post.author}/${post.slug}` }
                              : ({} as Record<string, unknown>);

                            return (
                              <Wrapper
                                key={`${event.year}-${event.title}`}
                                {...wrapperProps}
                                className={cn(post && 'block')}
                              >
                                <motion.article
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -12 }}
                                  transition={{ duration: 0.22, delay: index * 0.02 }}
                                >
                                  <motion.div
                                    whileHover={{ y: -2 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    className={cn(
                                      'group rounded-lg border border-border/60 bg-card/80 backdrop-blur-sm p-4 h-full flex flex-col',
                                      'transition-all duration-200',
                                      post && 'cursor-pointer hover:border-primary/50 hover:shadow-md',
                                    )}
                                  >
                                    <div className="flex items-start gap-3 mb-3">
                                      <div
                                        className={cn(
                                          'flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0',
                                          `bg-author-${event.author || 'caesar'}/10`,
                                        )}
                                      >
                                        <Icon className="h-6 w-6" style={{ color: author?.color }} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <span
                                          className="text-sm font-bold block"
                                          style={{ color: author?.color }}
                                        >
                                          {formatYear(event.year)}
                                        </span>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                          {typeLabels[event.type]}
                                        </span>
                                      </div>
                                    </div>

                                    <h3
                                      className={cn(
                                        'font-display text-base font-semibold text-foreground mb-2 line-clamp-2',
                                        post && 'group-hover:text-primary transition-colors',
                                      )}
                                    >
                                      {event.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 flex-1">
                                      {event.description}
                                    </p>

                                    {post && (
                                      <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                                        {t('readMore')}
                                        <ArrowRight className="h-3 w-3" />
                                      </div>
                                    )}
                                  </motion.div>
                                </motion.article>
                              </Wrapper>
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
