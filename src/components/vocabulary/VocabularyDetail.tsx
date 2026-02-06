import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Table as TableIcon } from 'lucide-react';
import { DeclinationTable } from './DeclinationTable';
import { ConjugationTable } from './ConjugationTable';

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

            {/* Forms Section */}
            {entry.forms && entry.forms.length > 0 && (
                <Card className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <TableIcon className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">
                            {isVerb ? 'Konjugationstabelle' : isNoun || isAdjective ? 'Deklinationstabelle' : 'Formen'}
                        </h2>
                    </div>
                    
                    {isVerb ? (
                        <ConjugationTable forms={entry.forms} />
                    ) : (isNoun || isAdjective) ? (
                        <DeclinationTable forms={entry.forms} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {entry.forms.map((form, index) => (
                                <div 
                                    key={index}
                                    className="p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                                >
                                    <div className="font-semibold text-primary">{form.form}</div>
                                    {form.bestimmung && (
                                        <div className="text-sm text-muted-foreground">{form.bestimmung}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}

            {/* Grammar Forms Section */}
            {entry.grammarForms && entry.grammarForms.length > 0 && (
                <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Grammatikformen</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {entry.grammarForms.map((grammarForm, index) => (
                            <div 
                                key={index}
                                className="p-3 rounded-lg border border-border bg-card/50"
                            >
                                {grammarForm.nr && (
                                    <div className="text-xs text-muted-foreground mb-1">#{grammarForm.nr}</div>
                                )}
                                <div className="font-semibold text-primary">
                                    {grammarForm.form || 'N/A'}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
