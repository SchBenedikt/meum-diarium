import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/HeroSection';
import { AuthorIntro } from '@/components/AuthorIntro';
import { BlogList } from '@/components/BlogList';
import { LandingHero } from '@/components/LandingHero';
import { useAuthor } from '@/context/AuthorContext';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Author } from '@/types/blog';
import { authors } from '@/data/authors';
import NotFound from './NotFound';
import { AuthorGrid } from '@/components/AuthorGrid';

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
          <>
            <HeroSection />
            <AuthorIntro />
            <BlogList />
            <AuthorGrid />
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
