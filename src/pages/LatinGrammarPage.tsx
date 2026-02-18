import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    GraduationCap,
    BookOpen,
    Users,
    MessageSquare,
    ChevronRight,
    Hash,
    List,
    PenTool,
    Calendar
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

const grammarTopics = [
    {
        id: 'substantive',
        title: 'Substantive (Nomen)',
        description: 'Die lateinischen Hauptwörter und ihre Deklination.',
        icon: BookOpen,
        color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
        topics: ['Geschlechter', 'Kasus', 'Deklination', 'Pluralbildung']
    },
    {
        id: 'verben',
        title: 'Verben',
        description: 'Die lateinischen Zeitwörter und ihre Konjugation.',
        icon: PenTool,
        color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
        topics: ['Konjugation', 'Tempora', 'Modi', 'Aktiv/Passiv']
    },
    {
        id: 'adjektive',
        title: 'Adjektive',
        description: 'Die Eigenschaftswörter und ihre Steigerung.',
        icon: MessageSquare,
        color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
        topics: ['Deklination', 'Steigerung', 'Vergleiche']
    },
    {
        id: 'pronomen',
        title: 'Pronomen',
        description: 'Die Fürwörter und ihre Verwendung.',
        icon: Users,
        color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
        topics: ['Personalpronomen', 'Possessivpronomen', 'Demonstrativpronomen', 'Relativpronomen']
    },
    {
        id: 'adverbien',
        title: 'Adverbien',
        description: 'Die Umstandswörter zur näheren Bestimmung.',
        icon: Hash,
        color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
        topics: ['Adverbarten', 'Steigerung', 'Bildung']
    },
    {
        id: 'syntax',
        title: 'Syntax',
        description: 'Die Satzstruktur und Wortstellung im Lateinischen.',
        icon: List,
        color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
        topics: ['Satzbau', 'Wortstellung', 'Satzgliederung']
    },
    {
        id: 'partizipien',
        title: 'Partizipien',
        description: 'Die Verbformen und ihre Verwendung.',
        icon: Calendar,
        color: 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300',
        topics: ['PPA', 'PPP', 'PFA', 'Infinitiv', 'Gerundium']
    }
];

export default function LatinGrammarPage() {
    const { topic } = useParams<{ topic: string }>();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTopics = grammarTopics.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-background selection:bg-primary/10">
            <main className="container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                {/* Minimalist Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                            <div className="w-8 h-[1px] bg-primary/30" />
                            Grammatik
                        </div>
                        <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
                            Lateinische <span className="text-primary italic">Grammatik</span>
                        </h1>
                        <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
                            Meistere die Grundlagen der lateinischen Sprache mit interaktiven Lektionen.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4 items-end"
                    >
                        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                            <div className="flex flex-col items-end">
                                <span className="text-foreground">{grammarTopics.length}</span>
                                <span>Themen</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Search */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Grammatikthemen suchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 text-lg bg-card/60 backdrop-blur-xl border-2 border-border/40 rounded-2xl focus:border-primary/50 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Grammar Topics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTopics.map((t, index) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(`/learn/grammar/${t.id}`)}
                        >
                            <Card className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8 hover:border-primary/50 transition-all duration-500 group cursor-pointer h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${t.color}`}>
                                        <t.icon className="w-6 h-6" />
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                
                                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {t.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    {t.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2">
                                    {t.topics.map((subTopic, i) => (
                                        <span key={i} className="px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium text-muted-foreground">
                                            {subTopic}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
