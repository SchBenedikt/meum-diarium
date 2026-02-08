import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Search,
    Badge,
    MessageSquare,
    Sparkles,
    Crown,
    X
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

export default function RhetoricalDevicesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedDevice, setSelectedDevice] = useState<RhetoricalDevice | null>(null);
    const [activeTab, setActiveTab] = useState<'devices' | 'riddles'>('devices');
    const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({});
    const [showResults, setShowResults] = useState<{[key: string]: boolean}>({});

    const rhetoricalDevices: RhetoricalDevice[] = rhetoricalDevicesData as RhetoricalDevice[];

    const latinRiddles: LatinRiddle[] = [
        {
            id: 'riddle1',
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
            id: 'riddle2',
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
            id: 'riddle3',
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
            id: 'riddle4',
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
            id: 'riddle5',
            latin: 'Ave Caesar, morituri te salutant.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Apostrophe', 'Rhetorische Frage', 'Parallelismus', 'Ironie'],
            correctAnswer: 0,
            device: 'Apostrophe',
            wirkung: 'Erzeugt emotionale Verbindung',
            explanation: 'Die Gladiatoren grüßen Caesar direkt, obwohl er nicht anwesend ist. Dies ist eine direkte Anrede (Apostrophe).',
            author: 'Sueton'
        },
        {
            id: 'riddle6',
            latin: 'Quid enim, o homines, quod hora non sit.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Ironie', 'Rhetorische Frage', 'Personifikation', 'Oxymoron'],
            correctAnswer: 1,
            device: 'Rhetorische Frage',
            wirkung: 'Regt zum Nachdenken an',
            explanation: 'Cicero stellt eine Frage, deren Antwort offensichtlich ist, um seine Zuhörer zum Nachdenken zu bringen.',
            author: 'Cicero'
        },
        {
            id: 'riddle7',
            latin: 'Gallia est omnis divisa in partes tres.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Antithese', 'Parallelismus', 'Alliteration', 'Metapher'],
            correctAnswer: 1,
            device: 'Parallelismus',
            wirkung: 'Schafft Klarheit und Struktur',
            explanation: 'Caesar beginnt sein Werk mit einer klaren, parallelen Struktur, die Gallien in drei Teile gliedert.',
            author: 'Caesar'
        },
        {
            id: 'riddle8',
            latin: 'Senatus Populusque Romanus.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Alliteration', 'Hyperbel', 'Hendiadyoin', 'Metapher'],
            correctAnswer: 2,
            device: 'Hendiadyoin',
            wirkung: 'Verbindet Konzepte eng miteinander',
            explanation: 'Die Verbindung von "Senatus" und "Populus" durch "que" ist ein klassisches Hendiadyoin, das zwei eng verbundene Konzepte verbindet.',
            author: 'Cicero'
        },
        {
            id: 'riddle9',
            latin: 'Arma virumque cano.',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Alliteration', 'Hyperbel', 'Metapher', 'Personifikation'],
            correctAnswer: 0,
            device: 'Alliteration',
            wirkung: 'Erzeugt musikalischen Rhythmus',
            explanation: 'Virgil eröffnet die Aeneis mit der Wiederholung des "a"-Lautes, was einen epischen, musikalischen Rhythmus erzeugt.',
            author: 'Virgil'
        },
        {
            id: 'riddle10',
            latin: 'O tempora, o mores!',
            question: 'Welches rhetorische Mittel wird hier verwendet?',
            options: ['Apostrophe', 'Alliteration', 'Hyperbel', 'Euphemismus'],
            correctAnswer: 0,
            device: 'Apostrophe',
            wirkung: 'Drückt Emotionen aus',
            explanation: 'Cicero ruft direkt die "Zeiten" und "Sitten" an, um seinen Frust über den moralischen Verfall auszudrücken.',
            author: 'Cicero'
        }
    ];

    const categories = [
        { id: 'figuren', name: 'Figuren', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
        { id: 'strukturen', name: 'Strukturen', color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' },
        { id: 'wirkungen', name: 'Wirkungen', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
        { id: 'argumente', name: 'Argumente', color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' }
    ];

    const filteredDevices = rhetoricalDevices.filter(device => {
        const matchesSearch = !searchQuery || 
            device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            device.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = !selectedCategory || device.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    const filteredRiddles = latinRiddles.filter(riddle => {
        const matchesSearch = !searchQuery || 
            riddle.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            riddle.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            riddle.device.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const currentRiddle = filteredRiddles[currentRiddleIndex];
    const hasNextRiddle = currentRiddleIndex < filteredRiddles.length - 1;
    const hasPreviousRiddle = currentRiddleIndex > 0;

    const handleAnswerSelect = (riddleId: string, optionIndex: number) => {
        setSelectedAnswers(prev => ({ ...prev, [riddleId]: optionIndex }));
        // Automatically check answer when option is selected
        setShowResults(prev => ({ ...prev, [riddleId]: true }));
    };

    const resetRiddle = (riddleId: string) => {
        setSelectedAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[riddleId];
            return newAnswers;
        });
        setShowResults(prev => {
            const newResults = { ...prev };
            delete newResults[riddleId];
            return newResults;
        });
    };

    const goToNextRiddle = () => {
        if (hasNextRiddle) {
            setCurrentRiddleIndex(prev => prev + 1);
            resetRiddle(currentRiddle?.id || '');
        }
    };

    const goToPreviousRiddle = () => {
        if (hasPreviousRiddle) {
            setCurrentRiddleIndex(prev => prev - 1);
            resetRiddle(currentRiddle?.id || '');
        }
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
                            Entdecke die wichtigsten rhetorischen Figuren der römischen Antike.
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
                                <span className="text-foreground">{latinRiddles.length}</span>
                                <span>Übungen</span>
                            </div>
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
                                variant={activeTab === 'riddles' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('riddles')}
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
                                    {filteredDevices.length} Ergebnisse gefunden
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
                            key="riddles"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            {currentRiddle && (
                                <Card className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                            <span className="text-sm font-semibold text-primary">
                                                Übung {currentRiddleIndex + 1} von {filteredRiddles.length}
                                            </span>
                                        </div>
                                        
                                        <div className="bg-secondary/30 rounded-2xl p-6 mb-6 border border-border/40">
                                            <p className="text-2xl font-mono text-center mb-4 text-primary">
                                                {currentRiddle.latin}
                                            </p>
                                            {currentRiddle.author && (
                                                <p className="text-sm text-muted-foreground">— {currentRiddle.author}</p>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-xl font-semibold mb-6">
                                            {currentRiddle.question}
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                            {currentRiddle.options.map((option, index) => (
                                                <Button
                                                    key={index}
                                                    variant={selectedAnswers[currentRiddle.id] === index ? 'default' : 'outline'}
                                                    onClick={() => handleAnswerSelect(currentRiddle.id, index)}
                                                    className={`p-4 h-auto text-left justify-start rounded-2xl transition-all duration-300 ${
                                                        selectedAnswers[currentRiddle.id] === index
                                                            ? index === currentRiddle.correctAnswer
                                                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
                                                                : 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                                                            : 'hover:border-primary/50'
                                                    }`}
                                                    disabled={showResults[currentRiddle.id]}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{option}</span>
                                                        {showResults[currentRiddle.id] && (
                                                            <span className="ml-2">
                                                                {index === currentRiddle.correctAnswer ? (
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
                                        
                                        {showResults[currentRiddle.id] && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-6 border-t border-border/40 pt-6"
                                            >
                                                <div className="text-center mb-4">
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                        <span className="text-sm font-bold">
                                                            {selectedAnswers[currentRiddle.id] === currentRiddle.correctAnswer ? 'Richtig!' : 'Falsch'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Only show "Richtiges Stilmittel" if answer was wrong */}
                                                {selectedAnswers[currentRiddle.id] !== currentRiddle.correctAnswer && (
                                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
                                                        <div className="text-center mb-3">
                                                            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">Richtiges Stilmittel</div>
                                                            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                                                                {currentRiddle.device}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                                                    <div className="text-center mb-3">
                                                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Wirkung</div>
                                                    </div>
                                                    <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                                                        {currentRiddle.wirkung}
                                                    </p>
                                                </div>

                                                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                                                    <div className="text-center mb-3">
                                                        <div className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">Erklärung</div>
                                                    </div>
                                                    <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
                                                        {currentRiddle.explanation}
                                                    </p>
                                                    {currentRiddle.author && (
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            Quelle: {currentRiddle.author}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex justify-center">
                                                    <Button
                                                        onClick={() => {
                                                            resetRiddle(currentRiddle.id);
                                                            if (hasNextRiddle) {
                                                                goToNextRiddle();
                                                            }
                                                        }}
                                                        variant="outline"
                                                        className="px-6 py-2 border-border/60 hover:bg-card/60 rounded-2xl"
                                                    >
                                                        <>
                                                            {hasNextRiddle ? (
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
                                                        </>
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
