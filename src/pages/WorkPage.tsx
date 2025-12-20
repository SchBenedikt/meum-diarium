import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { authors as baseAuthors } from '@/data/authors';
import { Author, Work, AuthorInfo } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { 
  Calendar, 
  User, 
  CheckCircle, 
  ListTree, 
  ArrowLeft, 
  BookOpen, 
  Award, 
  Lightbulb, 
  Quote,
  Target,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import NotFound from './NotFound';
import slugify from 'slugify';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedWork, getTranslatedAuthor } from '@/lib/translator';
import { works as baseWorks } from '@/data/works';
import { workDetails } from '@/data/work-details';
import { PageHero } from '@/components/layout/PageHero';

export default function WorkPage() {
  const { slug, authorId } = useParams<{ slug: string, authorId: string }>();
  const { setCurrentAuthor } = useAuthor();
  const { language, t } = useLanguage();
  const [work, setWork] = useState<Work | null>(null);
  const [author, setAuthor] = useState<AuthorInfo | null>(null);
  const [otherWorks, setOtherWorks] = useState<Work[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['context']));
  const [loading, setLoading] = useState(true);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  };

  const iconMap: Record<string, any> = {
    Award,
    Quote,
    Target,
    MapPin,
    Lightbulb,
    BookOpen,
    Sparkles
  };

  useEffect(() => {
    if (authorId) {
      setCurrentAuthor(authorId as Author);
    }
  }, [authorId, setCurrentAuthor]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!slug || !authorId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const baseAuthor = baseAuthors[authorId as keyof typeof baseAuthors];
      const translatedAuthor = await getTranslatedAuthor(language, authorId as Author);
      if (active) {
        setAuthor(translatedAuthor ?? baseAuthor ?? null);
      }

      const translatedWork = await getTranslatedWork(language, slug);
      if (active) {
        setWork(translatedWork);
      }

      const relatedPromises = Object.entries(baseWorks)
        .filter(([key, w]) => w.author === authorId && key !== slug)
        .map(async ([key]) => await getTranslatedWork(language, key));

      const resolvedRelated = (await Promise.all(relatedPromises)).filter(Boolean) as Work[];
      if (active) {
        setOtherWorks(resolvedRelated.slice(0, 3));
        setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [slug, language, authorId]);

  if (loading) {
    return null;
  }

  if (!work || !author) {
    return <NotFound />;
  }

  const detail = slug ? workDetails[slug] : null;
  const translatedAuthor = author;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <PageHero
        title={work.title}
        description={work.summary}
        breadcrumbs={[
          { label: t('navHome') || 'Startseite', href: '/' },
          { label: translatedAuthor.name, href: `/${authorId}` },
          { label: t('worksTitle') || t('works') || 'Werke', href: `/${authorId}/works` },
          { label: work.title }
        ]}
      />

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Metadata Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Jahr</span>
                </div>
                <p className="text-xl font-bold text-foreground">{work.year}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Autor</span>
                </div>
                <p className="text-sm font-bold text-foreground truncate">{translatedAuthor.name}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Bücher</span>
                </div>
                <p className="text-xl font-bold text-foreground">{work.structure?.length || '—'}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Epoche</span>
                </div>
                <p className="text-xs font-bold text-foreground">1. Jh. v. Chr.</p>
              </motion.div>
            </div>

            {/* Summary */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="prose prose-blog dark:prose-invert max-w-none"
            >
              <div className="bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl">
                <p className="text-lg leading-relaxed">{work.summary}</p>
              </div>
            </motion.article>

            {/* Takeaway */}
            {work.takeaway && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card border border-border/50 rounded-3xl p-6 backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Warum es zählt</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Die Kernaussage destilliert das Werk auf seine Hauptbotschaft: Was Caesar rechtfertigt, welche Wirkung er sucht und welche Lesart er der Nachwelt vorgibt.
                      </p>
                    </div>
                    <h3 className="text-lg font-bold">Kernaussage</h3>
                    <p className="text-muted-foreground leading-relaxed">{work.takeaway}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Structure */}
            {work.structure && work.structure.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center">
                    <ListTree className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold">Struktur & Aufbau</h2>
                </div>
                <div className="space-y-3">
                  {work.structure.map((book, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors border border-border/30"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-bold text-foreground leading-relaxed">{book.title}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{book.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Dynamic Content from work-details.ts */}
            {detail && (
              <>
                {/* Context Section - Always expanded by default */}
                {detail.context && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-card border border-border/50 rounded-3xl overflow-hidden backdrop-blur-xl"
                  >
                    <button
                      onClick={() => toggleSection('context')}
                      className="w-full flex items-center justify-between p-8 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold">{detail.context.title}</h2>
                      </div>
                      {expandedSections.has('context') ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedSections.has('context') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 pb-8 space-y-6">
                            {detail.context.paragraphs.map((para, idx) => (
                              <p key={idx} className="text-muted-foreground leading-relaxed">
                                {para}
                              </p>
                            ))}

                            {detail.context.timeline && detail.context.timeline.length > 0 && (
                              <div className="mt-8 space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                  <Clock className="w-5 h-5 text-blue-500" />
                                  Zeitstrahl
                                </h3>
                                <div className="space-y-3">
                                  {detail.context.timeline.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex gap-4 p-4 rounded-xl bg-secondary/20 border border-border/30"
                                    >
                                      <div className="flex-shrink-0">
                                        <span className="inline-block px-3 py-1 rounded-lg bg-blue-500/20 text-blue-500 text-sm font-bold">
                                          {item.year}
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground leading-relaxed">
                                        {item.event}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.section>
                )}

                {/* Other Sections */}
                {detail.sections.map((section, idx) => {
                  const Icon = iconMap[section.icon] || BookOpen;
                  const sectionKey = section.title;
                  const isExpanded = expandedSections.has(sectionKey);

                  return (
                    <motion.section
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      className="bg-card border border-border/50 rounded-3xl overflow-hidden backdrop-blur-xl"
                    >
                      <button
                        onClick={() => toggleSection(sectionKey)}
                        className="w-full flex items-center justify-between p-8 hover:bg-secondary/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold">{section.title}</h2>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 pb-8 space-y-4">
                              {section.content.map((para, paraIdx) => (
                                <p key={paraIdx} className="text-muted-foreground leading-relaxed">
                                  {para}
                                </p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.section>
                  );
                })}

                {/* Literary Features */}
                {detail.literaryFeatures && detail.literaryFeatures.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                      </div>
                      <h2 className="text-2xl font-bold">Literarische Besonderheiten</h2>
                    </div>
                    <div className="grid gap-6">
                      {detail.literaryFeatures.map((feature, idx) => (
                        <div key={idx} className="space-y-3">
                          <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                          {feature.examples && feature.examples.length > 0 && (
                            <ul className="space-y-2 mt-3">
                              {feature.examples.map((example, exIdx) => (
                                <li
                                  key={exIdx}
                                  className="flex gap-3 text-sm text-muted-foreground"
                                >
                                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Key Moments */}
                {detail.keyMoments && detail.keyMoments.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-amber-500" />
                      </div>
                      <h2 className="text-2xl font-bold">Schlüsselmomente</h2>
                    </div>
                    <div className="space-y-6">
                      {detail.keyMoments.map((moment, idx) => (
                        <div
                          key={idx}
                          className="relative pl-8 pb-6 border-l-2 border-border/50 last:pb-0"
                        >
                          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-background" />
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="inline-block px-3 py-1 rounded-lg bg-amber-500/20 text-amber-500 text-xs font-bold">
                                {moment.date}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-foreground">{moment.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {moment.description}
                            </p>
                            <div className="mt-3 p-3 rounded-lg bg-secondary/20 border border-border/30">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Bedeutung:</span>{' '}
                                {moment.significance}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Quotes */}
                {detail.quotes && detail.quotes.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <Quote className="w-5 h-5 text-green-500" />
                      </div>
                      <h2 className="text-2xl font-bold">Berühmte Zitate</h2>
                    </div>
                    <div className="space-y-6">
                      {detail.quotes.map((quote, idx) => (
                        <div
                          key={idx}
                          className="relative p-6 rounded-2xl bg-card border border-border/50"
                        >
                          <div className="absolute top-4 right-4">
                            <Sparkles className="w-6 h-6 text-green-500/40" />
                          </div>
                          <blockquote className="space-y-4">
                            <p className="text-lg font-medium text-foreground italic leading-relaxed">
                              "{quote.latin}"
                            </p>
                            <p className="text-sm text-muted-foreground border-l-2 border-primary/50 pl-4">
                              {quote.translation}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Kontext:</span>{' '}
                              {quote.context}
                            </p>
                          </blockquote>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Impact */}
                {detail.impact && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">{detail.impact.title}</h2>
                    </div>
                    <div className="space-y-6">
                      {detail.impact.paragraphs.map((para, idx) => (
                        <p key={idx} className="text-muted-foreground leading-relaxed">
                          {para}
                        </p>
                      ))}

                      {detail.impact.highlights && detail.impact.highlights.length > 0 && (
                        <div className="mt-6 space-y-3">
                          {detail.impact.highlights.map((highlight, idx) => (
                            <div
                              key={idx}
                              className="flex gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20"
                            >
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <p className="text-sm font-medium text-foreground">{highlight}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border/50 rounded-3xl p-6 backdrop-blur-xl sticky top-24"
            >
              <h3 className="text-lg font-bold mb-4">Über den Autor</h3>
              <Link
                to={`/${authorId}`}
                className="group block space-y-4 hover:scale-[1.02] transition-transform"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/20">
                  <img
                    src={author.heroImage || author.image}
                    alt={translatedAuthor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {translatedAuthor.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {translatedAuthor.bio}
                  </p>
                </div>
              </Link>

              {/* Related Works */}
              {otherWorks.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <h4 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">
                    Weitere Werke
                  </h4>
                  <div className="space-y-3">
                    {otherWorks.map((otherwork) => {
                      if (!otherwork?.title) return null;
                      const otherSlug = slugify(otherwork.title, { lower: true, strict: true });
                      return (
                        <Link
                          key={otherSlug}
                          to={`/${authorId}/works/${otherSlug}`}
                          className="block p-3 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors border border-border/30"
                        >
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {otherwork.title}
                          </p>
                          {otherwork.year && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {otherwork.year}
                            </p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
