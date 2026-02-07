import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Table as TableIcon } from 'lucide-react';
import { DeclinationTable } from './DeclinationTable';
import { ConjugationTable } from './ConjugationTable';
import { ParticipleTable } from './ParticipleTable';

interface Form {
    id: number;
    vokId: string;
    form: string;
    bestimmung: string | null;
}

interface GrammarForm {
    id: number;
    vokId: string;
    nr: string | null;
    form: string | null;
    bestimmung?: string | null; // Added description field
}

interface VocEntryDetail {
    id: number;
    vokId: string;
    latin: string | null;
    desc: string | null;
    html: string | null;
    key: string;
    grammar: string | null;
    typnr: number | null;
    forms: Form[];
    grammarForms: GrammarForm[];
}

interface VocabularyDetailProps {
    vokId: string;
}

export function VocabularyDetail({ vokId }: VocabularyDetailProps) {
    const [entry, setEntry] = useState<VocEntryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEntry = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/vocab/${encodeURIComponent(vokId)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch vocabulary entry');
            }
            const data = await response.json();
            setEntry(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error('Error fetching vocabulary entry:', err);
        } finally {
            setLoading(false);
        }
    }, [vokId]);

    useEffect(() => {
        fetchEntry();
    }, [fetchEntry]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !entry) {
        return (
            <Card className="p-8 text-center">
                <p className="text-red-500">{error || 'Eintrag nicht gefunden'}</p>
            </Card>
        );
    }

    const isVerb = entry.grammar?.toLowerCase().includes('verb') || 
                   (entry.typnr && entry.typnr >= 101 && entry.typnr <= 110);
    const isNoun = entry.grammar?.toLowerCase().includes('subst') || 
                   (entry.typnr && entry.typnr >= 201 && entry.typnr <= 299);
    const isAdjective = entry.grammar?.toLowerCase().includes('adj') ||
                        (entry.typnr && entry.typnr >= 301 && entry.typnr <= 399);

    // Use the enriched forms (forms now contains all GRAMMAR forms with FORM descriptions)
    const allForms = entry.forms || [];

    // Categorize forms into different types based on their descriptions
    const participleForms = allForms.filter(form => 
        form.bestimmung?.includes('PPA') || 
        form.bestimmung?.includes('PPP') || 
        form.bestimmung?.includes('PDFA') ||
        form.bestimmung?.includes('Part.')
    );

    const conjugationForms = allForms.filter(form => 
        form.bestimmung && (
            form.bestimmung.includes('Präs.') || 
            form.bestimmung.includes('Perf.') || 
            form.bestimmung.includes('Impf.') ||
            form.bestimmung.includes('Plusq.') ||
            form.bestimmung.includes('Fut.')
        ) &&
        !form.bestimmung.includes('PPA') &&
        !form.bestimmung.includes('PPP') &&
        !form.bestimmung.includes('PDFA') &&
        !form.bestimmung.includes('Part.')
    );

    // Declension forms (for nouns and adjectives)
    const declensionForms = allForms.filter(form =>
        form.bestimmung && (
            form.bestimmung.includes('Nom.') ||
            form.bestimmung.includes('Gen.') ||
            form.bestimmung.includes('Dat.') ||
            form.bestimmung.includes('Akk.') ||
            form.bestimmung.includes('Abl.') ||
            form.bestimmung.includes('Vok.')
        ) &&
        !form.bestimmung.includes('PPA') &&
        !form.bestimmung.includes('PPP') &&
        !form.bestimmung.includes('PDFA') &&
        !form.bestimmung.includes('Part.') &&
        !form.bestimmung.includes('Präs.') &&
        !form.bestimmung.includes('Perf.') &&
        !form.bestimmung.includes('Impf.') &&
        !form.bestimmung.includes('Plusq.') &&
        !form.bestimmung.includes('Fut.')
    );

    // Forms without descriptions (from GRAMMAR table that didn't match FORM table)
    const formsWithoutDescriptions = allForms.filter(form => !form.bestimmung);

    return (
        <div className="space-y-8">
            {/* Header Card */}
            <Card className="p-8">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-primary mb-2">
                                {entry.latin || entry.key}
                            </h1>
                            {entry.grammar && (
                                <Badge variant="secondary" className="text-sm">
                                    {entry.grammar}
                                </Badge>
                            )}
                        </div>
                        <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    
                    <div className="prose prose-sm max-w-none">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Bedeutung:</h3>
                        {entry.html ? (
                            <div 
                                dangerouslySetInnerHTML={{ __html: entry.html }}
                                className="text-muted-foreground [&_p]:my-2 [&_.a]:font-semibold [&_.a]:text-primary [&_.c]:text-foreground [&_.g]:text-sm [&_.g]:text-muted-foreground"
                            />
                        ) : (
                            <p className="text-muted-foreground">{entry.desc || 'Keine Beschreibung verfügbar'}</p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Declension Table - for Nouns and Adjectives */}
            {(isNoun || isAdjective) && declensionForms.length > 0 && (
                <Card className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <TableIcon className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Deklinationstabelle</h2>
                    </div>
                    <DeclinationTable forms={declensionForms} />
                </Card>
            )}

            {/* Conjugation Table - for Verbs */}
            {isVerb && conjugationForms.length > 0 && (
                <Card className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <TableIcon className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Konjugationstabelle</h2>
                    </div>
                    <ConjugationTable forms={conjugationForms} />
                </Card>
            )}

            {/* Participle Forms Section */}
            {participleForms.length > 0 && (
                <Card className="p-8">
                    <ParticipleTable forms={participleForms} />
                </Card>
            )}

            {/* Forms without descriptions - only show if there are any */}
            {formsWithoutDescriptions.length > 0 && (
                <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Weitere Formen</h2>
                    <div className="text-sm text-muted-foreground mb-4">
                        Diese Formen haben keine grammatikalische Beschreibung in der Datenbank.
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {formsWithoutDescriptions.map((form, index) => (
                            <div 
                                key={index}
                                className="p-3 rounded-lg border border-border bg-card/50"
                            >
                                {form.nr && (
                                    <div className="text-xs text-muted-foreground mb-1">#{form.nr}</div>
                                )}
                                <div className="font-semibold text-primary">
                                    {form.form || 'N/A'}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
