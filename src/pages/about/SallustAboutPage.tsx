import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, BookOpen, Award, Users, Scroll, Clock, ArrowRight, Landmark, Sparkles, Shield, Feather, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { works as baseWorks } from '@/data/works';
import slugify from 'slugify';
import { useEffect, useState } from 'react';
import { Author, BlogPost, Work } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedWork } from '@/lib/translator';
import { usePosts } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { PageContent } from '@/types/page';
import { useAuthorDetails } from './useAuthorDetails';
import { AuthorAboutHero } from '@/components/layout/AuthorAboutHero';
import sallustPageData from '@/content/pages/author-about-sallust.json';

export function SallustAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);
  const authorDetails = useAuthorDetails(t);

  useEffect(() => {
    setCurrentAuthor('sallust' as Author);

    async function translateContent() {
      setAuthorPage(sallustPageData as PageContent);

      if (!postsLoading && allPosts.length > 0) {
        const authorPostsList = allPosts.filter(p => p.author === 'sallust');
        setAuthorPosts(authorPostsList);
      }

      const translatedWorks = await Promise.all(
        Object.values(baseWorks).filter(w => w.author === 'sallust').map(w => getTranslatedWork(language as any, slugify(w.title, { lower: true, strict: true })))
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

  const details = authorDetails.sallust || {
    birthPlace: 'Amiternum',
    deathPlace: 'Rom',
    occupation: 'Geschichtsschreiber, Politiker',
    era: 'Späte Republik',
  };

  const sallustSnapshots = [
    { label: 'Lebenszeit', value: '86–35 v. Chr.', hint: '~51 Jahre' },
    { label: 'Hauptwerke', value: '2 Monographien', hint: 'Catilina & Jugurtha' },
    { label: 'Quästur', value: '55 v. Chr.', hint: 'Erste Magistratur' },
    { label: 'Volkstribun', value: '52 v. Chr.', hint: 'Politische Karriere' },
    { label: 'Statthalter Africa', value: '46–45 v. Chr.', hint: 'Unter Caesar' },
    { label: 'Literarischer Stil', value: 'Brevitas', hint: 'Knappe, prägnante Prosa' },
  ];

  const sallustTimeline = {
    events: [
      { year: -86, title: 'Geburt in Amiternum', note: 'Aus plebejischem Geschlecht der Sabiner' },
      { year: -55, title: 'Quästur', note: 'Beginn der politischen Laufbahn' },
      { year: -52, title: 'Volkstribun', note: 'Kämpft für populare Positionen' },
      { year: -50, title: 'Ausschluss aus dem Senat', note: 'Wegen angeblicher Unmoral' },
      { year: -49, title: 'Bürgerkrieg', note: 'Unterstützt Caesar gegen Pompeius' },
      { year: -47, title: 'Prätor', note: 'Wiederaufnahme in den Senat durch Caesar' },
      { year: -46, title: 'Statthalter Africa Nova', note: 'Bereichert sich massiv' },
      { year: -44, title: 'Caesars Ermordung', note: 'Rückzug aus der Politik' },
      { year: -43, title: 'Bellum Catilinae', note: 'Erste Monographie' },
      { year: -41, title: 'Bellum Jugurthinum', note: 'Zweite Monographie' },
      { year: -35, title: 'Tod in Rom', note: 'In seinen berühmten Gärten' },
    ],
    works: [
      { year: -43, title: 'De Catilinae Coniuratione', note: 'Monographie über die catilinarische Verschwörung' },
      { year: -41, title: 'Bellum Jugurthinum', note: 'Monographie über den Krieg gegen Jugurtha' },
      { year: -39, title: 'Historiae (Fragment)', note: 'Große Geschichtswerk über die Jahre 78–67 v. Chr.' },
    ],
    legacy: [
      { year: 35, title: 'Einfluss auf Tacitus', note: 'Stilistische Prägung der römischen Historiographie' },
      { year: 400, title: 'Kirchenväter', note: 'Augustinus schätzt Sallusts moralische Kritik' },
      { year: 1500, title: 'Renaissance', note: 'Humanisten entdecken Sallust neu' },
      { year: 1900, title: 'Moderne Forschung', note: 'Sallusts politische Parteilichkeit wird erkannt' },
    ],
  };

  const sallustAchievements = [
    {
      title: 'Meister der historischen Monographie',
      summary: 'Sallust entwickelte die römische Monographie als historiographisches Genre. Statt breiter Universalgeschichte konzentrierte er sich auf einzelne Ereignisse und analysierte sie in moralisch-politischer Tiefe.',
      tag: 'Literatur',
      horizon: 'Langfristig',
    },
    {
      title: 'Moralischer Kulturkritiker',
      summary: 'Sallusts Geschichtsschreibung ist durchdrungen von Kritik am moralischen Verfall Roms. Luxuria, avaritia, ambitio – Luxus, Habgier, Ehrgeiz – sind für ihn die Grundübel der späten Republik.',
      tag: 'Philosophie',
      horizon: 'Zeitlos',
    },
    {
      title: 'Stilistische Innovation',
      summary: 'Brevitas, inconcinnitas, archaismus – Sallust brach mit Ciceros klassischer Prosa. Sein knapper, unrunder, altertümlicher Stil beeinflusste Tacitus und die spätere römische Historiographie.',
      tag: 'Sprache',
      horizon: 'Prägend',
    },
    {
      title: 'Politische Parteilichkeit',
      summary: 'Sallust war kein objektiver Chronist. Als Parteigänger Caesars und Kritiker der Nobilität nutzte er Geschichte als politisches Instrument. Diese Perspektivität macht ihn besonders interessant.',
      tag: 'Politik',
      horizon: 'Methodisch',
    },
  ];

  const sallustStyle = [
    {
      title: 'Brevitas',
      detail: 'Knappe, konzentrierte Sprache – Sallust sagt in wenigen Worten viel. Keine ciceronische Ausschmückung.',
      impact: 'Prägnant und einprägsam',
      icon: Feather,
      latinExample: '„Omnia orta occidunt et aucta senescunt." (Catilina 2,3)',
      translation: '„Alles, was entstanden ist, geht zugrunde, und alles, was gewachsen ist, altert."',
    },
    {
      title: 'Inconcinnitas',
      detail: 'Asymmetrische Satzstrukturen – bewusster Bruch mit Ciceros ausgewogener Rhetorik.',
      impact: 'Dramatisch und lebendig',
      icon: TrendingDown,
      latinExample: '„Igitur domi militiaeque boni mores colebantur…" (Catilina 9,1)',
      translation: '„So wurden zuhause wie im Krieg gute Sitten gepflegt…"',
    },
    {
      title: 'Archaismus',
      detail: 'Altertümliche Wörter und Konstruktionen – bewusster Anklang an Cato den Älteren.',
      impact: 'Würdevoll und autoritativ',
      icon: Scroll,
      latinExample: '„lubido" statt „libido", „vortat" statt „vertat"',
      translation: 'Altertümliche Schreibweisen evozieren das Rom der Väter',
    },
    {
      title: 'Direkte Reden',
      detail: 'Fiktive direkte Reden (oratio recta) zur Charakterisierung – Catilinas Ansprache, Catos Senatsdebatte.',
      impact: 'Lebendig und charakterisierend',
      icon: Landmark,
      latinExample: '„Ite qua coepistis, dum licet." (Catilina 58)',
      translation: '„Geht, solange ihr noch könnt, den Weg, den ihr begonnen habt."',
    },
  ];

  const sallustThemes = [
    {
      title: 'Virtus vs. Fortuna',
      summary: 'Tugend gegen Schicksal – das zentrale Spannungsfeld der römischen Ethik. Sallust zeigt, wie virtus im Niedergang begriffen ist.',
      examples: ['Cato in Catilina', 'Metellus in Jugurtha', 'Marius als ambivalente Figur'],
    },
    {
      title: 'Luxuria und Avaritia',
      summary: 'Luxus und Habgier als Verfallssymptome. Nach der Zerstörung Karthagos (146 v. Chr.) verfällt Rom moralisch. Der metus hostilis – die Furcht vor dem Feind – ist verschwunden.',
      examples: ['Catilinas Verschwendungssucht', 'Senatorische Korruption', 'Jugurthas Bestechung römischer Beamter'],
    },
    {
      title: 'Ambitio',
      summary: 'Ehrgezigkeit als Triebfeder und Verhängnis. Römischer Ehrgeiz ist ambivalent: nötig für Größe, aber zerstörerisch für die Gemeinschaft.',
      examples: ['Catilinas Machtgier', 'Jugurthas Königswillen', 'Marius übertriebene Ambitionen'],
    },
  ];

  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return '—';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`;
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
                      <h2 className="font-display text-3xl font-bold">Hauptwerke</h2>
                      <p className="text-sm text-muted-foreground mt-1">Monographien und Historien</p>
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {authorWorks.map((work, i) => (
                      <Link
                        key={i}
                        to={`/sallust/works/${slugify(work.title, { lower: true, strict: true })}`}
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
                        <h2 className="font-display text-3xl font-bold">Tagebucheinträge</h2>
                        <p className="text-sm text-muted-foreground mt-1">Aktuelle Einträge</p>
                      </div>
                    </div>
                    <Button asChild variant="secondary" className="text-xs uppercase tracking-widest font-bold">
                      <Link to="/sallust">
                        Alle Einträge <ArrowRight className="h-3 w-3 ml-2" />
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
                    {sallustSnapshots.map((item) => (
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

        {/* Timeline Section */}
        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-display text-4xl font-bold">Leben & Wirken</h2>
                  <p className="text-lg text-muted-foreground mt-2">Von der Politik zur Geschichtsschreibung</p>
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
                    {sallustTimeline.events.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Werke */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Werke</h3>
                  </div>
                  <div className="space-y-4">
                    {sallustTimeline.works.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nachwirkung */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Nachwirkung</h3>
                  </div>
                  <div className="space-y-4">
                    {sallustTimeline.legacy.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{item.year > 0 ? `${item.year} n. Chr.` : 'Antike'}</div>
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

        {/* Literarischer Stil mit Textbeispielen */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Literarischer Stil</h2>
              <p className="text-lg text-muted-foreground">Sallusts einzigartige Prosa mit Textbeispielen</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
              {sallustStyle.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed mb-4">{item.detail}</p>
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 mb-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Textbeispiel:</p>
                      <p className="text-sm italic text-foreground/90 mb-1">{item.latinExample}</p>
                      <p className="text-xs text-muted-foreground">{item.translation}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Wirkung:</span> {item.impact}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Kontroverse */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Sallust &amp; die Kontroverse</h2>
              <p className="text-lg text-muted-foreground">Zwischen Moralkritik und politischer Parteinahme</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              <div className="card-modern card-padding-lg">
                <div className="flex items-center gap-3 mb-5">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  <h3 className="font-display text-xl font-bold">Sallust als Moralist</h3>
                </div>
                <div className="space-y-3">
                  {[
                    'Diagnose des moralischen Verfalls Roms nach dem Sieg über Karthago (146 v. Chr.)',
                    'Luxuria, avaritia und ambitio als Grundübel der späten Republik',
                    'Kontrast zwischen alter virtus der Vorväter und zeitgenössischem Sittenverfall',
                    'Historische Analyse als Warnung an die Gegenwart – Sallust versteht Geschichte als Lehrmeisterin',
                  ].map((point) => (
                    <div key={point} className="flex gap-2 items-start">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <p className="text-sm text-foreground/85">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-modern card-padding-lg">
                <div className="flex items-center gap-3 mb-5">
                  <Award className="h-6 w-6 text-primary flex-shrink-0" />
                  <h3 className="font-display text-xl font-bold">Sallust als Parteigänger</h3>
                </div>
                <div className="space-y-3">
                  {[
                    'Selbst aus dem Senat wegen angeblicher Unmoral ausgeschlossen – fragwürdige Glaubwürdigkeit',
                    'Enger Vertrauter Caesars; nutzte sein Amt in Africa Nova zur massiven persönlichen Bereicherung',
                    'Systematische Verharmlosung caesarischer Figuren, Überzeichnung senatorischer Schuldiger',
                    'Moderne Forschung: Sallust schreibt populare Propaganda in historiographischem Gewand',
                  ].map((point) => (
                    <div key={point} className="flex gap-2 items-start">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <p className="text-sm text-foreground/85">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Markante Zitate */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Markante Zitate</h2>
              <p className="text-lg text-muted-foreground">Sallusts einprägsamste Sätze</p>
            </div>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: '„Omnia orta occidunt et aucta senescunt."',
                  translation: '„Alles, was entstanden ist, geht zugrunde, und alles, was gewachsen ist, altert."',
                  when: 'Catilina 2,3',
                  meaning: 'Sallusts Verfallsdiagnose in einem einzigen Satz – universelle Sententia über den Lauf der Geschichte.',
                },
                {
                  quote: '„Caesar beneficiis ac munificentia magnus habebatur, integritate vitae Cato."',
                  translation: '„Caesar galt durch Wohltaten und Freigiebigkeit als groß, Cato durch die Untadeligkeit seines Lebens."',
                  when: 'Catilina 54',
                  meaning: 'Sallusts berühmteste Synkrisis: Zwei Ideale der römischen Größe in perfektem antithetischem Gleichgewicht.',
                },
                {
                  quote: '„Idem velle atque idem nolle, ea demum firma amicitia est."',
                  translation: '„Dasselbe zu wollen und dasselbe abzulehnen – das erst ist wahre Freundschaft."',
                  when: 'Catilina 20,4',
                  meaning: 'Catilinas Rede an seine Verschwörer – ironisch: die tiefste Definition von Freundschaft im Mund eines Verbrechers.',
                },
              ].map((item) => (
                <div key={item.quote} className="card-modern card-hover-primary card-padding-md">
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

        {/* Historisches Vermächtnis */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Historisches Vermächtnis</h2>
              <p className="text-lg text-muted-foreground">Sallusts Bedeutung für die Nachwelt</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
              {sallustAchievements.map((legacy) => (
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

        {/* Zentrale Themen */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Zentrale Themen</h2>
              <p className="text-lg text-muted-foreground">Sallusts Geschichtsphilosophie</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
              {sallustThemes.map((theme) => (
                <div
                  key={theme.title}
                  className="card-modern card-hover-primary card-padding-lg"
                >
                  <h3 className="font-display text-xl font-bold mb-3">{theme.title}</h3>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-4">{theme.summary}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">Beispiele:</p>
                    {theme.examples.map((example) => (
                      <div key={example} className="flex gap-2 items-start">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">{example}</p>
                      </div>
                    ))}
                  </div>
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
