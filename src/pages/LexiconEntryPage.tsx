import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { lexicon } from '@/data/lexicon';
import { ArrowLeft, BookOpen } from 'lucide-react';
import NotFound from './NotFound';

export default function LexiconEntryPage() {
  const { slug } = useParams<{ slug: string }>();
  const entry = lexicon.find(e => e.slug === slug);

  if (!entry) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto max-w-3xl">
          <Link
            to="/lexicon"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zum Lexikon
          </Link>

          <article>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Lexikoneintrag</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl">{entry.term}</h1>
            </div>

            <div className="prose-blog text-lg">
              <p>{entry.definition}</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
