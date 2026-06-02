import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, MapPin, BookOpen, Award, ArrowLeft, Users, Scroll, Clock, ArrowRight, Sword, Flame, AlertTriangle, Crown, Landmark, Sparkles, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      setAuthorPage(catilinaPageData as PageContent);

      if (!postsLoading && allPosts.length > 0) {
        const authorPostsList = allPosts.filter(p => p.author === 'catilina');
        setAuthorPosts(authorPostsList);
      }

      const translatedWorks = await Promise.all(
        Object.values(baseWorks).filter(w => w.author === 'catilina').map(w => getTranslatedWork(language as any, slugify(w.title, { lower: true, strict: true })))
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
    { label: 'Lebenszeit', value: '108–62 ' + t('common.bc'), hint: '~46 ' + t('common.years') },
    { label: 'Verschwörung', value: '63 ' + t('common.bc'), hint: 'Catilinarische Verschwörung' },
    { label: 'Konsulatsbewerbungen', value: '2x', hint: '64 & 63 ' + t('common.bc') },
    { label: 'Anhänger', value: '~3000', hint: 'Verschuldete & Veteranen' },
    { label: 'Ciceros Reden', value: '4', hint: 'In Catilinam I-IV' },
    { label: 'Tod in Schlacht', value: 'Pistoria', hint: '62 ' + t('common.bc') },
  ];

  const catilinaTimeline = {
    events: [
      { year: -108, title: 'Geburt in Rom', note: 'Aus patrizischem Geschlecht der Sergii' },
      { year: -68, title: 'Prätor', note: 'Bekleidung der zweithöchsten Magistratur' },
      { year: -67, title: 'Statthalter Africa', note: 'Korruption und Erpressung' },
      { year: -66, title: 'Erste Verschwörung?', note: 'Angeblicher Putschversuch (umstritten)' },
      { year: -64, title: '1. Konsulatsbewerbung', note: 'Scheitert wegen Anklage' },
      { year: -63, title: '2. Konsulatsbewerbung', note: 'Unterliegt Cicero' },
      { year: -63, title: 'Catilinarische Verschwörung', note: 'Plan zur Machtübernahme' },
      { year: -63, title: 'Ciceros Reden', note: 'Aufdeckung der Verschwörung' },
      { year: -62, title: 'Schlacht bei Pistoria', note: 'Tod in der Schlacht' },
    ],
    offices: [
      { year: -77, title: 'Militärdienst unter Sulla', note: 'Proskriptionen und Bürgerkrieg' },
      { year: -68, title: 'Prätor', note: 'Zweithöchstes Staatsamt' },
      { year: -67, title: 'Propraetor Africa', note: 'Statthalterschaft mit Korruptionsvorwürfen' },
    ],
    conspiracy: [
      { year: -64, title: 'Erste Pläne', note: 'Sammlung von Anhängern' },
      { year: -63, title: 'Konkrete Planung', note: 'Rekrutierung und Finanzierung' },
      { year: -63, title: 'Aufdeckung', note: 'Ciceros Geheimdienstinformationen' },
      { year: -62, title: 'Finale', note: 'Militärische Niederlage' },
    ],
  };

  const catilinaLegacy = [
    {
      title: 'Symbol der Verschwörung',
      summary: 'Catilinas Name wurde zum Inbegriff für Staatsfeinde und Verschwörer. Seine Verschwörung gilt als Paradebeispiel für die Krisen der späten Republik.',
      tag: 'Geschichte',
      horizon: 'Langfristig',
    },
    {
      title: 'Ciceros größter Triumph',
      summary: 'Die Aufdeckung der catilinarischen Verschwörung war Ciceros größter politischer Erfolg. Die vier Reden "In Catilinam" gehören zu den berühmtesten Texten der lateinischen Literatur.',
      tag: 'Rhetorik',
      horizon: 'Langfristig',
    },
    {
      title: 'Krisenindikator',
      summary: 'Die Verschwörung offenbarte die tiefen sozialen und wirtschaftlichen Spannungen der späten Republik: Verschuldung, Veteranenprobleme, politische Polarisierung.',
      tag: 'Sozialgeschichte',
      horizon: 'Strukturell',
    },
    {
      title: 'Quellenkritische Herausforderung',
      summary: 'Alle Quellen über Catilina stammen von seinen Feinden. War er ein skrupelloser Verbrecher oder ein Reformer, der von der Oligarchie dämonisiert wurde?',
      tag: 'Forschung',
      horizon: 'Bis heute',
    },
  ];

  const conspiracyPhases = [
    {
      title: 'Erste Verschwörung (64 ' + t('common.bc') + ')',
      detail: 'Angeblicher Plan, die gewählten Konsuln zu ermorden und selbst die Macht zu übernehmen. Historisch umstritten.',
      impact: 'Möglicherweise Propaganda seiner Gegner',
      icon: AlertTriangle,
    },
    {
      title: 'Hauptverschwörung (63 ' + t('common.bc') + ')',
      detail: 'Nach erneuter Niederlage bei den Konsulwahlen plant Catilina einen Umsturz: Mord an Cicero, Brandstiftung in Rom, Bürgerkrieg.',
      impact: 'Reale Bedrohung für die Republik',
      icon: Flame,
    },
    {
      title: 'Aufdeckung (Nov. 63 ' + t('common.bc') + ')',
      detail: 'Ciceros Informanten enthüllen die Pläne. Die berühmte Senatssitzung, in der Cicero Catilina direkt anklagt: "Quo usque tandem...?"',
      impact: 'Wendepunkt der Krise',
      icon: Scroll,
    },
  ];

  const catilinaReformDeep = [
    {
      title: 'Soziale Basis',
      detail: 'Catilinas Anhänger: verschuldete Adlige, enttäuschte Veteranen Sullas, verarmte Bauern. Ein breites Bündnis der Unzufriedenen.',
      impact: 'Zeigt die sozialen Spannungen der späten Republik',
    },
    {
      title: 'Politische Ziele',
      detail: 'Schuldenerlass, Landverteilung, Machtbeteiligung. Viele Forderungen waren ähnlich wie bei späteren Popularen.',
      impact: 'Reform oder Revolution? Die Grenze war fließend',
    },
    {
      title: 'Ciceros Gegenoffensive',
      detail: 'Senatus consultum ultimum, Notstandsgesetze, Hinrichtung ohne Gerichtsverfahren. Cicero überschritt verfassungsrechtliche Grenzen.',
      impact: 'Präzedenzfall für spätere Ausnahmezustände',
    },
  ];

  const ciceroSpeeches = [
    {
      title: 'In Catilinam I',
      date: '8. November 63 ' + t('common.bc'),
      summary: 'Die berühmte Eröffnung: "Quo usque tandem abutere, Catilina, patientia nostra?" Cicero klagt Catilina im Senat direkt an.',
      impact: 'Rhetorisches Meisterwerk',
      quote: 'Quo usque tandem...?',
    },
    {
      title: 'In Catilinam II',
      date: '9. November 63 ' + t('common.bc'),
      summary: 'Vor dem Volk: Cicero erklärt Catilinas Flucht aus Rom und warnt vor seinen Anhängern in der Stadt.',
      impact: 'Mobilisierung der öffentlichen Meinung',
      quote: 'O tempora, o mores!',
    },
    {
      title: 'In Catilinam III',
      date: '3. Dezember 63 ' + t('common.bc'),
      summary: 'Präsentation der Beweise: Briefe der Verschwörer, Geständnisse. Die Verschwörung ist unwiderlegbar aufgedeckt.',
      impact: 'Sicherung der Beweislage',
      quote: 'Abii, excessit, evasit, erupit!',
    },
    {
      title: 'In Catilinam IV',
      date: '5. Dezember 63 ' + t('common.bc'),
      summary: 'Senatsrede über die Bestrafung der gefangenen Verschwörer. Caesar plädiert für lebenslange Haft, Cato für Hinrichtung.',
      impact: 'Hinrichtung ohne Gerichtsverfahren',
      quote: 'Cedant arma togae!',
    },
  ];

  const catilinaDebate = [
    {
      heading: 'Als Staatsfeind gesehen',
      points: [
        'Plan zur Ermordung des Konsuls Cicero',
        'Brandstiftung in Rom geplant',
        'Bündnis mit Galliern gegen Rom',
        'Bewaffneter Aufstand gegen die Republik',
      ],
    },
    {
      heading: 'Als Reformer gedeutet',
      points: [
        'Vertrat Interessen der Verschuldeten',
        'Wollte Veteranen Land verschaffen',
        'Kritisierte Oligarchie des Senats',
        'Von Cicero dämonisiert und verleumdet?',
      ],
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
                      <p className="text-sm text-muted-foreground mt-1">Werke über Catilina</p>
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {authorWorks.map((work, i) => (
                      <Link
                        key={i}
                        to={`/catilina/works/${slugify(work.title, { lower: true, strict: true })}`}
                        className="card-modern card-hover-primary card-padding-lg group relative overflow-hidden block"
                      >
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                              <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {work.year}
                              </p>
                            </div>
                          </div>
                          <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {work.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-4 mb-4 leading-relaxed">
                            {work.summary}
                          </p>
                          <div className="flex items-center text-sm font-semibold text-primary gap-2">
                            <span>Zum Werk</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                        <p className="text-sm text-muted-foreground mt-1">Aktuelle Einträge</p>
                      </div>
                    </div>
                    <Button asChild variant="secondary" className="text-xs uppercase tracking-widest font-bold">
                      <Link to="/catilina">
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

            {/* Sidebar */}
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

        {/* Timeline Section - Full Width */}
        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-display text-4xl font-bold">Lebenslauf & Verschwörung</h2>
                  <p className="text-lg text-muted-foreground mt-2">Von patrizischer Herkunft zum Staatsfeind</p>
                </div>
              </div>
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Lebensstationen */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Lebensstationen</h3>
                  </div>
                  <div className="space-y-4">
                    {catilinaTimeline.events.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ämter */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Ämter & Karriere</h3>
                  </div>
                  <div className="space-y-4">
                    {catilinaTimeline.offices.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verschwörung */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Verschwörung</h3>
                  </div>
                  <div className="space-y-4">
                    {catilinaTimeline.conspiracy.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline Link */}
              <div className="mt-16 pt-12 border-t border-border/40">
                <p className="text-center text-muted-foreground mb-8">
                  Für eine detaillierte Chronologie aller Ereignisse:
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    to="/timeline"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    Zur vollständigen Zeitleiste
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Die Verschwörung in Phasen */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Die Verschwörung in Phasen</h2>
              <p className="text-lg text-muted-foreground">Vom Plan zur Niederlage</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
              {conspiracyPhases.map((phase) => {
                const Icon = phase.icon;
                return (
                  <div
                    key={phase.title}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-3">{phase.title}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed mb-3">{phase.detail}</p>
                    <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Bedeutung:</span> {phase.impact}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Soziale & Politische Dimensionen */}
        <section className="py-20 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Soziale & politische Dimensionen</h2>
              <p className="text-lg text-muted-foreground">Mehr als eine Verschwörung</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
              {catilinaReformDeep.map((item) => (
                <div
                  key={item.title}
                  className="card-modern card-hover-primary card-padding-md"
                >
                  <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">{item.detail}</p>
                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Bedeutung:</span> {item.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ciceros Reden */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Ciceros Reden gegen Catilina</h2>
              <p className="text-lg text-muted-foreground">Rhetorik als Waffe</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
              {ciceroSpeeches.map((speech) => (
                <div
                  key={speech.title}
                  className="card-modern card-hover-primary card-padding-lg"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Rede</span>
                    <span className="text-xs font-semibold text-primary/70">{speech.date}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{speech.title}</h3>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">{speech.summary}</p>
                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 mb-3">
                    <p className="text-sm font-display italic text-foreground/90">"{speech.quote}"</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">Wirkung:</span> {speech.impact}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                to="/cicero/works/in-catilinam"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Alle Reden lesen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Historisches Vermächtnis */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Historisches Vermächtnis</h2>
              <p className="text-lg text-muted-foreground">Wie Catilina die Geschichte prägte</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
              {catilinaLegacy.map((legacy) => (
                <div
                  key={legacy.title}
                  className="card-modern card-hover-primary card-padding-lg"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{legacy.tag}</span>
                    <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                      {legacy.horizon}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{legacy.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{legacy.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Warum er polarisierte */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Warum er polarisierte</h2>
              <p className="text-lg text-muted-foreground">Zwei Gesichter der Geschichte</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {catilinaDebate.map((block) => (
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

        {/* Legendäre Zitate */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Legendäre Zitate</h2>
              <p className="text-lg text-muted-foreground">Worte, die Geschichte schrieben</p>
            </div>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: 'Quo usque tandem abutere, Catilina, patientia nostra?',
                  translation: 'Wie lange noch, Catilina, wirst du unsere Geduld missbrauchen?',
                  when: 'Cicero, 1. Rede',
                  meaning: 'Die berühmteste Eröffnung der lateinischen Literatur'
                },
                {
                  quote: 'O tempora, o mores!',
                  translation: 'O Zeiten, o Sitten!',
                  when: 'Cicero, 1. Rede',
                  meaning: 'Klage über den moralischen Verfall Roms'
                },
                {
                  quote: 'Abii, excessit, evasit, erupit!',
                  translation: 'Er ist gegangen, entkommen, entflohen, ausgebrochen!',
                  when: 'Cicero, 2. Rede',
                  meaning: 'Triumphierende Verkündung von Catilinas Flucht'
                }
              ].map((item) => (
                <div
                  key={item.quote}
                  className="card-modern card-hover-primary card-padding-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <Sparkles className="h-3.5 w-3.5" /> Zitat
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
