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

const substantiveTopics = [
    {
        id: 'geschlechter',
        title: '1. Die drei Geschlechter',
        description: 'Grundlagen: Maskulinum, Femininum, Neutrum',
        content: {
            explanation: 'Das lateinische Genussystem stellt eines der fundamentalen Konzepte der lateinischen Grammatik dar und unterscheidet sich grundlegend vom deutschen System. Während im Deutschen viele grammatische Geschlechter durch natürliche oder formale Kriterien erkennbar sind, müssen die lateinischen Genera weitgehend als lexikalische Eigenschaften der einzelnen Substantive gelernt werden. Das grammatische Geschlecht beeinflusst nicht nur die Deklination des Substantivs selbst, sondern determiniert auch die Kongruenz von Adjektiven, Pronomen und Partizipien. Die korrekte Zuordnung des Genus ist daher essentiell für die Beherrschung der lateinischen Syntax.',
            details: 'Das Maskulinum umfasst männliche Lebewesen und zahlreiche Gegenstände sowie abstrakte Begriffe. Es ist die häufigste Genusklasse und charakterisiert viele der wichtigsten lateinischen Substantive. Das Femininum schließt weibliche Lebewesen ein, aber auch eine Vielzahl von Gegenständen, Pflanzen und abstrakten Konzepten. Besonders auffällig ist die Häufung bei Baumnamen und vielen abstrakten Qualitätsbegriffen. Das Neutrum umfasst primär sächliche Gegenstände, aber überraschenderweise auch einige Lebewesen und abstrakte Begriffe. Die Neutra zeichnen sich durch besondere Pluralbildungen aus. Die Diskrepanz zwischen natürlichem Geschlecht (Sexus) und grammatischem Geschlecht (Genus) ist im Lateinischen besonders ausgeprägt. So können weibliche Personen grammatisch maskulin sein und umgekehrt. Die Wortendung gibt zwar oft Hinweise auf das Genus, aber es existieren zahlreiche Ausnahmen und unregelmäßige Muster, die besondere Aufmerksamkeit erfordern.',
            rules: 'Die 1. Deklination auf -a ist überwiegend feminin, mit wenigen Ausnahmen wie agricola (Landmann) oder nauta (Seefahrer), die maskulin sind. Die 2. Deklination zeigt eine klare Trennung: Maskulina auf -us/-er und Neutra auf -um. Besonderheiten bilden die Wörter auf -er, bei denen der Stammvokal im Genitiv sichtbar wird (z.B. puer, pueri). Die 3. Deklination ist die heterogenste Gruppe und enthält alle drei Genera. Die Endungen allein geben wenig Aufschluss, sodass hier das Genus mitgelernt werden muss. Substantive auf -or sind meist maskulin (amor, dolor), aber es gibt wichtige Feminina wie arbor (Baum) oder honor (Ehre). Griechische Lehnwörter behalten oft ihr ursprüngliches Geschlecht, was zu unvorhersehbaren Genuszuweisungen führt. Toponyme folgen eigenen Regeln: Flussnamen sind typischerweise maskulin (Rhenus, Danubius), Inselnamen feminin (Sicilia, Corsica), während Städte je nach Kontext variieren können.',
            tables: [
                {
                    title: '1. Deklination (a-Deklination) - rosa, rosae (Femininum)',
                    headers: ['Kasus', 'Singular', 'Plural'],
                    rows: [
                        ['Nominativ', 'rosa', 'rosae'],
                        ['Genitiv', 'rosae', 'rosarum'],
                        ['Dativ', 'rosae', 'rosis'],
                        ['Akkusativ', 'rosam', 'rosas'],
                        ['Ablativ', 'rosa', 'rosis']
                    ]
                },
                {
                    title: '2. Deklination (o-Deklination) - dominus, domini (Maskulinum)',
                    headers: ['Kasus', 'Singular', 'Plural'],
                    rows: [
                        ['Nominativ', 'dominus', 'domini'],
                        ['Genitiv', 'domini', 'dominorum'],
                        ['Dativ', 'domino', 'dominis'],
                        ['Akkusativ', 'dominum', 'dominos'],
                        ['Ablativ', 'domino', 'dominis']
                    ]
                },
                {
                    title: '2. Deklination (o-Deklination) - bellum, belli (Neutrum)',
                    headers: ['Kasus', 'Singular', 'Plural'],
                    rows: [
                        ['Nominativ', 'bellum', 'bella'],
                        ['Genitiv', 'belli', 'bellorum'],
                        ['Dativ', 'bello', 'bellis'],
                        ['Akkusativ', 'bellum', 'bella'],
                        ['Ablativ', 'bello', 'bellis']
                    ]
                },
                {
                    title: '3. Deklination - rex, regis (konsonantischer Stamm)',
                    headers: ['Kasus', 'Singular', 'Plural'],
                    rows: [
                        ['Nominativ', 'rex', 'reges'],
                        ['Genitiv', 'regis', 'regum'],
                        ['Dativ', 'regi', 'regibus'],
                        ['Akkusativ', 'regem', 'reges'],
                        ['Ablativ', 'rege', 'regibus']
                    ]
                }
            ]
        }
    },
    {
        id: 'kasus',
        title: '2. Die fünf Fälle',
        description: 'Grundlagen: Nominativ, Genitiv, Dativ, Akkusativ, Ablativ',
        content: {
            explanation: 'Das lateinische Kasussystem bildet das Rückgrat der lateinischen Syntax und ermöglicht eine außergewöhnlich flexible Wortstellung. Im Gegensatz zum Deutschen, das stark auf feste Satzfolgen angewiesen ist, kann das Lateinische Satzglieder durch die Kasusendungen eindeutig markieren, unabhängig von ihrer Position im Satz. Die fünf Kasus - Nominativ, Genitiv, Dativ, Akkusativ und Ablativ - übernehmen dabei spezifische grammatische Funktionen, die weit über die deutschen Entsprechungen hinausgehen. Der Ablativ insbesondere ist ein multifunktionaler Kasus, der verschiedene deutsche Präpositionalphrasen ersetzen kann.',
            details: 'Der Nominativ als Subjektskasus kennzeichnet das handelnde Wesen oder den Träger einer Eigenschaft. Er ist der Ausgangspunkt für die meisten lateinischen Sätze und bestimmt die Verbkonjugation. Der Genitiv drückt nicht nur Besitz aus, sondern auch Zugehörigkeit, Teilung, Qualität und zahlreiche andere Beziehungen. Seine vielfältigen Verwendungsmöglichkeiten machen ihn zum komplexesten Kasus. Der Dativ bezeichnet das indirekte Objekt, aber auch den Zweck, den Adressaten oder den Benefizienten einer Handlung. Besonders wichtig ist seine Verwendung bei bestimmten Verben und Adjektiven. Der Akkusativ kennzeichnet das direkte Objekt, aber auch Richtung, Ausdehnung im Raum und Zeit sowie verschiedene adverbielle Funktionen. Er ist der objektivste Kasus des Systems. Der Ablativ ist der vielseitigste Kasus und drückt Mittel, Weise, Ursache, Trennung, Ort, Zeit und zahlreiche andere Beziehungen aus. Er kann oft ohne Präposition stehen. Die Kasusendungen variieren systematisch je nach Deklination und Numerus, was eine komplexe aber logische Morphologie ergibt. Die freie Wortstellung ermöglicht rhetorische Effekte und Betonungen, die im Deutschen nur schwer nachzubilden sind.',
            rules: 'Nominativ: Fragt nach dem Subjekt (Wer oder was?) und bestimmt die Person des Verbs. Beispiel: Puer currit - Der Junge läuft. Genitiv: Fragt nach Besitz oder Zugehörigkeit (Wessen?). Er kann auch als Genitivus objectivus und subjectivus verwendet werden. Beispiel: Liber pueri - Das Buch des Jungen. Dativ: Fragt nach dem indirekten Objekt (Wem?). Bestimmte Verben wie credere, parcere, nocere verlangen den Dativ. Beispiel: Puero librum do - Ich gebe dem Jungen das Buch. Akkusativ: Fragt nach dem direkten Objekt (Wen oder was?). Bei Verben der Bewegung kann er auch Richtung anzeigen. Beispiel: Puer librum legit - Der Junge liest das Buch. Ablativ: Fragt nach Mittel, Weise, Ort, Trennung (Womit, wodurch, wo, wann?). Er kann präpositional oder absolut stehen. Beispiel: Puer gladio pugnat - Der Junge kämpft mit dem Schwert. Der Ablativus absolutus ist eine charakteristische lateinische Konstruktion: Partizip im Ablativ mit zugehörigem Substantiv, die als Nebensatz fungiert. Einige Verben haben feste Kasusrektion: esse + Nominativ, meminisse + Genitiv, favere + Dativ, uti + Ablativ.',
            tables: [
                {
                    title: 'Kasusfunktionen',
                    headers: ['Kasus', 'Frage', 'Funktion', 'Beispiel'],
                    rows: [
                        ['Nominativ', 'Wer/Was?', 'Subjekt', 'Puer currit'],
                        ['Genitiv', 'Wessen?', 'Besitz', 'Liber pueri'],
                        ['Dativ', 'Wem?', 'Indirektes Objekt', 'Puero librum do'],
                        ['Akkusativ', 'Wen/Was?', 'Direktes Objekt', 'Puer librum legit'],
                        ['Ablativ', 'Womit/Wo?', 'Mittel/Weise', 'Puer gladio pugnat']
                    ]
                }
            ]
        }
    },
    {
        id: 'deklination',
        title: '3. Die fünf Deklinationen',
        description: 'Grundlagen: Die Deklinationsklassen und ihre Formen',
        content: {
            explanation: 'Das lateinische Deklinationssystem basiert auf fünf fundamentalen Klassen, die sich nach der Endung des Genitiv Singulars unterscheiden. Dieses System ermöglicht eine präzise und konsistente Bildung aller Kasusformen innerhalb jeder Klasse. Die Deklination ist nicht nur ein morphologisches Konstrukt, sondern spiegelt die historische Entwicklung und etymologischen Zusammenhänge der lateinischen Sprache wider. Jede Deklination hat charakteristische Stammformen und Endungsmuster, die die Grundlage für die korrekte lateinische Syntax bilden.',
            details: 'Die 1. Deklination oder a-Deklination ist die einheitlichste Klasse und umfasst überwiegend Feminina. Ihre regelmäßigen Endungen machen sie zur idealen Einführung in die lateinische Morphologie. Die 2. Deklination oder o-Deklination teilt sich in Maskulina auf -us/-er und Neutra auf -um. Die Stammvokalveränderungen bei Wörtern auf -er stellen eine besondere Herausforderung dar. Die 3. Deklination ist die größte und komplexeste Klasse. Sie enthält i-Stämme und konsonantische Stämme mit unterschiedlichen Pluralbildungen und unregelmäßigen Formen. Die 4. Deklination oder u-Deklination ist relativ klein und umfasst sowohl Maskulina als auch Neutra mit charakteristischem u-Stamm. Die 5. Deklination oder e-Deklination ist die kleinste Klasse und fast ausschließlich feminin. Ihre unregelmäßigen Formen machen sie zu einer fortgeschrittenen Lernanforderung. Die Deklination bestimmt nicht nur die Endungen, sondern auch die Betonung und oft die Wortbedeutung durch etymologische Zusammenhänge. Griechische Lehnwörter folgen oft eigenen Mustern, die sich an die griechische Deklination anlehnen und besondere Endungen aufweisen.',
            rules: '1. Deklination: Genitiv auf -ae, Stamm = Nominativ ohne -a. Regelmäßige Endungen in allen Kasus. Beispiel: rosa, rosae - die Rose. 2. Deklination (Maskulina): Genitiv auf -i, Stamm = Nominativ ohne -us. Beispiel: dominus, domini - der Herr. 2. Deklination (Neutra): Genitiv auf -i, Stamm = Nominativ ohne -um. Nom./Akk. Plural auf -a. Beispiel: bellum, belli - der Krieg. 3. Deklination: Genitiv auf -is, Stamm = Genitiv ohne -is. Unterscheidung zwischen i-Stämmen und konsonantischen Stämmen. Beispiel: rex, regis - der König. 4. Deklination: Genitiv auf -us, Stamm = Genitiv ohne -us. Charakteristischer u-Stamm. Beispiel: manus, manus - die Hand. 5. Deklination: Genitiv auf -ei, Stamm = Genitiv ohne -ei. Unregelmäßige Formen, besonders im Plural. Beispiel: res, rei - die Sache. Die 3. Deklination i-Stämme haben gleiche Endungen im Ablativ Singular (-i) und im Plural (-ium für den Genitiv).',
            tables: [
                {
                    title: '1. Deklination (a-Deklination)',
                    headers: ['Kasus', 'Singular', 'Plural'],
                    rows: [
                        ['Nom.', 'rosa', 'rosae'],
                        ['Gen.', 'rosae', 'rosarum'],
                        ['Dat.', 'rosae', 'rosis'],
                        ['Akk.', 'rosam', 'rosas'],
                        ['Abl.', 'rosa', 'rosis']
                    ]
                },
                {
                    title: '2. Deklination (o-Deklination)',
                    headers: ['Kasus', 'Singular', 'Plural'],
                    rows: [
                        ['Nom. (m)', 'dominus', 'domini'],
                        ['Nom. (n)', 'bellum', 'bella'],
                        ['Gen.', 'domini/belli', 'dominorum/bellorum'],
                        ['Dat.', 'domino/bello', 'dominis/bellis'],
                        ['Akk.', 'dominum/bellum', 'dominos/bella'],
                        ['Abl.', 'domino/bello', 'dominis/bellis']
                    ]
                },
                {
                    title: '3. Deklination',
                    headers: ['Kasus', 'Singular', 'Plural'],
                    rows: [
                        ['Nom.', 'rex', 'reges'],
                        ['Gen.', 'regis', 'regum'],
                        ['Dat.', 'regi', 'regibus'],
                        ['Akk.', 'regem', 'reges'],
                        ['Abl.', 'rege', 'regibus']
                    ]
                }
            ]
        }
    },
    {
        id: 'pluralbildung',
        title: '4. Die Pluralbildung',
        description: 'Grundlagen: Pluralformen und ihre Besonderheiten',
        content: {
            explanation: 'Die lateinische Pluralbildung folgt systematischen Mustern, die innerhalb jeder Deklination konsistent sind. Diese Systematik ermöglicht eine präzise Vorhersage der Pluralformen aus den Singularformen, wobei die Kenntnis der Deklination und des Genus entscheidend ist. Die Pluralbildung ist nicht nur eine morphologische Übung, sondern fundamental für die lateinische Syntax, da viele Satzbeziehungen und semantische Nuancen durch den Numerus ausgedrückt werden.',
            details: 'Die Pluralendungen sind innerhalb jeder Deklination relativ einheitlich, was eine systematische Lernweise ermöglicht. Besonders die 1. und 2. Deklination zeigen sehr regelmäßige Muster. Der Nominativ Plural hat charakteristische Kennformen: -ae (1. Deklination), -i/-a (2. Deklination), -es (3., 4., 5. Deklination). Diese Endungen sind oft die ersten, die gelernt werden. Der Genitiv Plural ist besonders wichtig für die Syntax und zeigt deutliche Unterschiede: -arum, -orum, -um, -uum, -erum. Diese Endungen sind oft Deklinationskennzeichen. Der Ablativ Plural endet meist auf -is, was eine wichtige Vereinfachung darstellt. Nur die 1. und 2. Deklination zeigen hier Abweichungen. Neutra haben immer gleiche Endungen in Nominativ und Akkusativ Plural, was ein charakteristisches Merkmal der indogermanischen Sprachen ist. Einige Wörter haben unregelmäßige Pluralformen, die besonders bei häufig gebrauchten Substantiven zu beachten sind. Die Pluralbildung beeinflusst oft die Satzstruktur und ermöglicht komplexe syntaktische Konstruktionen.',
            rules: '1. Deklination: Nom. Pl. -ae, Gen. Pl. -arum, Dat./Abl. Pl. -is, Akk. Pl. -as. Beispiel: rosa → rosae, rosarum, rosis, rosas. 2. Deklination (Maskulina): Nom. Pl. -i, Gen. Pl. -orum, Dat./Abl. Pl. -is, Akk. Pl. -os. Beispiel: dominus → domini, dominorum, dominis, dominos. 2. Deklination (Neutra): Nom./Akk. Pl. -a, Gen. Pl. -orum, Dat./Abl. Pl. -is. Beispiel: bellum → bella, belli, bellis, bella. 3. Deklination: Nom. Pl. -es, Gen. Pl. -um, Dat./Abl. Pl. -ibus, Akk. Pl. -es. Beispiel: rex → reges, regum, regibus, reges. 4. Deklination: Nom. Pl. -us, Gen. Pl. -uum, Dat./Abl. Pl. -ibus, Akk. Pl. -us. Beispiel: manus → manus, manuum, manibus, manus. 5. Deklination: Nom. Pl. -es, Gen. Pl. -erum, Dat./Abl. Pl. -ebus, Akk. Pl. -es. Beispiel: res → res, rerum, rebus, res. Die 3. Deklination i-Stämme haben im Genitiv Plural die Endung -ium statt -um.',
            tables: [
                {
                    title: 'Pluralendungen',
                    headers: ['Deklination', 'Nom. Pl.', 'Gen. Pl.', 'Dat./Abl. Pl.', 'Akk. Pl.'],
                    rows: [
                        ['1. Dekl.', '-ae', '-arum', '-is', '-as'],
                        ['2. Dekl. (m)', '-i', '-orum', '-is', '-os'],
                        ['2. Dekl. (n)', '-a', '-orum', '-is', '-a'],
                        ['3. Dekl.', '-es', '-um', '-ibus', '-es'],
                        ['4. Dekl.', '-us', '-uum', '-ibus', '-us'],
                        ['5. Dekl.', '-es', '-erum', '-ebus', '-es']
                    ]
                }
            ]
        }
    }
];

