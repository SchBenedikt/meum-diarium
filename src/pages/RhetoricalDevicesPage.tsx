import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowLeft, 
    ChevronRight, 
    Search, 
    Sparkles, 
    X, 
    CheckCircle2, 
    Eye, 
    Shuffle, 
    RefreshCw
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import rhetoricalDevicesData from '@/data/rhetorical-devices.json';

interface RhetoricalDevice {
    id: string;
    name: string;
    category: 'figuren' | 'strukturen' | 'wirkungen' | 'argumente';
    description: string;
    detailedDescription: string;
    wirkung: string;
    example?: string;
    author?: string;
    work?: string;
    application?: string;
}

interface LatinRiddle {
    id: string;
    latin: string;
    question: string;
    options: string[];
    correctAnswer: number;
    device: string;
    wirkung: string;
    explanation: string;
    author?: string;
}

interface ExerciseQuestion {
    id: string;
    type: 'multiple-choice' | 'identification' | 'translation' | 'creation' | 'analysis' | 'matching';
    latin: string;
    question: string;
    options?: string[];
    correctAnswer: number | string;
    device: string;
    wirkung: string;
    explanation: string;
    author?: string;
    translation?: string;
    hints?: string[];
}

interface MatchingItem {
    latin: string;
    german: string;
    device: string;
}

