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
    return null;
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
        image={`${baseUrl}/images/augustus-hero.jpg`}
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
                          {work.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {work.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Key Facts */}
              <section>
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="font-display text-4xl font-bold">Auf einen Blick</h2>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {augustusSnapshots.map((snap, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-card rounded-2xl p-5 border border-border"
                    >
                      <div className="text-xs text-muted-foreground mb-1">{snap.label}</div>
                      <div className="text-xl font-bold text-foreground mb-1">{snap.value}</div>
                      <div className="text-xs text-muted-foreground">{snap.hint}</div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Achievements */}
              <section>
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="font-display text-4xl font-bold">Bedeutung & Leistungen</h2>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  {augustusAchievements.map((ach, i) => {
                    const iconMap = { Crown, Award, Landmark, Users, BookOpen, Scroll };
                    const Icon = iconMap[ach.icon];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="card-modern card-padding-lg space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                          <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">{ach.tag}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold">{ach.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{ach.summary}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* Timeline */}
              <section>
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="font-display text-4xl font-bold">Lebensweg</h2>
                  <div className="h-px flex-1 bg-white/5" />
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
              </section>

              {/* Discussion */}
              <section>
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="font-display text-4xl font-bold">Augustus in der Debatte</h2>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {augustusDebate.map((side, i) => (
                    <div key={i} className="card-modern card-padding-lg space-y-4">
                      <h3 className="font-display text-xl font-bold">{side.heading}</h3>
                      <ul className="space-y-2">
                        {side.points.map((point, j) => (
                          <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                            <span className="text-primary mt-1 flex-shrink-0">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Posts */}
              {authorPosts.length > 0 && (
                <section>
                  <div className="flex items-center gap-6 mb-12">
                    <h2 className="font-display text-4xl font-bold">Neueste Einträge</h2>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {authorPosts.map((post, i) => (
                      <Link key={post.slug} to={`/augustus/${post.slug}`} className="group">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="card-modern overflow-hidden group-hover:border-primary/40 transition-colors"
                        >
                          {post.coverImage && (
                            <div className="aspect-video overflow-hidden">
                              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                          )}
                          <div className="p-5">
                            <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Link to="/augustus">
                      <Button className="gap-2">
                        Alle Einträge lesen
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="card-modern card-padding-lg sticky top-24 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">Biographische Daten</span>
                </div>
                <dl className="space-y-3 text-sm">
                  {[
                    { dt: 'Geburt', dd: '23. September 63 v. Chr.' },
                    { dt: 'Geburtsort', dd: 'Rom (Velitrae)' },
                    { dt: 'Tod', dd: '19. August 14 n. Chr., Nola' },
                    { dt: 'Titel', dd: 'Augustus, Princeps, Pater Patriae, Pontifex Maximus' },
                    { dt: 'Vater', dd: 'Gaius Octavius (adoptiert: Julius Caesar)' },
                    { dt: 'Nachfolger', dd: 'Tiberius' },
                  ].map(({ dt, dd }) => (
                    <div key={dt} className="flex gap-2">
                      <dt className="text-muted-foreground min-w-24">{dt}</dt>
                      <dd className="font-medium">{dd}</dd>
                    </div>
                  ))}
                </dl>
                <hr className="border-border" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Wichtige Reformen</div>
                  <ul className="space-y-2">
                    {augustusSidebar.reformList.map((r, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-primary font-bold min-w-12">{formatYear(r.year)}</span>
                        <span className="text-muted-foreground">{r.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <hr className="border-border" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Kernzitat</div>
                  <blockquote className="text-sm italic text-muted-foreground leading-relaxed border-l-2 border-primary pl-3">
                    „Festina lente." <span className="not-italic">(Eile mit Weile.)</span>
                  </blockquote>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/augustus">
                    <Button className="w-full gap-2">
                      Tagebuch lesen
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/augustus/chat">
                    <Button variant="outline" className="w-full gap-2">
                      Mit Augustus sprechen
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
