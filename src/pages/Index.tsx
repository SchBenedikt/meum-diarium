import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/HeroSection';
import { BlogList } from '@/components/BlogList';
import { OverviewGuide } from '@/components/OverviewGuide';
import { LandingHero } from '@/components/LandingHero';
import { FeatureShowcase } from '@/components/home/FeatureShowcase';
import { useAuthor } from '@/context/AuthorContext';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Author } from '@/types/blog';
import { authors } from '@/data/authors';
import NotFound from './NotFound';
import { Button } from '@/components/ui/button';
import { MessageCircle, User, BookOpen, ArrowRight, Scroll, Crown, Gamepad2, Zap, History } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const { setCurrentAuthor, currentAuthor } = useAuthor();
  const { authorId } = useParams<{ authorId?: string }>();

  useEffect(() => {
    if (authorId && authors[authorId as Author]) {
      setCurrentAuthor(authorId as Author);
    } else if (!authorId) {
      setCurrentAuthor(null);
    }
  }, [authorId, setCurrentAuthor]);

  if (authorId && !authors[authorId as Author]) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {currentAuthor ? (
          <div>
            <HeroSection />

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 pt-8 md:-mt-12 relative z-10 pb-12">
              {/* Primary Feature - AI Chat */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="bg-gradient-to-br from-primary/10 via-card/60 to-background backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-primary/20 relative overflow-hidden group hover:border-primary/40 transition-all duration-700">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:scale-105 group-hover:-rotate-6 hidden sm:block">
                    <MessageCircle className="w-48 h-48 text-primary" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-primary/20 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform border border-primary/30">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1">KI-Konversation</p>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                          Sprich mit {authors[currentAuthor].name.split(' ')[0]}
                        </h2>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mb-8 font-light">
                      Stelle Fragen an {authors[currentAuthor].name} und erlebe ein Gespräch basierend auf authentischen historischen Quellen.
                    </p>

                    <div className="space-y-4 max-w-3xl">
                      <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent rounded-2xl group-hover/input:from-primary/20 transition-all" />
                        <div className="relative bg-secondary/50 backdrop-blur p-1 rounded-2xl border border-border/60 hover:border-primary/40 transition-all">
                          <div className="flex items-center gap-3 px-4 py-3">
                            <input
                              type="text"
                              placeholder={`Was möchtest du ${authors[currentAuthor].name.split(' ')[0]} fragen?`}
                              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 font-light"
                            />
                            <Link to={`/${currentAuthor}/chat`}>
                              <Button size="sm" className="rounded-lg gap-2">
                                <span className="hidden sm:inline">Chat öffnen</span>
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {[
                          'Erzähle von deinem Leben',
                          'Deine größten Erfolge',
                          'Das Römische Reich'
                        ].map((suggestion, i) => (
                          <Link 
                            key={i} 
                            to={`/${currentAuthor}/chat?q=${encodeURIComponent(suggestion)}`}
                            className="px-3 py-2 rounded-lg text-xs bg-secondary/40 border border-border/40 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all font-medium"
                          >
                            {suggestion}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Navigation Grid */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <History className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl font-bold">Erkunde {authors[currentAuthor].name}</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Biografie Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0 }}
                  >
                    <Link to={`/${currentAuthor}/about`} className="group block h-full">
                      <div className="h-full bg-card/60 backdrop-blur-md rounded-2xl p-6 border border-border/40 hover:border-primary/50 transition-all duration-300 flex flex-col">
                        <div className="p-2.5 bg-blue-500/10 rounded-lg mb-4 w-fit group-hover:bg-blue-500/20 transition-all">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                          Biografie
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-1">
                          Leben, Werdegang und historischer Kontext
                        </p>
                        <div className="flex items-center text-xs font-semibold text-primary">
                          Erfahren <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>

                  {/* Werke Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                  >
                    <Link to={`/${currentAuthor}/about`} className="group block h-full">
                      <div className="h-full bg-card/60 backdrop-blur-md rounded-2xl p-6 border border-border/40 hover:border-primary/50 transition-all duration-300 flex flex-col">
                        <div className="p-2.5 bg-purple-500/10 rounded-lg mb-4 w-fit group-hover:bg-purple-500/20 transition-all">
                          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                          Werke
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-1">
                          Literarische Meisterwerke und Schriften
                        </p>
                        <div className="flex items-center text-xs font-semibold text-primary">
                          Entdecken <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>

                  {/* Tagebuch Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link to={`/${currentAuthor}`} className="group block h-full">
                      <div className="h-full bg-card/60 backdrop-blur-md rounded-2xl p-6 border border-border/40 hover:border-primary/50 transition-all duration-300 flex flex-col">
                        <div className="p-2.5 bg-green-500/10 rounded-lg mb-4 w-fit group-hover:bg-green-500/20 transition-all">
                          <Scroll className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                          Tagebuch
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-1">
                          Einträge mit Tagebuch- und wissenschaftlicher Perspektive
                        </p>
                        <div className="flex items-center text-xs font-semibold text-primary">
                          Lesen <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Secondary Features */}
              <div className="grid gap-4 md:grid-cols-2 mb-16">
                {/* Timeline Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                >
                  <Link to="/timeline" className="group block h-full">
                    <div className="h-full bg-card/60 backdrop-blur-md rounded-2xl p-6 border border-border/40 hover:border-primary/50 transition-all duration-300 flex flex-col">
                      <div className="p-2.5 bg-amber-500/10 rounded-lg mb-4 w-fit group-hover:bg-amber-500/20 transition-all">
                        <History className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        Chronologie
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">
                        Interaktive Zeitlinie aller Ereignisse
                      </p>
                      <div className="flex items-center text-xs font-semibold text-primary">
                        Erkunden <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Game Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Link to={`/${currentAuthor}/simulation`} className="group block h-full">
                    <div className="h-full bg-gradient-to-br from-amber-500/10 via-card/60 to-background backdrop-blur-md rounded-2xl p-6 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 flex flex-col">
                      <div className="p-2.5 bg-amber-500/20 rounded-lg mb-4 w-fit group-hover:bg-amber-500/30 transition-all">
                        <Gamepad2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="font-display text-lg font-bold mb-2 text-amber-700 dark:text-amber-300 group-hover:text-amber-600 transition-colors">
                        Interaktives Spiel
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">
                        Erlebe Geschichte durch Entscheidungen
                      </p>
                      <div className="flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
                        Spielen <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>

              {/* Content Sections */}
              <div className="space-y-16 border-t border-border/30 pt-12">
                <OverviewGuide />
                <BlogList />
              </div>
            </div>
          </div>
        ) : (
          <LandingHero />
        )}
      </main >
      <Footer />
    </div >
  );
};

export default Index;
