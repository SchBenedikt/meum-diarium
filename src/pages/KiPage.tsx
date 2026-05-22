import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { authors } from '@/data/authors';

const KiPage = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';
  const authorsCount = Object.keys(authors).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="KI-Nutzung — Meum Diarium"
        description="Transparenz über den Einsatz von KI bei Meum Diarium: Wofür wir KI einsetzen, wie wir mit generierten Inhalten umgehen und wie du Korrekturen melden kannst."
        type="website"
        image={`${baseUrl}/images/oer-hero.jpg`}
      />

      <main className="flex-1 container mx-auto max-w-7xl px-4 pt-28 pb-24">
        <motion.section initial="hidden" animate="visible" variants={staggerContainer(0.06)} className="mb-12">
          <motion.div variants={fadeUp()} className="space-y-4 max-w-4xl">
            <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              KI & TRANSPARENZ
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Wie wir KI einsetzen — und warum du es wissen solltest</h1>
            <p className="text-muted-foreground/80 text-lg leading-relaxed">
              Meum Diarium nutzt KI-Technologien zur Unterstützung redaktioneller Arbeit, automatischen Text-Anreicherung und in Hilfsfunktionen. Auf dieser Seite erklären wir konkret, wo, wie und mit welchen Folgen KI eingesetzt wird.
            </p>
            <div className="flex gap-3 mt-4">
              <Link to="/oer"><Button variant="outline" className="h-11">Ressourcen ansehen</Button></Link>
              <Link to="/stats"><Button className="h-11">Statistiken</Button></Link>
            </div>
          </motion.div>
        </motion.section>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="card-modern">
            <CardContent>
              <h3 className="font-display text-lg font-bold mb-2">Wofür wir KI nutzen</h3>
              <p className="text-sm text-muted-foreground/80">Automatische Textanreicherung, redaktionelle Vorschläge, Metadaten- und Schlagwort-Generierung sowie Such- und Navigationserleichterungen.</p>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent>
              <h3 className="font-display text-lg font-bold mb-2">Transparenz & Kennzeichnung</h3>
              <p className="text-sm text-muted-foreground/80">Automatisch generierte Videos und Ergänzungen werden sichtbar gekennzeichnet. Nutzer:innen finden mehr Informationen und Kontext hier.</p>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent>
              <h3 className="font-display text-lg font-bold mb-2">Qualitäts­sicherung</h3>
              <p className="text-sm text-muted-foreground/80">KI-Vorschläge sind editierbar. Für kritische Inhalte empfehlen wir manuelle Redigate durch Fachpersonen.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
            <div className="w-8 h-[1px] bg-primary/30" />
            DETAILS
          </div>

          <div className="space-y-8">
            <Card className="card-modern">
              <CardContent>
                <h3 className="font-display text-2xl font-bold mb-3">Automatische Textanreicherung</h3>
                <p className="text-muted-foreground/80 mb-3">Wenn ein wissenschaftlicher Beitrag kürzer als die redaktionell gewünschte Mindestlänge ist, generiert die Anwendung unterstützende Abschnitte, die historische Zusammenhänge und Quellenkontext ergänzen. Diese Ergänzungen sind als Hilfestellung gedacht und wurden automatisch eingefügt.</p>
                <p className="text-sm">Wir empfehlen bei inhaltlich sensiblen Themen eine manuelle Überprüfung und bieten einfache Wege, Fehler zu melden.</p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardContent>
                <h3 className="font-display text-2xl font-bold mb-3">KI-generierte Medien</h3>
                <p className="text-muted-foreground/80 mb-3">Videos oder Audiodateien, die automatisch erzeugt wurden, werden auf der jeweiligen Beitragsseite gekennzeichnet (Hinweis & Overlay). Du findest außerdem einen Link zur Detailseite über unsere KI-Nutzung.</p>
                <p className="text-sm">Bei Zweifeln an der Authentizität eines Mediums kontaktiere uns bitte — wir prüfen und korrigieren zeitnah.</p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardContent>
                <h3 className="font-display text-2xl font-bold mb-3">Verlässlichkeit & Quellen</h3>
                <p className="text-muted-foreground/80 mb-3">KI hilft beim Formulieren, nicht beim Ersetzen von Quellen. Primärtexte, historische Arbeiten und etablierte Forschung bleiben die Grundlage — KI ergänzt diese nur redaktionell.</p>
                <p className="text-sm">Wo möglich, verlinken wir auf Primärquellen oder weiterführende Literatur.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
            <div className="w-8 h-[1px] bg-primary/30" />
            HÄUFIGE FRAGEN
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-modern">
              <CardContent>
                <h4 className="font-bold">Wie erkenne ich KI-Inhalte?</h4>
                <p className="text-sm text-muted-foreground/80">KI-Inhalte sind auf Beitragsseiten markiert; Medien bekommen ein Hinweis-Overlay vor der Wiedergabe.</p>
              </CardContent>
            </Card>
            <Card className="card-modern">
              <CardContent>
                <h4 className="font-bold">Kann ich Änderungen vorschlagen?</h4>
                <p className="text-sm text-muted-foreground/80">Ja — nutze das Kontaktformular oder öffne ein Issue im Repo. Redaktionelle Korrekturen werden geprüft und eingearbeitet.</p>
              </CardContent>
            </Card>
            <Card className="card-modern">
              <CardContent>
                <h4 className="font-bold">Beeinflusst KI die historische Genauigkeit?</h4>
                <p className="text-sm text-muted-foreground/80">KI kann Fehler einführen. Deshalb bleiben Quellen und redaktionelle Kontrolle zentral.</p>
              </CardContent>
            </Card>
            <Card className="card-modern">
              <CardContent>
                <h4 className="font-bold">Welche Teile sind automatisch erzeugt?</h4>
                <p className="text-sm text-muted-foreground/80">Kurztexte, Vorschau-Abschnitte und Ergänzungen in wissenschaftlichen Artikeln können automatisch erstellt worden sein. Tagebuchtexte wurden redaktionell ergänzt, außer bei Caesar.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="card-modern card-padding-lg border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-background">
          <div>
            <h3 className="font-display text-2xl font-bold mb-3">Mitmachen & Feedback</h3>
            <p className="text-muted-foreground/80 mb-4">Dein Feedback ist wichtig. Wenn du Unstimmigkeiten findest, melde sie bitte. Wir prüfen und korrigieren schnellstmöglich.</p>
            <div className="flex gap-3">
              <Link to="/contact"><Button className="h-11">Kontakt</Button></Link>
              <Link to="https://github.com/meum-diarium"><Button variant="outline" className="h-11">Repository</Button></Link>
            </div>
          </div>
        </section>

        <p className="text-sm text-muted-foreground mt-8">Stand: 22.05.2026 — Autoren: {authorsCount}</p>
      </main>

    </div>
  );
};

export default KiPage;
