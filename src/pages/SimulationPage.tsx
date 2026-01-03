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
import { PageHero } from '@/components/layout/PageHero';
import { SimulationCard } from '@/components/simulation/SimulationCard';

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
                sessionStorage.setItem('customScenario', customScenarioText);
                navigate(`/${authorId}/simulation?custom=true`);
                alert(`Szenario wird vorbereitet:\n\n"${customScenarioText}"\n\n(In der vollständigen Version würde hier KI-generierter Inhalt erscheinen)`);
                setCustomScenarioText('');
                setShowCustomForm(false);
            }
        };

        return (
            <div className="relative min-h-screen bg-background">
                <PageHero
                    eyebrow="Textbased Game"
                    title="Triff Entscheidungen als"
                    highlight={author.name}
                    description={`Erlebe die Geschichte aus der Ich-Perspektive. Wähle Szenarien, entscheide und beobachte die Konsequenzen.`}
                    backgroundImage={author.heroImage}
                    kicker={<span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{allScenarios.length} Szenarien • Dynamische Konsequenzen</span>}
                />

                <section className="section-shell -mt-8 pb-16 relative z-10 space-y-8">
                    <div className="glass-card max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Szenarien durchsuchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10 bg-transparent border-none"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="wait">
                            {showCustomForm ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    className="glass-card min-h-[240px] flex flex-col"
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
                                        className="flex-1 w-full p-3 rounded-xl bg-secondary/30 border border-border/50 resize-none text-sm outline-none focus:ring-2 focus:ring-primary/20 mb-4"
                                        rows={4}
                                    />
                                    <Button onClick={handleCustomSubmit} disabled={!customScenarioText.trim()} className="w-full">
                                        Szenario starten
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="button"
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    className="glass-card min-h-[240px] cursor-pointer flex flex-col items-center justify-center text-center border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
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

                        {filteredScenarios.map(scenario => (
                            <SimulationCard
                                key={scenario.id}
                                scenario={scenario}
                                onClick={startGame}
                            />
                        ))}

                        {filteredScenarios.length === 0 && searchQuery && (
                            <div className="md:col-span-2 lg:col-span-3 glass-card text-center py-12 text-muted-foreground">
                                <Search className="h-8 w-8 mx-auto mb-4 opacity-50" />
                                <p>Keine Szenarien gefunden für "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery('')} className="text-primary mt-2 text-sm hover:underline">
                                    Suche zurücksetzen
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        );
    }

    // --- GAME VIEW ---
    const currentEvent = currentEventId ? activeScenario.events[currentEventId] : null;

    return (
        <div className="relative min-h-screen bg-background">
            <PageHero
                eyebrow={activeScenario.date}
                title={activeScenario.title}
                highlight={author.name}
                description={activeScenario.description}
                backgroundImage={author.heroImage}
                kicker={<span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Interaktive Entscheidungen • Live-Bilanz</span>}
            />

            <section className="section-shell -mt-10 pb-16 relative z-10 space-y-6">
                <div className="glass-panel p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setActiveScenario(null)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h2 className="font-display font-semibold leading-tight text-base sm:text-lg">{activeScenario.title}</h2>
                            <span className="text-xs text-muted-foreground">{activeScenario.date}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-5">
                        <StatDisplay icon={Users} label="Volk" value={stats.welfare} color="text-green-500" />
                        <StatDisplay icon={Crown} label="Einfluss" value={stats.influence} color="text-amber-500" />
                        <StatDisplay icon={Sword} label="Macht" value={stats.power} color="text-red-500" />
                    </div>
                </div>

                <div className="glass-panel overflow-hidden">
                    <div ref={scrollRef} className="max-h-[55vh] sm:max-h-[60vh] overflow-auto scroll-smooth px-4 sm:px-6 py-4 space-y-4">
                        {history.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${item.type === 'choice' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${item.type === 'choice' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground overflow-hidden'}`}>
                                    {item.type === 'choice' ? (
                                        <span className="text-xs font-bold">Du</span>
                                    ) : (
                                        <img src={author.heroImage} alt={author.name} className="h-full w-full object-cover rounded-full" />
                                    )}
                                </div>
                                <div className={`rounded-3xl p-4 max-w-[80%] ${item.type === 'choice' ? 'bg-primary text-primary-foreground' : 'bg-card/70 border border-border/60'}`}>
                                    {item.type === 'narrative' && <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Situation</h4>}
                                    {item.type === 'feedback' && <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Konsequenz</h4>}
                                    <p className="text-sm md:text-base leading-relaxed">{item.text}</p>
                                </div>
                            </motion.div>
                        ))}

                        {gameEnded && (
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-6 text-center space-y-3 max-w-xl mx-auto">
                                <Crown className="h-10 w-10 text-primary mx-auto" />
                                <h2 className="font-display text-2xl">Tagesabschluss</h2>
                                <p className="text-muted-foreground">Der Tag ist vorüber. Hier ist deine Bilanz:</p>
                                <div className="flex justify-center gap-8 py-3">
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

                {!gameEnded && currentEvent && (
                    <div className="glass-panel p-4 sm:p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentEvent.choices.map(choice => (
                                <button
                                    key={choice.id}
                                    onClick={() => handleChoice(choice.id)}
                                    className="h-auto py-3 px-4 flex flex-col items-start gap-1 rounded-2xl border border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/50 transition-all text-left group"
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
                                onChange={(e) => customInput && setCustomInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCustomInput()}
                                className="pr-12 py-5 bg-secondary/30 border-primary/10 rounded-xl"
                            />
                            <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-primary" onClick={handleCustomInput}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </section>
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
