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

const syntaxTopics = [
    {
        id: 'satzbau',
        title: '1. Satzbau',
        description: 'Grundlagen: Grundstruktur und Wortstellung',
        content: {
            explanation: 'Der lateinische Satzbau zeichnet sich durch eine bemerkenswerte Flexibilität aus, die durch das ausgeprägte Kasussystem ermöglicht wird. Im Gegensatz zum Deutschen, das stark auf feste Wortfolgen angewiesen ist, kann das Lateinische Satzglieder durch ihre Kasusendungen eindeutig markieren, unabhängig von ihrer Position im Satz. Diese Flexibilität ermöglicht raffinierte rhetorische Effekte und Betonungen, die für die lateinische Literatur charakteristisch sind.',
            details: 'Die grundlegende Satzstruktur besteht aus Subjekt, Prädikat und Objekt, aber ihre Anordnung ist variabel. Die typische Wortstellung ist Subject-Object-Verb (SOV), aber Abweichungen sind häufig und dienen rhetorischen Zwecken. Das Subjekt steht oft am Satzanfang, kann aber auch ausgelassen werden, wenn es aus dem Kontext oder der Verbendung ersichtlich ist. Das Prädikat steht typischerweise am Satzende, was dem Satz eine gewisse Spannung verleiht. Die Objekte können vor oder nach dem Prädikat stehen, wobei ihre Position oft von ihrer Bedeutung oder der Betonung abhängt. Attribute und Adverbien sind relativ frei positionierbar und folgen oft dem Wort, das sie bestimmen.',
            rules: 'Die Grundwortstellung ist SOV (Subject-Object-Verb), aber PO (Prädikat-Objekt) und OSV sind ebenfalls häufig. Das Subjekt kann ausgelassen werden, wenn es aus dem Kontext ersichtlich ist (Pro-Drop-Sprache). Das Prädikat steht oft am Satzende, kann aber zur Betonung vorangestellt werden. Direkte Objekte stehen oft näher am Prädikat als indirekte Objekte. Attribute stehen meist nach dem Substantiv, das sie bestimmen, können aber zur Betonung vorangestellt werden. Präpositionen stehen immer vor ihrem Kasusobjekt. Konjunktionen können Satzteile oder ganze Sätze verbinden und stehen oft an der Grenze zwischen den verbundenen Elementen. Die Wortstellung kann rhetorische Zwecke dienen: Inversion für Betonung, Anastrophe für poetische Wirkung, Hyperbaton für komplexe Satzgefüge.',
            tables: [
                {
                    title: 'Typische lateinische Satzstrukturen',
                    headers: ['Struktur', 'Beschreibung', 'Beispiel', 'Verwendung'],
                    rows: [
                        ['SOV', 'Subject-Object-Verb', 'Puer librum legit', 'Standardwortstellung'],
                        ['OSV', 'Object-Subject-Verb', 'Librum puer legit', 'Objektbetonung'],
                        ['OV', 'Object-Verb (Subjekt ausgelassen)', 'Librum legit', 'Subjekt bekannt'],
                        ['VS', 'Verb-Subject', 'Legit puer', 'Prädikatsbetonung'],
                        ['VO', 'Verb-Object', 'Legit librum puer', 'Starke Prädikatsbetonung'],
                        ['SVO', 'Subject-Verb-Object', 'Puer legit librum', 'Deutsche Wortstellung']
                    ]
                }
            ]
        }
    },
    {
        id: 'wortstellung',
        title: '2. Wortstellung',
        description: 'Grundlagen: Rhetorische und stilistische Aspekte',
        content: {
            explanation: 'Die lateinische Wortstellung ist ein komplexes Zusammenspiel aus syntaktischen Notwendigkeiten, rhetorischen Absichten und stilistischen Präferenzen. Während die Kasusendungen eine gewisse Freiheit ermöglichen, gibt es dennoch starke Tendenzen und Konventionen, die die Wortstellung beeinflussen. Diese Tendenzen variieren je nach Texttyp: Prosafolgt anderen Mustern als Poesie, und technische Texte haben andere Präferenzen als rhetorische Werke.',
            details: 'In der Prosa herrscht die Tendenz zur Enjambement-Struktur, bei der Satzteile eng miteinander verbunden sind. Das Prädikat neigt dazu, am Satzende zu stehen, was dem Leser eine gewisse Spannung erhält. Subjekte werden oft am Satzanfang platziert, können aber ausgelassen werden. Objekte folgen oft dem Subjekt, können aber zur Betonung verschoben werden. In der Poesie ist die Wortstellung freier und folgt oft metrischen Erfordernissen. Hier finden sich häufigere Inversionen, Anastrophén und Hyperbata. Die rhetorische Prosa nutzt die Wortstellung bewusst für Effekte: Inversion für Betonung, Chiasmus für symmetrische Anordnung, Antithese für Kontrastbildung.',
            rules: 'Die Enjambement-Struktur verbindet Satzteile eng: Subjekt und Verb, Objekt und Verb, Adjektiv und Substantiv. Die Topikalisierung stellt wichtige Informationen an den Satzanfang. Die Fokusierung betont bestimmte Elemente durch ungewöhnliche Positionierung. Der Chiasmus kreuzt Elemente: A-B-B-A (bona malaque). Die Antithese stellt Gegensätze gegenüber: non solum sed etiam. Die Anastrophe verändert die normale Reihenfolge: mecum statt cum me. Das Hyperbaton trennt normalerweise verbundene Elemente: magnus vir statt vir magnus. Die Parenthese fügt Einschübe ein, die den Satzfluss unterbrechen. Die Ellipse lässt notwendige Elemente aus, wenn sie aus dem Kontext ersichtlich sind.',
            tables: [
                {
                    title: 'Rhetorische Wortstellungsmuster',
                    headers: ['Muster', 'Struktur', 'Beispiel', 'Effekt'],
                    rows: [
                        ['Chiasmus', 'A-B-B-A', 'bona malaque', 'Symmetrie, Ausgewogenheit'],
                        ['Antithese', 'A-non-A', 'non solum sed etiam', 'Kontrast, Steigerung'],
                        ['Anastrophe', 'Präposition-Nomen', 'mecum', 'Poetische Wirkung'],
                        ['Hyperbaton', 'Adjektiv-Substantiv getrennt', 'magnus vir', 'Spannung, Komplexität'],
                        ['Parenthese', 'Einschub', 'hoc (ut dixerim) facit', 'Erläuterung, Nebenbemerkung'],
                        ['Ellipse', 'Auslassung', 'Venio (domum)', 'Kürze, Dynamik'],
                        ['Inversion', 'Verb-Subjekt', 'Venit puer', 'Prädikatsbetonung'],
                        ['Topikalisierung', 'Objekt vorne', 'Librum puer legit', 'Objektbetonung']
                    ]
                }
            ]
        }
    },
    {
        id: 'satzgliederung',
        title: '3. Satzgliederung',
        description: 'Grundlagen: Analyse und Klassifikation',
        content: {
            explanation: 'Die lateinische Satzgliederung ermöglicht eine präzise Analyse der Satzstruktur und der Beziehungen zwischen den Satzelementen. Im Gegensatz zur deutschen Grammatik, die oft auf funktionale Kriterien zurückgreift, basiert die lateinische Satzgliederung stärker auf formalen Kriterien wie Kasus und Kongruenz. Diese formale Orientierung ermöglicht eine genauere Beschreibung der syntaktischen Funktionen und Beziehungen.',
            details: 'Die Hauptglieder sind Subjekt, Prädikat, Objekt (direkt und indirekt), Adverbiale Bestimmungen und Attribute. Das Subjekt steht im Nominativ und kongruiert mit dem finiten Verb. Das Prädikat kann aus einem finiten Verb oder aus mehreren Teilen bestehen (Hilfsverb + Partizip, periphrastische Konstruktionen). Das direkte Objekt steht im Akkusativ und hängt von transitiven Verben ab. Das indirekte Objekt steht im Dativ und kann von bestimmten Verben oder Präpositionen abhängen. Die adverbialen Bestimmungen können durch Adverbien, Präpositionalphrasen oder Kasus (besonders Ablativ) ausgedrückt werden. Attribute stehen in Kongruenz mit dem Substantiv, das sie bestimmen.',
            rules: 'Die Subjekt-Verb-Kongruenz ist obligatorisch: Person und Numerus müssen übereinstimmen. Das direkte Objekt erfordert transitive Verben und steht im Akkusativ. Das indirekte Objekt steht im Dativ bei Verben wie dare, dicere, scribere oder bei Adjektiven wie utilis. Adverbiale Bestimmungen der Art und Weise werden oft durch Ablativ oder Adverbien ausgedrückt. Lokaladverbien verwenden Präpositionen mit Ablativ (in, sub) oder Akkusativ (ad, per). Temporaladverbien können durch Akkusativ der Zeit oder Adverbien gebildet werden. Kausale Adverbialien verwenden Präpositionen wie ob, propter oder Ablativ causae. Finale Adverbialien stehen mit ad + Akkusativ oder ut + Konjunktiv. Konzessive Adverbialien verwenden quamquam oder cum + Konjunktiv.',
            tables: [
                {
                    title: 'Satzglieder und ihre Kennzeichen',
                    headers: ['Satzglied', 'Kasus/Form', 'Typische Verben/Wörter', 'Beispiel'],
                    rows: [
                        ['Subjekt', 'Nominativ', 'Alle finiten Verben', 'Puer currit'],
                        ['Direktes Objekt', 'Akkusativ', 'Transitive Verben', 'Puer librum legit'],
                        ['Indirektes Objekt', 'Dativ', 'dare, dicere, scribere', 'Puero librum do'],
                        ['Adverbiale Bestimmung', 'Verschiedene', 'Adverbien, Präpositionen', 'Romam venit'],
                        ['Attribut', 'Kongruenz', 'Adjektive, Partizipien', 'vir magnus'],
                        ['Prädikativ', 'Nominativ/Akkusativ', 'esse, fieri, habere', 'est bonus'],
                        ['Apposition', 'Nominativ', 'Erläuternde Substantive', 'Cicero, orator'],
                        ['Objekt zum Infinitiv', 'Akkusativ', 'Infinitivkonstruktionen', 'Puer videt venire']
                    ]
                }
            ]
        }
    },
    {
        id: 'nebensätze',
        title: '4. Nebensätze',
        description: 'Grundlagen: Arten, Konjunktionen und Modusverwendung',
        content: {
            explanation: 'Die lateinischen Nebensätze zeichnen sich durch eine große Vielfalt an Konstruktionen und Verwendungsmöglichkeiten aus. Im Gegensatz zum Deutschen, das oft feste Konjunktionen verwendet, nutzt das Lateinische ein komplexes System aus Konjunktionen, Modus und Kasus, um verschiedene Arten von Nebensätzen zu bilden. Diese Vielfalt ermöglicht präzise semantische Unterscheidungen und komplexe Satzgefüge.',
            details: 'Die Hauptsatzarten sind Konditionalsätze (Bedingungen), Kausalsätze (Gründe), Konzessivsätze (Einräumungen), Finalsätze (Zwecke), Konsekutivsätze (Folgen), Temporalsätze (Zeit), Relativsätze (Beziehungen) und indirekte Fragen. Jede Art hat charakteristische Konjunktionen und oft spezifische Modusverwendungen. Der Konjunktiv spielt eine besondere Rolle in vielen Nebensatzarten, während der Indikativ in anderen bevorzugt wird. Die Wahl des Modus hängt oft von der Art der Aussage und der Perspektive des Sprechers ab.',
            rules: 'Konditionalsätze verwenden si (wenn) mit Indikativ im realen und Konjunktiv im irrealen Fall: si venit, gaudebit (wenn er kommt, wird er sich freuen); si veniret, gauderet (wenn er käme, würde er sich freuen). Kausalsätze verwenden quia, quod, quoniam mit Indikativ oder cum mit Konjunktiv: quia venit, gaudebit (weil er kommt, freut er sich). Konzessivsätze verwenden quamquam mit Indikativ oder cum mit Konjunktiv: quamquam venit, non gaudebit (obwohl er kommt, freut er sich nicht). Finalsätze verwenden ut + Konjunktiv oder ne + Konjunktiv: ut veniat (damit er komme), ne veniat (damit er nicht komme). Konsekutivsätze verwenden ut + Konjunktiv nach comparativ oder tam...ut: tam fortis est ut vincat (so stark ist er, dass er siegt). Temporalsätze verwenden cum, dum, postquam mit verschiedenen Modi: cum venit (als er kam), cum veniat (wann immer er kommt). Relativsätze verwenden qui, quae, quod mit Indikativ oder Konjunktiv je nach Bezug.',
            tables: [
                {
                    title: 'Nebensatzarten und ihre Kennzeichen',
                    headers: ['Art', 'Konjunktionen', 'Modus', 'Beispiel', 'Bedeutung'],
                    rows: [
                        ['Konditionalsatz', 'si', 'Indikativ/Konjunktiv', 'si venit, gaudebit', 'wenn - dann'],
                        ['Kausalsatz', 'quia, quod, cum', 'Indikativ/Konjunktiv', 'quia venit, gaudebit', 'weil - deshalb'],
                        ['Konzessivsatz', 'quamquam, cum', 'Indikativ/Konjunktiv', 'quamquam venit, non gaudebit', 'obwohl - trotzdem'],
                    ['Finalsatz', 'ut, ne', 'Konjunktiv', 'ut veniat', 'damit - damit nicht'],
                    ['Konsekutivsatz', 'ut, ut...non', 'Konjunktiv', 'tam fortis ut vincat', 'so dass - dass'],
                    ['Temporalsatz', 'cum, dum, postquam', 'Indikativ/Konjunktiv', 'cum venit, gaudebit', 'als - wann'],
                    ['Relativsatz', 'qui, quae, quod', 'Indikativ/Konjunktiv', 'vir qui venit', 'der - welcher'],
                    ['Indirekte Frage', 'interrogativa', 'Konjunktiv', 'scio quis veniat', 'ich weiß, wer kommt']
                    ]
                }
            ]
        }
    }
];

