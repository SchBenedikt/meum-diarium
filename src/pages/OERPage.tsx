import { motion } from "framer-motion";
import { 
  BookOpen, 
  Download, 
  Globe, 
  FileText, 
  Video, 
  Headphones,
  Code,
  Share2,
  ArrowRight,
  Users,
  Sparkles,
  Zap,
  Award,
  TrendingUp,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fadeUp, staggerContainer } from "@/lib/motion";

const OERPage = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schner-2za.de';

  const availableResources = [
    {
      category: "Texte & Inhalte",
      icon: FileText,
      items: [
        { 
          title: "Tagebucheinträge", 
          description: "KI-generierte Tagebucheinträge historischer Persönlichkeiten", 
          license: "CC BY-SA 4.0", 
          format: "HTML, JSON",
          link: "/caesar"
        },
        { 
          title: "Lexikon-Einträge", 
          description: "92+ Einträge zur römischen Antike mit Übersetzungen", 
          license: "CC BY 4.0", 
          format: "HTML, JSON",
          link: "/lexicon"
        },
        { 
          title: "Grammatik-Lektionen", 
          description: "Interaktive Latein-Grammatik Übungen", 
          license: "CC BY-SA 4.0", 
          format: "HTML",
          link: "/learn/grammar"
        },
      ]
    },
    {
      category: "Lernwerkzeuge",
      icon: BookOpen,
      items: [
        { 
          title: "Vokabeltrainer", 
          description: "36.140 lateinische Vokabeln mit deutschen Übersetzungen", 
          license: "CC BY-SA 4.0", 
          format: "Web App",
          link: "/vocab"
        },
        { 
          title: "Text Reader", 
          description: "Interaktiver Reader für lateinische Texte", 
          license: "CC BY-SA 4.0", 
          format: "Web App",
          link: "/reader"
        },
        { 
          title: "KI-Gespräche", 
          description: "Dialoge mit historischen Persönlichkeiten", 
          license: "CC BY-NC 4.0", 
          format: "Web App",
          link: "/caesar/chat"
        },
      ]
    },
    {
      category: "Technische Ressourcen",
      icon: Code,
      items: [
        { 
          title: "API-Dokumentation", 
          description: "RESTful API für Entwickler und Forscher", 
          license: "MIT", 
          format: "JSON, OpenAPI",
          link: "/api"
        },
        { 
          title: "Vokabeldatenbank", 
          description: "SQLite Datenbank mit lateinischen Vokabeln", 
          license: "ODbL", 
          format: "SQLite, CSV",
          link: "https://github.com/meum-diarium/vocab-data"
        },
      ]
    }
  ];

  const licenses = [
    {
      name: "Creative Commons",
      short: "CC BY-SA 4.0",
      description: "Namensnennung - Weitergabe unter gleichen Bedingungen",
      icon: Share2,
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      name: "Creative Commons",
      short: "CC BY 4.0", 
      description: "Nur Namensnennung erforderlich",
      icon: Globe,
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      name: "Creative Commons",
      short: "CC BY-NC 4.0",
      description: "Nicht-kommerzielle Nutzung",
      icon: Users,
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      name: "MIT License",
      short: "MIT",
      description: "Permissive Software-Lizenz",
      icon: Code,
      color: "bg-gray-50 text-gray-700 border-gray-200"
    }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Open Educational Resources – Meum Diarium"
        description="Kostenfreie Bildungsmaterialien zur römischen Antike. Texte, Vokabeln und interaktive Lernwerkzeuge unter offenen Lizenzen."
        type="website"
        image={`${baseUrl}/images/oer-hero.jpg`}
      />

      {/* Hero Section - Landing Page Style */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 pt-32 pb-24 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1)}
            className="text-center space-y-8"
          >
            <motion.div variants={fadeUp(0)}>
              <div className="flex justify-center gap-3 mb-6">
                <Badge variant="secondary" className="px-4 py-2 text-xs font-medium">
                  <Globe className="mr-2 h-3 w-3" />
                  Open Educational Resources
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-xs font-medium">
                  <Download className="mr-2 h-3 w-3" />
                  Kostenfrei & Frei
                </Badge>
              </div>
              <h1 className="font-bricolage text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Bildungsmaterialien zur
                <span className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent"> römischen Antike</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Entdecke unsere kostenlosen Bildungsmaterialien für Latein und römische Geschichte. 
                Alle Inhalte stehen unter offenen Lizenzen und dürfen frei verwendet, 
                bearbeitet und weitergegeben werden.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/learn">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 h-14 text-base bg-primary hover:bg-primary/90"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Lernmaterialien entdecken
                </Button>
              </Link>
              <Link to="/api">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-8 h-14 text-base"
                >
                  <Code className="mr-2 h-5 w-5" />
                  API-Dokumentation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

          {/* Stats - Based on actual data */}
          <motion.div
            variants={fadeUp(0.4)}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { value: "92+", label: "Lexikon-Einträge", color: "from-primary to-blue-500" },
              { value: "36.140", label: "Vokabeln", color: "from-blue-500 to-green-500" },
              { value: "4", label: "Historiker", color: "from-green-500 to-orange-500" },
              { value: "6", label: "Lektionen", color: "from-orange-500 to-red-500" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp(0.6 + i * 0.1)}
                className="relative group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Available Resources - Landing Page Style */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp(0)}>
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                <div className="w-8 h-[1px] bg-primary/30" />
                VERFÜGBARE RESSOURCEN
                <div className="w-8 h-[1px] bg-primary/30" />
              </div>
              <h2 className="font-bricolage text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Verfügbare OER-Ressourcen
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Aktuelle Bildungsmaterialien aus dem Meum Diarium Projekt
              </p>
            </motion.div>
          </motion.div>

          <div className="space-y-12">
            {availableResources.map((category, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer(0.1)}
              >
                <motion.div 
                  variants={fadeUp(0)}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bricolage text-2xl font-bold tracking-tight">
                    {category.category}
                  </h3>
                </motion.div>

                <motion.div 
                  variants={staggerContainer(0.05)}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {category.items.map((item, j) => (
                    <motion.div
                      key={j}
                      variants={fadeUp(j * 0.1)}
                      className="group"
                    >
                      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm hover:-translate-y-1">
                        <CardContent className="p-6">
                          <h4 className="font-bricolage text-lg font-bold mb-2">
                            {item.title}
                          </h4>
                          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="secondary" className="text-xs">
                              {item.license}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.format}
                            </Badge>
                          </div>
                          <Link to={item.link}>
                            <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto group-hover:translate-x-1 transition-all duration-300">
                              Jetzt nutzen <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Licenses Section - Landing Page Style */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp(0)}>
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                <div className="w-8 h-[1px] bg-primary/30" />
                OFFENE LIZENZEN
                <div className="w-8 h-[1px] bg-primary/30" />
              </div>
              <h2 className="font-bricolage text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Offene Lizenzen
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Unsere Inhalte stehen unter freien Lizenzen, die die Nutzung, 
                Bearbeitung und Weitergabe ermöglichen
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {licenses.map((license, i) => (
              <motion.div
                key={i}
                variants={fadeUp(i * 0.1)}
                className="group"
              >
                <Card className={`h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${license.color} hover:-translate-y-1`}>
                  <CardContent className="p-6 text-center">
                    <license.icon className="w-8 h-8 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-bold text-lg mb-2">{license.name}</h3>
                    <p className="font-mono text-sm mb-3 bg-white/20 px-2 py-1 rounded">{license.short}</p>
                    <p className="text-sm leading-relaxed">{license.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Landing Page Style */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="space-y-8"
          >
            <motion.div variants={fadeUp(0)}>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-green-500/20 blur-xl rounded-full" />
                <h2 className="relative font-bricolage text-4xl sm:text-5xl font-bold tracking-tight">
                  Bildung gemeinsam gestalten
                </h2>
              </div>
            </motion.div>
            
            <motion.p variants={fadeUp(0.2)} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Werde Teil unserer OER-Community und trage zur freien Bildung bei. 
              Nutze unsere Materialien für deinen Unterricht oder deine Forschung.
            </motion.p>
            
            <motion.div variants={fadeUp(0.4)} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/learn">
                <Button size="lg" className="rounded-full px-8 h-16 text-lg bg-primary hover:bg-primary/90">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Jetzt lernen
                </Button>
              </Link>
              <Link to="/api">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-16 text-lg">
                  <Code className="mr-2 h-5 w-5" />
                  API nutzen
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OERPage;
