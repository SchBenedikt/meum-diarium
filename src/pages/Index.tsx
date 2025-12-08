import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/HeroSection';
import { BlogList } from '@/components/BlogList';
import { LandingHero } from '@/components/LandingHero';
import { FeatureShowcase } from '@/components/home/FeatureShowcase';
import { useAuthor } from '@/context/AuthorContext';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Author } from '@/types/blog';
import { authors } from '@/data/authors';
import NotFound from './NotFound';
import { Button } from '@/components/ui/button';
import { MessageCircle, User, BookOpen, ArrowRight, Scroll, Crown, Gamepad2 } from 'lucide-react';

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
              {/* Dashboard Grid */}
              <div className="grid gap-6 md:grid-cols-3 mb-16">

                {/* Chat Feature - No gradient */}
                <div className="md:col-span-3 bg-card rounded-lg p-5 sm:p-8 border border-border relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                    <MessageCircle className="w-32 h-32 text-primary" />
                  </div>
                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MessageCircle className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-display font-medium text-foreground">
                          Mit {authors[currentAuthor].name} sprechen
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
                        Stellen Sie Fragen an {authors[currentAuthor].name.split(' ')[0]} persönlich. Eine KI-gestützte Konversation basierend auf authentischen Schriften.
                      </p>
                    </div>

                    <div className="space-y-4 w-full">
                      <div className="w-full bg-secondary/30 p-1 rounded-lg border border-border transition-all hover:bg-secondary/50 focus-within:ring-2 focus-within:ring-primary/20">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder={`Frage ${authors[currentAuthor].name.split(' ').pop()} etwas...`}
                            className="w-full pl-4 pr-12 py-2.5 rounded-lg bg-transparent border-none outline-none text-base placeholder:text-muted-foreground/50"
                          />
                          <Link to={`/${currentAuthor}/chat`} className="absolute right-1">
                            <Button size="icon" className="h-8 w-8 rounded-lg">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Suggestion Chips */}
                      <div className="flex flex-wrap gap-2">
                        {['Erzähl mir von deinem Leben', 'Was waren deine größten Erfolge?', 'Wie war das Römische Reich?'].map((suggestion, i) => (
                          <Link key={i} to={`/${currentAuthor}/chat?q=${encodeURIComponent(suggestion)}`} className="px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all">
                            {suggestion}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Biography Quick Link */}
                <Link to={`/${currentAuthor}/about`} className="group md:col-span-1">
                  <div className="h-full bg-card hover:bg-secondary/40 border border-border hover:border-primary/30 transition-all rounded-lg p-4 sm:p-6 flex flex-col items-start">
                    <div className="p-3 bg-secondary rounded-lg mb-4 group-hover:bg-primary/10 transition-colors">
                      <User className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                      Biografie & Lebenslauf
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      Erfahren Sie mehr über das Leben, die Errungenschaften und den historischen Kontext.
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary mt-auto">
                      Zum Profil <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>

                {/* Works Quick Link */}
                <Link to={`/${currentAuthor}/about`} className="group md:col-span-1">
                  <div className="h-full bg-card hover:bg-secondary/40 border border-border hover:border-primary/30 transition-all rounded-lg p-4 sm:p-6 flex flex-col items-start">
                    <div className="p-3 bg-secondary rounded-lg mb-4 group-hover:bg-primary/10 transition-colors">
                      <BookOpen className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                      Werke & Schriften
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      Entdecken Sie die literarischen Meisterwerke und politischen Schriften.
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary mt-auto">
                      Zu den Werken <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>

                {/* Simulation Mode - Brighter, no gradient */}
                <Link to={`/${currentAuthor}/simulation`} className="group md:col-span-1">
                  <div className="h-full bg-card hover:bg-amber-50 dark:hover:bg-amber-950/20 border border-border hover:border-amber-400/50 transition-all rounded-lg p-4 sm:p-6 flex flex-col items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Crown className="w-24 h-24 text-amber-500 rotate-12" />
                    </div>
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/40 transition-colors z-10">
                      <Gamepad2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-display text-xl font-medium mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors z-10">
                      Textbased Game
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1 z-10">
                      Erlebe Geschichte aus der Sicht von {authors[currentAuthor].name.split(' ')[0]}.
                      <span className="block mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">5 Szenarien verfügbar</span>
                    </p>
                    <div className="flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 mt-auto z-10">
                      Spielen <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </div>

              <div className="border-t border-border/50 pt-12">
                <BlogList />
              </div>
            </div>
          </div>
        ) : (
          <>
            <LandingHero />
            <FeatureShowcase />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
