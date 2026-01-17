import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { BookOpen, Award, Users, Scroll, Clock, Sparkles, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authors as baseAuthors } from '@/data/authors';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { Author } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthors } from '@/lib/translator';
import { PageContent, PageLanguage } from '@/types/page';
import { SEO } from '@/components/SEO';

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

  const structuredData = useMemo(() => ([
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Meum Diarium',
      url: 'https://meum-diarium.xn--schchner-2za.de/about',
      sameAs: [
        'https://www.linkedin.com',
        'https://github.com/SchBenedikt/meum-diarium'
      ],
      description: projectDescription,
      inLanguage: language,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Was ist Meum Diarium?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ein digitales Geschichtstagebuch, das Tagebuch- und Forschungsperspektive verbindet, um römische Geschichte erlebbar zu machen.'
          }
        },
        {
          '@type': 'Question',
          name: 'Welche Quellen werden genutzt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Originaltexte wie Caesars Commentarii, Ciceros Reden und Briefe, Augustus’ Res Gestae sowie Senecas philosophische Schriften – ergänzt um wissenschaftliche Einordnung.'
          }
        },
        {
          '@type': 'Question',
          name: 'Kann ich Inhalte für Studium oder Unterricht nutzen?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ja. Die Inhalte sind quellennah aufbereitet, zweisprachig übersetzt und mit Kontext versehen, sodass sie für Seminare, Unterricht und Selbststudium geeignet sind.'
          }
        }
      ]
    }
  ]), [language, projectDescription]);

  const defaultHighlights = useMemo(() => ([
    { icon: BookOpen, title: t('twoPerspectives'), desc: 'Erlebe Geschichte aus zwei radikal unterschiedlichen Blickwinkeln: Die persönliche, oft humorvolle Tagebuchperspektive und die streng wissenschaftliche Analyse mit Quellenangaben und historischer Einordnung.' },
    { icon: Users, title: t('fourAuthors'), desc: 'Vier der einflussreichsten Persönlichkeiten der Antike: Caesar, der Eroberer und Staatsmann. Cicero, der brillante Rhetoriker. Augustus, der Friedensbringer. Seneca, der philosophische Berater.' },
    { icon: Clock, title: '170+ Jahre Geschichte', desc: 'Von Caesars Gallischen Kriegen (58 v. Chr.) bis zu Senecas Selbstmord (65 n. Chr.) – eine Epoche, die unsere Zivilisation prägte. Bürgerkriege, Philosophie, Macht und Moral.' },
    { icon: Scroll, title: t('authentic'), desc: 'Jeder Eintrag basiert auf historischen Quellen: Caesars Commentarii, Ciceros Briefe und Reden, Augustus Res Gestae, Senecas philosophische Schriften. Wissenschaftlich fundiert, literarisch erzählt.' },
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
      <SEO
        title={heroTitle || 'Über Meum Diarium'}
        description={projectDescription || heroSubtitle || 'Meum Diarium verbindet Tagebuch und Forschung, um Rom erfahrbar zu machen.'}
        tags={[
          'Römische Geschichte',
          'Caesar',
          'Cicero',
          'Augustus',
          'Seneca',
          'Tagebuch',
          'Wissenschaftliche Analyse'
        ]}
        structuredData={structuredData}
      />
      <main className="flex-1">
        {/* Immersive Hero Section - Full Viewport */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1510214614611-66795499252a?q=80&w=2070&auto=format&fit=crop"
              alt="Ancient Library"
              className="w-full h-full object-cover scale-110"
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
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-30">
            <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
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

        {/* Explorer CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary/10 via-card to-secondary/30 border border-border/50 rounded-3xl p-10 sm:p-12 backdrop-blur-xl">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/15 border border-primary/20">
                  <Globe2 className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Explore</p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold">Tauche tiefer in Rom ein</h3>
                  <p className="text-muted-foreground leading-relaxed">Stöbere im Lexikon, entdecke Zeitleisten oder suche gezielt nach Personen, Schlachten und Begriffen.</p>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/lexicon" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-colors">Lexikon öffnen</Link>
                    <Link to="/search" className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">Suche starten</Link>
                    <Link to="/timeline" className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:border-primary hover:text-primary transition-colors">Zeitleiste ansehen</Link>
                  </div>
                </div>
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

        {/* FAQ */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-3">Häufige Fragen</h2>
              <p className="text-muted-foreground">Schnelle Antworten für Leser:innen, Lehrende und Studierende.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {[{
                q: 'Wie verlässlich sind die Inhalte?',
                a: 'Jeder Beitrag basiert auf Primärquellen und wird in einer wissenschaftlichen Perspektive kommentiert.'
              }, {
                q: 'Kann ich Inhalte zitieren?',
                a: 'Ja, bitte verweise auf Meum Diarium und die jeweilige Quelle im Beitrag.'
              }, {
                q: 'Gibt es mehrsprachige Versionen?',
                a: 'Deutsch, Englisch und Latein stehen zur Verfügung; weitere Sprachen sind geplant.'
              }, {
                q: 'Wie halte ich mich auf dem Laufenden?',
                a: 'Nutze die Suche, das Lexikon und die Zeitleiste oder folge unseren Autoren-Seiten.'
              }].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card/50 border border-border/40">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold mb-2">{item.q}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{item.a}</p>
                    </div>
                  </div>
                </div>
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

        {/* Vision & Impact Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-4">Unsere Vision</h2>
              <p className="text-lg text-muted-foreground">Geschichte ist mehr als Jahreszahlen und Schlachten. Sie ist voller Leben, Emotionen und Entscheidungen.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">Für Studierende</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Quellennah, kritisch und methodisch fundiert – ein Werkzeug für das Studium der Alten Geschichte und Klassischen Philologie.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">Für Geschichtsinteressierte</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Unterhaltsam, zugänglich und trotzdem tiefgehend – erlebe die Antike aus erster Hand, ohne auf Qualität zu verzichten.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Scroll className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">Für Lehrende</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Ein innovativer Zugang zur römischen Geschichte – nutzen Sie die Inhalte für Unterricht, Seminare und Vorlesungen.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-4xl font-bold mb-4">{t('ourTeam') || 'Unser Team'}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t('teamDesc') || 'Leidenschaftliche Historiker, Sprachwissenschaftler und Entwickler arbeiten zusammen, um die Vergangenheit lebendig werden zu lassen.'}</p>
              <div className="inline-flex flex-wrap gap-4 justify-center">
                <span className="px-4 py-2 rounded-full bg-primary/10 text-sm font-semibold">Alte Geschichte</span>
                <span className="px-4 py-2 rounded-full bg-primary/10 text-sm font-semibold">Klassische Philologie</span>
                <span className="px-4 py-2 rounded-full bg-primary/10 text-sm font-semibold">Digital Humanities</span>
                <span className="px-4 py-2 rounded-full bg-primary/10 text-sm font-semibold">Web Development</span>
                <span className="px-4 py-2 rounded-full bg-primary/10 text-sm font-semibold">UX Design</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
