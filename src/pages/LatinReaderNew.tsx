import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, User, Languages, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { works } from '@/data/works';

// Import Latin texts
import deBelloGallicoText from '@/data/latin/caesar-de-bello-gallico.json';
import deOfficiisText from '@/data/latin-texts/de-officiis.json';

// Types for grammatical analysis
type GrammaticalAnalysis = {
  word: string;
  grammaticalInfo: {
    case?: string;
    gender?: string;
    number?: string;
    person?: string;
    tense?: string;
    mood?: string;
    voice?: string;
    role?: string;
  };
  highlighted: boolean;
  color?: string;
};

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
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationType, setTranslationType] = useState<'literal' | 'meaningful'>('literal');
  const [aiHelp, setAiHelp] = useState<string>('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [grammaticalAnalysis, setGrammaticalAnalysis] = useState<GrammaticalAnalysis[]>([]);
  const [isTextMinimized, setIsTextMinimized] = useState(false);
  const textAreaRef = useRef<HTMLDivElement>(null);

  // Get available authors with works
  const availableAuthors = ['caesar', 'cicero', 'augustus', 'seneca'];

  // Get works for selected author
  const authorWorks = authorId
    ? Object.values(works).filter((work: any) => work.author === authorId)
    : [];

  // Get selected work text
  const selectedWork = workSlug ? works[workSlug as keyof typeof works] : null;
  const latinText = selectedWork && LATIN_TEXTS[workSlug || ''];

  // Helper functions
  const handleSentenceSelect = (sentence: string, index: number) => {
    setSelectedSentence(sentence);
    setSelectedSentenceIndex(index);
    setShowTranslation(false);
    setShowAnalysis(false);
    setAiHelp('');
    setIsTextMinimized(true);
  };

  const handleTranslationHelp = () => {
    if (!selectedSentence) return;
    
    // Demo AI-powered grammatical analysis
    const words = selectedSentence.split(' ');
    const colors = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100'];
    const analysis: GrammaticalAnalysis[] = words.map((word, index) => ({
      word: word.replace(/[.,;:!?]/g, ''),
      grammaticalInfo: {
        case: index % 3 === 0 ? 'Nominativ' : index % 3 === 1 ? 'Akkusativ' : index % 3 === 2 ? 'Dativ' : undefined,
        gender: index % 4 === 0 ? 'maskulin' : index % 4 === 1 ? 'feminin' : index % 4 === 2 ? 'neutral' : undefined,
        number: index % 2 === 0 ? 'Singular' : 'Plural',
        role: index % 4 === 0 ? 'Subjekt' : index % 4 === 1 ? 'Objekt' : index % 4 === 2 ? 'Prädikat' : 'Adverbiale Bestimmung',
        person: index % 3 === 0 ? '1. Person' : index % 3 === 1 ? '2. Person' : '3. Person',
        tense: index % 3 === 0 ? 'Präsens' : index % 3 === 1 ? 'Perfekt' : 'Futur',
        mood: index % 3 === 0 ? 'Indikativ' : index % 3 === 1 ? 'Konjunktiv' : 'Imperativ',
        voice: index % 2 === 0 ? 'Aktiv' : 'Passiv'
      },
      highlighted: Math.random() > 0.5,
      color: colors[index % colors.length]
    }));
    
    setGrammaticalAnalysis(analysis);
    setShowAnalysis(true);
  };

  const getTranslation = (sentence: string): { literal: string; meaningful: string } => {
    // Demo translations - in real app this would come from API
    const translations: { [key: string]: { literal: string; meaningful: string } } = {
      "Gallia est omnis divisa in partes tres": {
        literal: "Gallien ist ganz geteilt in drei Teile",
        meaningful: "Ganz Gallien ist in drei Teile gegliedert"
      },
      "Hi omnes lingua, institutis, legibus inter se differunt": {
        literal: "Diese alle Sprache, Einrichtungen, Gesetzen unter sich unterscheiden",
        meaningful: "Diese alle unterscheiden sich durch Sprache, Einrichtungen und Gesetze untereinander"
      }
    };
    
    return translations[sentence] || {
      literal: "Übersetzung nicht verfügbar",
      meaningful: "Übersetzung nicht verfügbar"
    };
  };

  const resetSelection = () => {
    setSelectedSentence('');
    setSelectedSentenceIndex(null);
    setShowTranslation(false);
    setShowAnalysis(false);
    setAiHelp('');
    setIsTextMinimized(false);
  };

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

        <div className="space-y-8">
          {/* Latin Text */}
          <Card className="p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Languages className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">Lateinischer Text</h2>
                    <p className="text-sm text-muted-foreground">{selectedWork?.title}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTextMinimized(!isTextMinimized)}
                  className="hover:bg-primary/10"
                >
                  {isTextMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {latinText ? (
              <div className="space-y-8">
                {!isTextMinimized && (
                  <div className="space-y-6">
                    {latinText.books.map((book: any) => (
                      <div key={book.number} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{book.number}</span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground">{book.title}</h3>
                        </div>
                        {(Array.isArray(book.chapters) ? book.chapters : book.sections || []).map((chapter: any) => (
                          <div key={`book-${book.number}-chapter-${chapter.number}`} className="ml-11 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-secondary/50 flex items-center justify-center">
                                <span className="text-xs font-semibold text-muted-foreground">{chapter.number}</span>
                              </div>
                              <span className="text-sm font-medium text-muted-foreground">Kapitel</span>
                            </div>
                            
                            {/* Sentences */}
                            <div className="space-y-2 ml-8">
                              {chapter.latin.split(/[.!?]+/).filter((sentence: string) => sentence.trim().length > 0).map((sentence: string, index: number) => (
                                <div
                                  key={`chapter-${chapter.number}-sentence-${index}`}
                                  onClick={() => handleSentenceSelect(sentence.trim() + '.', index)}
                                  className={`group cursor-pointer rounded-xl border transition-all duration-300 ${
                                    selectedSentenceIndex === index
                                      ? 'bg-primary/10 border-primary/40 shadow-sm'
                                      : 'bg-secondary/5 border-border hover:border-primary/30 hover:bg-primary/5'
                                  } p-4`}
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="font-mono text-primary/60 text-sm w-6 text-right pt-1">
                                      {index + 1}
                                    </span>
                                    <p className="text-sm leading-relaxed font-serif text-foreground/90 group-hover:text-primary/90 transition-colors flex-1">
                                      {sentence.trim() + '.'}
                                    </p>
                                    {selectedSentenceIndex === index && (
                                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                
                {isTextMinimized && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary mb-4">
                      <BookOpen className="w-4 h-4" />
                      <span>Text fokussiert</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Text ist minimiert für bessere Konzentration auf die Analyse
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Text wird geladen...</p>
                <p className="text-sm mt-2">Bald verfügbar: Vollständiger lateinischer Originaltext</p>
              </div>
            )}
          </Card>

          {/* AI Helper - Beautiful Card Design */}
          {selectedSentence && (
            <Card className="sticky top-24">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">KI-Übersetzungshilfe</h3>
                    <p className="text-sm text-muted-foreground">Satz {selectedSentenceIndex !== null ? selectedSentenceIndex + 1 : ''}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetSelection}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </Button>
                </div>
                
                {/* Selected Sentence */}
                <div className="mb-6">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-sm leading-relaxed font-serif text-foreground">
                      {selectedSentence}
                    </p>
                  </div>
                </div>
                
                {/* Translation Options */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={translationType === 'literal' ? 'default' : 'outline'}
                      onClick={() => setTranslationType('literal')}
                      className="flex-1"
                    >
                      Wörtlich
                    </Button>
                    <Button
                      size="sm"
                      variant={translationType === 'meaningful' ? 'default' : 'outline'}
                      onClick={() => setTranslationType('meaningful')}
                      className="flex-1"
                    >
                      Sinnhaft
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowTranslation(!showTranslation)}
                      variant="outline"
                      className="w-full"
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      {showTranslation ? 'Übersetzung ausblenden' : 'Übersetzung anzeigen'}
                    </Button>
                    
                    <Button
                      onClick={handleTranslationHelp}
                      className="w-full"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Übersetzungshilfe
                    </Button>
                  </div>
                </div>
                
                {/* Translation Display */}
                {showTranslation && (
                  <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Languages className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {translationType === 'literal' ? 'Wörtliche Übersetzung' : 'Sinnhafte Übersetzung'}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {translationType === 'literal' 
                        ? getTranslation(selectedSentence).literal 
                        : getTranslation(selectedSentence).meaningful
                      }
                    </p>
                  </div>
                )}
                
                {/* AI Analysis Display */}
                {showAnalysis && (
                  <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        Grammatikalische Analyse (Demo)
                      </span>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {grammaticalAnalysis.map((analysis, index) => (
                        <div
                          key={`analysis-${analysis.word}-${index}`}
                          className="p-3 rounded-lg bg-background border border-border/50"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">{analysis.word}</span>
                            {analysis.highlighted && (
                              <span className="text-xs bg-amber-200/80 dark:bg-amber-800/80 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full font-medium">
                                {analysis.grammaticalInfo.role}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {analysis.grammaticalInfo.case && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Kasus: {analysis.grammaticalInfo.case}</span>
                            )}
                            {analysis.grammaticalInfo.gender && (
                              <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">Genus: {analysis.grammaticalInfo.gender}</span>
                            )}
                            {analysis.grammaticalInfo.number && (
                              <span className="text-xs bg-accent/10 text-accent-foreground px-2 py-1 rounded">Numerus: {analysis.grammaticalInfo.number}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Note */}
                <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Hinweis:</span> Die KI-Funktionen sind Demo-Versionen. 
                    In der finalen Version werden echte Übersetzungen und Grammatikanalysen bereitgestellt.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
