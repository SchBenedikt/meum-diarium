import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    BookOpen,
    GraduationCap,
    ChevronRight,
    Calendar
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { ExplanationBlock, DetailsList, RuleCards } from './GrammarContent';

const partizipienTopics = [
    {
        id: 'ppa',
        title: '1. Partizip Präsens Aktiv (PPA)',
        description: 'Grundlagen: Partizip Präsens Aktiv',
        content: {
            explanation: 'Die Partizipien Präsens Aktiv (PPA) sind abgeleitete Verbformen, die als Adjektive verwendet werden können. Sie beschreiben eine Handlung, die gleichzeitig stattfindet oder parallel zur Haupthandlung stattfindet. Diese Formen sind besonders in der lateinischen Literatur häufig und ermöglichen prägnise Satzkonstruktionen.',
            details: 'Das Partizip Präsens Aktiv wird vom Präsensstamm mit dem Suffix -ns gebildet und folgt der Adjektivdeklination. Es hat die Endungen -ns (m), -ntis (f), -nt (n) und -nt (pl). Diese Formen können als Attribute verwendet werden, um ein Substantiv zu beschreiben, das eine Handlung gleichzeitig ausführt. Die Bildung erfolgt systematisch vom Präsensstamm des Verbs, wobei der Stammvokal erhalten bleibt. Partizip Präsens Aktiv wird oft in narrativen Kontexten verwendet, um die Lebendigkeit und Dynamik von Sätzen zu erhöhen.',
            rules: '1. Partizip Präsens Aktiv wird vom Präsensstamm + -ns gebildet: amans (ich liebe), amans (du liebst), amat (sie lieben), amant (sie lieben). 2. Die Endungen sind für alle Genera gleich: -ns (m), -ntis (f), -nt (n), -nt (pl). 3. Das Partizip Präsens Aktiv wird wie ein Adjektiv dekliniert und stimmt mit dem Substantiv, das es bestimmt. 4. Die Bildung erfolgt vom Präsensstamm, nicht vom Infinitiv. 5. Partizip Präsens Aktiv kann als Attribut oder als Prädikativ verwendet werden.',
            tables: [
                {
                    title: 'Partizip Präsens Aktiv (PPA)',
                    headers: ['Kasus', 'Endung', 'Beispiel'],
                    rows: [
                        ['Nom.', '-ns', 'amans', 'amans - ich liebe'],
                        ['Gen.', '-ntis', 'amantis', 'des Liebenden'],
                        ['Dat.', '-nti', 'amanti', 'dem Liebenden'],
                        ['Akk.', '-ntem', 'amant', 'das Liebende'],
                        ['Abl.', '-ne', 'amando', 'durch das Lieben']
                    ]
                }
            ]
        }
    },
    {
        id: 'ppp',
        title: '2. Partizip Perfekt Passiv (PPP)',
        description: 'Grundlagen: Partizip Perfekt Passiv',
        content: {
            explanation: 'Die Partizipien Perfekt Passiv (PPP) sind abgeschlossene Handlungen, die als Adjektive verwendet werden können. Sie beschreiben eine Handlung, die in der Vergangenheit stattgefunden hat. Diese Formen sind fundamental für die lateinische Syntax und ermöglichen komplexe Satzkonstruktionen.',
            details: 'Das Partizip Perfekt Passiv wird vom Perfektstamm mit dem Suffix -us (m), -a (f), -um (n) gebildet. Es hat die Endungen -us (m), -ae (f), -um (n). Diese Formen werden wie Adjektive dekliniert und stimmen mit dem Substantiv, das sie bestimmen. Die Bildung erfolgt vom Perfektstamm, nicht vom Präsensstamm. Partizip Perfekt Passiv kann als Attribut oder als Prädikativ verwendet werden.',
            rules: '1. Partizip Perfekt Passiv wird vom Perfektstamm + -us (m), -ae (f), -um (n) gebildet: amatus (geliebt), amata (geliebt), amatum (geliebt). 2. Die Endungen sind für alle Genera gleich: -us (m), -ae (f), -um (n). 3. Das Partizip Perfekt Passiv wird wie ein Adjektiv dekliniert und stimmt mit dem Substantiv, das es bestimmt. 4. Die Bildung erfolgt vom Perfektstamm, nicht vom Präsensstamm. 5. Partizip Perfekt Passiv kann als Attribut oder Prädikativ verwendet werden.',
            tables: [
                {
                    title: 'Partizip Perfekt Passiv (PPP)',
                    headers: ['Kasus', 'Endung', 'Beispiel'],
                    rows: [
                        ['Nom.', '-us', 'amatus', 'amatus - geliebt'],
                        ['Gen.', '-ae', 'amatae', 'der Geliebte'],
                        ['Dat.', '-i', 'amato', 'dem Geliebten'],
                        ['Akk.', '-um', 'amatum', 'das Geliebte'],
                        ['Abl.', '-o', 'amato', 'durch das Geliebte']
                    ]
                }
            ]
        }
    },
    {
        id: 'pfa',
        title: '3. Partizip Futur Aktiv (PFA)',
        description: 'Grundlagen: Partizip Futur Aktiv',
        content: {
            explanation: 'Die Partizipien Futur Aktiv (PFA) beschreiben zukünftige Handlungen, die noch nicht stattgefunden haben. Diese Formen werden verwendet, um zukünftige Ereignisse vorherzusagen oder Pläne zu formulieren. Sie sind besonders in politischen und literarischen Texten wichtig.',
            details: 'Das Partizip Futur Aktiv wird vom Partizip Präsens mit dem Suffix -ūrus (m), -ūra (f), -ūrum (n) gebildet. Es hat die Endungen -ūrus (m), -ūra (f), -ūrum (n). Diese Formen werden wie Adjektive dekliniert und stimmen mit dem Substantiv, das sie bestimmen. Die Bildung erfolgt vom Partizip Präsensstamm, nicht vom Infinitiv.',
            rules: '1. Partizip Futur Aktiv wird vom Partizip Präsens + -ūrus (m), -ūra (f), -ūrum (n) gebildet: amaturus (werden), amatura (werden), amaturum (werden). 2. Die Endungen sind für alle Genera gleich: -ūrus (m), -ūra (f), -ūrum (n). 3. Das Partizip Futur Aktiv wird wie ein Adjektiv dekliniert und stimmt mit dem Substantiv, das es bestimmt. 4. Die Bildung erfolgt vom Partizip Präsensstamm, nicht vom Infinitiv. 5. Partizip Futur Aktiv kann als Attribut oder Prädikativ verwendet werden.',
            tables: [
                {
                    title: 'Partizip Futur Aktiv (PFA)',
                    headers: ['Kasus', 'Endung', 'Beispiel'],
                    rows: [
                        ['Nom.', '-ūrus', 'amaturus', 'amatur werden'],
                        ['Gen.', '-ūra', 'amaturae', 'der werdende'],
                        ['Dat.', '-ūrī', 'amaturī', 'dem werdenden'],
                        ['Akk.', '-ūrum', 'amaturum', 'das werdende'],
                        ['Abl.', '-ūre', 'amātū', 'durch das werdende']
                    ]
                }
            ]
        }
    },
    {
        id: 'infinitiv',
        title: '4. Infinitiv',
        description: 'Grundlagen: Infinitiv und seine Formen',
        content: {
            explanation: 'Der Infinitiv ist eine infinite Verbform, die die Grundform eines Verbs darstellt. Im Lateinischen gibt es drei Hauptinfinitive: Präsensinfinitiv, Perfektinfinitiv und Futurinfinitiv. Diese Formen sind fundamental für die Konstruktion komplexer Sätze und für die korrekte lateinische Syntax.',
            details: 'Der Präsensinfinitiv beschreibt die unvollendete oder allgemeingültige Handlungen. Er endet auf -re (1./2. Konjugation), -ēre (2. Konjugation), -ere (3. Konjugation) oder -īre (4. Konjugation). Der Perfektinfinitiv beschreibt abgeschlossene Handlungen und endet auf -isse. Der Futurinfinitiv beschreibt zukünftige Handlungen und endet auf -ūrus esse (sein werden).',
            rules: '1. Präsensinfinitiv: -āre, -ēre, -ere, -īre. 2. Perfektinfinitiv: -isse, -īsī, -it, -imus, -istis, -ērunt/-ēre. 3. Futurinfinitiv: -ūrus esse (werden). 4. Infinitiv Perfekt: -um esse (gewesen sein). 5. Infinitiv Futur: -ūrus esse (werden sein).',
            tables: [
                {
                    title: 'Die drei Infinitive',
                    headers: ['Infinitiv', 'Typ', 'Beispiel', 'Bedeutung'],
                    rows: [
                        ['Präsensinfinitiv', 'unvollendet', 'amare', 'zu lieben'],
                        ['Perfektinfinitiv', 'abgeschlossen', 'amavisse', 'geliebt haben'],
                        ['Futurinfinitiv', 'zukünftig', 'amaturus esse', 'werden werden']
                    ]
                }
            ]
        }
    },
    {
        id: 'gerundium',
        title: '5. Gerundium und Gerundium',
        description: 'Grundlagen: Infinite Verbformen',
        content: {
            explanation: 'Gerundium und Gerundium sind infinite Verbformen, die als Substantive oder Adjektive verwendet werden können. Sie ermöglichen komplexe Satzkonstruktionen und sind fundamental für die lateinische Syntax.',
            details: 'Das Gerundium wird vom Präsensstamm mit der Endung -nd gebildet und bedeutet "tun". Es wird als Substantiv dekliniert und hat die Formen: nominativ nd, genitiv ndi, dativ ndo, akkusativ ndum, ablativ ndo. Das Gerundium wird vom Präsensstamm mit der Endung -ndō gebildet und bedeutet "getan". Es wird als Adjektiv dekliniert und hat die Formen: nominativ nde, genitiv ndi, dativ nde, akkusativ ndum, ablativ ndo. Die Bildung erfolgt systematisch vom Präsensstamm.',
            rules: '1. Gerundium: Präsensstamm + -nd (tun), Genitiv ndi (des Tuns), Dativ ndo (dem Tuns), Akkusativ ndum (dem Tun), Ablativ ndo (vom Tun). 2. Gerundium: Präsensstamm + -ndō (getan), Genitiv ndō (des Tuns), Dativ ndō (dem Tuns), Akkusativ ndum (dem Tun), Ablativ ndō (vom Tun). 3. Die Bildung erfolgt systematisch vom Präsensstamm, nicht vom Infinitiv.',
            tables: [
                {
                    title: 'Gerundium und Gerundium',
                    headers: ['Form', 'Genitiv', 'Dativ', 'Akkusativ', 'Ablativ'],
                    rows: [
                        ['Gerundium', 'ndi', 'ndi', 'ndo', 'ndo'],
                        ['Gerundium', 'ndō', 'ndō', 'ndo', 'ndo'],
                        ['Gerundium', 'ndi', 'ndi', 'ndo', 'ndo']
                    ]
                }
            ]
        }
    }
];

