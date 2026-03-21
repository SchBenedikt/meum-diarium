import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    Languages,
    MessageSquare,
    BookOpen,
    GraduationCap,
    AlertTriangle,
    Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
type Mode = 'menu';
export default function LatinTools() {
    const [searchParams, setSearchParams] = useSearchParams();
    const mode = (searchParams.get('mode') as Mode) || 'menu';
    const setMode = (newMode: Mode) => {
        if (newMode === 'menu') {
            setSearchParams({});
        } else {
            setSearchParams({ mode: newMode });
        }
    };
    const reset = () => {
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

                {/* Beta Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Beta-Version
                                </p>
                                <p className="text-xs text-red-700 dark:text-red-300">
                                    Diese Lernfunktionen befinden sich in der Testphase und werden noch überarbeitet. 
                                    Es können Fehler auftreten und Funktionen sich ändern.
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
                <AnimatePresence mode="wait">
                    {mode === 'menu' && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Antike Texte */}
                                <Link to="/reader" className="group">
                                    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                                                <Languages className="h-8 w-8 text-amber-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Antike Texte</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Lies klassische lateinische Werke im fokussierten Lesemodus.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>

                                {/* Stilmittel */}
                                <Link to="/learn/rhetoric" className="group">
                                    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                                <MessageSquare className="h-8 w-8 text-purple-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Stilmittel</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Entdecke rhetorische Figuren aus der römischen Rhetorik.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>

                                {/* Grammatik */}
                                <Link to="/learn/grammar" className="group">
                                    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                                                <GraduationCap className="h-8 w-8 text-green-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Grammatik</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Lerne lateinische Grammatik von Grund auf.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>

                                {/* Vokabel-Wörterbuch */}
                                <Link to="/vocab" className="group">
                                    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                                                <BookOpen className="h-8 w-8 text-indigo-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Vokabel-Wörterbuch</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Durchsuche 36.000+ lateinische Vokabeln mit Grammatik.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>

                                {/* Grammatik + Stilmittel Ueben */}
                                <Link to="/learn/practice" className="group">
                                    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-900/20">
                                                <Brain className="h-8 w-8 text-rose-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Üben</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Übe Grammatik und Stilmittel mit direkten Aufgaben und Feedback.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}
