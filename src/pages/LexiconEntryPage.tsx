import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { lexicon } from '@/data/lexicon';
import { posts } from '@/data/posts';
import { ArrowLeft, BookOpen, Newspaper } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { motion } from 'framer-motion';
import NotFound from './NotFound';

export default function LexiconEntryPage() {
  const { slug } = useParams<{ slug: string }>();
  const entry = lexicon.find(e => e.slug === slug);

  const relatedPosts = useMemo(() => {
    if (!entry) return [];
    const searchTerm = entry.term.toLowerCase();
    return posts.filter(post => 
      post.content.diary.toLowerCase().includes(searchTerm) ||
      post.content.scientific.toLowerCase().includes(searchTerm)
    );
  }, [entry]);

  if (!entry) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/lexicon"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zum Lexikon
            </Link>

            <article className="mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Lexikoneintrag</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl">{entry.term}</h1>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose-blog text-lg"
              >
                <p>{entry.definition}</p>
              </motion.div>
            </article>
          </div>

          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Newspaper className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-medium">Relevante Einträge</h2>
              </div>
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6">
                  {relatedPosts.map((post, index) => (
                    <div key={post.id} className="w-[340px] flex-shrink-0">
                      <BlogCard post={post} perspective="diary" index={index} />
                    </div>
                  ))}
                </div>
                <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-background pointer-events-none md:hidden" />
              </div>
            </motion.section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
