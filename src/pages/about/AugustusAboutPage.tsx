import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { MapPin, BookOpen, ArrowRight, Crown, Scroll, Clock, Award, Landmark, Calendar, Users, Sparkles } from 'lucide-react';
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
import { SEO } from '@/components/SEO';
import augustusPageData from '@/content/pages/author-about-augustus.json';
import AugustusCampaignMap from '@/components/AugustusCampaignMap';

export function AugustusAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);
  const authorDetails = useAuthorDetails(t);
  const baseUrl = 'https://meum-diarium.xn--schchner-2za.de';

  useEffect(() => {
    setCurrentAuthor('augustus' as Author);

    async function translateContent() {
      setAuthorPage(augustusPageData as PageContent);

      if (!postsLoading && allPosts.length > 0) {
        const authorPostsList = allPosts
          .filter(p => p.author === 'augustus')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);
        setAuthorPosts(authorPostsList);
      }

      const translatedWorks = await Promise.all(
        Object.values(baseWorks).filter(w => w.author === 'augustus').map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
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

  const details = authorDetails.augustus;
  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return '—';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`;
  };

  const augustusSnapshots = [
    { label: 'Lebenszeit', value: '63 v.–14 n. Chr.', hint: '76 Jahre' },
    { label: 'Regierungszeit', value: '41 Jahre', hint: 'Längste Herrschaft Roms' },
    { label: 'Prinzipat', value: '27 v. Chr.', hint: 'Übergabe der Macht durch Senat' },
    { label: 'Reformen', value: '100+', hint: 'Heer, Verwaltung, Recht, Bau' },
    { label: 'Legionen', value: '28', hint: 'Neue Berufsarmee' },
    { label: 'Motto', value: 'Res Gestae', hint: 'Autobiographischer Rechenschaftsbericht' },
  ];

  const augustusTimeline = [
    { year: -63, title: 'Geburt in Rom', description: 'Am 23. September in Rom als Gaius Octavius geboren. Sein Großonkel Julius Caesar beobachtet seinen Aufstieg.', icon: Users },
    { year: -44, title: 'Caesars Erbe', description: 'Nach Caesars Ermordung nimmt er Caesars Namen und Erbe an. Beginnt den Kampf um die Macht gegen Antonius und Lepidus.', icon: Crown },
    { year: -43, title: 'Zweites Triumvirat', description: 'Bündnis mit Marcus Antonius und Lepidus. Proskriptionslisten, darunter Cicero. Machtverteilung des Imperiums.', icon: Users },
    { year: -31, title: 'Sieg bei Actium', description: 'Entscheidungsschlacht gegen Antonius und Kleopatra. Ägypten wird römische Provinz. Octavian ist unangefochtener Herrscher.', icon: Award },
    { year: -27, title: 'Begründung des Prinzipats', description: 'Formelle Übergabe der Macht an den Senat, der sie zurückgibt. Erhalt des Titels „Augustus". Beginn der neuen Staatsform.', icon: Landmark },
    { year: -23, title: 'Tribunizische Gewalt', description: 'Erhalt der tribunicia potestas auf Lebenszeit – rechtliche Basis seiner Macht. Wird "Princeps" – Erster Bürger.', icon: Crown },
    { year: -2, title: 'Pater Patriae', description: 'Senat und Volk verleihen den Titel "Vater des Vaterlandes". Höhepunkt seiner Popularität.', icon: Sparkles },
    { year: 14, title: 'Tod in Nola', description: 'Stirbt am 19. August 14 n. Chr. in Nola. Letzte Worte: "Acta est fabula!" Nachfolger Tiberius tritt an.', icon: Clock },
  ];

  const augustusAchievements = [
    {
      title: 'Begründung des Kaiserreichs',
      summary: 'Durch das kluge Bewahren republikanischer Fassade und gleichzeitige Konzentration aller Macht in seiner Person schuf Augustus das Prinzipat – die faktische Einparteienherrschaft unter demokratischem Deckmantel. Dieses System überlebte 500 Jahre.',
      tag: 'Staatsform',
      icon: 'Crown' as const,
    },
    {
      title: 'Pax Romana',
      summary: '200 Jahre relativen Friedens im Imperium Romanum begannen mit Augustus. Er sicherte die Grenzen, beendete die Bürgerkriege und schuf Stabilität durch ein professionelles Heer und ein effizientes Verwaltungssystem.',
      tag: 'Frieden',
      icon: 'Award' as const,
    },
    {
      title: 'Rom aus Stein – in Marmor verwandelt',
      summary: '"Ich fand eine Stadt aus Ziegeln vor und hinterlasse eine aus Marmor." Das Bauprogramm unter Augustus umfasste Forum Augustum, Ara Pacis, Tempel des Mars Ultor und zahllose weitere Bauten. Rom wurde zur Metropole.',
      tag: 'Bauprogramm',
      icon: 'Landmark' as const,
    },
    {
      title: 'Militärreform und Prätorianer',
      summary: 'Schuf aus dem chaotischen Bürgerkriegsheer eine professionelle Berufsarmee mit 28 Legionen. Gründung der Prätorianergarde als kaiserliche Leibwache. Standardisierung von Sold, Dienstzeit und Veteranenversorgung.',
      tag: 'Militär',
      icon: 'Users' as const,
    },
    {
      title: 'Kulturelles Goldenes Zeitalter',
      summary: 'Förderer von Vergil (Aeneis), Horaz, Ovid, Livius und Properz. Die augusteische Literatur gilt als Höhepunkt der lateinischen Dichtung. Sein Kulturminister Maecenas wurde zum Inbegriff des Kunstmäzens.',
      tag: 'Kultur',
      icon: 'BookOpen' as const,
    },
    {
      title: 'Res Gestae Divi Augusti',
      summary: 'Sein persönlicher Rechenschaftsbericht – in Bronze gegossen und an seinem Mausoleum aufgestellt. Das wichtigste erhaltene Zeugnis augusteischer Propaganda und historischer Selbstdarstellung. Vorläufer der politischen Autobiographie.',
      tag: 'Literatur',
      icon: 'Scroll' as const,
    },
  ];

  const augustusDebate = [
    {
      heading: 'Warum er bewundert wird',
      points: [
        'Rettete Rom aus Jahrzehnten des Bürgerkriegs – 200 Jahre relativer Stabilität als direkte Folge.',
        'Klügster politischer Stratege Roms – bewahrte republikanische Formen, um die Monarchie zu verschleiern.',
        'Größtes Bauprogramm der Antike – transformierte Rom in die Welthauptstadt.',
        'Förderer eines kulturellen Goldenen Zeitalters – Vergil, Horaz, Ovid erblühten unter seiner Ägide.',
      ],
    },
    {
      heading: 'Warum er kritisiert wird',
      points: [
        'Beendete die Republik und 500 Jahre demokratischer Tradition – auch wenn er republikanische Fassaden bewahrte.',
        'Proskriptionslisten: Ließ Tausende, darunter Cicero, töten, um an die Macht zu kommen.',
        'Verbannung Ovids 8 n. Chr. – politische Kontrolle über die Kunst.',
        'Verschwieg die wahre Natur seiner Alleinherrschaft durch geschickte Propaganda.',
      ],
    },
  ];

  const augustusSidebar = {
    feldzuegeEroberungen: [
      { year: -31, title: 'Sieg bei Actium', note: 'Entscheidungsschlacht gegen Antonius und Kleopatra' },
      { year: -30, title: 'Ägypten erobert', note: 'Ägypten wird römische Provinz' },
      { year: -25, title: 'Hispanienfeldzug', note: 'Feldzug nach Nordspanien' },
      { year: -20, title: 'Partherfeldzug', note: 'Rückgewinnung der Legionen' },
      { year: -16, title: 'Alpenfeldzug', note: 'Eroberung der Alpenregion' },
    ],
    aemterTitel: [
      { year: -44, title: 'Caesars Erbe', note: 'Adoption und Erbschaft' },
      { year: -43, title: 'Zweites Triumvirat', note: 'Bündnis mit Antonius und Lepidus' },
      { year: -31, title: 'Alleinherrschaft', note: 'Sieg über alle Konkurrenten' },
      { year: -27, title: 'Prinzipat begründet', note: 'Formelle Übergabe der Macht' },
      { year: -23, title: 'Tribunizische Gewalt', note: 'Machtbasis auf Lebenszeit' },
      { year: -12, title: 'Pontifex Maximus', note: 'Religiöse Oberhoheit' },
      { year: -2, title: 'Pater Patriae', note: 'Vater des Vaterlandes' },
    ],
    reformenBauprojekte: [
      { year: -27, title: 'Provinzreform', note: 'Neuordnung der Verwaltung' },
      { year: -23, title: 'Heeresreform', note: 'Berufsarmee geschaffen' },
      { year: -18, title: 'Moralgesetze', note: 'Ehe- und Familienrecht reformiert' },
      { year: -13, title: 'Währungsreform', note: 'Denar neu bewertet' },
      { year: -12, title: 'Ara Pacis', note: 'Friedensaltar geweiht' },
      { year: -9, title: 'Forum Augustum', note: 'Neues Zentrum erbaut' },
      { year: -2, title: 'Marodepanzer', note: 'Feuerwache in Rom eingerichtet' },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <SEO
        title={`${authorInfo.name} – Begründer des Römischen Kaiserreichs`}
        description={authorInfo.description}
        author={authorInfo.name}
        image={`${baseUrl}/images/augustus-hero.png`}
        type="website"
      />
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
                    <h2 className="font-display text-4xl font-bold">Werke</h2>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {authorWorks.map((work, i) => (
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
                          {work.summary && (
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {work.summary}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Posts */}
              {authorPosts.length > 0 && (
                <section>
                  <div className="flex items-center gap-6 mb-12">
                    <h2 className="font-display text-4xl font-bold">Neueste Einträge</h2>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid gap-6">
                    {authorPosts.map((post, i) => (
                      <Link key={post.slug} to={`/augustus/${post.slug}`} className="group h-full">
                        <motion.article
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="card-modern card-hover-primary card-padding-lg relative h-full overflow-hidden flex flex-col"
                        >
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
                        </motion.article>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8">
                    <Button asChild variant="ghost" className="text-primary hover:text-primary/80 uppercase tracking-widest font-bold text-xs">
                      <Link to="/augustus">
                        Alle Einträge lesen <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
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

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Bedeutung & Leistungen</h2>
              <p className="text-lg text-muted-foreground">Machtarchitektur, Stabilisierung und kulturelles Programm eines Epochengründers.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {augustusAchievements.map((achievement) => {
                const IconComponent = achievement.icon === 'Crown' ? Crown : achievement.icon === 'Award' ? Award : achievement.icon === 'Landmark' ? Landmark : achievement.icon === 'Users' ? Users : achievement.icon === 'BookOpen' ? BookOpen : Scroll;
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

        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-display text-4xl font-bold">Lebenslauf & Stationen</h2>
                  <p className="text-lg text-muted-foreground mt-2">Feldzüge, Ämter und Reformen</p>
                </div>
              </div>
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Feldzüge & Eroberungen */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Feldzüge & Eroberungen</h3>
                  </div>
                  <div className="space-y-4">
                    {augustusSidebar.feldzuegeEroberungen.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 0 && (
                          <Link
                            to="/augustus/actium"
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

                {/* Ämter & Titel */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Ämter & Titel</h3>
                  </div>
                  <div className="space-y-4">
                    {augustusSidebar.aemterTitel.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 2 && (
                          <Link
                            to="/augustus/prinzipat"
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

                {/* Reformen & Bauprojekte */}
                <div className="card-modern card-padding-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Reformen & Bauprojekte</h3>
                  </div>
                  <div className="space-y-4">
                    {augustusSidebar.reformenBauprojekte.map((item, idx) => (
                      <div key={`${item.title}-${item.year}`} className="pb-4 border-b border-border/40 last:border-0">
                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-[0.12em] mb-1">{formatYear(item.year)}</div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        {idx === 0 && (
                          <Link
                            to="/augustus/provinzreform"
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

        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Warum er polarisierte</h2>
              <p className="text-lg text-muted-foreground">Zwischen Friedensordnung und verschleierter Alleinherrschaft.</p>
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

        {/* Augustus' Vermächtnis */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Augustus' Vermächtnis</h2>
              <p className="text-lg text-muted-foreground">Der Begründer des Römischen Kaiserreichs und sein bleibendes Erbe.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  title: 'Res Gestae Divi Augusti',
                  summary: 'Sein autobiographischer Rechenschaftsbericht. Ein Meisterwerk der Propaganda, das seine Taten und Reformen dokumentiert.',
                  tag: 'Autobiographie',
                  years: '14 n. Chr.'
                },
                {
                  title: 'Pax Augusta',
                  summary: 'Die Augusteische Friedensordnung. 200 Jahre relativen Friedens nach einem Jahrhundert der Bürgerkriege.',
                  tag: 'Friedenspolitik',
                  years: '27 v. Chr.–14 n. Chr.'
                },
                {
                  title: 'Prinzipat',
                  summary: 'Die neue Regierungsform. Verschleierung der Monarchie durch republikanische Formen und Begriffe.',
                  tag: 'Regierungssystem',
                  years: '27 v. Chr.–14 n. Chr.'
                },
                {
                  title: 'Julianischer Kalender',
                  summary: 'Kalenderreform zur Korrektur des Schaltjahres. Die Grundlage unseres heutigen Kalendersystems.',
                  tag: 'Verwaltung',
                  years: '46 v. Chr.'
                },
                {
                  title: 'Bauprogramm',
                  summary: 'Umfassende Modernisierung Roms. Forum Augustum, Ara Pacis, Marodepanzer und Tempel.',
                  tag: 'Architektur',
                  years: '28 v. Chr.–14 n. Chr.'
                },
                {
                  title: 'Kulturelles Goldenes Zeitalter',
                  summary: 'Förderung von Vergil, Horaz, Ovid und Livius. Die augusteische Literaturblüte.',
                  tag: 'Kultur',
                  years: '27 v. Chr.–14 n. Chr.'
                }
              ].map((work, i) => (
                <div
                  key={work.title}
                  className="card-modern card-hover-primary card-padding-lg"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{work.tag}</span>
                    <BookOpen className="h-6 w-6 text-primary opacity-60" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{work.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-4">{work.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary/70">{work.years}</span>
                    {i === 0 && (
                      <Link
                        to="/augustus/works/res-gestae"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Werk lesen
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Augustus' Vermächtnis */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Das Vermächtnis des Augustus</h2>
              <p className="text-lg text-muted-foreground">Wie ein Mann Rom für 500 Jahre neu erfand.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  title: 'Res Gestae Divi Augusti',
                  summary: 'Sein autobiographischer Rechenschaftsbericht – in Bronze an seinem Mausoleum verewigt. Das wichtigste Zeugnis augusteischer Selbstdarstellung.',
                  tag: 'Literatur',
                  years: '14 n. Chr.'
                },
                {
                  title: 'Römisches Kaiserreich',
                  summary: 'Begründete ein System, das 500 Jahre überdauerte. Seine Verfassungsordnung blieb bis zum Ende Westroms im 5. Jahrhundert gültig.',
                  tag: 'Staatsform',
                  years: '27 v. Chr.–476 n. Chr.'
                },
                {
                  title: 'Pax Romana',
                  summary: '200 Jahre relativen Friedens im Imperium – direktes Ergebnis seiner Reformen. Wirtschaftsblüte, Handel und Kultur profitierten enorm.',
                  tag: 'Friedenszeit',
                  years: '27 v. Chr.–180 n. Chr.'
                },
                {
                  title: 'Kulturelles Goldenes Zeitalter',
                  summary: "Vergils Aeneis, Horaz' Oden, Ovids Metamorphosen – die größten Werke lateinischer Dichtung entstanden unter Augustus.",
                  tag: 'Literatur',
                  years: '30 v.–10 n. Chr.'
                },
                {
                  title: 'Städtebau & Architektur',
                  summary: '"Fand eine Stadt aus Ziegeln und hinterließ eine aus Marmor." Das Forum Augustum, Ara Pacis und zahllose Tempel prägten Rom für immer.',
                  tag: 'Architektur',
                  years: '28 v.–14 n. Chr.'
                },
                {
                  title: 'Vorbild für Kaiser',
                  summary: 'Alle römischen Kaiser nahmen sich Augustus zum Vorbild. Sein Titel "Augustus" wurde zum festen Bestandteil des Kaisertitels.',
                  tag: 'Nachfolge',
                  years: 'Bis 1453 n. Chr.'
                }
              ].map((work, i) => (
                <div
                  key={work.title}
                  className="card-modern card-hover-primary card-padding-lg"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{work.tag}</span>
                    <Scroll className="h-6 w-6 text-primary opacity-60" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{work.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-4">{work.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary/70">{work.years}</span>
                    {i === 0 && (
                      <Link
                        to="/augustus/works/res-gestae"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Werk lesen
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Augustus warum er polarisierte */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Augustus warum er polarisierte</h2>
              <p className="text-lg text-muted-foreground">Zwischen Friedensbringer und verschleierter Alleinherrscher.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {[
                {
                  heading: 'Warum er bewundert wird',
                  points: [
                    'Beendete ein Jahrhundert der Bürgerkriege und schuf 200 Jahre Frieden (Pax Augusta).',
                    'War ein brillanter Administrator und Modernisierer des Reiches.',
                    'Schuf ein stabiles Regierungssystem, das 300 Jahre funktionierte.',
                    'Fördererte ein kulturelles Goldenes Zeitalter mit Vergil und Horaz.',
                    'Modernisierte Rom zur Welthauptstadt mit monumentaler Architektur.'
                  ]
                },
                {
                  heading: 'Warum er kritisiert wird',
                  points: [
                    'Beendete die Republik und etablierte die Monarchie unter republikanischem Deckmantel.',
                    'Proskriptionslisten von 43 v. Chr.: Tausende Morde zur Machtsicherung.',
                    'Verbannte Ovid und kontrollierte die Kunst im Interesse der Staatsräson.',
                    'Verschleierte seine wahre Macht durch geschickte Propaganda und Titelsammlung.'
                  ]
                }
              ].map((block) => (
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

        {/* Augustus Weg zur Macht */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-4">Augustus' Weg zur Macht</h2>
              <p className="text-lg text-muted-foreground">Von Caesars Erbe zum ersten römischen Kaiser.</p>
            </div>
            <div className="max-w-6xl mx-auto">
              {/* Phase 1 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Aufstieg (44–31 v. Chr.)</span>
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
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">44 v. Chr.</span>
                    <h3 className="font-display text-2xl font-bold mb-3">Caesars Erbe</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Nach Caesars Ermordung nimmt Octavian dessen Namen und Erbe an. Konfrontation mit Marcus Antonius beginnt.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl hover:border-primary/30 transition-all group"
                  >
                    <div className="absolute top-4 right-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">43 v. Chr.</span>
                    <h3 className="font-display text-2xl font-bold mb-3">Zweites Triumvirat</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Bündnis mit Antonius und Lepidus. Proskriptionen besiegeln das Ende vieler Gegner, darunter Cicero.</p>
                  </motion.div>
                </div>
              </div>
              {/* Phase 2 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Actium (31 v. Chr.)</span>
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
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-3">2. September 31 v. Chr.</span>
                        <h3 className="font-display text-3xl font-bold mb-2">Schlacht bei Actium</h3>
                        <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Wendepunkt der Geschichte</p>
                      </div>
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <p className="text-base text-foreground/90 leading-relaxed mb-4">Die Seeschlacht gegen Antonius und Kleopatra entscheidet den Bürgerkrieg. Ägypten wird römische Provinz, Octavian unangefochtener Herrscher.</p>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 text-xs text-primary/80">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="font-semibold">Alleinherrschaft beginnt</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* Phase 3 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Prinzipat (27 v. Chr.–14 n. Chr.)</span>
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
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">27 v. Chr.</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">Augustus</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Senat verleiht den Ehrennamen "Augustus". Beginn der neuen Staatsordnung unter republikanischer Fassade.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Landmark className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">13 v. Chr.</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">Ara Pacis</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Der Friedensaltar wird geweiht. Symbol der Pax Augusta und des kulturellen Aufschwungs.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">14 n. Chr.</span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3">Tod in Nola</h3>
                    <p className="text-sm text-foreground/85 leading-relaxed">Nach 41 Jahren Herrschaft stirbt Augustus. Tiberius tritt die Nachfolge an.</p>
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
              <p className="text-lg text-muted-foreground">Worte, die das Prinzipat prägten.</p>
            </div>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: 'Inveni, si quid est in rebus in humanis, id quod mihi nomen est, homo sum.',
                  translation: 'Ich fand, dass, wenn es etwas im menschlichen Wesen gibt, was mir den Namen gibt, dann bin ich ein Mensch.',
                  when: 'Bei der Ankunft in Rom',
                  meaning: 'Selbstdefinition als Grundlage seiner politischen Identität und Mission.'
                },
                {
                  quote: 'Memento audere semper esse quod dicas.',
                  translation: 'Denke immer daran, dass du ein Sterblicher bist.',
                  when: 'An Tiberius',
                  meaning: 'Erinnerung an die eigene Sterblichkeit trotz aller Macht.'
                },
                {
                  quote: 'Velut longa, quae procul a nobis conspicitur, etiam si praesens, longa est.',
                  translation: 'Wie eine lange Schlange, die aus der Ferne gesehen wird, auch wenn sie nahe ist, ist sie lang.',
                  when: 'Über seine Macht',
                  meaning: 'Beschreibung seiner Autorität als unausweichlich und überwältigend.'
                }
              ].map((item) => (
                <div
                  key={item.quote}
                  className="card-modern card-hover-primary card-padding-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <Sparkles className="h-3.5 w-3.5" /> Weisheit
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

        {/* Feldzüge-Karte */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Augustus' Feldzüge</h2>
              <p className="text-lg text-muted-foreground">Vom Erben Caesars über Actium zum ersten römischen Kaiser.</p>
            </div>
            <div className="max-w-6xl mx-auto">
              <AugustusCampaignMap mapHeightClass="h-[520px] lg:h-[620px]" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
