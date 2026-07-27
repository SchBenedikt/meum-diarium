import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/HeroSection';
import { BlogList } from '@/components/BlogList';
import LandingHeroNew from '@/components/LandingHeroNew';
import { FeatureShowcase } from '@/components/home/FeatureShowcase';
import { useAuthor } from '@/context/AuthorContext';
import { useAuthors } from '@/hooks/use-authors';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Author } from '@/types/blog';
import NotFound from './NotFound';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SEO } from '@/components/SEO';
import { SimulationCarousel } from '@/components/simulation/SimulationCarousel';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthorInfo } from '@/lib/author-translator';
import { AnimatePresence, motion } from 'framer-motion';
const Index = () => {
  const { setCurrentAuthor, currentAuthor } = useAuthor();
  const { authors: dbAuthors, isLoading: authorsLoading } = useAuthors();
  const { authorId } = useParams<{ authorId?: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const { t } = useLanguage();
  const [showFloatingComposer, setShowFloatingComposer] = useState(false);
  const [isFloatingExpanded, setIsFloatingExpanded] = useState(false);
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';

  useEffect(() => {
    const onScroll = () => {
      setShowFloatingComposer(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!showFloatingComposer) {
      setIsFloatingExpanded(false);
    }
  }, [showFloatingComposer]);

  const openChatFromComposer = () => {
    const q = question.trim();
    if (!currentAuthor) return;
    if (q.length > 0) {
      navigate(`/${currentAuthor}/chat?q=${encodeURIComponent(q)}`);
      return;
    }
    navigate(`/${currentAuthor}/chat`);
  };
  useEffect(() => {
    if (authorId && dbAuthors[authorId as Author]) {
      setCurrentAuthor(authorId as Author);
    } else if (!authorId) {
      setCurrentAuthor(null);
    }
  }, [authorId, dbAuthors, setCurrentAuthor]);
  // const showTimelineCard = currentAuthor !== 'caesar'; // Removed as no longer used
  if (authorId && !dbAuthors[authorId as Author]) {
    if (authorsLoading) {
      return null; // Show loading state
    }
    return <NotFound />;
  }
  const author = currentAuthor ? dbAuthors[currentAuthor] : null;
  const translatedAuthor = currentAuthor ? getTranslatedAuthorInfo(currentAuthor, t) : null;
  const floatingChatLabel = translatedAuthor
    ? `Chatte mit ${translatedAuthor.name.split(' ')[0]}`
    : 'Chatte mit dem Autor';
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={translatedAuthor ? `${translatedAuthor.name} – Tagebücher, Werke & Analysen` : undefined}
        description={translatedAuthor?.description || 'Tauche ein in die Welt des antiken Roms: Erlebe Geschichte durch die Augen von Caesar, Cicero, Augustus und Seneca. Authentische Tagebucheinträge, wissenschaftliche Analysen, KI-Chats, interaktive Simulationen, Latein-Reader mit über 36.000 Vokabeln und ein umfassendes Lexikon – für Schule, Studium und alle Geschichtsbegeisterten.'}
        author={translatedAuthor?.name}
        image={translatedAuthor ? `${baseUrl}/images/${currentAuthor}-hero.png` : `${baseUrl}/images/caesar-hero.png`}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Meum Diarium",
          "description": translatedAuthor?.description || "Erlebe die Geschichte Roms durch die Augen großer Persönlichkeiten: Caesar, Cicero, Augustus und Seneca. Tagebucheinträge, wissenschaftliche Kommentare und interaktive Zeitreisen. Kostenlose OER-Bildungsmaterialien für Latein und römische Geschichte.",
          "url": `${baseUrl}${location.pathname === '/' ? '' : location.pathname}`,
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
              "name": "Antikes Rom",
              "description": "Historische Persönlichkeiten und ihre Werke"
            },
            {
              "@type": "Thing",
              "name": "Lateinische Literatur",
              "description": "Werke von Caesar, Cicero, Seneca und Augustus"
            },
            {
              "@type": "Thing",
              "name": "Latein lernen",
              "description": "Vokabeltrainer, Grammatik und interaktive Übungen"
            }
          ],
          "audience": {
            "@type": "EducationalAudience",
            "educationalRole": ["student", "teacher", "enthusiast"]
          },
          "educationalLevel": ["Sekundarstufe I", "Sekundarstufe II", "Studium", "Erwachsenenbildung"]
        }}
      />
      <main className="flex-1">
        {currentAuthor ? (
          <div>
            <HeroSection />
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 pt-16 relative z-10 pb-12">
              {/* Primary Feature - AI Chat */}
              <div className="mb-16">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border p-8 sm:p-12 relative overflow-hidden premium-glow">
                  <div className="relative">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1">{t('index.historicalChat')}</p>
                        <h2 className="text-2xl sm:text-3xl font-sans text-foreground tracking-tight">
                          {t('index.chatWith', { name: translatedAuthor?.name.split(' ')[0] })}
                        </h2>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mb-8 font-light">
                      {t('index.chatDescription', { name: translatedAuthor?.name })}
                    </p>
                    <div className="space-y-6 max-w-3xl">
                      <div className="relative">
                        <div className="relative bg-secondary/50 backdrop-blur-md p-1.5 rounded-full border border-border group focus-within:border-primary/30 transition-all duration-300">
                          <div className="flex items-center gap-3 px-4 py-2">
                            <input
                              type="text"
                              placeholder={t('index.chatPlaceholder', { name: translatedAuthor?.name.split(' ')[0] })}
                              className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground/50 ml-2"
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const q = question.trim();
                                  if (q.length > 0) {
                                    navigate(`/${currentAuthor}/chat?q=${encodeURIComponent(q)}`);
                                  } else {
                                    navigate(`/${currentAuthor}/chat`);
                                  }
                                }
                              }}
                            />
                            <Link to={`/${currentAuthor}/chat${question.trim() ? `?q=${encodeURIComponent(question.trim())}` : ''}`}>
                              <Button size="icon" className="rounded-full h-11 w-11 bg-primary text-primary-foreground hover:scale-105 transition-transform duration-300">
                                <ArrowRight className="h-5 w-5" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          t('index.suggestionLife'),
                          t('index.suggestionAchievements'),
                          t('index.suggestionEmpire')
                        ].map((suggestion, i) => (
                          <Link
                            key={i}
                            to={`/${currentAuthor}/chat?q=${encodeURIComponent(suggestion)}`}
                            className="px-4 py-2 rounded-full text-xs bg-secondary/50 hover:bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all duration-300 backdrop-blur-sm"
                          >
                            {suggestion}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Minimal Tools Row */}
              <div className="mb-12 relative z-20">
                <SimulationCarousel authorId={currentAuthor} />
              </div>
              {/* Content Sections */}
              <div className="space-y-16 border-t border-border/30 pt-12">
                <BlogList />
              </div>
            </div>
          </div>
        ) : (
          <LandingHeroNew />
        )}
      </main >

      <AnimatePresence>
        {currentAuthor && showFloatingComposer && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={isFloatingExpanded
              ? 'fixed inset-x-4 bottom-4 z-[90] md:inset-x-8'
              : 'fixed inset-x-4 bottom-4 z-[90]'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {!isFloatingExpanded ? (
                <motion.button
                  key="floating-chat-collapsed"
                  type="button"
                  onClick={() => setIsFloatingExpanded(true)}
                  initial={{ opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="block w-full max-w-sm mx-auto rounded-2xl border border-border/50 bg-white/80 dark:bg-card/85 backdrop-blur-xl shadow-2xl p-3 text-left hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{floatingChatLabel}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-white/85 dark:bg-card/90 backdrop-blur-sm px-3 py-2.5 text-sm text-muted-foreground">
                    Nachricht schreiben...
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  key="floating-chat-expanded"
                  initial={{ opacity: 0, y: 12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.985 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto max-w-4xl rounded-3xl border border-border/50 bg-white/80 dark:bg-card/85 backdrop-blur-xl shadow-2xl p-3 sm:p-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{floatingChatLabel}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFloatingExpanded(false)}
                      className="h-7 w-7 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
                      aria-label="Eingabefeld minimieren"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="relative flex items-center gap-2">
                    <Input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') openChatFromComposer();
                        if (e.key === 'Escape') setIsFloatingExpanded(false);
                      }}
                      placeholder={t('index.chatPlaceholder', { name: translatedAuthor?.name.split(' ')[0] })}
                      className="pr-12 py-2 text-base bg-white/85 dark:bg-card/90 border-border/50 focus-visible:ring-primary/30 rounded-xl backdrop-blur-sm"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      onClick={openChatFromComposer}
                      className="absolute right-1.5 h-9 w-9 rounded-xl"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div >
  );
};
export default Index;
