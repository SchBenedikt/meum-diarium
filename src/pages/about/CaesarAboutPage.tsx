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
    { label: 'Lebenszeit', value: '100–44 v. Chr.', hint: '56 Jahre' },
    { label: 'Konsulat', value: '59 v. Chr.', hint: 'Erstes Konsulamt' },
    { label: 'Diktatur', value: '49–44 v. Chr.', hint: 'perpetuo ab 44' },
    { label: 'Gallischer Krieg', value: '8 Jahre', hint: '58–50 v. Chr.' },
    { label: 'Legionen', value: '9 Stammlegionen', hint: 'ca. 40–50k Soldaten' },
    { label: 'Feldzüge', value: '4 Großräume', hint: 'Gallien, Germania, Britannia, Hispania' },
  ];

  const caesarReforms = [
    {
      title: 'Julianischer Kalender (46 v. Chr.)',
      summary: '365 Tage plus Schaltjahr – ersetzte den ungenauen Mondkalender und prägte den heutigen Kalender.',
      tag: 'Zeit & Verwaltung',
      horizon: 'langfristig',
    },
    {
      title: 'Schuldenerlass & Zinsdeckel (49 v. Chr.)',
      summary: 'Kurzfristige Entlastung nach dem Bürgerkrieg: Deckelung von Zinsforderungen und Bewertung von Immobilien zu Vorkriegspreisen.',
      tag: 'Ökonomie',
      horizon: 'sofort',
    },
    {
      title: 'Ausweitung des Bürgerrechts',
      summary: 'Verlieh italischen und provinziellen Eliten das römische Bürgerrecht, um Loyalität zu sichern und Rom stärker zu integrieren.',
      tag: 'Staatsrecht',
      horizon: 'langfristig',
    },
    {
      title: 'Land- & Veteranengesetze',
      summary: 'Siedelte Veteranen an, entschärfte Schuldenlast und verteilte Staatsland – sozialpolitische Stabilisierung nach den Bürgerkriegen.',
      tag: 'Sozialpolitik',
      horizon: 'mittelfristig',
    },
    {
      title: 'Forum Iulium & Infrastruktur',
      summary: 'Neues Forum, Straßensanierungen und öffentliche Bauten, um Rom zu entlasten und Prestige aufzubauen.',
      tag: 'Stadtplanung',
      horizon: 'mittelfristig',
    },
    {
      title: 'Senatsreform',
      summary: 'Erweiterte den Senat auf ~900 Mitglieder, holte Provinzvertreter hinein und schwächte alte Patronatsnetzwerke.',
      tag: 'Institutionen',
      horizon: 'langfristig',
    },
  ];

  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return '—';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`;
  };

  const caesarSidebar = {
    feldzuege: [
      { year: -58, title: 'Gallischer Krieg beginnt', note: 'Helvetier, Ariovist – Sicherung Galliens' },
      { year: -55, title: 'Rheinbrücken & Britannien', note: 'Machtdemonstration, erste Landung' },
      { year: -52, title: 'Alesia', note: 'Doppelwall, Belagerungsringe gegen Vercingetorix' },
      { year: -49, title: 'Bürgerkrieg', note: 'Rubikon, Ilerda, Dyrrhachium, Pharsalos' },
      { year: -48, title: 'Alexandrinischer Krieg', note: 'Pharos-Feuer, Nil-Blockade' },
      { year: -46, title: 'Thapsus', note: 'Sieg gegen die Optimaten in Afrika' },
      { year: -45, title: 'Munda', note: 'Letzter Sieg in Hispanien' },
    ],
    aemter: [
      { year: -63, title: 'Pontifex Maximus', note: 'Religiöse Autorität als Machtbasis' },
      { year: -59, title: 'Konsul', note: 'Populare Gesetzespakete' },
      { year: -49, title: 'Diktator', note: 'Krisenvollmacht im Bürgerkrieg' },
      { year: -46, title: 'Diktator (10 Jahre)', note: 'Kalenderreform, Infrastruktur' },
      { year: -44, title: 'Diktator perpetuo', note: 'Lebenslange Vollmacht' },
    ],
    reformen: [
      { year: -46, title: 'Julianischer Kalender', note: '365 Tage + Schaltjahr, Planungssicherheit' },
      { year: -49, title: 'Schulden- und Zinsreform', note: 'Deckelung von Forderungen nach Bürgerkrieg' },
      { year: -46, title: 'Senatsreform', note: 'Erweiterung, Provinzeliten integriert' },
      { year: -45, title: 'Veteranenansiedlungen', note: 'Landvergabe, Loyalität der Legionen' },
    ],
  };

  const caesarReformDeep = [
    {
      title: 'Kalenderreform',
      detail: 'Vom Mond- zum Sonnenjahr: 365 Tage + Schaltjahr schufen Planungssicherheit für Steuer, Militär und Ernte.',
      impact: 'Legt die Basis des heutigen Kalenders und reduziert administrative Willkür.',
    },
    {
      title: 'Bürgerrecht & Elitenbindung',
      detail: 'Ausweitung des Bürgerrechts auf italische und provinzialische Eliten, um Loyalität zu sichern und Verwaltung zu professionalisieren.',
      impact: 'Schafft neue Machtbasis für Caesar und integriert Provinzen stärker in Rom.',
    },
    {
      title: 'Land- und Veteranenpolitik',
      detail: 'Ansiedlung von Veteranen und Umverteilung von Staatsland zur Stabilisierung nach Bürgerkrieg und zur Sicherung persönlicher Gefolgschaft.',
      impact: 'Beruhigt soziale Spannungen, bindet Legionäre an Caesar und belebt die Wirtschaft.',
    },
  ];

  const caesarTheaters = [
    {
      title: 'Gallien',
      years: '58–50 v. Chr.',
      note: 'Hauptfeldzug: Ressourcen, Prestige, Brückenkopf nach Germanien & Britannien.',
    },
    {
      title: 'Germania',
      years: '55–53 v. Chr.',
      note: 'Rheinbrücken als Machtdemonstration, Vorstoß ohne dauerhafte Besetzung.',
    },
    {
      title: 'Britannien',
      years: '55–54 v. Chr.',
      note: 'Symbolische Expedition: zeigt römische Reichweite, begrenzter territorialer Gewinn.',
    },
    {
      title: 'Hispanien & Afrika',
      years: '49–45 v. Chr.',
      note: 'Schlüsselgefechte des Bürgerkriegs: Ilerda, Thapsus, Munda sichern Alleinherrschaft.',
    },
  ];

  const caesarOffices = [
    {
      title: 'Pontifex Maximus',
      years: '63 v. Chr.',
      note: 'Oberpriester – religiöse Autorität als politischer Hebel.',
    },
    {
      title: 'Konsul',
      years: '59 v. Chr.',
      note: 'Setzt populare Gesetzespakete durch, trotz Widerstand der Optimaten.',
    },
    {
      title: 'Diktator',
      years: '49–44 v. Chr.',
      note: 'Kriegs- und Krisenvollmacht, später auf 10 Jahre und perpetuo ausgedehnt.',
    },
  ];

  const caesarDebate = [
    {
      heading: 'Warum er bewundert wird',
      points: [
        'Brillanter Feldherr mit logistischer Präzision und schneller Entscheidungsfreude.',
        'Pragmatischer Reformer, der Verwaltung und Kalender modernisierte.',
        'Meister der Selbstdarstellung: klare Sprache, dritte Person, prägnante Narrative.',
      ],
    },
    {
      heading: 'Warum er gefürchtet wurde',
      points: [
        'Machtkonzentration und Missachtung republikanischer Checks & Balances.',
        'Senatserweiterung als politisches Werkzeug zur Stimmenmaximierung.',
        'Heerestreue wichtiger als Senatsautorität – der Rubikon als Präzedenzfall.',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        {/* Caesar Hero */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-7"
              >
                <span className="inline-block px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6">
                  {authorInfo.years}
                </span>
                <h1 className="font-display text-6xl sm:text-7xl font-bold mb-4 tracking-tighter text-foreground">
                  {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.heroTitle || authorPage?.heroTitle || authorInfo.name}
                </h1>
                <p className="text-2xl sm:text-3xl text-muted-foreground font-display italic mb-6">
                  {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.heroSubtitle || authorPage?.heroSubtitle || authorInfo.title}
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/60">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{details.birthPlace}</span>
                  </div>
                  <div className="h-1 w-12 bg-primary/30 rounded-full" />
                  <p className="text-lg text-muted-foreground max-w-xl font-light leading-relaxed">
                    {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.projectDescription || authorPage?.projectDescription || authorInfo.description}
                  </p>
                </div>
              </motion.div>
              <div className="lg:col-span-5">
                <div className="rounded-3xl overflow-hidden border border-border/40 bg-card/30">
                  <img src={authorInfo.heroImage} alt={authorInfo.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reading Guide for Caesar */}
        <section className="py-12 sm:py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-2">Wie nutzt du diese Seite?</h2>
                <p className="text-muted-foreground">Wähle deinen Einstiegspunkt:</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Link to="/timeline" className="card-modern card-hover-primary card-padding-md group">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">Chronologie</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Überblick über die wichtigsten Stationen – von Gallien bis zu den Iden des März.</p>
                </Link>
                <Link to="/caesar" className="card-modern card-hover-primary card-padding-md group">
                  <div className="flex items-center gap-3 mb-3">
                    <Scroll className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">Tagebuch</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Einträge mit persönlicher und wissenschaftlicher Perspektive.</p>
                </Link>
                <div className="card-modern card-padding-md bg-card/40">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-lg font-bold">Diese Seite</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Biografie, Werke und Lebenslauf.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                      <p className="text-sm text-muted-foreground mt-1">Literarische Werke und Schriften</p>
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
                            <span>Lesen</span>
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
                        <p className="text-sm text-muted-foreground mt-1">Ausgewählte Einträge</p>
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
                              Lesen <ArrowRight className="h-3 w-3" />
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
                  <h2 className="font-display text-4xl font-bold">Lebenslauf & Stationen</h2>
                  <p className="text-lg text-muted-foreground mt-2">Die wichtigsten Feldzüge, Ämter und Reformen</p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Feldzüge & Kriege */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Sword className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Feldzüge & Kriege</h3>
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
                            Artikel lesen
                          </Link>
                        )}
                        {idx === 4 && (
                          <Link 
                            to="/caesar/bürgerkrieg-und-herrschaft"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            Artikel lesen
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
                    <h3 className="font-display text-2xl font-bold">Ämter & Titel</h3>
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
                            Artikel lesen
                          </Link>
                        )}
                        {idx === 4 && (
                          <Link 
                            to="/caesar/diktator-perpetuo"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            Artikel lesen
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
                    <h3 className="font-display text-2xl font-bold">Reformen</h3>
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
                            Artikel lesen
                          </Link>
                        )}
                        {idx === 2 && (
                          <Link 
                            to="/caesar/senatsreform"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            Artikel lesen
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
                  Für eine detaillierte Chronologie aller Ereignisse:
                </p>
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

        {/* Reformen, die blieben */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Reformen, die blieben</h2>
              <p className="text-lg text-muted-foreground">Caesars politische Maßnahmen, die über seine Herrschaft hinaus wirkten.</p>
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
                        {reform.horizon === 'sofort' ? '⚡ sofort' : reform.horizon === 'mittelfristig' ? '↗ mittelfristig' : '↗ langfristig'}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{reform.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{reform.summary}</p>
                    {slug && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-primary font-semibold">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Zum ausführlichen Artikel</span>
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
              <h2 className="font-display text-4xl font-bold mb-4">Reformen im Detail</h2>
              <p className="text-lg text-muted-foreground">Was er änderte, wie es wirkte – und warum es Rom neu ordnete.</p>
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
                      <span className="font-semibold text-primary">Folge:</span> {item.impact}
                    </div>
                    {slug && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-primary font-semibold">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Mehr erfahren</span>
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
              <h2 className="font-display text-4xl font-bold mb-4">Warum er polarisiert</h2>
              <p className="text-lg text-muted-foreground">Zwischen Genie und Gefahr – die zwei Lesarten von Caesars Karriere.</p>
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
              <h2 className="font-display text-4xl font-bold mb-4">Schauplätze & Ämter</h2>
              <p className="text-lg text-muted-foreground">Wo er zog, welche Macht er trug – Schauplätze als Bühne, Ämter als Hebel.</p>
            </div>

            <div className="max-w-6xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Schauplätze</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  {caesarTheaters.map((item) => (
                    <div
                      key={item.title}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Feldzug</span>
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
                    <h3 className="font-display text-xl font-bold">Karte seiner Züge</h3>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    Interaktive Karte im Antik-Look mit markierten Feldzügen, Rheinbrücken, Britannien-Landungen und Bürgerkriegszügen.
                  </p>
                  <CaesarCampaignMap mapHeightClass="h-[520px] lg:h-[620px]" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Ämter</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  {caesarOffices.map((item) => (
                    <div
                      key={item.title}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Amt</span>
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
              <h2 className="font-display text-4xl font-bold mb-4">Militärische Meisterleistungen</h2>
              <p className="text-lg text-muted-foreground">Schlachten als Meilensteine: Wo Caesar Tempo, Logistik und Belagerungstechnik kombinierte.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[{
                icon: Sword,
                title: 'Gallischer Krieg',
                years: '58–50 v. Chr.',
                note: 'Alesia 52 v. Chr.: Doppelwall und Belagerungsringe gegen Vercingetorix.'
              }, {
                icon: Map,
                title: 'Britannien & Germanien',
                years: '55–54 v. Chr.',
                note: 'Rheinbrücken in 10 Tagen, erste römische Landung in Britannien.'
              }, {
                icon: Trophy,
                title: 'Bürgerkrieg',
                years: '49–45 v. Chr.',
                note: 'Pharsalos, Thapsus, Munda – schnelle Entscheidungen trotz Unterzahl.'
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
              <h2 className="font-display text-4xl font-bold mb-4">Caesars Weg zur Macht</h2>
              <p className="text-lg text-muted-foreground">Vom geheimen Bündnis über populare Reformen bis zur tragischen Ermordung – die entscheidenden Stationen seiner politischen Karriere.</p>
            </div>
            <div className="max-w-6xl mx-auto">
              {/* Phase 1 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Phase I: Aufstieg (60–50 v. Chr.)</span>
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
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">60 v. Chr.</span>
                      <h3 className="font-display text-2xl font-bold mb-3">Erstes Triumvirat</h3>
                      <p className="text-sm text-foreground/85 leading-relaxed mb-4">Geheimes Dreierbündnis mit Pompeius und Crassus – politischer Pakt, der die Optimaten umgeht und Caesar das Konsulat 59 v. Chr. sichert.</p>
                      <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Zum Tagebucheintrag</span>
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
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">59 v. Chr.</span>
                    <h3 className="font-display text-2xl font-bold mb-3">Konsulat & Reformen</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Landgesetze für Veteranen, Neuordnung der Provinzen – populare Politik zur Stärkung der Hausmacht gegen den konservativen Senat.</p>
                  </motion.div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Phase II: Der Bruch (49 v. Chr.)</span>
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
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-3">10. Januar 49 v. Chr.</span>
                        <h3 className="font-display text-3xl font-bold mb-2">Rubikon-Überquerung</h3>
                        <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Wendepunkt der Republik</p>
                      </div>
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Landmark className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <p className="text-base text-foreground/90 leading-relaxed mb-4">»Alea iacta est« – Der Würfel ist gefallen. Caesar überschreitet mit seinen Legionen die Grenze zwischen Provinz und Italien und bricht damit das Gesetz. Der Bürgerkrieg beginnt.</p>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 text-xs text-primary/80">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="font-semibold">Wendepunkt der römischen Geschichte</span>
                      </div>
                      <Link
                        to="/caesar/ich-uberschreite-den-rubikon"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-bold transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Zum Tagebucheintrag
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
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Phase III: Alleinherrschaft (46–44 v. Chr.)</span>
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
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">46 v. Chr.</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">Diktatur (10 Jahre)</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Zentralisierung der Macht – Kalenderreform, Infrastruktur, Schuldenerlass. Erste Stufe zur Alleinherrschaft.</p>
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
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">44 v. Chr.</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">Diktator perpetuo</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Lebenslange Diktatur – das Ende der Republik. Auslöser der Verschwörung unter Brutus und Cassius.</p>
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
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">15. März 44 v. Chr.</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">Iden des März</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">23 Dolchstiche im Senat – die republikanische Elite schlägt zurück. Caesars Tod wird zum Mythos.</p>
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
              <h2 className="font-display text-4xl font-bold mb-4">Legendäre Zitate</h2>
              <p className="text-lg text-muted-foreground">Kontext und Wirkung – warum die Worte hängen bleiben.</p>
            </div>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              {[{
                quote: 'Veni, vidi, vici.',
                translation: 'Ich kam, ich sah, ich siegte.',
                when: '47 v. Chr., Zela',
                meaning: 'Telegrammstil an den Senat – Inszenierung von Schnelligkeit und Totalerfolg.'
              }, {
                quote: 'Alea iacta est.',
                translation: 'Der Würfel ist gefallen.',
                when: '49 v. Chr., Rubikon',
                meaning: 'Unumkehrbarer Schritt – bewusste Grenzüberschreitung gegen das Senatsmandat.'
              }, {
                quote: 'Et tu, Brute?',
                translation: 'Auch du, Brutus?',
                when: '44 v. Chr., Senat',
                meaning: 'Legendarischer Verratsmoment; überliefert von Sueton, vermutlich dramatisiert.'
              }].map((item) => (
                <div
                  key={item.quote}
                  className="card-modern card-hover-primary card-padding-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <Sparkles className="h-3.5 w-3.5" /> Impact
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
