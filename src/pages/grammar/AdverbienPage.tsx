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

const adverbienTopics = [
    {
        id: 'adverbarten',
        title: '1. Adverbarten',
        description: 'Grundlagen: Ort, Zeit, Art und Weise',
        content: {
            explanation: 'Die lateinischen Adverbien bilden eine vielfältige Wortart, die zur Modifizierung von Verben, Adjektiven und anderen Adverbien dient. Im Gegensatz zum Deutschen unterscheidet das Lateinische weniger formale Adverbklassen, sondern gliedert die Adverbien nach ihrer semantischen Funktion und ihrer Bildungsweise. Die meisten lateinischen Adverbien werden von Adjektiven abgeleitet, aber es gibt auch zahlreiche primäre Adverbien, die nicht auf andere Wortarten zurückzuführen sind.',
            details: 'Die Adverbien lassen sich nach ihrer semantischen Funktion in mehrere Hauptgruppen einteilen: Adverbien des Ortes (ubi, ibi, illic), der Zeit (nunc, tunc, semper), der Art und Weise (bene, male, sic), der Ursache (ideo, propter), des Grades (valde, multum, parum) und der Bejahung/Verneinung (ita, non, minime). Die Bildungsweise der Adverbien folgt systematischen Mustern: Adjektive der a/o-Deklination bilden Adverbien auf -ē (bonus → bene, clarus → clare), Adjektive der 3. Deklination auf -iter (fortis → fortiter, felix → feliciter), und einige Adjektive auf -ter (celer → celeriter). Die primären Adverbien wie hic, nunc, iam, non sind nicht von anderen Wortarten abgeleitet und müssen einzeln gelernt werden.',
            rules: 'Die Bildung der Adverbien von Adjektiven der a/o-Deklination erfolgt durch die Endung -ē: bonus → bene (gut), malus → male (schlecht), clarus → clare (deutlich), magnus → magnopere (sehr). Die Adjektive der 3. Deklination bilden Adverbien auf -iter: fortis → fortiter (tapfer), felix → feliciter (glücklich), prudens → prudenter (klug). Einige Adjektive auf -er bilden Adverbien auf -ter: celer → celeriter (schnell), pulcher → pulchre (schön). Die Steigerung der Adverbien erfolgt durch die Endungen -ius (Komparativ) und -issime/-e (Superlativ): bene → melius → optime, male → peius → pessime, fortiter → fortius → fortissime. Die unregelmäßigen Steigerungen müssen auswendig gelernt werden: multum → plus → plurimum, paulum → minus → minimum.',
            tables: [
                {
                    title: 'Adverbbildung von Adjektiven',
                    headers: ['Adjektiv', 'Bedeutung', 'Adverb', 'Bedeutung', 'Bildungstyp'],
                    rows: [
                        ['bonus, -a, -um', 'gut', 'bene', 'gut', 'a/o-Deklination'],
                        ['malus, -a, -um', 'schlecht', 'male', 'schlecht', 'a/o-Deklination'],
                        ['clarus, -a, -um', 'deutlich', 'clare', 'deutlich', 'a/o-Deklination'],
                        ['fortis, -e', 'tapfer', 'fortiter', 'tapfer', '3. Deklination'],
                        ['felix, -icis', 'glücklich', 'feliciter', 'glücklich', '3. Deklination'],
                        ['prudens, -ntis', 'klug', 'prudenter', 'klug', '3. Deklination'],
                        ['celer, -eris', 'schnell', 'celeriter', 'schnell', 'Adjektiv auf -er'],
                        ['pulcher, -ra, -rum', 'schön', 'pulchre', 'schön', 'Adjektiv auf -er']
                    ]
                }
            ]
        }
    },
    {
        id: 'steigerung',
        title: '2. Adverbsteigerung',
        description: 'Grundlagen: Komparativ und Superlativ',
        content: {
            explanation: 'Das lateinische Adverbsteigerungssystem ermöglicht eine präzise Ausdrucksmöglichkeit für graduelle Unterschiede und Vergleiche. Die Steigerung folgt systematischen morphologischen Mustern, die eng mit der Adjektivsteigerung verwandt sind. Die Adverbsteigerung ist fundamental für die lateinische Rhetorik und ermöglicht nuancierte Ausdrucksformen für Intensität und Vergleich.',
            details: 'Die Adverbsteigerung erfolgt durch charakteristische Suffixe, die von der Bildung des Adjektivs abhängen. Die meisten Adverbien bilden den Komparativ mit der Endung -ius und den Superlativ mit -issime oder -e. Die regelmäßige Steigerung folgt dem Muster: bene → melius → optime (gut → besser → am besten), male → peius → pessime (schlecht → schlechter → am schlechtesten), fortiter → fortius → fortissime (tapfer → tapferer → am tapfersten). Bei Adverbien, die von Adjektiven der 3. Deklination abgeleitet sind, lautet der Superlativ oft auf -e statt -issime: prudenter → prudenter → prudentissime oder prudente.',
            rules: 'Die regelmäßige Adverbsteigerung erfolgt durch die Endungen -ius (Komparativ) und -issime/-e (Superlativ): bene → melius → optime, clare → clarius → clarissime, fortiter → fortius → fortissime, feliciter → feliciter → felicissime. Die unregelmäßigen Steigerungen müssen einzeln gelernt werden: multum → plus → plurimum (viel → mehr → am meisten), paulum → minus → minimum (wenig → weniger → am wenigsten), saepe → saepius → saepissime (oft → öfter → am häufigsten), diu → diutius → diutissime (lange → länger → am längsten). Die Adverbien auf -e bilden den Superlativ oft auf -e: facile → facilius → facillime/facile, facile → facilius → facillime. Die Steigerungsformen werden wie Adjektive dekliniert, wenn sie als Attribute verwendet werden, aber unverändert, wenn sie adverbiell gebraucht werden.',
            tables: [
                {
                    title: 'Adverbsteigerungen - Übersicht',
                    headers: ['Positiv', 'Komparativ', 'Superlativ', 'Bedeutung', 'Besonderheiten'],
                    rows: [
                        ['bene', 'melius', 'optime', 'gut → besser → am besten', 'Unregelmäßig'],
                        ['male', 'peius', 'pessime', 'schlecht → schlechter → am schlechtesten', 'Unregelmäßig'],
                        ['multum', 'plus', 'plurimum', 'viel → mehr → am meisten', 'Unregelmäßig'],
                        ['paulum', 'minus', 'minimum', 'wenig → weniger → am wenigsten', 'Unregelmäßig'],
                        ['clare', 'clarius', 'clarissime', 'deutlich → deutlicher → am deutlichsten', 'Regelmäßig'],
                        ['fortiter', 'fortius', 'fortissime', 'tapfer → tapferer → am tapfersten', 'Regelmäßig'],
                        ['feliciter', 'feliciter', 'felicissime', 'glücklich → glücklicher → am glücklichsten', 'Regelmäßig'],
                        ['saepe', 'saepius', 'saepissime', 'oft → öfter → am häufigsten', 'Regelmäßig']
                    ]
                }
            ]
        }
    },
    {
        id: 'bildung',
        title: '3. Adverbbildung',
        description: 'Grundlagen: Bildung aus Adjektiven',
        content: {
            explanation: 'Die lateinische Adverbbildung folgt systematischen morphologischen Prinzipien, die es ermöglichen, aus Adjektiven und anderen Wortarten Adverbien zu bilden. Diese Bildungsweisen sind nicht nur für die aktive Sprachverwendung wichtig, sondern auch für das Verständnis der Wortbildungsprozesse und etymologischen Zusammenhänge in der lateinischen Sprache.',
            details: 'Die produktivste Bildungsweise ist die Ableitung von Adjektiven. Adjektive der a/o-Deklination bilden Adverbien auf -ē durch Anfügen an den Adjektivstamm: bonus → bene, malus → male, clarus → clare. Diese Bildungsweise ist die häufigste und regelmäßigste. Adjektive der 3. Deklination bilden Adverbien auf -iter durch Anfügen an den Stamm: fortis → fortiter, felix → feliciter, prudens → prudenter. Eine besondere Gruppe bilden die Adjektive auf -er, die Adverbien auf -ter oder -tere bilden: celer → celeriter, pulcher → pulchre. Neben diesen abgeleiteten Adverbien gibt es zahlreiche primäre Adverbien wie hic (hier), nunc (nun), iam (jetzt), non (nicht), ita (so), die nicht von anderen Wortarten abgeleitet sind.',
            rules: 'Die Adverbbildung von Adjektiven der a/o-Deklination erfolgt durch die Endung -ē: bonus → bene, malus → male, clarus → clare, magnus → magnopere, parvus → parum. Die Adjektive der 3. Deklination bilden Adverbien auf -iter: fortis → fortiter, felix → feliciter, prudens → prudenter, audax → audacter. Adjektive auf -er bilden Adverbien auf -ter oder -tere: celer → celeriter, pulcher → pulchre, ruber → rubere. Einige Adjektive bilden Adverbien auf -im: facilis → facile, similis → simile. Die primären Adverbien sind nicht abgeleitet und müssen einzeln gelernt werden: Lokaladverbien (ubi, ibi, illic, hic, illic), Temporaladverbien (nunc, tunc, semper, saepe, iam), Modaladverbien (bene, male, sic, ita), Quantitätsadverbien (multum, paulum, nimis), Negationsadverbien (non, minime, haud).',
            tables: [
                {
                    title: 'Systematische Adverbbildung',
                    headers: ['Wortart', 'Bildungsmuster', 'Beispiele', 'Anmerkungen'],
                    rows: [
                        ['Adjektive a/o-Dekl.', 'Stamm + -ē', 'bonus → bene, clarus → clare', 'Häufigste Bildungsweise'],
                        ['Adjektive 3. Dekl.', 'Stamm + -iter', 'fortis → fortiter, felix → feliciter', 'Regelmäßige Ableitung'],
                        ['Adjektive auf -er', 'Stamm + -ter/-tere', 'celer → celeriter, pulcher → pulchre', 'Besondere Formen'],
                        ['Adjektive auf -lis', 'Stamm + -im', 'facilis → facile, similis → simile', 'Seltene Bildungsweise'],
                        ['Primäre Adverbien', 'Nicht abgeleitet', 'hic, nunc, non, ita', 'Müssen einzeln gelernt werden'],
                        ['Komparativadjektive', 'Stamm + -ē', 'melior → melius, peior → peius', 'Von Komparativ abgeleitet'],
                        ['Zahlwörter', 'Spezielle Formen', 'semel, bis, ter', 'Häufigkeitsadverbien'],
                        ['Partizipien', 'Spezielle Formen', 'frequens → frequenter', 'Von Partizipien abgeleitet']
                    ]
                }
            ]
        }
    }
];

