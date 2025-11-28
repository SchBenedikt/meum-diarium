
import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, MapPin, BookOpen, Award, ArrowRight, Users, Scroll, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { posts } from '@/data/posts';
import { authors } from '@/data/authors';
import { works } from '@/data/works';
import slugify from 'slugify';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Author } from '@/types/blog';

const authorDetails: Record<string, {
  birthPlace: string;
  achievements: string[];
  timeline: { year: string; event: string }[];
}> = {
  caesar: {
    birthPlace: 'Roma, Res Publica Romana',
    achievements: [
      'Galliae expugnatio (58-50 a.C.n.)',
      'Victoria in bello civili contra Pompeium',
      'Kalendarii reformatio (Kalendarium Iulianum)',
      'Dictator perpetuo',
    ],
    timeline: [
        { year: '100 a.C.n.', event: 'Natus Romae' },
        { year: '63 a.C.n.', event: 'Pontifex Maximus' },
        { year: '58-50 a.C.n.', event: 'Bellum Gallicum' },
        { year: '49 a.C.n.', event: 'Rubiconem transit' },
        { year: '44 a.C.n.', event: 'Interfectus' },
    ],
  },
  cicero: {
    birthPlace: 'Arpinum, Res Publica Romana',
    achievements: [
      'Detectio coniurationis Catilinae',
      'Consul anno 63 a.C.n.',
      'Magister rhetoricae Latinae',
      'Fundator philosophiae Latinae',
    ],
    timeline: [
      { year: '106 a.C.n.', event: 'Natus Arpini' },
      { year: '63 a.C.n.', event: 'Consulatus' },
      { year: '58 a.C.n.', event: 'Exsilium' },
      { year: '43 a.C.n.', event: 'Interfectus' },
    ],
  },
  augustus: {
    birthPlace: 'Roma, Res Publica Romana',
    achievements: [
      'Primus imperator Romanus (Princeps)',
      'Creator Principatus et Pacis Romanae',
      'Victoria de Antonio et Cleopatra ad Actium (31 a.C.n.)',
      'Ampla opera aedificandi Romae ("Marmoream se relinquere, quam latericiam accepisset")',
    ],
    timeline: [
      { year: '63 a.C.n.', event: 'Natus Romae' },
      { year: '44 a.C.n.', event: 'A Caesare adoptatus' },
      { year: '43 a.C.n.', event: 'Creatio Secundi Triumviratus' },
      { year: '31 a.C.n.', event: 'Proelium ad Actium' },
      { year: '27 a.C.n.', event: 'Accipit titulum "Augustus"' },
      { year: '14 p.C.n.', event: 'Mortuus Nolae' },
    ],
  },
  seneca: {
    birthPlace: 'Corduba, Hispania',
    achievements: [
      'Praecipuus repraesentans Stoae Minoris',
      'Potens consiliarius Neronis imperatoris',
      'Auctor magnorum operum philosophicorum (e.g. "Epistulae morales")',
      'Scriptor plurium tragoediarum',
    ],
    timeline: [
      { year: 'c. 4 a.C.n.', event: 'Natus Cordubae' },
      { year: '41 p.C.n.', event: 'Relegatus in Corsicam' },
      { year: '49 p.C.n.', event: 'Redit Romam et fit Neronis praeceptor' },
      { year: '54-62 p.C.n.', event: 'Praecipuus minister sub Nerone' },
      { year: '65 p.C.n.', event: 'Coactus ad mortem voluntariam' },
    ],
  },
};

// General About Page when no author is selected
function GeneralAboutPage() {
  const { setCurrentAuthor } = useAuthor();

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 pt-32 hero-gradient">
          <div className="container mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl mb-4"
            >
              De Meum Diarium
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Propositum interactivum ad discendum, quod historiam Romae antiquae vivam facit.
            </motion.p>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BookOpen, title: 'Duae Prospectivae', desc: 'Diarium et scientifica' },
                { icon: Users, title: 'Quattuor Auctores', desc: 'Caesar, Cicero, Augustus, Seneca' },
                { icon: Clock, title: '170+ Anni', desc: 'Historia ad vivendum' },
                { icon: Scroll, title: 'Authenticum', desc: 'Historice fundatum' },
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
              <h2>Propositum</h2>
              <p>
                Meum Diarium singularem aditum ad historiam Romanam praebet. 
                Per diaria personalia et analysin scientificam, eventus historici vivificantur.
              </p>

              <h2>Prospectivae</h2>
              <p>
                <strong>Prospectiva Diarii:</strong> Experire historiam ex prospectu personarum antiquarum – authentice, personaliter, et interdum cum humore.
              </p>
              <p>
                <strong>Prospectiva Scientifica:</strong> Narrationes neutrales et obiectivae cum fontibus historicis et testimoniis academicis.
              </p>

              <h2>Auctores</h2>
              <p>
                Explora diaria quattuor magnarum personarum Romae antiquae:
              </p>
            </div>

            {/* Author cards */}
            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              {Object.values(authors).map((author) => (
                <Link 
                  key={author.id}
                  to={`/${author.id}/about`}
                  onClick={() => setCurrentAuthor(author.id)}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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
  const { setCurrentAuthor } = useAuthor();
  const { authorId } = useParams<{ authorId: string }>();

  const author = authorId ? authors[authorId as Author] : null;
  const authorInfo = author;

  useEffect(() => {
    if (author) {
      setCurrentAuthor(author.id);
    } else {
      setCurrentAuthor(null);
    }
  }, [author, setCurrentAuthor]);
  
  if (!authorId || !authorInfo) {
      return <GeneralAboutPage />;
  }
  
  const details = authorDetails[authorId];
  const authorPosts = posts.filter(p => p.author === authorId);
  const authorWorks = Object.values(works).filter(w => w.author === authorId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-28 pb-12">
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
              className="relative rounded-2xl overflow-hidden shadow-2xl aspect-w-4 aspect-h-5"
            >
              <img 
                src={authorInfo.heroImage}
                alt={authorInfo.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-sm text-foreground/70">{authorInfo.latinName}</p>
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
                  className="p-5 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">Vita</span>
                  </div>
                  <p className="text-muted-foreground">{authorInfo.years}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="p-5 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">Locus Nativitatis</span>
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
                    <h2 className="font-display text-xl font-medium">Res Gestae</h2>
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
              {authorWorks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl font-medium">Opera</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {authorWorks.map((work, i) => (
                      <Link 
                        key={i} 
                        to={`/${work.author}/works/${slugify(work.title, { lower: true, strict: true })}`}
                        className="px-4 py-2 rounded-full font-display italic text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {work.title}
                      </Link>
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
                  <h2 className="font-display text-xl font-medium mb-4">Inscriptiones Diarii</h2>
                  <div className="space-y-3">
                    {authorPosts.slice(0, 3).map((post) => (
                      <Link 
                        key={post.id}
                        to={`/${post.author}/${post.slug}`}
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
            <div className="lg:col-span-1">
              {details?.timeline && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-display text-xl font-medium mb-6">Linea Vitae</h2>
                  <div className="relative pl-4 border-l border-dashed border-border">
                    {details.timeline.map((item, i) => (
                      <div key={i} className="relative mb-8 last:mb-0">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-background border-2 border-primary" />
                        <p className="text-sm font-semibold mb-1 ml-6 text-primary">
                          {item.year}
                        </p>
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

  if (authorId && authors[authorId as Author]) {
    return <AuthorAboutPage />;
  }

  return <GeneralAboutPage />;
}
