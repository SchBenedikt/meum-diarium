import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { authors } from '@/data/authors';
import { Author } from '@/types/blog';
import { simulations, SimulationScenario, SimulationStats } from '@/data/simulations';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Crown, Scale, Users, Sword, Play, ChevronRight, RefreshCw, Send, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function SimulationPage() {
    const { authorId } = useParams<{ authorId: string }>();
    const { setCurrentAuthor } = useAuthor();

    // Game State
    const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);
    const [currentEventId, setCurrentEventId] = useState<string | null>(null);
    const [stats, setStats] = useState<SimulationStats>({ welfare: 0, influence: 0, power: 0 });
    const [history, setHistory] = useState<{ text: string, type: 'narrative' | 'choice' | 'feedback' }[]>([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [customInput, setCustomInput] = useState('');

    const author = authorId ? authors[authorId as Author] : null;
    const availableScenarios = authorId && simulations[authorId] ? simulations[authorId] : [];

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
        return (
            <div className="min-h-screen bg-background flex flex-col pt-16">
                <div className="container mx-auto p-6 max-w-5xl">
                    <Link to={`/${authorId}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                        <ArrowLeft className="h-4 w-4" />
                        Zurück zum Dashboard
                    </Link>

                    <div className="mb-12">
                        <h1 className="font-display text-4xl md:text-5xl mb-4">Historisches Spiel</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Übernimm die Rolle von {author.name}. Erlebe Geschichte aus der Ich-Perspektive und triff Entscheidungen, die mein Schicksal bestimmen.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Custom Scenario Button */}
                        <div className="group relative overflow-hidden rounded-xl border border-dashed border-border bg-transparent p-6 transition-all hover:bg-secondary/40 hover:border-primary/50 cursor-pointer flex flex-col items-center justify-center text-center min-h-[200px]" onClick={() => alert("Feature: Hier kannst du bald dein eigenes Szenario erstellen!")}>
                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="h-6 w-6 text-foreground" />
                            </div>
                            <h3 className="font-display text-xl font-medium mb-1">Eigenes Szenario erstellen</h3>
                            <p className="text-sm text-muted-foreground">Schreibe deine eigene Geschichte</p>
                        </div>

                        {availableScenarios.map(scenario => (
                            <div key={scenario.id} className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:bg-secondary/40 hover:shadow-lg hover:border-primary/20 cursor-pointer" onClick={() => startGame(scenario)}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                        {scenario.date}
                                    </div>
                                    <Play className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="font-display text-2xl font-medium mb-3">{scenario.title}</h3>
                                <p className="text-muted-foreground mb-6 line-clamp-2">{scenario.description}</p>
                                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> Volk</span>
                                    <span className="flex items-center gap-1.5"><Crown className="h-3 w-3" /> Einfluss</span>
                                    <span className="flex items-center gap-1.5"><Sword className="h-3 w-3" /> Macht</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- GAME VIEW ---
    const currentEvent = currentEventId ? activeScenario.events[currentEventId] : null;

    return (
        <div className="min-h-screen bg-background flex flex-col pt-16 overflow-hidden">
            {/* Header / Stats Bar */}
            <div className="h-20 border-b border-border bg-background/80 backdrop-blur-md flex items-center px-6 justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setActiveScenario(null)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="font-display font-medium leading-none">{activeScenario.title}</h2>
                        <span className="text-xs text-muted-foreground">{activeScenario.date}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 md:gap-12">
                    <StatDisplay icon={Users} label="Volkswohl" value={stats.welfare} color="text-green-500" />
                    <StatDisplay icon={Crown} label="Einfluss" value={stats.influence} color="text-amber-500" />
                    <StatDisplay icon={Sword} label="Macht" value={stats.power} color="text-red-500" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 container mx-auto max-w-5xl p-4 md:p-8 flex flex-col h-full overflow-hidden">
                <ScrollArea className="flex-1 pr-4 -mr-4 h-full">
                    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
                        {history.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex gap-4",
                                    item.type === 'choice' ? "justify-end" : "justify-start"
                                )}
                            >
                                {item.type !== 'choice' && (
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <div className="h-full w-full rounded-full overflow-hidden">
                                            <img src={author.heroImage} alt={author.name} className="h-full w-full object-cover" />
                                        </div>
                                    </div>
                                )}

                                <div className={cn(
                                    "rounded-2xl p-4 max-w-[85%] text-sm md:text-base leading-relaxed shadow-sm",
                                    item.type === 'narrative' ? "bg-card border border-border/50 rounded-tl-none" :
                                        item.type === 'feedback' ? "bg-primary/5 border border-primary/10 text-foreground rounded-tl-none" :
                                            "bg-primary text-primary-foreground rounded-tr-none"
                                )}>
                                    {item.type === 'narrative' && <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Situation</h4>}
                                    {item.type === 'feedback' && <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Konsequenz</h4>}
                                    {item.text}
                                </div>
                            </motion.div>
                        ))}

                        {gameEnded && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 rounded-2xl bg-card border border-border/50 text-center space-y-4 shadow-lg max-w-xl mx-auto mt-8">
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
                </ScrollArea>

                {/* Interaction Area */}
                {!gameEnded && currentEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-background/80 backdrop-blur-md border-t border-border -mx-6 px-6 sm:mx-0 sm:px-0 sm:bg-transparent sm:border-t-0"
                    >
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {currentEvent.choices.map(choice => (
                                    <button
                                        key={choice.id}
                                        onClick={() => handleChoice(choice.id)}
                                        className="h-auto py-4 px-4 flex flex-col items-start gap-1 rounded-xl border border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/50 transition-all text-left group"
                                    >
                                        <span className="font-medium group-hover:text-primary transition-colors">{choice.text}</span>
                                        <div className="flex gap-2 text-[10px] text-muted-foreground opacity-70">
                                            {choice.effect.welfare && <span className={choice.effect.welfare > 0 ? 'text-green-500' : 'text-red-500'}>{choice.effect.welfare > 0 ? '+' : ''}{choice.effect.welfare} Volk</span>}
                                            {choice.effect.power && <span className={choice.effect.power > 0 ? 'text-green-500' : 'text-red-500'}>{choice.effect.power > 0 ? '+' : ''}{choice.effect.power} Macht</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <Input
                                    placeholder="Eigene Handlung eintippen (Demo)..."
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCustomInput()}
                                    className="pr-12 bg-secondary/30 border-primary/10"
                                />
                                <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8 text-primary" onClick={handleCustomInput}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
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