export default function AdverbienPage() {
    const { topic } = useParams<{ topic: string }>();
    const navigate = useNavigate();

    if (!topic) {
        // Show overview of all adverb topics
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
                            Adverbien
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
                                Adverbien
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Die lateinischen Umstandswörter und ihre Bildung. Wähle ein Thema zum Lernen:
                            </p>
                        </div>

                        {/* Topics Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {adverbienTopics.map((t, index) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card 
                                        className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-6 hover:border-primary/50 transition-all duration-500 group cursor-pointer h-full"
                                        onClick={() => navigate(`/learn/grammar/adverbien/${t.id}`)}
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

    const currentTopic = adverbienTopics.find(t => t.id === topic);

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
                        onClick={() => navigate('/learn/grammar/adverbien')}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück zu Adverbien
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                        <BookOpen className="w-4 h-4" />
                        Adverbien
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
                                    <DetailsList text={Array.isArray(currentTopic.content.details) ? currentTopic.content.details.join(' ') : currentTopic.content.details} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-3">Regeln & Merkmale</p>
                                    <RuleCards text={Array.isArray(currentTopic.content.rules) ? currentTopic.content.rules.join(' ') : currentTopic.content.rules} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tables */}
                        {currentTopic.content.tables && currentTopic.content.tables.length > 0 && (
                            <Card className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8">
                                <CardHeader>
                                    <CardTitle>Adverbtabellen</CardTitle>
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
