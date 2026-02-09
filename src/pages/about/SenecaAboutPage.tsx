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
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <SEO
        title={authorInfo.name}
        description={authorInfo.description}
        author="Meum Diarium"
        image={`${baseUrl}/images/seneca-hero.jpg`}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": `${authorInfo.name} - Meum Diarium`,
          "description": authorInfo.description,
          "url": `${baseUrl}/authors/seneca`,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required"
          },
          "about": [
            {
              "@type": "Person",
              "name": "Lucius Annaeus Seneca",
              "description": "Römischer Philosoph und Staatsmann",
              "url": `${baseUrl}/authors/seneca`
            },
            {
              "@type": "Thing",
              "name": "Stoic Philosophy",
              "description": "Philosophische Schule der Antike"
            }
          ]
        }}
        canonical={`${baseUrl}/authors/seneca`}
      />
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
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('works')}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {authorWorks.map((work, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:bg-card">
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {getTranslatedWork(work, language).title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {getTranslatedWork(work, language).date}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/works/${work.slug}`}>
                                <ArrowRight className="h-4 w-4" />
                                {t('readMore')}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Philosophy Section */}
              {details.philosophy && (
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <Brain className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('seneca.philosophy')}</h2>
                  </div>
                  <div className="space-y-6">
                    {details.philosophy.map((concept, index) => (
                      <div key={index} className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{concept.title}</h3>
                        <p className="text-muted-foreground mb-4">{concept.description}</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {concept.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                                {pointIndex + 1}
                              </div>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Shortness of Life Section */}
              {details.shortness && (
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('seneca.works.shortness.title')}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {details.shortness.map((work, index) => (
                      <div key={index} className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{work.title}</h3>
                        <p className="text-muted-foreground mb-4">{work.subtitle}</p>
                        <p className="text-muted-foreground mb-4">{work.description}</p>
                        <p className="text-sm text-muted-foreground mb-4">{work.date}</p>
                        <p className="text-sm text-muted-foreground mb-4">{work.note}</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {work.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                                {pointIndex + 1}
                              </div>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Legacy Section */}
              {details.legacy && (
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <Crown className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('seneca.legacy')}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {details.legacy.map((item, index) => (
                      <div key={index} className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground mb-4">{item.description}</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {item.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-primary/50 flex-shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Posts */}
              {authorPosts.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <BookMarked className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('recentPosts')}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {authorPosts.map((post) => (
                      <div key={post.slug} className="group">
                        <Link to={`/posts/${post.author}/${post.slug}`} className="block">
                          <div className="p-6 rounded-lg border border-border/50 bg-card/50 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:bg-card">
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {post.excerpt}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                <ArrowRight className="h-4 w-4" />
                                {t('readMore')}
                              </Button>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Quick Actions */}
                <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('quickActions')}</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/chat">
                        <Users className="h-4 w-4" />
                        {t('chatWithSeneca')}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/simulation">
                        <Landmark className="h-4 w-4" />
                        {t('timeTravel')}
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Author Navigation */}
                <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('otherAuthors')}</h3>
                  <div className="space-y-2">
                    {['caesar', 'cicero', 'augustus', 'catilina'].map((author) => (
                      <Button
                        key={author}
                        variant={authorId === author ? "default" : "outline"}
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to={`/about/${author}`}>
                          {t(author)}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
                <div className="flex justify-center gap-4">
                  <Link
                    to="/timeline"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    {t('seneca.biography.fullTimeline')}
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
