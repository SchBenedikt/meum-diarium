import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    BookOpen,
    GraduationCap,
    ChevronRight
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { ExplanationBlock, DetailsList, RuleCards } from './GrammarContent';
import { GrammarTable } from './GrammarTable';

const adjektiveTopics = [
    {
        id: 'deklination',
        title: '1. Adjektivdeklination',
        description: 'Grundlagen: Deklination und Kongruenz',
        content: {
            explanation: 'Das lateinische Adjektivsystem ist eng mit der Substantivdeklination verknüpft und folgt ähnlichen morphologischen Mustern. Adjektive müssen in Genus, Numerus und Kasus mit dem Substantiv übereinstimmen, das sie bestimmen. Diese Kongruenz ist ein fundamentales Prinzip der lateinischen Syntax und erfordert präzise Kenntnis der Deklinationsmuster. Die Adjektive gliedern sich hauptsächlich in zwei große Gruppen: die Adjektive der a/o-Deklination und die Adjektive der 3. Deklination.',
            details: 'Die Adjektive der a/o-Deklination sind die häufigste und regelmäßigste Gruppe. Sie folgen der 1. Deklination im Femininum und der 2. Deklination im Maskulinum und Neutrum. Diese dreiformigen Adjektive haben drei Endungen im Nominativ Singular: -us (m), -a (f), -um (n). Die zweiformigen Adjektive haben nur -us (m) und -um (n), während das Femininum auf -a endet. Einige Adjektive sind einformig und enden nur auf -is oder -x, folgen aber der 3. Deklination. Die Adjektive der 3. Deklination sind komplexer und können zwei- oder dreiformig sein. Sie folgen den Mustern der i-Stämme oder konsonantischen Stämme der Substantive.',
            rules: [
                {
                    label: 'a/o-Deklination',
                    body: '**Femininum:** nach der 1. Deklination (rosa, rosae, rosae, rosam, rosa) **Maskulinum:** nach der 2. Deklination auf -us (dominus, domini, domino, dominum, domino) **Neutum:** nach der 2. Deklination auf -um (bellum, belli, bello, bellum, bello)'
                },
                {
                    label: '3. Deklination',
                    body: 'Folgt den Mustern der i-Stämme: Nominativ/Akkusativ Plural auf -es, Genitiv Plural auf -ium, Dativ/Ablativ Plural auf -ibus.'
                },
                {
                    label: 'Adjektive auf -er',
                    body: 'Bei Adjektiven auf -er im Maskulinum fällt der Stammvokal oft aus (pulcher, pulchri, pulchro, pulchrum, pulchro).'
                },
                {
                    label: 'Komparation',
                    body: 'Die Komparation wird durch die Suffixe -ior (Komparativ) und -issimus (Superlativ) gebildet, wobei der Komparativ nach der 3. Deklination und der Superlativ nach der a/o-Deklation dekliniert wird.'
                }
            ],
            tables: [
                {
                    title: 'Adjektivdeklination',
                    headers: ['Kasus', 'Singular', 'Plural'],
                    rows: [
                        ['Nom.', '**bonus**', '**boni**'],
                        ['Gen.', '**boni**', '**bonorum**'],
                        ['Dat.', '**bono**', '**bonis**'],
                        ['Akk.', '**bonum**', '**bonos**'],
                        ['Abl.', '**bono**', '**bonis**']
                    ]
                }
            ]
        }
    },
    {
        id: 'steigerung',
        title: '2. Adjektivsteigerung',
        description: 'Grundlagen: Komparativ und Superlativ',
        content: {
            explanation: 'Das lateinische Steigerungssystem ermöglicht eine präzise Ausdrucksmöglichkeit für quantitative und qualitative Vergleiche. Die Adjektive können in drei Steigerungsstufen gebracht werden: Positiv (Grundform), Komparativ (Steigerungsform) und Superlativ (Höchstform). Diese Steigerungen folgen systematischen morphologischen Mustern und haben spezifische syntaktische Verwendungskontexte, die weit über die deutschen Entsprechungen hinausgehen.',
            details: 'Der Komparativ wird durch das Suffix -ior für alle Genera gebildet, wobei die Adjektive dann nach der 3. Deklination dekliniert werden. Die Endungen sind -ior (m), -ior (f), -ius (n) im Nominativ Singular. Der Superlativ wird durch das Suffix -issimus gebildet und folgt der a/o-Deklination mit den Endungen -issimus, -issima, -issimum. Bei Adjektiven auf -er wird der Superlativ auf -rimus gebildet (pulcher, pulcherrimus). Adjektive auf -lis bilden den Superlativ auf -limus (facilis, facillimus). Einige Adjektive haben unregelmäßige Steigerungsformen, die auswendig gelernt werden müssen (bonus, melior, optimus; malus, peior, pessimus).',
            rules: [
                {
                    label: 'Komparativbildung',
                    body: 'Die Bildung des Komparativs erfolgt durch Anfügen von -ior an den Adjektivstamm: fortis → fortior, clarus → clarior, magnus → maior.'
                },
                {
                    label: 'Komparativdeklination',
                    body: 'Der Komparativ wird nach der 3. Deklination dekliniert: fortior, fortioris, forti, fortiorem, forti.'
                },
                {
                    label: 'Superlativbildung',
                    body: 'Der Superlativ wird mit -issimus gebildet: fortis → fortissimus, clarus → clarissimus, magnus → maximus.'
                },
                {
                    label: 'Superlativdeklination',
                    body: 'Der Superlativ folgt der a/o-Deklination: fortissimus, fortissimi, fortissimo, fortissimum, fortissimo.'
                },
                {
                    label: 'Adjektive auf -er',
                    body: 'Bei Adjektiven auf -er entfällt das -e- vor -rimus: pulcher → pulcherrimus.'
                },
                {
                    label: 'Adjektive auf -lis',
                    body: 'Bei Adjektiven auf -lis wird das -i- durch -limus ersetzt: facilis → facillimus.'
                },
                {
                    label: 'Unregelmäßige Steigerungen',
                    body: 'Die unregelmäßigen Steigerungen müssen einzeln gelernt werden: bonus → melior → optimus, malus → peior → pessimus, magnus → maior → maximus, parvus → minor → minimus.'
                }
            ],
            tables: [
                {
                    title: 'Adjektivsteigerung',
                    headers: ['Stufe', 'Bildung', 'Beispiel'],
                    rows: [
                        ['Positiv', '**bonus**', 'gut'],
                        ['Komparativ', '**melior**', 'besser'],
                        ['Superlativ', '**optimus**', 'am besten'],
                    ]
                }
            ]
        }
    },
    {
        id: 'vergleiche',
        title: '3. Vergleichssätze',
        description: 'Grundlagen: Gleichheit, Ungleichheit, Überlegenheit',
        content: {
            explanation: 'Das lateinische Vergleichssystem ermöglicht komplexe und nuancierte Ausdrucksformen für Gleichheit, Ungleichheit und Überlegenheit. Im Gegensatz zum Deutschen verwendet das Lateinische spezifische Konjunktionen und Kasus, um verschiedene Arten von Vergleichen zu bilden. Diese Konstruktionen sind fundamental für die lateinische Rhetorik und Literatur und erfordern präzise Kenntnis der entsprechenden syntaktischen Muster.',
            details: 'Der Gleichheitsvergleich wird mit tam...quam (so...wie) gebildet, wobei das Adjektiv mit tam und der Vergleichsgegenstand mit quam eingeleitet wird. Der Vergleichsgegenstand steht im gleichen Kasus wie das verglichene Substantiv. Der Ungleichheitsvergleich verwendet die Komparativform des Adjektivs mit quam (als) oder ohne quam mit dem Ablativ des Vergleichs. Der Überlegenheitsvergleich wird mit dem Superlativ und verschiedenen Konstruktionen ausgedrückt: omnes (alle), maxime (sehr), oder durch Konstruktionen mit Genitiv oder Ablativ. Besonders wichtig ist die Unterscheidung zwischen quam mit Akkusativ und Ablativ ohne quam beim Ungleichheitsvergleich.',
            rules: 'Beim Gleichheitsvergleich: tam clarus quam Cicero (so berühmt wie Cicero). Das Adjektiv wird mit tam verstärkt, der Vergleichsgegenstand mit quam eingeleitet. Beide stehen im gleichen Kasus. Beim Ungleichheitsvergleich mit quam: clarior quam Cicero (berühmter als Cicero). Hier steht der Vergleichsgegenstand im gleichen Kasus. Beim Ungleichheitsvergleich ohne quam: clarior Cicerone (berühmter als Cicero). Hier steht der Vergleichsgegenstand im Ablativ. Beim Überlegenheitsvergleich: clarissimus omnium (berühmtester von allen) oder maxime clarus (sehr berühmt). Der Superlativ kann auch mit einem Genitiv der Zugehörigkeit verbunden werden: clarissimus Romanorum (berühmtester der Römer). Bei Vergleichen mit Verben werden oft Partizipien verwendet: celerius cucurrit (er lief schneller).',
            tables: [
                {
                    title: 'Vergleichskonstruktionen',
                    headers: ['Art', 'Konstruktion', 'Beispiel', 'Bedeutung'],
                    rows: [
                        ['Gleichheit', 'tam...quam', 'tam fortis quam Hector', 'so stark wie Hector'],
                        ['Ungleichheit', 'clarior quam', 'clarior Cicerone', 'berühmter als Hector'],
                        ['Überlegenheit', 'clarissimus omnium', 'sehr berühmt', 'am berühmsten'],
                    ]
                }
            ]
        }
    }
];

