import CaesarCampaignMap from '@/components/CaesarCampaignMap';
import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, MapPin, BookOpen, Award, ArrowLeft, Users, Scroll, Clock, ArrowRight, Sword, Map, Trophy, Landmark, Crown, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { authors as baseAuthors } from '@/data/authors';
import { works as baseWorks } from '@/data/works';
import slugify from 'slugify';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Author, AuthorInfo, BlogPost, Work } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthor, getTranslatedPost, getTranslatedWork } from '@/lib/translator';
import { usePosts } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { PageContent, PageLanguage } from '@/types/page';
import { useAuthorDetails } from './useAuthorDetails';
import { AuthorAboutHero } from '@/components/layout/AuthorAboutHero';

export function CaesarAboutPage() {
  const { setCurrentAuthor } = useAuthor();
  const { authorId } = useParams<{ authorId: string }>();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();

  const [authorInfo, setAuthorInfo] = useState<AuthorInfo | null>(null);
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);

  const authorDetails = useAuthorDetails(t);

  useEffect(() => {
    if (authorId === 'caesar') {
      setCurrentAuthor('caesar' as Author);
      async function translateContent() {
        const translatedAuthor = await getTranslatedAuthor(language, 'caesar' as Author);
        setAuthorInfo(translatedAuthor);

        if (!postsLoading) {
          const translatedPosts = await Promise.all(
            allPosts.filter(p => p.author === 'caesar').slice(0, 3).map(p => getTranslatedPost(language, p.author, p.slug))
          );
          setAuthorPosts(translatedPosts.filter((p): p is BlogPost => p !== null));
        }

        const translatedWorks = await Promise.all(
          Object.values(baseWorks).filter(w => w.author === 'caesar').map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
        );
        setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));

        try {
          const res = await fetch('/api/pages/author-about-caesar');
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
    return null;
  }

  const details = authorDetails.caesar;

  const caesarSnapshots = [
    { label: t('caesar.snapshots.lifespan'), value: '100–44 ' + t('common.bc'), hint: '56 ' + t('common.years') },
    { label: t('caesar.snapshots.consulship'), value: '59 ' + t('common.bc'), hint: t('caesar.snapshots.consulship') },
    { label: t('caesar.snapshots.dictatorship'), value: '49–44 ' + t('common.bc'), hint: 'perpetuo ab 44' },
    { label: t('caesar.snapshots.gallicWar'), value: '8 ' + t('common.years'), hint: '58–50 ' + t('common.bc') },
    { label: t('caesar.snapshots.legions'), value: '9 ' + t('caesar.snapshots.legions'), hint: 'ca. 40–50k' },
    { label: t('caesar.snapshots.campaigns'), value: '4', hint: 'Gallia, Germania, Britannia, Hispania' },
  ];

  const caesarReforms = [
    {
      title: t('caesar.legacy.julianCalendar') + ' (46 ' + t('common.bc') + ')',
      summary: t('caesar.legacy.julianCalendarSummary'),
      tag: t('caesar.tags.timeAdmin'),
      horizon: t('caesar.horizons.longTerm'),
    },
    {
      title: t('caesar.legacy.debtRelief') + ' (49 ' + t('common.bc') + ')',
      summary: t('caesar.legacy.debtReliefSummary'),
      tag: t('caesar.tags.economy'),
      horizon: t('caesar.horizons.immediate'),
    },
    {
      title: t('caesar.legacy.citizenship'),
      summary: t('caesar.legacy.citizenshipSummary'),
      tag: t('caesar.tags.stateLaw'),
      horizon: t('caesar.horizons.longTerm'),
    },
    {
      title: t('caesar.legacy.veterans'),
      summary: t('caesar.legacy.veteransSummary'),
      tag: t('caesar.tags.socialPolicy'),
      horizon: t('caesar.horizons.mediumTerm'),
    },
    {
      title: t('caesar.legacy.infrastructure'),
      summary: t('caesar.legacy.infrastructureSummary'),
      tag: t('caesar.tags.urbanPlanning'),
      horizon: t('caesar.horizons.mediumTerm'),
    },
    {
      title: t('caesar.legacy.senateReform'),
      summary: t('caesar.legacy.senateReformSummary'),
      tag: t('caesar.tags.institutions'),
      horizon: t('caesar.horizons.longTerm'),
    },
  ];

  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return '—';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} ${t('common.bc')}` : `${year} ${t('common.ad')}`;
  };

  const caesarSidebar = {
    feldzuege: [
      { year: -58, title: t('caesar.timeline.campaigns.gallicWar.title'), note: t('caesar.timeline.campaigns.gallicWar.note') },
      { year: -55, title: t('caesar.timeline.campaigns.rhine.title'), note: t('caesar.timeline.campaigns.rhine.note') },
      { year: -52, title: t('caesar.timeline.campaigns.alesia.title'), note: t('caesar.timeline.campaigns.alesia.note') },
      { year: -49, title: t('caesar.timeline.campaigns.civilWar.title'), note: t('caesar.timeline.campaigns.civilWar.note') },
      { year: -48, title: t('caesar.timeline.campaigns.alexandria.title'), note: t('caesar.timeline.campaigns.alexandria.note') },
      { year: -46, title: t('caesar.timeline.campaigns.thapsus.title'), note: t('caesar.timeline.campaigns.thapsus.note') },
      { year: -45, title: t('caesar.timeline.campaigns.munda.title'), note: t('caesar.timeline.campaigns.munda.note') },
    ],
    aemter: [
      { year: -63, title: t('caesar.timeline.offices.pontifex.title'), note: t('caesar.timeline.offices.pontifex.note') },
      { year: -59, title: t('caesar.timeline.offices.consul.title'), note: t('caesar.timeline.offices.consul.note') },
      { year: -49, title: t('caesar.timeline.offices.dictator.title'), note: t('caesar.timeline.offices.dictator.note') },
      { year: -46, title: t('caesar.timeline.offices.dictator10.title'), note: t('caesar.timeline.offices.dictator10.note') },
      { year: -44, title: t('caesar.timeline.offices.dictatorLife.title'), note: t('caesar.timeline.offices.dictatorLife.note') },
    ],
    reformen: [
      { year: -46, title: t('caesar.timeline.reforms.calendar.title'), note: t('caesar.timeline.reforms.calendar.note') },
      { year: -49, title: t('caesar.timeline.reforms.debt.title'), note: t('caesar.timeline.reforms.debt.note') },
      { year: -46, title: t('caesar.timeline.reforms.senate.title'), note: t('caesar.timeline.reforms.senate.note') },
      { year: -45, title: t('caesar.timeline.reforms.veterans.title'), note: t('caesar.timeline.reforms.veterans.note') },
    ],
  };

  const caesarReformDeep = [
    {
      title: t('caesar.legacy.julianCalendar'),
      detail: t('caesar.deepDive.calendarDetail'),
      impact: t('caesar.legacy.julianCalendarSummary'),
    },
    {
      title: t('caesar.legacy.citizenship'),
      detail: t('caesar.deepDive.citizenshipDetail'),
      impact: t('caesar.legacy.citizenshipSummary'),
    },
    {
      title: t('caesar.legacy.veterans'),
      detail: t('caesar.deepDive.veteransDetail'),
      impact: t('caesar.legacy.veteransSummary'),
    },
  ];

  const caesarTheaters = [
    {
      title: t('caesar.locations.gallia.title'),
      years: '58–50 ' + t('common.bc'),
      note: t('caesar.locations.gallia.note'),
    },
    {
      title: t('caesar.locations.germania.title'),
      years: '55–53 ' + t('common.bc'),
      note: t('caesar.locations.germania.note'),
    },
    {
      title: t('caesar.locations.britannia.title'),
      years: '55–54 ' + t('common.bc'),
      note: t('caesar.locations.britannia.note'),
    },
    {
      title: t('caesar.locations.hispania.title'),
      years: '49–45 ' + t('common.bc'),
      note: t('caesar.locations.hispania.note'),
    },
  ];

  const caesarOffices = [
    {
      title: t('caesar.timeline.offices.pontifex.title'),
      years: '63 ' + t('common.bc'),
      note: t('caesar.officeDetails.pontifex.note'),
    },
    {
      title: t('caesar.timeline.offices.consul.title'),
      years: '59 ' + t('common.bc'),
      note: t('caesar.officeDetails.consul.note'),
    },
    {
      title: t('caesar.timeline.offices.dictator.title'),
      years: '49–44 ' + t('common.bc'),
      note: t('caesar.officeDetails.dictator.note'),
    },
  ];

  const caesarDebate = [
    {
      heading: t('caesar.polarization.admired'),
      points: t('caesar.polarization.admiredPoints', { returnObjects: true }) as string[],
    },
    {
      heading: t('caesar.polarization.feared'),
      points: t('caesar.polarization.fearedPoints', { returnObjects: true }) as string[],
    },
  ];

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
                      <p className="text-sm text-muted-foreground mt-1">{t('caesar.worksSubtitle')}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {authorWorks.map((work, i) => (
                      <Link
                        key={i}
                        to={`/caesar/works/${slugify(work.title, { lower: true, strict: true })}`}
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
                            <span>{t('caesar.readArticle')}</span>
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
                        <p className="text-sm text-muted-foreground mt-1">{t('caesar.diaryRecent')}</p>
                      </div>
                    </div>
                    <Button asChild variant="secondary" className="text-xs uppercase tracking-widest font-bold">
                      <Link to="/caesar">
                        {t('viewAllEntries')} <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
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
                              {t('caesar.readArticle')} <ArrowRight className="h-3 w-3" />
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
                  <h3 className="font-display text-2xl font-bold mb-5 text-primary">{t('caesar.snapshots.title')}</h3>
                  <div className="space-y-3 text-sm text-foreground/80">
                    {caesarSnapshots.map((item) => (
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

        {/* Lebenslauf & Stationen - Full Width Section */}
        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-display text-4xl font-bold">{t('caesar.biography.title')}</h2>
                  <p className="text-lg text-muted-foreground mt-2">{t('caesar.biography.subtitle')}</p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Feldzüge & Kriege */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Sword className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">{t('caesar.biography.campaigns')}</h3>
                  </div>
                  <div className="space-y-4">
                    {caesarSidebar.feldzuege.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 2 && (
                          <Link
                            to="/caesar/gallia-und-britannia"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            {t('caesar.readArticle')}
                          </Link>
                        )}
                        {idx === 4 && (
                          <Link
                            to="/caesar/bürgerkrieg-und-herrschaft"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            {t('caesar.readArticle')}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ämter */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">{t('caesar.biography.offices')}</h3>
                  </div>
                  <div className="space-y-4">
                    {caesarSidebar.aemter.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 1 && (
                          <Link
                            to="/caesar/konsulat-und-macht"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            {t('caesar.readArticle')}
                          </Link>
                        )}
                        {idx === 4 && (
                          <Link
                            to="/caesar/diktator-perpetuo"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            {t('caesar.readArticle')}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reformen */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">{t('caesar.biography.reforms')}</h3>
                  </div>
                  <div className="space-y-4">
                    {caesarSidebar.reformen.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 0 && (
                          <Link
                            to="/caesar/julianischer-kalender"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            {t('caesar.readArticle')}
                          </Link>
                        )}
                        {idx === 2 && (
                          <Link
                            to="/caesar/senatsreform"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            {t('caesar.readArticle')}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline visualization below */}
              <div className="mt-16 pt-12 border-t border-border/40">
                <p className="text-center text-muted-foreground mb-8">
                  {t('caesar.biography.timelineHint')}
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    to="/timeline"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    {t('caesar.biography.fullTimeline')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reformen, die blieben */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('caesar.legacy.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('caesar.legacy.subtitle')}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
              {caesarReforms.map((reform) => {
                const reformSlugByTitle: Record<string, string> = {
                  'Julianischer Kalender (46 v. Chr.)': 'julianischer-kalender',
                  'Schuldenerlass & Zinsdeckel (49 v. Chr.)': 'schuldenerlass-und-zinsdeckel',
                  'Ausweitung des Bürgerrechts': 'ausweitung-des-burgerrechts',
                  'Land- & Veteranengesetze': 'land-und-veteranengesetze',
                  'Forum Iulium & Infrastruktur': 'forum-iulium-und-infrastruktur',
                  'Senatsreform': 'senatsreform',
                };
                const slug = reformSlugByTitle[reform.title];
                const cardContent = (
                  <>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{reform.tag}</span>
                      <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                        {reform.horizon === t('caesar.horizons.immediate') ? (
                          <>⚡ {reform.horizon}</>
                        ) : reform.horizon === t('caesar.horizons.mediumTerm') ? (
                          <>↗ {reform.horizon}</>
                        ) : (
                          <>↗ {reform.horizon}</>
                        )}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{reform.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{reform.summary}</p>
                    {slug && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-primary font-semibold">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{t('caesar.readArticle')}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </>
                );
                return slug ? (
                  <Link
                    key={reform.title}
                    to={`/caesar/${slug}`}
                    className="card-modern card-hover-primary card-padding-lg block"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <div
                    key={reform.title}
                    className="card-modern card-hover-primary card-padding-lg"
                  >
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Reformen im Detail */}
        <section className="py-20 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('caesar.deepDive.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('caesar.deepDive.subtitle')}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
              {caesarReformDeep.map((item) => {
                const deepSlugByTitle: Record<string, string> = {
                  'Kalenderreform': 'julianischer-kalender',
                  'Bürgerrecht & Elitenbindung': 'ausweitung-des-burgerrechts',
                  'Land- und Veteranenpolitik': 'land-und-veteranengesetze',
                };
                const slug = deepSlugByTitle[item.title];
                const cardContent = (
                  <>
                    <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed mb-3">{item.detail}</p>
                    <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">{t('caesar.deepDive.impact')}:</span> {item.impact}
                    </div>
                    {slug && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-primary font-semibold">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{t('caesar.readArticle')}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </>
                );
                return slug ? (
                  <Link
                    key={item.title}
                    to={`/caesar/${slug}`}
                    className="card-modern card-hover-primary card-padding-md block"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <div
                    key={item.title}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Warum er polarisiert */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('caesar.polarization.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('caesar.polarization.subtitle')}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {caesarDebate.map((block) => (
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

        {/* Schauplätze & Ämter */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('caesar.theaters.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('caesar.theaters.subtitle')}</p>
            </div>

            <div className="max-w-6xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{t('caesar.theaters.theatersTitle')}</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  {caesarTheaters.map((item) => (
                    <div
                      key={item.title}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t('caesar.theaters.theatersTitle')}</span>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">{item.years}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-foreground/85 leading-relaxed">{item.note}</p>
                    </div>
                  ))}
                </div>
                <div className="card-modern card-padding-md flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Map className="w-5 h-5 text-primary" />
                    <h3 className="font-display text-xl font-bold">{t('caesar.theaters.mapTitle')}</h3>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {t('caesar.theaters.mapDesc')}
                  </p>
                  <CaesarCampaignMap mapHeightClass="h-[520px] lg:h-[620px]" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{t('caesar.theaters.officesTitle')}</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  {caesarOffices.map((item) => (
                    <div
                      key={item.title}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t('caesar.theaters.officesTitle')}</span>
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

        {/* Militärische Meisterleistungen */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('caesar.military.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('caesar.military.subtitle')}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[{
                icon: Sword,
                title: t('caesar.militaryDetails.gallic.title'),
                years: '58–50 ' + t('common.bc'),
                note: t('caesar.militaryDetails.gallic.note')
              }, {
                icon: Map,
                title: t('caesar.militaryDetails.britain.title'),
                years: '55–54 ' + t('common.bc'),
                note: t('caesar.militaryDetails.britain.note')
              }, {
                icon: Trophy,
                title: t('caesar.militaryDetails.civil.title'),
                years: '49–45 ' + t('common.bc'),
                note: t('caesar.militaryDetails.civil.note')
              }].map((item) => (
                <div
                  key={item.title}
                  className="card-modern card-hover-primary card-padding-lg"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-primary font-semibold mb-3">{item.years}</p>
                  <p className="text-sm text-foreground/85 leading-relaxed font-medium">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Caesars Weg zur Macht */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-4">{t('caesar.rising.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('caesar.rising.subtitle')}</p>
            </div>
            <div className="max-w-6xl mx-auto">
              {/* Phase 1 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{t('caesar.rising.phase1')}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Link to="/caesar/das-1-triumvirat">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="relative p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl hover:border-primary/30 transition-all group h-full"
                    >
                      <div className="absolute top-4 right-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">60 {t('common.bc')}</span>
                      <h3 className="font-display text-2xl font-bold mb-3">{t('caesar.rising.triumvirate')}</h3>
                      <p className="text-sm text-foreground/85 leading-relaxed mb-4">{t('caesar.rising.triumvirateDesc')}</p>
                      <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{t('caesar.readEntry')}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </motion.div>
                  </Link>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl hover:border-primary/30 transition-all group"
                  >
                    <div className="absolute top-4 right-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                      <Landmark className="h-6 w-6 text-primary" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">59 {t('common.bc')}</span>
                    <h3 className="font-display text-2xl font-bold mb-3">{t('caesar.rising.consulship')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('caesar.rising.consulshipDesc')}</p>
                  </motion.div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{t('caesar.rising.phase2')}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative p-10 rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-card/60 to-card/40 backdrop-blur-xl overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-3">{t('caesar.rising.rubiconDate')}</span>
                        <h3 className="font-display text-3xl font-bold mb-2">{t('caesar.rising.rubiconTitle')}</h3>
                        <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">{t('caesar.rising.rubiconSubtitle')}</p>
                      </div>
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Landmark className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <p className="text-base text-foreground/90 leading-relaxed mb-4">{t('caesar.rising.rubiconDesc')}</p>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 text-xs text-primary/80">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="font-semibold">{t('caesar.rising.rubiconTag')}</span>
                      </div>
                      <Link
                        to="/caesar/ich-uberschreite-den-rubikon"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-bold transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        {t('caesar.rising.rubiconBtn')}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Phase 3 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{t('caesar.rising.phase3')}</span>
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
                      <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">46 {t('common.bc')}</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">{t('caesar.rising.dictatorship')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('caesar.rising.dictatorshipDesc')}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">44 {t('common.bc')}</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">{t('caesar.rising.dictatorPerpetuo')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('caesar.rising.dictatorPerpetuoDesc')}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">{t('caesar.rising.idesOfMarchDate')}</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">{t('caesar.rising.idesOfMarch')}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">{t('caesar.rising.idesOfMarchDesc')}</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legendäre Zitate */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('caesar.quotes.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('caesar.quotes.subtitle')}</p>
            </div>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              {[{
                quote: t('caesar.quotes.veni.quote'),
                translation: t('caesar.quotes.veni.translation'),
                when: t('caesar.quotes.veni.when'),
                meaning: t('caesar.quotes.veni.meaning')
              }, {
                quote: t('caesar.quotes.alea.quote'),
                translation: t('caesar.quotes.alea.translation'),
                when: t('caesar.quotes.alea.when'),
                meaning: t('caesar.quotes.alea.meaning')
              }, {
                quote: t('caesar.quotes.brute.quote'),
                translation: t('caesar.quotes.brute.translation'),
                when: t('caesar.quotes.brute.when'),
                meaning: t('caesar.quotes.brute.meaning')
              }].map((item) => (
                <div
                  key={item.quote}
                  className="card-modern card-hover-primary card-padding-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <Sparkles className="h-3.5 w-3.5" /> {t('caesar.quotes.impact')}
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
