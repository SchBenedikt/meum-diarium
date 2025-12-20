import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, MapPin, BookOpen, Award, ArrowLeft, Users, Scroll, Clock, ArrowRight, Sword, Map, Trophy, Landmark, Crown } from 'lucide-react';
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
                  className="group p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300"
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

        {/* Methodology & Sources */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">{t('methodology') || 'Methodik & Quellen'}</h2>
              <p className="text-lg text-muted-foreground">{t('methodologyDesc') || 'Wie wir rekonstruieren: Originaltexte, semantische Analyse und sorgfältige Validierung.'}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{t('sources') || 'Primärquellen'}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('sourcesDesc') || 'Originaltexte in Latein und Übersetzungen bilden die Grundlage jeder Rekonstruktion.'}</p>
              </div>
              <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                  <Scroll className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{t('analysis') || 'Semantische Analyse'}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('analysisDesc') || 'Rhetorische Muster, Stil und historische Kontexte werden systematisch modelliert.'}</p>
              </div>
              <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{t('validation') || 'Validierung'}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('validationDesc') || 'Fachliche Plausibilitätsprüfungen minimieren Fehler und sichern Qualität.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Deep Dive */}
        <section className="py-24 bg-surface-container-low/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-4">Wie es funktioniert</h2>
              <p className="text-lg text-muted-foreground">Ein einzigartiger Zugang zur antiken Geschichte durch doppelte Perspektiven und authentische Rekonstruktion.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Scroll className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Tagebuch-Perspektive</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">Erleben Sie die Geschichte aus persönlicher Sicht. Caesars Siege, Senecas philosophische Zweifel, Ciceros politische Kämpfe – alles aus erster Hand und oft mit einem Augenzwinkern geschrieben.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Persönliche Reflexionen & Gefühle</li>
                  <li>✓ Alltägliche Begebenheiten</li>
                  <li>✓ Intime Gedanken & Zweifel</li>
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Wissenschaftliche Perspektive</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">Die gleichen Ereignisse, aber wissenschaftlich analysiert. Quellen, Kontexte, Widersprüche – hier erhalten Sie die akademische Wahrheit hinter den Geschichten.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Historische Quellenangaben</li>
                  <li>✓ Akademische Einordnung</li>
                  <li>✓ Kritische Analyse</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Authors Showcase - More Details */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-4">Vier Stimmen der Antike</h2>
              <p className="text-lg text-muted-foreground">Lernen Sie die Männer kennen, deren Worte und Taten die Zivilisation formten.</p>
            </div>
            <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {Object.values(authors).map((author, i) => (
                <motion.div
                  key={author.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <Link
                    to={`/${author.id}/about`}
                    onClick={() => setCurrentAuthor(author.id as Author)}
                    className="flex flex-col h-full"
                  >
                    <div className="relative overflow-hidden rounded-3xl mb-6 aspect-square">
                      <img
                        src={author.heroImage}
                        alt={author.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{author.name}</h3>
                    <p className="text-sm text-primary font-semibold mb-2">{author.years}</p>
                    <p className="text-sm text-muted-foreground line-clamp-3 group-hover:line-clamp-none">{author.description}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-5xl font-display font-bold text-primary mb-2">4</div>
                <p className="text-muted-foreground font-semibold">Antike Autoren</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-display font-bold text-primary mb-2">170+</div>
                <p className="text-muted-foreground font-semibold">Jahre Geschichte</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-display font-bold text-primary mb-2">2</div>
                <p className="text-muted-foreground font-semibold">Perspektiven pro Post</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-display font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground font-semibold">Authentisch recherchiert</p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-4xl font-bold mb-4">{t('ourTeam') || 'Unser Team'}</h2>
              <p className="text-lg text-muted-foreground">{t('teamDesc') || 'Leidenschaftliche Historiker, Sprachwissenschaftler und Entwickler arbeiten zusammen, um die Vergangenheit lebendig werden zu lassen.'}</p>
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
  const isCaesar = authorId === 'caesar';

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        {/* Author Hero */}
        {isCaesar ? (
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid lg:grid-cols-12 gap-10 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-7"
                >
                  <span className="inline-block px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6">
                    {authorInfo.years}
                  </span>
                  <h1 className="font-display text-6xl sm:text-7xl font-bold mb-4 tracking-tighter text-foreground">
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
                <div className="lg:col-span-5">
                  <div className="rounded-3xl overflow-hidden border border-border/40 bg-card/30">
                    <img src={authorInfo.heroImage} alt={authorInfo.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
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
        )}

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
                        className="group relative bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-8 transition-colors duration-300 hover:border-primary/40 overflow-hidden block"
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
                        <article className="relative bg-card/30 hover:bg-card/60 rounded-3xl p-8 border border-border/40 hover:border-primary/20 transition-colors duration-300 overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                            <h3 className="font-display text-2xl font-bold group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-2 rounded-full whitespace-nowrap">
                              {post.historicalDate}
                            </span>
                          </div>
                          <p className="text-base text-muted-foreground leading-relaxed line-clamp-3 italic opacity-80 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>
                              {post.readingTime ? `${post.readingTime} min` : '5 min'}
                            </span>
                            <span className="inline-flex items-center text-primary font-semibold">
                              Weiterlesen
                              <ArrowRight className="ml-2 h-4 w-4 icon-hover" />
                            </span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Timeline & Quick Facts */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                {authorId === 'caesar' && (
                  <div className="rounded-3xl border border-border/40 bg-card/20 backdrop-blur-3xl p-8">
                    <h3 className="font-display text-2xl font-bold mb-6 text-primary">Kurzfakten</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start py-2 border-b border-border/30">
                        <span className="text-sm font-medium text-muted-foreground">Geburt</span>
                        <span className="text-sm font-semibold">13. Juli 100 v. Chr.</span>
                      </div>
                      <div className="flex justify-between items-start py-2 border-b border-border/30">
                        <span className="text-sm font-medium text-muted-foreground">Tod</span>
                        <span className="text-sm font-semibold">15. März 44 v. Chr.</span>
                      </div>
                      <div className="flex justify-between items-start py-2 border-b border-border/30">
                        <span className="text-sm font-medium text-muted-foreground">Amtszeit</span>
                        <span className="text-sm font-semibold">59 v. Chr. (Konsul)</span>
                      </div>
                      <div className="flex justify-between items-start py-2 border-b border-border/30">
                        <span className="text-sm font-medium text-muted-foreground">Diktatur</span>
                        <span className="text-sm font-semibold">49–44 v. Chr.</span>
                      </div>
                      <div className="flex justify-between items-start py-2 border-b border-border/30">
                        <span className="text-sm font-medium text-muted-foreground">Feldzüge</span>
                        <span className="text-sm font-semibold">Gallien, Britannien</span>
                      </div>
                      <div className="flex justify-between items-start py-2">
                        <span className="text-sm font-medium text-muted-foreground">Bekannt für</span>
                        <span className="text-sm font-semibold text-right">Gallischer Krieg, Rubikon</span>
                      </div>
                    </div>
                  </div>
                )}
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
                          <div className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full border-2 border-primary bg-background" />
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
        {/* Caesar-specific: Militärische Leistungen */}
        {isCaesar && (
          <section className="py-24 bg-surface-container-low/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="font-display text-4xl font-bold mb-4">Militärische Meisterleistungen</h2>
                <p className="text-lg text-muted-foreground">Die Feldzüge, die das Römische Reich nachhaltig prägten und Caesars strategisches Genie offenbarten.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                    <Sword className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">Gallischer Krieg</h3>
                  <p className="text-sm text-primary font-semibold mb-3">58–50 v. Chr.</p>
                  <p className="text-muted-foreground leading-relaxed">Eroberung Galliens mit über 50 gewonnenen Schlachten, darunter Alesia (52 v. Chr.), wo Caesar eine Übermacht durch Belagerungstechnik besiegte.</p>
                </div>
                <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                    <Map className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">Britannien & Germanien</h3>
                  <p className="text-sm text-primary font-semibold mb-3">55–54 v. Chr.</p>
                  <p className="text-muted-foreground leading-relaxed">Erste römische Expeditionen über den Rhein und nach Britannien, die Roms militärische Reichweite neu definierten.</p>
                </div>
                <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                    <Trophy className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">Bürgerkrieg</h3>
                  <p className="text-sm text-primary font-semibold mb-3">49–45 v. Chr.</p>
                  <p className="text-muted-foreground leading-relaxed">Triumphale Siege bei Pharsalos (48 v. Chr.), Thapsus (46 v. Chr.) und Munda (45 v. Chr.), die die Republik in die Alleinherrschaft überführten.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Caesar-specific: Politische Meilensteine */}
        {isCaesar && (
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="font-display text-4xl font-bold mb-4">Politische Meilensteine</h2>
                <p className="text-lg text-muted-foreground">Von der Popularen-Politik bis zur Diktatur: Caesars Weg zur absoluten Macht in Rom.</p>
              </div>
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                  <div className="flex items-start gap-6">
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display text-xl font-bold">Erstes Triumvirat</h3>
                        <span className="text-sm text-primary font-semibold">60 v. Chr.</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">Geheimes Bündnis mit Pompeius und Crassus, das die römische Politik dominierte und Caesar zum Konsulat verhalf.</p>
                    </div>
                  </div>
                </div>
                <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                  <div className="flex items-start gap-6">
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Landmark className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display text-xl font-bold">Rubikon-Überquerung</h3>
                        <span className="text-sm text-primary font-semibold">10. Januar 49 v. Chr.</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">»Alea iacta est« – Der Würfel ist gefallen. Caesar überschritt mit seinen Legionen den Rubikon und löste damit den Bürgerkrieg aus.</p>
                    </div>
                  </div>
                </div>
                <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                  <div className="flex items-start gap-6">
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display text-xl font-bold">Diktator auf Lebenszeit</h3>
                        <span className="text-sm text-primary font-semibold">44 v. Chr.</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">Der Senat ernannte Caesar zum »dictator perpetuo«, was faktisch das Ende der römischen Republik bedeutete und zu seiner Ermordung führte.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Caesar-specific: Zitate */}
        {isCaesar && (
          <section className="py-24 bg-surface-container-low/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="font-display text-4xl font-bold mb-4">Legendäre Zitate</h2>
                <p className="text-lg text-muted-foreground">Worte, die die Geschichte prägten und Caesars Entschlossenheit zeigen.</p>
              </div>
              <div className="max-w-3xl mx-auto space-y-6">
                <blockquote className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                  <p className="text-2xl font-display italic text-foreground/90 mb-4">»Veni, vidi, vici.«</p>
                  <p className="text-sm text-muted-foreground">Ich kam, ich sah, ich siegte – nach dem Sieg bei Zela (47 v. Chr.)</p>
                </blockquote>
                <blockquote className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                  <p className="text-2xl font-display italic text-foreground/90 mb-4">»Alea iacta est.«</p>
                  <p className="text-sm text-muted-foreground">Der Würfel ist gefallen – beim Überschreiten des Rubikon (49 v. Chr.)</p>
                </blockquote>
                <blockquote className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/20 transition-colors duration-300">
                  <p className="text-2xl font-display italic text-foreground/90 mb-4">»Et tu, Brute?«</p>
                  <p className="text-sm text-muted-foreground">Auch du, Brutus? – Caesars letzte Worte bei seiner Ermordung (15. März 44 v. Chr.)</p>
                </blockquote>
              </div>
            </div>
          </section>
        )}      </main>
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
