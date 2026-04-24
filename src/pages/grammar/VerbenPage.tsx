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

const verbenTopics = [
    {
        id: 'konjugation',
        title: '1. Die vier Konjugationen',
        description: 'Grundlagen: Die Verbklassen und ihre Formen',
        content: {
            explanation: 'Das lateinische Konjugationssystem bildet das morphologische Rückgrat der lateinischen Verbflexion und gliedert sich in vier Hauptklassen, die sich nach der charakteristischen Endung des Infinitivs auf -re unterscheiden. Dieses System ermöglicht eine präzise Vorhersage aller Verbformen innerhalb jeder Konjugation und spiegelt die historische Entwicklung der lateinischen Sprache wider. Jede Konjugation hat spezifische Stammvokale und Endungsmuster, die für die korrekte Bildung aller Tempora, Modi und Diathesen fundamental sind.',
            details: 'Die 1. Konjugation mit dem Stammvokal -a ist die einheitlichste und regelmäßigste Klasse. Sie umfasst viele der häufigsten lateinischen Verben und ist ideal für die Einführung in die lateinische Konjugation. Die 2. Konjugation mit dem Stammvokal -e zeichnet sich durch ihre klare Systematik aus und bildet die Grundlage für viele abgeleitete Verben. Die 3. Konjugation ist die größte und heterogenste Klasse mit dem Stammvokal -e in kurzer Silbe. Sie enthält zahlreiche unregelmäßige Verben und besondere Bildungen. Die 4. Konjugation mit dem Stammvokal -i umfasst Verben, die oft von Adjektiven oder Substantiven abgeleitet sind und eine charakteristische i-Flexion aufweisen. Die Konjugationszugehörigkeit bestimmt nicht nur die Endungen, sondern auch die Bildung von Partizipien, Gerundien und Gerundiven. Besondere Verben wie esse (sein) und posse (können) bilden eigene unregelmäßige Muster, die als Hilfsverben fundamental für die lateinische Syntax sind. Deponentien und semideponentien folgen den Konjugationsmustern, haben aber passive Formen bei aktiver Bedeutung.',
            rules: 'Die 1. Konjugation bildet ihre Formen mit dem Stammvokal -a, was zu regelmäßigen Endungen in allen Personen führt. Der Infinitiv endet auf -āre und die 1. Person Singular Präsens auf -ō. Die 2. Konjugation verwendet den Stammvokal -e, was sich im Infinitiv auf -ēre und in der 1. Person Singular auf -eō zeigt. Die 3. Konjugation ist komplexer, da hier zwischen i-Stämmen und konsonantischen Stämmen unterschieden werden muss. Der Infinitiv endet auf -ere und die 1. Person Singular auf -ō, aber der Stammvokal kann variieren. Die 4. Konjugation mit dem Stammvokal -i zeigt den Infinitiv auf -īre und die 1. Person Singular auf -iō. Die Konjugation bestimmt die Präsensstammform mit den charakteristischen Stammvokalen -a-, -e-, -e-, -i-. Perfektstämme folgen eigenen Mustern, die nicht immer mit der Konjugationszugehörigkeit übereinstimmen. Supinstämme zeigen ebenfalls konjugationsspezifische Unterschiede mit den Endungen -re für die 1. und 2., -sī für die 3. und -tum für die 4. Konjugation.',
            tables: [
                {
                    title: 'Die vier Konjugationen',
                    headers: ['Konjugation', 'Infinitiv', 'Stammvokal', '1. Pers. Sg.'],
                    rows: [
                        ['1.', '-āre', '-a-', 'amō'],
                        ['2.', '-ēre', '-e-', 'moneō'],
                        ['3.', '-ere', '-e-', 'dicō'],
                        ['4.', '-īre', '-i-', 'audiō']
                    ]
                }
            ]
        }
    },
    {
        id: 'tempora',
        title: '2. Die sechs Zeitformen',
        description: 'Grundlagen: Präsens, Imperfekt, Futur, Perfekt, Plusquamperfekt, Futur II',
        content: {
            explanation: 'Das lateinische Zeitsystem ist bemerkenswert komplex und präzise, unterteilt in zwei fundamentale Systeme: das Präsensystem für nicht-abgeschlossene und das Perfektsystem für abgeschlossene Handlungen. Diese Zweiteilung ermöglicht eine nuancierte Darstellung von zeitlichen Beziehungen, die weit über die deutschen Tempora hinausgeht. Jedes System umfasst drei Hauptzeitformen, die durch charakteristische Bildungsweisen und spezifische Verwendungskontexte definiert sind.',
            details: 'Das Präsensystem umfasst das Präsens für gegenwärtige oder allgemeingültige Handlungen, das Imperfekt für vergangene, nicht abgeschlossene oder wiederholte Handlungen, sowie das Futur I für zukünftige Handlungen. Das Perfektsystem besteht aus dem Perfekt für abgeschlossene Handlungen in der Vergangenheit, dem Plusquamperfekt für vorzeitige abgeschlossene Handlungen und dem Futur II für zukünftig abgeschlossene Handlungen. Die Bildung dieser Tempora folgt systematischen Mustern: das Präsenssystem verwendet den Präsensstamm mit charakteristischen Endungen, während das Perfektsystem auf dem Perfektstamm basiert. Besonders wichtig ist die Unterscheidung zwischen systematischen und unsystematischen Perfektbildungen, die oft die Konjugationszugehörigkeit eines Verbes verraten.',
            rules: 'Das Präsens wird vom Präsensstamm mit den Endungen -ō, -s, -t, -mus, -tis, -nt gebildet. Das Imperfekt verwendet den Präsensstamm mit dem Infix -ba- und den gleichen Personalendungen. Das Futur I bildet sich durch charakteristische Endungen: -bō, -bis, -bit, -bimus, -bitis, -bunt in der 1. und 2. Konjugation, bzw. -am, -ēs, -et, -ēmus, -ētis, -ent in der 3. und 4. Konjugation. Das Perfekt wird vom Perfektstamm gebildet, der auf -ī, -istī, -it, -imus, -istis, -ērunt/-ēre endet. Das Plusquamperfekt verwendet den Perfektstamm mit dem Infix -ēra- und den Perfektendungen. Das Futur II bildet sich mit dem Perfektstamm und dem Infix -ēri- sowie den Futur-Endungen. Bei unregelmäßigen Verben wie esse und posse folgen diese Bildungen eigenen Mustern, die auswendig gelernt werden müssen.',
            tables: [
                {
                    title: 'Die sechs Tempora',
                    headers: ['Tempus', 'System', 'Stamm', 'Bildung', 'Verwendung'],
                    rows: [
                        ['Präsens', 'Präsenssystem', 'Präsensstamm', 'Stamm + Endungen', 'Gegenwart'],
                        ['Imperfekt', 'Präsenssystem', 'Präsensstamm', 'Stamm + -ba-', 'Vergangenheit'],
                        ['Futur I', 'Präsenssystem', 'Präsensstamm', 'Futur-Endungen', 'Zukunft'],
                        ['Perfekt', 'Perfektsystem', 'Perfektstamm', 'Perfektstamm + Endungen', 'Abgeschlossen'],
                        ['Plusquamperfekt', 'Perfektsystem', 'Perfektstamm', 'Stamm + -ēra-', 'Vorzeitig'],
                        ['Futur II', 'Perfektsystem', 'Perfektstamm', 'Stamm + -ēri-', 'Zukünftig abgeschlossen']
                    ]
                }
            ]
        }
    },
    {
        id: 'modi',
        title: '3. Die drei Modi',
        description: 'Grundlagen: Indikativ, Konjunktiv, Imperativ',
        content: {
            explanation: 'Das lateinische Modussystem ermöglicht eine differenzierte Darstellung der Sprecherhaltung zur ausgedrückten Handlung. Neben den drei Hauptmodi Indikativ, Konjunktiv und Imperativ existieren weitere Modi wie Infinitiv und Partizip, die als infinite Verbformen fungieren. Jeder Modus hat spezifische Verwendungskontexte und bildungsmäßige Besonderheiten, die für die korrekte lateinische Syntax fundamental sind.',
            details: 'Der Indikativ als Realis drückt reale, tatsächliche Handlungen aus und ist der am häufigsten verwendete Modus. Er wird in allen Tempora und Personen gebildet und dient als Grundlage für die meisten Aussagesätze. Der Konjunktiv als Irrealis drückt unreale, gewünschte, geforderte oder mögliche Handlungen aus und hat zahlreiche syntaktische Funktionen. Er wird in abhängigen Sätzen, bei indirekten Fragen, in Wunschsätzen und in vielen anderen Kontexten verwendet. Der Imperativ dient zur Befehlsformung und existiert nur in 2. Person Singular und Plural. Die infinite Verbformen umfassen Infinitiv, Gerundium, Gerundivum und Partizipien, die als Verbalnomina oder Verbaladjektive fungieren und komplexe Satzkonstruktionen ermöglichen.',
            rules: 'Der Indikativ folgt den regulären Konjugationsmustern in allen Tempora. Der Konjunktiv Präsens wird mit charakteristischen Endungen gebildet: -m, -s, -t, -mus, -tis, -nt in der 1. Konjugation, bzw. -am, -ās, -at, -āmus, -ātis, -ant in den anderen Konjugationen. Der Konjunktiv Imperfekt verwendet den Konjunktivstamm mit dem Infix -rē- und den Konjunktivendungen. Der Konjunktiv Perfekt bildet sich vom Perfektstamm mit den Endungen -erim, -erīs, -erit, -erīmus, -erītis, -erint. Der Konjunktiv Plusquamperfekt verwendet den Perfektstamm mit dem Infix -issē- und den Konjunktivendungen. Der Imperativ hat die Formen -ā (2. Pers. Sg.) und -āte (2. Pers. Pl.) in der 1. Konjugation, bzw. -e und -ete in den anderen Konjugationen. Der Infinitiv Präsens endet auf -āre, -ēre, -ere, -īre je nach Konjugation, während der Infinitiv Perfekt auf -isse und der Infinitiv Futur auf -ūrus esse endet.',
            tables: [
                {
                    title: 'Die Modi',
                    headers: ['Modus', 'Typ', 'Verwendung', 'Beispiel'],
                    rows: [
                        ['Indikativ', 'Finit', 'Realität', 'amo - ich liebe'],
                        ['Konjunktiv', 'Finit', 'Möglichkeit/Wunsch', 'ut amem - damit ich liebe'],
                        ['Imperativ', 'Finit', 'Befehl', 'ama - liebe!'],
                        ['Infinitiv', 'Infinit', 'Objekt/Nebensatz', 'amare - zu lieben'],
                        ['Partizip', 'Infinit', 'Attribut', 'amans - liebend']
                    ]
                }
            ]
        }
    },
    {
        id: 'aktivpassiv',
        title: '4. Aktiv und Passiv',
        description: 'Grundlagen: Die Handlungsrichtungen und ihre Formen',
        content: {
            explanation: 'Das lateinische Diathesensystem unterscheidet zwischen Aktiv und Passiv als grundlegende Handlungsrichtungen. Das Aktiv drückt aus, dass das Subjekt die Handlung ausführt, während das Passiv ausdrückt, dass das Subjekt die Handlung erleidet. Diese Unterscheidung wird nicht nur durch verschiedene Endungen, sondern auch durch unterschiedliche Bildungsmuster in den verschiedenen Tempora und Modi realisiert.',
            details: 'Das Aktiv ist die grundlegende Diathese und wird in allen Konjugationen regelmäßig gebildet. Die Endungen folgen den bekannten Mustern -ō, -s, -t, -mus, -tis, -nt im Präsens und entsprechenden Formen in anderen Tempora. Das Passiv wird im Präsenssystem durch charakteristische Passivendungen gebildet: -or, -ris, -tur, -mur, -minī, -ntur. Im Perfektsystem verwendet das Passiv die Formen des Hilfsverbs esse mit dem Partizip Perfekt Passiv. Besonders wichtig ist die Unterscheidung zwischen transitiven und intransitiven Verben, da nur transitive Verben ein echtes Passiv bilden können. Deponentien stellen eine besondere Klasse dar, da sie passive Formen bei aktiver Bedeutung verwenden.',
            rules: 'Das Aktiv Präsens wird mit den Endungen -ō, -s, -t, -mus, -tis, -nt gebildet. Das Passiv Präsens verwendet -or, -ris, -tur, -mur, -minī, -ntur. Das Aktiv Imperfekt hat die Endungen -bam, -bās, -bat, -bāmus, -bātis, -bant, während das Passiv Imperfekt -bar, -bāris, -bātur, -bāmur, -bāminī, -bantur verwendet. Das Aktiv Perfekt endet auf -ī, -istī, -it, -imus, -istis, -ērunt/-ēre. Das Passiv Perfekt wird als periphrastische Form mit Partizip Perfekt Passiv und esse gebildet: amatus sum, amatus es, amatus est usw. Das Aktiv Futur I bildet -bō, -bis, -bit, -bimus, -bitis, -bunt (1./2. Konj.) bzw. -am, -ēs, -et, -ēmus, -ētis, -ent (3./4. Konj.). Das Passiv Futur I verwendet -bor, -beris, -bitur, -bimur, -biminī, -buntur. Das Futur II Aktiv bildet -erō, -eris, -erit, -erimus, -eritis, -erint, während das Passiv Futur II als periphrastische Form mit Partizip Futur Aktiv und esse gebildet wird: amatus erō, amatus eris, amatus erit usw.',
            tables: [
                {
                    title: 'Aktiv und Passiv',
                    headers: ['Tempus', 'Aktiv', 'Passiv', 'Beispiel'],
                    rows: [
                        ['Präsens', 'amo', 'amor', 'amo/amor'],
                        ['Imperfekt', 'amabam', 'amabar', 'amabam/amabar'],
                        ['Futur I', 'amabo', 'abor', 'amabor'],
                        ['Perfekt', 'amavi', 'amatus sum', 'amavi/amatus sum'],
                        ['Plusquamperfekt', 'amaveram', 'amatus eram', 'amaveram/amatus eram'],
                        ['Futur II', 'amavero', 'amatus ero', 'amavero/amatus ero']
                    ]
                }
            ]
        }
    }
];

