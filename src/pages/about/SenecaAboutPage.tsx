import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, MapPin, BookOpen, Award, ArrowLeft, Users, Scroll, Clock, ArrowRight, Brain, Book, Trophy, Landmark, Feather, Sparkles } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
import { authors } from '@/data/authors';
import senecaPageData from '@/content/pages/author-about-seneca.json';

export function SenecaAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);
  const authorDetails = useAuthorDetails(t);
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schner-2za.de';
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentAuthor('seneca' as Author);

    async function loadAuthorContent() {
      try {
        // Use local JSON data directly
        setAuthorPage(senecaPageData as PageContent);

        // Filter posts by this author
        if (Array.isArray(allPosts) && !postsLoading && allPosts.length > 0) {
          const filtered = allPosts.filter(post => post.author === 'seneca');
          setAuthorPosts(filtered.slice(0, 6));
        }
        // Filter works by this author
        const filteredWorks = Object.values(baseWorks).filter((work: Work) => work.author === 'seneca');
        setAuthorWorks(filteredWorks);
      } catch (error) {
        console.error('Failed to load author page:', error);
        setAuthorPage(null);
      }
    }
    loadAuthorContent();
  }, [setCurrentAuthor, allPosts, postsLoading]);


  const handleBackClick = () => {
    navigate('/about');
  };

  if (!authorInfo || authorInfo.id !== 'seneca') {
    if (postsLoading) {
      return <div className="min-h-screen bg-background" />;
    }
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Seite nicht gefunden</h1>
        <p className="text-muted-foreground">Der angeforderte Autor wurde nicht gefunden.</p>
        <Button onClick={() => navigate('/about')} className="mt-4">
          Zurück zur Übersicht
        </Button>
      </div>
    </div>;
  }

  const details = authorDetails;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <SEO
        title={authorInfo.name}
        description={authorInfo.description}
        author="Meum Diarium"
        image={`${baseUrl}/images/seneca-hero.jpg`}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": `${authorInfo.name} - Meum Diarium`,
          "description": authorInfo.description,
          "url": `${baseUrl}/authors/seneca`,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required"
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Stoische Philosophie",
              "description": "Die Lehren der stoischen Schule"
            },
            {
              "@type": "Thing",
              "name": "Römische Philosophie",
              "description": "Philosophische Werke aus dem alten Rom"
            }
          ]
        }}
        canonical={`${baseUrl}/authors/seneca`}
      />
      <main className="flex-1">
        <AuthorAboutHero authorInfo={authorInfo} authorPage={authorPage} language={language} birthPlace={details.seneca.birthPlace} />

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Biography Section */}
              <section className="prose prose-lg max-w-none">
                <h2 className="font-display text-3xl font-bold mb-6 text-foreground">
                  {t('seneca.biography.title')}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Lucius Annaeus Seneca, bekannt als Seneca der Jüngere, wurde um 4 v. Chr. in Córdoba, Hispanien, geboren.
                    Als einer der bedeutendsten stoischen Philosophen und Dramatiker des römischen Reiches prägte er das
                    philosophische Denken seiner Zeit nachhaltig.
                  </p>
                  <p>
                    Seneca war Berater des Kaisers Nero und erlebte die politischen Intrigen Roms aus nächster Nähe.
                    Seine Werke über Ethik, Moral und das menschliche Leiden sind bis heute von relevanter Bedeutung für
                    die moderne Philosophie und Psychologie.
                  </p>
                  <p>
                    65 n. Chr. wurde Seneca von Nero zum Selbstmord gezwungen, ein Ende, das er mit stoischer Gelassenheit
                    annahm und damit seine philosophischen Überzeugungen bis zum letzten Augenblick bewies.
                  </p>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                  <Link
                    to="/timeline"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    {t('seneca.biography.fullTimeline')}
                  </Link>
                </div>
              </section>

              {/* Philosophy Section */}
              <section>
                <h2 className="font-display text-3xl font-bold mb-6 text-foreground">
                  Stoische Philosophie
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-modern card-hover-primary card-padding-lg"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">ETHIK</span>
                      <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                        ⚡ Sofort anwendbar
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">Tugend und Moral</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Seneca lehrte, dass wahres Glück in der Tugend liegt und nicht in äußeren Gütern.
                      Die stoische Ethik fordert ein Leben im Einklang mit der Natur und der Vernunft.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-modern card-hover-primary card-padding-lg"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">PRAKTISCH</span>
                      <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                        ↗ Langfristig wirkend
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">Bewältigung des Leids</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Seine Schriften über Angst, Zorn und Trauer bieten praktische Anleitungen zur
                      Bewältigung menschlicher Emotionen und zur Erreichung innerer Ruhe.
                    </p>
                  </motion.div>
                </div>
              </section>

              {/* Works Section */}
              <section>
                <h2 className="font-display text-3xl font-bold mb-6 text-foreground">
                  {t('seneca.works.title')}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {authorWorks.map((work, index) => (
                    <motion.div
                      key={work.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card-modern card-hover-secondary card-padding-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-bold mb-2">{work.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                            {work.summary}
                          </p>
                          <Link
                            to={`/seneca/works/${slugify(work.title, { lower: true, strict: true })}`}
                            className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors text-sm font-medium"
                          >
                            {t('seneca.works.readMore')}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Recent Posts */}
              <section>
                <h2 className="font-display text-3xl font-bold mb-6 text-foreground">
                  {t('seneca.posts.title')}
                </h2>
                <div className="grid gap-6">
                  {authorPosts.map((post, index) => (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card-modern card-hover-accent card-padding-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent/10 rounded-lg text-accent">
                          <Scroll className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                              {post.historicalYear || t('seneca.posts.untagged')}
                            </span>
                            {post.date && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(post.date).toLocaleDateString(language)}
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-xl font-bold mb-2">{post.title}</h3>
                          <p className="text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <Link
                            to={`/seneca/${post.slug}`}
                            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
                          >
                            {t('seneca.posts.readMore')}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Quick Facts */}
              <div className="card-modern card-padding-lg">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t('seneca.quickFacts.title')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{t('seneca.quickFacts.birth')}</div>
                      <div className="text-xs text-muted-foreground">4 v. Chr., Córdoba</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{t('seneca.quickFacts.death')}</div>
                      <div className="text-xs text-muted-foreground">65 n. Chr., Rom</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{t('seneca.quickFacts.role')}</div>
                      <div className="text-xs text-muted-foreground">{t('seneca.quickFacts.roles')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{t('seneca.quickFacts.school')}</div>
                      <div className="text-xs text-muted-foreground">{t('seneca.quickFacts.stoicism')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Works */}
              <div className="card-modern card-padding-lg">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-secondary" />
                  Hauptwerke
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-muted-foreground">De Brevitate Vitae (Von der Kürze des Lebens)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-muted-foreground">De Clementia (Von der Milde)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-muted-foreground">Moralische Briefe an Lucilius</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-muted-foreground">De Tranquillitate Animi (Von der Seelenruhe)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-muted-foreground">Medea (Tragödie)</span>
                  </div>
                </div>
              </div>

              {/* Legacy */}
              <div className="card-modern card-padding-lg">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-accent" />
                  {t('seneca.legacy.title')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('seneca.legacy.description')}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
