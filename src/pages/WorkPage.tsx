import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { authors as baseAuthors } from '@/data/authors';
import { Author, Work } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, User, CheckCircle, ListTree, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import NotFound from './NotFound';
import slugify from 'slugify';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedWork, getTranslatedAuthor } from '@/lib/translator';
import { works as baseWorks } from '@/data/works';

export default function WorkPage() {
  const { slug, authorId } = useParams<{ slug: string, authorId: string }>();
  const { setCurrentAuthor } = useAuthor();
  const { language, t } = useLanguage();
  const [work, setWork] = useState<Work | null>(null);
  const [author, setAuthor] = useState(authorId ? baseAuthors[authorId as Author] : null);
  const [otherWorks, setOtherWorks] = useState<Work[]>([]);

  useEffect(() => {
    if (authorId) {
      setCurrentAuthor(authorId as Author);
    }
  }, [authorId, setCurrentAuthor]);
  
  useEffect(() => {
    async function translateContent() {
      if (slug) {
        const translatedWork = await getTranslatedWork(language, slug);
        setWork(translatedWork);

        if (translatedWork) {
            const translatedAuthor = await getTranslatedAuthor(language, translatedWork.author);
            setAuthor(translatedAuthor);

            const allAuthorWorks = Object.values(baseWorks).filter(w => w.author === translatedWork.author && w.title !== translatedWork.title);
            const translatedOtherWorks = await Promise.all(
                allAuthorWorks.slice(0, 4).map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
            );
            setOtherWorks(translatedOtherWorks.filter((w): w is Work => w !== null));
        }
      }
    }
    translateContent();
  }, [slug, language, authorId]);


  if (!work || !author) {
    // Show a loading state or return NotFound if fetch is complete but no work
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-28 pb-12">
        <div className="container mx-auto">
          <header className="mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link to={`/${author.id}/about`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                <ArrowLeft className="h-4 w-4" />
                {t('backToAuthorOverview')}
              </Link>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-3">{work.title}</h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{author.name}</span></div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{work.year}</span></div>
              </div>
            </motion.div>
          </header>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            <article>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="prose-blog text-lg max-w-none">
                <p className="lead text-xl !text-foreground !mb-8">{work.summary}</p>
                
                <div className="p-6 rounded-2xl bg-primary/10 mb-10">
                   <div className="flex items-start gap-4">
                     <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                     <div>
                       <h3 className="font-display text-lg font-medium text-primary !mt-0 !mb-1">Zentrale Aussage</h3>
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

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="sidebar-card">
                   <div className="flex items-center gap-3 mb-4">
                    <img src={author.heroImage} alt={author.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{author.name}</p>
                      <p className="text-xs text-muted-foreground">{author.title}</p>
                    </div>
                  </div>
                  <Link to={`/${author.id}/about`} className="w-full">
                    <Button variant="secondary" className="w-full">{t('moreAbout', { name: author.name.split(' ').pop() || ''})}</Button>
                  </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sidebar-card">
                  <h3 className="font-display text-lg font-medium mb-4">{t('otherWorks')}</h3>
                   <div className="space-y-2">
                    {otherWorks.map((relatedWork) => (
                        <Link key={relatedWork.title} to={`/${relatedWork.author}/works/${slugify(relatedWork.title, { lower: true, strict: true })}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
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