export default function VerbenPage() {
    const { topic } = useParams<{ topic: string }>();
    const navigate = useNavigate();

    if (!topic) {
        // Show overview of all verb topics
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
                            Verben
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
                                Verben
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Die lateinischen Verben und ihre Eigenschaften. Wähle ein Thema zum Lernen:
                            </p>
                        </div>

                        {/* Topics Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {verbenTopics.map((t, index) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card 
                                        className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-6 hover:border-primary/50 transition-all duration-500 group cursor-pointer h-full"
                                        onClick={() => navigate(`/learn/grammar/verben/${t.id}`)}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                                                {t.title}
                                            </h3>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.description}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(t.topics ?? []).slice(0, 3).map(sub => (
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

    const currentTopic = verbenTopics.find(t => t.id === topic);

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
                        onClick={() => navigate('/learn/grammar/verben')}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück zu Verben
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                        <BookOpen className="w-4 h-4" />
                        Verben
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
                                    <CardTitle>Konjugationstabellen</CardTitle>
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
                                onClick={() => navigate('/learn/grammar/verben')}
                                className="gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Zurück zu Verben
                            </Button>
                            
                            {(() => {
                                const currentIndex = verbenTopics.findIndex(t => t.id === topic);
                                const nextTopic = currentIndex < verbenTopics.length - 1 ? verbenTopics[currentIndex + 1] : null;
                                
                                return nextTopic ? (
                                    <Button 
                                        onClick={() => navigate(`/learn/grammar/verben/${nextTopic.id}`)}
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
