import { useNavigate } from 'react-router-dom';
import { SimulationScenario, simulations } from '@/data/simulations';
import { authors } from '@/data/authors';
import { Author } from '@/types/blog';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from '@/components/ui/carousel';
import { SimulationCard } from './SimulationCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, LayoutGrid, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';

interface SimulationCarouselProps {
    authorId: string;
}

export function SimulationCarousel({ authorId }: SimulationCarouselProps) {
    const navigate = useNavigate();
    const [api, setApi] = useState<CarouselApi>();
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [customPersonaName, setCustomPersonaName] = useState('');
    const [customScenarioText, setCustomScenarioText] = useState('');
    const allScenarios = simulations[authorId] || [];

    // Add wheel support
    useEffect(() => {
        if (!api) return;

        const onWheel = (e: WheelEvent) => {
            // Prevent scrolling too fast
            const threshold = 10;
            if (Math.abs(e.deltaX) > threshold || Math.abs(e.deltaY) > threshold) {
                if (e.deltaX > 0 || e.deltaY > 0) {
                    api.scrollNext();
                } else {
                    api.scrollPrev();
                }
            }
        };

        const rootNode = api.rootNode();
        rootNode.addEventListener('wheel', onWheel, { passive: true });

        return () => {
            rootNode.removeEventListener('wheel', onWheel);
        };
    }, [api]);

    if (allScenarios.length === 0) return null;

    const handleCardClick = (scenario: SimulationScenario) => {
        navigate(`/${authorId}/simulation`);
    };

    const handleCustomSubmit = () => {
        if (customScenarioText.trim()) {
            const customData = {
                persona: customPersonaName.trim() || authors[authorId as Author]?.name || 'Historische Person',
                scenario: customScenarioText.trim()
            };
            sessionStorage.setItem('customScenario', JSON.stringify(customData));
            navigate(`/${authorId}/simulation?custom=true`);
            setCustomPersonaName('');
            setCustomScenarioText('');
            setShowCustomForm(false);
        }
    };

    return (
        <Carousel
            setApi={setApi}
            opts={{
                align: "start",
                loop: false,
            }}
            className="w-full relative"
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold">Interaktive Zeitreise</h3>
                            <p className="text-sm text-muted-foreground">Wähle ein Szenario und triff deine Entscheidungen</p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <div className="flex items-center gap-2 mr-2">
                            <CarouselPrevious className="relative left-0 translate-y-0 h-9 w-9 border-border/40" />
                            <CarouselNext className="relative right-0 translate-y-0 h-9 w-9 border-border/40" />
                        </div>
                    </div>
                </div>

                <CarouselContent className="-ml-4">
                    {/* "Create Own" Card at the start */}
                    <CarouselItem className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                        <div className="h-full">
                            <AnimatePresence mode="wait">
                                {showCustomForm ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="glass-card h-full min-h-[220px] p-6 flex flex-col"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-display text-base font-medium">Neues Szenario</h3>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowCustomForm(false);
                                                }}
                                                className="text-muted-foreground hover:text-foreground p-1"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-2 flex-1 flex flex-col">
                                            <Input
                                                placeholder="Wer möchtest du sein?"
                                                value={customPersonaName}
                                                onChange={(e) => setCustomPersonaName(e.target.value)}
                                                className="h-10 text-sm font-sans text-foreground placeholder:text-muted-foreground/50 bg-secondary/30 border-border/50 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded-xl px-4"
                                                autoFocus
                                            />
                                            <textarea
                                                placeholder="Beschreibe das Ereignis..."
                                                value={customScenarioText}
                                                onChange={(e) => setCustomScenarioText(e.target.value)}
                                                className="flex-1 w-full p-4 rounded-xl font-sans text-sm text-foreground placeholder:text-muted-foreground/50 bg-secondary/30 border border-border/50 resize-none outline-none focus:ring-1 focus:ring-primary/30 transition-shadow"
                                                rows={2}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleCustomSubmit}
                                            disabled={!customScenarioText.trim()}
                                            size="sm"
                                            className="w-full mt-3 h-9"
                                        >
                                            Szenario starten
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="button"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setShowCustomForm(true)}
                                        className="glass-card h-full min-h-[220px] flex flex-col items-center justify-center text-center border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
                                    >
                                        <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:bg-secondary/80 transition-all">
                                            <Plus className="h-7 w-7 text-foreground" />
                                        </div>
                                        <h3 className="font-display text-xl font-medium mb-2">Eigenes Szenario</h3>
                                        <p className="text-sm text-muted-foreground max-w-[200px] mb-4">
                                            Schreibe deine eigene Geschichte
                                        </p>
                                        <div className="flex items-center text-primary text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
                                            Erstellen <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </CarouselItem>

                    {allScenarios.map((scenario) => (
                        <CarouselItem key={scenario.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                            <SimulationCard scenario={scenario} onClick={handleCardClick} />
                        </CarouselItem>
                    ))}

                    {/* "See More" Card at the end */}
                    <CarouselItem className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                        <Link to={`/${authorId}/simulation`} className="block h-full">
                            <motion.div
                                className="glass-card h-full min-h-[220px] flex flex-col items-center justify-center text-center border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                    <LayoutGrid className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="font-display text-xl font-medium mb-2">Alle Szenarien</h3>
                                <p className="text-sm text-muted-foreground max-w-[200px] mb-4">
                                    Entdecke alle historischen Möglichkeiten
                                </p>
                                <div className="flex items-center text-primary text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
                                    Ansehen <ArrowRight className="h-4 w-4" />
                                </div>
                            </motion.div>
                        </Link>
                    </CarouselItem>
                </CarouselContent>

                {/* Mobile Navigation */}
                <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
                    <CarouselPrevious className="relative left-0 translate-y-0 h-11 w-11 border-border/40" />
                    <CarouselNext className="relative right-0 translate-y-0 h-11 w-11 border-border/40" />
                </div>
            </div>
        </Carousel>
    );
}