export default function AdjektivePage() {
    const { topic } = useParams<{ topic: string }>();
    const navigate = useNavigate();

    if (!topic) {
        // Show overview of all adjective topics
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
                            <BookOpen className="w-4 h-4" />
                            Adjektive
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
                                Adjektive
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Die lateinischen Eigenschaftswörter und ihre Deklination. Wähle ein Thema zum Lernen:
                            </p>
                        </div>

                        {/* Topics Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {adjektiveTopics.map((t, index) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card 
                                        className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-6 hover:border-primary/50 transition-all duration-500 group cursor-pointer h-full"
                                        onClick={() => navigate(`/learn/grammar/adjektive/${t.id}`)}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                                                {t.title}
                                            </h3>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.description}</p>
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

    const currentTopic = adjektiveTopics.find(t => t.id === topic);

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
                        onClick={() => navigate('/learn/grammar/adjektive')}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück zu Adjektiven
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                        <BookOpen className="w-4 h-4" />
                        Adjektive
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
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold">Theorie</h2>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-4">Überblick</p>
                                    <ExplanationBlock text={currentTopic.content.explanation} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-4">Im Detail</p>
                                    <DetailsList text={Array.isArray(currentTopic.content.details) ? currentTopic.content.details.join(' ') : currentTopic.content.details} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-4">Regeln & Merkmale</p>
                                    <RuleCards text={Array.isArray(currentTopic.content.rules) ? currentTopic.content.rules.join(' ') : currentTopic.content.rules} />
                                </div>
                            </div>
                        </div>

                        {/* Tables */}
                        {currentTopic.content.tables && currentTopic.content.tables.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Tabellen</h2>
                                <div className="space-y-8">
                                    {currentTopic.content.tables.map((table, tableIndex) => (
                                        <GrammarTable
                                            key={tableIndex}
                                            title={table.title}
                                            headers={table.headers}
                                            rows={table.rows}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
