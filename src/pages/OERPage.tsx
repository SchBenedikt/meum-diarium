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
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

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
    <div className="min-h-screen bg-white">
      <SEO
        title="Open Educational Resources – Meum Diarium"
        description="Kostenfreie Bildungsmaterialien zur römischen Antike. Texte, Vokabeln und interaktive Lernwerkzeuge unter offenen Lizenzen."
        type="website"
        image={`${baseUrl}/images/oer-hero.jpg`}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center gap-3 mb-8">
              <div className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-xs font-medium rounded-full border">
                <Globe className="inline mr-2 h-3 w-3" />
                Open Educational Resources
              </div>
              <div className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 text-xs font-medium rounded-full border">
                <Download className="inline mr-2 h-3 w-3" />
                Kostenfrei & Frei
              </div>
            </div>

            <h1 className="font-bricolage text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Bildungsmaterialien zur
              <span className="text-primary"> römischen Antike</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Entdecke unsere kostenlosen Bildungsmaterialien für Latein und römische Geschichte. 
              Alle Inhalte stehen unter offenen Lizenzen und dürfen frei verwendet, 
              bearbeitet und weitergegeben werden.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/learn">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 py-4 text-base bg-primary hover:bg-primary/90 text-white transition-all duration-300"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Lernmaterialien entdecken
                </Button>
              </Link>
              <Link to="/api">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-8 py-4 text-base bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  <Code className="mr-2 h-5 w-5" />
                  API-Dokumentation
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats - Based on actual data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: "92+", label: "Lexikon-Einträge" },
              { value: "36.140", label: "Vokabeln" },
              { value: "4", label: "Historiker" },
              { value: "6", label: "Lektionen" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Available Resources */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="font-bricolage text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Verfügbare OER-Ressourcen
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Aktuelle Bildungsmaterialien aus dem Meum Diarium Projekt
            </p>
          </motion.div>

          <div className="space-y-12">
            {availableResources.map((category, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bricolage text-2xl font-bold text-gray-900">
                    {category.category}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, j) => (
                    <div key={j} className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:border-primary/50 transition-all duration-300">
                      <h4 className="font-bricolage text-lg font-bold text-gray-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-white px-2 py-1 rounded border border-gray-300">
                          {item.license}
                        </span>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-gray-300">
                          {item.format}
                        </span>
                      </div>
                      <Link to={item.link}>
                        <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto">
                          Jetzt nutzen <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Licenses Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="font-bricolage text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Offene Lizenzen
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unsere Inhalte stehen unter freien Lizenzen, die die Nutzung, 
              Bearbeitung und Weitergabe ermöglichen
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {licenses.map((license, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`rounded-xl border p-6 ${license.color}`}>
                  <license.icon className="w-8 h-8 mb-4" />
                  <h3 className="font-bold text-lg mb-2">{license.name}</h3>
                  <p className="font-mono text-sm mb-3">{license.short}</p>
                  <p className="text-sm leading-relaxed">{license.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-8"
          >
            <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-gray-900">
              Bildung gemeinsam gestalten
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Werde Teil unserer OER-Community und trage zur freien Bildung bei. 
              Nutze unsere Materialien für deinen Unterricht oder deine Forschung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/learn">
                <Button size="lg" className="rounded-full px-8 py-4 text-base bg-primary hover:bg-primary/90 text-white transition-all duration-300">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Jetzt lernen
                </Button>
              </Link>
              <Link to="/api">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-4 text-base bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-all duration-300">
                  <Code className="mr-2 h-5 w-5" />
                  API nutzen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OERPage;
