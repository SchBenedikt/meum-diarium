import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';
import { AuthorAboutHero } from '@/components/layout/AuthorAboutHero';
import { Button } from '@/components/ui/button';
import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePosts } from '@/hooks/use-posts';
import { Author, BlogPost, Work } from '@/types/blog';
import { PageContent } from '@/types/page';
import { ArrowRight, BookOpen, Brain, Scale, Scroll, Sparkles, Calendar, Clock, Landmark, Award, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import { motion } from 'framer-motion';

import sokratesPageData from '@/content/pages/author-about-sokrates.json';
import { works as baseWorks } from '@/data/works';
import { getTranslatedWork } from '@/lib/translator';
import { useAuthorDetails } from './useAuthorDetails';

export function SokratesAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);
  const authorDetails = useAuthorDetails(t);
  const baseUrl = 'https://meum-diarium.xn--schchner-2za.de';

  useEffect(() => {
    setCurrentAuthor('sokrates' as Author);
    setAuthorPage(sokratesPageData as PageContent);

    if (!postsLoading && allPosts.length > 0) {
      setAuthorPosts(
        allPosts
          .filter((post) => post.author === 'sokrates')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
      );
    }

    (async () => {
      const translatedWorks = await Promise.all(
        Object.values(baseWorks)
          .filter((work) => work.author === 'sokrates')
          .map((work) => getTranslatedWork(language as any, slugify(work.title, { lower: true, strict: true })))
      );
      setAuthorWorks(translatedWorks.filter((work): work is Work => work !== null));
    })();
  }, [setCurrentAuthor, allPosts, postsLoading, language]);

  if (!authorInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Lade Inhalte...
      </div>
    );
  }

  const snapshots = [
    { label: 'Lebenszeit', value: '~470–399 v. Chr.', hint: 'Klassisches Athen' },
    { label: 'Methode', value: 'Dialektik & Maieutik', hint: 'Fragend-entwickelndes Gespräch' },
    { label: 'Leitgedanke', value: '„Ich weiß, dass ich nichts weiß"', hint: 'Sokratisches Nichtwissen' },
    { label: 'Orakel', value: 'Delphi', hint: 'Von Apollon als „weise" bezeichnet' },
    { label: 'Prozess', value: '399 v. Chr.', hint: 'Anklage: Gottlosigkeit, Jugendverführung' },
    { label: 'Tod', value: 'Schierlingsbecher', hint: 'Überliefert bei Platon (Phaidon)' },
  ];

  const sokratesMasterworks = [
    {
      title: 'Dialektik und Maieutik',
      summary: 'Die Methode des fragend-entwickelnden Gespräches – nicht Belehrung, sondern Einsicht durch Dialog. Der Gesprächspartner wird zur Wahrheit hingeleitet.',
      tag: 'Erkenntnismethode',
      icon: 'Brain' as const,
    },
    {
      title: 'Sokratisches Nichtwissen',
      summary: 'Der berühmte Ausspruch „Ich weiß, dass ich nichts weiß" ist nicht Bescheidenheit, sondern die Einsicht, dass echtes Wissen über Tugend und Gutes schwer fassbar ist.',
      tag: 'Philosophie',
      icon: 'Sparkles' as const,
    },
    {
      title: 'Die Aporie',
      summary: 'Viele sokratische Dialoge enden in Ratlosigkeit (Aporie). Dies ist kein Scheitern, sondern der Beginn echten Denkens – Befreiung von Scheinwissen.',
      tag: 'Logik',
      icon: 'Zap' as const,
    },
    {
      title: 'Tugend als Wissen',
      summary: 'Tugend ist das höchste Gut und kann gelehrt werden – durch Erkenntnis. Niemand tut das Böse freiwillig; schlechtes Handeln ist immer Unwissenheit.',
      tag: 'Ethik',
      icon: 'Award' as const,
    },
    {
      title: 'Die Seele und der Körper',
      summary: 'Der Körper ist Gefängnis der Seele. Pflege der Seele durch Philosophie ist wichtiger als körperliche oder materielle Dinge.',
      tag: 'Metaphysik',
      icon: 'BookOpen' as const,
    },
    {
      title: 'Standhaftigkeit bis zum Ende',
      summary: 'Sokrates akzeptiert sein Todesurteil, weigert sich zu fliehen und stirbt im Dienst der Philosophie – Vorbild philosophischer Integrität.',
      tag: 'Charakter',
      icon: 'Clock' as const,
    },
  ];

  const sokratesControversies = [
    {
      heading: 'Warum er bewundert wird',
      points: [
        'Gründer der abendländischen Philosophie – machte Ethik zur zentralen philosophischen Frage.',
        'Die Maieutik als Methode: Durch Fragen zur Erkenntnis führen statt Wissen zu verteilen.',
        'Philosophisch integrer Mensch – lebte, wie er lehrte, und starb für seine Überzeugungen.',
        'Sein Leben und Werk – überliefert durch Schüler wie Platon und Xenophon – werden zeitlos.',
      ],
    },
    {
      heading: 'Warum er kritisiert wird',
      points: [
        'Verurteilung zum Tode – war seine Methode wirklich nur unschuldig philosophisch, oder provozierte er gezielt?',
        'Hielt Sklaven und war ein Mann seiner Zeit – progressive Philosophie, aber konservative Gesellschaftshaltung.',
        'Keine schriftlichen Werke – alles ist indirekt überliefert; Platons Sokrates ist literarische Interpretation.',
        'Elitär – Philosophie als Privileg der freien Männer, nicht für Frauen, Sklaven oder Handwerker.',
      ],
    },
  ];

  const sokratesSidebar = {
    dialogeUndQuellenUebersicht: [
      { year: -430, title: 'Orakelspruch von Delphi', note: 'Der Beginn der sokratischen Mission' },
      { year: -420, title: 'Öffentliche Dialoge', note: 'Tägliche philosophische Gespräche auf Athener Agora' },
      { year: -405, title: 'Sophisten und Sokrates', note: 'Auseinandersetzung mit Protagoras und anderen' },
      { year: -399, title: 'Prozess und Anklage', note: 'Apologie – Sokrates\' Selbstverteidigung' },
      { year: -399, title: 'Kriton', note: 'Dialog über Gerechtigkeit und Fluchtmöglichkeit' },
    ],
    platonischePhaidon: [
      { year: -399, title: 'Der Phaidon', note: 'Sokrates\' letzte Stunden – sein stärkstes Werk' },
      { year: -399, title: 'Argumente für Unsterblichkeit', note: 'Vier philosophische Beweise der Seele' },
      { year: -399, title: 'Der Schierlingsbecher', note: 'Beschreibung des Sterbens mit philosophischer Ruhe' },
      { year: -399, title: 'Frage nach dem Jenseits', note: 'Der Übergang von Leben zu Tod als Frage' },
      { year: -399, title: 'Letzter Satz', note: 'Wir schulden dem Asklepios einen Hahn' },
    ],
    jaengerUndWirkung: [
      { year: -427, title: 'Platon', note: 'Sein größter Schüler, bewahrte sein Erbe' },
      { year: -430, title: 'Xenophon', note: 'Militär und Schriftsteller, dokumentierte Sokrates' },
      { year: -456, title: 'Aristophanes', note: 'Spottet über Sokrates in „Die Wolken"' },
      { year: -379, title: 'Aristoteles schreibt über Sokrates', note: 'Indirekte Wirkung auf nächste Generation' },
      { year: 0, title: 'Weiterwirkung', note: 'Auf Stoiker, Christen, Aufklärung bis heute' },
    ],
  };

  const formatYear = (year: number) => (year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <SEO
        title={authorInfo ? `${authorInfo.name} – Sokrates` : 'Sokrates'}
        description={authorInfo?.description || sokratesPageData.introText}
        author={authorInfo?.name}
        image={`${baseUrl}/images/sokrates-hero.png`}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Meum Diarium",
          "url": `${baseUrl}/sokrates/about`,
          "description": authorInfo?.description,
        }}
      />
      <main className="flex-1">
        <AuthorAboutHero
          authorInfo={authorInfo}
          authorPage={authorPage}
          language={language}
          birthPlace={authorDetails?.sokrates?.birthPlace || 'Alopeke bei Athen'}
        />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="grid gap-20 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-24">
              {authorWorks.length > 0 && (
                <section>
                  <div className="flex items-center gap-6 mb-12">
                    <h2 className="font-display text-4xl font-bold">Werke & Quellen</h2>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {authorWorks.map((work, i) => (
                      <Link
                        key={i}
                        to={`/sokrates/works/${slugify(work.title, { lower: true, strict: true })}`}
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
                      <Link to="/sokrates">
                        {t('viewAllEntries')} <ArrowRight className="h-4 w-4 ml-2" />
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
                              Weiterlesen <ArrowRight className="h-3 w-3" />
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
                    {snapshots.map((item) => (
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

        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-display text-4xl font-bold">Lebenslauf & Stationen</h2>
                  <p className="text-lg text-muted-foreground mt-2">Dialoge, Quellen und philosophisches Erbe</p>
                </div>
              </div>
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Scroll className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Dialoge & Quellen</h3>
                  </div>
                  <div className="space-y-4">
                    {sokratesSidebar.dialogeUndQuellenUebersicht.map((item) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Der Phaidon</h3>
                  </div>
                  <div className="space-y-4">
                    {sokratesSidebar.platonischePhaidon.map((item) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Jünger & Wirkung</h3>
                  </div>
                  <div className="space-y-4">
                    {sokratesSidebar.jaengerUndWirkung.map((item) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-border/40">
                <p className="text-center text-muted-foreground mb-8">Für eine detaillierte Chronologie aller Ereignisse:</p>
                <div className="flex justify-center gap-4">
                  <Link
                    to="/timeline"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
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
              <h2 className="font-display text-4xl font-bold mb-4">Warum er polarisierte</h2>
              <p className="text-lg text-muted-foreground">Zwischen philosophischer Weisheit und gefährlicher Neuerung.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {sokratesControversies.map((block) => (
                <div key={block.heading} className="card-modern card-hover-primary card-padding-lg">
                  <h3 className="font-display text-xl font-bold mb-4">{block.heading}</h3>
                  <div className="space-y-3">
                    {block.points.map((point, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed">
                        <span className="inline-block h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Meisterleistungen</h2>
              <p className="text-lg text-muted-foreground">Methode, Ethik und philosophische Haltung.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {sokratesMasterworks.map((achievement) => {
                const iconMap: Record<string, any> = {
                  'Brain': Brain,
                  'Sparkles': Sparkles,
                  'Zap': Zap,
                  'Award': Award,
                  'BookOpen': BookOpen,
                  'Clock': Clock,
                };
                const IconComponent = iconMap[achievement.icon];
                return (
                  <div key={achievement.title} className="card-modern card-hover-primary card-padding-lg">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{achievement.tag}</span>
                      <IconComponent className="h-6 w-6 text-primary opacity-60" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{achievement.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{achievement.summary}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">Vertiefe dein Wissen im Lexikon:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/lexicon/maieutik" className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20">Maieutik</Link>
                <Link to="/lexicon/aporie" className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20">Aporie</Link>
                <Link to="/lexicon/dialektik" className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20">Dialektik</Link>
                <Link to="/lexicon/elenchos" className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20">Elenchos</Link>
                <Link to="/lexicon/daimonion" className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20">Daimonion</Link>
                <Link to="/lexicon/sokratische-ironie" className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20">Sokratische Ironie</Link>
                <Link to="/lexicon/hebammenkunst" className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20">Hebammenkunst</Link>
                <Link to="/lexicon/vorsokratiker" className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20">Vorsokratiker</Link>
                <Link to="/lexicon/anamnesis" className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20">Anamnesis</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-4">Sokrates' Weg zur Philosophie</h2>
              <p className="text-lg text-muted-foreground">Von Athen zur Unsterblichkeit im Gedanken.</p>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Die frühen Jahre (~470–430 v. Chr.)</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl hover:border-primary/30 transition-all group h-full"
                  >
                    <div className="absolute top-4 right-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">~470 v. Chr.</span>
                    <h3 className="font-display text-2xl font-bold mb-3">Geburt in Alopeke</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Aufwachsen in einfachen Verhältnissen als Sohn eines Bildhauers. Trotz Armut von philosophischem Geist erfüllt.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl hover:border-primary/30 transition-all group"
                  >
                    <div className="absolute top-4 right-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">~430 v. Chr.</span>
                    <h3 className="font-display text-2xl font-bold mb-3">Orakelspruch von Delphi</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Apollon erklärt Sokrates für den weisesten Menschen – Wendepunkt. Sokrates versteht dies als Auftrag, die Menschen ihrer Unwissenheit zu überführen.</p>
                  </motion.div>
                </div>
              </div>

              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Die öffentliche Mission (420–399 v. Chr.)</span>
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
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-3">Tägliche Praxis auf der Agora</span>
                        <h3 className="font-display text-3xl font-bold mb-2">Dialektik in Aktion</h3>
                        <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Tausende von Gesprächen</p>
                      </div>
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <p className="text-base text-foreground/90 leading-relaxed mb-4">Sokrates durchstreift täglich Athen, engagiert sich in Gesprächen mit jungen Männern, Sophisten und Politikern. Seine Methode: Fragen stellen, bis zur Erkenntnis der eigenen Unwissenheit führen.</p>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 text-xs text-primary/80">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="font-semibold">Das Herz seiner Philosophie</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Der Prozess und die Unsterblichkeit (399 v. Chr.)</span>
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
                      <Scale className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">399 v. Chr.</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">Gerichtsprozess</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Anklage: Gottlosigkeit und Verführung der Jugend. Sokrates weigert sich, Kompromisse zu machen, um sein Leben zu retten.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Scroll className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">399 v. Chr.</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">Die Apologie</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Platons Darstellung von Sokrates\' Selbstverteidigung – kein Schuldeingeständnis, sondern Bekräftigung seiner Mission.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">399 v. Chr.</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">Der Phaidon</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Sokrates\' letzte Stunden, philosophierend mit seinen Schülern über die Unsterblichkeit der Seele – Das Meisterwerk Platons.</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Legendäre Zitate</h2>
              <p className="text-lg text-muted-foreground">Worte, die zwei Jahrtausende überdauerten.</p>
            </div>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              {[{
                quote: 'Ich weiß, dass ich nichts weiß.',
                translation: 'Scio me nihil scire.',
                when: '~420 v. Chr., Kernaussage',
                meaning: 'Die Grundlage sokratischen Denkens – echte Weisheit liegt in der Anerkennung der Grenzen unseres Wissens.'
              }, {
                quote: 'Es ist besser, Unrecht zu erleiden als es zu tun.',
                translation: 'Melon adikeisthai e adikein.',
                when: 'Kriton, Gorgias',
                meaning: 'Fundamentales Prinzip der sokratischen Ethik – Tugend ist wichtiger als Sicherheit oder Erfolg.'
              }, {
                quote: 'Die ungeprüfte Leben ist nicht wert, gelebt zu werden.',
                translation: 'Ho anexetastos bios ou bios anthrōpō.',
                when: 'Apologie 38a',
                meaning: 'Rechtfertigung des Philosophierens – Leben ist Reflexion über sich selbst und seine Ziele.'
              }].map((item) => (
                <div key={item.quote} className="card-modern card-hover-primary card-padding-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <Sparkles className="h-3.5 w-3.5" /> Impact
                    </span>
                    <span className="text-xs font-semibold text-primary/70">{item.when}</span>
                  </div>
                  <p className="text-lg font-display italic text-foreground/90 mb-1">{item.quote}</p>
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
