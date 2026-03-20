import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { MapPin, BookOpen, Award, ArrowRight, Clock, Sword, Users, Scroll, AlertTriangle, Shield, Flame, Landmark } from 'lucide-react';
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
import catilinaPageData from '@/content/pages/author-about-catilina.json';
export function CatilinaAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);
  const authorDetails = useAuthorDetails(t);
  useEffect(() => {
    setCurrentAuthor('catilina' as Author);

    async function translateContent() {
      // Use local JSON data directly
      setAuthorPage(catilinaPageData as PageContent);

      if (!postsLoading && allPosts.length > 0) {
        const authorPostsList = allPosts.filter(p => p.author === 'catilina').slice(0, 3);
        setAuthorPosts(authorPostsList);
      }

      const translatedWorks = await Promise.all(
        Object.values(baseWorks).filter(w => w.author === 'catilina').map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
      );
      setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));
    }
    translateContent();
  }, [setCurrentAuthor, language, allPosts, postsLoading]);
  if (!authorInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Lade Inhalte...
      </div>
    );
  }
  const details = authorDetails.catilina;
  const catilinaSnapshots = [
    { label: t('catilina.snapshots.lifespan'), value: '108–62 ' + t('common.bc'), hint: '~46 ' + t('common.years') },
    { label: t('catilina.snapshots.conspiracy'), value: '63 ' + t('common.bc'), hint: t('catilina.snapshots.conspiracyHint') },
    { label: t('catilina.snapshots.consulElections'), value: '2', hint: '64 & 63 ' + t('common.bc') },
    { label: t('catilina.snapshots.supporters'), value: '3000+', hint: t('catilina.snapshots.supportersHint') },
    { label: t('catilina.snapshots.ciceroSpeeches'), value: '4', hint: 'In Catilinam I-IV' },
    { label: t('catilina.snapshots.finalBattle'), value: 'Pistoria', hint: '62 ' + t('common.bc') },
  ];
  const catilinaTimeline = [
    {
      year: -108,
      title: t('catilina.timeline.birth.title'),
      description: t('catilina.timeline.birth.description'),
      type: 'birth' as const,
      icon: Users,
    },
    {
      year: -68,
      title: t('catilina.timeline.praetor.title'),
      description: t('catilina.timeline.praetor.description'),
      type: 'event' as const,
      icon: Landmark,
    },
    {
      year: -66,
      title: t('catilina.timeline.africa.title'),
      description: t('catilina.timeline.africa.description'),
      type: 'event' as const,
      icon: MapPin,
    },
    {
      year: -64,
      title: t('catilina.timeline.firstElection.title'),
      description: t('catilina.timeline.firstElection.description'),
      type: 'event' as const,
      icon: AlertTriangle,
    },
    {
      year: -63,
      title: t('catilina.timeline.secondElection.title'),
      description: t('catilina.timeline.secondElection.description'),
      type: 'event' as const,
      icon: AlertTriangle,
    },
    {
      year: -63,
      title: t('catilina.timeline.conspiracyRevealed.title'),
      description: t('catilina.timeline.conspiracyRevealed.description'),
      type: 'event' as const,
      icon: Scroll,
    },
    {
      year: -63,
      title: t('catilina.timeline.fleeRome.title'),
      description: t('catilina.timeline.fleeRome.description'),
      type: 'event' as const,
      icon: Flame,
    },
    {
      year: -62,
      title: t('catilina.timeline.death.title'),
      description: t('catilina.timeline.death.description'),
      type: 'death' as const,
      icon: Sword,
    },
  ];
  const catilinaLegacy = [
    {
      title: t('catilina.legacy.symbolOfCorruption'),
      summary: t('catilina.legacy.symbolOfCorruptionSummary'),
      tag: t('catilina.tags.politics'),
      horizon: t('catilina.horizons.longTerm'),
    },
    {
      title: t('catilina.legacy.ciceroRise'),
      summary: t('catilina.legacy.ciceroRiseSummary'),
      tag: t('catilina.tags.rhetoric'),
      horizon: t('catilina.horizons.immediate'),
    },
    {
      title: t('catilina.legacy.republicanCrisis'),
      summary: t('catilina.legacy.republicanCrisisSummary'),
      tag: t('catilina.tags.history'),
      horizon: t('catilina.horizons.longTerm'),
    },
    {
      title: t('catilina.legacy.debtCrisis'),
      summary: t('catilina.legacy.debtCrisisSummary'),
      tag: t('catilina.tags.economics'),
      horizon: t('catilina.horizons.mediumTerm'),
    },
  ];
  const catilinaContext = [
    {
      title: t('catilina.context.lateRepublic.title'),
      description: t('catilina.context.lateRepublic.description'),
      period: '1. ' + t('common.century') + ' ' + t('common.bc'),
    },
    {
      title: t('catilina.context.debtCrisis.title'),
      description: t('catilina.context.debtCrisis.description'),
      period: '70-60s ' + t('common.bc'),
    },
    {
      title: t('catilina.context.sullaLegacy.title'),
      description: t('catilina.context.sullaLegacy.description'),
      period: t('catilina.context.sullaLegacy.period'),
    },
    {
      title: t('catilina.context.nobilitas.title'),
      description: t('catilina.context.nobilitas.description'),
      period: t('catilina.context.nobilitas.period'),
    },
  ];
  const conspiracyPhases = [
    {
      title: t('catilina.conspiracy.firstPlot.title'),
      year: '64 ' + t('common.bc'),
      description: t('catilina.conspiracy.firstPlot.description'),
      outcome: t('catilina.conspiracy.firstPlot.outcome'),
    },
    {
      title: t('catilina.conspiracy.secondPlot.title'),
      year: '63 ' + t('common.bc'),
      description: t('catilina.conspiracy.secondPlot.description'),
      outcome: t('catilina.conspiracy.secondPlot.outcome'),
    },
    {
      title: t('catilina.conspiracy.exposure.title'),
      year: t('catilina.conspiracy.exposure.year'),
      description: t('catilina.conspiracy.exposure.description'),
      outcome: t('catilina.conspiracy.exposure.outcome'),
    },
    {
      title: t('catilina.conspiracy.finalStand.title'),
      year: t('catilina.conspiracy.finalStand.year'),
      description: t('catilina.conspiracy.finalStand.description'),
      outcome: t('catilina.conspiracy.finalStand.outcome'),
    },
  ];
  const ciceroSpeeches = [
    {
      title: t('catilina.ciceroSpeeches.first.title'),
      date: t('catilina.ciceroSpeeches.first.date'),
      summary: t('catilina.ciceroSpeeches.first.summary'),
      impact: t('catilina.ciceroSpeeches.first.impact'),
    },
    {
      title: t('catilina.ciceroSpeeches.second.title'),
      date: t('catilina.ciceroSpeeches.second.date'),
      summary: t('catilina.ciceroSpeeches.second.summary'),
      impact: t('catilina.ciceroSpeeches.second.impact'),
    },
    {
      title: t('catilina.ciceroSpeeches.third.title'),
      date: t('catilina.ciceroSpeeches.third.date'),
      summary: t('catilina.ciceroSpeeches.third.summary'),
      impact: t('catilina.ciceroSpeeches.third.impact'),
    },
    {
      title: t('catilina.ciceroSpeeches.fourth.title'),
      date: t('catilina.ciceroSpeeches.fourth.date'),
      summary: t('catilina.ciceroSpeeches.fourth.summary'),
      impact: t('catilina.ciceroSpeeches.fourth.impact'),
    },
  ];
  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return '—';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} ${t('common.bc')}` : `${year} ${t('common.ad')}`;
  };
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        <AuthorAboutHero authorInfo={authorInfo} authorPage={authorPage} language={language} birthPlace={details.birthPlace} />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="grid gap-20 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-24">
              {authorWorks.length > 0 && (
                <section>
                  <div className="flex items-center gap-6 mb-12">
                    <h2 className="font-display text-4xl font-bold">{t('works')}</h2>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {authorWorks.map((work, i) => (
                      <Link
                        key={i}
                        to={`/catilina/works/${slugify(work.title, { lower: true, strict: true })}`}
                        className="card-modern card-hover-primary card-padding-lg group relative overflow-hidden block"
                      >
                        <div className="relative z-10">
                          <BookOpen className="h-8 w-8 text-primary mb-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {work.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-3 mb-8 italic">
                            {work.summary}
                          </p>
                          <div className="flex items-center text-sm font-bold uppercase tracking-widest text-primary gap-2">
                            <span>{t('readMore')}</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {authorPosts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-12">
                    <h2 className="font-display text-4xl font-bold">{t('diaryEntries')}</h2>
                    <Button asChild variant="ghost" className="text-primary hover:text-primary/80 uppercase tracking-widest font-bold text-xs">
                      <Link to="/catilina">
                        {t('viewAllEntries')} <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {authorPosts.map((post) => (
                      <Link key={post.id} to={`/${post.author}/${post.slug}`} className="group h-full">
                        <article className="card-modern card-hover-primary card-padding-md relative h-full overflow-hidden">
                          <div className="relative flex items-center justify-between gap-3 mb-4">
                            <h3 className="font-display text-2xl font-bold group-hover:text-primary transition-colors leading-tight">
                              {post.title}
                            </h3>
                            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                              {post.historicalDate}
                            </span>
                          </div>
                          <p className="relative text-base text-foreground/85 leading-relaxed line-clamp-3 mb-5">
                            {post.excerpt}
                          </p>
                          <div className="relative flex items-center justify-between text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary/60" />
                              {post.readingTime ? `${post.readingTime} min` : '5 min'} Lesedauer
                            </span>
                            <span className="inline-flex items-center text-primary font-semibold text-sm">
                              Weiterlesen
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="card-modern card-padding-md">
                  <h3 className="font-display text-2xl font-bold mb-5 text-primary">Kurzfakten</h3>
                  <div className="space-y-3 text-sm text-foreground/80">
                    {catilinaSnapshots.map((item) => (
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

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('catilina.historicalContext.title')}</h2>
              <p className="text-lg text-muted-foreground">Politische und soziale Spannungen in der späten Republik als Nährboden der Verschwörung.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
              {catilinaContext.map((context, index) => (
                <div key={index} className="card-modern card-hover-primary card-padding-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Kontext</span>
                    <span className="text-xs font-semibold text-primary/70">{context.period}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{context.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{context.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-display text-4xl font-bold">{t('catilina.timeline.title')}</h2>
                  <p className="text-lg text-muted-foreground mt-2">Wendepunkte von Aufstieg, Verschwörung und Untergang.</p>
                </div>
              </div>
              <div className="space-y-4">
                {catilinaTimeline.map((event, index) => {
                  const Icon = event.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 }}
                      className="flex gap-4 items-start"
                    >
                      <div className="flex-shrink-0 w-24 text-right pt-3">
                        <div className="text-sm font-bold text-primary">{formatYear(event.year)}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-2">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 bg-card rounded-2xl p-4 border border-border">
                        <h3 className="font-bold mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-16 pt-12 border-t border-border/40">
                <p className="text-center text-muted-foreground mb-8">Für eine detaillierte Chronologie aller Ereignisse:</p>
                <div className="flex justify-center gap-4">
                  <Link
                    to="/timeline"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <Clock className="h-4 w-4" />
                    Zur vollständigen Chronologie
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('catilina.conspiracy.title')}</h2>
              <p className="text-lg text-muted-foreground">Die Verschwörung in Phasen, Akteuren und Folgen.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
              {conspiracyPhases.map((phase, index) => (
                <div key={index} className="card-modern card-hover-primary card-padding-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <AlertTriangle className="h-3.5 w-3.5" /> Phase
                    </span>
                    <span className="text-xs font-semibold text-primary/70">{phase.year}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{phase.title}</h3>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-4">{phase.description}</p>
                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">{t('catilina.conspiracy.outcome')}:</span> {phase.outcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('catilina.ciceroSpeeches.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('catilina.ciceroSpeeches.description')}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
              {ciceroSpeeches.map((speech, index) => (
                <div key={index} className="card-modern card-hover-primary card-padding-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Rede</span>
                    <span className="text-xs font-semibold text-primary/70">{speech.date}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{speech.title}</h3>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-4">{speech.summary}</p>
                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">{t('catilina.ciceroSpeeches.impactLabel')}:</span> {speech.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('catilina.legacy.title')}</h2>
              <p className="text-lg text-muted-foreground">Historische Wirkung der Catilinarischen Verschwörung auf Republik, Rhetorik und politische Kultur.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
              {catilinaLegacy.map((legacy, index) => (
                <div key={index} className="card-modern card-hover-primary card-padding-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{legacy.tag}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{legacy.horizon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{legacy.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{legacy.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-secondary/30 rounded-xl p-6 border-l-4 border-primary">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {t('catilina.sources.title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  {t('catilina.sources.description')}
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>{t('catilina.sources.cicero')}</li>
                  <li>{t('catilina.sources.sallust')}</li>
                  <li>{t('catilina.sources.note')}</li>
                </ul>
              </div>
              <div className="mt-12 flex justify-between items-center">
                <Link to="/about">
                  <Button variant="outline" className="gap-2">
                    {t('backToAuthorOverview')}
                  </Button>
                </Link>
                <Link to={`/${authorInfo.id}`}>
                  <Button className="gap-2">
                    {t('catilina.viewDiary')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}