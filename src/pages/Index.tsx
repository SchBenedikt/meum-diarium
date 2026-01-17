import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/HeroSection';
import { BlogList } from '@/components/BlogList';
import LandingHero from '@/components/LandingHero';
import { FeatureShowcase } from '@/components/home/FeatureShowcase';
import { useAuthor } from '@/context/AuthorContext';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Author } from '@/types/blog';
import { authors } from '@/data/authors';
import NotFound from './NotFound';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SimulationCarousel } from '@/components/simulation/SimulationCarousel';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthorInfo } from '@/lib/author-translator';

const Index = () => {
  const { setCurrentAuthor, currentAuthor } = useAuthor();
  const { authorId } = useParams<{ authorId?: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const { t } = useLanguage();

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
  const translatedAuthor = currentAuthor ? getTranslatedAuthorInfo(currentAuthor, t as any) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={translatedAuthor ? `${translatedAuthor.name} – ${t('caesar.diaryRecent')}` : undefined}
        description={translatedAuthor?.description}
        author={translatedAuthor?.name}
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
          <LandingHero />
        )}
      </main >
      <Footer />
    </div >
  );
};

export default Index;
