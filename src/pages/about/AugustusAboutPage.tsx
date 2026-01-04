import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { MapPin, BookOpen, ArrowRight, Clock, Award, Sparkles, Crown, Landmark, Sword, Calendar } from 'lucide-react';
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

export function AugustusAboutPage() {
  const { setCurrentAuthor } = useAuthor();
  const { authorId } = useParams<{ authorId: string }>();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();

  const [authorInfo, setAuthorInfo] = useState<AuthorInfo | null>(null);
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);

  const authorDetails = useAuthorDetails(t);

  // Additional Augustus works (fictional but historically based)
  const augustusAdditionalWorks: Work[] = [
    {
      id: 'augustus_4',
      author: 'augustus',
      title: 'Mein Kampf gegen Antonius',
      summary: 'Hypothetische Kriegstagebücher aus Octavians Kampf gegen Marcus Antonius. Strategie, Diplomatie und die Showdowns von Mutina und Actium.',
      slug: 'mein-kampf-gegen-antonius',
      content: '',
      year: '44–30 v. Chr.',
    },
    {
      id: 'augustus_5',
      author: 'augustus',
      title: 'Ordnung der Provinzen',
      summary: 'Administrative Schriften zur Reorganisation des Imperiums. Steuersysteme, Gouverneursrichtlinien und die Neugliederung der Reichsteile.',
      slug: 'ordnung-der-provinzen',
      content: '',
      year: '27 v. Chr.',
    },
    {
      id: 'augustus_6',
      author: 'augustus',
      title: 'Die Pax Romana',
      summary: 'Propagandistische Texte zur Friedensagenda. Wie Augustus die Welt befriedet, Legionen stärkt und Wohlstand verbreitet.',
      slug: 'die-pax-romana',
      content: '',
      year: '30–14 v. Chr.',
    },
  ];

  useEffect(() => {
    if (authorId === 'augustus') {
      setCurrentAuthor('augustus' as Author);
      async function translateContent() {
        const translatedAuthor = await getTranslatedAuthor(language, 'augustus' as Author);
        setAuthorInfo(translatedAuthor);

        if (!postsLoading) {
          const translatedPosts = await Promise.all(
            allPosts.filter(p => p.author === 'augustus').slice(0, 3).map(p => getTranslatedPost(language, p.author, p.slug))
          );
          setAuthorPosts(translatedPosts.filter((p): p is BlogPost => p !== null));
        }

        const translatedWorks = await Promise.all(
          Object.values(baseWorks).filter(w => w.author === 'augustus').map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
        );
        setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));

        try {
          const res = await fetch('/api/pages/author-about-augustus');
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

  const details = authorDetails.augustus;
  const allWorks = [...authorWorks, ...augustusAdditionalWorks];

  const augustusSnapshots = [
    { label: 'Lebenszeit', value: '63 v. Chr. – 14 n. Chr.', hint: '76 Jahre' },
    { label: 'Herrschaft', value: '27 v. Chr. – 14 n. Chr.', hint: '41 Jahre als Princeps' },
    { label: 'Bürgerkriege', value: '3 gewonnen', hint: 'Mutina, Philippi, Actium' },
    { label: 'Pax Romana', value: '200 Jahre', hint: 'Friedensära nach Augustus' },
    { label: 'Bauprojekte', value: '82 Tempel', hint: 'Plus Forum, Theater, Aquädukte' },
    { label: 'Titel', value: 'Pater Patriae', hint: 'Vater des Vaterlandes (2 v. Chr.)' },
  ];

  const augustusAchievements = [
    {
      title: 'Pax Romana',
      summary: 'Beendete Jahrzehnte des Bürgerkriegs (44–30 v. Chr.) und etablierte 200 Jahre relativen Friedens im Römischen Reich. Schloss Janustempel nach Actium – Symbol des Friedens. Sicherte Grenzen durch Diplomatie und selektive Expansion.',
      tag: 'Frieden',
      icon: 'Sparkles' as const,
    },
    {
      title: 'Institutionalisierung der Macht',
      summary: 'Verwandelte die Republik faktisch in eine Monarchie, ohne sie formal abzuschaffen – das Prinzipat als geniale Tarnung. Behält republikanische Ämter (Konsul, Tribun), akkumuliert aber alle Vollmachten. Der Senat bleibt, wird aber entmachtet.',
      tag: 'Verfassung',
      icon: 'Crown' as const,
    },
    {
      title: 'Kulturelle Blüte',
      summary: 'Förderte Vergil (Aeneis), Horaz (Oden), Ovid (Metamorphosen) und Livius (Ab urbe condita) – das "Augusteische Zeitalter" wurde zum goldenen Zeitalter der römischen Literatur. Maecenas als Kultursponsor. Kunst im Dienst der Staatsideologie.',
      tag: 'Kultur',
      icon: 'BookOpen' as const,
    },
    {
      title: 'Rom als Marmorstadt',
      summary: 'Massives Bauprogramm: "Ich fand eine Stadt aus Ziegeln und hinterließ eine aus Marmor" – 82 Tempel restauriert, Forum Augustum, Ara Pacis, Theater des Marcellus, Aqua Virgo. Architektur als Herrschaftsinstrument und Legitimation.',
      tag: 'Architektur',
      icon: 'Landmark' as const,
    },
    {
      title: 'Reform der Verwaltung',
      summary: 'Neuorganisation der Provinzen (senatorisch vs. kaiserlich), professionelles Beamtentum, feste Sold-Regelungen für Legionen, Aerar vs. Fiscus. Census und Steuersystem standardisiert. Grundlage des späteren Kaiserreichs.',
      tag: 'Administration',
      icon: 'Crown' as const,
    },
    {
      title: 'Dynastische Nachfolgeregelung',
      summary: 'Trotz fehlender Söhne sicherte er die Dynastie durch Adoptionen (Tiberius) und dynastische Ehen. Etablierte das Prinzip der kaiserlichen Nachfolge – wenn auch mit Schwächen, die später zum Niedergang führten.',
      tag: 'Dynastie',
      icon: 'Crown' as const,
    },
  ];

  const augustusDebate = [
    {
      heading: 'Warum er bewundert wird',
      points: [
        'Beendete die Bürgerkriege und brachte Stabilität nach Jahrzehnten des Chaos.',
        'Kulturelle und architektonische Blüte – das Augusteische Zeitalter.',
        'Geschickte Machtkonsolidierung ohne offene Diktatur – behielt republikanische Fassade.',
        'Effiziente Verwaltung und Expansion des Reiches auf seine größte Ausdehnung.',
      ],
    },
    {
      heading: 'Warum er kritisiert wird',
      points: [
        'Proskriptionen von 43 v. Chr. – Tausende politische Gegner ermordet.',
        'Zensur und Kontrolle der Literatur – Ovid ins Exil verbannt.',
        'Ende der republikanischen Freiheit – Senat wurde zum Akklamationsorgan.',
        'Propaganda und Geschichtsfälschung – stellte sich als Retter dar, nicht als Alleinherrscher.',
      ],
    },
  ];

  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return '—';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`;
  };

  const augustusSidebar = {
    kriege: [
      { year: -43, title: 'Mutina', note: 'Sieg gegen Antonius, Konsulat mit Hirtius/Pansa' },
      { year: -42, title: 'Philippi', note: 'Besiegt Caesarmörder mit Antonius' },
      { year: -36, title: 'Naulochos', note: 'Sextus Pompeius geschlagen' },
      { year: -31, title: 'Actium', note: 'Seesieg gegen Antonius & Kleopatra' },
      { year: -30, title: 'Alexandria', note: 'Suizid Kleopatras, Ende der Ptolemäer' },
    ],
    aemter: [
      { year: -43, title: 'Triumvir', note: 'Mit Antonius & Lepidus' },
      { year: -27, title: 'Princeps', note: '„Wiederherstellung der Republik“, Beginn Prinzipat' },
      { year: -23, title: 'Tribunicia potestas', note: 'Dauerhafte Volkstribunengewalt' },
      { year: -19, title: 'Imperium proconsulare maius', note: 'Oberbefehl über Legionen' },
      { year: -2, title: 'Pater Patriae', note: 'Ehrentitel, Loyalitätsmarker' },
    ],
    reformen: [
      { year: -28, title: 'Senatsreform', note: 'Bereinigung und Verkleinerung des Senats' },
      { year: -27, title: 'Provinzordnung', note: 'Trennung kaiserlicher vs. senatorischer Provinzen' },
      { year: -23, title: 'Heeresreform', note: 'Feste Soldzahlungen, Veteranenkassen' },
      { year: -18, title: 'Sitten- & Ehegesetze', note: 'Lex Iulia de maritandis ordinibus' },
      { year: -13, title: 'Ara Pacis & Bauprogramm', note: 'Propaganda der Pax Augusta' },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        {/* Augustus Hero - Full Viewport */}
        <section className="relative min-h-screen flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
            <img
              src={authorInfo.heroImage}
              alt={authorInfo.name}
              className="w-full h-full object-cover scale-105 blur-[2px]"
            />
          </div>

          <div className="container mx-auto relative z-20 px-4 sm:px-6 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6">
                {authorInfo.years}
              </span>
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold mb-4 tracking-tighter text-foreground">
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
          </div>
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
            <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="grid gap-20 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-24">
              {/* Works Section - Including Additional Works */}
              {allWorks.length > 0 && (
                <section>
                  <div className="flex items-center gap-6 mb-12">
                    <h2 className="font-display text-4xl font-bold">{t('works')}</h2>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {allWorks.map((work, i) => (
                      <Link
                        key={i}
                        to={`/augustus/works/${slugify(work.title, { lower: true, strict: true })}`}
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

              {/* Recent Entries */}
              {authorPosts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-12">
                    <h2 className="font-display text-4xl font-bold">{t('diaryEntries')}</h2>
                    <Button asChild variant="ghost" className="text-primary hover:text-primary/80 uppercase tracking-widest font-bold text-xs">
                      <Link to="/augustus">
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

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="card-modern card-padding-md">
                  <h3 className="font-display text-2xl font-bold mb-5 text-primary">Kurzfakten</h3>
                  <div className="space-y-3 text-sm text-foreground/80">
                    {augustusSnapshots.map((item) => (
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

        {/* Augustus' Achievements */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Seine bleibenden Leistungen</h2>
              <p className="text-lg text-muted-foreground">Wie Augustus Rom transformierte und 200 Jahre Frieden sicherte.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {augustusAchievements.map((achievement) => {
                const IconComponent = achievement.icon === 'Sparkles' ? Sparkles : achievement.icon === 'Crown' ? Crown : achievement.icon === 'BookOpen' ? BookOpen : Landmark;
                return (
                  <div
                    key={achievement.title}
                    className="card-modern card-hover-primary card-padding-lg"
                  >
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
          </div>
        </section>

        {/* Das Prinzipat-System */}
        <section className="py-24 bg-gradient-to-b from-background to-surface-container-low/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Das Prinzipat – Monarchie im republikanischen Gewand</h2>
              <p className="text-lg text-muted-foreground">Wie Augustus die Macht monopolisierte, ohne König zu werden.</p>
            </div>
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card-modern card-hover-primary card-padding-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Der Titel \"Princeps\"</h3>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">\"Erster unter Gleichen\" (Princeps Senatus) – klingt bescheiden, bedeutet aber faktische Alleinherrschaft. Kein König, kein Diktator auf Lebenszeit – nur der \"Erste Bürger\". Geniale PR.</p>
                  <div className="text-xs text-muted-foreground italic">27 v. Chr. – Der Senat verleiht den Ehrentitel \"Augustus\" (der Erhabene).</div>
                </div>
                <div className="card-modern card-hover-primary card-padding-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Landmark className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Tribunicia Potestas</h3>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">Volle tribunizische Gewalt auf Lebenszeit: Vetorecht gegen Senatsbeschlüsse, Gesetzesinitiative, persönliche Unantastbarkeit. Der Schlüssel zur Kontrolle – formal legal, faktisch diktatorisch.</p>
                  <div className="text-xs text-muted-foreground italic">23 v. Chr. – Lebenslanges Tribunat ohne das Amt selbst zu bekleiden.</div>
                </div>
                <div className="card-modern card-hover-primary card-padding-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sword className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Imperium Proconsulare</h3>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">Oberbefehlsüber alle Legionen (ca. 300.000 Mann). Kontrolle über die wichtigsten Provinzen (Syrien, Ägypten, Gallien). Militärische Macht = politische Macht. Der Senat hat symbolische Provinzen, Augustus die strategischen.</p>
                  <div className="text-xs text-muted-foreground italic">Das Militär schwor auf ihn persönlich – nicht auf die Republik.</div>
                </div>
                <div className="card-modern card-hover-primary card-padding-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Pater Patriae</h3>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">\"Vater des Vaterlandes\" (2 v. Chr.) – moralische Autorität, die jede rechtliche Macht übersteigt. Augustus als Fürsorglicher, Weiser, Unangreifbarer. Wer den Vater angreift, ist ein Verräter.</p>
                  <div className="text-xs text-muted-foreground italic">Personenkult als Herrschaftsinstrument – nicht mehr wegzudenken.</div>
                </div>
              </div>
              <div className="card-modern card-padding-lg bg-gradient-to-br from-primary/5 to-background border-primary/20">
                <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Das Ergebnis: Monarchie ohne König
                </h3>
                <p className="text-sm text-foreground/85 leading-relaxed">Augustus akkumuliert alle entscheidenden Vollmachten, ohne ein einziges traditionell-monarchisches Amt zu übernehmen. Der Senat bleibt formal bestehen, ist aber machtlos. Die Republik ist tot, aber niemand wagt es auszusprechen. Das Prinzipat wird zur Blaupause für 300 Jahre Kaiserherrschaft – bis Diokletian die Maske fallen lässt und sich offen \"Dominus\" (Herr) nennt.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Lebenslauf & Stationen - Full Width Section */}
        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-display text-4xl font-bold">Lebenslauf & Stationen</h2>
                  <p className="text-lg text-muted-foreground mt-2">Kriege, Ämter und die Reformen einer Ära</p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Bürgerkriege & Schlachten */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Sword className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Kriege</h3>
                  </div>
                  <div className="space-y-4">
                    {augustusSidebar.kriege.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 3 && (
                          <Link 
                            to="/augustus/actium-und-alleinherrschaft"
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

                {/* Ämter & Titel */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Ämter</h3>
                  </div>
                  <div className="space-y-4">
                    {augustusSidebar.aemter.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 1 && (
                          <Link 
                            to="/augustus/princeps-und-prinzipat"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            Artikel lesen
                          </Link>
                        )}
                        {idx === 4 && (
                          <Link 
                            to="/augustus/pater-patriae"
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

                {/* Reformen & Bauprogramm */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Reformen</h3>
                  </div>
                  <div className="space-y-4">
                    {augustusSidebar.reformen.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 2 && (
                          <Link 
                            to="/augustus/heeresreform-und-veteranen"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            Artikel lesen
                          </Link>
                        )}
                        {idx === 4 && (
                          <Link 
                            to="/augustus/ara-pacis-und-bauprogramm"
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

        {/* Warum er polarisiert */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Warum er polarisiert</h2>
              <p className="text-lg text-muted-foreground">Zwischen Friedensbringer und verschleiertem Autokraten.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {augustusDebate.map((block) => (
                <div
                  key={block.heading}
                  className="card-modern card-hover-primary card-padding-lg"
                >
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

        {/* Legendäre Zitate */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Legendäre Zitate</h2>
              <p className="text-lg text-muted-foreground">Seine Worte, die Geschichte schrieben.</p>
            </div>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              {[{
                quote: 'Festina lente.',
                translation: 'Eile mit Weile.',
                when: 'Lebensmotto',
                meaning: 'Augustus\' strategische Geduld – langsame, aber sichere Machtkonsolidierung.'
              }, {
                quote: 'Acta est fabula.',
                translation: 'Das Stück ist gespielt.',
                when: '14 n. Chr., letzte Worte',
                meaning: 'Das Leben als Theater – Augustus\' Selbstreflexion kurz vor dem Tod.'
              }, {
                quote: 'Marmoream se relinquere, quam latericiam accepisset.',
                translation: 'Ich fand eine Stadt aus Ziegeln und hinterließ eine aus Marmor.',
                when: 'Über seine Baupolitik',
                meaning: 'Monumentale Transformation Roms – Architektur als Herrschaftsinstrument.'
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
