import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, MapPin, BookOpen, Award, ArrowRight, Users, Scroll, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { posts as basePosts } from '@/data/posts';
import { authors as baseAuthors } from '@/data/authors';
import { works as baseWorks } from '@/data/works';
import slugify from 'slugify';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Author, AuthorInfo, BlogPost, Work } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthors, getTranslatedAuthor, getTranslatedPost, getTranslatedWork } from '@/lib/translator';

const authorDetails: Record<string, {
  birthPlace: string;
  achievements: string[];
  timeline: { year: string; event: string }[];
}> = {
  caesar: {
    birthPlace: 'Rom, Römische Republik',
    achievements: [
      'Eroberung Galliens (58-50 v. Chr.)',
      'Sieg im Bürgerkrieg gegen Pompeius',
      'Kalenderreform (Julianischer Kalender)',
      'Diktator auf Lebenszeit',
    ],
    timeline: [
        { year: '100 v. Chr.', event: 'Geboren in Rom' },
        { year: '63 v. Chr.', event: 'Pontifex Maximus' },
        { year: '58-50 v. Chr.', event: 'Gallischer Krieg' },
        { year: '49 v. Chr.', event: 'Überschreitung des Rubikon' },
        { year: '44 v. Chr.', event: 'Ermordet' },
    ],
  },
  cicero: {
    birthPlace: 'Arpinum, Römische Republik',
    achievements: [
      'Aufdeckung der Catilinarischen Verschwörung',
      'Konsul im Jahr 63 v. Chr.',
      'Meister der lateinischen Rhetorik',
      'Begründer der lateinischen Philosophie',
    ],
    timeline: [
      { year: '106 v. Chr.', event: 'Geboren in Arpinum' },
      { year: '63 v. Chr.', event: 'Konsulat' },
      { year: '58 v. Chr.', event: 'Exil' },
      { year: '43 v. Chr.', event: 'Ermordet' },
    ],
  },
  augustus: {
    birthPlace: 'Rom, Römische Republik',
    achievements: [
      'Erster römischer Kaiser (Princeps)',
      'Begründer des Prinzipats und der Pax Romana',
      'Sieg über Antonius und Kleopatra bei Actium (31 v. Chr.)',
      'Umfangreiche Bautätigkeit in Rom ("Fand eine Stadt aus Ziegeln, hinterließ eine aus Marmor")',
    ],
    timeline: [
      { year: '63 v. Chr.', event: 'Geboren in Rom' },
      { year: '44 v. Chr.', event: 'Von Caesar adoptiert' },
      { year: '43 v. Chr.', event: 'Bildung des Zweiten Triumvirats' },
      { year: '31 v. Chr.', event: 'Schlacht bei Actium' },
      { year: '27 v. Chr.', event: 'Erhält den Titel "Augustus"' },
      { year: '14 n. Chr.', event: 'Gestorben in Nola' },
    ],
  },
  seneca: {
    birthPlace: 'Córdoba, Hispania',
    achievements: [
      'Führender Vertreter der Jüngeren Stoa',
      'Einflussreicher Berater des Kaisers Nero',
      'Autor bedeutender philosophischer Werke (z.B. "Briefe an Lucilius")',
      'Verfasser mehrerer Tragödien',
    ],
    timeline: [
      { year: 'ca. 4 v. Chr.', event: 'Geboren in Córdoba' },
      { year: '41 n. Chr.', event: 'Verbannt nach Korsika' },
      { year: '49 n. Chr.', event: 'Kehrt nach Rom zurück und wird Neros Lehrer' },
      { year: '54-62 n. Chr.', event: 'Führender Minister unter Nero' },
      { year: '65 n. Chr.', event: 'Zum Selbstmord gezwungen' },
    ],
  },
};

