import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Clock,
  Users,
  Globe2,
} from 'lucide-react';

const highlights = [
  { icon: Users, value: '7', label: 'Historische Persönlichkeiten' },
  { icon: BookOpen, value: '92+', label: 'Lexikon-Einträge' },
  { icon: Globe2, value: '2', label: 'Perspektiven pro Artikel' },
  { icon: Clock, value: '36.000+', label: 'Wörter im Wörterbuch' },
];

export default function ProjectPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Das neue Meum Diarium – Projekt & Vision"
        description="Erfahre mehr über das neue Meum Diarium: KI-gestützte Plattform für römische Geschichte mit Tagebuch, Wissenschaft, Lexikon, Zeitstrahl und interaktiven Lernfunktionen."
        tags={['Meum Diarium', 'Projekt', 'Römische Geschichte', 'KI', 'Bildung', 'Latein', 'Crossmediapreis', 'Multimediapreis']}
      />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-4xl">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.08)}
          className="mb-16"
        >
          <motion.div variants={fadeUp(0)} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                <div className="w-8 h-[1px] bg-primary/30" />
                DAS NEUE MEUM DIARIUM
              </div>
              <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
                Geschichte <span className="text-primary italic">neu gedacht</span>
              </h1>
              <p className="text-muted-foreground/70 max-w-3xl font-light leading-relaxed text-lg">
                Begeistert von dem unglaublich positiv ausfallenden Feedback zum Meum Diarium, mit dem wir bereits vor zwei Jahren den Crossmedia-Preis und den Deutschen Multimediapreis gewonnen haben, haben wir eine neue, modernere, verbesserte und erweitertes „Meum Diarium" entwickelt.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/caesar">
                <Button className="rounded-full h-12 px-7">
                  Jetzt erkunden
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="rounded-full h-12 px-7">
                  Über das Projekt
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div variants={fadeUp(0.08)} className="card-modern card-padding-md border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {highlights.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/40 bg-secondary/40 p-4 sm:p-5">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-display font-bold leading-none">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <section className="mb-20 space-y-10">
          <h2 className="font-display text-3xl font-bold">Erweiterungen</h2>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Das neue Meum Diarium vereint nun mehrere große antike Persönlichkeiten, unter andere Gaius Julius Caesar, Marcus Tullius Cicero und Augustus, in einer eigens dafür von Grund auf neu programmierte Plattform. Diese speziell für Meum Diarium erschaffene Anwendung basierend auf next.js ermöglicht Dank einem zusätzlich integrierten Admin-Portal grenzlose Skalierung der Inhalte und beliebige Erweiterung und Bearbeitung.
          </p>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Jede Persönlichkeit besitzt mit einer eigenen Farbe seinen eigenen individuellen Touch, um die Übersichtlichkeit der Anwendung gewährleisten zu können.
          </p>

          <h2 className="font-display text-3xl font-bold pt-6">Nicht nur Unterhaltung</h2>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Neben den einfachen Tagebucheinträgen, die das vorherige Meum Diarium von Gaius Julius Caesar geprägt haben, gibt es jetzt auch wissenschaftlich basierte Artikel, um eine inhaltlich korrekte Auseinandersetzung mit den Inhalten gewährleisten zu können.
          </p>

          <h2 className="font-display text-3xl font-bold pt-6">Eine klare Struktur</h2>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Um dafür komplexe, auf ein Fachgebiet spezialisierte Begriffe schneller verstehen zu können, oder um auch ohne Hintergrundwissen die detaillierten Artikel ohne Verständnisprobleme lesen zu können, werden Fachbegriffe, Namen und Orte automatisch zum eigens dazu erschaffenen Lexikon verlinkt. Mit einem einfachen Hover über die Fachbegriffe, ohne die Website zu verlassen, generiert eine spezielle KI zudem eine kompakte, verständliche Zusammenfassung eines Fachbegriffs, mit der Möglichkeit, Nachfragen zu stellen.
          </p>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Um auch eine chronologische Übersicht über die Ereignisse behalten zu können, haben wir zudem ein Zeitstrahl erschaffen, der alle Artikel auf Meum Diarium chronologisch anordnet. Auch hier spielt das Farbschema wieder eine Rolle, denn die Artikel werden farbig unterlegt angezeigt.
          </p>

          <h2 className="font-display text-3xl font-bold pt-6">Den Überblick behalten</h2>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Zudem gibt es zu jeder Persönlichkeit eine eigene Portfolio-Seite, in der neben den Werken, die die Person evtl. geschrieben hat, auch chronologisch geordnet der Lebenslauf mit deren Taten, Reformen und Ämter dargestellt werden. Hinzu kommen bekannte Zitate und Analysen der Persönlichkeiten. Sofern zu den dort angesprochene Themen Artikel verfügbar sind, sind diese auch verlinkt.
          </p>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Ein Artikel ist so aufgebaut, dass man schnell zwischen dem Tagebucheintrag und dem wissenschaftlichen Eintrag wechseln kann. Da die wissenschaftlich basierten Artikel rund 5000 Wörter pro Artikel haben, gibt es ein Inhaltsverzeichnis, um eine Struktur und Übersichtlichkeit in den Artikeln gewährleisten zu können. In der Seitenleiste stehen neben den „normalen Fakten" (Author, Jahreszahl) auch das dazu passende Zitat – falls vorhanden – und Schlagwörter, um thematisch ähnliche Artikel schnell zu erreichen.
          </p>

          <h2 className="font-display text-3xl font-bold pt-6">Perspektivenwechsel</h2>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Durch den Perspektivwechsel zwischen Tagebuch und Wissenschaftlicher Artikel in Meum Diarium wird deutlich, wie subjektiv Darstellungen sein können und wie wichtig es ist, Inhalte kritisch zu hinterfragen, anstatt sie ungeprüft zu übernehmen; egal ob im 1-1 Gespräch mit dem KI-Chatbot oder in den normalen Einträgen. Mit der Suchfunktion lassen sich sowohl Artikel als auch das Lexikon oder Themen suchen.
          </p>

          <h2 className="font-display text-3xl font-bold pt-6">Integrationen von KI</h2>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Genau wie bei dem alten „Meum Diarium" gibt es einen integrierte KI-Chat für jede Persönlichkeit. Dieser verlinkt automatisch passend zum Chat-Thema Ressourcen, die auf „Meum Diarium" verfügbar sind, um selbst mehr Hintergrundwissen zu erhalten und spezielle Themen nachlesen zu können. Auch wenn wir versucht haben, den KI-Chat so zu gestalten, damit dieser produktiv mehr Fakten liefert, antwortet die jeweiligen Persönlichkeit auf provokative Fragen genau so witzig wie früher.
          </p>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Eine neue KI-Funktion ist zudem das neue integrierte textbasierte Spiel. Hierbei handelt man bei auswählbaren Szenarien wie eine der Persönlichkeiten. Ziel ist es hierbei, die eigene Macht zu vergrößern, ohne dass die Beliebtheit des Volkes sinkt und man selbst dennoch möglichst viel Einfluss hat. Hierbei kann man ausprobieren, wie schwierig und komplex die Entscheidungen antiker Persönlichkeiten gewesen sind. Zudem lassen sich andere Ausgänge von Ereignissen testen; was wäre z.B., wenn Caesar sich nicht getraut hätte, den Rubikon zu überschreiten?
          </p>

          <h2 className="font-display text-3xl font-bold pt-6">Nicht nur Sachwissen</h2>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Die vertiefende, inhaltlich korrekte Auseinandersetzung neben den unterhaltsamen Inhalten wird zudem mit neuen Lernfunktionen ermöglicht. Ein digitales Wörterbuch mit über 36.000 Wörtern und vielen Deklinationstabellen hilft Schülern bei der Hausaufgabe & Übersetzung. Um Texte und deren Hintergründe auch sprachlich analysieren zu können, gibt es zudem eine Übersicht über wichtige Stilmittel mit passenden Tests dazu. Bereits jetzt kann man Teile von großen römischen Werken anschauen. Geplant sind auch hier interaktive Features, um Schülern bei der Übersetzung mit lateinischen Originaltexten zu helfen. Die Betonung liegt hierbei auf „Hilfsfunktion" – denn mit nur einer Übersetzung kann keiner daraus lernen.
          </p>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Wir planen Konzepte, damit Schüler Schritt für Schritt an den Texten herangeführt zu werden, indem das bereits vorhandene Wissen im Textzusammenhang abgefragt und getestet wird und mithilfe von schrittweisen grammatikalischen Analysen das tiefere Verständnis von lateinischen Texten und deren Struktur aufgebaut wird. Doch um dies zu erreichen, ist es genau so wichtig, die Grammatik gut verständlich in zusammenhängenden Artikeln auf einer Platform zu erklären. Dafür ist bereits jetzt ein neues Grammatik-Portal in Arbeit, das Grammatik Schritt für Schritt verständlich erklärt.
          </p>

          <h2 className="font-display text-3xl font-bold pt-6">Skalierungsmöglichkeiten</h2>
          <p className="text-muted-foreground/80 leading-relaxed text-lg">
            Auf den Inhalt des neuen Meum Diarium können auch andere Entwickler darauf zugreifen und Inhalte dynamisch über eine API (Application Programming Interface, Programmierschnittstelle) abrufen, damit diese auch in andere Anwendungen implementiert werden können. Somit macht Meum Diarium die wissenschaftlichen Inhalte & Informationen für weitere mögliche Bildungsprojekte zugänglich. Aus Kostengründen ist lediglich die API der KI nicht öffentlich zugänglich, die kann bei Bedarf aber natürlich auch bereitgestellt werden.
          </p>
        </section>

        <section className="card-modern card-padding-lg border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-background">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-4">UNSER ZIEL</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Geschichte erlebbar machen
            </h2>
            <p className="text-muted-foreground/80 text-lg leading-relaxed mb-8">
              Unser Ziel ist es, mit Meum Diarium Jugendlichen, Erwachsenen und allen anderen Interessierten die Geschehnisse aus dem alten Rom näher zu bringen und so historische Inhalte teilweise auch unterhaltsam mit viel Humor und mit neuen digitalen Medien zu vermitteln.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/caesar">
                <Button className="rounded-full h-12 px-7">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/lexicon">
                <Button variant="outline" className="rounded-full h-12 px-7">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Lexikon durchsuchen
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
