import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { useAuthors } from '@/hooks/use-authors';
import { Author } from '@/types/blog';
import { simulations, SimulationScenario, SimulationStats } from '@/data/simulations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Users, Sword, Play, RefreshCw, Send, Plus, Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { SimulationCard } from '@/components/simulation/SimulationCard';
import { Footer } from '@/components/layout/Footer';
import { simulateAI } from '@/lib/api';
export default function SimulationPage() {
    const { authorId } = useParams<{ authorId: string }>();
    const { setCurrentAuthor } = useAuthor();
    const { authors: dbAuthors, isLoading: authorsLoading } = useAuthors();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    // Get author from D1 database
    const author = authorId && dbAuthors ? dbAuthors[authorId as Author] : null;
    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [customScenarioText, setCustomScenarioText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Game State
    const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);
    const [currentEventId, setCurrentEventId] = useState<string | null>(null);
    const [stats, setStats] = useState<SimulationStats>({ welfare: 50, influence: 50, power: 50 });
    const [history, setHistory] = useState<{ text: string, type: 'narrative' | 'choice' | 'feedback', role?: 'user' | 'assistant' }[]>([]);
    const [currentOptions, setCurrentOptions] = useState<{ id: string, text: string }[]>([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [customInput, setCustomInput] = useState('');
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isLoading]);
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

    const [searchParams, setSearchParams] = useSearchParams();
    const scenarioParam = searchParams.get('scenario');
    useEffect(() => {
        if (scenarioParam && authorId && allScenarios.length > 0 && !activeScenario) {
            const found = allScenarios.find(s => s.id === scenarioParam);
            if (found) {
                startGame(found);
                setSearchParams({}, { replace: true });
            }
        }
    }, [scenarioParam, authorId, allScenarios.length]);
    const getScenarioContext = (scenario?: SimulationScenario | null) => {
        if (!scenario) return '';
        const name = author?.name || authorId || 'Unbekannt';
        return `${name}: ${scenario.title} – ${scenario.description}`;
    };
    const startGame = async (scenario: SimulationScenario) => {
        setIsLoading(true);
        setActiveScenario(scenario);
        setStats(scenario.initialStats);
        setGameEnded(false);
        try {
            const res = await simulateAI(authorId || 'caesar', getScenarioContext(scenario), []);
            setHistory([{
                text: res.narrative,
                type: 'narrative' as const,
                role: 'assistant' as const
            }]);
            setCurrentOptions(res.options || []);
            setGameEnded(res.ended || false);
        } catch (error) {
            console.error("Failed to start AI simulation:", error);
            setHistory([{
                text: scenario.events[scenario.startEventId]?.description || scenario.description,
                type: 'narrative'
            }]);
        } finally {
            setIsLoading(false);
        }
    };
    const handleChoice = async (choiceText: string) => {
        if (isLoading || gameEnded) return;
        setIsLoading(true);
        const newHistoryRows = [
            ...history.map(h => ({ role: h.role || (h.type === 'choice' ? 'user' : 'assistant'), content: h.text })),
        ];
        setHistory(prev => [...prev, { text: choiceText, type: 'choice' as const, role: 'user' as const }]);
        try {
            const res = await simulateAI(authorId || 'caesar', getScenarioContext(activeScenario), newHistoryRows, choiceText);
            if (res.stats) {
                setStats(prev => ({
                    welfare: Math.max(0, Math.min(100, prev.welfare + (res.stats.volk || 0))),
                    influence: Math.max(0, Math.min(100, prev.influence + (res.stats.einfluss || 0))),
                    power: Math.max(0, Math.min(100, prev.power + (res.stats.macht || 0))),
                }));
            }
            setHistory(prev => [
                ...prev,
                { text: res.narrative, type: 'narrative' as const, role: 'assistant' as const }
            ].filter(item => item.text));
            setCurrentOptions(res.options || []);
            setGameEnded(res.ended || false);
        } catch (error) {
            console.error("AI Choice Error:", error);
            setHistory(prev => [...prev, { text: "Die Verbindung zu deinen Beratern wurde unterbrochen...", type: 'feedback' as const }]);
        } finally {
            setIsLoading(false);
            setCustomInput('');
        }
    };
    const handleCustomInput = () => {
        if (!customInput.trim()) return;
        handleChoice(customInput);
    };
    if (!author) return null;
    // --- SCENARIO SELECTION VIEW ---
    if (!activeScenario) {
        const handleCustomSubmit = () => {
            if (customScenarioText.trim()) {
                startGame({
                    id: 'custom',
                    authorId: authorId as string,
                    title: customScenarioText,
                    description: customScenarioText,
                    date: 'Heute',
                    initialStats: { welfare: 50, influence: 50, power: 50 },
                    startEventId: 'start',
                    events: {}
                } as SimulationScenario);
                setCustomScenarioText('');
                setShowCustomForm(false);
            }
        };
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                    {authorsLoading ? (
                        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
                            <p>Lade Autoren...</p>
                        </div>
                    ) : !author ? (
                        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
                            <p>Autor nicht gefunden</p>
                        </div>
                    ) : (
                        <>
                    {/* Minimalist Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                                <div className="w-8 h-[1px] bg-primary/30" />
                                INTERAKTIVE SIMULATION
                            </div>
                            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
                                Entscheidungen als <span className="text-primary italic">{author.name.split(' ').slice(1).join(' ')}</span>
                            </h1>
                            <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
                                Erlebe die Geschichte aus der Ich-Perspektive. Wähle Szenarien, entscheide und beobachte die Konsequenzen.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-4 items-end"
                        >
                            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                                <div className="flex flex-col items-end">
                                    <span className="text-foreground">{allScenarios.length}</span>
                                    <span>Szenarien</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    {/* Search */}
                    <div className="card-modern card-padding-md max-w-xl mb-8">
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
                    {/* Scenarios Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="wait">
                            {showCustomForm ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    className="card-modern card-padding-md min-h-[240px] flex flex-col"
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
                                    <Button onClick={handleCustomSubmit} disabled={!customScenarioText.trim() || isLoading} className="w-full">
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                        Szenario starten
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="button"
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    className="card-modern card-padding-md min-h-[240px] cursor-pointer flex flex-col items-center justify-center text-center border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
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
                            <div className="md:col-span-2 lg:col-span-3 card-modern card-padding-lg text-center py-12 text-muted-foreground">
                                <Search className="h-8 w-8 mx-auto mb-4 opacity-50" />
                                <p>Keine Szenarien gefunden für "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery('')} className="text-primary mt-2 text-sm hover:underline">
                                    Suche zurücksetzen
                                </button>
                            </div>
                        )}
                    </div>
                        </>
                    )}
                </main>
                <Footer />
            </div>
        );
    }
    // --- GAME VIEW ---
    if (!activeScenario || !author) return null;
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                {/* Game Header */}
                <div className="card-modern card-padding-md flex flex-wrap items-center justify-between gap-4 mb-6">
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
                {/* Game Content */}
                <div className="card-modern overflow-hidden mb-6">
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
                                    <p className="text-sm md:text-base leading-relaxed">{item.text}</p>
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-muted-foreground italic text-sm py-2">
                                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                                Schicksal wird gewoben...
                            </div>
                        )}
                        {gameEnded && (
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-modern card-padding-lg text-center space-y-3 max-w-xl mx-auto">
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
                {/* Choices */}
                {!gameEnded && (
                    <div className="card-modern card-padding-md space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentOptions.length > 0 ? (
                                currentOptions.map(choice => (
                                    <button
                                        key={choice.id}
                                        onClick={() => handleChoice(choice.text)}
                                        disabled={isLoading}
                                        className="h-auto py-3 px-4 flex flex-col items-start gap-1 rounded-2xl border border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/50 transition-all text-left group disabled:opacity-50"
                                    >
                                        <span className="font-medium text-sm group-hover:text-primary transition-colors">{choice.text}</span>
                                    </button>
                                ))
                            ) : (
                                !isLoading && (
                                    <p className="text-xs text-muted-foreground italic col-span-2 text-center py-2">
                                        Wähle eine eigene Handlung unten aus, um fortzufahren...
                                    </p>
                                )
                            )}
                        </div>
                        <div className="relative">
                            <Input
                                placeholder="Eigene Handlung eintippen..."
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCustomInput()}
                                disabled={isLoading}
                                className="pr-12 py-5 bg-secondary/30 border-primary/10 rounded-xl"
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-primary"
                                onClick={handleCustomInput}
                                disabled={isLoading || !customInput.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
function StatDisplay({ icon: Icon, label, value, color }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>, label: string, value: number, color: string }) {
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
