import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Zap,
  Palette,
  Type,
  Grid3x3,
  Sparkles,
  MessageCircle,
  User,
  Crown,
  Gamepad2,
  Calendar,
  Clock,
  Star,
  Heart,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DesignGuidePage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section mit Caesar-inspiriertem Design */}
      <section className="py-20 border-b border-border/40 bg-gradient-to-b from-secondary/5 to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
          <Crown className="w-96 h-96 text-primary" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-3xl border border-primary/20">
                <Palette className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Meum Diarium Design System
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Ein umfassendes Design-System inspiriert von der römischen
              Ästhetik mit modernen Glassmorphism-Effekten, Author-Themeing und
              interaktiven Elementen für historische Persönlichkeiten.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-20">
        {/* Author Themeing Section */}
        <section className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Crown className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl font-bold">
                Author Themeing
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Caesar Theme */}
              <div className="theme-caesar space-y-6">
                <div className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8 hover:border-primary/50 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                      <Crown className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-primary">
                        Caesar Theme
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Kaiserliches Gold & Macht
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg" />
                      <p className="font-mono text-sm">hsl(30, 100%, 55%)</p>
                      <p className="text-xs text-muted-foreground">
                        Imperial Gold
                      </p>
                    </div>
                    <Button className="w-full">Caesar's Tagebuch lesen</Button>
                    <div className="p-4 bg-primary/10 rounded-xl">
                      <p className="text-sm font-medium text-primary">
                        "Veni, vidi, vici" - Das goldene Thema repräsentiert
                        Macht und imperiale Würde.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-secondary/30 p-4 rounded-xl">
                  <strong>Implementierung:</strong>
                  <br />
                  <code className="font-mono">
                    {'<div className="theme-caesar">...</div>'}
                  </code>
                  <br />
                  CSS Variable:{" "}
                  <code className="font-mono">
                    --author-caesar: 30 100% 55%
                  </code>
                </div>
              </div>

              {/* Multi-Author Preview */}
              <div className="space-y-6">
                <div className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                  <h3 className="font-display text-xl font-bold mb-6">
                    Weitere Author-Themes
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        name: "Cicero",
                        color: "hsl(210, 90%, 60%)",
                        class: "theme-cicero",
                        icon: BookOpen,
                      },
                      {
                        name: "Augustus",
                        color: "hsl(280, 80%, 60%)",
                        class: "theme-augustus",
                        icon: Star,
                      },
                      {
                        name: "Seneca",
                        color: "hsl(150, 85%, 40%)",
                        class: "theme-seneca",
                        icon: Coffee,
                      },
                    ].map((author) => (
                      <div
                        key={author.name}
                        className={`${author.class} p-4 bg-card/40 rounded-2xl border border-border/40 group hover:border-primary/50 transition-all`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <author.icon className="w-4 h-4 text-primary" />
                          <p className="font-semibold text-primary text-sm">
                            {author.name}
                          </p>
                        </div>
                        <div
                          className="w-full h-3 rounded-full"
                          style={{ backgroundColor: author.color }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-secondary/30 p-4 rounded-xl">
                  <strong>Dynamisches Theming:</strong>
                  <br />
                  Jeder Autor hat eine eigene Farbpalette, die automatisch
                  angewendet wird basierend auf dem aktuellen Kontext.
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Glassmorphism Cards */}
        <section className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Grid3x3 className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl font-bold">
                Glassmorphism Cards
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Standard Glassmorphism Card */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Standard Glass Card
                </h3>
                <div className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8 hover:border-primary/50 transition-all duration-500 group">
                  <BookOpen className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="font-display text-xl font-bold mb-2">
                    Biografie & Lebenslauf
                  </h4>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    Erfahren Sie mehr über das Leben, die Errungenschaften und
                    den historischen Kontext.
                  </p>
                  <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                    Zum Profil <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-secondary/20 p-3 rounded-xl">
                  <strong>Klassen:</strong>
                  <br />
                  <code className="font-mono">
                    
                    bg-card/60 backdrop-blur-xl rounded-3xl border
                    border-border/40
                  </code>
                </div>
              </div>

              {/* Interactive Chat Card */}
              <div className="space-y-4 lg:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Interactive Chat Card
                </h3>
                <div className="bg-card/60 backdrop-blur-md rounded-3xl p-8 border border-border/40 relative overflow-hidden group hover:border-primary/50 transition-all duration-700">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:scale-105 group-hover:-rotate-6">
                    <MessageCircle className="w-32 h-32 text-primary" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform border border-primary/20">
                        <MessageCircle className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                        Mit <span className="text-primary italic">Caesar</span>{" "}
                        sprechen
                      </h4>
                    </div>

                    <div className="bg-secondary/30 p-1.5 rounded-2xl border border-border/60 transition-all hover:bg-secondary/50">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          placeholder="Frage Caesar etwas..."
                          className="w-full pl-6 pr-14 py-4 rounded-xl bg-transparent border-none outline-none text-base placeholder:text-muted-foreground/40"
                          readOnly
                        />
                        <div className="absolute right-1.5">
                          <Button size="icon" className="h-12 w-12 rounded-xl">
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "Erzähl von deinem Leben",
                        "Was waren deine Erfolge?",
                        "Wie war Rom?",
                      ].map((suggestion, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 rounded-full bg-secondary/50 border border-border/40 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer"
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-secondary/20 p-3 rounded-xl">
                  <strong>Features:</strong> Large background icon, animated
                  hover effects, interactive input field, suggestion chips
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Typography Section */}
        <section className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Type className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl font-bold">Typografie</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-8">
                  Schriftarten & Hierarchie
                </h3>

                <div className="space-y-8">
                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Display Font - Headlines
                    </p>
                    <h1 className="font-display text-5xl font-bold mb-2">
                      Meum Diarium
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Lora - für große Überschriften und historische Texte
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Gradient Text
                    </p>
                    <h2 className="font-display text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-2">
                      Caesar's Design System
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      bg-clip-text text-transparent mit gradient
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Body Text
                    </p>
                    <p className="text-lg leading-relaxed">
                      Die Geschichte Roms wird durch moderne Technologie zum
                      Leben erweckt. Eine Fusion aus antiker Weisheit und
                      zeitgenössischem Design.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Inter - für Fließtext und Lesbarkeit
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Italic & Emphasis
                    </p>
                    <p className="text-lg">
                      <em className="text-primary italic">
                        "Veni, vidi, vici"
                      </em>{" "}
                      -
                      <strong className="font-semibold text-primary">
                        {" "}
                        Historische Zitate
                      </strong>{" "}
                      werden hervorgehoben
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-8">
                  Größen & Gewichte
                </h3>

                <div className="space-y-6">
                  <div>
                    <h1 className="font-display text-4xl font-bold mb-1">
                      Hero Title
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      text-4xl-7xl font-bold
                    </p>
                  </div>

                  <div>
                    <h2 className="font-display text-2xl font-bold mb-1">
                      Section Title
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      text-2xl-3xl font-bold
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-semibold mb-1">
                      Card Title
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      text-xl font-semibold
                    </p>
                  </div>

                  <div>
                    <p className="text-lg leading-relaxed mb-1">
                      Large Body Text
                    </p>
                    <p className="text-xs text-muted-foreground">
                      text-lg leading-relaxed
                    </p>
                  </div>

                  <div>
                    <p className="text-base mb-1">Regular Body Text</p>
                    <p className="text-xs text-muted-foreground">text-base</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Small Text & Captions
                    </p>
                    <p className="text-xs text-muted-foreground">
                      text-sm text-muted-foreground
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
                      SECTION LABELS
                    </p>
                    <p className="text-xs text-muted-foreground">
                      text-xs font-bold uppercase tracking-[0.3em]
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Color Palette */}
        <section className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Palette className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl font-bold">Farbpalette</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6">
                  Primary Colors
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="w-full h-20 bg-primary rounded-2xl mb-3 shadow-inner" />
                    <p className="font-mono text-xs">
                      Primary: hsl(345, 60%, 35%)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Wine Red - CTA, Links, Active States
                    </p>
                  </div>

                  <div>
                    <div className="w-full h-20 bg-primary/20 rounded-2xl mb-3 border border-primary/40" />
                    <p className="font-mono text-xs">
                      Primary/20: hsl(345, 60%, 35% / 20%)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hover States, Backgrounds
                    </p>
                  </div>

                  <div>
                    <div className="w-full h-20 bg-primary/10 rounded-2xl mb-3 border border-primary/20" />
                    <p className="font-mono text-xs">
                      Primary/10: hsl(345, 60%, 35% / 10%)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Subtle Backgrounds, Icon Containers
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6">
                  Author Colors
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="w-full h-16 bg-author-caesar rounded-2xl mb-3" />
                    <p className="font-mono text-xs">
                      Caesar: hsl(30, 100%, 55%)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Imperial Gold
                    </p>
                  </div>

                  <div>
                    <div className="w-full h-16 bg-author-cicero rounded-2xl mb-3" />
                    <p className="font-mono text-xs">
                      Cicero: hsl(210, 90%, 60%)
                    </p>
                    <p className="text-xs text-muted-foreground">Orator Blue</p>
                  </div>

                  <div>
                    <div className="w-full h-16 bg-author-augustus rounded-2xl mb-3" />
                    <p className="font-mono text-xs">
                      Augustus: hsl(280, 80%, 60%)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Royal Purple
                    </p>
                  </div>

                  <div>
                    <div className="w-full h-16 bg-author-seneca rounded-2xl mb-3" />
                    <p className="font-mono text-xs">
                      Seneca: hsl(150, 85%, 40%)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Wisdom Green
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6">
                  Background System
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="w-full h-16 bg-background rounded-2xl mb-3 border border-border/40" />
                    <p className="font-mono text-xs">Background</p>
                    <p className="text-xs text-muted-foreground">
                      Main Page Background
                    </p>
                  </div>

                  <div>
                    <div className="w-full h-16 bg-card rounded-2xl mb-3 border border-border/40" />
                    <p className="font-mono text-xs">Card</p>
                    <p className="text-xs text-muted-foreground">
                      Solid Card Backgrounds
                    </p>
                  </div>

                  <div>
                    <div className="w-full h-16 bg-card/60 backdrop-blur-xl rounded-2xl mb-3 border border-border/40" />
                    <p className="font-mono text-xs">
                      Card/60 + backdrop-blur-xl
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Glassmorphism Cards
                    </p>
                  </div>

                  <div>
                    <div className="w-full h-16 bg-secondary rounded-2xl mb-3 border border-border/40" />
                    <p className="font-mono text-xs">Secondary</p>
                    <p className="text-xs text-muted-foreground">
                      Input Backgrounds, Chips
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Interactive Elements */}
        <section className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl font-bold">
                Interaktive Elemente
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Buttons */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Buttons & Actions
                </h3>

                <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-8 space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Primary Button
                    </p>
                    <Button className="w-full">Caesar's Tagebuch lesen</Button>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Secondary Button
                    </p>
                    <Button variant="secondary" className="w-full">
                      Mehr erfahren
                    </Button>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Icon Button
                    </p>
                    <Button size="icon" className="rounded-xl">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Link mit Icon
                    </p>
                    <div className="flex items-center text-primary font-semibold text-sm hover:translate-x-1 transition-transform cursor-pointer">
                      Zum Profil <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effects */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Hover-Effekte
                </h3>

                <div className="space-y-4">
                  <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 hover:border-primary/40 transition-colors duration-300 p-6 text-center group">
                    <Zap className="w-8 h-8 text-primary mb-3 mx-auto group-hover:scale-110 transition-transform duration-300" />
                    <p className="font-semibold">Icon Scale (110%)</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      duration-300
                    </p>
                  </div>

                  <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 hover:border-primary/40 transition-all duration-500 p-6 text-center group">
                    <BookOpen className="w-8 h-8 text-primary mb-3 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" />
                    <p className="font-semibold">Scale + Rotate</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      duration-500
                    </p>
                  </div>

                  <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 hover:bg-card/60 hover:border-primary/50 transition-all duration-700 p-6 text-center">
                    <p className="font-semibold">Background + Border</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      duration-700
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Spacing & Layout */}
        <section className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Grid3x3 className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl font-bold">
                Spacing & Layout
              </h2>
            </div>

            <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-12">
              <div className="grid lg:grid-cols-3 gap-12">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-6">
                    Border Radius
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl" />
                      <div>
                        <p className="text-sm font-semibold">
                          rounded-xl (12px)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Buttons, Small Elements
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl" />
                      <div>
                        <p className="text-sm font-semibold">
                          rounded-2xl (16px)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Icons, Chips
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-3xl" />
                      <div>
                        <p className="text-sm font-semibold">
                          rounded-3xl (24px)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cards, Main Elements
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-6">
                    Padding Scale
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-8 bg-primary/20 rounded text-xs flex items-center justify-center">
                        p-4
                      </div>
                      <p className="text-sm">16px - Compact Cards</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-8 bg-primary/20 rounded text-xs flex items-center justify-center">
                        p-6
                      </div>
                      <p className="text-sm">24px - Standard Cards</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-8 bg-primary/20 rounded text-xs flex items-center justify-center">
                        p-8
                      </div>
                      <p className="text-sm">32px - Large Cards</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-28 h-8 bg-primary/20 rounded text-xs flex items-center justify-center">
                        p-10
                      </div>
                      <p className="text-sm">40px - Hero Cards</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-6">
                    Grid Layouts
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">
                        Dashboard Grid
                      </p>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="aspect-square bg-primary/20 rounded"></div>
                        <div className="aspect-square bg-primary/20 rounded col-span-2"></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        md:grid-cols-3
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">
                        Content Layout
                      </p>
                      <div className="grid grid-cols-5 gap-2 mb-2">
                        <div className="aspect-square bg-primary/20 rounded col-span-3"></div>
                        <div className="aspect-square bg-primary/20 rounded col-span-2"></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        lg:grid-cols-[70%_30%]
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Motion & Animation */}
        <section className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl font-bold">
                Motion & Animation
              </h2>
            </div>

            <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-12">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">
                    Framer Motion Patterns
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-semibold mb-1">Fade Up Animation</p>
                      <div className="bg-secondary/30 p-3 rounded-lg font-mono text-xs">
                        <div>hidden: {`{ opacity: 0, y: 20 }`}</div>
                        <div>visible: {`{ opacity: 1, y: 0 }`}</div>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold mb-1">Entrance Animation</p>
                      <div className="bg-secondary/30 p-3 rounded-lg font-mono text-xs">
                        <div>initial: {`{ opacity: 0, y: 20 }`}</div>
                        <div>animate: {`{ opacity: 1, y: 0 }`}</div>
                        <div>transition: {`{ duration: 0.5 }`}</div>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold mb-1">Scroll-triggered</p>
                      <div className="bg-secondary/30 p-3 rounded-lg font-mono text-xs">
                        <div>whileInView="visible"</div>
                        <div>viewport={`{ once: true }`}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">
                    Transition Durations
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="font-semibold">Fast Feedback</span>
                      <span className="text-primary">150ms</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="font-semibold">Standard Hover</span>
                      <span className="text-primary">300ms</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="font-semibold">Complex Animations</span>
                      <span className="text-primary">500ms</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-semibold">Entrance Effects</span>
                      <span className="text-primary">700ms</span>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/40 dark:border-amber-800/40">
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      <strong>Performance Tip:</strong> Verwende transform und
                      opacity für animationen statt layout-eigenschaften wie
                      width/height.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Implementation Examples */}
        <section>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl font-bold">
                Implementierung
              </h2>
            </div>

            <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/40 p-12">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">
                    CSS Utilities
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold mb-2">Glassmorphism Card</p>
                      <div className="bg-secondary/30 p-4 rounded-xl font-mono text-xs">
                        <div>bg-card/60</div>
                        <div>backdrop-blur-xl</div>
                        <div>rounded-3xl</div>
                        <div>border border-border/40</div>
                        <div>hover:border-primary/50</div>
                        <div>transition-all duration-500</div>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Interactive Elements</p>
                      <div className="bg-secondary/30 p-4 rounded-xl font-mono text-xs">
                        <div>group</div>
                        <div>group-hover:scale-110</div>
                        <div>group-hover:rotate-3</div>
                        <div>transition-transform</div>
                        <div>duration-300</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">
                    Design Tokens
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold mb-2">Color Variables</p>
                      <div className="bg-secondary/30 p-4 rounded-xl font-mono text-xs">
                        <div>--primary: 345 60% 35%</div>
                        <div>--author-caesar: 30 100% 55%</div>
                        <div>--surface-container: 40 20% 94%</div>
                        <div>--border: 40 10% 88%</div>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Typography</p>
                      <div className="bg-secondary/30 p-4 rounded-xl font-mono text-xs">
                        <div>font-family: 'Lora', serif</div>
                        <div>font-family: 'Inter', sans-serif</div>
                        <div>--radius: 1.5rem</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border/40">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                  Wichtige Prinzipien
                </h3>
                <div className="grid md:grid-cols-2 gap-8 text-sm">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Konsistente Border-Radii (rounded-3xl für Cards)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Glassmorphism mit backdrop-blur-xl</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Author-spezifische Themeing</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Subtle Hover-Effekte mit scale/rotate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Framer Motion für Entrance Animations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Performance-optimierte Transform-Animationen</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/40 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Fragen zum Design System?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Diese Richtlinien bilden die Grundlage für alle Komponenten im
              Meum Diarium Projekt. Von Caesar's imperialem Gold bis zu modernen
              Glassmorphism-Effekten.
            </p>
            <Button asChild size="lg" className="group">
              <a href="/">
                Zurück zur Startseite
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
