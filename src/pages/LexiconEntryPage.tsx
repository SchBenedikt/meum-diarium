import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { lexicon } from '@/data/lexicon';
import { posts } from '@/data/posts';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { LexiconSidebar } from '@/components/LexiconSidebar';
import { motion } from 'framer-motion';
import NotFound from './NotFound';

export default function LexiconEntryPage() {
  const { slug } = useParams<{ slug: string }>();
  const entry = lexicon.find(e => e.slug === slug);

  const relatedPosts = useMemo(() => {
    if (!entry) return [];
    const searchTerm = entry.term.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.diary.toLowerCase().includes(searchTerm) ||
      post.content.scientific.toLowerCase().includes(searchTerm)
    ).slice(0, 5);
  }, [entry]);

  if (!entry) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto">
          <Link
            to="/lexicon"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zum Lexikon
          </Link>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            <article>
              <header className="mb-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 inline-block">
                    {entry.category}
                  </span>
                  <h1 className="font-display text-4xl md:text-5xl">{entry.term}</h1>
                </motion.div>
              </header>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose-blog text-lg"
              >
                <p>{entry.definition}</p>
              </motion.div>

              {relatedPosts.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-16"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl font-medium">Relevante Einträge</h2>
                  </div>
                  <div className="relative">
                    <div className="grid md:grid-cols-2 gap-6">
                      {relatedPosts.slice(0,2).map((post, index) => (
                        <BlogCard post={post} perspective="diary" index={index} />
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}
            </article>
            
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <LexiconSidebar entry={entry} />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
