import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { MapPin, BookOpen, ArrowRight, Users, Scroll, Clock, Award, Sparkles, Landmark, Calendar } from 'lucide-react';
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
import senecaPageData from '@/content/pages/author-about-seneca.json';

export function SenecaAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);
  const authorDetails = useAuthorDetails(t);
  const baseUrl = 'https://meum-diarium.xn--schner-2za.de';

  useEffect(() => {
    setCurrentAuthor('seneca' as Author);

    async function translateContent() {
      setAuthorPage(senecaPageData as PageContent);

      if (!postsLoading && allPosts.length > 0) {
        const authorPostsList = allPosts.filter(p => p.author === 'seneca').slice(0, 3);
        setAuthorPosts(authorPostsList);
      }

      const translatedWorks = await Promise.all(
        Object.values(baseWorks).filter(w => w.author === 'seneca').map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
      );
      setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));
    }
    translateContent();
  }, [setCurrentAuthor, language, allPosts, postsLoading]);

  if (!authorInfo) {
    return null;
  }

  const details = authorDetails.seneca;
  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return '—';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`;
  };

  const senecaSnapshots = [
    { label: 'Lebenszeit', value: '~4 v.–65 n. Chr.', hint: 'ca. 69 Jahre' },
    { label: 'Geburtsort', value: 'Corduba', hint: 'Hispania Baetica' },
    { label: 'Berater Neros', value: '54–62 n. Chr.', hint: 'Einfluss auf Regentschaft' },
    { label: 'Epistulae', value: '124 Briefe', hint: 'An Lucilius Iunior' },
    { label: 'Tragödien', value: '9 erhalten', hint: 'Medea, Thyestes u. a.' },
    { label: 'Tod', value: '65 n. Chr.', hint: 'Zwang zum Selbstmord' },
  ];

  const senecaTimeline = [
    { year: -4, title: 'Geburt in Corduba', description: 'Als Sohn des Rhetorikers Seneca d. Ä. in der hispanischen Provinz Baetica geboren.', icon: Users },
    { year: 1, title: 'Ausbildung in Rom', description: 'Philosophische Studien bei Stoikern, Pythagoräern und Attalus. Frühe rhetorische Ausbildung.', icon: BookOpen },
    { year: 37, title: 'Erste Erfolge', description: 'Berühmter Redner und Schriftsteller unter Kaiser Caligula. Fast auf Geheiß Caligulas getötet.', icon: Award },
    { year: 41, title: 'Verbannung auf Korsika', description: 'Auf Betreiben von Messalina verbannt – 8 Jahre auf Korsika. Schreibt Consolationes.', icon: MapPin },
    { year: 49, title: 'Rückkehr als Erzieher Neros', description: 'Agrippina holt ihn zurück als Lehrer ihres Sohnes Nero. Aufstieg zur Macht.', icon: Landmark },
    { year: 54, title: 'Berater Kaiser Neros', description: 'Mit Burrus gemeinsam führende Kraft im Prinzipat. Schreibt De Clementia.', icon: Award },
    { year: 62, title: 'Rückzug aus der Politik', description: 'Verliert Einfluss, zieht sich zurück. Verfasst die Epistulae Morales und Naturales Quaestiones.', icon: Scroll },
    { year: 65, title: 'Erzwungener Tod', description: 'Nach der Pisonischen Verschwörung zum Selbstmord gezwungen. Starb gelassen als Stoiker.', icon: Clock },
  ];

  const senecaAchievements = [
    {
      title: 'Stoische Lebensweisheit',
      summary: 'In den 124 Epistulae Morales an Lucilius destillierte er die stoische Philosophie auf praktische Alltagsethik herunter. Themen wie Zeit, Tod, Freundschaft und Seelenruhe werden mit eindringlicher Tiefe behandelt.',
      tag: 'Philosophie',
      icon: 'BookOpen' as const,
    },
    {
      title: 'De Brevitate Vitae',
      summary: '"Das Leben ist kurz, aber wir machen es noch kürzer." Senecas berühmtester Essay lehrt, wie man Zeit richtig nutzt und sich von sinnlosen Beschäftigungen befreit. Ein zeitloser Klassiker der Selbstoptimierungsliteratur.',
      tag: 'Essay',
      icon: 'Clock' as const,
    },
    {
      title: 'Berater und Staatsmann',
      summary: 'Als Erzieher und Berater Neros war er 8 Jahre lang de facto Mitregent des Imperiums. Mit Burrus sicherte er eine relative Stabilität in Neros frühen Regierungsjahren (Quinquennium Neronis).',
      tag: 'Politik',
      icon: 'Landmark' as const,
    },
    {
      title: 'Tragödiendichter',
      summary: 'Neun erhaltene lateinische Tragödien (Medea, Thyestes, Phaedra u. a.) – nicht für die Bühne, sondern zum Vorlesen konzipiert. Einfluss auf Shakespeare und das europäische Drama ist enorm.',
      tag: 'Literatur',
      icon: 'Scroll' as const,
    },
    {
      title: 'Naturales Quaestiones',
      summary: 'Umfassendes naturwissenschaftliches Werk über Erdbeben, Blitze, Wasser und Himmelsphänomene. Verknüpft Naturforschung mit stoischer Ethik – Naturbeobachtung als Weg zur Tugend.',
      tag: 'Wissenschaft',
      icon: 'Sparkles' as const,
    },
    {
      title: 'Philosophie als Trost',
      summary: 'Seine Consolationes (an Marcia, an seine Mutter Helvia, an Polybius) sind Meisterwerke des Trostbriefes. Philosophie als praktisches Hilfsmittel gegen Schmerz, Verlust und Angst.',
      tag: 'Seelsorge',
      icon: 'Award' as const,
    },
  ];

  const senecaDebate = [
    {
      heading: 'Warum er bewundert wird',
      points: [
        'Einer der tiefgründigsten Moralphilosophen der Antike – seine Weisheit hat universelle Gültigkeit.',
        'Meisterhafter Stilist: Sein "neuer Stil" (genus humile) – kurze, prägnante Sätze – revolutionierte die lateinische Prosa.',
        'Verband abstrakte Philosophie mit konkreter Lebensführung: Philosophie als ars vivendi.',
        'Trotz Verbannung und politischem Druck blieb er produktiv und geistig ungebrochen.',
      ],
    },
    {
      heading: 'Warum er kritisiert wird',
      points: [
        'Widerspruch zwischen Lehre und Leben: Predigte Armut, häufte aber ein gigantisches Vermögen an.',
        'Mitschuld am Tod der Britannicus und Agrippina – bis heute historisch umstritten.',
        'Schrieb schmeichelhafte Werke für Claudius und Nero, um sich Gunst zu sichern.',
        'Rückzug statt Widerstand: Verließ lieber die Politik, als Nero offen entgegenzutreten.',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <SEO
        title={`${authorInfo.name} – Stoischer Philosoph und Staatsmann`}
        description={authorInfo.description}
        author={authorInfo.name}
        image={`${baseUrl}/images/seneca-hero.jpg`}
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
                        to={`/seneca/works/${slugify(work.title, { lower: true, strict: true })}`}
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
                  {senecaSnapshots.map((snap, i) => (
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
                  {senecaAchievements.map((ach, i) => {
                    const iconMap = { BookOpen, Clock, Landmark, Scroll, Sparkles, Award };
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
                  {senecaTimeline.map((event, i) => {
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
                  <h2 className="font-display text-4xl font-bold">Seneca in der Debatte</h2>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {senecaDebate.map((side, i) => (
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
                      <Link key={post.slug} to={`/seneca/${post.slug}`} className="group">
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
                    <Link to="/seneca">
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
                    { dt: 'Geburt', dd: '~4 v. Chr. in Corduba (Hispania)' },
                    { dt: 'Tod', dd: '65 n. Chr. in Rom (Selbstmord)' },
                    { dt: 'Schule', dd: 'Jüngere Stoa' },
                    { dt: 'Meister', dd: 'Attalus, Papirius Fabianus' },
                    { dt: 'Amt', dd: 'Quaestor, Berater Neros' },
                    { dt: 'Hauptwerke', dd: 'Epistulae Morales, De Brevitate Vitae, Naturales Quaestiones' },
                  ].map(({ dt, dd }) => (
                    <div key={dt} className="flex gap-2">
                      <dt className="text-muted-foreground min-w-24">{dt}</dt>
                      <dd className="font-medium">{dd}</dd>
                    </div>
                  ))}
                </dl>
                <hr className="border-border" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Kernzitat</div>
                  <blockquote className="text-sm italic text-muted-foreground leading-relaxed border-l-2 border-primary pl-3">
                    „Dum differtur vita transcurrit." <span className="not-italic">(Solange man aufschiebt, vergeht das Leben.)</span>
                  </blockquote>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/seneca">
                    <Button className="w-full gap-2">
                      Tagebuch lesen
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/seneca/chat">
                    <Button variant="outline" className="w-full gap-2">
                      Mit Seneca sprechen
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
