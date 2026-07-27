import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { MessageCircle, Zap, FileText, BookOpen, Sparkles, ArrowLeft, Bot, MessageSquare, Search, Shield, Cpu, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const KiPage = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';

  const aiFeatures = [
    {
      icon: MessageCircle,
      title: 'KI-Chat mit historischen Persönlichkeiten',
      path: '/caesar#chat',
      description: 'Echtzeit-Gespräche mit Caesar, Cicero, Augustus, Seneca, Catilina, Sallust und Sokrates. Die KI antwortet im Charakter der Figur – mit historischem Wissen, passendem Sprachstil und Persönlichkeit. Jede Antwort wird live generiert, kein Text ist vorgefertigt. Der Chat unterstützt Kontextverlauf über mehrere Nachrichten und schlägt automatisch passende Ressourcen vor.',
      model: 'Llama-4-Scout (17B)',
      location: 'Jede Persönlichkeiten-Seite (z. B. /caesar#chat)',
      badge: 'Echtzeit'
    },
    {
      icon: Zap,
      title: 'Zeitreise-Simulation',
      path: '/caesar/simulation',
      description: 'Interaktives Entscheidungsspiel in der Ich-Perspektive. Die KI beschreibt historische Situationen, bietet Handlungsoptionen und reagiert dynamisch auf Entscheidungen. Jeder Durchlauf ist einzigartig – mit wechselnden Narrativen, Statuseffekten und Enden. Der Schwierigkeitsgrad und die historische Genauigkeit sind anpassbar.',
      model: 'Llama-4-Scout (17B) / Llama-3.1-8B (Fallback)',
      location: '/[autor]/simulation (z. B. /caesar/simulation)',
      badge: 'Interaktiv'
    },
    {
      icon: FileText,
      title: 'Arbeitsblatt-Generator',
      path: '/lernen/material',
      description: 'Erstellt dynamisch Latein-Unterrichtsmaterialien zu jedem Thema. Wählbar sind Aufgabentypen (Textverständnis, Lückentext, Multiple Choice, Übersetzung, Interpretation, Diskussion), Schwierigkeitsgrad und Menge. Die KI generiert passende Texte, Fragen und Lösungen. Geeignet für den Einsatz im Schulunterricht und Selbststudium.',
      model: 'Llama-4-Scout (17B)',
      location: '/lernen/material',
      badge: 'Didaktisch'
    },
    {
      icon: BookOpen,
      title: 'Begriffserklärungen (TermPopover)',
      path: '/lexicon',
      description: 'Beim Lesen von lateinischen Texten und Artikeln können Begriffe angeklickt werden. Die KI erklärt den Begriff in 2-3 Sätzen mit historischem Kontext, lateinischer Einordnung und relevanter Bedeutung – live und kontextabhängig. Die Erklärungen sind kurz gehalten und ergänzen das bestehende Lexikon.',
      model: 'Llama-4-Scout (17B)',
      location: 'Überall auf der Seite per Klick auf unterstrichene Begriffe',
      badge: 'Kontextuell'
    },
    {
      icon: Bot,
      title: 'Demo-Chat-Widget',
      path: '/caesar/chat',
      description: 'Auf der Startseite und Unterseiten befindet sich ein kompaktes Chat-Widget für schnelle Fragen an Caesar. Vereinfachte Version des Vollbild-Chats – für spontane Interaktion ohne Seitenwechsel. Ideal für schnelle Recherchen und erste Erkundungen.',
      model: 'Llama-4-Scout (17B)',
      location: 'Startseite, Footer-Bereich',
      badge: 'Kompakt'
    },
    {
      icon: Search,
      title: 'Ressourcen-Vorschläge (KI-gestützt)',
      path: '/chat',
      description: 'Während des KI-Chats schlägt das System passende Lexikon-Einträge, Artikel und Werke vor. Die Relevanz wird von einer zweiten KI automatisch bewertet und sortiert – nur die besten 12 Treffer werden angezeigt. So werden Chat-Antworten mit direkt abrufbaren Quellen untermauert.',
      model: 'Llama-3.1-8B (Reranking)',
      location: 'Automatisch im KI-Chat integriert',
      badge: 'Reranking'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="KI-Transparenz – Aktive KI-Nutzung"
        description="Vollständige Liste aller aktiven KI-Features in Meum Diarium: Chat, Simulation, Arbeitsblätter, Begriffserklärungen und mehr."
        type="website"
        image={`${baseUrl}/images/caesar-hero.png`}
        canonical={`${baseUrl}/ki`}
      />

      <main className="flex-1">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.1)}
          className="container mx-auto max-w-6xl px-4 pt-32 pb-16"
        >
          <motion.div variants={fadeUp()} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                <div className="w-8 h-[1px] bg-primary/30" />
                TRANSPARENZ
              </div>
              <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight leading-tight">
                Wo wird <span className="text-primary italic">KI</span> genutzt?
              </h1>
              <p className="text-muted-foreground/70 max-w-2xl text-lg leading-relaxed">
                Eine vollständige, transparente Liste aller aktiven KI-Features in Meum Diarium – mit Endpunkt, Modell, Ort in der Anwendung und einer Einordnung der Funktionsweise.
              </p>
            </div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Zurück
            </Link>
          </motion.div>
        </motion.section>

        <section className="container mx-auto max-w-5xl px-4 pb-16 sm:pb-24">
          <div className="space-y-6 sm:space-y-8">
            {aiFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp()}
              >
                <Card className="card-modern border-border/50 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-5 sm:p-8">
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-col sm:flex-row">
                            <h2 className="font-display text-base sm:text-xl font-bold">{feature.title}</h2>
                            {feature.badge && (
                              <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold border-primary/30 text-primary">
                                {feature.badge}
                              </Badge>
                            )}
                          </div>
                          <Link
                            to={feature.path}
                            className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline whitespace-nowrap"
                          >
                            Öffnen <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                        <p className="text-muted-foreground/80 text-sm leading-relaxed mb-5">
                          {feature.description}
                        </p>
                        <div className="flex flex-col gap-2 text-[11px] font-mono">
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground/50 shrink-0">Modell:</span>
                            <span className="text-muted-foreground/80">{feature.model}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground/50 shrink-0">Ort:</span>
                            <span className="text-primary/70">{feature.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp()}
            className="mt-16"
          >
            <Card className="card-modern border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-background">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-primary font-bold text-xs uppercase tracking-widest">Grundsätze</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-6 text-center">
                  <div>
                    <Cpu className="h-6 w-6 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-sm mb-2">KI als Werkzeug</h3>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      KI wird als Werkzeug eingesetzt – nicht als Ersatz für menschliche Entscheidungen. Alle KI-generierten Inhalte werden geprüft.
                    </p>
                  </div>
                  <div>
                    <Sparkles className="h-6 w-6 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-sm mb-2">Offene Modelle</h3>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      Es kommen ausschließlich offene Modelle (Llama) zum Einsatz. Keine proprietären APIs mit undurchsichtiger Datenverarbeitung.
                    </p>
                  </div>
                  <div>
                    <Search className="h-6 w-6 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-sm mb-2">Dokumentiert & geprüft</h3>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      Jeder KI-Einsatz ist an dieser Stelle dokumentiert. Das Design, die Struktur und die Kernfeatures sind eigenständig entwickelt.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default KiPage;
