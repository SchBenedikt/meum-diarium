import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, MapPin, BookOpen, Award, ArrowLeft, Users, Scroll, Clock, ArrowRight, Brain, Book, Trophy, Landmark, Feather, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { works as baseWorks } from '@/data/works';
import slugify from 'slugify';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Author, BlogPost, Work } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedWork } from '@/lib/translator';
import { usePosts } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { PageContent } from '@/types/page';
import { useAuthorDetails } from './useAuthorDetails';
import { AuthorAboutHero } from '@/components/layout/AuthorAboutHero';

export function SenecaAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { authorId } = useParams<{ authorId: string }>();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();

  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);

  const authorDetails = useAuthorDetails(t);

  useEffect(() => {
    if (authorId === 'seneca') {
      setCurrentAuthor('seneca' as Author);
      async function translateContent() {
        if (!postsLoading) {
          const authorPostsList = allPosts.filter(p => p.author === 'seneca').slice(0, 3);
          setAuthorPosts(authorPostsList);
        }

        const translatedWorks = await Promise.all(
          Object.values(baseWorks).filter(w => w.author === 'seneca').map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
        );
        setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));

        try {
          const res = await fetch('/api/pages/author-about-seneca');
          if (res.ok) {
            const data: PageContent = await res.json();
            setAuthorPage(data);
          } else {
            setAuthorPage(null);
          }
        } catch {
          setAuthorPage(null);
        }
      }
      translateContent();
    }
  }, [authorId, setCurrentAuthor, language, allPosts, postsLoading]);

  if (!authorInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Lade Inhalte...
      </div>
    );
  }

  const details = authorDetails.seneca;

  const senecaSnapshots = [
    { label: t('seneca.snapshots.lifespan'), value: 'c. 4 ' + t('common.bc') + ' – 65 ' + t('common.ad'), hint: '~69 ' + t('common.years') },
    { label: t('seneca.snapshots.exile'), value: '41–49 ' + t('common.ad'), hint: 'Corsica, 8 ' + t('common.years') },
    { label: t('seneca.snapshots.advisor'), value: '54–62 ' + t('common.ad'), hint: 'Quinquennium Neronis' },
    { label: t('seneca.snapshots.works'), value: '124+', hint: 'Epistulae Morales' },
    { label: t('seneca.snapshots.philosophy'), value: 'Stoicism', hint: 'Roman Stoicism' },
    { label: t('seneca.snapshots.death'), value: '65 ' + t('common.ad'), hint: 'Forced Suicide' },
  ];

  const senecaLegacy = [
    {
      title: t('seneca.legacy.stoicism'),
      summary: t('seneca.legacy.stoicismSummary'),
      tag: t('seneca.tags.philosophy'),
      horizon: t('seneca.horizons.longTerm'),
    },
    {
      title: t('seneca.legacy.moralLetters'),
      summary: t('seneca.legacy.moralLettersSummary'),
      tag: t('seneca.tags.literature'),
      horizon: t('seneca.horizons.longTerm'),
    },
    {
      title: t('seneca.legacy.tragedies'),
      summary: t('seneca.legacy.tragediesSummary'),
      tag: t('seneca.tags.drama'),
      horizon: t('seneca.horizons.longTerm'),
    },
    {
      title: t('seneca.legacy.ethics'),
      summary: t('seneca.legacy.ethicsSummary'),
      tag: t('seneca.tags.ethics'),
      horizon: t('seneca.horizons.longTerm'),
    },
    {
      title: t('seneca.legacy.naturalPhilosophy'),
      summary: t('seneca.legacy.naturalPhilosophySummary'),
      tag: t('seneca.tags.science'),
      horizon: t('seneca.horizons.mediumTerm'),
    },
    {
      title: t('seneca.legacy.influence'),
      summary: t('seneca.legacy.influenceSummary'),
      tag: t('seneca.tags.philosophy'),
      horizon: t('seneca.horizons.longTerm'),
    },
  ];

  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return '—';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} ${t('common.bc')}` : `${year} ${t('common.ad')}`;
  };

  const senecaSidebar = {
    earlyLife: [
      { year: -4, title: t('seneca.timeline.life.birth.title'), note: t('seneca.timeline.life.birth.note') },
      { year: 5, title: t('seneca.timeline.life.rome.title'), note: t('seneca.timeline.life.rome.note') },
      { year: 31, title: t('seneca.timeline.life.quaestor.title'), note: t('seneca.timeline.life.quaestor.note') },
      { year: 39, title: t('seneca.timeline.life.caligula.title'), note: t('seneca.timeline.life.caligula.note') },
    ],
    neroYears: [
      { year: 41, title: t('seneca.timeline.life.exile.title'), note: t('seneca.timeline.life.exile.note') },
      { year: 49, title: t('seneca.timeline.life.recall.title'), note: t('seneca.timeline.life.recall.note') },
      { year: 54, title: t('seneca.timeline.life.neroEmperor.title'), note: t('seneca.timeline.life.neroEmperor.note') },
      { year: 59, title: t('seneca.timeline.life.matricide.title'), note: t('seneca.timeline.life.matricide.note') },
    ],
    laterLife: [
      { year: 62, title: t('seneca.timeline.life.burrusDeath.title'), note: t('seneca.timeline.life.burrusDeath.note') },
      { year: 62, title: t('seneca.timeline.life.retirement.title'), note: t('seneca.timeline.life.retirement.note') },
      { year: 65, title: t('seneca.timeline.life.conspiracy.title'), note: t('seneca.timeline.life.conspiracy.note') },
      { year: 65, title: t('seneca.timeline.life.death.title'), note: t('seneca.timeline.life.death.note') },
    ],
  };

  const senecaDeepDive = [
    {
      title: t('seneca.legacy.moralLetters'),
      detail: t('seneca.deepDive.lettersDetail'),
      impact: t('seneca.legacy.moralLettersSummary'),
    },
    {
      title: t('seneca.legacy.ethics'),
      detail: t('seneca.deepDive.dialoguesDetail'),
      impact: t('seneca.legacy.ethicsSummary'),
    },
    {
      title: t('seneca.legacy.tragedies'),
      detail: t('seneca.deepDive.tragediesDetail'),
      impact: t('seneca.legacy.tragediesSummary'),
    },
  ];

  const senecaLocations = [
    {
      title: t('seneca.locations.corduba.title'),
      years: 'c. 4 ' + t('common.bc'),
      note: t('seneca.locations.corduba.note'),
    },
    {
      title: t('seneca.locations.rome.title'),
      years: 'c. 5 ' + t('common.ad') + ' – 65 ' + t('common.ad'),
      note: t('seneca.locations.rome.note'),
    },
    {
      title: t('seneca.locations.corsica.title'),
      years: '41–49 ' + t('common.ad'),
      note: t('seneca.locations.corsica.note'),
    },
    {
      title: t('seneca.locations.court.title'),
      years: '49–62 ' + t('common.ad'),
      note: t('seneca.locations.court.note'),
    },
  ];

  const senecaRoles = [
    {
      title: t('seneca.roles.philosopher.title'),
      years: t('seneca.roles.philosopher.years'),
      note: t('seneca.roles.philosopher.note'),
    },
    {
      title: t('seneca.roles.senator.title'),
      years: t('seneca.roles.senator.years'),
      note: t('seneca.roles.senator.note'),
    },
    {
      title: t('seneca.roles.exile.title'),
      years: t('seneca.roles.exile.years'),
      note: t('seneca.roles.exile.note'),
    },
    {
      title: t('seneca.roles.tutor.title'),
      years: t('seneca.roles.tutor.years'),
      note: t('seneca.roles.tutor.note'),
    },
    {
      title: t('seneca.roles.advisor.title'),
      years: t('seneca.roles.advisor.years'),
      note: t('seneca.roles.advisor.note'),
    },
    {
      title: t('seneca.roles.retirement.title'),
      years: t('seneca.roles.retirement.years'),
      note: t('seneca.roles.retirement.note'),
    },
  ];

  const senecaDebate = [
    {
      heading: t('seneca.polarization.admired'),
      points: t('seneca.polarization.admiredPoints', { returnObjects: true }) as string[],
    },
    {
      heading: t('seneca.polarization.criticized'),
      points: t('seneca.polarization.criticizedPoints', { returnObjects: true }) as string[],
    },
  ];

  const senecaMajorWorks = [
    {
      title: t('seneca.works.moralLetters.title'),
      subtitle: t('seneca.works.moralLetters.subtitle'),
      date: t('seneca.works.moralLetters.date'),
      note: t('seneca.works.moralLetters.note'),
    },
    {
      title: t('seneca.works.dialogues.title'),
      subtitle: t('seneca.works.dialogues.subtitle'),
      date: t('seneca.works.dialogues.date'),
      note: t('seneca.works.dialogues.note'),
    },
    {
      title: t('seneca.works.tragedies.title'),
      subtitle: t('seneca.works.tragedies.subtitle'),
      date: t('seneca.works.tragedies.date'),
      note: t('seneca.works.tragedies.note'),
    },
    {
      title: t('seneca.works.naturalQuestions.title'),
      subtitle: t('seneca.works.naturalQuestions.subtitle'),
      date: t('seneca.works.naturalQuestions.date'),
      note: t('seneca.works.naturalQuestions.note'),
    },
    {
      title: t('seneca.works.clemency.title'),
      subtitle: t('seneca.works.clemency.subtitle'),
      date: t('seneca.works.clemency.date'),
      note: t('seneca.works.clemency.note'),
    },
    {
      title: t('seneca.works.shortness.title'),
      subtitle: t('seneca.works.shortness.subtitle'),
      date: t('seneca.works.shortness.date'),
      note: t('seneca.works.shortness.note'),
    },
  ];

  const stoicTeachings = t('seneca.philosophy.teachings', { returnObjects: true }) as Array<{ title: string; desc: string }>;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        <AuthorAboutHero
          authorInfo={authorInfo}
          authorPage={authorPage}
          language={language}
          birthPlace={details.birthPlace}
        />

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="grid gap-20 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-24">
              {/* Works Section */}
              {authorWorks.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h2 className="font-display text-3xl font-bold">{t('works')}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{t('seneca.worksSubtitle')}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {authorWorks.map((work) => (
                      <Link
                        key={work.slug || work.title}
                        to={`/seneca/works/${slugify(work.title, { lower: true, strict: true })}`}
                        className="card-modern card-hover-primary card-padding-lg group relative overflow-hidden block"
                      >
                        <div className="relative z-10">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                            {work.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {work.summary}
                          </p>
                          <div className="flex items-center text-xs font-semibold text-primary gap-2">
                            <span>{t('seneca.readArticle')}</span>
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Entries */}
              {authorPosts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between gap-4 mb-12 flex-wrap">
                    <div className="flex items-center gap-4">
                      <Scroll className="h-6 w-6 text-primary flex-shrink-0" />
                      <div>
                        <h2 className="font-display text-3xl font-bold">{t('diaryEntries')}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{t('seneca.diaryRecent')}</p>
                      </div>
                    </div>
                    <Button asChild variant="secondary" className="text-xs uppercase tracking-widest font-bold">
                      <Link to="/seneca">
                        {t('viewAllEntries')} <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className="grid gap-6">
                    {authorPosts.map((post) => (
                      <Link key={post.id} to={`/${post.author}/${post.slug}`} className="group h-full">
                        <article className="card-modern card-hover-primary card-padding-lg relative h-full overflow-hidden flex flex-col">
                          <div className="mb-4">
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                              {post.historicalDate}
                            </span>
                          </div>
                          <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {post.readingTime ? `${post.readingTime} min` : '5 min'}
                            </span>
                            <span className="inline-flex items-center text-primary font-semibold gap-1 group-hover:gap-2 transition-all">
                              {t('seneca.readArticle')} <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="card-modern card-padding-md">
                  <h3 className="font-display text-2xl font-bold mb-5 text-primary">{t('seneca.snapshots.title')}</h3>
                  <div className="space-y-3 text-sm text-foreground/80">
                    {senecaSnapshots.map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-4 border-b border-border/30 pb-2 last:border-0 last:pb-0">
                        <span className="font-semibold">{item.label}</span>
                        <div className="text-right space-y-0.5">
                          <p className="font-medium text-foreground">{item.value}</p>
                          <p className="text-xs text-muted-foreground">{item.hint}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Life Stations - Full Width Section */}
        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-display text-4xl font-bold">{t('seneca.biography.title')}</h2>
                  <p className="text-lg text-muted-foreground mt-2">{t('seneca.biography.subtitle')}</p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Early Life */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Feather className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">{t('seneca.biography.earlyLife')}</h3>
                  </div>
                  <div className="space-y-4">
                    {senecaSidebar.earlyLife.map((item) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nero Years */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">{t('seneca.biography.neroYears')}</h3>
                  </div>
                  <div className="space-y-4">
                    {senecaSidebar.neroYears.map((item) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Later Life */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">{t('seneca.biography.laterWorks')}</h3>
                  </div>
                  <div className="space-y-4">
                    {senecaSidebar.laterLife.map((item) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline visualization below */}
              <div className="mt-16 pt-12 border-t border-border/40">
                <p className="text-center text-muted-foreground mb-8">
                  {t('seneca.biography.timelineHint')}
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    to="/timeline"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    {t('seneca.biography.fullTimeline')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophical Legacy */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('seneca.legacy.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('seneca.legacy.subtitle')}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
              {senecaLegacy.map((item) => (
                <div
                  key={item.title}
                  className="card-modern card-hover-primary card-padding-lg"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{item.tag}</span>
                    <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                      {item.horizon === t('seneca.horizons.immediate') ? (
                        <>⚡ {item.horizon}</>
                      ) : (
                        <>↗ {item.horizon}</>
                      )}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Works in Detail */}
        <section className="py-20 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('seneca.deepDive.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('seneca.deepDive.subtitle')}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
              {senecaDeepDive.map((item) => (
                <div
                  key={item.title}
                  className="card-modern card-hover-primary card-padding-md"
                >
                  <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">{item.detail}</p>
                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">{t('seneca.deepDive.impact')}:</span> {item.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why He Polarizes */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('seneca.polarization.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('seneca.polarization.subtitle')}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {senecaDebate.map((block) => (
                <div
                  key={block.heading}
                  className="card-modern card-hover-primary card-padding-lg"
                >
                  <h3 className="font-display text-xl font-bold mb-4">{block.heading}</h3>
                  <div className="space-y-3">
                    {block.points.map((point) => (
                      <div key={point} className="flex gap-3 items-start">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        <p className="text-sm text-foreground/85 leading-relaxed font-medium">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations & Roles */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('seneca.theaters.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('seneca.theaters.subtitle')}</p>
            </div>

            <div className="max-w-6xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{t('seneca.theaters.locationsTitle')}</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  {senecaLocations.map((item) => (
                    <div
                      key={item.title}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t('seneca.theaters.locationsTitle')}</span>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">{item.years}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-foreground/85 leading-relaxed">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{t('seneca.theaters.rolesTitle')}</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  {senecaRoles.map((item) => (
                    <div
                      key={item.title}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t('seneca.theaters.rolesTitle')}</span>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">{item.years}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-foreground/85 leading-relaxed">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Major Works */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('seneca.works.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('seneca.works.subtitle')}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {senecaMajorWorks.map((work) => (
                <div
                  key={work.title}
                  className="card-modern card-hover-primary card-padding-md"
                >
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Book className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">{work.date}</span>
                  <h3 className="font-display text-lg font-bold mt-2 mb-1">{work.title}</h3>
                  <p className="text-xs text-primary/80 font-semibold mb-3">{work.subtitle}</p>
                  <p className="text-sm text-foreground/85 leading-relaxed">{work.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stoic Philosophy */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('seneca.philosophy.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('seneca.philosophy.subtitle')}</p>
            </div>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="card-modern card-padding-lg">
                <h3 className="font-display text-2xl font-bold mb-4">{t('seneca.philosophy.stoicismTitle')}</h3>
                <p className="text-foreground/90 leading-relaxed">{t('seneca.philosophy.stoicismDesc')}</p>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold mb-6 text-center">{t('seneca.philosophy.keyTeachings')}</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {stoicTeachings.map((teaching) => (
                    <div
                      key={teaching.title}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <h4 className="font-display text-lg font-bold mb-2">{teaching.title}</h4>
                      <p className="text-sm text-foreground/85 leading-relaxed">{teaching.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Path to Power */}
        <section className="py-24 bg-gradient-to-b from-background via-surface-container-low/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-display text-4xl font-bold mb-4">{t('seneca.rising.title')}</h2>
                <p className="text-lg text-muted-foreground">{t('seneca.rising.subtitle')}</p>
              </div>

              {/* Phase 1 */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{t('seneca.rising.phase1')}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Feather className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">31–39 {t('common.ad')}</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">{t('seneca.rising.earlySuccess')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('seneca.rising.earlySuccessDesc')}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">{t('seneca.rising.exileDate')}</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">{t('seneca.rising.exile')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('seneca.rising.exileDesc')}</p>
                  </motion.div>
                </div>
              </div>

              {/* Phase 2 - Featured Card */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{t('seneca.rising.phase2')}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">49 {t('common.ad')}</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">{t('seneca.rising.recall')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('seneca.rising.recallDesc')}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">54–59 {t('common.ad')}</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">{t('seneca.rising.quinquennium')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('seneca.rising.quinquenniumDesc')}</p>
                  </motion.div>
                </div>
              </div>

              {/* Phase 3 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{t('seneca.rising.phase3')}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">{t('seneca.rising.burrusDeathDate')}</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">{t('seneca.rising.burrusDeath')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('seneca.rising.burrusDeathDesc')}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">{t('seneca.rising.conspiracyDate')}</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">{t('seneca.rising.conspiracy')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('seneca.rising.conspiracyDesc')}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">{t('seneca.rising.deathDate')}</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">{t('seneca.rising.death')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('seneca.rising.deathDesc')}</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeless Wisdom - Quotes */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('seneca.quotes.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('seneca.quotes.subtitle')}</p>
            </div>
            <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
              {[{
                quote: t('seneca.quotes.brevitas.quote'),
                translation: t('seneca.quotes.brevitas.translation'),
                when: t('seneca.quotes.brevitas.when'),
                meaning: t('seneca.quotes.brevitas.meaning')
              }, {
                quote: t('seneca.quotes.vincit.quote'),
                translation: t('seneca.quotes.vincit.translation'),
                when: t('seneca.quotes.vincit.when'),
                meaning: t('seneca.quotes.vincit.meaning')
              }, {
                quote: t('seneca.quotes.fortuna.quote'),
                translation: t('seneca.quotes.fortuna.translation'),
                when: t('seneca.quotes.fortuna.when'),
                meaning: t('seneca.quotes.fortuna.meaning')
              }, {
                quote: t('seneca.quotes.vita.quote'),
                translation: t('seneca.quotes.vita.translation'),
                when: t('seneca.quotes.vita.when'),
                meaning: t('seneca.quotes.vita.meaning')
              }].map((item) => (
                <div
                  key={item.quote}
                  className="card-modern card-hover-primary card-padding-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <Sparkles className="h-3.5 w-3.5" /> {t('seneca.quotes.impact')}
                    </span>
                    <span className="text-xs font-semibold text-primary/70">{item.when}</span>
                  </div>
                  <p className="text-xl font-display italic text-foreground/90 mb-1">{item.quote}</p>
                  <p className="text-base font-medium text-muted-foreground mb-4">{item.translation}</p>
                  <p className="text-sm text-foreground/85 leading-relaxed">{item.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