export default function PartizienPage() {
    const { topic } = useParams<{ topic: string }>();
    const navigate = useNavigate();

    if (!topic) {
        // Show overview of all participle topics
        return (
            <div className="min-h-screen bg-background selection:bg-primary/10">
                <main className="container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate('/learn/grammar')}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Zurück zur Grammatik
                        </Button>
                        <div className="h-4 w-px bg-border" />
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                            <Calendar className="w-4 h-4" />
                            Partizipien
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Topic Header */}
                        <div className="text-center space-y-4">
                            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                                Partizipien
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Die lateinischen Partizipien und ihre Verwendung. Wähle ein Thema zum Lernen:
                            </p>
                        </div>

                        {/* Topics Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {partizipienTopics.map((t, index) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card 
                                        className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-6 hover:border-primary/50 transition-all duration-500 group cursor-pointer h-full"
                                        onClick={() => navigate(`/learn/grammar/partizipien/${t.id}`)}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                                                {t.title}
                                            </h3>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.description}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {t.topics?.slice(0, 3).map(sub => (
                                                <span key={sub} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/40">{sub}</span>
                                            ))}
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    const currentTopic = partizipienTopics.find(t => t.id === topic);

    if (!currentTopic) {
        return (
            <div className="min-h-screen bg-background selection:bg-primary/10">
                <main className="container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Thema nicht gefunden</h1>
                        <Button onClick={() => navigate('/learn/grammar')} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Zurück zur Grammatik
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-primary/10">
            <main className="container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate('/learn/grammar/partizipien')}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück zu Partizipien
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                        <Calendar className="w-4 h-4" />
                        Partizipien
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Topic Header */}
                    <div className="text-center space-y-4">
                        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                            {currentTopic.title}
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {currentTopic.description}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <Card className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <GraduationCap className="w-6 h-6 text-primary" />
                                    Theorie
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2">Überblick</p>
                                    <ExplanationBlock text={currentTopic.content.explanation} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-3">Im Detail</p>
                                    <DetailsList text={currentTopic.content.details} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-3">Regeln & Merkmale</p>
                                    <RuleCards text={currentTopic.content.rules} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tables */}
                        {currentTopic.content.tables && currentTopic.content.tables.length > 0 && (
                            <Card className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                                <CardHeader>
                                    <CardTitle>Partizipientabellen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {currentTopic.content.tables.map((table, tableIndex) => (
                                            <div key={tableIndex} className="space-y-4">
                                                <h3 className="font-semibold text-xl">{table.title}</h3>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr>
                                                                {table.headers.map((header, headerIndex) => (
                                                                    <th key={headerIndex} className="border border-border/40 px-4 py-2 bg-card/60 text-left font-semibold">
                                                                        {header}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {table.rows.map((row, rowIndex) => (
                                                                <tr key={rowIndex}>
                                                                    {row.map((cell, cellIndex) => (
                                                                        <td key={cellIndex} className="border border-border/40 px-4 py-2">
                                                                            {cell}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between items-center gap-4">
                            <Button 
                                variant="outline" 
                                onClick={() => navigate('/learn/grammar/partizipien')}
                                className="gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Zurück zu Partizipien
                            </Button>
                            
                            {(() => {
                                const currentIndex = partizipienTopics.findIndex(t => t.id === topic);
                                const nextTopic = currentIndex < partizipienTopics.length - 1 ? partizipienTopics[currentIndex + 1] : null;
                                
                                return nextTopic ? (
                                    <Button 
                                        onClick={() => navigate(`/learn/grammar/partizipien/${nextTopic.id}`)}
                                        className="gap-2"
                                    >
                                        Weiter zu {nextTopic.title}
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => navigate('/learn/grammar')}
                                        className="gap-2"
                                    >
                                        Zur Grammatikübersicht
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                );
                            })()}
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
