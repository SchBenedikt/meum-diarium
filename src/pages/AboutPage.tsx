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
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="py-16 pt-32 hero-gradient">
          <div className="container mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl mb-4">
              {heroTitle}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {heroSubtitle}
            </motion.p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {highlights.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-border">
          <div className="container mx-auto max-w-3xl">
            <div className="prose-blog">
              <h2>{t('theProject')}</h2>
              <p dangerouslySetInnerHTML={{ __html: projectDescription }} />
              <h2>{t('thePerspectives')}</h2>
              <p dangerouslySetInnerHTML={{ __html: t('diaryPerspective') }} />
              <p dangerouslySetInnerHTML={{ __html: t('scientificPerspective') }} />
              <h2>{t('theAuthors')}</h2>
              <p>{t('discoverAuthors')}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              {Object.values(authors).map((author) => (
                <Link key={author.id} to={`/${author.id}/about`} onClick={() => setCurrentAuthor(author.id as Author)} className="group flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-all duration-300 hover: hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={author.heroImage} alt={author.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display font-medium">{author.name}</p>
                    <p className="text-sm text-muted-foreground">{author.years}</p>
                  </div>
                </Link>
              ))}
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
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">

          {/* Header Profile Section */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-16 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative shrink-0"
            >
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-background shadow-none ring-2 ring-border/50">
                <img src={authorInfo.heroImage} alt={authorInfo.name} className="h-full w-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 bg-background rounded-full p-1.5 border border-border">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="block h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 space-y-4"
            >
              <div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-2 text-foreground">
                  {authorInfo.name}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-display italic">
                  {authorInfo.title}
                </p>
              </div>

              <p className="text-base sm:text-lg leading-relaxed text-foreground/80 max-w-2xl">
                {authorInfo.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span>{authorInfo.years}</span>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full">
                  <MapPin className="h-4 w-4" />
                  <span>{details?.birthPlace}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-12">

              {/* Works Section as Interactive Cards */}
              {authorWorks.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-2xl font-medium">{t('works')}</h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {authorWorks.map((work, i) => (
                      <Link
                        key={i}
                        to={`/${authorId}/works/${slugify(work.title, { lower: true, strict: true })}`}
                        className="group cursor-pointer bg-card rounded-lg border border-border/50 p-6 transition-all hover:border-primary/40 hover:bg-secondary/20 block"
                      >
                        <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                          {work.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {work.summary}
                        </p>
                        <div className="flex items-center text-xs font-medium text-primary">
                          <span>{t('readMore')}</span>
                          <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Achievements - Redesigned */}
              {details?.achievements && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-2xl font-medium">{t('achievements')}</h2>
                  </div>
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {details.achievements.map((item, i) => (
                      <li key={i} className="flex gap-4 p-4 rounded-lg bg-surface-container-low/50 border border-border/30">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary text-[10px] font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Recent Entries */}
              {authorPosts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                        <Scroll className="h-5 w-5" />
                      </div>
                      <h2 className="font-display text-2xl font-medium">{t('diaryEntries')}</h2>
                    </div>
                    <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                      <Link to={`/${authorId}`}>
                        {t('viewAllEntries')} <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {authorPosts.map((post) => (
                      <Link key={post.id} to={`/${post.author}/${post.slug}`} className="block group">
                        <article className="bg-card hover:bg-secondary/30 rounded-lg p-6 border border-border/50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                            <h3 className="font-display text-xl font-medium group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <time className="text-sm text-muted-foreground whitespace-nowrap">{post.historicalDate}</time>
                          </div>
                          <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Timeline */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                {details?.timeline && (
                  <div className="rounded-lg border border-border bg-card/50 p-6 md:p-8">
                    <h3 className="font-display text-xl font-medium mb-6 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      {t('timeline')}
                    </h3>
                    <div className="relative pl-2 ml-2 border-l border-border space-y-8">
                      {details.timeline.map((item, i) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute -left-[5px] top-[5px] h-2.5 w-2.5 rounded-full border-2 border-primary bg-background z-10" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-primary mb-0.5">{item.year}</span>
                            <span className="text-sm text-foreground/80 leading-snug">{item.event}</span>
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

      </main >
      <Footer />
    </div >
  );
}

export default function AboutPage() {
  const { authorId } = useParams<{ authorId: string }>();

  if (authorId && baseAuthors[authorId as Author]) {
    return <AuthorAboutPage />;
  }

  return <GeneralAboutPage />;
}
