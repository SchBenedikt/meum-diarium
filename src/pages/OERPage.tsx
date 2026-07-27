import { motion } from 'framer-motion';
import { BookOpen, Download, Globe, FileText, Video, Code, Share2, ArrowRight, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Footer } from '@/components/layout/Footer';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { authors } from '@/data/authors';

type ResourceItem = {
  title: string;
  description: string;
  license: string;
  format: string;
  link: string;
};

type ResourceCategory = {
  category: string;
  icon: React.ElementType;
  items: ResourceItem[];
};

const OERPage = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';

  const availableResources: ResourceCategory[] = [
    {
      category: 'Texte und Inhalte',
      icon: FileText,
      items: [
        {
          title: 'Tagebucheinträge',
          description: 'KI-generierte Tagebucheinträge historischer Persönlichkeiten.',
          license: 'CC BY-SA 4.0',
          format: 'HTML, JSON',
          link: '/caesar',
        },
        {
          title: 'Lexikon',
          description: 'Enzyklopädie zur römischen Antike mit historischer Einordnung.',
          license: 'CC BY-SA 4.0',
          format: 'HTML, API',
          link: '/lexicon',
        },
        {
          title: 'Grammatik',
          description: 'Lateinische Grammatik mit Übungen und didaktischem Aufbau.',
          license: 'CC BY-SA 4.0',
          format: 'HTML, PDF',
          link: '/learn/grammar',
        },
      ],
    },
    {
      category: 'Multimedia',
      icon: Video,
      items: [
        {
          title: 'Bildmaterial',
          description: 'Historische Abbildungen und Rekonstruktionen zur freien Nutzung.',
          license: 'CC BY-SA 4.0',
          format: 'JPG, PNG',
          link: '/images',
        },
      ],
    },
    {
      category: 'Technische Ressourcen',
      icon: Code,
      items: [
        {
          title: 'API-Dokumentation',
          description: 'REST API für Integrationen, Unterrichtstools und Forschung.',
          license: 'MIT',
          format: 'JSON, OpenAPI',
          link: '/api',
        },
        {
          title: 'Quellcode',
          description: 'Offener Projektcode als Grundlage für eigene Erweiterungen.',
          license: 'MIT',
          format: 'TypeScript, React',
          link: 'https://github.com/meum-diarium',
        },

      ],
    },
  ];

  const licenses: any[] = [];

  const authorsCount = Object.keys(authors).length;
  const stats = [
    { value: '92+', label: 'Lexikon-Einträge' },
    { value: '36.140', label: 'Vokabeln' },
    { value: String(authorsCount), label: 'Historische Persönlichkeiten' },
    { value: '6', label: 'Lektionen' },
  ];

  const isExternalLink = (url: string) => /^https?:\/\//.test(url);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Open Educational Resources - Meum Diarium"
        description="Kostenfreie Bildungsmaterialien zur römischen Antike. Texte, Vokabeln und interaktive Lernwerkzeuge unter offenen Lizenzen."
        type="website"
        image={`${baseUrl}/images/oer-hero.jpg`}
      />

      <main className="flex-1 container mx-auto max-w-7xl px-4 pt-32 pb-24">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.08)}
          className="mb-16"
        >
          <motion.div variants={fadeUp()} className="space-y-5 max-w-4xl">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              OPEN EDUCATIONAL RESOURCES
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              Offene Lernmaterialien für <span className="text-primary italic">Latein und Rom</span>
            </h1>
            <p className="text-muted-foreground/70 text-lg leading-relaxed max-w-3xl">
              Diese Seite bündelt die frei nutzbaren Ressourcen von Meum Diarium. Alle Materialien sind transparent lizenziert und für Unterricht und Studium einsetzbar.
            </p>
          </motion.div>

          <motion.div variants={fadeUp()} className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link to="/learn">
              <Button className="rounded-full h-12 px-7">
                <BookOpen className="mr-2 h-4 w-4" />
                Lernmaterialien entdecken
              </Button>
            </Link>
            <Link to="/api">
              <Button variant="outline" className="rounded-full h-12 px-7">
                <Code className="mr-2 h-4 w-4" />
                API-Dokumentation
              </Button>
            </Link>
          </motion.div>
        </motion.section>

        <section className="mb-20">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
            <div className="w-8 h-[1px] bg-primary/30" />
            STATISTIKEN
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="card-modern border-border/50">
                <CardContent className="p-5 sm:p-6">
                  <p className="text-3xl sm:text-4xl font-display font-bold leading-none text-primary">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
            <div className="w-8 h-[1px] bg-primary/30" />
            VERFÜGBARE RESSOURCEN
          </div>
          <div className="space-y-12">
            {availableResources.map((category) => (
              <motion.div
                key={category.category}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer(0.08)}
              >
                <motion.div variants={fadeUp()} className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-3xl font-bold">{category.category}</h2>
                </motion.div>

                <motion.div variants={staggerContainer(0.06)} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item) => (
                    <motion.article
                      key={item.title}
                      variants={fadeUp()}
                      className="card-modern card-hover-primary card-padding-md"
                    >
                      <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground/80 text-sm leading-relaxed mb-5">{item.description}</p>
                      <div className="flex flex-wrap gap-2 mb-5 text-[11px] font-bold uppercase tracking-[0.18em]">
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">{item.license}</span>
                        <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">{item.format}</span>
                      </div>
                      {isExternalLink(item.link) ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
                        >
                          Jetzt nutzen <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      ) : (
                        <Link
                          to={item.link}
                          className="inline-flex items-center text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
                        >
                          Jetzt nutzen <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      )}
                    </motion.article>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>


        <section className="card-modern card-padding-lg border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-background">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-4">MITMACHEN</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Bildung gemeinsam gestalten</h2>
            <p className="text-muted-foreground/80 text-lg leading-relaxed mb-8">
              Nutze die OER-Materialien im Unterricht, in Arbeitsblättern oder in deiner Forschung. Durch offene Lizenzen bleiben Inhalte transparent und wiederverwendbar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/learn">
                <Button className="rounded-full h-12 px-7">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Jetzt lernen
                </Button>
              </Link>
              <Link to="/api">
                <Button variant="outline" className="rounded-full h-12 px-7">
                  <Download className="mr-2 h-4 w-4" />
                  API nutzen
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OERPage;
