import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/SEO';
import { 
  Brain, 
  Sparkles, 
  MessageCircle, 
  BookOpen, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle, 
  Zap,
  Target,
  TrendingUp,
  Globe,
  Cpu,
  Heart,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Bot,
  User,
  History,
  GraduationCap,
  Database,
  Eye,
  Lock,
  Infinity,
  Gauge,
  Puzzle
} from 'lucide-react';

export default function AIExplanationPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % aiFeatures.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const aiFeatures = [
    {
      icon: MessageCircle,
      title: 'Historische Dialoge',
      subtitle: 'Lebendige Gespräche mit den Größen Roms',
      description: 'Tauche ein in authentische Dialoge mit Caesar, Cicero, Augustus und Seneca. Jede Antwort basiert auf ihren tatsächlichen Werken, Persönlichkeiten und historischem Kontext.',
      capabilities: ['Kontextbezogene Antworten', 'Historische Authentizität', 'Persönliche Anrede', 'Tiefe Wissensvermittlung'],
      impact: '95',
      color: 'from-blue-500 to-cyan-500',
      bgPattern: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
    },
    {
      icon: BookOpen,
      title: 'Intelligente Textanalyse',
      subtitle: 'Sofortiges Verständnis lateinischer Texte',
      description: 'Erhalte in Sekunden detaillierte Analysen lateinischer Texte mit Grammatik-Erklärungen, Übersetzungen und kulturellem Kontext - was sonst Stunden dauern würde.',
      capabilities: ['Grammatikalische Analyse', 'Wort-für-Wort Übersetzung', 'Kultureller Kontext', 'Strukturelle Erklärung'],
      impact: '88',
      color: 'from-emerald-500 to-teal-500',
      bgPattern: 'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
    },
    {
      icon: Users,
      title: 'Adaptive Lernpfade',
      subtitle: 'Lernen, das sich an dich anpasst',
      description: 'Die KI erkennt deine Lerngewohnheiten, Stärken und Schwächen. Sie erstellt personalisierte Übungseinheiten und passt die Schwierigkeit dynamisch an deinen Fortschritt an.',
      capabilities: ['Individuelle Schwierigkeit', 'Fortschrittsbasierte Empfehlungen', 'Persönliche Lernziele', 'Adaptive Übungen'],
      impact: '92',
      color: 'from-purple-500 to-pink-500',
      bgPattern: 'radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
    },
    {
      icon: Brain,
      title: 'Grammatik-Meister',
      subtitle: 'Intelligente Grammatik-Unterstützung',
      description: 'Komplexe grammatikalische Strukturen werden verständlich erklärt. Die KI generiert personalisierte Beispiele und Übungen, die genau auf dein Niveau zugeschnitten sind.',
      capabilities: ['Interaktive Erklärungen', 'Personalisierte Beispiele', 'Fehlererkennung', 'Wiederholungs-Training'],
      impact: '85',
      color: 'from-orange-500 to-red-500',
      bgPattern: 'radial-gradient(circle at 30% 70%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)'
    },
    {
      icon: Sparkles,
      title: 'Kontext-Vokabeln',
      subtitle: 'Wörter mit Bedeutung lernen',
      description: 'Vergiss das reine Auswendiglernen! Die KI präsentiert Vokabeln in authentischen Kontexten, mit Eselsbrücken und Beispielsätzen aus Originalwerken.',
      capabilities: ['Kontextbasiertes Lernen', 'Mnemonik-Techniken', 'Authentische Beispiele', 'Wortnetz-Verknüpfungen'],
      impact: '90',
      color: 'from-indigo-500 to-purple-500',
      bgPattern: 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
    },
    {
      icon: Target,
      title: 'Wissens-Validierung',
      subtitle: 'Historische Präzision garantiert',
      description: 'Jede Information wird durch KI-gestützte Quellenanalyse validiert. Die KI überprüft historische Fakten gegen zahlreiche antike Quellen und moderne Forschung.',
      capabilities: ['Quellenkritische Analyse', 'Historische Validierung', 'Wissenschaftliche Korrektheit', 'Quellenverweise'],
      impact: '96',
      color: 'from-amber-500 to-yellow-500',
      bgPattern: 'radial-gradient(circle at 60% 60%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)'
    }
  ];

  const coreValues = [
    {
      icon: Eye,
      title: 'Transparenz',
      description: 'Jede KI-Empfehlung ist nachvollziehbar. Quellen werden immer angezeigt und Entscheidungen erklärt.',
      stats: '100% nachvollziehbar'
    },
    {
      icon: Shield,
      title: 'Datenschutz',
      description: 'Deine Daten bleiben sicher. Keine Weitergabe an Dritte, lokale Verarbeitung wo möglich.',
      stats: 'DSGVO-konform'
    },
    {
      icon: Users,
      title: 'Menschlich',
      description: 'KI unterstützt, ersetzt aber nicht. Menschliche Expertise bleibt die oberste Instanz.',
      stats: 'Menschengeführt'
    },
    {
      icon: TrendingUp,
      title: 'Evolution',
      description: 'Das System lernt kontinuierlich dazu und verbessert sich durch Nutzerfeedback.',
      stats: 'Stetige Optimierung'
    }
  ];

  const testimonials = [
    {
      quote: "Die KI-Gespräche mit Caesar fühlen sich echt an. Ich lerne Latein wie nie zuvor!",
      author: "Anna M.",
      role: "Studentin",
      rating: 5
    },
    {
      quote: "Die Textanalyse hat mir geholfen, komplexe Cicero-Texte endlich zu verstehen.",
      author: "Marcus K.",
      role: "Lehrer",
      rating: 5
    },
    {
      quote: "Personalisierte Lernpfade haben meine Latein-Note von 4 auf 1 verbessert.",
      author: "Laura S.",
      role: "Abiturientin",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20">
      <SEO
        title="KI-Erklärung | Meum Diarium"
        description="Entdecke, wie künstliche Intelligenz dein Latein-Lernen revolutioniert - von historischen Dialogen bis zu personalisierten Lernpfaden."
        tags={['KI', 'künstliche Intelligenz', 'Latein lernen', 'Grammatik-Assistent', 'personalisiertes Lernen', 'historische Dialoge']}
        type="website"
        canonical="https://meum-diarium.xn--schner-2za.de/ai-explanation"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative container mx-auto px-4 pt-32 pb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-6 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Die Zukunft des Latein-Lernens
            </Badge>
            
            <h1 className="font-display text-6xl sm:text-8xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Künstliche Intelligenz
              </span>
              <br />
              <span className="text-foreground">trifft antike Weisheit</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
              Erlebe Latein wie nie zuvor. Unsere KI macht antike Texte lebendig, 
              personalisiert dein Lernen und öffnet Türen zu historischen Dialogen, 
              die du sonst nie erleben könntest.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/caesar">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  KI-Gespräch starten
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="outline" size="lg" className="border-2 border-border/50 bg-background/80 backdrop-blur-sm px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-card transition-all duration-300">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Alle Features entdecken
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500/20 rounded-full blur-xl"
          />
        </div>
      </section>

      {/* Interactive Feature Showcase */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
              Deine <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">KI-Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Entdecke die sechs Säulen unseres KI-gestützten Lernsystems
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Cards */}
            <div className="space-y-4">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      activeFeature === index 
                        ? 'bg-gradient-to-r ' + feature.color + ' text-white border-transparent shadow-xl scale-105' 
                        : 'bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-lg'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${activeFeature === index ? 'bg-white/20' : 'bg-primary/10'}`}>
                        <Icon className={`w-6 h-6 ${activeFeature === index ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-2 ${activeFeature === index ? 'text-white' : 'text-foreground'}`}>
                          {feature.title}
                        </h3>
                        <p className={`text-sm leading-relaxed ${activeFeature === index ? 'text-white/90' : 'text-muted-foreground'}`}>
                          {feature.subtitle}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className={`text-2xl font-bold ${activeFeature === index ? 'text-white' : 'text-primary'}`}>
                            {feature.impact}%
                          </div>
                          <div className={`text-xs ${activeFeature === index ? 'text-white/70' : 'text-muted-foreground'}`}>
                            Nutzerzufriedenheit
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Feature Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-3xl"
                  style={{ 
                    background: aiFeatures[activeFeature].bgPattern,
                    backgroundImage: aiFeatures[activeFeature].bgPattern 
                  }}
                />
                
                <Card className="relative bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <Badge className={`bg-gradient-to-r ${aiFeatures[activeFeature].color} text-white border-0`}>
                        {aiFeatures[activeFeature].title}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="rounded-full"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveFeature((prev) => (prev + 1) % aiFeatures.length)}
                          className="rounded-full"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-display text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {aiFeatures[activeFeature].title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {aiFeatures[activeFeature].description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {aiFeatures[activeFeature].capabilities.map((capability, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">{capability}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Effektivitäts-Bewertung</div>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full bg-gradient-to-r ${aiFeatures[activeFeature].color}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${aiFeatures[activeFeature].impact}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                />
                              </div>
                              <span className="text-lg font-bold text-primary">{aiFeatures[activeFeature].impact}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gradient-to-b from-transparent to-blue-50/30 dark:to-blue-900/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
              Unsere <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Werte</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Prinzipien, die unsere KI-Entwicklung leiten
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group-hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{value.description}</p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {value.stats}
                    </Badge>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
              Was unsere <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Nutzer sagen</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Echte Erfahrungen von Menschen, die Latein mit unserer KI lernen
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200/50 dark:border-amber-800/50 h-full">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden">
              <CardContent className="p-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
                  Bereit für die <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Zukunft?</span>
                </h2>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                  Starte jetzt dein KI-gestütztes Latein-Abenteuer und entdecke eine völlig neue Art, antike Sprachen zu lernen.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/caesar">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Jetzt mit Caesar sprechen
                    </Button>
                  </Link>
                  <Link to="/learn">
                    <Button variant="outline" size="lg" className="border-2 border-border/50 bg-background/80 backdrop-blur-sm px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-card transition-all duration-300">
                      <Eye className="w-5 h-5 mr-2" />
                      Alle Features ansehen
                    </Button>
                  </Link>
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">10.000+</div>
                    <div className="text-sm text-muted-foreground">Aktive Nutzer</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">95%</div>
                    <div className="text-sm text-muted-foreground">Zufriedenheit</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Verfügbarkeit</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">∞</div>
                    <div className="text-sm text-muted-foreground">Lernmöglichkeiten</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Add Star icon for testimonials
const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
