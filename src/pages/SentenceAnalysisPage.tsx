import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Lightbulb,
  BookOpen,
  Target,
  Shuffle,
  Play
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

interface Word {
  id: string;
  latin: string;
  german: string;
  grammaticalInfo: {
    case?: string;
    gender?: string;
    number?: string;
    declension?: string;
    conjugation?: string;
    tense?: string;
    mood?: string;
    voice?: string;
    person?: string;
  };
  position?: number;
}

interface Sentence {
  id: string;
  latin: string;
  german: string;
  words: Word[];
  difficulty: 'easy' | 'medium' | 'hard';
  grammarFocus: string[];
  author?: string;
  work?: string;
}

const sampleSentences: Sentence[] = [
  {
    id: '1',
    latin: 'Gallia est omnis divisa in partes tres.',
    german: 'Gallien ist ganz in drei Teile geteilt.',
    difficulty: 'easy',
    grammarFocus: ['Subjekt-Prädikat-Objekt', 'Akkusativ'],
    author: 'Caesar',
    work: 'De Bello Gallico',
    words: [
      {
        id: '1-1',
        latin: 'Gallia',
        german: 'Gallien',
        grammaticalInfo: { case: 'Nominativ', gender: 'Feminin', number: 'Singular', declension: 'a-Deklination' }
      },
      {
        id: '1-2',
        latin: 'est',
        german: 'ist',
        grammaticalInfo: { person: '3', number: 'Singular', tense: 'Präsens', mood: 'Indikativ', voice: 'Aktiv' }
      },
      {
        id: '1-3',
        latin: 'omnis',
        german: 'ganz',
        grammaticalInfo: { case: 'Nominativ', gender: 'Feminin', number: 'Singular', declension: 'a-Deklination' }
      },
      {
        id: '1-4',
        latin: 'divisa',
        german: 'geteilt',
        grammaticalInfo: { case: 'Nominativ', gender: 'Feminin', number: 'Singular', declension: 'a-Deklination' }
      },
      {
        id: '1-5',
        latin: 'in',
        german: 'in',
        grammaticalInfo: {}
      },
      {
        id: '1-6',
        latin: 'partes',
        german: 'Teile',
        grammaticalInfo: { case: 'Akkusativ', gender: 'Feminin', number: 'Plural', declension: 'e-Deklination' }
      },
      {
        id: '1-7',
        latin: 'tres',
        german: 'drei',
        grammaticalInfo: { case: 'Akkusativ', gender: 'Feminin', number: 'Plural', declension: 'a-Deklination' }
      }
    ]
  },
  {
    id: '2',
    latin: 'Alea iacta est.',
    german: 'Der Würfel ist gefallen.',
    difficulty: 'easy',
    grammarFocus: ['Satzbau', 'Perfekt'],
    author: 'Caesar',
    work: 'De Bello Civili',
    words: [
      {
        id: '2-1',
        latin: 'Alea',
        german: 'Der Würfel',
        grammaticalInfo: { case: 'Nominativ', gender: 'Feminin', number: 'Singular', declension: 'a-Deklination' }
      },
      {
        id: '2-2',
        latin: 'iacta',
        german: 'geworfen',
        grammaticalInfo: { case: 'Nominativ', gender: 'Feminin', number: 'Singular', declension: 'a-Deklination' }
      },
      {
        id: '2-3',
        latin: 'est',
        german: 'ist',
        grammaticalInfo: { person: '3', number: 'Singular', tense: 'Perfekt', mood: 'Indikativ', voice: 'Aktiv' }
      }
    ]
  },
  {
    id: '3',
    latin: 'Veni, vidi, vici.',
    german: 'Ich kam, ich sah, ich siegte.',
    difficulty: 'medium',
    grammarFocus: ['Perfekt', 'Reihung'],
    author: 'Caesar',
    work: 'Brief an Sallust',
    words: [
      {
        id: '3-1',
        latin: 'Veni',
        german: 'Ich kam',
        grammaticalInfo: { person: '1', number: 'Singular', tense: 'Perfekt', mood: 'Indikativ', voice: 'Aktiv' }
      },
      {
        id: '3-2',
        latin: 'vidi',
        german: 'ich sah',
        grammaticalInfo: { person: '1', number: 'Singular', tense: 'Perfekt', mood: 'Indikativ', voice: 'Aktiv' }
      },
      {
        id: '3-3',
        latin: 'vici',
        german: 'ich siegte',
        grammaticalInfo: { person: '1', number: 'Singular', tense: 'Perfekt', mood: 'Indikativ', voice: 'Aktiv' }
      }
    ]
  }
];

