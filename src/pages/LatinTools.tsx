import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLexicon } from '@/hooks/use-lexicon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    ArrowLeft,
    RotateCcw,
    CheckCircle2,
    Brain,
    Gamepad2,
    GraduationCap,
    Trophy,
    Layers,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Info,
    XCircle,
    Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
type Mode = 'menu' | 'flashcards' | 'learn' | 'match' | 'test';
export default function LatinTools() {
    const [searchParams, setSearchParams] = useSearchParams();
    const mode = (searchParams.get('mode') as Mode) || 'menu';
    const { lexicon = [] } = useLexicon();
    const setMode = (newMode: Mode) => {
        if (newMode === 'menu') {
            setSearchParams({});
        } else {
            setSearchParams({ mode: newMode });
        }
    };
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [learnedCount, setLearnedCount] = useState(0);
    // Filter lexicon to ensure we have Latin translations
    const vocabList = useMemo(() => {
        return lexicon.filter(entry => entry.translations?.la?.term);
    }, []);
    const progress = (currentIndex / vocabList.length) * 100;
    const handleNext = () => {
        setIsFlipped(false);
        if (currentIndex < vocabList.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };
    const handlePrev = () => {
        setIsFlipped(false);
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };
    const reset = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setLearnedCount(0);
        setMode('menu');
    };
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                            <div className="w-8 h-[1px] bg-primary/30" />
                            LERNEN
                        </div>
                        <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
                            Meistere <span className="text-primary italic">Latein</span>
                        </h1>
                        <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
                            Wähle zwischen klassischen Texten und interaktivem Vokabeltraining.
                        </p>
                    </motion.div>
                    {mode !== 'menu' ? (
                        <button
                            onClick={() => setMode('menu')}
                            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Menü
                        </button>
                    ) : (
                        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2">
                            <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Start
                        </Link>
                    )}
                </div>
                <AnimatePresence mode="wait">
                    {mode === 'menu' && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {/* Antike Texte */}
                            <div className="space-y-4">
                                <div className="px-2">
                                    <h2 className="text-xl sm:text-2xl font-display font-bold mb-2">Antike Texte</h2>
                                    <p className="text-sm text-muted-foreground/70 font-light">Lies klassische lateinische Werke direkt eingebettet.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                    <Link to="/reader" className="contents">
                                        <ModeCard
                                            icon={Languages}
                                            title="Text-Reader"
                                            description="Lies klassische Texte direkt eingebettet mit klarer Kapitel- und Zeilennavigation."
                                            color="text-amber-500"
                                            onClick={() => { }}
                                            image="https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=800&auto=format&fit=crop"
                                        />
                                    </Link>
                                </div>
                            </div>
                            {/* Vokabeln Lernen */}
                            <div className="space-y-4">
                                <div className="px-2">
                                    <h2 className="text-xl sm:text-2xl font-display font-bold mb-2">Vokabeln Lernen</h2>
                                    <p className="text-sm text-muted-foreground/70 font-light">Interaktive Modi im Quizlet-Stil für effektives Lernen.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <Link to="/vocab" className="contents">
                                        <ModeCard
                                            icon={Languages}
                                            title="Vokabel-Wörterbuch"
                                            description="Durchsuche über 36.000 lateinische Vokabeln mit Deklinationen und Konjugationen."
                                            color="text-indigo-500"
                                            onClick={() => { }}
                                            count="36.000+"
                                            image="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop"
                                        />
                                    </Link>
                                    <ModeCard
                                        icon={Layers}
                                        title="Flashcards"
                                        description="Klassisches Karteikarten-Lernen mit flüssigen Animationen."
                                        color="text-blue-500"
                                        onClick={() => setMode('flashcards')}
                                        count={vocabList.length}
                                        image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop"
                                    />
                                    <ModeCard
                                        icon={Brain}
                                        title="Lernen"
                                        description="Aktives Erinnern durch personalisierte Multiple-Choice Fragen."
                                        color="text-purple-500"
                                        onClick={() => setMode('learn')}
                                        count={vocabList.length}
                                        image="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop"
                                    />
                                    <ModeCard
                                        icon={Gamepad2}
                                        title="Zuordnen"
                                        description="Ein schnelles Spiel zum Zuordnen von Begriffen unter Zeitdruck."
                                        color="text-orange-500"
                                        onClick={() => setMode('match')}
                                        image="https://images.unsplash.com/photo-1606326608941-48988ed99461?q=80&w=800&auto=format&fit=crop"
                                    />
                                    <ModeCard
                                        icon={GraduationCap}
                                        title="Test"
                                        description="Überprüfe dein Wissen in einem umfassenden schriftlichen Test."
                                        color="text-green-500"
                                        onClick={() => setMode('test')}
                                        image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {mode === 'flashcards' && (
                        <motion.div
                            key="flashcards"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-3xl mx-auto space-y-8"
                        >
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <span>Fortschritt</span>
                                    <span>{currentIndex + 1} / {vocabList.length}</span>
                                </div>
                                <Progress value={progress} className="h-1.5" />
                            </div>
                            <div
                                className="perspective-1000 h-[400px] cursor-pointer"
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                <motion.div
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                    className="relative w-full h-full preserve-3d"
                                >
                                    <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-12 card-modern border-primary/20 bg-card/40 backdrop-blur-md shadow-2xl">
                                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-8 opacity-60">Latein</span>
                                        <h2 className="text-4xl sm:text-6xl font-display font-bold text-center italic tracking-tight">
                                            {vocabList[currentIndex].translations?.la?.term}
                                        </h2>
                                        <p className="mt-12 text-muted-foreground/30 text-[10px] uppercase tracking-widest animate-pulse font-medium">Klicken zum Wenden</p>
                                    </Card>
                                    <Card
                                        className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-12 card-modern bg-primary/5 border-primary/40 backdrop-blur-md shadow-2xl"
                                        style={{ transform: 'rotateY(180deg)' }}
                                    >
                                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-8 opacity-60">Deutsch</span>
                                        <h2 className="text-4xl sm:text-6xl font-display font-medium text-center tracking-tight">
                                            {vocabList[currentIndex].term}
                                        </h2>
                                        <div className="mt-8 text-center max-w-md">
                                            <p className="text-sm text-muted-foreground/60 leading-relaxed italic line-clamp-3">
                                                {vocabList[currentIndex].translations?.la?.definition || vocabList[currentIndex].definition}
                                            </p>
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                            <div className="flex items-center justify-between gap-4 py-4 px-2">
                                <Button variant="ghost" size="icon" onClick={handlePrev} disabled={currentIndex === 0} className="h-14 w-14 rounded-2xl bg-secondary/20 border border-transparent hover:border-border/60 transition-all hover:scale-105 active:scale-95">
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <div className="flex gap-4">
                                    <Button variant="outline" onClick={reset} className="rounded-2xl h-14 px-8 border-border/60 hover:bg-card/60">
                                        <RotateCcw className="h-4 w-4 mr-2" /> Menü
                                    </Button>
                                    <Button onClick={handleNext} disabled={currentIndex === vocabList.length - 1} className="rounded-2xl h-14 px-12 group bg-primary hover:primary/90 shadow-lg shadow-primary/20">
                                        Nächste <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentIndex === vocabList.length - 1} className="h-14 w-14 rounded-2xl bg-secondary/20 border border-transparent hover:border-border/60 transition-all hover:scale-105 active:scale-95">
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                    {mode === 'learn' && (
                        <LearnMode vocabList={vocabList} onComplete={reset} />
                    )}
                    {mode === 'match' && (
                        <MatchMode vocabList={vocabList} onComplete={reset} />
                    )}
                    {mode === 'test' && (
                        <TestMode vocabList={vocabList} onComplete={reset} />
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}
function ModeCard({ icon: Icon, title, description, onClick, color, count, image }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: [0.2, 0.0, 0.0, 1.0] }}
            className="h-full"
        >
            <button
                onClick={onClick}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5 text-left"
            >
                {/* Visual Area */}
                <div className="relative h-44 w-full shrink-0 overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-card/60 backdrop-blur-sm" />
                    <div className={`absolute bottom-4 left-4 h-12 w-12 rounded-xl bg-background/50 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg`}>
                        <Icon className={cn("h-6 w-6", color)} />
                    </div>
                    {count && (
                        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                            {count} Begriffe
                        </div>
                    )}
                </div>
                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-between p-6 pt-4">
                    <div className="space-y-2">
                        <h3 className="font-display text-2xl font-bold tracking-tight">
                            {title}
                        </h3>
                        <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-3 font-light">
                            {description}
                        </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-border/10 pt-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                            Jetzt starten <ChevronRight className="h-3 w-3" />
                        </span>
                        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                </div>
            </button>
        </motion.div>
    );
}
function LearnMode({ vocabList, onComplete }: any) {
    const [index, setIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const questionsSubset = useMemo(() => {
        return vocabList.sort(() => 0.5 - Math.random()).slice(0, 10);
    }, [vocabList]);
    const options = useMemo(() => {
        if (!questionsSubset[index]) return [];
        const correct = questionsSubset[index].term;
        const others = vocabList
            .filter(v => v.term !== correct)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(v => v.term);
        return [correct, ...others].sort(() => 0.5 - Math.random());
    }, [index, questionsSubset, vocabList]);
    const handleOptionClick = (option: string) => {
        if (selectedOption) return;
        setSelectedOption(option);
        const correct = option === questionsSubset[index].term;
        setIsCorrect(correct);
        if (correct) setScore(s => s + 1);
        setTimeout(() => {
            if (index < questionsSubset.length - 1) {
                setIndex(i => i + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setShowResult(true);
            }
        }, 1200);
    };
    if (showResult) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-modern p-16 text-center space-y-8 max-w-2xl mx-auto bg-card/40 backdrop-blur-xl border-primary/20 shadow-2xl">
                <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-display font-bold tracking-tight">Training abgeschlossen!</h2>
                    <p className="text-xl text-muted-foreground font-light">Du hast <span className="text-primary font-bold">{score}</span> von <span className="font-bold">{questionsSubset.length}</span> richtig beantwortet.</p>
                </div>
                <Button onClick={onComplete} className="rounded-2xl px-12 h-14 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                    Zurück zum Menü
                </Button>
            </motion.div>
        );
    }
    if (!questionsSubset[index]) return null;
    return (
        <div className="max-w-2xl mx-auto space-y-12 py-4">
            <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Frage {index + 1} / {questionsSubset.length}</p>
                    <p className="text-xs text-muted-foreground/60 font-medium">Score: {score}</p>
                </div>
                <Progress value={(index / questionsSubset.length) * 100} className="h-1 bg-primary/5" />
            </div>
            <div className="text-center space-y-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">Was bedeutet dieses Wort?</p>
                <h2 className="text-6xl sm:text-7xl font-display font-bold italic tracking-tighter text-foreground selection:bg-primary/30">
                    {questionsSubset[index].translations?.la?.term}
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        disabled={!!selectedOption}
                        className={cn(
                            "p-8 rounded-2xl border transition-all duration-300 text-left font-medium relative group",
                            !selectedOption && "border-border/40 bg-card/40 hover:border-primary/50 hover:bg-primary/5 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-primary/5",
                            selectedOption === option && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-lg shadow-emerald-500/10",
                            selectedOption === option && !isCorrect && "border-destructive bg-destructive/10 text-destructive shadow-lg shadow-destructive/10",
                            selectedOption && option === questionsSubset[index].term && !isCorrect && "border-emerald-500/50 bg-emerald-500/5"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-base sm:text-lg">{option}</span>
                            <AnimatePresence>
                                {selectedOption === option && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        {isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
function MatchMode({ vocabList, onComplete }: any) {
    const [tiles, setTiles] = useState<any[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [matched, setMatched] = useState<number[]>([]);
    const [time, setTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    useEffect(() => {
        const subset = vocabList.sort(() => 0.5 - Math.random()).slice(0, 6);
        const latinTiles = subset.map((v, i) => ({ id: i, text: v.translations?.la?.term, pairId: i, type: 'la' }));
        const germanTiles = subset.map((v, i) => ({ id: i + 6, text: v.term, pairId: i, type: 'de' }));
        setTiles([...latinTiles, ...germanTiles].sort(() => 0.5 - Math.random()));
        const timer = setInterval(() => {
            if (!isFinished) setTime(t => t + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [vocabList, isFinished]);
    const handleTileClick = (index: number) => {
        if (matched.includes(index) || isFinished) return;
        if (selected === null) {
            setSelected(index);
        } else {
            if (selected === index) {
                setSelected(null);
                return;
            }
            const first = tiles[selected];
            const second = tiles[index];
            if (first.pairId === second.pairId && first.type !== second.type) {
                const newMatched = [...matched, selected, index];
                setMatched(newMatched);
                setSelected(null);
                if (newMatched.length === tiles.length) setIsFinished(true);
            } else {
                setSelected(index);
            }
        }
    };
    if (isFinished) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-modern p-16 text-center space-y-8 max-w-2xl mx-auto bg-card/40 backdrop-blur-xl border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
                <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Gamepad2 className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-display font-bold tracking-tight">Klasse gemacht!</h2>
                    <p className="text-xl text-muted-foreground font-light">Du hast alle Paare in <span className="text-emerald-500 font-bold">{time} Sekunden</span> gefunden.</p>
                </div>
                <Button onClick={onComplete} className="rounded-2xl px-12 h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 font-bold">
                    Zurück zum Menü
                </Button>
            </motion.div>
        );
    }
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-4">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 px-1">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    Zeit: {time}s
                </div>
                <div>Gefunden: {matched.length / 2} / 6 Paare</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {tiles.map((tile, i) => (
                    <motion.button
                        key={i}
                        whileHover={!matched.includes(i) ? { y: -4, scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" } : {}}
                        whileTap={!matched.includes(i) ? { scale: 0.98 } : {}}
                        onClick={() => handleTileClick(i)}
                        className={cn(
                            "h-32 sm:h-40 rounded-2xl border transition-all duration-500 flex items-center justify-center p-6 text-center text-sm sm:text-lg font-medium shadow-sm backdrop-blur-md",
                            matched.includes(i) ? "opacity-0 invisible scale-50" : "bg-card/40 border-border/40 hover:border-primary/40",
                            selected === i && "border-primary bg-primary/10 shadow-[0_0_25px_rgba(var(--primary),0.15)] ring-1 ring-primary/20"
                        )}
                    >
                        <span className={cn(tile.type === 'la' ? "italic font-display font-semibold" : "font-light")}>
                            {tile.text}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
function TestMode({ vocabList, onComplete }: any) {
    const [index, setIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [questions] = useState(() => vocabList.sort(() => 0.5 - Math.random()).slice(0, 5));
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isCorrect !== null || !userInput.trim()) return;
        const correct = userInput.toLowerCase().trim() === questions[index].term.toLowerCase().trim();
        setIsCorrect(correct);
        if (correct) setScore(s => s + 1);
        setTimeout(() => {
            if (index < questions.length - 1) {
                setIndex(i => i + 1);
                setUserInput('');
                setIsCorrect(null);
            } else {
                setShowResult(true);
            }
        }, 1800);
    };
    if (showResult) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-modern p-16 text-center space-y-8 max-w-2xl mx-auto bg-card/40 backdrop-blur-xl border-amber-500/20 shadow-2xl">
                <div className="h-24 w-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="h-12 w-12 text-amber-500" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-display font-bold tracking-tight">Test abgeschlossen!</h2>
                    <p className="text-xl text-muted-foreground font-light">Du hast <span className="text-amber-500 font-bold">{score} von {questions.length}</span> Fragen korrekt beantwortet.</p>
                </div>
                <Button onClick={onComplete} className="rounded-2xl px-12 h-14 bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-500/20 font-bold tracking-wider">
                    Zurück zum Menü
                </Button>
            </motion.div>
        );
    }
    return (
        <div className="max-w-xl mx-auto space-y-12 py-4">
            <div className="space-y-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Schriftliche Überprüfung</p>
                <motion.h2
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-display font-bold tracking-tighter italic text-foreground"
                >
                    {questions[index].translations?.la?.term}
                </motion.h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative group">
                    <input
                        autoFocus
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={isCorrect !== null}
                        placeholder="Deine Übersetzung..."
                        className={cn(
                            "w-full bg-card/40 backdrop-blur-md border-2 rounded-2xl px-8 py-6 outline-none transition-all duration-500 text-xl font-light shadow-sm",
                            isCorrect === null && "border-border/40 focus:border-primary/50 focus:shadow-2xl focus:shadow-primary/5",
                            isCorrect === true && "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-lg shadow-emerald-500/10",
                            isCorrect === false && "border-destructive bg-destructive/10 text-destructive shadow-lg shadow-destructive/10"
                        )}
                    />
                    <AnimatePresence>
                        {isCorrect !== null && (
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="absolute right-6 top-1/2 -translate-y-1/2"
                            >
                                {isCorrect ? <CheckCircle2 className="h-8 w-8 text-emerald-500" /> : <XCircle className="h-8 w-8 text-destructive" />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <AnimatePresence>
                    {isCorrect === false && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20 text-center"
                        >
                            <p className="text-xs uppercase tracking-widest text-destructive/60 mb-1">Richtig wäre:</p>
                            <p className="text-xl font-bold text-destructive tracking-tight">{questions[index].term}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Button type="submit" disabled={!userInput.trim() || isCorrect !== null} className="w-full h-16 rounded-2xl text-lg font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/10 hover:scale-[1.01] transition-transform active:scale-[0.99]">
                    Antwort prüfen
                </Button>
            </form>
        </div>
    );
}
