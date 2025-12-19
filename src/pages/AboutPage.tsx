import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, MapPin, BookOpen, Award, ArrowLeft, Users, Scroll, Clock, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { authors as baseAuthors } from '@/data/authors';
import { works as baseWorks } from '@/data/works';
import slugify from 'slugify';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { Author, AuthorInfo, BlogPost, Work } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthors, getTranslatedAuthor, getTranslatedPost, getTranslatedWork } from '@/lib/translator';
import { usePosts } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { PageContent, PageLanguage } from '@/types/page';

const useAuthorDetails = (t: (key: string) => string) => ({
  caesar: {
    birthPlace: t('caesar_birthplace'),
    achievements: [
      t('caesar_achievement_0'),
      t('caesar_achievement_1'),
      t('caesar_achievement_2'),
      t('caesar_achievement_3'),
    ],
    timeline: [
      { year: t('caesar_timeline_0_year'), event: t('caesar_timeline_0_event') },
      { year: t('caesar_timeline_1_year'), event: t('caesar_timeline_1_event') },
      { year: t('caesar_timeline_2_year'), event: t('caesar_timeline_2_event') },
      { year: t('caesar_timeline_3_year'), event: t('caesar_timeline_3_event') },
      { year: t('caesar_timeline_4_year'), event: t('caesar_timeline_4_event') },
    ],
  },
  cicero: {
    birthPlace: t('cicero_birthplace'),
    achievements: [
      t('cicero_achievement_0'),
      t('cicero_achievement_1'),
      t('cicero_achievement_2'),
      t('cicero_achievement_3'),
    ],
    timeline: [
      { year: t('cicero_timeline_0_year'), event: t('cicero_timeline_0_event') },
      { year: t('cicero_timeline_1_year'), event: t('cicero_timeline_1_event') },
      { year: t('cicero_timeline_2_year'), event: t('cicero_timeline_2_event') },
      { year: t('cicero_timeline_3_year'), event: t('cicero_timeline_3_event') },
    ],
  },
  augustus: {
    birthPlace: t('augustus_birthplace'),
    achievements: [
      t('augustus_achievement_0'),
      t('augustus_achievement_1'),
      t('augustus_achievement_2'),
      t('augustus_achievement_3'),
    ],
    timeline: [
      { year: t('augustus_timeline_0_year'), event: t('augustus_timeline_0_event') },
      { year: t('augustus_timeline_1_year'), event: t('augustus_timeline_1_event') },
      { year: t('augustus_timeline_2_year'), event: t('augustus_timeline_2_event') },
      { year: t('augustus_timeline_3_year'), event: t('augustus_timeline_3_event') },
      { year: t('augustus_timeline_4_year'), event: t('augustus_timeline_4_event') },
      { year: t('augustus_timeline_5_year'), event: t('augustus_timeline_5_event') },
    ],
  },
  seneca: {
    birthPlace: t('seneca_birthplace'),
    achievements: [
      t('seneca_achievement_0'),
      t('seneca_achievement_1'),
      t('seneca_achievement_2'),
      t('seneca_achievement_3'),
    ],
    timeline: [
      { year: t('seneca_timeline_0_year'), event: t('seneca_timeline_0_event') },
      { year: t('seneca_timeline_1_year'), event: t('seneca_timeline_1_event') },
      { year: t('seneca_timeline_2_year'), event: t('seneca_timeline_2_event') },
      { year: t('seneca_timeline_3_year'), event: t('seneca_timeline_3_event') },
      { year: t('seneca_timeline_4_year'), event: t('seneca_timeline_4_event') },
    ],
  },
});

