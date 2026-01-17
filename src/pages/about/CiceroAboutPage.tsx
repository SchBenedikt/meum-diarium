import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { MapPin, BookOpen, ArrowRight, Users, Scroll, Clock, Award, Sparkles, Crown, Landmark, Calendar } from 'lucide-react';
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

export function CiceroAboutPage() {
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
    if (authorId === 'cicero') {
      setCurrentAuthor('cicero' as Author);
      async function translateContent() {
        const translatedAuthor = await getTranslatedAuthor(language, 'cicero' as Author);
        setAuthorInfo(translatedAuthor);

        if (!postsLoading) {
          const translatedPosts = await Promise.all(
            allPosts.filter(p => p.author === 'cicero').slice(0, 3).map(p => getTranslatedPost(language, p.author, p.slug))
          );
          setAuthorPosts(translatedPosts.filter((p): p is BlogPost => p !== null));
        }

        const translatedWorks = await Promise.all(
          Object.values(baseWorks).filter(w => w.author === 'cicero').map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
        );
        setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));

        try {
          const res = await fetch('/api/pages/author-about-cicero');
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

  const details = authorDetails.cicero;

  const ciceroSnapshots = [
    { label: 'Lebenszeit', value: '106–43 v. Chr.', hint: '63 Jahre' },
    { label: 'Konsulat', value: '63 v. Chr.', hint: 'Niederschlagung der Catilinarischen Verschwörung' },
    { label: 'Exil', value: '58–57 v. Chr.', hint: 'Wegen Hinrichtung der Verschwörer' },
    { label: 'Reden', value: '~100 erhalten', hint: 'Von >800 Reden' },
    { label: 'Briefe', value: '~900 erhalten', hint: 'Wichtigste Quelle für die Epoche' },
    { label: 'Phil. Werke', value: '13 Schriften', hint: 'Vermittlung griech. Philosophie' },
  ];

  const ciceroAchievements = [
    {
      title: 'Rhetorik als Waffe',
      summary: 'Perfektion der lateinischen Rhetorik – seine Reden gegen Catilina, Verres und Antonius sind zeitlose Meisterwerke der Überzeugungskunst. Entwickelte die klassische Fünfteilung: inventio, dispositio, elocutio, memoria, pronuntiatio.',
      tag: 'Rhetorik',
      icon: 'Users' as const,
    },
    {
      title: 'Philosophie für Rom',
      summary: 'Vermittlung griechischer Philosophie (Stoizismus, Akademie, Epikureismus) in lateinischer Sprache – schuf das Vokabular für abstrakte Begriffe wie "qualitas", "essentia", "moralis". Machte Philosophie für Roms Elite zugänglich.',
      tag: 'Philosophie',
      icon: 'BookOpen' as const,
    },
    {
      title: 'Verteidiger der Republik',
      summary: 'Kämpfte bis zuletzt gegen die aufkommende Alleinherrschaft – seine 14 Philippicae gegen Antonius kosteten ihn das Leben. Verteidigte libertas und res publica gegen Tyrannis. Sein Kopf und seine Hände wurden zur Schau gestellt.',
      tag: 'Politik',
      icon: 'Award' as const,
    },
    {
      title: 'Briefe als Zeitdokument',
      summary: 'Über 900 erhaltene Briefe (an Atticus, Quintus, Brutus) gewähren einzigartige Einblicke in das politische und private Leben der späten Republik. Ungefilterte Gedanken, Zweifel, Hoffnungen – intimer als jede Geschichtsschreibung.',
      tag: 'Quellen',
      icon: 'Scroll' as const,
    },
    {
      title: 'Jurist und Staatstheoretiker',
      summary: 'Mit "De re publica" und "De legibus" schuf er grundlegende Werke zur Staatstheorie. Seine Ideen von Naturrecht, Gewaltenteilung und res publica prägten Aufklärung und moderne Verfassungen.',
      tag: 'Staatstheorie',
      icon: 'Award' as const,
    },
    {
      title: 'Literarischer Stilist',
      summary: 'Seine Prosa wurde zum Goldstandard der lateinischen Literatur. Sein Periodenstil – komplex, aber klar – beeinflusste Jahrhunderte europäischer Bildung. Jeder Humanist kannte seine Texte auswendig.',
      tag: 'Sprache',
      icon: 'BookOpen' as const,
    },
  ];

  const ciceroDebate = [
    {
      heading: 'Warum er bewundert wird',
      points: [
        'Größter Redner Roms – formte die lateinische Prosa und prägte die westliche Rhetorik.',
        'Verteidiger der Republik und der Rechtsstaatlichkeit gegen Tyrannen.',
        'Vermittler griechischer Philosophie und Schöpfer lateinischer Fachterminologie.',
        'Seine Briefe sind die wichtigste Quelle für die Epoche der Bürgerkriege.',
      ],
    },
    {
      heading: 'Warum er kritisiert wird',
      points: [
        'Ließ Catilina-Verschwörer ohne Gerichtsverfahren hinrichten – verfassungsrechtlich fragwürdig.',
        'Selbstüberschätzung und Eitelkeit – rühmte sich ständig seiner Taten.',
        'Taktisch ungeschickt – unterschätzte Caesar und überschätzte seine eigene Macht.',
        'Opportunismus: Wechselte zwischen politischen Lagern, je nach Vorteil.',
      ],
    },
  ];

  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return '—';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`;
  };

  const ciceroSidebar = {
    karriere: [
      { year: -81, title: 'Erste Prozesse', note: 'Vertretung im Sextus Roscius-Fall' },
      { year: -63, title: 'Konsul', note: 'Catilina aufgedeckt, Concordia ordinis' },
      { year: -58, title: 'Exil', note: 'Wegen Hinrichtungen der Verschwörer' },
      { year: -57, title: 'Rückkehr aus Exil', note: 'Senatsbeschluss, Applaus' },
      { year: -51, title: 'Statthalter Kilikien', note: 'Militärischer Erfolg, „Imperator“-Ausruf' },
      { year: -44, title: 'Philippicae', note: 'Angriff auf Antonius' },
    ],
    reden: [
      { year: -70, title: 'In Verrem', note: 'Korruption Sizilien' },
      { year: -66, title: 'Pro Lege Manilia', note: 'Unterstützung für Pompeius' },
      { year: -63, title: 'In Catilinam', note: 'Vier Reden gegen Catilina' },
      { year: -52, title: 'Pro Milone', note: 'Verteidigung Milos' },
      { year: -43, title: 'Philippicae', note: '14 Reden gegen Antonius' },
    ],
    konflikte: [
      { year: -58, title: 'Clodius & Exil', note: 'Politische Fehde, Verbannung' },
      { year: -49, title: 'Zwischen Caesar & Pompeius', note: 'Unentschiedenheit, später Pompeius' },
      { year: -47, title: 'Versöhnung mit Caesar', note: 'Rückkehr in Politik' },
      { year: -43, title: 'Proskriptionen', note: 'Zweites Triumvirat; Tod Ciceros' },
    ],
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

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="grid gap-20 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-24">
              {/* Works Section */}
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
                        to={`/cicero/works/${slugify(work.title, { lower: true, strict: true })}`}
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
                      <Link to="/cicero">
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
                    {ciceroSnapshots.map((item) => (
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

        {/* Cicero's Achievements */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Seine bleibenden Leistungen</h2>
              <p className="text-lg text-muted-foreground">Rhetorik, Philosophie und Politik – Ciceros Erbe für die westliche Zivilisation.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {ciceroAchievements.map((achievement) => {
                const IconComponent = achievement.icon === 'Users' ? Users : achievement.icon === 'BookOpen' ? BookOpen : achievement.icon === 'Award' ? Award : Scroll;
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

        {/* Rhetorische Meisterwerke */}
        <section className="py-24 bg-surface-container-low/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Rhetorische Meisterwerke</h2>
              <p className="text-lg text-muted-foreground">Die Reden, die Rom bewegten und die Rhetorik für immer prägten.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              <div className="card-modern card-hover-primary card-padding-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scroll className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">In Catilinam (63 v. Chr.)</h3>
                    <span className="text-xs text-primary font-semibold">Gegen die Verschwörung</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed mb-3">Vier Reden gegen Catilina, der einen Umsturz plante. Die erste beginnt mit den berühmtesten Worten der lateinischen Literatur. Direkte Ansprache, dramatische Steigerung, moralische Empörung – Rhetorik als Staatsrettung.</p>
                <div className="text-xs text-muted-foreground italic">"Quo usque tandem abutere, Catilina, patientia nostra?"</div>
              </div>
              <div className="card-modern card-hover-primary card-padding-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scroll className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">In Verrem (70 v. Chr.)</h3>
                    <span className="text-xs text-primary font-semibold">Gegen Korruption</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed mb-3">Anklage gegen Verres, den korrupten Statthalter Siziliens. Sieben Reden voller Details über Raub, Folter und Machtmissbrauch. Der Durchbruch des jungen Cicero – Verres floh ins Exil, bevor das Urteil fiel.</p>
                <div className="text-xs text-muted-foreground italic">Der Prozess, der Ciceros Karriere begründete.</div>
              </div>
              <div className="card-modern card-hover-primary card-padding-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scroll className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">Philippicae (44–43 v. Chr.)</h3>
                    <span className="text-xs text-primary font-semibold">Gegen Antonius</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed mb-3">14 feurige Reden gegen Marcus Antonius, benannt nach Demosthenes’ Reden gegen Philipp von Makedonien. Ciceros letzter Kampf für die Republik. Antonius ließ ihn dafür ermorden – Kopf und Hände wurden auf dem Forum ausgestellt.</p>
                <div className="text-xs text-muted-foreground italic">Sein politisches Vermächtnis – und sein Todesurteil.</div>
              </div>
              <div className="card-modern card-hover-primary card-padding-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scroll className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">Pro Milone (52 v. Chr.)</h3>
                    <span className="text-xs text-primary font-semibold">Verteidigung eines Freundes</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed mb-3">Verteidigung des Milo, der Clodius getötet hatte. Obwohl Cicero die Rede unter Einschüchterung hielt und verlor, gilt die schriftliche Fassung als rhetorisches Meisterwerk – perfekt strukturiert, emotional packend.</p>
                <div className="text-xs text-muted-foreground italic">Die schönste Rede, die nie gehalten wurde (zumindest nicht so).</div>
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
                  <p className="text-lg text-muted-foreground mt-2">Karriere, Reden und die Wendepunkte eines Lebens</p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Karriere & Ämter */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Karriere</h3>
                  </div>
                  <div className="space-y-4">
                    {ciceroSidebar.karriere.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 1 && (
                          <Link
                            to="/cicero/konsul-und-catilina"
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

                {/* Reden & Prozesse */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Reden</h3>
                  </div>
                  <div className="space-y-4">
                    {ciceroSidebar.reden.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 2 && (
                          <Link
                            to="/cicero/in-catilinam"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            Artikel lesen
                          </Link>
                        )}
                        {idx === 4 && (
                          <Link
                            to="/cicero/philippicae"
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

                {/* Konflikte & Wendepunkte */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Wendepunkte</h3>
                  </div>
                  <div className="space-y-4">
                    {ciceroSidebar.konflikte.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 0 && (
                          <Link
                            to="/cicero/exil-und-rückkehr"
                            className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            Artikel lesen
                          </Link>
                        )}
                        {idx === 3 && (
                          <Link
                            to="/cicero/tod-und-vermächtnis"
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
              <p className="text-lg text-muted-foreground">Zwischen brillanter Rhetorik und politischem Opportunismus.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {ciceroDebate.map((block) => (
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
              <p className="text-lg text-muted-foreground">Worte, die Jahrtausende überdauerten.</p>
            </div>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              {[{
                quote: 'Quo usque tandem abutere, Catilina, patientia nostra?',
                translation: 'Wie lange noch, Catilina, wirst du unsere Geduld missbrauchen?',
                when: '63 v. Chr., 1. Catilinaria',
                meaning: 'Der kraftvollste Redeauftakt der Antike – direkte Konfrontation als rhetorische Waffe.'
              }, {
                quote: 'O tempora, o mores!',
                translation: 'O Zeiten, o Sitten!',
                when: '63 v. Chr., Catilina',
                meaning: 'Klage über moralischen Verfall – ein zeitloser Ausruf, bis heute zitiert.'
              }, {
                quote: 'Salus populi suprema lex esto.',
                translation: 'Das Wohl des Volkes soll oberstes Gesetz sein.',
                when: 'De Legibus',
                meaning: 'Grundprinzip republikanischer Politik, das bis in moderne Verfassungen nachwirkt.'
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
