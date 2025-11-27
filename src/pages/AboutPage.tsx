import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, MapPin, BookOpen, Award, ArrowRight, Users, Scroll, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { posts } from '@/data/posts';
import { authors } from '@/data/authors';
import { motion } from 'framer-motion';

const authorDetails: Record<string, {
  birthPlace: string;
  achievements: string[];
  works: string[];
  timeline: { year: string; event: string }[];
}> = {
  caesar: {
    birthPlace: 'Rom, Römische Republik',
    achievements: [
      'Eroberung Galliens (58-50 v. Chr.)',
      'Sieg im Bürgerkrieg gegen Pompeius',
      'Kalendenreform (Julianischer Kalender)',
      'Dictator perpetuo',
    ],
    works: ['De Bello Gallico', 'De Bello Civili'],
    timeline: [
      { year: '100 v. Chr.', event: 'Geburt in Rom' },
      { year: '63 v. Chr.', event: 'Pontifex Maximus' },
      { year: '58-50 v. Chr.', event: 'Gallischer Krieg' },
      { year: '49 v. Chr.', event: 'Rubikon' },
      { year: '44 v. Chr.', event: 'Ermordung' },
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
    works: ['De Oratore', 'De Re Publica', 'De Officiis', 'Philippicae'],
    timeline: [
      { year: '106 v. Chr.', event: 'Geburt in Arpinum' },
      { year: '63 v. Chr.', event: 'Konsulat' },
      { year: '58 v. Chr.', event: 'Exil' },
      { year: '43 v. Chr.', event: 'Tod' },
    ],
  },
  augustus: {
    birthPlace: 'Rom, Römische Republik',
    achievements: [
      'Erster römischer Kaiser',
      'Begründer des Prinzipats',
      'Pax Romana',
      'Monumentale Bauprogramme',
    ],
    works: ['Res Gestae Divi Augusti'],
    timeline: [
      { year: '63 v. Chr.', event: 'Geburt' },
      { year: '44 v. Chr.', event: 'Adoption durch Caesar' },
      { year: '31 v. Chr.', event: 'Schlacht bei Actium' },
      { year: '27 v. Chr.', event: 'Titel Augustus' },
      { year: '14 n. Chr.', event: 'Tod' },
    ],
  },
  seneca: {
    birthPlace: 'Córdoba, Hispanien',
    achievements: [
      'Führender Vertreter der Stoa',
      'Berater Kaiser Neros',
      'Einflussreicher Dramatiker',
      'Meister des philosophischen Essays',
    ],
    works: ['Epistulae Morales', 'De Brevitate Vitae', 'De Clementia', 'Medea'],
    timeline: [
      { year: '4 v. Chr.', event: 'Geburt' },
      { year: '41 n. Chr.', event: 'Exil nach Korsika' },
      { year: '54 n. Chr.', event: 'Berater Neros' },
      { year: '65 n. Chr.', event: 'Erzwungener Tod' },
    ],
  },
};

// General About Page when no author is selected
function GeneralAboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="py-16 hero-gradient">
          <div className="container mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl mb-4"
            >
              Über Meum Diarium
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Ein interaktives Bildungsprojekt, das die Geschichte 
              des antiken Roms lebendig macht.
            </motion.p>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BookOpen, title: 'Zwei Perspektiven', desc: 'Tagebuch und wissenschaftlich' },
                { icon: Users, title: 'Vier Autoren', desc: 'Caesar, Cicero, Augustus, Seneca' },
                { icon: Clock, title: '170+ Jahre', desc: 'Geschichte zum Erleben' },
                { icon: Scroll, title: 'Authentisch', desc: 'Historisch fundiert' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6"
                >
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

        {/* Content */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto max-w-3xl">
            <div className="prose-blog">
              <h2>Das Projekt</h2>
              <p>
                Meum Diarium bietet einen einzigartigen Zugang zur römischen Geschichte. 
                Durch persönliche Tagebucheinträge und wissenschaftliche Analysen 
                werden historische Ereignisse lebendig.
              </p>

              <h2>Die Perspektiven</h2>
              <p>
                <strong>Tagebuch-Perspektive:</strong> Erlebe Geschichte aus der Ich-Perspektive 
                der antiken Persönlichkeiten – authentisch, persönlich und manchmal humorvoll.
              </p>
              <p>
                <strong>Wissenschaftliche Perspektive:</strong> Neutrale, sachliche Darstellungen 
                mit historischen Quellen und akademischen Belegen.
              </p>

              <h2>Die Autoren</h2>
              <p>
                Entdecke die Tagebücher von vier bedeutenden Persönlichkeiten des antiken Roms:
              </p>
            </div>

            {/* Author cards */}
            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              {Object.values(authors).map((author) => (
                <Link 
                  key={author.id}
                  to="/"
                  className="card-elevated flex items-center gap-4 hover:border-primary/50 transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={author.heroImage} 
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
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

// Author-specific About Page
function AuthorAboutPage() {
  const { currentAuthor, authorInfo } = useAuthor();
  
  if (!currentAuthor || !authorInfo) return null;
  
  const details = authorDetails[currentAuthor];
  const authorPosts = posts.filter(p => p.author === currentAuthor);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto">
          {/* Hero */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
                {authorInfo.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                {authorInfo.title}
              </p>
              <p className="text-muted-foreground mb-6">
                {authorInfo.years}
              </p>
              <p className="text-lg text-muted-foreground/80 leading-relaxed">
                {authorInfo.description}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
                <img 
                  src={authorInfo.heroImage}
                  alt={authorInfo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-sm text-foreground/70">{authorInfo.latinName}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Info cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card-elevated !p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">Lebensdaten</span>
                  </div>
                  <p className="text-muted-foreground">{authorInfo.years}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="card-elevated !p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">Geburtsort</span>
                  </div>
                  <p className="text-muted-foreground">{details?.birthPlace}</p>
                </motion.div>
              </div>

              {/* Achievements */}
              {details?.achievements && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl font-medium">Errungenschaften</h2>
                  </div>
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

              {/* Works */}
              {details?.works && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl font-medium">Werke</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {details.works.map((work, i) => (
                      <span 
                        key={i} 
                        className="px-4 py-2 rounded-full font-display italic text-sm bg-primary/10 text-primary"
                      >
                        {work}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Related posts */}
              {authorPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-display text-xl font-medium mb-4">Tagebucheinträge</h2>
                  <div className="space-y-3">
                    {authorPosts.slice(0, 3).map((post) => (
                      <Link 
                        key={post.id}
                        to={`/post/${post.slug}`}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                      >
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

            {/* Timeline */}
            {details?.timeline && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-xl font-medium mb-6">Lebenslauf</h2>
                <div className="relative pl-6 border-l-2 border-primary/20">
                  {details.timeline.map((item, i) => (
                    <div key={i} className="relative mb-6 last:mb-0">
                      <div className="absolute -left-[25px] h-3 w-3 rounded-full bg-primary" />
                      <p className="text-sm font-semibold mb-1 text-primary">
                        {item.year}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.event}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AboutPage() {
  const { currentAuthor } = useAuthor();
  
  if (!currentAuthor) {
    return <GeneralAboutPage />;
  }
  
  return <AuthorAboutPage />;
}
