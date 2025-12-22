import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { MapPin, BookOpen, ArrowRight, Users, Scroll, Clock, Award, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { authors as baseAuthors } from '@/data/authors';
import { works as baseWorks } from '@/data/works';
import slugify from 'slugify';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Author, AuthorInfo, BlogPost, Work } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthor, getTranslatedPost, getTranslatedWork } from '@/lib/translator';
import { usePosts } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { PageContent, PageLanguage } from '@/types/page';
import { useAuthorDetails } from './useAuthorDetails';

export function CiceroAboutPage() {
  const { setCurrentAuthor } = useAuthor();
  const { authorId } = useParams<{ authorId: string }>();
  const { language, t } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();

  const [authorInfo, setAuthorInfo] = useState<AuthorInfo | null>(null);
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorWorks, setAuthorWorks] = useState<Work[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);

  const authorDetails = useAuthorDetails(t);

  useEffect(() => {
    if (authorId === 'cicero') {
      setCurrentAuthor('cicero' as Author);
      async function translateContent() {
        const translatedAuthor = await getTranslatedAuthor(language, 'cicero' as Author);
        setAuthorInfo(translatedAuthor);

        if (!postsLoading) {
          const translatedPosts = await Promise.all(
            allPosts.filter(p => p.author === 'cicero').slice(0, 3).map(p => getTranslatedPost(language, p.author, p.slug))
          );
          setAuthorPosts(translatedPosts.filter((p): p is BlogPost => p !== null));
        }

        const translatedWorks = await Promise.all(
          Object.values(baseWorks).filter(w => w.author === 'cicero').map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
        );
        setAuthorWorks(translatedWorks.filter((w): w is Work => w !== null));

        try {
          const res = await fetch('/api/pages/author-about-cicero');
          if (res.ok) {
            const data: PageContent = await res.json();
            setAuthorPage(data);
          } else {
            setAuthorPage(null);
          }
        } catch {
          setAuthorPage(null);
        }
      }
      translateContent();
    }
  }, [authorId, setCurrentAuthor, language, allPosts, postsLoading]);

  if (!authorInfo) {
    return null;
  }

  const details = authorDetails.cicero;

  const ciceroSnapshots = [
    { label: 'Lebenszeit', value: '106–43 v. Chr.', hint: '63 Jahre' },
    { label: 'Konsulat', value: '63 v. Chr.', hint: 'Niederschlagung der Catilinarischen Verschwörung' },
    { label: 'Exil', value: '58–57 v. Chr.', hint: 'Wegen Hinrichtung der Verschwörer' },
    { label: 'Reden', value: '~100 erhalten', hint: 'Von >800 Reden' },
    { label: 'Briefe', value: '~900 erhalten', hint: 'Wichtigste Quelle für die Epoche' },
    { label: 'Phil. Werke', value: '13 Schriften', hint: 'Vermittlung griech. Philosophie' },
  ];

  const ciceroAchievements = [
    {
      title: 'Rhetorik als Waffe',
      summary: 'Perfektion der lateinischen Rhetorik – seine Reden gegen Catilina, Verres und Antonius sind zeitlose Meisterwerke der Überzeugungskunst.',
      tag: 'Rhetorik',
      icon: 'Users' as const,
    },
    {
      title: 'Philosophie für Rom',
      summary: 'Vermittlung griechischer Philosophie (Stoizismus, Akademie) in lateinischer Sprache – schuf das Vokabular für abstrakte Begriffe.',
      tag: 'Philosophie',
      icon: 'BookOpen' as const,
    },
    {
      title: 'Verteidiger der Republik',
      summary: 'Kämpfte bis zuletzt gegen die aufkommende Alleinherrschaft – seine Philippicae gegen Antonius kosteten ihn das Leben.',
      tag: 'Politik',
      icon: 'Award' as const,
    },
    {
      title: 'Briefe als Zeitdokument',
      summary: 'Über 900 erhaltene Briefe gewähren einzigartige Einblicke in das politische und private Leben der späten Republik.',
      tag: 'Quellen',
      icon: 'Scroll' as const,
    },
  ];

  const ciceroDebate = [
    {
      heading: 'Warum er bewundert wird',
      points: [
        'Größter Redner Roms – formte die lateinische Prosa und prägte die westliche Rhetorik.',
        'Verteidiger der Republik und der Rechtsstaatlichkeit gegen Tyrannen.',
        'Vermittler griechischer Philosophie und Schöpfer lateinischer Fachterminologie.',
        'Seine Briefe sind die wichtigste Quelle für die Epoche der Bürgerkriege.',
      ],
    },
    {
      heading: 'Warum er kritisiert wird',
      points: [
        'Ließ Catilina-Verschwörer ohne Gerichtsverfahren hinrichten – verfassungsrechtlich fragwürdig.',
        'Selbstüberschätzung und Eitelkeit – rühmte sich ständig seiner Taten.',
        'Taktisch ungeschickt – unterschätzte Caesar und überschätzte seine eigene Macht.',
        'Opportunismus: Wechselte zwischen politischen Lagern, je nach Vorteil.',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        {/* Cicero Hero */}
        <section className="relative h-[60vh] min-h-[500px] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
            <img
              src={authorInfo.heroImage}
              alt={authorInfo.name}
              className="w-full h-full object-cover scale-105 blur-[2px]"
            />
          </div>

          <div className="container mx-auto relative z-20 px-4 sm:px-6 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6">
                {authorInfo.years}
              </span>
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold mb-4 tracking-tighter text-foreground">
                {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.heroTitle || authorPage?.heroTitle || authorInfo.name}
              </h1>
              <p className="text-2xl sm:text-3xl text-muted-foreground font-display italic mb-6">
                {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.heroSubtitle || authorPage?.heroSubtitle || authorInfo.title}
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/60">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{details.birthPlace}</span>
                </div>
                <div className="h-1 w-12 bg-primary/30 rounded-full" />
                <p className="text-lg text-muted-foreground max-w-xl font-light leading-relaxed">
                  {authorPage?.translations?.[language.split('-')[0] as PageLanguage]?.projectDescription || authorPage?.projectDescription || authorInfo.description}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="grid gap-20 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-24">
              {/* Works Section */}
              {authorWorks.length > 0 && (
                <section>
                  <div className="flex items-center gap-6 mb-12">
                    <h2 className="font-display text-4xl font-bold">{t('works')}</h2>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {authorWorks.map((work, i) => (
                      <Link
                        key={i}
                        to={`/cicero/works/${slugify(work.title, { lower: true, strict: true })}`}
                        className="card-modern card-hover-primary card-padding-lg group relative overflow-hidden block"
                      >
                        <div className="relative z-10">
                          <BookOpen className="h-8 w-8 text-primary mb-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {work.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-3 mb-8 italic">
                            {work.summary}
                          </p>
                          <div className="flex items-center text-sm font-bold uppercase tracking-widest text-primary gap-2">
                            <span>{t('readMore')}</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Entries */}
              {authorPosts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-12">
                    <h2 className="font-display text-4xl font-bold">{t('diaryEntries')}</h2>
                    <Button asChild variant="ghost" className="text-primary hover:text-primary/80 uppercase tracking-widest font-bold text-xs">
                      <Link to="/cicero">
                        {t('viewAllEntries')} <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {authorPosts.map((post) => (
                      <Link key={post.id} to={`/${post.author}/${post.slug}`} className="group h-full">
                        <article className="card-modern card-hover-primary card-padding-md relative h-full overflow-hidden">
                          <div className="relative flex items-center justify-between gap-3 mb-4">
                            <h3 className="font-display text-2xl font-bold group-hover:text-primary transition-colors leading-tight">
                              {post.title}
                            </h3>
                            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                              {post.historicalDate}
                            </span>
                          </div>
                          <p className="relative text-base text-foreground/85 leading-relaxed line-clamp-3 mb-5">
                            {post.excerpt}
                          </p>
                          <div className="relative flex items-center justify-between text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary/60" />
                              {post.readingTime ? `${post.readingTime} min` : '5 min'} Lesedauer
                            </span>
                            <span className="inline-flex items-center text-primary font-semibold text-sm">
                              Weiterlesen
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="card-modern card-padding-md">
                  <h3 className="font-display text-2xl font-bold mb-5 text-primary">Kurzfakten</h3>
                  <div className="space-y-3 text-sm text-foreground/80">
                    {ciceroSnapshots.map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-4 border-b border-border/30 pb-2 last:border-0 last:pb-0">
                        <span className="font-semibold">{item.label}</span>
                        <div className="text-right space-y-0.5">
                          <p className="font-medium text-foreground">{item.value}</p>
                          <p className="text-xs text-muted-foreground">{item.hint}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {details.timeline && (
                  <div className="card-modern card-padding-lg md:p-10">
                    <h3 className="font-display text-3xl font-bold mb-10 flex items-center gap-4">
                      <Clock className="h-8 w-8 text-primary" />
                      {t('timeline')}
                    </h3>
                    <div className="relative pl-4 space-y-12">
                      <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
                      {details.timeline.map((item, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full border-2 border-primary bg-background" />
                          <div className="flex flex-col">
                            <span className="text-primary font-bold text-lg mb-1 tracking-tighter">{item.year}</span>
                            <span className="text-foreground/70 font-light leading-relaxed italic">{item.event}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cicero's Achievements */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Seine bleibenden Leistungen</h2>
              <p className="text-lg text-muted-foreground">Rhetorik, Philosophie und Politik – Ciceros Erbe für die westliche Zivilisation.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
              {ciceroAchievements.map((achievement) => {
                const IconComponent = achievement.icon === 'Users' ? Users : achievement.icon === 'BookOpen' ? BookOpen : achievement.icon === 'Award' ? Award : Scroll;
                return (
                  <div
                    key={achievement.title}
                    className="card-modern card-hover-primary card-padding-lg"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{achievement.tag}</span>
                      <IconComponent className="h-6 w-6 text-primary opacity-60" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{achievement.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{achievement.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Warum er polarisiert */}
        <section className="py-24 bg-surface-container-low/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Warum er polarisiert</h2>
              <p className="text-lg text-muted-foreground">Zwischen brillanter Rhetorik und politischem Opportunismus.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {ciceroDebate.map((block) => (
                <div
                  key={block.heading}
                  className="card-modern card-hover-primary card-padding-lg"
                >
                  <h3 className="font-display text-xl font-bold mb-4">{block.heading}</h3>
                  <div className="space-y-3">
                    {block.points.map((point, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed">
                        <span className="inline-block h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Legendäre Zitate */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4">Legendäre Zitate</h2>
              <p className="text-lg text-muted-foreground">Worte, die Jahrtausende überdauerten.</p>
            </div>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              {[{
                quote: 'Quo usque tandem abutere, Catilina, patientia nostra?',
                translation: 'Wie lange noch, Catilina, wirst du unsere Geduld missbrauchen?',
                when: '63 v. Chr., 1. Catilinaria',
                meaning: 'Der kraftvollste Redeauftakt der Antike – direkte Konfrontation als rhetorische Waffe.'
              }, {
                quote: 'O tempora, o mores!',
                translation: 'O Zeiten, o Sitten!',
                when: '63 v. Chr., Catilina',
                meaning: 'Klage über moralischen Verfall – ein zeitloser Ausruf, bis heute zitiert.'
              }, {
                quote: 'Salus populi suprema lex esto.',
                translation: 'Das Wohl des Volkes soll oberstes Gesetz sein.',
                when: 'De Legibus',
                meaning: 'Grundprinzip republikanischer Politik, das bis in moderne Verfassungen nachwirkt.'
              }].map((item) => (
                <div
                  key={item.quote}
                  className="card-modern card-hover-primary card-padding-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <Sparkles className="h-3.5 w-3.5" /> Impact
                    </span>
                    <span className="text-xs font-semibold text-primary/70">{item.when}</span>
                  </div>
                  <p className="text-lg font-display italic text-foreground/90 mb-1">{item.quote}</p>
                  <p className="text-base font-medium text-muted-foreground mb-4">{item.translation}</p>
                  <p className="text-sm text-foreground/85 leading-relaxed">{item.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
