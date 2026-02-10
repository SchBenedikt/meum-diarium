import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { MapPin, BookOpen, Award, ArrowRight, Clock, Sword, Users, Scroll, AlertTriangle, Shield, Flame } from 'lucide-react';
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
export function CatilinaAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { authorId } = useParams<{ authorId: string }>();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);
  const authorDetails = useAuthorDetails(t);
  useEffect(() => {
    if (authorId === 'catilina') {
      setCurrentAuthor('catilina' as Author);
      async function translateContent() {
        if (!postsLoading) {
          const authorPostsList = allPosts.filter(p => p.author === 'catilina').slice(0, 3);
          setAuthorPosts(authorPostsList);
        }
        const translatedWorks = await Promise.all(
          Object.values(baseWorks).filter(w => w.author === 'catilina').map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
        );
        setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));
        try {
          const res = await fetch('/api/pages/catilina');
          if (res.ok) {
            const data: PageContent = await res.json();
            setAuthorPage(data);
          } else {
            console.warn('⚠️ API failed, using fallback data for Catilina');
            // Fallback data
            setAuthorPage({
              slug: 'catilina',
              heroTitle: 'Lucius Sergius Catilina',
              heroSubtitle: 'Römischer Senator und Verschwörer',
              heroImage: '/images/catilina-hero.jpg',
              projectDescription: 'Anführer der berüchtigten Catilinarischen Verschwörung gegen die Römische Republik.',
              highlights: [],
              translations: {
                en: { heroTitle: 'Lucius Sergius Catilina' },
                la: { heroTitle: 'Lucius Sergius Catilina' }
              }
            });
          }
        } catch (error) {
          console.warn('⚠️ API error, using fallback data for Catilina:', error);
          // Fallback data
          setAuthorPage({
            slug: 'catilina',
            heroTitle: 'Lucius Sergius Catilina',
            heroSubtitle: 'Römischer Senator und Verschwörer',
            heroImage: '/images/catilina-hero.jpg',
            projectDescription: 'Anführer der berüchtigten Catilinarischen Verschwörung gegen die Römische Republik.',
            highlights: [],
            translations: {
              en: { heroTitle: 'Lucius Sergius Catilina' },
              la: { heroTitle: 'Lucius Sergius Catilina' }
            }
          });
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
    <div className="min-h-screen flex flex-col bg-background">
      <AuthorAboutHero authorInfo={authorInfo} />
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {/* Introduction Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl leading-relaxed text-muted-foreground">
              {t('catilina.intro.paragraph1')}
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t('catilina.intro.paragraph2')}
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t('catilina.intro.paragraph3')}
            </p>
          </div>
        </motion.div>
        {/* Quick Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">{t('catilina.quickFacts.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {catilinaSnapshots.map((snapshot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="text-sm text-muted-foreground mb-1">{snapshot.label}</div>
                <div className="text-lg font-bold text-foreground mb-1">{snapshot.value}</div>
                <div className="text-xs text-muted-foreground">{snapshot.hint}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Historical Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">{t('catilina.historicalContext.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {catilinaContext.map((context, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">{context.title}</h3>
                    <div className="text-sm text-primary">{context.period}</div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{context.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">{t('catilina.timeline.title')}</h2>
          <div className="space-y-4">
            {catilinaTimeline.map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-24 text-right">
                    <div className="text-lg font-bold text-primary">{formatYear(event.year)}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 bg-card rounded-xl p-4 border border-border">
                    <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        {/* The Conspiracy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">{t('catilina.conspiracy.title')}</h2>
          <div className="space-y-6">
            {conspiracyPhases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{phase.title}</h3>
                      <span className="text-sm text-primary font-semibold">{phase.year}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">{phase.description}</p>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <div className="text-sm font-semibold text-foreground mb-1">{t('catilina.conspiracy.outcome')}:</div>
                      <div className="text-sm text-muted-foreground">{phase.outcome}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Cicero's Speeches Against Catilina */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">{t('catilina.ciceroSpeeches.title')}</h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('catilina.ciceroSpeeches.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ciceroSpeeches.map((speech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex items-start gap-3 mb-4">
                  <Scroll className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-1">{speech.title}</h3>
                    <div className="text-sm text-primary">{speech.date}</div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">{speech.summary}</p>
                <div className="bg-primary/5 rounded-lg p-3">
                  <div className="text-sm font-semibold text-foreground mb-1">{t('catilina.ciceroSpeeches.impactLabel')}:</div>
                  <div className="text-sm text-muted-foreground">{speech.impact}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Legacy and Historical Significance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">{t('catilina.legacy.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {catilinaLegacy.map((legacy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{legacy.tag}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{legacy.horizon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{legacy.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{legacy.summary}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Historical Sources Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-16"
        >
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
        </motion.div>
        {/* Related Content */}
        {authorPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8">{t('catilina.relatedContent.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {authorPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  to={`/${post.author}/${post.slug}`}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
                  >
                    {post.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex justify-between items-center"
        >
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
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
