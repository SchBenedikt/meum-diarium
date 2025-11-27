import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/HeroSection';
import { AuthorIntro } from '@/components/AuthorIntro';
import { BlogList } from '@/components/BlogList';
import { LandingHero } from '@/components/LandingHero';
import { useAuthor } from '@/context/AuthorContext';

const Index = () => {
  const { currentAuthor } = useAuthor();

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