function GeneralAboutPage() {
  const { setCurrentAuthor } = useAuthor();
  const { language, t } = useLanguage();
  const [authors, setAuthors] = useState(baseAuthors);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  const pageTranslation = useMemo(() => {
    const lang = language as PageLanguage;
    return pageContent?.translations?.[lang];
  }, [language, pageContent]);

  const heroTitle = pageTranslation?.heroTitle || pageContent?.heroTitle || t('aboutProject');
  const heroSubtitle = pageTranslation?.heroSubtitle || pageContent?.heroSubtitle || t('interactiveLearning');
  const projectDescription = pageTranslation?.projectDescription || pageContent?.projectDescription || t('projectDescription');

  const defaultHighlights = useMemo(() => ([
    { icon: BookOpen, title: t('twoPerspectives'), desc: t('diaryAndScientific') },
    { icon: Users, title: t('fourAuthors'), desc: t('caesarCiceroAugustusSeneca') },
    { icon: Clock, title: t('yearsOfHistory'), desc: t('historyToExperience') },
    { icon: Scroll, title: t('authentic'), desc: t('historicallySound') },
  ]), [t]);

  const customHighlights = pageTranslation?.highlights || pageContent?.highlights;
  const highlights = customHighlights && customHighlights.length > 0
    ? customHighlights.map((item, index) => ({
      icon: defaultHighlights[index]?.icon || BookOpen,
      title: item.title,
      desc: item.description,
    }))
    : defaultHighlights;

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  useEffect(() => {
    async function translate() {
      const translated = await getTranslatedAuthors(language);
      setAuthors(translated);
    }
    translate();
  }, [language]);

  useEffect(() => {
    async function fetchPageContent() {
      try {
        const res = await fetch('/api/pages/about');
        if (res.ok) {
          const data: PageContent = await res.json();
          setPageContent(data);
        }
      } catch (error) {
        console.error('Failed to load page content', error);
      }
    }
    fetchPageContent();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        {/* Immersive Hero Section */}
        <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background z-10" />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
            <img
              src="https://images.unsplash.com/photo-1510214614611-66795499252a?q=80&w=2070&auto=format&fit=crop"
              alt="Ancient Library"
              className="w-full h-full object-cover scale-110 blur-sm"
            />
          </div>

          <div className="container mx-auto relative z-20 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tighter">
                {heroTitle}
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
                {heroSubtitle}
              </p>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20" />
        </section>

        {/* Highlights Section - More Artistic */}
        <section className="py-32 relative">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic opacity-80">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story & Authors Split Section */}
        <section className="py-32 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-20 items-start">
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="prose-blog max-w-none"
                >
                  <h2 className="font-display text-5xl font-bold mb-10">{t('theProject')}</h2>
                  <div className="space-y-8 text-xl text-muted-foreground leading-relaxed font-light">
                    <p dangerouslySetInnerHTML={{ __html: projectDescription }} className="text-foreground/90 font-medium" />
                    <div>
                      <h3 className="text-primary font-display text-3xl font-bold mb-4">{t('thePerspectives')}</h3>
                      <p dangerouslySetInnerHTML={{ __html: t('diaryPerspective') }} className="mb-4" />
                      <p dangerouslySetInnerHTML={{ __html: t('scientificPerspective') }} />
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-5">
                <div className="sticky top-32 space-y-12">
                  <div>
                    <h2 className="font-display text-4xl font-bold mb-8 italic text-primary">{t('theAuthors')}</h2>
                    <p className="text-lg text-muted-foreground mb-10">{t('discoverAuthors')}</p>

                    <div className="space-y-6">
                      {Object.values(authors).map((author, i) => (
                        <motion.div
                          key={author.id}
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Link
                            to={`/${author.id}/about`}
                            onClick={() => setCurrentAuthor(author.id as Author)}
                            className="group flex items-center gap-6 p-6 rounded-3xl bg-background border border-border/40 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1"
                          >
                            <div className="h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0 border border-border/40 group-hover:border-primary/50 transition-colors">
                              <img src={author.heroImage} alt={author.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            </div>
                            <div>
                              <h4 className="font-display text-2xl font-bold group-hover:text-primary transition-colors italic">{author.name}</h4>
                              <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold opacity-60">{author.years}</p>
                            </div>
                            <ArrowRight className="ml-auto h-6 w-6 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function AuthorAboutPage() {
  const { setCurrentAuthor } = useAuthor();
  const { authorId } = useParams<{ authorId: string }>();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();

  const [authorInfo, setAuthorInfo] = useState<AuthorInfo | null>(null);
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);

  const authorDetails = useAuthorDetails(t);

  useEffect(() => {
    if (authorId) {
      setCurrentAuthor(authorId as Author);
      async function translateContent() {
        const translatedAuthor = await getTranslatedAuthor(language, authorId as Author);
        setAuthorInfo(translatedAuthor);

        if (!postsLoading) {
          const translatedPosts = await Promise.all(
            allPosts.filter(p => p.author === authorId).slice(0, 3).map(p => getTranslatedPost(language, p.author, p.slug))
          );
          setAuthorPosts(translatedPosts.filter((p): p is BlogPost => p !== null));
        }

        const translatedWorks = await Promise.all(
          Object.values(baseWorks).filter(w => w.author === authorId).map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
        );
        setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));
      }
      translateContent();
    } else {
      setCurrentAuthor(null);
    }
  }, [authorId, setCurrentAuthor, language, allPosts, postsLoading]);

  if (!authorId || !authorInfo) {
    return <GeneralAboutPage />;
  }

  const details = authorDetails[authorId as keyof typeof authorDetails];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        {/* Cinematic Author Hero */}
        <section className="relative h-[60vh] min-h-[500px] flex items-end overflow-hidden">
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
                {authorInfo.name}
              </h1>
              <p className="text-2xl sm:text-3xl text-muted-foreground font-display italic mb-6">
                {authorInfo.title}
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/60">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{details?.birthPlace}</span>
                </div>
                <div className="h-1 w-12 bg-primary/30 rounded-full" />
                <p className="text-lg text-muted-foreground max-w-xl font-light leading-relaxed">
                  {authorInfo.description}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="grid gap-20 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-24">

              {/* Works Section as Interactive Cards */}
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
                        to={`/${authorId}/works/${slugify(work.title, { lower: true, strict: true })}`}
                        className="group relative bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-8 transition-all duration-500 hover:border-primary/40 hover:-translate-y-1 overflow-hidden block"
                      >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

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

              {/* Achievements - Redesigned */}
              {details?.achievements && (
                <section>
                  <div className="flex items-center gap-6 mb-12">
                    <h2 className="font-display text-4xl font-bold">{t('achievements')}</h2>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {details.achievements.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-6 p-8 rounded-3xl bg-secondary/10 border border-border/40 hover:border-primary/20 transition-all group"
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-display font-bold text-primary group-hover:scale-110 transition-transform">
                          {i + 1}
                        </span>
                        <span className="text-lg text-foreground/80 leading-relaxed font-light italic">{item}</span>
                      </motion.div>
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
                      <Link to={`/${authorId}`}>
                        {t('viewAllEntries')} <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {authorPosts.map((post) => (
                      <Link key={post.id} to={`/${post.author}/${post.slug}`} className="block group">
                        <article className="relative bg-card/30 hover:bg-card/60 rounded-3xl p-8 border border-border/40 hover:border-primary/20 transition-all duration-500 overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h3 className="font-display text-2xl font-bold group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-2 rounded-full whitespace-nowrap">
                              {post.historicalDate}
                            </span>
                          </div>
                          <p className="text-lg text-muted-foreground line-clamp-2 font-light italic opacity-80">{post.excerpt}</p>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Timeline */}
            <div className="lg:col-span-4">
              <div className="sticky top-32">
                {details?.timeline && (
                  <div className="rounded-3xl border border-border/40 bg-card/20 backdrop-blur-3xl p-8 md:p-10">
                    <h3 className="font-display text-3xl font-bold mb-10 flex items-center gap-4">
                      <Clock className="h-8 w-8 text-primary" />
                      {t('timeline')}
                    </h3>
                    <div className="relative pl-4 space-y-12">
                      <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
                      {details.timeline.map((item, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full border-2 border-primary bg-primary" />
                          <div className="flex flex-col">
                            <span className="text-primary font-bold text-lg mb-1 tracking-tighter">{item.year}</span>
                            <span className="text-foreground/70 font-light leading-relaxed italic">{item.event}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function AboutPage() {
  const { authorId } = useParams<{ authorId: string }>();

  if (authorId && baseAuthors[authorId as Author]) {
    return <AuthorAboutPage />;
  }

  return <GeneralAboutPage />;
}
