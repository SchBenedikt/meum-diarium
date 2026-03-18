import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { MapPin, BookOpen, ArrowRight, Users, Scroll, Clock, Award, Sparkles, Crown, Landmark, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { works as baseWorks } from '@/data/works';
import slugify from 'slugify';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Author, BlogPost, Work } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedWork } from '@/lib/translator';
import { usePosts } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { PageContent } from '@/types/page';
import { useAuthorDetails } from './useAuthorDetails';
import { AuthorAboutHero } from '@/components/layout/AuthorAboutHero';
import { SEO } from '@/components/SEO';

export function SenecaAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);
  const authorDetails = useAuthorDetails(t);
  const baseUrl = 'https://meum-diarium.xn--schner-2za.de';

  useEffect(() => {
    setCurrentAuthor('seneca' as Author);

    async function translateContent() {
      setAuthorPage({
        slug: 'seneca',
        heroTitle: 'Lucius Annaeus Seneca',
        heroSubtitle: 'Stoischer Philosoph und Berater Neros',
        projectDescription: 'Der bedeutendste römische Stoiker und seine Weisheitslehren',
        highlights: []
      } as PageContent);

      if (!postsLoading && allPosts.length > 0) {
        const authorPostsList = allPosts.filter(p => p.author === 'seneca').slice(0, 3);
        setAuthorPosts(authorPostsList);
      }

      const translatedWorks = await Promise.all(
        Object.values(baseWorks).filter(w => w.author === 'seneca').map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
      );
      setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));
    }
    translateContent();
  }, [setCurrentAuthor, language, allPosts, postsLoading]);

  if (!authorInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Lade Inhalte...
      </div>
    );
  }

  const details = authorDetails.seneca;
  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return '—';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <SEO
        title={authorInfo ? `${authorInfo.name} – Über den Philosophen` : 'Über Seneca'}
        description={authorInfo?.description}
        author={authorInfo?.name}
        image={`${baseUrl}/images/seneca-hero.jpg`}
        type="website"
      />
      <main className="flex-1">
        <AuthorAboutHero
          authorInfo={authorInfo}
          authorPage={authorPage}
          language={language}
          birthPlace={details.birthPlace}
        />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="text-center">
            <h2 className="font-display text-4xl font-bold mb-4">Lucius Annaeus Seneca</h2>
            <p className="text-lg text-muted-foreground mb-8">
              4 v. Chr.–65 n. Chr. Der bedeutendste römische Stoiker, Berater Neros und Verfasser zahlreicher philosophischer Schriften.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/seneca">
                <Button className="gap-2">
                  Tagebuch lesen
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/seneca/chat">
                <Button variant="outline" className="gap-2">
                  Mit Seneca sprechen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}