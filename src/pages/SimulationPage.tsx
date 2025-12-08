import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { authors } from '@/data/authors';
import { Author } from '@/types/blog';
import { simulations, SimulationScenario, SimulationStats } from '@/data/simulations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Users, Sword, Play, RefreshCw, Send, Plus, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function SimulationPage() {
    const { authorId } = useParams<{ authorId: string }>();
    const { setCurrentAuthor } = useAuthor();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [customScenarioText, setCustomScenarioText] = useState('');

    // Game State
    const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);
    const [currentEventId, setCurrentEventId] = useState<string | null>(null);
    const [stats, setStats] = useState<SimulationStats>({ welfare: 0, influence: 0, power: 0 });
    const [history, setHistory] = useState<{ text: string, type: 'narrative' | 'choice' | 'feedback' }[]>([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [customInput, setCustomInput] = useState('');

    // Auto-scroll to bottom when history changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const author = authorId ? authors[authorId as Author] : null;
    const allScenarios = authorId && simulations[authorId] ? simulations[authorId] : [];
    const filteredScenarios = allScenarios.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (authorId) {
            setCurrentAuthor(authorId as Author);
        }
    }, [authorId, setCurrentAuthor]);

    const startGame = (scenario: SimulationScenario) => {
        setActiveScenario(scenario);
        setStats(scenario.initialStats);
        setCurrentEventId(scenario.startEventId);
        setGameEnded(false);
        setHistory([{
            text: scenario.events[scenario.startEventId].description,
            type: 'narrative'
        }]);
    };

    const handleChoice = (choiceId: string) => {
        if (!activeScenario || !currentEventId) return;

        const currentEvent = activeScenario.events[currentEventId];
        const choice = currentEvent.choices.find(c => c.id === choiceId);

        if (!choice) return;

        // Apply stats
        setStats(prev => ({
            welfare: Math.max(0, Math.min(100, prev.welfare + (choice.effect.welfare || 0))),
            influence: Math.max(0, Math.min(100, prev.influence + (choice.effect.influence || 0))),
            power: Math.max(0, Math.min(100, prev.power + (choice.effect.power || 0))),
        }));

        // Add history
        setHistory(prev => [
            ...prev,
            { text: choice.text, type: 'choice' },
            { text: choice.response, type: 'feedback' }
        ]);

        // Navigate
        if (choice.nextEventId === 'END') {
            setGameEnded(true);
        } else {
            setCurrentEventId(choice.nextEventId);
            setTimeout(() => {
                setHistory(prev => [
                    ...prev,
                    { text: activeScenario.events[choice.nextEventId].description, type: 'narrative' }
                ]);
            }, 800);
        }
    };

    const handleCustomInput = () => {
        if (!customInput.trim()) return;

        setHistory(prev => [
            ...prev,
            { text: customInput, type: 'choice' },
            { text: "Deine Berater notieren den Vorschlag, weisen aber darauf hin, dass die Demo nur vordefinierte Pfade unterstützt.", type: 'feedback' }
        ]);
        setCustomInput('');
    };

    if (!author) return null;

    // --- SCENARIO SELECTION VIEW ---
    if (!activeScenario) {
        const handleCustomSubmit = () => {
            if (customScenarioText.trim()) {
                // Store in sessionStorage for demo purposes
                sessionStorage.setItem('customScenario', customScenarioText);
                navigate(`/${authorId}/simulation?custom=true`);
                alert(`Szenario wird vorbereitet:\n\n"${customScenarioText}"\n\n(In der vollständigen Version würde hier KI-generierter Inhalt erscheinen)`);
                setCustomScenarioText('');
                setShowCustomForm(false);
            }
        };

        return (
            <div className="min-h-screen bg-background flex flex-col pt-16">
                <div className="container mx-auto px-4 py-6 sm:p-6 max-w-7xl">
                    <Link to={`/${authorId}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8">
                        <ArrowLeft className="h-4 w-4" />
                        Zurück zum Dashboard
                    </Link>

                    <div className="mb-6 sm:mb-8">
                        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">Textbased Game</h1>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                            Übernimm die Rolle von {author.name}. Erlebe Geschichte aus der Ich-Perspektive und triff Entscheidungen, die mein Schicksal bestimmen.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Szenarien durchsuchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10 bg-secondary/30 border-border/50"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Custom Scenario Card/Form */}
                        <AnimatePresence mode="wait">
                            {showCustomForm ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative overflow-hidden rounded-lg border border-primary/30 bg-card p-6 flex flex-col min-h-[220px]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-display text-lg font-medium">Neues Szenario</h3>
                                        <button onClick={() => setShowCustomForm(false)} className="text-muted-foreground hover:text-foreground">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <textarea
                                        placeholder="Beschreibe das historische Ereignis, das du erleben möchtest..."
                                        value={customScenarioText}
                                        onChange={(e) => setCustomScenarioText(e.target.value)}
                                        className="flex-1 w-full p-3 rounded-lg bg-secondary/30 border border-border/50 resize-none text-sm outline-none focus:ring-2 focus:ring-primary/20 mb-4"
                                        rows={4}
                                    />
                                    <Button onClick={handleCustomSubmit} disabled={!customScenarioText.trim()} className="w-full">
                                        Szenario starten
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="button"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group relative overflow-hidden rounded-lg border border-dashed border-border bg-transparent p-6 transition-all hover:bg-secondary/40 hover:border-primary/50 cursor-pointer flex flex-col items-center justify-center text-center min-h-[220px]"
                                    onClick={() => setShowCustomForm(true)}
                                >
                                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Plus className="h-6 w-6 text-foreground" />
                                    </div>
                                    <h3 className="font-display text-xl font-medium mb-1">Eigenes Szenario</h3>
                                    <p className="text-sm text-muted-foreground">Schreibe deine eigene Geschichte</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Scenario Cards */}
                        {filteredScenarios.map(scenario => (
                            <motion.div
                                key={scenario.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:bg-secondary/40 hover:border-primary/20 cursor-pointer min-h-[220px] flex flex-col"
                                onClick={() => startGame(scenario)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                        {scenario.date}
                                    </div>
                                    <Play className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="font-display text-2xl font-medium mb-3">{scenario.title}</h3>
                                <p className="text-muted-foreground mb-6 line-clamp-2 flex-1">{scenario.description}</p>
                                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-auto">
                                    <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> Volk</span>
                                    <span className="flex items-center gap-1.5"><Crown className="h-3 w-3" /> Einfluss</span>
                                    <span className="flex items-center gap-1.5"><Sword className="h-3 w-3" /> Macht</span>
                                </div>
                            </motion.div>
                        ))}

                        {/* No Results */}
                        {filteredScenarios.length === 0 && searchQuery && (
                            <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-muted-foreground">
                                <Search className="h-8 w-8 mx-auto mb-4 opacity-50" />
                                <p>Keine Szenarien gefunden für "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery('')} className="text-primary mt-2 text-sm hover:underline">
                                    Suche zurücksetzen
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- GAME VIEW ---
    const currentEvent = currentEventId ? activeScenario.events[currentEventId] : null;

    return (
        <div className="h-screen bg-background flex flex-col pt-16 overflow-hidden">
            {/* Header / Stats Bar */}
            <div className="h-16 sm:h-20 border-b border-border bg-background/80 backdrop-blur-md flex items-center px-4 sm:px-6 justify-between shrink-0 z-30">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setActiveScenario(null)}>
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <div>
                        <h2 className="font-display font-medium leading-none text-sm sm:text-base">{activeScenario.title}</h2>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">{activeScenario.date}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 md:gap-12">
                    <StatDisplay icon={Users} label="Volk" value={stats.welfare} color="text-green-500" />
                    <StatDisplay icon={Crown} label="Einfluss" value={stats.influence} color="text-amber-500" />
                    <StatDisplay icon={Sword} label="Macht" value={stats.power} color="text-red-500" />
                </div>
            </div>

            {/* Main Content Area - flex-1 takes remaining space, overflow-auto for scrolling */}
            <div ref={scrollRef} className="flex-1 overflow-auto scroll-smooth">
                <div className="container mx-auto max-w-3xl p-4 md:p-6 space-y-4 sm:space-y-6">
                    {history.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${item.type === 'choice' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${item.type === 'choice' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                                {item.type === 'choice' ? (
                                    <span className="text-xs font-bold">Du</span>
                                ) : (
                                    <img src={author.heroImage} alt={author.name} className="h-full w-full object-cover rounded-full" />
                                )}
                            </div>
                            <div className={`rounded-2xl p-4 max-w-[80%] ${item.type === 'choice' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50 shadow-sm'}`}>
                                {item.type === 'narrative' && <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Situation</h4>}
                                {item.type === 'feedback' && <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Konsequenz</h4>}
                                <p className="text-sm md:text-base leading-relaxed">{item.text}</p>
                            </div>
                        </motion.div>
                    ))}

                    {gameEnded && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 rounded-lg bg-card border border-border/50 text-center space-y-4 shadow-lg max-w-xl mx-auto mt-8">
                            <Crown className="h-12 w-12 text-primary mx-auto" />
                            <h2 className="font-display text-3xl">Tagesabschluss</h2>
                            <p className="text-lg text-muted-foreground">Der Tag ist vorüber. Hier ist deine Bilanz:</p>
                            <div className="flex justify-center gap-8 py-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{stats.welfare}</div>
                                    <div className="text-xs text-muted-foreground uppercase">Volk</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{stats.power}</div>
                                    <div className="text-xs text-muted-foreground uppercase">Macht</div>
                                </div>
                            </div>
                            <Button onClick={() => setActiveScenario(null)} className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Neues Spiel
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Fixed Interaction Area at Bottom */}
            {!gameEnded && currentEvent && (
                <div className="border-t border-border bg-background/80 backdrop-blur-md p-4">
                    <div className="container mx-auto max-w-3xl">
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {currentEvent.choices.map(choice => (
                                    <button
                                        key={choice.id}
                                        onClick={() => handleChoice(choice.id)}
                                        className="h-auto py-3 px-4 flex flex-col items-start gap-1 rounded-lg border border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/50 transition-all text-left group"
                                    >
                                        <span className="font-medium text-sm group-hover:text-primary transition-colors">{choice.text}</span>
                                        <div className="flex gap-2 text-[10px] text-muted-foreground opacity-70">
                                            {choice.effect.welfare && <span className={choice.effect.welfare > 0 ? 'text-green-500' : 'text-red-500'}>{choice.effect.welfare > 0 ? '+' : ''}{choice.effect.welfare} Volk</span>}
                                            {choice.effect.power && <span className={choice.effect.power > 0 ? 'text-green-500' : 'text-red-500'}>{choice.effect.power > 0 ? '+' : ''}{choice.effect.power} Macht</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <Input
                                    placeholder="Eigene Handlung eintippen..."
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCustomInput()}
                                    className="pr-12 py-5 bg-secondary/30 border-primary/10 rounded-lg"
                                />
                                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary" onClick={handleCustomInput}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatDisplay({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
    return (
        <div className="flex flex-col items-center min-w-[60px]">
            <div className="flex items-center gap-1.5 mb-1 opacity-80">
                <Icon className={cn("h-3.5 w-3.5", color)} />
                <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
            </div>
            <div className="text-xl font-display font-bold leading-none">{value}</div>
        </div>
    );
}
