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
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground/80">
              Res Romana
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight">
              {t('timelineHeading') ?? 'Chronologische Timeline'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Alle Ereignisse in einer klaren, chronologischen Liste – perfekt, um den roten Faden der
              römischen Geschichte nachzuvollziehen.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {['Späte Republik', 'Bürgerkriege', 'Principat', 'Stoa & Briefe'].map((label) => (
              <span
                key={label}
                className="px-3 py-1 rounded-full bg-secondary/60 text-secondary-foreground border border-border/60 font-semibold"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Filter-Card */}
        <div className="mb-10 rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 via-card/60 to-background/60 p-5 sm:p-6 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Filter className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {t('filter')}
                </span>
                <span className="text-xs text-muted-foreground/80">
                  {filteredEvents.length} {t('events')}
                </span>
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
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

        {/* Modern Vertical Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* zarte Line */}
          <div className="pointer-events-none absolute left-[9px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border/40 to-transparent" />

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
              filteredEvents.map((event, index) => {
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
                      transition={{ duration: 0.22, delay: index * 0.03 }}
                      className="relative pl-8 sm:pl-10 py-3"
                    >
                      {/* Node */}
                      <div className="absolute left-0 top-6 flex h-5 w-5 items-center justify-center">
                        <div className="h-5 w-5 rounded-full bg-background shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_30px_-18px_rgba(0,0,0,0.9)] flex items-center justify-center">
                          <div
                            className={cn(
                              'flex h-4 w-4 items-center justify-center rounded-full border border-background/80',
                              `bg-author-${event.author || 'caesar'}`,
                            )}
                          >
                            <Icon className="h-2.5 w-2.5 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Card */}
                      <motion.div
                        whileHover={{ y: -2, scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className={cn(
                          'group rounded-2xl border border-border/70 bg-gradient-to-br from-card/90 via-card/80 to-background/80 p-4 sm:p-5',
                          'backdrop-blur-xl shadow-[0_22px_60px_-34px_rgba(0,0,0,0.9)] transition-colors',
                          post && 'cursor-pointer hover:border-primary/40',
                        )}
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className="text-sm font-semibold tracking-tight"
                            style={{ color: author?.color }}
                          >
                            {formatYear(event.year)}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-secondary/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary-foreground border border-border/60">
                            {typeLabels[event.type]}
                          </span>
                          {author && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                              <span
                                className={cn(
                                  'flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white',
                                  `bg-author-${event.author || 'caesar'}`,
                                )}
                              >
                                {author.name.charAt(0)}
                              </span>
                              <span>{author.name}</span>
                            </span>
                          )}
                        </div>

                        <h3
                          className={cn(
                            'font-display text-base sm:text-lg font-semibold tracking-tight text-foreground mb-1 line-clamp-2',
                            post && 'group-hover:text-primary',
                          )}
                        >
                          {event.title}
                        </h3>
                        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {event.description}
                        </p>

                        {post && (
                          <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground group-hover:text-primary">
                              {t('readMore')}
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </motion.article>
                  </Wrapper>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
