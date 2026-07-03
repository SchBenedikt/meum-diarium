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

const verbenTopics = [
    {
        id: 'konjugation',
        title: '1. Die vier Konjugationen',
        description: 'Grundlagen: Die Verbklassen und ihre Formen',
        content: {
            explanation: 'Das lateinische Konjugationssystem bildet das morphologische Rückgrat der lateinischen Verbflexion und gliedert sich in vier Hauptklassen, die sich nach der charakteristischen Endung des Infinitivs auf -re unterscheiden. Dieses System ermöglicht eine präzise Vorhersage aller Verbformen innerhalb jeder Konjugation und spiegelt die historische Entwicklung der lateinischen Sprache wider. Jede Konjugation hat spezifische Stammvokale und Endungsmuster, die für die korrekte Bildung aller Tempora, Modi und Diathesen fundamental sind.',
            details: 'Die 1. Konjugation mit dem Stammvokal -a ist die einheitlichste und regelmäßigste Klasse. Sie umfasst viele der häufigsten lateinischen Verben und ist ideal für die Einführung in die lateinische Konjugation. Die 2. Konjugation mit dem Stammvokal -e zeichnet sich durch ihre klare Systematik aus und bildet die Grundlage für viele abgeleitete Verben. Die 3. Konjugation ist die größte und heterogenste Klasse mit dem Stammvokal -e in kurzer Silbe. Sie enthält zahlreiche unregelmäßige Verben und besondere Bildungen. Die 4. Konjugation mit dem Stammvokal -i umfasst Verben, die oft von Adjektiven oder Substantiven abgeleitet sind und eine charakteristische i-Flexion aufweisen. Die Konjugationszugehörigkeit bestimmt nicht nur die Endungen, sondern auch die Bildung von Partizipien, Gerundien und Gerundiven. Besondere Verben wie esse (sein) und posse (können) bilden eigene unregelmäßige Muster, die als Hilfsverben fundamental für die lateinische Syntax sind. Deponentien und semideponentien folgen den Konjugationsmustern, haben aber passive Formen bei aktiver Bedeutung.',
            rules: [
                {
                    label: '1. Konjugation',
                    body: 'Stammvokal -a, Infinitiv -āre, 1. Pers. Sg. Präsens -ō. Regelmäßige Endungen in allen Personen.'
                },
                {
                    label: '2. Konjugation',
                    body: 'Stammvokal -e, Infinitiv -ēre, 1. Pers. Sg. Präsens -eō. Klare Systematik für abgeleitete Verben.'
                },
                {
                    label: '3. Konjugation',
                    body: 'Stammvokal -e in kurzer Silbe, Infinitiv -ere, 1. Pers. Sg. Präsens -ō. Komplex mit i-Stämmen und konsonantischen Stämmen.'
                },
                {
                    label: '4. Konjugation',
                    body: 'Stammvokal -i, Infinitiv -īre, 1. Pers. Sg. Präsens -iō. Charakteristische i-Flexion, oft von Adjektiven abgeleitet.'
                },
                {
                    label: 'Stammvokale',
                    body: 'Präsensstammvokale: -a- (1.), -e- (2.), -e- (3.), -i- (4.). Perfektstämme folgen eigenen Mustern, Supinstämme zeigen konjugationsspezifische Unterschiede.'
                }
            ],
            tables: [
                {
                    title: 'Die vier Konjugationen',
                    headers: ['Konjugation', 'Infinitiv', 'Stammvokal', '1. Pers. Sg.'],
                    rows: [
                        ['1.', '**āre**', '**-a-**', '**amō**'],
                        ['2.', '**ēre**', '**-e-**', '**moneō**'],
                        ['3.', '**ere**', '**-e-**', '**dicō**'],
                        ['4.', '**īre**', '**-i-**', '**audiō**']
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
            rules: [
                {
                    label: 'Präsens',
                    body: 'Vom Präsensstamm mit den Endungen -ō, -s, -t, -mus, -tis, -nt gebildet. Verwendung: Gegenwart.'
                },
                {
                    label: 'Imperfekt',
                    body: 'Vom Präsensstamm mit dem Infix -ba- und den gleichen Personalendungen gebildet. Verwendung: Vergangenheit.'
                },
                {
                    label: 'Futur I',
                    body: 'Durch charakteristische Endungen gebildet: -bō, -bis, -bit, -bimus, -bitis, -bunt (1./2. Konj.), -am, -ēs, -et, -ēmus, -ētis, -ent (3./4. Konj.). Verwendung: Zukunft.'
                },
                {
                    label: 'Perfekt',
                    body: 'Vom Perfektstamm gebildet, der auf -ī, -istī, -it, -imus, -istis, -ērunt/-ēre endet. Verwendung: Abgeschlossen.'
                },
                {
                    label: 'Plusquamperfekt',
                    body: 'Vom Perfektstamm mit dem Infix -ēra- und den Perfektendungen gebildet. Verwendung: Vorzeitig.'
                },
                {
                    label: 'Futur II',
                    body: 'Vom Perfektstamm mit dem Infix -ēri- und den Futur-Endungen gebildet. Verwendung: Zukünftig abgeschlossen.'
                }
            ],
            tables: [
                {
                    title: 'Die sechs Tempora',
                    headers: ['Tempus', 'System', 'Stamm', 'Bildung', 'Verwendung'],
                    rows: [
                        ['Präsens', '**Präsenssystem**', '**Präsensstamm**', '**Stamm + Endungen**', '**Gegenwart**'],
                        ['Imperfekt', '**Präsenssystem**', '**Präsensstamm**', '**Stamm + -ba-**', '**Vergangenheit**'],
                        ['Futur I', '**Präsenssystem**', '**Präsensstamm**', '**Futur-Endungen**', '**Zukunft**'],
                        ['Perfekt', '**Perfektsystem**', '**Perfektstamm**', '**Perfektstamm + Endungen**', '**Abgeschlossen**'],
                        ['Plusquamperfekt', '**Perfektsystem**', '**Perfektstamm**', '**Stamm + -ēra-**', '**Vorzeitig**'],
                        ['Futur II', '**Perfektsystem**', '**Perfektstamm**', '**Stamm + -ēri-**', '**Zukünftig abgeschlossen**']
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
            rules: [
                {
                    label: 'Indikativ',
                    body: 'Realis-Modus, drückt reale, tatsächliche Handlungen aus. Wird in allen Tempora und Personen gebildet. Grundlage für die meisten Aussagesätze.'
                },
                {
                    label: 'Konjunktiv Präsens',
                    body: 'Irrealis-Modus, drückt unreale, gewünschte, geforderte oder mögliche Handlungen aus. Wird in abhängigen Sätzen, bei indirekten Fragen, in Wunschsätzen verwendet. Endungen: -m, -s, -t, -mus, -tis, -nt (1. Konj.), -am, -ās, -at, -āmus, -ātis, -ant (andere Konj.).'
                },
                {
                    label: 'Konjunktiv Imperfekt',
                    body: 'Verwendet den Konjunktivstamm mit dem Infix -rē- und den Konjunktivendungen.'
                },
                {
                    label: 'Konjunktiv Perfekt',
                    body: 'Bildet sich vom Perfektstamm mit den Endungen -erim, -erīs, -erit, -erīmus, -erītis, -erint.'
                },
                {
                    label: 'Konjunktiv Plusquamperfekt',
                    body: 'Verwendet den Perfektstamm mit dem Infix -issē- und den Konjunktivendungen.'
                },
                {
                    label: 'Imperativ',
                    body: 'Befehlsformung, existiert nur in 2. Person Singular und Plural. Formen: -ā (2. Pers. Sg.) und -āte (2. Pers. Pl.) in der 1. Konjugation, -e und -ete in den anderen Konjugationen.'
                },
                {
                    label: 'Infinitiv Präsens',
                    body: 'Endet auf -āre, -ēre, -ere, -īre je nach Konjugation (unvollendet).'
                },
                {
                    label: 'Infinitiv Perfekt',
                    body: 'Endet auf -isse (abgeschlossen).'
                },
                {
                    label: 'Infinitiv Futur',
                    body: 'Endet auf -ūrus esse (zukünftig).'
                }
            ],
            tables: [
                {
                    title: 'Die Modi',
                    headers: ['Modus', 'Typ', 'Verwendung', 'Beispiel'],
                    rows: [
                        ['Indikativ', '**Finit**', '**Realität**', '**amo** - ich liebe'],
                        ['Konjunktiv', '**Finit**', '**Möglichkeit/Wunsch**', '**ut amem** - damit ich liebe'],
                        ['Imperativ', '**Finit**', '**Befehl**', '**ama** - liebe!'],
                        ['Infinitiv', '**Infinit**', '**Objekt/Nebensatz**', '**amare** - zu lieben'],
                        ['Partizip', '**Infinit**', '**Attribut**', '**amans** - liebend']
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
            rules: [
                {
                    label: 'Aktiv Präsens',
                    body: 'Wird mit den Endungen -ō, -s, -t, -mus, -tis, -nt gebildet.'
                },
                {
                    label: 'Passiv Präsens',
                    body: 'Verwendet die charakteristischen Passivendungen -or, -ris, -tur, -mur, -minī, -ntur.'
                },
                {
                    label: 'Aktiv Imperfekt',
                    body: 'Hat die Endungen -bam, -bās, -bat, -bāmus, -bātis, -bant.'
                },
                {
                    label: 'Passiv Imperfekt',
                    body: 'Verwendet -bar, -bāris, -bātur, -bāmur, -bāminī, -bantur.'
                },
                {
                    label: 'Aktiv Perfekt',
                    body: 'Endet auf -ī, -istī, -it, -imus, -istis, -ērunt/-ēre.'
                },
                {
                    label: 'Passiv Perfekt',
                    body: 'Wird als periphrastische Form mit Partizip Perfekt Passiv und esse gebildet: amatus sum, amatus es, amatus est usw.'
                },
                {
                    label: 'Aktiv Futur I',
                    body: 'Bildet -bō, -bis, -bit, -bimus, -bitis, -bunt (1./2. Konj.) bzw. -am, -ēs, -et, -ēmus, -ētis, -ent (3./4. Konj.).'
                },
                {
                    label: 'Passiv Futur I',
                    body: 'Verwendet -bor, -beris, -bitur, -bimur, -biminī, -buntur.'
                },
                {
                    label: 'Aktiv Futur II',
                    body: 'Bildet -erō, -eris, -erit, -erimus, -eritis, -erint.'
                },
                {
                    label: 'Passiv Futur II',
                    body: 'Wird als periphrastische Form mit Partizip Futur Aktiv und esse gebildet: amatus erō, amatus eris, amatus erit usw.'
                }
            ],
            tables: [
                {
                    title: 'Aktiv und Passiv',
                    headers: ['Tempus', 'Aktiv', 'Passiv', 'Beispiel'],
                    rows: [
                        ['Präsens', '**amo**', '**amor**', '**amo/amor**'],
                        ['Imperfekt', '**amabam**', '**amabar**', '**amabam/amabar**'],
                        ['Futur I', '**amabo**', '**abor**', '**amabor**'],
                        ['Perfekt', '**amavi**', '**amatus sum**', '**amavi/amatus sum**'],
                        ['Plusquamperfekt', '**amaveram**', '**amatus eram**', '**amaveram/amatus eram**'],
                        ['Futur II', '**amavero**', '**amatus ero**', '**amavero/amatus ero**']
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
                                    <DetailsList text={currentTopic.content.details} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-4">Regeln & Merkmale</p>
                                    <RuleCards text={currentTopic.content.rules} />
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
