import CaesarCampaignMap from '@/components/CaesarCampaignMap';
import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, MapPin, BookOpen, Award, ArrowLeft, Users, Scroll, Clock, ArrowRight, Sword, Map, Trophy, Landmark, Crown, Sparkles } from 'lucide-react';
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
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);

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

        // Load author-specific about page content if available
        try {
          const res = await fetch(`/api/pages/author-about-${authorId}`);
          if (res.ok) {
            const data: PageContent = await res.json();
            setAuthorPage(data);
          } else {
            setAuthorPage(null);
          }
        } catch {
          setAuthorPage(null);
        }
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
  
  const caesarSnapshots = isCaesar
    ? [
      { label: 'Lebenszeit', value: '100–44 v. Chr.', hint: '56 Jahre' },
      { label: 'Konsulat', value: '59 v. Chr.', hint: 'Erstes Konsulamt' },
      { label: 'Diktatur', value: '49–44 v. Chr.', hint: 'perpetuo ab 44' },
      { label: 'Gallischer Krieg', value: '8 Jahre', hint: '58–50 v. Chr.' },
      { label: 'Legionen', value: '9 Stammlegionen', hint: 'ca. 40–50k Soldaten' },
      { label: 'Feldzüge', value: '4 Großräume', hint: 'Gallien, Germania, Britannia, Hispania' },
    ]
    : [];
  const caesarReforms = isCaesar
    ? [
      {
        title: 'Julianischer Kalender (46 v. Chr.)',
        summary: '365 Tage plus Schaltjahr – ersetzte den ungenauen Mondkalender und prägte den heutigen Kalender.',
        tag: 'Zeit & Verwaltung',
        horizon: 'langfristig',
      },
      {
        title: 'Schuldenerlass & Zinsdeckel (49 v. Chr.)',
        summary: 'Kurzfristige Entlastung nach dem Bürgerkrieg: Deckelung von Zinsforderungen und Bewertung von Immobilien zu Vorkriegspreisen.',
        tag: 'Ökonomie',
        horizon: 'sofort',
      },
      {
        title: 'Ausweitung des Bürgerrechts',
        summary: 'Verlieh italischen und provinziellen Eliten das römische Bürgerrecht, um Loyalität zu sichern und Rom stärker zu integrieren.',
        tag: 'Staatsrecht',
        horizon: 'langfristig',
      },
      {
        title: 'Land- & Veteranengesetze',
        summary: 'Siedelte Veteranen an, entschärfte Schuldenlast und verteilte Staatsland – sozialpolitische Stabilisierung nach den Bürgerkriegen.',
        tag: 'Sozialpolitik',
        horizon: 'mittelfristig',
      },
      {
        title: 'Forum Iulium & Infrastruktur',
        summary: 'Neues Forum, Straßensanierungen und öffentliche Bauten, um Rom zu entlasten und Prestige aufzubauen.',
        tag: 'Stadtplanung',
        horizon: 'mittelfristig',
      },
      {
        title: 'Senatsreform',
        summary: 'Erweiterte den Senat auf ~900 Mitglieder, holte Provinzvertreter hinein und schwächte alte Patronatsnetzwerke.',
        tag: 'Institutionen',
        horizon: 'langfristig',
      },
    ]
    : [];

  const caesarReformDeep = isCaesar
    ? [
      {
        title: 'Kalenderreform',
        detail: 'Vom Mond- zum Sonnenjahr: 365 Tage + Schaltjahr schufen Planungssicherheit für Steuer, Militär und Ernte.',
        impact: 'Legt die Basis des heutigen Kalenders und reduziert administrative Willkür.',
      },
      {
        title: 'Bürgerrecht & Elitenbindung',
        detail: 'Ausweitung des Bürgerrechts auf italische und provinzialische Eliten, um Loyalität zu sichern und Verwaltung zu professionalisieren.',
        impact: 'Schafft neue Machtbasis für Caesar und integriert Provinzen stärker in Rom.',
      },
      {
        title: 'Land- und Veteranenpolitik',
        detail: 'Ansiedlung von Veteranen und Umverteilung von Staatsland zur Stabilisierung nach Bürgerkrieg und zur Sicherung persönlicher Gefolgschaft.',
        impact: 'Beruhigt soziale Spannungen, bindet Legionäre an Caesar und belebt die Wirtschaft.',
      },
    ]
    : [];

  const caesarTheaters = isCaesar
    ? [
      {
        title: 'Gallien',
        years: '58–50 v. Chr.',
        note: 'Hauptfeldzug: Ressourcen, Prestige, Brückenkopf nach Germanien & Britannien.',
      },
      {
        title: 'Germania',
        years: '55–53 v. Chr.',
        note: 'Rheinbrücken als Machtdemonstration, Vorstoß ohne dauerhafte Besetzung.',
      },
      {
        title: 'Britannien',
        years: '55–54 v. Chr.',
        note: 'Symbolische Expedition: zeigt römische Reichweite, begrenzter territorialer Gewinn.',
      },
      {
        title: 'Hispanien & Afrika',
        years: '49–45 v. Chr.',
        note: 'Schlüsselgefechte des Bürgerkriegs: Ilerda, Thapsus, Munda sichern Alleinherrschaft.',
      },
    ]
    : [];

  const caesarOffices = isCaesar
    ? [
      {
        title: 'Pontifex Maximus',
        years: '63 v. Chr.',
        note: 'Oberpriester – religiöse Autorität als politischer Hebel.',
      },
      {
        title: 'Konsul',
        years: '59 v. Chr.',
        note: 'Setzt populare Gesetzespakete durch, trotz Widerstand der Optimaten.',
      },
      {
        title: 'Diktator',
        years: '49–44 v. Chr.',
        note: 'Kriegs- und Krisenvollmacht, später auf 10 Jahre und perpetuo ausgedehnt.',
      },
    ]
    : [];
  const caesarDebate = isCaesar
    ? [
      {
        heading: 'Warum er bewundert wird',
        points: [
          'Brillanter Feldherr mit logistischer Präzision und schneller Entscheidungsfreude.',
          'Pragmatischer Reformer, der Verwaltung und Kalender modernisierte.',
          'Meister der Selbstdarstellung: klare Sprache, dritte Person, prägnante Narrative.',
        ],
      },
      {
        heading: 'Warum er gefürchtet wurde',
        points: [
          'Machtkonzentration und Missachtung republikanischer Checks & Balances.',
          'Senatserweiterung als politisches Werkzeug zur Stimmenmaximierung.',
          'Heerestreue wichtiger als Senatsautorität – der Rubikon als Präzedenzfall.',
        ],
      },
    ]
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        {/* Author Hero */}
        {isCaesar ? (
          <>
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
                    {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.heroTitle || authorPage?.heroTitle || authorInfo.name}
                  </h1>
                  <p className="text-2xl sm:text-3xl text-muted-foreground font-display italic mb-6">
                    {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.heroSubtitle || authorPage?.heroSubtitle || authorInfo.title}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/60">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{details?.birthPlace}</span>
                    </div>
                    <div className="h-1 w-12 bg-primary/30 rounded-full" />
                    <p className="text-lg text-muted-foreground max-w-xl font-light leading-relaxed">
                      {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.projectDescription || authorPage?.projectDescription || authorInfo.description}
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
          {/* Reading Guide for Caesar */}
          {authorId === 'caesar' && (
            <section className="py-10">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="card-modern card-padding-md">
                    <h3 className="font-display text-xl font-bold mb-2">Wie lese ich diese Seite?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Beginne mit der Biografie hier, springe dann in die Chronologie und vertiefe dich in die Einträge. Für Fakten: wissenschaftliche Perspektive. Für Erleben: Tagebuch.</p>
                  </div>
                  <Link to="/timeline" className="card-modern card-padding-md group">
                    <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">Chronologie</h3>
                    <p className="text-sm text-muted-foreground">Überblick über die wichtigsten Stationen – von Gallien bis zu den Iden des März.</p>
                  </Link>
                  <Link to="/caesar" className="card-modern card-padding-md group">
                    <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">Einträge lesen</h3>
                    <p className="text-sm text-muted-foreground">Tagebuch und wissenschaftliche Einordnung – pro Artikel umschaltbar.</p>
                  </Link>
                </div>
              </div>
            </section>
          )}
          </>
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
                  {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.heroTitle || authorPage?.heroTitle || authorInfo.name}
                </h1>
                <p className="text-2xl sm:text-3xl text-muted-foreground font-display italic mb-6">
                  {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.heroSubtitle || authorPage?.heroSubtitle || authorInfo.title}
                </p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/60">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{details?.birthPlace}</span>
                  </div>
                  <div className="h-1 w-12 bg-primary/30 rounded-full" />
                  <p className="text-lg text-muted-foreground max-w-xl font-light leading-relaxed">
                    {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.projectDescription || authorPage?.projectDescription || authorInfo.description}
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
                        className="card-modern card-hover-primary card-padding-lg group relative overflow-hidden block"
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
                  <div className="grid gap-6 md:grid-cols-2">
                    {authorPosts.map((post) => (
                      <Link key={post.id} to={`/${post.author}/${post.slug}`} className="group h-full">
                        <article className="card-modern card-hover-primary card-padding-md relative h-full overflow-hidden">
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
                  <div className="card-modern card-padding-md">
                    <h3 className="font-display text-2xl font-bold mb-5 text-primary">Kurzfakten</h3>
                    <div className="space-y-3 text-sm text-foreground/80">
                      {caesarSnapshots.map((item) => (
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
                )}
                {details?.timeline && (
                  <div className="card-modern card-padding-lg md:p-10">
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
        {isCaesar && (
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="font-display text-4xl font-bold mb-4">Reformen, die blieben</h2>
                <p className="text-lg text-muted-foreground">Caesars politische Maßnahmen, die über seine Herrschaft hinaus wirkten.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
                {caesarReforms.map((reform) => {
                  const reformSlugByTitle: Record<string, string> = {
                    'Julianischer Kalender (46 v. Chr.)': 'julianischer-kalender',
                    'Schuldenerlass & Zinsdeckel (49 v. Chr.)': 'schuldenerlass-und-zinsdeckel',
                    'Ausweitung des Bürgerrechts': 'ausweitung-des-burgerrechts',
                    'Land- & Veteranengesetze': 'land-und-veteranengesetze',
                    'Forum Iulium & Infrastruktur': 'forum-iulium-und-infrastruktur',
                    'Senatsreform': 'senatsreform',
                  };
                  const slug = reformSlugByTitle[reform.title];
                  const cardContent = (
                    <>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{reform.tag}</span>
                        <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                          {reform.horizon === 'sofort' ? '⚡ sofort' : reform.horizon === 'mittelfristig' ? '↗ mittelfristig' : '↗ langfristig'}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold mb-2">{reform.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{reform.summary}</p>
                      {slug && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-primary font-semibold">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Zum ausführlichen Artikel</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </>
                  );
                  return slug ? (
                    <Link
                      key={reform.title}
                      to={`/caesar/${slug}`}
                      className="card-modern card-hover-primary card-padding-lg block"
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div
                      key={reform.title}
                      className="card-modern card-hover-primary card-padding-lg"
                    >
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {isCaesar && (
          <section className="py-20 bg-surface-container-low/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="font-display text-4xl font-bold mb-4">Reformen im Detail</h2>
                <p className="text-lg text-muted-foreground">Was er änderte, wie es wirkte – und warum es Rom neu ordnete.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                {caesarReformDeep.map((item) => {
                  const deepSlugByTitle: Record<string, string> = {
                    'Kalenderreform': 'julianischer-kalender',
                    'Bürgerrecht & Elitenbindung': 'ausweitung-des-burgerrechts',
                    'Land- und Veteranenpolitik': 'land-und-veteranengesetze',
                  };
                  const slug = deepSlugByTitle[item.title];
                  const cardContent = (
                    <>
                      <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-sm text-foreground/85 leading-relaxed mb-3">{item.detail}</p>
                      <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Folge:</span> {item.impact}
                      </div>
                      {slug && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-primary font-semibold">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Mehr erfahren</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </>
                  );
                  return slug ? (
                    <Link
                      key={item.title}
                      to={`/caesar/${slug}`}
                      className="card-modern card-hover-primary card-padding-md block"
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div
                      key={item.title}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {isCaesar && (
          <section className="py-24 bg-surface-container-low/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="font-display text-4xl font-bold mb-4">Warum er polarisiert</h2>
                <p className="text-lg text-muted-foreground">Zwischen Genie und Gefahr – die zwei Lesarten von Caesars Karriere.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
                {caesarDebate.map((block) => (
                  <div
                    key={block.heading}
                    className="card-modern card-hover-primary card-padding-lg"
                  >
                    <h3 className="font-display text-xl font-bold mb-4">{block.heading}</h3>
                    <div className="space-y-3">
                      {block.points.map((point) => (
                        <div key={point} className="flex gap-3 items-start">
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                          <p className="text-sm text-foreground/85 leading-relaxed font-medium">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {isCaesar && (
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto text-center mb-12">
                <h2 className="font-display text-4xl font-bold mb-4">Schauplätze & Ämter</h2>
                <p className="text-lg text-muted-foreground">Wo er zog, welche Macht er trug – Schauplätze als Bühne, Ämter als Hebel.</p>
              </div>

              <div className="max-w-6xl mx-auto space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Schauplätze</span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <div className="grid gap-6 lg:grid-cols-3">
                    {caesarTheaters.map((item) => (
                      <div
                        key={item.title}
                        className="card-modern card-hover-primary card-padding-md"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Feldzug</span>
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">{item.years}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-foreground/85 leading-relaxed">{item.note}</p>
                      </div>
                    ))}
                  </div>
                  <div className="card-modern card-padding-md flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Map className="w-5 h-5 text-primary" />
                      <h3 className="font-display text-xl font-bold">Karte seiner Züge</h3>
                    </div>
                    <p className="text-sm text-foreground/85 leading-relaxed">
                      Interaktive Karte im Antik-Look mit markierten Feldzügen, Rheinbrücken, Britannien-Landungen und Bürgerkriegszügen.
                    </p>
                    <CaesarCampaignMap mapHeightClass="h-[520px] lg:h-[620px]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Ämter</span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <div className="grid gap-6 lg:grid-cols-3">
                    {caesarOffices.map((item) => (
                      <div
                        key={item.title}
                        className="card-modern card-hover-primary card-padding-md"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Amt</span>
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">{item.years}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-foreground/85 leading-relaxed">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Caesar-specific: Militärische Leistungen */}
        {isCaesar && (
          <section className="py-24 bg-surface-container-low/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="font-display text-4xl font-bold mb-4">Militärische Meisterleistungen</h2>
                <p className="text-lg text-muted-foreground">Schlachten als Meilensteine: Wo Caesar Tempo, Logistik und Belagerungstechnik kombinierte.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {[{
                  icon: Sword,
                  title: 'Gallischer Krieg',
                  years: '58–50 v. Chr.',
                  note: 'Alesia 52 v. Chr.: Doppelwall und Belagerungsringe gegen Vercingetorix.'
                }, {
                  icon: Map,
                  title: 'Britannien & Germanien',
                  years: '55–54 v. Chr.',
                  note: 'Rheinbrücken in 10 Tagen, erste römische Landung in Britannien.'
                }, {
                  icon: Trophy,
                  title: 'Bürgerkrieg',
                  years: '49–45 v. Chr.',
                  note: 'Pharsalos, Thapsus, Munda – schnelle Entscheidungen trotz Unterzahl.'
                }].map((item) => (
                  <div
                    key={item.title}
                    className="card-modern card-hover-primary card-padding-lg"
                  >
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-primary font-semibold mb-3">{item.years}</p>
                    <p className="text-sm text-foreground/85 leading-relaxed font-medium">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Caesar-specific: Politische Meilensteine */}
        {isCaesar && (
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="font-display text-4xl font-bold mb-4">Caesars Weg zur Macht</h2>
                <p className="text-lg text-muted-foreground">Vom geheimen Bündnis über populare Reformen bis zur tragischen Ermordung – die entscheidenden Stationen seiner politischen Karriere.</p>
              </div>
              <div className="max-w-6xl mx-auto">
                {/* Phase 1: Aufstieg */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Phase I: Aufstieg (60–50 v. Chr.)</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Link to="/caesar/das-1-triumvirat">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl hover:border-primary/30 transition-all group h-full"
                      >
                        <div className="absolute top-4 right-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">60 v. Chr.</span>
                        <h3 className="font-display text-2xl font-bold mb-3">Erstes Triumvirat</h3>
                        <p className="text-sm text-foreground/85 leading-relaxed mb-4">Geheimes Dreierbündnis mit Pompeius und Crassus – politischer Pakt, der die Optimaten umgeht und Caesar das Konsulat 59 v. Chr. sichert.</p>
                        <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Zum Tagebucheintrag</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </motion.div>
                    </Link>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="relative p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl hover:border-primary/30 transition-all group"
                    >
                      <div className="absolute top-4 right-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                        <Landmark className="h-6 w-6 text-primary" />
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">59 v. Chr.</span>
                      <h3 className="font-display text-2xl font-bold mb-3">Konsulat & Reformen</h3>
                      <p className="text-sm text-foreground/85 leading-relaxed">Landgesetze für Veteranen, Neuordnung der Provinzen – populare Politik zur Stärkung der Hausmacht gegen den konservativen Senat.</p>
                    </motion.div>
                  </div>
                </div>

                {/* Phase 2: Der Bruch */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Phase II: Der Bruch (49 v. Chr.)</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative p-10 rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-card/60 to-card/40 backdrop-blur-xl overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-3">10. Januar 49 v. Chr.</span>
                          <h3 className="font-display text-3xl font-bold mb-2">Rubikon-Überquerung</h3>
                          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Wendepunkt der Republik</p>
                        </div>
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Landmark className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <p className="text-base text-foreground/90 leading-relaxed mb-4">»Alea iacta est« – Der Würfel ist gefallen. Caesar überschreitet mit seinen Legionen die Grenze zwischen Provinz und Italien und bricht damit das Gesetz. Der Bürgerkrieg beginnt.</p>
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 text-xs text-primary/80">
                          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          <span className="font-semibold">Wendepunkt der römischen Geschichte</span>
                        </div>
                        <Link
                          to="/caesar/ich-uberschreite-den-rubikon"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-bold transition-colors"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          Zum Tagebucheintrag
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Phase 3: Alleinherrschaft & Ende */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Phase III: Alleinherrschaft (46–44 v. Chr.)</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Crown className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">46 v. Chr.</span>
                      <h3 className="font-display text-xl font-bold mt-2 mb-3">Diktatur (10 Jahre)</h3>
                      <p className="text-sm text-foreground/85 leading-relaxed">Zentralisierung der Macht – Kalenderreform, Infrastruktur, Schuldenerlass. Erste Stufe zur Alleinherrschaft.</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Crown className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">44 v. Chr.</span>
                      <h3 className="font-display text-xl font-bold mt-2 mb-3">Diktator perpetuo</h3>
                      <p className="text-sm text-foreground/85 leading-relaxed">Lebenslange Diktatur – das Ende der Republik. Auslöser der Verschwörung unter Brutus und Cassius.</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Crown className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">15. März 44 v. Chr.</span>
                      <h3 className="font-display text-xl font-bold mt-2 mb-3">Iden des März</h3>
                      <p className="text-sm text-foreground/85 leading-relaxed">23 Dolchstiche im Senat – die republikanische Elite schlägt zurück. Caesars Tod wird zum Mythos.</p>
                    </motion.div>
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
                <p className="text-lg text-muted-foreground">Kontext und Wirkung – warum die Worte hängen bleiben.</p>
              </div>
              <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
                {[{
                  quote: 'Veni, vidi, vici.',
                  translation: 'Ich kam, ich sah, ich siegte.',
                  when: '47 v. Chr., Zela',
                  meaning: 'Telegrammstil an den Senat – Inszenierung von Schnelligkeit und Totalerfolg.'
                }, {
                  quote: 'Alea iacta est.',
                  translation: 'Der Würfel ist gefallen.',
                  when: '49 v. Chr., Rubikon',
                  meaning: 'Unumkehrbarer Schritt – bewusste Grenzüberschreitung gegen das Senatsmandat.'
                }, {
                  quote: 'Et tu, Brute?',
                  translation: 'Auch du, Brutus?',
                  when: '44 v. Chr., Senat',
                  meaning: 'Legendarischer Verratsmoment; überliefert von Sueton, vermutlich dramatisiert.'
                }].map((item) => (
                  <div
                    key={item.quote}
                    className="card-modern card-hover-primary card-padding-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <Sparkles className="h-3.5 w-3.5" /> Impact
                      </span>
                      <span className="text-xs font-semibold text-primary/70">{item.when}</span>
                    </div>
                    <p className="text-xl font-display italic text-foreground/90 mb-1">{item.quote}</p>
                    <p className="text-base font-medium text-muted-foreground mb-4">{item.translation}</p>
                    <p className="text-sm text-foreground/85 leading-relaxed">{item.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
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
