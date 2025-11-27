import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/HeroSection';
import { AuthorIntro } from '@/components/AuthorIntro';
import { BlogList } from '@/components/BlogList';
import { LandingHero } from '@/components/LandingHero';
import { useAuthor } from '@/context/AuthorContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const { currentAuthor, setCurrentAuthor } = useAuthor();
  const location = useLocation();

  useEffect(() => {
    // If we navigate to the root path, we want to show the author selection (landing page)
    // unless an author is explicitly selected via interaction.
    // A simple way to handle this is to reset the author when the path is exactly "/"
    // and there's no state indicating a selection was just made.
    // However, the current logic in Header and AuthorSwitcher handles setting the author.
    // To show the landing page on root, we might need to clear the author.
    // A click on the logo already clears the author.
  }, [location, setCurrentAuthor]);


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {currentAuthor ? (
          <>
            <HeroSection />
            <AuthorIntro />
            <BlogList />
          </>
        ) : (
          <LandingHero />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
