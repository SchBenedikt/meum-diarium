import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, BookOpen, Award, Users, Scroll, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authors as baseAuthors } from '@/data/authors';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { Author } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthors } from '@/lib/translator';
import { PageContent, PageLanguage } from '@/types/page';

export function GeneralAboutPage() {
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

        {/* Highlights Section */}
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

        {/* Features Section */}
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

        {/* Authors Showcase */}
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

        {/* Team Section */}
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