function GeneralAboutPage() {
  const { setCurrentAuthor } = useAuthor();
  const { language, t } = useLanguage();
  const [authors, setAuthors] = useState(baseAuthors);

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  useEffect(() => {
    async function translate() {
        const translated = await getTranslatedAuthors(language);
        setAuthors(translated);
    }
    translate();
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="py-16 pt-32 hero-gradient">
          <div className="container mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl mb-4">
              {t('aboutProject')}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('interactiveLearning')}
            </motion.p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BookOpen, title: t('twoPerspectives'), desc: t('diaryAndScientific') },
                { icon: Users, title: t('fourAuthors'), desc: t('caesarCiceroAugustusSeneca') },
                { icon: Clock, title: t('yearsOfHistory'), desc: t('historyToExperience') },
                { icon: Scroll, title: t('authentic'), desc: t('historicallySound') },
              ].map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-border">
          <div className="container mx-auto max-w-3xl">
            <div className="prose-blog">
              <h2>{t('theProject')}</h2>
              <p dangerouslySetInnerHTML={{ __html: t('projectDescription') }}/>
              <h2>{t('thePerspectives')}</h2>
              <p dangerouslySetInnerHTML={{ __html: t('diaryPerspective') }}/>
              <p dangerouslySetInnerHTML={{ __html: t('scientificPerspective') }}/>
              <h2>{t('theAuthors')}</h2>
              <p>{t('discoverAuthors')}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              {Object.values(authors).map((author) => (
                <Link key={author.id} to={`/${author.id}/about`} onClick={() => setCurrentAuthor(author.id)} className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={author.heroImage} alt={author.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display font-medium">{author.name}</p>
                    <p className="text-sm text-muted-foreground">{author.years}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function AuthorAboutPage() {
  const { setCurrentAuthor } = useAuthor();
  const { authorId } = useParams<{ authorId: string }>();
  const { language, t } = useLanguage();
  
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo | null>(null);
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);

  useEffect(() => {
    if (authorId) {
        setCurrentAuthor(authorId as Author);
        async function translateContent() {
            const translatedAuthor = await getTranslatedAuthor(language, authorId as Author);
            setAuthorInfo(translatedAuthor);

            const translatedPosts = await Promise.all(
                basePosts.filter(p => p.author === authorId).slice(0, 3).map(p => getTranslatedPost(language, p.author, p.slug))
            );
            setAuthorPosts(translatedPosts.filter((p): p is BlogPost => p !== null));

            const translatedWorks = await Promise.all(
                Object.values(baseWorks).filter(w => w.author === authorId).map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
            );
            setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));
        }
        translateContent();
    } else {
        setCurrentAuthor(null);
    }
  }, [authorId, setCurrentAuthor, language]);
  
  if (!authorId || !authorInfo) {
      return <GeneralAboutPage />;
  }
  
  const details = authorDetails[authorId];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-28 pb-12">
        <div className="container mx-auto">
          <div className="mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start gap-6">
              <img src={authorInfo.heroImage} alt={authorInfo.name} className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-lg" />
              <div className="flex-1">
                <h1 className="font-display text-4xl md:text-5xl mb-2">{authorInfo.name}</h1>
                <p className="text-xl text-muted-foreground mb-2">{authorInfo.title}</p>
                <p className="text-muted-foreground mb-4">{authorInfo.years}</p>
              </div>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}} className="text-lg text-muted-foreground/80 leading-relaxed max-w-3xl mt-4">
              {authorInfo.description}
            </motion.p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-5 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-primary" /></div>
                    <span className="font-medium">{t('lifespan')}</span>
                  </div>
                  <p className="text-muted-foreground">{authorInfo.years}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><MapPin className="h-5 w-5 text-primary" /></div>
                    <span className="font-medium">{t('birthplace')}</span>
                  </div>
                  <p className="text-muted-foreground">{details?.birthPlace}</p>
                </motion.div>
              </div>

              {details?.achievements && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="flex items-center gap-2 mb-4"><Award className="h-5 w-5 text-primary" /><h2 className="font-display text-xl font-medium">{t('achievements')}</h2></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {details.achievements.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50">
                        <span className="h-2 w-2 rounded-full mt-2 flex-shrink-0 bg-primary" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {authorWorks.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="flex items-center gap-2 mb-4"><BookOpen className="h-5 w-5 text-primary" /><h2 className="font-display text-xl font-medium">{t('works')}</h2></div>
                  <div className="flex flex-wrap gap-2">
                    {authorWorks.map((work, i) => (
                      <Link key={i} to={`/${work.author}/works/${slugify(work.title, { lower: true, strict: true })}`} className="px-4 py-2 rounded-full font-display italic text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        {work.title}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {authorPosts.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="font-display text-xl font-medium mb-4">{t('diaryEntries')}</h2>
                  <div className="space-y-3">
                    {authorPosts.map((post) => (
                      <Link key={post.id} to={`/${post.author}/${post.slug}`} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group">
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">{post.title}</p>
                          <p className="text-sm text-muted-foreground">{post.historicalDate}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              {details?.timeline && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="font-display text-xl font-medium mb-6">{t('timeline')}</h2>
                  <div className="relative pl-4 border-l border-dashed border-border">
                    {details.timeline.map((item, i) => (
                      <div key={i} className="relative mb-8 last:mb-0">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-background border-2 border-primary" />
                        <p className="text-sm font-semibold mb-1 ml-6 text-primary">{item.year}</p>
                        <p className="text-sm text-muted-foreground ml-6">{item.event}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AboutPage() {
  const { authorId } = useParams<{ authorId: string }>();

  if (authorId && baseAuthors[authorId as Author]) {
    return <AuthorAboutPage />;
  }

  return <GeneralAboutPage />;
}
