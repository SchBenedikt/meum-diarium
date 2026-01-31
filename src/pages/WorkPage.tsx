import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { authors as baseAuthors } from '@/data/authors';
import { works as baseWorks } from '@/data/works';
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
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import NotFound from './NotFound';
import slugify from 'slugify';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedWork, getTranslatedAuthor } from '@/lib/translator';
import { fetchWork, fetchWorkDetails, fetchWorks } from '@/lib/api';
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
  const [details, setDetails] = useState<any | null>(null);

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

      // Load work base + translations from API, fallback to local data
      try {
        const data = await fetchWork(slug);
        const lang = language.split('-')[0];
        
        // Fallback to baseWorks if structure is missing
        const baseWork = baseWorks[slug as keyof typeof baseWorks];
        
        if (data?.translations && data.translations[lang]) {
          const tr = data.translations[lang];
          setWork({
            ...data,
            title: tr.title || data.title,
            summary: tr.summary || data.summary,
            takeaway: tr.takeaway || data.takeaway,
            structure: tr.structure || data.structure || baseWork?.structure,
          });
        } else {
          setWork({
            ...data,
            structure: data.structure || baseWork?.structure,
          });
        }
      } catch (e) {
        setWork(null);
      }

      // Load details JSON (language-specific if available)
      try {
        const det = await fetchWorkDetails(slug);
        if (det) {
          const lang = language.split('-')[0];
          setDetails(det[lang] || det.de || det);
        } else {
          setDetails(null);
        }
      } catch {
        setDetails(null);
      }

      // Related works (API list with local fallback)
      try {
        const list = await fetchWorks();
        const related = (list || [])
          .filter((w: any) => w.author === authorId && w.slug !== slug)
          .slice(0, 3)
          .map((w: any) => ({ title: w.title, year: w.year } as Work));
        setOtherWorks(related);
      } catch {
        // Fallback to local works data
        const related = Object.entries(localWorks)
          .filter(([workSlug, w]) => w.author === authorId && workSlug !== slug)
          .slice(0, 3)
          .map(([_, w]) => ({ title: w.title, year: w.year } as Work));
        setOtherWorks(related);
      }

      setLoading(false);
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

  const detail = details;
  const translatedAuthor = author;

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <PageHero
        title={work.title}
        subtitle={work.year}
      />

      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Intro Section - Compact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 max-w-4xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Jahr</span>
              </div>
              <p className="text-lg font-bold text-foreground">{work.year}</p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <User className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Autor</span>
              </div>
              <p className="text-sm font-bold text-foreground truncate">{translatedAuthor.name}</p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Teile</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {work.structure?.length ? `${work.structure.length} Teile` : '—'}
              </p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Epoche</span>
              </div>
              <p className="text-sm font-bold text-foreground">1. Jh. v. Chr.</p>
            </div>
          </div>

          {/* Intro Text - Compact */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 backdrop-blur-xl">
            <p className="text-sm leading-relaxed text-foreground/90">{work.summary}</p>
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Takeaway - Compact */}
            {work.takeaway && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-6 backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide font-bold text-primary mb-2">Kernaussage</p>
                    <p className="text-sm font-bold text-foreground leading-relaxed">{work.takeaway}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Structure */}
            {work.structure && work.structure.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center">
                    <ListTree className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Struktur & Aufbau</h2>
                    <p className="text-sm text-muted-foreground mt-1">Die Gliederung des Werkes in {work.structure.length} Teil{work.structure.length > 1 ? 'e' : ''}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {work.structure.map((book, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors border border-border/30"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
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
                {/* Context Section - Most Important Content First */}
                {detail.context && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border/50 rounded-3xl overflow-hidden backdrop-blur-xl"
                  >
                    <button
                      onClick={() => toggleSection('context')}
                      className="w-full flex items-center justify-between p-8 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-left">
                          <h2 className="text-2xl font-bold">{detail.context.title}</h2>
                          <p className="text-sm text-muted-foreground mt-1">Verstehen des historischen Hintergrunds</p>
                        </div>
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
                          className="overflow-hidden border-t border-border/30"
                        >
                          <div className="px-8 py-8 space-y-6">
                            {detail.context.paragraphs.map((para, idx) => (
                              <p key={idx} className="text-foreground/85 leading-relaxed">
                                {para}
                              </p>
                            ))}

                            {detail.context.timeline && detail.context.timeline.length > 0 && (
                              <div className="mt-8 space-y-4 pt-8 border-t border-border/30">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                  <Clock className="w-5 h-5 text-blue-500" />
                                  Zeitlicher Überblick
                                </h3>
                                <div className="space-y-2">
                                  {detail.context.timeline.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex gap-4 p-3 rounded-lg bg-secondary/20 border border-border/30 text-sm"
                                    >
                                      <span className="inline-block px-2 py-1 rounded-lg bg-blue-500/20 text-blue-500 font-bold whitespace-nowrap">
                                        {item.year}
                                      </span>
                                      <p className="text-foreground/85">
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

                {/* Book Chapters / Parts Description */}
                {detail.bookChapters && detail.bookChapters.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-card border border-border/50 rounded-3xl overflow-hidden backdrop-blur-xl"
                  >
                    <button
                      onClick={() => toggleSection('bookChapters')}
                      className="w-full flex items-center justify-between p-8 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div className="text-left">
                          <h2 className="text-2xl font-bold">Überblick der Bücher</h2>
                          <p className="text-sm text-muted-foreground mt-1">Was in jedem Teil des Werkes behandelt wird</p>
                        </div>
                      </div>
                      {expandedSections.has('bookChapters') ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedSections.has('bookChapters') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-border/30"
                        >
                          <div className="px-8 py-8 space-y-6">
                            {detail.bookChapters.map((chapter, idx) => (
                              <div
                                key={idx}
                                className="p-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <div className="inline-flex items-center gap-3">
                                      <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-600 font-bold text-sm">
                                        Buch {chapter.number}
                                      </span>
                                      {chapter.timeframe && (
                                        <span className="text-sm font-semibold text-muted-foreground">
                                          {chapter.timeframe}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{chapter.title}</h3>
                                <p className="text-foreground/85 leading-relaxed mb-4">{chapter.description}</p>
                                {chapter.keyEvents && chapter.keyEvents.length > 0 && (
                                  <div className="mt-4 space-y-2">
                                    <p className="text-sm font-semibold text-foreground">Wichtigste Ereignisse:</p>
                                    <ul className="space-y-1.5">
                                      {chapter.keyEvents.map((event, eventIdx) => (
                                        <li key={eventIdx} className="flex gap-2 text-sm text-foreground/85">
                                          <span className="text-indigo-500 font-bold">•</span>
                                          <span>{event}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
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
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="bg-card border border-border/50 rounded-3xl overflow-hidden backdrop-blur-xl"
                    >
                      <button
                        onClick={() => toggleSection(sectionKey)}
                        className="w-full flex items-center justify-between p-8 hover:bg-secondary/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-2xl font-bold">{section.title}</h2>
                            <p className="text-sm text-muted-foreground mt-1">Umfassende Analysen und Erläuterungen</p>
                          </div>
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
                            className="overflow-hidden border-t border-border/30"
                          >
                            <div className="px-8 py-8 space-y-5">
                              {section.content.map((para, paraIdx) => (
                                <p key={paraIdx} className="text-foreground/85 leading-relaxed">
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
                    transition={{ delay: 0.8 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Literarische Besonderheiten</h2>
                        <p className="text-sm text-muted-foreground mt-1">Stilmittel und Erzähltechniken des Werkes</p>
                      </div>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2">
                      {detail.literaryFeatures.map((feature, idx) => (
                        <div key={idx} className="space-y-3 pb-6 border-b border-border/30 md:border-0 last:border-0 md:last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                          </div>
                          <p className="text-foreground/85 leading-relaxed">
                            {feature.description}
                          </p>
                          {feature.examples && feature.examples.length > 0 && (
                            <ul className="space-y-2 mt-3">
                              {feature.examples.map((example, exIdx) => (
                                <li
                                  key={exIdx}
                                  className="flex gap-3 text-sm text-foreground/85"
                                >
                                  <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
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
                    transition={{ delay: 0.9 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Schlüsselmomente</h2>
                        <p className="text-sm text-muted-foreground mt-1">Wendepunkte und wichtige Szenen im Werk</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {detail.keyMoments.map((moment, idx) => (
                        <div
                          key={idx}
                          className="relative pl-8 pb-6 border-l-2 border-amber-500/30 last:pb-0"
                        >
                          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-background" />
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="inline-block px-3 py-1 rounded-lg bg-amber-500/20 text-amber-600 text-xs font-bold">
                                {moment.date}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-foreground">{moment.title}</h3>
                            <p className="text-foreground/85 leading-relaxed">
                              {moment.description}
                            </p>
                            <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                              <p className="text-sm text-foreground/90">
                                <span className="font-bold text-amber-600">Bedeutung:</span> {moment.significance}
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
                    transition={{ delay: 1.0 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <Quote className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Berühmte Zitate</h2>
                        <p className="text-sm text-muted-foreground mt-1">Prägende Aussagen aus dem Werk</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {detail.quotes.map((quote, idx) => (
                        <div
                          key={idx}
                          className="relative p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20"
                        >
                          <div className="absolute top-4 right-4">
                            <Sparkles className="w-5 h-5 text-green-500/40" />
                          </div>
                          <blockquote className="space-y-4">
                            <p className="text-lg font-medium text-foreground italic leading-relaxed">
                              "{quote.latin}"
                            </p>
                            <p className="text-foreground/85 border-l-2 border-green-500/50 pl-4">
                              {quote.translation}
                            </p>
                            <p className="text-sm text-foreground/80">
                              <span className="font-bold text-foreground">Kontext:</span>{' '}
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
                    transition={{ delay: 1.1 }}
                    className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-8 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{detail.impact.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">Wirkung und Erbe des Werkes</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {detail.impact.paragraphs.map((para, idx) => (
                        <p key={idx} className="text-foreground/85 leading-relaxed">
                          {para}
                        </p>
                      ))}

                      {detail.impact.highlights && detail.impact.highlights.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-primary/20 space-y-3">
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
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Über den Autor
              </h3>
              <Link
                to={`/${authorId}`}
                className="group block space-y-4 hover:scale-[1.02] transition-transform"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/20">
                  <img
                    src={author.heroImage}
                    alt={translatedAuthor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {translatedAuthor.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {translatedAuthor.description}
                  </p>
                </div>
              </Link>

              {/* Related Works */}
              {otherWorks.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <h4 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Weitere Werke
                  </h4>
                  <div className="space-y-2">
                    {otherWorks.map((otherwork) => {
                      if (!otherwork?.title) return null;
                      const otherSlug = slugify(otherwork.title, { lower: true, strict: true });
                      return (
                        <Link
                          key={otherSlug}
                          to={`/${authorId}/works/${otherSlug}`}
                          className="block p-3 rounded-xl bg-secondary/20 hover:bg-primary/10 transition-colors border border-border/30 hover:border-primary/50"
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