export default function RhetoricalDevicesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedDevice, setSelectedDevice] = useState<RhetoricalDevice | null>(null);
    const [activeTab, setActiveTab] = useState<'devices' | 'exercises'>('devices');
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string | number}>({});
    const [showResults, setShowResults] = useState<{[key: string]: boolean}>({});
    const [exerciseType, setExerciseType] = useState<'multiple-choice' | 'identification'>('multiple-choice');
    const [shuffledExercises, setShuffledExercises] = useState<ExerciseQuestion[]>([]);
    const [score, setScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);

    const rhetoricalDevices: RhetoricalDevice[] = rhetoricalDevicesData as RhetoricalDevice[];

    // Comprehensive exercise database with multiple types
    const allExercises: ExerciseQuestion[] = [
        // Multiple Choice Exercises
        {
            id: 'mc1',
            type: 'multiple-choice',
            latin: 'Alea iacta est.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Metapher', 'Hyperbel', 'Personifikation', 'Alliteration'],
            correctAnswer: 0,
            device: 'Metapher',
            wirkung: 'Schafft bildhafte Vorstellungen',
            explanation: 'Caesar verwendet die Metapher des geworfenen Würfels, um die Unumkehrbarkeit seiner Entscheidung auszudrücken.',
            author: 'Caesar'
        },
        {
            id: 'mc2',
            type: 'multiple-choice',
            latin: 'Veni, vidi, vici.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Parallelismus', 'Alliteration', 'Anapher', 'Hyperbel'],
            correctAnswer: 1,
            device: 'Alliteration',
            wirkung: 'Erzeugt Rhythmus und Einprägsamkeit',
            explanation: 'Die berühmten Worte beschreiben Caesars Feldzug. Die Wiederholung der "V"-Laute erzeugt eine starke Alliteration.',
            author: 'Caesar'
        },
        {
            id: 'mc3',
            type: 'multiple-choice',
            latin: 'Carthago delenda est.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Metapher', 'Hyperbel', 'Euphemismus', 'Ironie'],
            correctAnswer: 1,
            device: 'Hyperbel',
            wirkung: 'Erzeugt intensive Emotionen',
            explanation: 'Cato verwendet die Hyperbel, um Karthago als existenzbedrohung darzustellen, die vernichtet werden muss.',
            author: 'Cato'
        },
        {
            id: 'mc4',
            type: 'multiple-choice',
            latin: 'Dulce et decorum est pro patria mori.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Euphemismus', 'Personifikation', 'Apostrophe', 'Oxymoron'],
            correctAnswer: 0,
            device: 'Euphemismus',
            wirkung: 'Mildert unangenehme Inhalte',
            explanation: 'Horaz beschreibt den Tod im Krieg als "süß und geschmückt" - dies ist ein Euphemismus für das Sterben.',
            author: 'Horaz'
        },
        {
            id: 'mc5',
            type: 'multiple-choice',
            latin: 'Ave Caesar, morituri te salutant.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Apostrophe', 'Rhetorische Frage', 'Parallelismus', 'Ironie'],
            correctAnswer: 0,
            device: 'Apostrophe',
            wirkung: 'Spricht jemanden direkt an',
            explanation: 'Die Gladiatoren sprechen Caesar direkt an - eine klassische Apostrophe.',
            author: 'Sueton'
        },
        
        // Identification Exercises
        {
            id: 'ident1',
            type: 'identification',
            latin: 'Arma virumque cano, Troiae qui primus ab oris.',
            question: 'Welches rhetorische Mittel erkennst du?',
            correctAnswer: 'Alliteration',
            device: 'Alliteration',
            wirkung: 'Erzeugt rhythmische Wirkung',
            explanation: 'Virgil eröffnet die Aeneis mit der Wiederholung des "a"-Lautes, was einen epischen, musikalischen Rhythmus erzeugt.',
            author: 'Virgil',
            hints: ['Achte auf die Klangwirkung', 'Welche Laute werden wiederholt?']
        },
        {
            id: 'ident2',
            type: 'identification',
            latin: 'Alea iacta est.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            correctAnswer: 'Metapher',
            device: 'Metapher',
            wirkung: 'Schafft bildhafte Vorstellungen',
            explanation: 'Die wörtliche Übersetzung "Der Würfel ist gefallen" enthält die Metapher der Unumkehrbarkeit.',
            author: 'Caesar',
            hints: ['Wird etwas bildhaft ausgedrückt?', 'Denke an die Bedeutung']
        },
        {
            id: 'ident3',
            type: 'identification',
            latin: 'Veni, vidi, vici.',
            question: 'Welches rhetorische Mittel erkennst du?',
            correctAnswer: 'Alliteration',
            device: 'Alliteration',
            wirkung: 'Erzeugt musikalischen Rhythmus',
            explanation: 'Virgil eröffnet die Aeneis mit der Wiederholung des "a"-Lautes, was einen epischen, musikalischen Rhythmus erzeugt.',
            author: 'Virgil',
            hints: ['Achte auf die Klangwirkung', 'Welche Laute werden wiederholt?']
        },
        {
            id: 'ident4',
            type: 'identification',
            latin: 'Dulce et decorum est pro patria mori.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            correctAnswer: 'Hyperbel',
            device: 'Hyperbel',
            wirkung: 'Intensiviert die Aussage',
            explanation: 'Horace übertriebt die Schönheit des Todes für das Vaterland, um patriotische Gefühle zu stärken.',
            author: 'Horace',
            hints: ['Wird etwas übertrieben?', 'Denke an die Intensität']
        }
    ];

    // Shuffle exercises on component mount and when exercise type changes
    useEffect(() => {
        const filtered = exerciseType === 'multiple-choice' 
            ? allExercises.filter(ex => ex.type === exerciseType) 
            : allExercises.filter(ex => ex.type === 'identification');
        
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setShuffledExercises(shuffled);
        setCurrentExerciseIndex(0);
        resetAllAnswers();
    }, [exerciseType]);

    // Shuffle current exercises
    const shuffleCurrentExercises = () => {
        const shuffled = [...shuffledExercises].sort(() => Math.random() - 0.5);
        setShuffledExercises(shuffled);
        setCurrentExerciseIndex(0);
        resetAllAnswers();
    };

    const categories = [
        { id: 'figuren', name: 'Figuren', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
        { id: 'strukturen', name: 'Strukturen', color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' },
        { id: 'wendungen', name: 'Wirkungen', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
        { id: 'argumente', name: 'Argumente', color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' }
    ];

    const exerciseTypes = [
        { id: 'multiple-choice', name: 'Multiple Choice', icon: CheckCircle2, color: 'bg-blue-500' },
        { id: 'identification', name: 'Erkennung', icon: Eye, color: 'bg-emerald-500' },
    ];

    const filteredDevices = rhetoricalDevices.filter(device => {
        const matchesSearch = !searchQuery || 
            device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            device.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = !selectedCategory || device.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    const filteredExercises = useMemo(() => {
        return allExercises.filter(exercise => {
          const matchesType = exercise.type === exerciseType;
          const matchesSearch = !searchQuery || 
            exercise.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exercise.latin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exercise.device.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesType && matchesSearch;
        });
      }, [exerciseType, searchQuery]);

    const currentExercise = filteredExercises[currentExerciseIndex];
    const hasNextExercise = currentExerciseIndex < filteredExercises.length - 1;
    const hasPreviousExercise = currentExerciseIndex > 0;

    const resetAllAnswers = () => {
        setSelectedAnswers({});
        setShowResults({});
    };

    const resetExercise = (exerciseId: string) => {
        setSelectedAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[exerciseId];
            return newAnswers;
        });
        setShowResults(prev => {
            const newResults = { ...prev };
            delete newResults[exerciseId];
            return newResults;
        });
    };

    const handleAnswerSelect = (exerciseId: string, answer: string | number) => {
        setSelectedAnswers(prev => ({ ...prev, [exerciseId]: answer }));
        setShowResults(prev => ({ ...prev, [exerciseId]: true }));
        
        // Update score
        setTotalAttempts(prev => prev + 1);
        if (currentExercise && answer === currentExercise.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const goToNextExercise = () => {
        if (hasNextExercise) {
            setCurrentExerciseIndex(prev => prev + 1);
            resetExercise(currentExercise?.id || '');
        }
    };

    const goToPreviousExercise = () => {
        if (hasPreviousExercise) {
            setCurrentExerciseIndex(prev => prev - 1);
            resetExercise(currentExercise?.id || '');
        }
    };

    const resetProgress = () => {
        setScore(0);
        setTotalAttempts(0);
        resetAllAnswers();
        shuffleCurrentExercises();
    };

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                {/* Minimalist Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                            <div className="w-8 h-[1px] bg-primary/30" />
                            STILMITTEL
                        </div>
                        <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
                            Lateinische <span className="text-primary italic">Rhetorik</span>
                        </h1>
                        <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
                            Entdecke die wichtigsten rhetorischen Figuren mit interaktiven Übungen.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4 items-end"
                    >
                        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                            <div className="flex flex-col items-end">
                                <span className="text-foreground">{rhetoricalDevices.length}</span>
                                <span>Stilmittel</span>
                            </div>
                            <div className="w-px h-6 bg-border/40" />
                            <div className="flex flex-col items-end">
                                <span className="text-foreground">{allExercises.length}</span>
                                <span>Übungen</span>
                            </div>
                            {totalAttempts > 0 && (
                                <>
                                    <div className="w-px h-6 bg-border/40" />
                                    <div className="flex flex-col items-end">
                                        <span className="text-foreground">{Math.round((score / totalAttempts) * 100)}%</span>
                                        <span>Trefferquote</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <Link to="/learn" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2">
                            <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Lernen
                        </Link>
                    </motion.div>
                </div>
                {/* Search and Navigation */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="relative flex-1 group">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary/80 transition-all duration-300">
                                <Search className="h-5 w-5" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Stilmittel suchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 text-lg bg-card/60 backdrop-blur-xl border-2 border-border/40 rounded-2xl focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300 placeholder:text-muted-foreground/50"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 p-2"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={activeTab === 'devices' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('devices')}
                                className="px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                Stilmittel
                            </Button>
                            <Button
                                variant={activeTab === 'exercises' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('exercises')}
                                className="px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Übungen
                            </Button>
                        </div>
                    </div>

                    {/* Search Results Counter */}
                    {searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-center mt-4"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                                <Search className="h-4 w-4 text-primary/60" />
                                <span className="text-sm font-medium text-primary">
                                    {activeTab === 'devices' ? filteredDevices.length : filteredExercises.length} Ergebnisse gefunden
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* Category Filter */}
                    {activeTab === 'devices' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap gap-3 mt-6 justify-center"
                        >
                            <Button
                                variant={!selectedCategory ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory(null)}
                                size="sm"
                                className="rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                Alle
                            </Button>
                            {categories.map(category => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                                    onClick={() => setSelectedCategory(category.id)}
                                    size="sm"
                                    className="rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </motion.div>
                    )}

                    {/* Exercise Type Filter */}
                    {activeTab === 'exercises' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 mt-6"
                        >
                            <div className="flex flex-wrap gap-3 justify-center">
                                {exerciseTypes.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <Button
                                            key={type.id}
                                            variant={exerciseType === type.id ? 'default' : 'outline'}
                                            onClick={() => setExerciseType(type.id as any)}
                                            size="sm"
                                            className="rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                                        >
                                            <Icon className="w-4 h-4 mr-2" />
                                            {type.name}
                                        </Button>
                                    );
                                })}
                            </div>
                            
                            {/* Exercise Controls */}
                            <div className="flex justify-center gap-4">
                                <Button
                                    onClick={shuffleCurrentExercises}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <Shuffle className="w-4 h-4 mr-2" />
                                    Übungen mischen
                                </Button>
                                {totalAttempts > 0 && (
                                    <Button
                                        onClick={resetProgress}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Fortschritt zurücksetzen
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'devices' ? (
                        <motion.div
                            key="devices"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredDevices.map((device, index) => {
                                    const category = categories.find(c => c.id === device.category);
                                    return (
                                        <motion.div
                                            key={device.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8 hover:border-primary/50 transition-all duration-500 group cursor-pointer h-full"
                                                  onClick={() => setSelectedDevice(selectedDevice?.id === device.id ? null : device)}>
                                                <div className="flex items-start justify-between mb-4">
                                                    {category && (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.color}`}>
                                                            {category.name}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                    {device.name}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed mb-4">
                                                    {device.description}
                                                </p>
                                                
                                                <div className="flex items-center text-primary text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                                    Mehr erfahren
                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Popup Modal */}
                            <AnimatePresence>
                                {selectedDevice && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                        onClick={() => setSelectedDevice(null)}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/40 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex items-start justify-between mb-6">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedDevice(null)}
                                                    className="p-2 hover:bg-primary/10 rounded-xl"
                                                >
                                                    <X className="w-5 h-5" />
                                                </Button>
                                            </div>
                                            
                                            <h3 className="font-display text-2xl font-bold mb-4 text-primary">
                                                {selectedDevice.name}
                                            </h3>
                                            
                                            {(() => {
                                                const deviceCategory = categories.find(c => c.id === selectedDevice.category);
                                                return deviceCategory ? (
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${deviceCategory.color} mb-4`}>
                                                        {deviceCategory.name}
                                                    </span>
                                                ) : null;
                                            })()}
                                            
                                            <p className="text-muted-foreground leading-relaxed mb-6">
                                                {selectedDevice.detailedDescription}
                                            </p>
                                            
                                            <div className="space-y-4">
                                                <div className="p-4 bg-secondary/30 rounded-xl">
                                                    <p className="text-sm font-semibold text-primary mb-2">Wirkung:</p>
                                                    <p className="text-sm">{selectedDevice.wirkung}</p>
                                                </div>
                                                
                                                {selectedDevice.example && (
                                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                                        <p className="text-sm font-semibold text-primary mb-2">Beispiel:</p>
                                                        <p className="text-sm italic">"{selectedDevice.example}"</p>
                                                        {selectedDevice.author && (
                                                            <p className="text-xs text-muted-foreground mt-2">— {selectedDevice.author}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="exercises"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            {currentExercise && (
                                <Card className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                            <span className="text-sm font-semibold text-primary">
                                                Übung {currentExerciseIndex + 1} von {filteredExercises.length}
                                            </span>
                                        </div>
                                        
                                        {/* Exercise Type Badge */}
                                        <div className="mb-6">
                                            {(() => {
                                                const exerciseTypeInfo = exerciseTypes.find(t => t.id === currentExercise.type);
                                                const Icon = exerciseTypeInfo?.icon || CheckCircle2;
                                                return (
                                                    <Badge className={`${exerciseTypeInfo?.color || 'bg-gray-500'} text-white px-4 py-2 rounded-full text-sm`}>
                                                <Icon className="w-4 h-4 mr-2" />
                                                {exerciseTypeInfo?.name || currentExercise.type}
                                            </Badge>
                                                );
                                            })()}
                                        </div>
                                        
                                        {/* Latin Text (if available) */}
                                        {currentExercise.latin && (
                                            <div className="bg-secondary/30 rounded-2xl p-6 mb-6 border border-border/40">
                                                <p className="text-2xl font-mono text-left mb-4 text-primary">
                                                    {currentExercise.latin}
                                                </p>
                                                {currentExercise.author && (
                                                    <p className="text-sm text-muted-foreground text-left">— {currentExercise.author}</p>
                                                )}
                                            </div>
                                        )}
                                        
                                        <h3 className="text-xl font-semibold mb-6">
                                            {currentExercise.question}
                                        </h3>
                                        
                                        {/* Hints for creation/analysis exercises */}
                                        {currentExercise.hints && currentExercise.hints.length > 0 && (
                                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 mb-6 border border-amber-200 dark:border-amber-800">
                                                <div className="text-center mb-2">
                                                    <div className="text-sm font-medium text-amber-700 dark:text-amber-300">Hinweise:</div>
                                                </div>
                                                <ul className="space-y-1">
                                                    {currentExercise.hints.map((hint, idx) => (
                                                        <li key={idx} className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                                            {hint}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {/* Multiple Choice Exercises */}
                                        {currentExercise.type === 'multiple-choice' && currentExercise.options && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                                {currentExercise.options.map((option, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={selectedAnswers[currentExercise.id] === index ? 'default' : 'outline'}
                                                        onClick={() => handleAnswerSelect(currentExercise.id, index)}
                                                        className={`p-4 h-auto text-left justify-start rounded-2xl transition-all duration-300 ${
                                                            selectedAnswers[currentExercise.id] === index
                                                                ? index === currentExercise.correctAnswer
                                                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
                                                                    : 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                                                                : 'hover:border-primary/50'
                                                        }`}
                                                        disabled={showResults[currentExercise.id]}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{option}</span>
                                                            {showResults[currentExercise.id] && (
                                                                <span className="ml-2">
                                                                    {index === currentExercise.correctAnswer ? (
                                                                        <CheckCircle2 className="h-5 w-5" />
                                                                    ) : (
                                                                        <span className="text-xs">✗</span>
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Text Input Exercises (Identification only) */}
                                        {currentExercise.type === 'identification' && (
                                            <div className="mb-8">
                                                <Input
                                                    placeholder="Deine Antwort..."
                                                    value={(selectedAnswers[currentExercise.id] as string) || ''}
                                                    onChange={(e) => setSelectedAnswers(prev => ({ ...prev, [currentExercise.id]: e.target.value }))}
                                                    className="text-center text-lg p-4 rounded-2xl border-2 border-border/40 focus:border-primary/50"
                                                    disabled={showResults[currentExercise.id]}
                                                />
                                                {!showResults[currentExercise.id] && (
                                                    <div className="text-center mt-4">
                                                        <Button
                                                            onClick={() => handleAnswerSelect(currentExercise.id, (selectedAnswers[currentExercise.id] as string) || '')}
                                                            className="px-8 py-3 rounded-2xl"
                                                            disabled={!selectedAnswers[currentExercise.id]}
                                                        >
                                                            Antwort prüfen
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Results Section */}
                                        {showResults[currentExercise.id] && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-6 border-t border-border/40 pt-6"
                                            >
                                                <div className="text-center mb-4">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                                                        (() => {
                                                            const userAnswer = selectedAnswers[currentExercise.id];
                                                            const isCorrect = currentExercise.type === 'multiple-choice' 
                                                                ? userAnswer === currentExercise.correctAnswer
                                                                : typeof currentExercise.correctAnswer === 'string'
                                                                    ? (userAnswer as string)?.toLowerCase().includes((currentExercise.correctAnswer as string).toLowerCase())
                                                                    : false;
                                                            return isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white';
                                                        })()
                                                    }`}>
                                                        <CheckCircle2 className="h-5 w-5" />
                                                        <span className="text-sm font-bold">
                                                            {(() => {
                                                                const userAnswer = selectedAnswers[currentExercise.id];
                                                                const isCorrect = currentExercise.type === 'multiple-choice' 
                                                                    ? userAnswer === currentExercise.correctAnswer
                                                                    : typeof currentExercise.correctAnswer === 'string'
                                                                        ? (userAnswer as string)?.toLowerCase().includes((currentExercise.correctAnswer as string).toLowerCase())
                                                                        : false;
                                                                return isCorrect ? 'Richtig!' : 'Falsch';
                                                            })()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Only show correct answer if answer was wrong */}
                                                {(() => {
                                                    const userAnswer = selectedAnswers[currentExercise.id];
                                                    const isCorrect = currentExercise.type === 'multiple-choice' 
                                                        ? userAnswer === currentExercise.correctAnswer
                                                        : typeof currentExercise.correctAnswer === 'string'
                                                            ? (userAnswer as string)?.toLowerCase().includes((currentExercise.correctAnswer as string).toLowerCase())
                                                            : false;
                                                    
                                                    return !isCorrect && (
                                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
                                                            <div className="text-center mb-3">
                                                                <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                                                                    {currentExercise.type === 'multiple-choice' ? 'Richtige Antwort:' : 'Richtiges Stilmittel:'}
                                                                </div>
                                                                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                                                                    {currentExercise.type === 'multiple-choice' 
                                                                        ? currentExercise.options?.[currentExercise.correctAnswer as number]
                                                                        : currentExercise.correctAnswer}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                
                                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                                                    <div className="text-center mb-3">
                                                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Wirkung</div>
                                                    </div>
                                                    <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                                                        {currentExercise.wirkung}
                                                    </p>
                                                </div>

                                                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                                                    <div className="text-center mb-3">
                                                        <div className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">Erklärung</div>
                                                    </div>
                                                    <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
                                                        {currentExercise.explanation}
                                                    </p>
                                                    {currentExercise.author && (
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            Quelle: {currentExercise.author}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex justify-center">
                                                    <Button
                                                        onClick={() => {
                                                            resetExercise(currentExercise.id);
                                                            if (hasNextExercise) {
                                                                goToNextExercise();
                                                            }
                                                        }}
                                                        variant="outline"
                                                        className="px-6 py-2 border-border/60 hover:bg-card/60 rounded-2xl"
                                                    >
                                                        {hasNextExercise ? (
                                                            <>
                                                                <span className="mr-2">Nächste Frage</span>
                                                                <ChevronRight className="h-4 w-4" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="mr-2">Zurück zur Übersicht</span>
                                                                <ArrowLeft className="h-4 w-4" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </Card>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}
