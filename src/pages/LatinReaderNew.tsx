import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, User, Languages, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { works } from '@/data/works';

// Import Latin texts
import deBelloGallicoText from '@/data/latin-texts/de-bello-gallico.json';
import deOfficiisText from '@/data/latin-texts/de-officiis.json';

// Latin texts registry
const LATIN_TEXTS: Record<string, any> = {
  'de-bello-gallico': deBelloGallicoText,
  'de-officiis': deOfficiisText,
};

// Step 1: Author selection
// Step 2: Work selection for that author
// Step 3: Show Latin text with AI helper

export default function LatinReaderNew() {
  const { authorId, workSlug } = useParams<{ authorId?: string; workSlug?: string }>();
  const navigate = useNavigate();
  const [selectedSentence, setSelectedSentence] = useState<string>('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [aiHelp, setAiHelp] = useState<string>('');

  // Get available authors with works
  const availableAuthors = ['caesar', 'cicero', 'augustus', 'seneca'];

  // Get works for selected author
  const authorWorks = authorId
    ? Object.values(works).filter((work: any) => work.author === authorId)
    : [];

  // Get selected work text
  const selectedWork = workSlug ? works[workSlug as keyof typeof works] : null;
  const latinText = selectedWork && LATIN_TEXTS[workSlug || ''];

  // Step 1: Author Selection
  if (!authorId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
          <div className="mb-16">
            <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Zurück zu Lernen
            </Link>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              Lateinische <span className="text-primary">Texte</span> lesen
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Wähle einen Autor, um dessen lateinische Originalwerke zu lesen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableAuthors.map((author) => (
              <motion.div
                key={author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="p-6 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => navigate(`/reader/${author}`)}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg capitalize">{author}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Object.values(works).filter((w: any) => w.author === author).length} Werke
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Step 2: Work Selection
  if (!workSlug) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
          <div className="mb-16">
            <Link to="/reader" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Zurück zur Autorwahl
            </Link>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight mb-4 capitalize">
              Werke von <span className="text-primary">{authorId}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Wähle ein Werk zum Lesen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorWorks.map((work: any) => (
              <motion.div
                key={work.slug || work.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="p-6 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => navigate(`/reader/${authorId}/${work.slug || work.title.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{work.title}</h3>
                      <p className="text-sm text-muted-foreground">{work.year}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Step 3: Text Display with AI Helper
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
        <div className="mb-16">
          <Link to={`/reader/${authorId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Zurück zur Werkauswahl
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {selectedWork?.title}
          </h1>
          <p className="text-muted-foreground">
            {selectedWork?.year} • <span className="capitalize">{authorId}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latin Text */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Languages className="w-5 h-5 text-primary" />
                  Lateinischer Text
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  {showTranslation ? 'Original anzeigen' : 'Übersetzung anzeigen'}
                </Button>
              </div>

              {latinText ? (
                <div className="space-y-6">
                  {latinText.books.map((book: any) => (
                    <div key={book.number} className="space-y-4">
                      <h3 className="text-lg font-bold text-primary">{book.title}</h3>
                      {(book.chapters || book.sections || []).map((chapter: any) => (
                        <div key={chapter.number} className="space-y-2 pb-4 border-b border-border/50 last:border-0">
                          <div className="text-sm font-semibold text-muted-foreground">Kapitel {chapter.number}</div>
                          {!showTranslation ? (
                            <p className="text-base leading-relaxed font-serif text-foreground/90">
                              {chapter.latin}
                            </p>
                          ) : (
                            <p className="text-base leading-relaxed text-foreground/80">
                              {chapter.translation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Text wird geladen...</p>
                  <p className="text-sm mt-2">Bald verfügbar: Vollständiger lateinischer Originaltext</p>
                </div>
              )}
            </Card>
          </div>

          {/* AI Helper Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                KI-Übersetzungshilfe
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Markiere einen Satz oder Abschnitt:
                  </label>
                  <Textarea
                    placeholder="Füge hier den lateinischen Text ein, den du verstehen möchtest..."
                    value={selectedSentence}
                    onChange={(e) => setSelectedSentence(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    setAiHelp('Diese Funktion wird bald verfügbar sein. Die KI wird dir helfen, den Text zu übersetzen und zu verstehen.');
                  }}
                  disabled={!selectedSentence}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Übersetzen & Erklären
                </Button>

                {aiHelp && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <p className="text-sm">{aiHelp}</p>
                  </motion.div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    <strong>Hinweis:</strong> Die KI-Funktionen werden in Kürze aktiviert. 
                    Sie helfen dir beim Verstehen der Grammatik, Übersetzung und des historischen Kontexts.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
