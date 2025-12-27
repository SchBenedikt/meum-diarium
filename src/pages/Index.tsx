import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/HeroSection';
import { BlogList } from '@/components/BlogList';
import { LandingHero } from '@/components/LandingHero';
import { FeatureShowcase } from '@/components/home/FeatureShowcase';
import { useAuthor } from '@/context/AuthorContext';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Author } from '@/types/blog';
import { authors } from '@/data/authors';
import NotFound from './NotFound';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';

const Index = () => {
  const { setCurrentAuthor, currentAuthor } = useAuthor();
  const { authorId } = useParams<{ authorId?: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');

  useEffect(() => {
    if (authorId && authors[authorId as Author]) {
      setCurrentAuthor(authorId as Author);
    } else if (!authorId) {
      setCurrentAuthor(null);
    }
  }, [authorId, setCurrentAuthor]);

  // const showTimelineCard = currentAuthor !== 'caesar'; // Removed as no longer used

  if (authorId && !authors[authorId as Author]) {
    return <NotFound />;
  }

  const author = currentAuthor ? authors[currentAuthor] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={author ? `${author.name} – Tagebuch & Kommentare` : undefined}
        description={author?.description}
        author={author?.name}
      />
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
                <div className="bg-card rounded-3xl p-8 sm:p-12 border border-border/60 relative overflow-hidden group transition-all duration-300">
                  {/* Decorative chat icon (kept, no gradients) */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-15 transition-all duration-700 group-hover:scale-105 group-hover:-rotate-6 hidden sm:block">
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
                      <div className="relative">
                          <div className="relative bg-secondary/50 p-1 rounded-2xl border border-border/60 hover:border-primary/40 transition-all">
                          <div className="flex items-center gap-3 px-4 py-3">
                            <input
                              type="text"
                              placeholder={`Was möchtest du ${authors[currentAuthor].name.split(' ')[0]} fragen?`}
                              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 font-light"
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

              {/* Minimal Tools Row */}
              <div className="mb-12">
                <div className="flex flex-wrap gap-3">
                  <Link to={`/${currentAuthor}/simulation`}>
                    <Button variant="secondary" className="rounded-lg gap-2">
                      Interaktives Spiel
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>



              {/* Content Sections */}
              <div className="space-y-16 border-t border-border/30 pt-12">
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