const SentenceAnalysisPage = () => {
  const [currentSentence, setCurrentSentence] = useState<Sentence>(sampleSentences[0]);
  const [draggedWords, setDraggedWords] = useState<Word[]>([]);
  const [droppedWords, setDroppedWords] = useState<Word[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedMode, setSelectedMode] = useState<'dragdrop' | 'identify' | 'translate'>('dragdrop');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [userTranslation, setUserTranslation] = useState('');

  useEffect(() => {
    // Initialize words for drag and drop
    const shuffled = [...currentSentence.words].sort(() => Math.random() - 0.5);
    setDraggedWords(shuffled);
    setDroppedWords([]);
    setShowSolution(false);
    setUserTranslation('');
    setSelectedWord(null);
  }, [currentSentence]);

  const handleDragStart = (e: React.DragEvent, word: Word) => {
    e.dataTransfer.setData('word', JSON.stringify(word));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const word = JSON.parse(e.dataTransfer.getData('word'));
    
    if (!droppedWords.find(w => w.id === word.id)) {
      setDroppedWords([...droppedWords, word]);
      setDraggedWords(draggedWords.filter(w => w.id !== word.id));
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent, word: Word) => {
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLElement;
    
    // Store the word data and initial touch position
    element.dataset.word = JSON.stringify(word);
    element.dataset.touchStartX = touch.clientX.toString();
    element.dataset.touchStartY = touch.clientY.toString();
    
    // Add visual feedback
    element.style.opacity = '0.7';
    element.style.transform = 'scale(1.05)';
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLElement;
    
    // Move the element with the touch
    element.style.position = 'fixed';
    element.style.left = `${touch.clientX - element.offsetWidth / 2}px`;
    element.style.top = `${touch.clientY - element.offsetHeight / 2}px`;
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const element = e.currentTarget as HTMLElement;
    
    // Reset element styles
    element.style.position = '';
    element.style.left = '';
    element.style.top = '';
    element.style.zIndex = '';
    element.style.pointerEvents = '';
    element.style.opacity = '';
    element.style.transform = '';
    
    // Get the word data
    const wordData = element.dataset.word;
    if (!wordData) return;
    
    const word = JSON.parse(wordData);
    
    // Check if touch ended over drop zone
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
      const rect = dropZone.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        // Add to drop zone
        if (!droppedWords.find(w => w.id === word.id)) {
          setDroppedWords([...droppedWords, word]);
          setDraggedWords(draggedWords.filter(w => w.id !== word.id));
        }
      }
    }
    
    // Clean up dataset
    delete element.dataset.word;
    delete element.dataset.touchStartX;
    delete element.dataset.touchStartY;
  };

  const handleRemoveWord = (wordId: string) => {
    const word = droppedWords.find(w => w.id === wordId);
    if (word) {
      setDroppedWords(droppedWords.filter(w => w.id !== wordId));
      setDraggedWords([...draggedWords, word]);
    }
  };

  const checkSolution = () => {
    const userOrder = droppedWords.map(w => w.latin).join(' ');
    const correctOrder = currentSentence.words.map(w => w.latin).join(' ');
    
    setAttempts(attempts + 1);
    
    if (userOrder === correctOrder) {
      setScore(score + 1);
      setShowSolution(true);
    } else {
      // Show which words are in wrong position
      setShowSolution(true);
    }
  };

  const resetExercise = () => {
    const shuffled = [...currentSentence.words].sort(() => Math.random() - 0.5);
    setDraggedWords(shuffled);
    setDroppedWords([]);
    setShowSolution(false);
    setUserTranslation('');
    setSelectedWord(null);
  };

  const nextSentence = () => {
    const currentIndex = sampleSentences.findIndex(s => s.id === currentSentence.id);
    const nextIndex = (currentIndex + 1) % sampleSentences.length;
    setCurrentSentence(sampleSentences[nextIndex]);
  };

  const shuffleWords = () => {
    const shuffled = [...draggedWords, ...droppedWords].sort(() => Math.random() - 0.5);
    setDraggedWords(shuffled);
    setDroppedWords([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/learn/grammar" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Grammatik
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Interaktive Satzanalyse
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Lateinische Sätze analysieren und verstehen
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {score}/{attempts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Punkte
              </div>
            </div>
          </div>
        </div>

        {/* Sentence Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Satz {currentSentence.id}
                </CardTitle>
                <CardDescription>
                  {currentSentence.author && `${currentSentence.author} - ${currentSentence.work}`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(currentSentence.difficulty)}>
                  {currentSentence.difficulty === 'easy' ? 'Einfach' : 
                   currentSentence.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
                </Badge>
                <Button variant="outline" size="sm" onClick={shuffleWords}>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Mischen
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                Latein: {currentSentence.latin}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Deutsch: {currentSentence.german}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {currentSentence.grammarFocus.map((focus, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Modes */}
        <Tabs value={selectedMode} onValueChange={(value) => setSelectedMode(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dragdrop">Satzbau</TabsTrigger>
            <TabsTrigger value="identify">Wörter analysieren</TabsTrigger>
            <TabsTrigger value="translate">Übersetzen</TabsTrigger>
          </TabsList>

          {/* Drag & Drop Mode */}
          <TabsContent value="dragdrop" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Ordne die Wörter in der richtigen Reihenfolge an
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drop Zone */}
                <div 
                  id="drop-zone"
                  className="min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {droppedWords.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      Ziehe die Wörter hierher, um den Satz zu bilden
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {droppedWords.map((word, index) => (
                        <motion.div
                          key={word.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <div 
                            className={`px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg cursor-pointer border-2 ${
                              showSolution && word.position !== undefined && word.position === index
                                ? 'border-green-500 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : showSolution
                                ? 'border-red-500 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                : 'border-blue-300 dark:border-blue-700'
                            }`}
                            onClick={() => handleRemoveWord(word.id)}
                          >
                            {word.latin}
                            <div className="text-xs opacity-75 mt-1">{word.german}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Words */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Verfügbare Wörter:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {draggedWords.map((word) => (
                      <div
                        key={word.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, word)}
                        onTouchStart={(e) => handleTouchStart(e, word)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-move hover:shadow-md transition-shadow touch-manipulation"
                      >
                        {word.latin}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{word.german}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={checkSolution} disabled={droppedWords.length === 0}>
                    <Play className="h-4 w-4 mr-2" />
                    Prüfen
                  </Button>
                  <Button variant="outline" onClick={resetExercise}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Zurücksetzen
                  </Button>
                  {showSolution && (
                    <Button variant="outline" onClick={nextSentence}>
                      Nächster Satz
                    </Button>
                  )}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {showSolution && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 rounded-lg ${
                        droppedWords.map(w => w.latin).join(' ') === currentSentence.words.map(w => w.latin).join(' ')
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {droppedWords.map(w => w.latin).join(' ') === currentSentence.words.map(w => w.latin).join(' ') ? (
                          <><CheckCircle2 className="h-5 w-5" /> Richtig!</>
                        ) : (
                          <><XCircle className="h-5 w-5" /> Versuche es noch einmal</>
                        )}
                      </div>
                      <div className="text-sm">
                        Korrekte Reihenfolge: <strong>{currentSentence.words.map(w => w.latin).join(' ')}</strong>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Word Identification Mode */}
          <TabsContent value="identify" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Klicke auf ein Wort, um seine grammatikalischen Eigenschaften zu sehen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {currentSentence.words.map((word) => (
                      <Button
                        key={word.id}
                        variant={selectedWord?.id === word.id ? "default" : "outline"}
                        onClick={() => setSelectedWord(word)}
                        className="h-auto p-3"
                      >
                        <div>
                          <div className="font-medium">{word.latin}</div>
                          <div className="text-xs opacity-75">{word.german}</div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {selectedWord && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
                    >
                      <h3 className="font-medium mb-2">Grammatikalische Analyse:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {Object.entries(selectedWord.grammaticalInfo).map(([key, value]) => (
                          value && (
                            <div key={key}>
                              <span className="font-medium capitalize">{key}:</span> {value}
                            </div>
                          )
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Translation Mode */}
          <TabsContent value="translate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Übersetze den Satz ins Deutsche</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-medium mb-2">{currentSentence.latin}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Tipp: {currentSentence.grammarFocus.join(', ')}
                  </div>
                </div>

                <textarea
                  value={userTranslation}
                  onChange={(e) => setUserTranslation(e.target.value)}
                  placeholder="Deine Übersetzung..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />

                <div className="flex gap-2">
                  <Button onClick={() => setShowSolution(true)}>
                    Lösung anzeigen
                  </Button>
                  <Button variant="outline" onClick={() => setUserTranslation('')}>
                    Zurücksetzen
                  </Button>
                </div>

                {showSolution && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg"
                  >
                    <h3 className="font-medium mb-2">Korrekte Übersetzung:</h3>
                    <p>{currentSentence.german}</p>
                    {userTranslation && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Deine Übersetzung: {userTranslation}
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fortschritt</span>
                <span>{attempts > 0 ? Math.round((score / attempts) * 100) : 0}%</span>
              </div>
              <Progress value={attempts > 0 ? (score / attempts) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default SentenceAnalysisPage;
