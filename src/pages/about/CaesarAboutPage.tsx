import CaesarCampaignMap from '@/components/CaesarCampaignMap';
import { Footer } from '@/components/layout/Footer';
import { Calendar, MapPin, BookOpen, Award, ArrowLeft, Users, Scroll, Clock, ArrowRight, Sword, Map, Trophy, Landmark, Crown, Sparkles } from 'lucide-react';
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

export function CaesarAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { authorId } = useParams<{ authorId: string }>();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);
  const authorDetails = useAuthorDetails(t);
  const baseUrl = 'https://meum-diarium.xn--schner-2za.de';

  useEffect(() => {
    if (authorId === 'caesar') {
      setCurrentAuthor('caesar' as Author);
    } else {
      setCurrentAuthor(null);
    }
  }, [authorId, setCurrentAuthor]);

  useEffect(() => {
    async function loadAuthorContent() {
      if (!authorId) return;
      try {
        const response = await fetch(`/api/authors/${authorId}`);
        if (response.ok) {
          const data = await response.json();
          setAuthorPage(data);
          // Filter posts by this author
          if (Array.isArray(allPosts) && !postsLoading) {
            const filtered = allPosts.filter(post => post.author === authorId);
            setAuthorPosts(filtered.slice(0, 6));
          }
          // Filter works by this author
          const filteredWorks = baseWorks.filter(work => work.authorId === authorId);
          setAuthorWorks(filteredWorks);
        }
      } catch (error) {
        console.error('Failed to load author page:', error);
        setAuthorPage(null);
      }
    }
    loadAuthorContent();
  }, [authorId, allPosts, postsLoading]);

  const handleBackClick = () => {
    navigate('/about');
  };

  if (!authorId || !authors[authorId as Author]) {
    if (postsLoading) {
      return <div className="min-h-screen bg-background" />;
    }
    return <NotFound />;
  }

  const details = authorDetails;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <SEO
        title={authorInfo.name}
        description={authorInfo.description}
        author="Meum Diarium"
        image={`${baseUrl}/images/caesar-hero.jpg`}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": `${authorInfo.name} - Meum Diarium`,
          "description": authorInfo.description,
          "url": `${baseUrl}/authors/caesar`,
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
              "@type": "Person",
              "name": "Gaius Julius Caesar",
              "description": "Römischer Feldherr und Staatsmann",
              "url": `${baseUrl}/authors/caesar`
            },
            {
              "@type": "Thing",
              "name": "Römisches Reich",
              "description": "Das Imperium Romanum unter Caesar"
            }
          ]
        }}
        canonical={`${baseUrl}/authors/caesar`}
      />
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
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('works')}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {authorWorks.map((work, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:bg-card">
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {getTranslatedWork(work, language).title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {getTranslatedWork(work, language).date}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/works/${work.slug}`}>
                                <ArrowRight className="h-4 w-4" />
                                {t('readMore')}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Timeline Section */}
              {details.timeline && (
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <Clock className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('timeline')}</h2>
                  </div>
                  <div className="space-y-6">
                    {details.timeline.map((event, index) => (
                      <div key={index} className="flex gap-6 p-6 rounded-lg border border-border/50 bg-card/50">
                        <div className="flex-shrink-0 w-16 text-2xl font-bold text-primary">
                          {event.year}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                          <p className="text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Polarization Section */}
              {details.polarization && (
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <Users className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('caesar.polarization')}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {details.polarization.map((pol, index) => (
                      <div key={index} className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{pol.heading}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {pol.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                                {pointIndex + 1}
                              </div>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Campaigns Section */}
              {details.campaigns && (
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <Sword className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('caesar.campaigns')}</h2>
                  </div>
                  <div className="space-y-6">
                    <CaesarCampaignMap />
                  </div>
                </section>
              )}

              {/* Legacy Section */}
              {details.legacy && (
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <Crown className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('caesar.legacy')}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {details.legacy.map((item, index) => (
                      <div key={index} className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground mb-4">{item.description}</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {item.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-primary/50 flex-shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Posts */}
              {authorPosts.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <BookMarked className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-3xl font-bold">{t('recentPosts')}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {authorPosts.map((post) => (
                      <div key={post.slug} className="group">
                        <Link to={`/posts/${post.author}/${post.slug}`} className="block">
                          <div className="p-6 rounded-lg border border-border/50 bg-card/50 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:bg-card">
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {post.excerpt}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                <ArrowRight className="h-4 w-4" />
                                {t('readMore')}
                              </Button>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            </div>
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Quick Actions */}
                <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('quickActions')}</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/chat">
                        <Users className="h-4 w-4" />
                        {t('chatWithCaesar')}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/simulation">
                        <Landmark className="h-4 w-4" />
                        {t('timeTravel')}
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Author Navigation */}
                <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('otherAuthors')}</h3>
                  <div className="space-y-2">
                    {['cicero', 'augustus', 'seneca', 'catilina'].map((author) => (
                      <Button
                        key={author}
                        variant={authorId === author ? "default" : "outline"}
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to={`/about/${author}`}>
                          {t(author)}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
