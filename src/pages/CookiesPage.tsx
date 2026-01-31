import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Cookie, CheckCircle2, XCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function CookiesPage() {

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Cookie-Richtlinien - Meum Diarium"
        description="Informationen zur Verwendung von Cookies auf Meum Diarium."
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-24 overflow-hidden border-b border-border">
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px]" />
          </div>

          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Badge variant="outline" className="mb-6 py-2 px-4 text-xs uppercase tracking-[0.2em]">
                <Cookie className="mr-2 h-4 w-4" />
                Cookie-Richtlinien
              </Badge>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Cookie-Richtlinien
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Wie wir Cookies auf dieser Website verwenden
              </p>

              <p className="text-sm text-muted-foreground mt-4">
                Stand: {new Date().toLocaleDateString('de-DE')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-12"
            >
              {/* Summary */}
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-amber-700 dark:text-amber-400">
                      Kurzfassung
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Meum Diarium verwendet notwendige Cookies und Analyse-Cookies. Die notwendigen Cookies sichern Grundfunktionen wie Sprache und Theme. Die Analyse-Cookies helfen uns zu verstehen, welche Inhalte gelesen werden und wo wir nachbessern sollten. Keine Werbung, kein Datenhandel, kein heimliches Imperium.
                    </p>
                  </div>
                </div>
              </div>

              {/* What are Cookies */}
              <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Cookie className="w-6 h-6 text-primary" />
                  Was sind Cookies?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie eine Website besuchen. Sie helfen der Website, sich an Ihre Einstellungen zu erinnern oder anonyme Nutzungsstatistiken zu erstellen. Kein Zauber, keine Spione, nur kleine Notizzettel.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Wir nutzen zudem Local Storage für Einstellungen wie Sprache und Theme. Das ist technisch ähnlich, aber kein klassisches Cookie. Beide Varianten können Sie im Browser verwalten.
                </p>
              </div>

              {/* Cookie Types */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  Welche Cookies verwenden wir?
                </h2>

                {/* Essential Cookies */}
                <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Notwendige Cookies
                      </h3>
                      <Badge variant="outline" className="mb-3 text-xs">
                        Immer aktiv
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Diese Cookies sind für den Betrieb der Website unbedingt erforderlich und können nicht deaktiviert werden. Sie dienen ausschließlich technischen Zwecken.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/20">
                      <h4 className="font-semibold mb-2 text-sm">
                        Präferenz-Speicherung
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Zweck: Speicherung Ihrer Sprachauswahl, Theme-Einstellungen und ausgewählten Autors
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Speicherort: Browser Local Storage
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/20">
                      <h4 className="font-semibold mb-2 text-sm">
                        Session-Cookies
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Zweck: Aufrechterhaltung Ihrer Sitzung während des Besuchs
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gültigkeit: Bis zum Schließen des Browsers
                      </p>
                    </div>
                  </div>
                </div>

                {/* No Analytics */}
                <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Analyse-Cookies
                      </h3>
                      <Badge variant="outline" className="mb-3 text-xs border-amber-500/30">
                        Wird verwendet
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    Wir verwenden Analyse-Cookies zur Reichweitenmessung und Verbesserung der Inhalte. Erfasst werden z.B. Seitenaufrufe, Verweildauer, Gerätetypen und ungefähre Regionen. Wir suchen Muster, nicht Personen. Caesar zählte Legionen, wir zählen Seitenaufrufe.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/20">
                      <h4 className="font-semibold mb-2 text-sm">
                        Reichweitenmessung
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Zweck: Statistik, Fehlererkennung, Optimierung von Inhalten
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gültigkeit: Variiert je nach Cookie, in der Regel wenige Tage bis Monate
                      </p>
                    </div>
                  </div>
                </div>

                {/* No Marketing */}
                <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Marketing-Cookies
                      </h3>
                      <Badge variant="outline" className="mb-3 text-xs border-red-500/30">
                        Nicht verwendet
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    Wir setzen keine Cookies für Marketingzwecke oder personalisierte Werbung ein. Keine Verfolger, keine Banner-Flut, keine Imperatoren im Werbenetzwerk.
                  </p>
                </div>
              </div>

              {/* Cookie Control */}
              <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-primary" />
                  Cookie-Einstellungen verwalten
                </h2>
                
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Sie können Cookies in Ihren Browser-Einstellungen jederzeit verwalten, blockieren oder löschen:
                  </p>

                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Chrome:</strong> Einstellungen → Datenschutz und Sicherheit → Cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Firefox:</strong> Einstellungen → Datenschutz & Sicherheit → Cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Safari:</strong> Einstellungen → Datenschutz → Cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Edge:</strong> Einstellungen → Cookies und Websiteberechtigungen</span>
                    </li>
                  </ul>

                  <div className="mt-6 p-4 rounded-xl bg-secondary/20">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Hinweis:</strong>{' '}
                      Das Blockieren oder Löschen von Cookies kann dazu führen, dass Ihre Präferenzen (wie Sprache und Theme) nicht gespeichert werden.
                    </p>
                  </div>
                </div>
              </div>

              {/* Updates */}
              <div className="p-6 rounded-2xl bg-secondary/20 border border-border/40">
                <h2 className="text-xl font-bold mb-3">
                  Änderungen an dieser Richtlinie
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Wir können diese Cookie-Richtlinien von Zeit zu Zeit aktualisieren. Änderungen werden auf dieser Seite veröffentlicht. Das Datum der letzten Aktualisierung finden Sie oben auf dieser Seite.
                </p>
              </div>

              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/privacy">
                  <div className="px-6 py-3 rounded-xl bg-card/40 border border-border/40 hover:border-primary/50 transition-colors text-center">
                    <p className="text-sm font-medium">Datenschutzerklärung</p>
                  </div>
                </Link>
                <Link to="/legal">
                  <div className="px-6 py-3 rounded-xl bg-card/40 border border-border/40 hover:border-primary/50 transition-colors text-center">
                    <p className="text-sm font-medium">Impressum</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
