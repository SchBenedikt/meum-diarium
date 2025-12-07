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

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 -mt-12 relative z-10 pb-12">
              {/* Dashboard Grid */}
              <div className="grid gap-6 md:grid-cols-3 mb-16">

                {/* Chat Feature (Mock) */}
                <div className="md:col-span-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 border border-primary/20 relative overflow-hidden group shadow-lg shadow-primary/5">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MessageCircle className="w-32 h-32 text-primary" />
                  </div>
                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <MessageCircle className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-display font-medium text-foreground">
                          Mit {authors[currentAuthor].name} sprechen
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                        Stellen Sie Fragen an den berühmten Feldherrn persönlich. Eine KI-gestützte Konversation basierend auf seinen authentischen Schriften.
                      </p>
                    </div>

                    <div className="space-y-4 w-full">
                      <div className="w-full bg-background/50 backdrop-blur-sm p-1 rounded-xl border border-primary/10 shadow-sm transition-all hover:bg-background/80 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder={`Frage ${authors[currentAuthor].name.split(' ').pop()} etwas...`}
                            className="w-full pl-4 pr-12 py-2.5 rounded-lg bg-transparent border-none outline-none text-base placeholder:text-muted-foreground/50"
                          />
                          <Link to={`/${currentAuthor}/chat`} className="absolute right-1">
                            <Button size="icon" className="h-8 w-8 rounded-lg shadow-sm">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Suggestion Chips */}
                      <div className="flex flex-wrap gap-2">
                        {['Erzähl mir von Gallien', 'Wer war Kleopatra?', 'Reform des Kalenders'].map((suggestion, i) => (
                          <Link key={i} to={`/${currentAuthor}/chat?q=${encodeURIComponent(suggestion)}`} className="px-3 py-1 rounded-full bg-background/40 border border-primary/10 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all">
                            {suggestion}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Biography Quick Link */}
                <Link to={`/${currentAuthor}/about`} className="group md:col-span-1">
                  <div className="h-full bg-card hover:bg-secondary/40 border border-border/50 hover:border-primary/20 transition-all rounded-xl p-6 flex flex-col items-start shadow-sm hover:shadow-md">
                    <div className="p-3 bg-secondary/50 rounded-lg mb-4 group-hover:bg-primary/10 transition-colors">
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
                  <div className="h-full bg-card hover:bg-secondary/40 border border-border/50 hover:border-primary/20 transition-all rounded-xl p-6 flex flex-col items-start shadow-sm hover:shadow-md">
                    <div className="p-3 bg-secondary/50 rounded-lg mb-4 group-hover:bg-primary/10 transition-colors">
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

                {/* Simulation Mode */}
                <Link to={`/${currentAuthor}/simulation`} className="group md:col-span-1">
                  <div className="h-full bg-gradient-to-br from-amber-900/10 to-orange-900/10 hover:from-amber-900/20 hover:to-orange-900/20 border border-amber-500/20 hover:border-amber-500/40 transition-all rounded-xl p-6 flex flex-col items-start shadow-sm hover:shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Crown className="w-24 h-24 text-amber-500 rotate-12" />
                    </div>
                    <div className="p-3 bg-amber-500/20 rounded-lg mb-4 group-hover:bg-amber-500/30 transition-colors z-10">
                      <Gamepad2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors z-10">
                      Historische Spiele
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1 z-10">
                      Erlebe Geschichte aus meiner Sicht.
                      <span className="block mt-1 text-xs font-semibold text-amber-500/80">3 Szeanrien verfügbar</span>
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary mt-auto z-10">
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
