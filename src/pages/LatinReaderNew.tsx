import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Library, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { works } from '@/data/works';

// Import Latin texts
import deBelloGallicoText from '@/data/latin/caesar-de-bello-gallico.json';
import deOfficiisText from '@/data/latin-texts/de-officiis.json';

// Latin texts registry
const LATIN_TEXTS: Record<string, any> = {
  'de-bello-gallico': deBelloGallicoText,
  'de-officiis': deOfficiisText,
};

const AUTHOR_LABELS: Record<string, string> = {
  caesar: 'Julius Caesar',
  cicero: 'Marcus Tullius Cicero',
  augustus: 'Kaiser Augustus',
  seneca: 'Seneca',
  catilina: 'Lucius Sergius Catilina',
};

const FONT_SCALES = [
  { label: 'A-', value: 'text-base' },
  { label: 'A', value: 'text-lg' },
  { label: 'A+', value: 'text-xl' },
];

export default function LatinReaderNew() {
  const { authorId, workSlug } = useParams<{ authorId?: string; workSlug?: string }>();
  const navigate = useNavigate();
  const [selectedBookNumber, setSelectedBookNumber] = useState<number | null>(null);
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<number | null>(null);
  const [fontScale, setFontScale] = useState(FONT_SCALES[1].value);

  const availableAuthors = useMemo(
    () => Array.from(new Set(Object.values(works).map((work: any) => work.author))),
    [],
  );

  const authorWorks = useMemo(
    () => (authorId ? Object.values(works).filter((work: any) => work.author === authorId) : []),
    [authorId],
  );

  const selectedWork = workSlug ? works[workSlug as keyof typeof works] : null;
  const latinText = workSlug ? LATIN_TEXTS[workSlug] : null;

  const books = useMemo(() => latinText?.books || [], [latinText]);
  const selectedBook = useMemo(
    () => books.find((book: any) => book.number === selectedBookNumber) || books[0],
    [books, selectedBookNumber],
  );
  const sections = useMemo(() => {
    if (!selectedBook) return [];
    return Array.isArray(selectedBook.chapters) ? selectedBook.chapters : selectedBook.sections || [];
  }, [selectedBook]);

  const selectedSection = useMemo(
    () => sections.find((section: any) => section.number === selectedSectionNumber) || sections[0],
    [sections, selectedSectionNumber],
  );

  useEffect(() => {
    if (books.length > 0) {
      setSelectedBookNumber(books[0].number);
    }
  }, [workSlug, books]);

  useEffect(() => {
    if (sections.length > 0) {
      setSelectedSectionNumber(sections[0].number);
    }
  }, [selectedBookNumber, sections]);

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
              Ein fokussierter Reader für antike Originaltexte. Wähle einen Autor und lies ohne Ablenkung im reinen Lesemodus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableAuthors.map((author, index: number) => (
              <motion.div
                key={`author-${author}-${index}`}
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
                      <h3 className="font-bold text-lg">{AUTHOR_LABELS[author] || author}</h3>
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
              Werke von <span className="text-primary">{AUTHOR_LABELS[authorId] || authorId}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Wähle ein Werk. Verfügbare Texte öffnen direkt im Reader, nicht verfügbare Texte werden als „bald verfügbar" markiert.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorWorks.map((work: any, index: number) => (
              <motion.div
                key={`work-${work.slug || work.title || index}-${index}`}
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
                      <p className="text-xs mt-2 font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        {LATIN_TEXTS[work.slug] ? 'Text verfügbar' : 'Bald verfügbar'}
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

  // Step 3: Pure Reader Mode
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
            {selectedWork?.year} • <span>{AUTHOR_LABELS[authorId || ''] || authorId}</span>
          </p>
        </div>

        {!latinText ? (
          <Card className="p-8">
            <div className="text-center py-8 text-muted-foreground">
              <Library className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Für dieses Werk liegt aktuell noch kein vollständig aufbereiteter Reader-Text vor.</p>
              <p className="text-sm mt-2">Bitte wähle ein anderes Werk oder komme später erneut vorbei.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-4 sm:p-6 sticky top-20 z-20 bg-background/95 backdrop-blur border-border/60">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Buch</label>
                  <select
                    value={selectedBook?.number || ''}
                    onChange={(event) => setSelectedBookNumber(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    {books.map((book: any) => (
                      <option key={book.number} value={book.number}>
                        {book.title || `Buch ${book.number}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Abschnitt</label>
                  <select
                    value={selectedSection?.number || ''}
                    onChange={(event) => setSelectedSectionNumber(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    {sections.map((section: any) => (
                      <option key={section.number} value={section.number}>
                        Kapitel {section.number}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Schriftgröße</p>
                  <div className="mt-2 flex items-center gap-2">
                    {FONT_SCALES.map((size) => (
                      <Button
                        key={size.label}
                        variant={fontScale === size.value ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setFontScale(size.value)}
                      >
                        {size.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Lesemodus</h2>
                  <p className="text-sm text-muted-foreground">Originaltext ohne Interaktionselemente</p>
                </div>
              </div>

              {selectedSection ? (
                <article className={`${fontScale} leading-9 text-foreground/95 font-serif`}> 
                  <h3 className="font-display text-2xl font-bold mb-5 not-italic">
                    {selectedBook?.title || `Buch ${selectedBook?.number}`}, Kapitel {selectedSection.number}
                  </h3>
                  <p>{selectedSection.latin}</p>
                </article>
              ) : (
                <p className="text-muted-foreground">Kein Abschnitt gefunden.</p>
              )}
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
