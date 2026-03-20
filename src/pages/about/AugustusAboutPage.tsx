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

export function AugustusAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);
  const authorDetails = useAuthorDetails(t);
  const baseUrl = 'https://meum-diarium.xn--schner-2za.de';

  useEffect(() => {
    setCurrentAuthor('augustus' as Author);

    async function translateContent() {
      setAuthorPage(augustusPageData as PageContent);

      if (!postsLoading && allPosts.length > 0) {
        const authorPostsList = allPosts.filter(p => p.author === 'augustus').slice(0, 3);
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
    reformList: [
      { year: -27, note: 'Neuordnung der Provinzen (Senats- vs. Kaiserprov.)' },
      { year: -23, note: 'Tribunizische Gewalt auf Lebenszeit' },
      { year: -18, note: 'Moralgesetzgebung (Ehegesetze, lex Iulia)' },
      { year: -13, note: 'Pontifex Maximus (religiöse Obergewalt)' },
      { year: -12, note: 'Ara Pacis Augustae geweiht' },
      { year: -2, note: 'Pater Patriae – Titel "Vater des Vaterlandes"' },
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
                  <div className="grid gap-6 md:grid-cols-2">
                    {authorPosts.map((post, i) => (
                      <Link key={post.slug} to={`/augustus/${post.slug}`} className="group h-full">
                        <motion.article
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="card-modern card-hover-primary card-padding-md relative h-full overflow-hidden"
                        >
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
                  <p className="text-lg text-muted-foreground mt-2">Vom Erben Caesars zum ersten Princeps.</p>
                </div>
              </div>
              <div className="space-y-4">
                {augustusTimeline.map((event, i) => {
                  const Icon = event.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
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
              <h2 className="font-display text-4xl font-bold mb-4">Augustus in der Debatte</h2>
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

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Reformlinien des Prinzipats</h2>
              <p className="text-lg text-muted-foreground">Institutionelle Eingriffe, die das Imperium langfristig prägten.</p>
            </div>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
              {augustusSidebar.reformList.map((item, i) => (
                <div key={i} className="card-modern card-hover-primary card-padding-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <Sparkles className="h-3.5 w-3.5" /> Reform
                    </span>
                    <span className="text-xs font-semibold text-primary/70">{formatYear(item.year)}</span>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">{item.note}</p>
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
