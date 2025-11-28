import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { works } from '@/data/works';
import { authors } from '@/data/authors';
import { Author, Work } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, Clock, BookOpen, User, CheckCircle, ListTree, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import NotFound from './NotFound';
import slugify from 'slugify';

export default function WorkPage() {
  const { slug, authorId } = useParams<{ slug: string, authorId: string }>();
  const { setCurrentAuthor } = useAuthor();

  const work = slug ? works[slug] : undefined;
  const author = work ? authors[work.author] : undefined;

  useEffect(() => {
    if (authorId && authors[authorId as Author]) {
      setCurrentAuthor(authorId as Author);
    }
  }, [authorId, setCurrentAuthor]);

  if (!work || !author) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-28 pb-12">
        <div className="container mx-auto">
          {/* Header */}
          <header className="mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link
                to={`/${author.id}/about`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück zur Autorenübersicht
              </Link>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-3">
                {work.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{work.year}</span>
                </div>
              </div>
            </motion.div>
          </header>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Main Content */}
            <article>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose-blog text-lg max-w-none"
              >
                <p className="lead text-xl !text-foreground !mb-8">{work.summary}</p>
                
                <div className="p-6 rounded-2xl bg-primary/10 mb-10">
                   <div className="flex items-start gap-4">
                     <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                     <div>
                       <h3 className="font-display text-lg font-medium text-primary !mt-0 !mb-1">Kernaussage</h3>
                       <p className="!mb-0 text-primary/80">{work.takeaway}</p>
                     </div>
                   </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <ListTree className="h-5 w-5 text-primary" />
                  <h2 className="!mt-0 !mb-0">Struktur des Werkes</h2>
                </div>

                <div className="space-y-4">
                  {work.structure.map((part, index) => (
                    <div key={index} className="p-4 border-l-2 border-border/70">
                      <h4 className="font-semibold !mt-0 !mb-1">{part.title}</h4>
                      <p className="!mb-0 text-sm text-muted-foreground">{part.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="sidebar-card"
                  >
                   <div className="flex items-center gap-3 mb-4">
                    <img src={author.heroImage} alt={author.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{author.name}</p>
                      <p className="text-xs text-muted-foreground">{author.title}</p>
                    </div>
                  </div>
                  <Link to={`/${author.id}/about`} className="w-full">
                    <div className="btn-secondary w-full text-sm py-2">
                        Mehr über {author.name.split(' ').pop()}
                    </div>
                  </Link>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="sidebar-card"
                  >
                  <h3 className="font-display text-lg font-medium mb-4">
                    Weitere Werke
                  </h3>
                   <div className="space-y-2">
                    {Object.values(works)
                      .filter(w => w.author === authorId && w.title !== work.title)
                      .slice(0, 4)
                      .map((relatedWork) => (
                        <Link
                          key={relatedWork.title}
                          to={`/${relatedWork.author}/works/${slugify(relatedWork.title, { lower: true, strict: true })}`}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                         - {relatedWork.title}
                        </Link>
                      ))}
                  </div>
                 </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