export default function SyntaxPage() {
    const { topic } = useParams<{ topic: string }>();
    const navigate = useNavigate();

    if (!topic) {
        // Show overview of all syntax topics
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
                            Syntax
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
                                Syntax
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Die lateinische Satzlehre und Satzstruktur. Wähle ein Thema zum Lernen:
                            </p>
                        </div>

                        {/* Topics Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {syntaxTopics.map((t, index) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card 
                                        className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-6 hover:border-primary/50 transition-all duration-500 group cursor-pointer h-full"
                                        onClick={() => navigate(`/learn/grammar/syntax/${t.id}`)}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                                                {t.title}
                                            </h3>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {t.description}
                                        </p>
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

    const currentTopic = syntaxTopics.find(t => t.id === topic);

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
                        onClick={() => navigate('/learn/grammar/syntax')}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück zu Syntax
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                        <BookOpen className="w-4 h-4" />
                        Syntax
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
                                <div className="prose prose-neutral dark:prose-invert max-w-none">
                                    <p className="text-lg leading-relaxed">
                                        {currentTopic.content.explanation}
                                    </p>
                                </div>
                                
                                <div className="space-y-6">
                                    <h3 className="font-semibold text-xl">Detaillierte Erläuterungen:</h3>
                                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                                        <p className="text-lg leading-relaxed">
                                            {Array.isArray(currentTopic.content.details) 
                                                ? currentTopic.content.details.map((detail, index) => (
                                                    <p key={index} className="mb-4">{detail}</p>
                                                ))
                                                : <p>{currentTopic.content.details}</p>
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="font-semibold text-xl">Wichtige Regeln:</h3>
                                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                                        <p className="text-lg leading-relaxed">
                                            {Array.isArray(currentTopic.content.rules) 
                                                ? currentTopic.content.rules.map((rule, index) => (
                                                    <p key={index} className="mb-4">{rule}</p>
                                                ))
                                                : <p>{currentTopic.content.rules}</p>
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tables */}
                        {currentTopic.content.tables && currentTopic.content.tables.length > 0 && (
                            <Card className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                                <CardHeader>
                                    <CardTitle>Syntaxtabellen</CardTitle>
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
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
