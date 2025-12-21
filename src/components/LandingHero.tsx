import { BookMarked, Clock, ArrowRight, Sparkles, Quote, Library, Mic2, Users, Crown, BookOpen, Languages, Scroll, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { AuthorGrid } from './AuthorGrid';
import { FeaturedPost } from './FeaturedPost';
import { QuoteOfDay } from './QuoteOfDay';
import { ReadingStats } from './ReadingStats';
import { FeatureShowcase } from '@/components/home/FeatureShowcase';
import { DemoChatWidget } from './DemoChatWidget';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { useRef } from 'react';

export function LandingHero() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = [
    { label: 'Tagebucheinträge', value: '50+', icon: Scroll },
    { label: 'Jahre Geschichte', value: '170+', icon: Clock },
    { label: 'Perspektiven', value: '2', icon: Quote },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background" ref={containerRef}>
      {/* Hero Section - Clean & Minimal */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-muted/30">
        {/* Simple pattern background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="container mx-auto relative z-10 px-4 sm:px-6 pt-24 sm:pt-32 pb-20">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto flex flex-col items-center text-center"
          >
            <motion.div
              variants={fadeUp(0.1)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-bold mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              LERNE ÜBER CAESAR
            </motion.div>

            <motion.h1
              variants={fadeUp(0.2)}
              className="font-display text-5xl xs:text-6xl sm:text-7xl md:text-8xl mb-6 md:mb-8 leading-[0.9] tracking-tight font-bold text-foreground"
            >
              Meum <span className="text-primary">Diarium</span>
            </motion.h1>

            <motion.p
              variants={fadeUp(0.3)}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Entdecke die Geschichte durch Caesars persönliche Tagebucheinträge.
              Authentische Kommentare zu seinen Feldzügen, Entscheidungen und Gedanken.
            </motion.p>

            <motion.div
              variants={fadeUp(0.5)}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"
            >
              <Button size="lg" className="h-14 px-10 text-lg rounded-3xl bg-primary text-primary-foreground font-bold" asChild>
                <Link to="/caesar">
                  Caesars Einträge lesen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-3xl border-border" asChild>
                <Link to="/caesar/chat">
                  Mit Caesar sprechen
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Clean cards */}
      <section className="relative z-20 -mt-16 mb-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <div className="p-2.5 bg-primary/10 rounded-3xl border border-primary/20">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="block text-3xl sm:text-4xl font-display font-bold text-foreground">{stat.value}</span>
                    <span className="block text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is Meum Diarium Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                <BookOpen className="w-3.5 h-3.5" />
                WAS IST DAS?
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Caesars Gedanken, <span className="text-primary">lebendig erzählt.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Meum Diarium ist eine Sammlung von Tagebucheinträgen und Kommentaren,
                die Caesars Leben, Feldzüge und Entscheidungen aus seiner persönlichen Perspektive beleuchten.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Jeder Eintrag bietet zwei Perspektiven: den persönlichen <strong>Tagebuch-Stil</strong> und
                eine <strong>wissenschaftliche Analyse</strong> mit historischen Kontexten.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Scroll, label: 'Tagebucheinträge' },
                  { icon: BookMarked, label: 'Wissenschaftliche Analysen' },
                  { icon: MapPin, label: 'Orte & Schlachten' },
                  { icon: Quote, label: 'Originale Zitate' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50 border border-border">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden border border-border aspect-[4/3]">
                <img
                  src="https://videos.openai.com/az/vg-assets/task_01kcs7pbnze61tyb0qdy1teb90%2F1766078554_img_1.webp?se=2025-12-26T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-12-20T02%3A21%3A13Z&ske=2025-12-27T02%3A26%3A13Z&sks=b&skv=2024-08-04&sig=aqaune3RBVFcczzZvSPU47xwEeAiVRWNNCq/m2pl6VE%3D&ac=oaivgprodscus2"
                  alt="Gaius Julius Caesar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-3xl p-4 max-w-[200px]">
                <p className="text-xs text-muted-foreground mb-1">Hauptfigur</p>
                <p className="font-display font-bold">Gaius Julius Caesar</p>
                <p className="text-xs text-primary">100 – 44 v. Chr.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                INTERAKTIV
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Frag <span className="text-primary">Caesar</span> direkt.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Stelle Fragen über den Rubikon, die Gallischen Kriege oder seine Entscheidungen.
                Unser KI-Chat rekonstruiert Caesars Denkweise basierend auf seinen Schriften.
              </p>
              <div className="space-y-2">
                {[
                  { icon: BookOpen, text: 'Basiert auf historischen Quellen' },
                  { icon: Sparkles, text: 'KI-Rekonstruktion seiner Persönlichkeit' },
                  { icon: Languages, text: 'Antworten auf Deutsch und Latein' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                  >
                    <div className="p-1.5 bg-primary/10 rounded-md">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <DemoChatWidget />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Authors Section - Focus on Caesar */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
              <Users className="w-3.5 h-3.5" />
              AUTOREN
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Weitere <span className="text-primary">Perspektiven</span>
            </h2>
            <p className="text-muted-foreground">
              Neben Caesar findest du auch Einträge von Cicero, Augustus und Seneca.
            </p>
          </motion.div>
        </div>
      </section>

      <div id="authors">
        <AuthorGrid />
      </div>

      <FeaturedPost />

      {/* Quote of the Day Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70 mb-6">Sententia Diei</p>
              <QuoteOfDay />
            </motion.div>
          </div>
        </div>
      </section>

      <ReadingStats />
    </div>
  );
}