export default function SubstantivePage() {
    const { topic } = useParams<{ topic: string }>();
    const navigate = useNavigate();

    if (!topic) {
        // Show overview of all substantive topics
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
                            Substantive
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
                                Substantive
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Die lateinischen Hauptwörter und ihre Eigenschaften. Wähle ein Thema zum Lernen:
                            </p>
                        </div>

                        {/* Topics Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {substantiveTopics.map((t, index) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card 
                                        className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-6 hover:border-primary/50 transition-all duration-500 group cursor-pointer h-full"
                                        onClick={() => navigate(`/learn/grammar/substantive/${t.id}`)}
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

    const currentTopic = substantiveTopics.find(t => t.id === topic);

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
                        onClick={() => navigate('/learn/grammar/substantive')}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück zu Substantiven
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                        <BookOpen className="w-4 h-4" />
                        Substantive
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
                                            {currentTopic.content.details}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="font-semibold text-xl">Wichtige Regeln:</h3>
                                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                                        <p className="text-lg leading-relaxed">
                                            {currentTopic.content.rules}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tables */}
                        {currentTopic.content.tables && currentTopic.content.tables.length > 0 && (
                            <Card className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                                <CardHeader>
                                    <CardTitle>Deklinationstabellen</CardTitle>
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
                                onClick={() => navigate('/learn/grammar/substantive')}
                                className="gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Zurück zu Substantiven
                            </Button>
                            
                            {(() => {
                                const currentIndex = substantiveTopics.findIndex(t => t.id === topic);
                                const nextTopic = currentIndex < substantiveTopics.length - 1 ? substantiveTopics[currentIndex + 1] : null;
                                
                                return nextTopic ? (
                                    <Button 
                                        onClick={() => navigate(`/learn/grammar/substantive/${nextTopic.id}`)}
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
