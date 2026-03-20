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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Lade Inhalte...
      </div>
    );
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
        image={`${baseUrl}/images/seneca-hero.png`}
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
                      <Link key={post.slug} to={`/seneca/${post.slug}`} className="group h-full">
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
                      <Link to="/seneca">
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
                    {senecaSnapshots.map((item) => (
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
              <p className="text-lg text-muted-foreground">Stoische Ethik, politische Praxis und literarische Wirkung im Spannungsfeld der Kaiserzeit.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {senecaAchievements.map((achievement) => {
                const IconComponent = achievement.icon === 'BookOpen' ? BookOpen : achievement.icon === 'Clock' ? Clock : achievement.icon === 'Landmark' ? Landmark : achievement.icon === 'Scroll' ? Scroll : achievement.icon === 'Sparkles' ? Sparkles : Award;
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
                  <p className="text-lg text-muted-foreground mt-2">Verbannung, Hofpolitik und philosophischer Rückzug.</p>
                </div>
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
              <h2 className="font-display text-4xl font-bold mb-4">Seneca in der Debatte</h2>
              <p className="text-lg text-muted-foreground">Zwischen moralischer Autorität und politischem Widerspruch.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {senecaDebate.map((block) => (
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
      </main>
      <Footer />
    </div>
  );
}
