import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { authors as baseAuthors } from '@/data/authors';
import { Author, Work } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, User, CheckCircle, ListTree, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import NotFound from './NotFound';
import slugify from 'slugify';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedWork, getTranslatedAuthor } from '@/lib/translator';
import { works as baseWorks } from '@/data/works';
import { PageHero } from '@/components/layout/PageHero';

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
      <main className="flex-1 pb-12">
        <PageHero
          eyebrow={author.title}
          title={work.title}
          description={work.summary}
          backgroundImage={author.heroImage}
          kicker={
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"><Calendar className="h-3.5 w-3.5" />{work.year}</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50"><User className="h-3.5 w-3.5" />{author.name}</span>
            </div>
          }
        />

        <section className="section-shell -mt-10 sm:-mt-14">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            <article>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card prose-blog text-lg max-w-none">
                <p className="lead text-xl !text-foreground !mb-8">{work.summary}</p>

                <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-10">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-display text-lg font-medium text-primary !mt-0 !mb-1">{t('work_key_takeaway')}</h3>
                      <p className="!mb-0 text-primary/80">{work.takeaway}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <ListTree className="h-5 w-5 text-primary" />
                  <h2 className="!mt-0 !mb-0">{t('structure')}</h2>
                </div>

                <div className="space-y-4">
                  {work.structure.map((part, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                      <h4 className="font-semibold !mt-0 !mb-1">{part.title}</h4>
                      <p className="!mb-0 text-sm text-muted-foreground">{part.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={author.heroImage} alt={author.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{author.name}</p>
                      <p className="text-xs text-muted-foreground">{author.title}</p>
                    </div>
                  </div>
                  <Link to={`/${author.id}/about`} className="w-full">
                    <Button variant="tonal" className="w-full">{t('moreAbout', { name: author.name.split(' ').pop() || '' })}</Button>
                  </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
