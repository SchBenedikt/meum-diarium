import { Footer } from '@/components/layout/Footer';
import { AuthorAboutHero } from '@/components/layout/AuthorAboutHero';
import { Button } from '@/components/ui/button';
import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePosts } from '@/hooks/use-posts';
import { Author, BlogPost } from '@/types/blog';
import { PageContent } from '@/types/page';
import { ArrowRight, BookOpen, Brain, Scale, Scroll, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sokratesPageData from '@/content/pages/author-about-sokrates.json';

export function SokratesAboutPage() {
  const { setCurrentAuthor, authorInfo } = useAuthor();
  const { language } = useLanguage();
  const { posts: allPosts, isLoading: postsLoading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [authorPage, setAuthorPage] = useState<PageContent | null>(null);

  useEffect(() => {
    setCurrentAuthor('sokrates' as Author);
    setAuthorPage(sokratesPageData as PageContent);

    if (!postsLoading && allPosts.length > 0) {
      setAuthorPosts(allPosts.filter((p) => p.author === 'sokrates').slice(0, 5));
    }
  }, [setCurrentAuthor, allPosts, postsLoading]);

  if (!authorInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Lade Inhalte...
      </div>
    );
  }

  const snapshots = [
    { label: 'Lebenszeit', value: '~470–399 v. Chr.', hint: 'Klassisches Athen' },
    { label: 'Methode', value: 'Dialektik & Maieutik', hint: 'Fragend-entwickelndes Gespräch' },
    { label: 'Leitgedanke', value: '„Ich weiß, dass ich nichts weiß“', hint: 'Sokratisches Nichtwissen' },
    { label: 'Orakel', value: 'Delphi', hint: 'Von Apollon als „weise“ bezeichnet' },
    { label: 'Prozess', value: '399 v. Chr.', hint: 'Anklage: Gottlosigkeit, Jugendverführung' },
    { label: 'Tod', value: 'Schierlingsbecher', hint: 'Überliefert bei Platon (Phaidon)' },
  ];

  const concepts = [
    {
      title: 'Sokrates und Apollon',
      summary:
        'Der delphische Orakelspruch wurde für Sokrates zum Ausgangspunkt seiner philosophischen Prüfung von Wissen, Meinung und Selbsttäuschung.',
      tag: 'Religionsgeschichte',
    },
    {
      title: 'Dialektik und Maieutik',
      summary:
        'Wissen entsteht im Dialog: durch Fragen, Präzisieren und Widerlegen statt durch bloße Belehrung. Erkenntnis wird aus dem Gegenüber „hervorgebracht“.',
      tag: 'Methode',
    },
    {
      title: 'Aporie',
      summary:
        'Viele Gespräche enden in Ratlosigkeit. Diese Aporie ist kein Scheitern, sondern der Beginn echten Denkens jenseits von Scheinwissen.',
      tag: 'Erkenntnistheorie',
    },
    {
      title: 'Apologie und Phaidon',
      summary:
        'Sokrates verteidigte sich selbst, akzeptierte das Urteil und entzog sich der Strafe nicht durch Flucht. Sein Tod wurde von Platon eindrucksvoll überliefert.',
      tag: 'Quellenlage',
    },
  ];

  const timeline = [
    { year: -470, title: 'Geburt in Athen (Alopeke)', note: 'Aufwachsen im Umfeld der attischen Demokratie' },
    { year: -430, title: 'Orakelspruch von Delphi', note: 'Philosophische Mission nimmt Gestalt an' },
    { year: -420, title: 'Öffentliche Dialoge', note: 'Prüfung ethischer Begriffe im Gespräch' },
    { year: -399, title: 'Gerichtsprozess in Athen', note: 'Selbstverteidigung in der Apologie' },
    { year: -399, title: 'Tod durch Schierling', note: 'Annahme des Urteils, überliefert im Phaidon' },
  ];

  const formatYear = (year: number) => (year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        <AuthorAboutHero authorInfo={authorInfo} authorPage={authorPage} language={language} birthPlace="Alopeke bei Athen" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="grid gap-20 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-20">
              {authorPosts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
                    <div className="flex items-center gap-4">
                      <Scroll className="h-6 w-6 text-primary" />
                      <div>
                        <h2 className="font-display text-3xl font-bold">Tagebucheinträge</h2>
                        <p className="text-sm text-muted-foreground mt-1">Sokrates in Dialog, Prozess und Philosophie</p>
                      </div>
                    </div>
                    <Button asChild variant="secondary" className="text-xs uppercase tracking-widest font-bold">
                      <Link to="/sokrates">
                        Alle Einträge <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className="grid gap-6">
                    {authorPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/sokrates/${post.slug}`}
                        className="card-modern card-hover-primary card-padding-lg group relative overflow-hidden block"
                      >
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3 gap-4">
                            <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">{post.title}</h3>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{post.historicalDate}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">{post.excerpt}</p>
                          <div className="flex items-center text-sm font-semibold text-primary gap-2">
                            <span>Eintrag lesen</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center gap-4 mb-10">
                  <Brain className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="font-display text-3xl font-bold">Kernideen</h2>
                    <p className="text-sm text-muted-foreground mt-1">Zentrale Motive des sokratischen Denkens</p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {concepts.map((item) => (
                    <article key={item.title} className="card-modern card-padding-lg">
                      <p className="text-xs uppercase tracking-wider text-primary mb-2">{item.tag}</p>
                      <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-10">
                  <Scale className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="font-display text-3xl font-bold">Prozess und letzte Jahre</h2>
                    <p className="text-sm text-muted-foreground mt-1">Von Delphi bis zum Phaidon</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {timeline.map((item) => (
                    <div key={`${item.year}-${item.title}`} className="card-modern card-padding-md">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <span className="text-sm text-primary font-medium">{formatYear(item.year)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <div className="lg:sticky lg:top-28 space-y-6">
                <div className="card-modern card-padding-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-xl font-bold">Auf einen Blick</h3>
                  </div>
                  <div className="space-y-3">
                    {snapshots.map((item) => (
                      <div key={item.label} className="border border-border/60 rounded-lg p-3 bg-muted/20">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                        <p className="font-semibold text-sm mt-1">{item.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.hint}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-modern card-padding-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-lg font-bold">Leitgedanke</h3>
                  </div>
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    „Ich weiß, dass ich nichts weiß.“ – Der Ausgangspunkt einer Philosophie, die auf Prüfung, Dialog und intellektueller Redlichkeit beruht.
                  </blockquote>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
