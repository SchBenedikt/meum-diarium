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

const pronomenTopics = [
    {
        id: 'personalpronomen',
        title: '1. Personalpronomen',
        description: 'Grundlagen: ego, tu, is/ea/id',
        content: {
            explanation: 'Die lateinischen Personalpronomen bilden das Fundament der persönlichen Referenz in der lateinischen Sprache. Im Gegensatz zum Deutschen werden sie im Lateinischen seltener verwendet, da die Verbendungen oft bereits die Person deutlich machen. Dennoch sind sie für die klare Kommunikation und rhetorische Wirkung unerlässlich. Die Personalpronomen haben besondere Deklinationsmuster, die von den regulären Substantivdeklinationen abweichen und spezifische Besonderheiten aufweisen.',
            details: 'Das Pronomen der 1. Person ego (ich) zeigt eine unregelmäßige Deklination mit der charakteristischen Formenreihe ego, mei, mihi, me, me im Singular. Die Pluralformen nos, nostri, nobis, nos, nos sind regelmäßiger. Das Pronomen der 2. Person tu (du) folgt einem ähnlichen Muster: tu, tui, tibi, te, te im Singular und vos, vestri, vobis, vos, vos im Plural. Das Pronomen der 3. Person is, ea, id (er, sie, es) ist besonders wichtig, da es auch als Demonstrativpronomen und Relativpronomen verwendet wird. Seine Deklination folgt der 3. Deklination mit i-Stamm-Charakter: is, eius, ei, eum, eo im Singular und ei/i, eorum, eis, eos, eis im Plural.',
            rules: 'Die Deklination von ego folgt dem Muster: Nominativ ego, Genitiv mei/eius, Dativ mihi, Akkusativ me, Ablativ me. Der Genitiv mei wird selten verwendet, stattdessen oft eius. Die Deklination von tu: Nominativ tu, Genitiv tui, Dativ tibi, Akkusativ te, Ablativ te. Die Deklination von is, ea, id: Maskulinum is, eius, ei, eum, eo; Femininum ea, eius, ei, eam, ea; Neutrum id, eius, ei, id, eo. Im Plural: Maskulinum ei/i, eorum, eis, eos, eis; Femininum eae, earum, eis, eas, eis; Neutrum ea, eorum, eis, ea, eis. Besonderheiten: Der Dativ mihi und tibi ist unregelmäßig. Der Genitiv mei und tui wird selten verwendet. Die Formen ei und i im Nominativ/Akkusativ Plural Maskulinum sind austauschbar.',
            tables: [
                {
                    title: 'Personalpronomen',
                    headers: ['Kasus', 'ego (ich)', 'tu (du)', 'is (er)', 'ea (sie)', 'id (es)'],
                    rows: [
                        ['Nom.', 'ego', 'tu', 'is', 'ea', 'id'],
                        ['Gen.', 'mei', 'tui', 'eius', 'eius', 'eius'],
                        ['Dat.', 'mihi', 'tibi', 'ei', 'ei', 'ei'],
                        ['Akk.', 'me', 'te', 'eum', 'eam', 'id'],
                        ['Abl.', 'me', 'te', 'eo', 'ea', 'eo']
                    ]
                }
            ]
        }
    },
    {
        id: 'possessivpronomen',
        title: '2. Possessivpronomen',
        description: 'Grundlagen: meus, tuus, suus, noster, vester',
        content: {
            explanation: 'Die lateinischen Possessivpronomen drücken Besitz oder Zugehörigkeit aus und folgen den Mustern der Adjektivdeklination. Sie müssen in Genus, Numerus und Kasus mit dem Substantiv übereinstimmen, auf das sie sich beziehen. Eine wichtige Besonderheit ist die Unterscheidung zwischen suus (sein/eigen) und eius/earum (sein/ihr), die je nach Referenzrichtung unterschiedlich verwendet werden.',
            details: 'Die Possessivpronomen der 1. und 2. Person (meus, tuus, noster, vester) folgen der a/o-Deklination der Adjektive. Meus (mein) hat die Formen meus, mei, meo, meum, meo im Singular und mei, meorum, meis, meos, meis im Plural. Tuus (dein) folgt dem gleichen Muster. Noster (unser) und vester (euer) haben ebenfalls diese regelmäßige Deklination. Das Possessivpronomen der 3. Person suus (sein/eigen) bezieht sich immer auf das Subjekt des Satzes und folgt ebenfalls der a/o-Deklination. Wenn die Zugehörigkeit nicht auf das Subjekt bezogen ist, wird eius (sein) oder earum (ihr) verwendet, die als Genitive von is, ea, id fungieren.',
            rules: 'Die Deklination von meus: Maskulinum meus, mei, meo, meum, meo; Femininum mea, meae, meae, meam, mea; Neutrum meum, mei, meo, meum, meo. Im Plural: Maskulinum mei, meorum, meis, meos, meis; Femininum meae, mearum, meis, meas, meis; Neutrum mea, meorum, meis, mea, meis. Tuus, noster und vester folgen dem gleichen Muster. Suus wird verwendet, wenn sich das Besitzverhältnis auf das Subjekt bezieht: Marcus librum suum legit (Marcus liest sein eigenes Buch). Eius wird verwendet, wenn sich das Besitzverhältnis auf ein anderes Subjekt bezieht: Marcus librum eius legit (Marcus liest sein Buch [das eines anderen]).',
            tables: [
                {
                    title: 'Possessivpronomen',
                    headers: ['Kasus', 'meus (mein)', 'tuus (dein)', 'suus (sein/eigen)', 'noster (unser)', 'vester (euer)'],
                    rows: [
                        ['Nom.', 'meus', 'tuus', 'suus', 'noster', 'vester'],
                        ['Gen.', 'mei', 'tui', 'sui', 'nostri', 'vestri'],
                        ['Dat.', 'meo', 'tuo', 'suo', 'nostro', 'vestro'],
                        ['Akk.', 'meum', 'tuum', 'suum', 'nostrum', 'vestrum'],
                        ['Abl.', 'meo', 'tuo', 'suo', 'nostro', 'vestro']
                    ]
                }
            ]
        }
    },
    {
        id: 'demonstrativpronomen',
        title: '3. Demonstrativpronomen',
        description: 'Grundlagen: hic, iste, ille, idem',
        content: {
            explanation: 'Die lateinischen Demonstrativpronomen ermöglichen eine präzise räumliche und zeitliche Referenz und sind fundamental für die lateinische Syntax und Rhetorik. Sie unterscheiden sich in ihrer demonstrativen Kraft und Verwendungskontexte: hic (dieser, hier) für die Nähe zum Sprecher, iste (dieser, da) für die Nähe zum Angesprochenen, und ille (jener, dort) für die Entfernung von beiden. Das Pronomen idem (derselbe) hat eine spezielle Funktion und folgt eigenen Deklinationsmustern.',
            details: 'Hic, haec, hoc (dieser) wird nach der 3. Deklination mit i-Stamm-Charakter dekliniert, zeigt aber einige Besonderheiten. Die Formen sind: hic, huius, huic, hunc, hoc im Singular und hi, horum, his, hos, his im Plural. Iste, ista, istud (dieser da) folgt einem ähnlichen Muster: iste, istius, isti, istum, isto im Singular und isti, istorum, istis, istos, istis im Plural. Ille, illa, illud (jener) wird ebenfalls nach der 3. Deklination dekliniert: ille, illius, illi, illum, illo im Singular und illi, illorum, illis, illos, illis im Plural. Idem, eadem, idem (derselbe) ist besonders, da es aus is + dem zusammengesetzt ist und besondere Formen zeigt: idem, eiusdem, eidem, eundem, eodem.',
            rules: 'Die Deklination von hic folgt dem Muster: Nominativ hic/haec/hoc, Genitiv huius, Dativ huic, Akkusativ hunc/ham/hoc, Ablativ hoc/haec/hoc. Die Pluralformen sind: hi/haec/haec, horum/harum/horum, his/his/his, hos/has/haec, his/his/his. Iste wird dekliniert: iste/ista/istud, istius, isti, istum/istam/istud, isto/ista/isto. Plural: isti/istae/ista, istorum/istarum/istorum, istis/istis/istis, istos/istas/ista, istis/istis/istis. Ille wird dekliniert: ille/illa/illud, illius, illi, illum/illam/illud, illo/illa/illo. Plural: illi/illae/illa, illorum/illarum/illorum, illis/illis/illis, illos/illas/illa, illis/illis/illis. Idem wird dekliniert: idem/eadem/idem, eiusdem, eidem, eundem/eandem/idem, eodem/eadem/eodem.',
            tables: [
                {
                    title: 'Demonstrativpronomen',
                    headers: ['Kasus', 'hic (dieser)', 'iste (dieser da)', 'ille (jener)', 'idem (derselbe)'],
                    rows: [
                        ['Nom.', 'hic', 'iste', 'ille', 'idem'],
                        ['Gen.', 'huius', 'istius', 'illius', 'eiusdem'],
                        ['Dat.', 'huic', 'isti', 'illi', 'eidem'],
                        ['Akk.', 'hunc', 'istum', 'illum', 'eundem'],
                        ['Abl.', 'hoc', 'isto', 'illo', 'eodem']
                    ]
                }
            ]
        }
    },
    {
        id: 'relativpronomen',
        title: '4. Relativpronomen',
        description: 'Grundlagen: qui, quae, quod',
        content: {
            explanation: 'Das lateinische Relativpronomen qui, quae, quod ist eines der wichtigsten Verbindungselemente der lateinischen Syntax. Es leitet Relativsätze ein und verbindet diese mit dem Hauptsatz. Als Pronomen der 3. Person folgt es der Deklination der i-Stämme der 3. Deklination und hat eine charakteristische Formenreihe, die in vielen lateinischen Texten ständig verwendet wird.',
            details: 'Das Relativpronomen qui, quae, quod (der, die, das; welcher, welche, welches) wird nach der 3. Deklination mit i-Stamm-Charakter dekliniert. Die Singularformen sind: qui, cuius, cui, quem, quo im Maskulinum; quae, cuius, cui, quam, qua im Femininum; quod, cuius, cui, quod, quo im Neutrum. Die Pluralformen zeigen die charakteristischen i-Stamm-Merkmale: qui, quorum, quibus, quos, quibus im Maskulinum; quae, quarum, quibus, quas, quibus im Femininum; quae, quorum, quibus, quae, quibus im Neutrum. Besonders wichtig ist die Gleichheit der Formen im Nominativ Maskulinum und Femininum Plural (qui/quae) sowie im Akkusativ Neutrum Singular und Plural (quod/quae).',
            rules: 'Die Deklination von qui, quae, quod folgt konsequent den i-Stamm-Mustern: Singular Maskulinum qui, cuius, cui, quem, quo; Femininum quae, cuius, cui, quam, qua; Neutrum quod, cuius, cui, quod, quo. Plural Maskulinum qui, quorum, quibus, quos, quibus; Femininum quae, quarum, quibus, quas, quibus; Neutrum quae, quorum, quibus, quae, quibus. Besonderheiten: Der Genitiv cuius ist für alle Genera gleich. Der Dativ cui ist ebenfalls für alle Genera gleich. Der Ablativ Maskulinum und Neutrum Singular ist quo, der Femininum Singular qua. Im Plural haben Dativ und Ablativ die gleiche Form quibus für alle Genera. Die Formen qui und quae können verschiedene Funktionen haben: qui als Nominativ Maskulinum oder Relativadverb, quae als Nominativ Femininum oder Nominativ/Akkusativ Neutrum Plural.',
            tables: [
                {
                    title: 'Relativpronomen',
                    headers: ['Kasus', 'qui (der)', 'quae (die)', 'quod (das)'],
                    rows: [
                        ['Nom.', 'qui', 'quae', 'quod'],
                        ['Gen.', 'cuius', 'cuius', 'cuius'],
                        ['Dat.', 'cui', 'cui', 'cui'],
                        ['Akk.', 'quem', 'quam', 'quod'],
                        ['Abl.', 'quo', 'qua', 'quo']
                    ]
                }
            ]
        }
    }
];

export default function PronomenPage() {
    const { topic } = useParams<{ topic: string }>();
    const navigate = useNavigate();

    if (!topic) {
        // Show overview of all pronoun topics
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
                            Pronomen
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
                                Pronomen
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Die lateinischen Fürwörter und ihre Deklination. Wähle ein Thema zum Lernen:
                            </p>
                        </div>

                        {/* Topics Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {pronomenTopics.map((t, index) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card 
                                        className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-6 hover:border-primary/50 transition-all duration-500 group cursor-pointer h-full"
                                        onClick={() => navigate(`/learn/grammar/pronomen/${t.id}`)}
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

    const currentTopic = pronomenTopics.find(t => t.id === topic);

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
                        onClick={() => navigate('/learn/grammar/pronomen')}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück zu Pronomen
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                        <BookOpen className="w-4 h-4" />
                        Pronomen
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
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
