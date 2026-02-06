import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Form {
    form: string;
    bestimmung: string | null;
}

interface ConjugationTableProps {
    forms: Form[];
}

export function ConjugationTable({ forms }: ConjugationTableProps) {
    // Group forms by tense/mood
    // Forms typically have bestimmung like "Präs. Ind. Akt. 1. Sg.", "Perf. Ind. Akt. 3. Pl.", etc.
    
    const tenses = [
        { key: 'praes', label: 'Präsens', patterns: ['Präs.', 'Ind.', 'Akt.'] },
        { key: 'impf', label: 'Imperfekt', patterns: ['Impf.', 'Ind.', 'Akt.'] },
        { key: 'perf', label: 'Perfekt', patterns: ['Perf.', 'Ind.', 'Akt.'] },
        { key: 'plusq', label: 'Plusquamperfekt', patterns: ['Plusq.', 'Ind.', 'Akt.'] },
        { key: 'fut1', label: 'Futur I', patterns: ['Fut.', 'I', 'Ind.', 'Akt.'] },
        { key: 'fut2', label: 'Futur II', patterns: ['Fut.', 'II', 'Ind.', 'Akt.'] },
    ];
    
    const persons = [
        { sg: '1. Sg.', pl: '1. Pl.' },
        { sg: '2. Sg.', pl: '2. Pl.' },
        { sg: '3. Sg.', pl: '3. Pl.' },
    ];
    
    const groupedForms: Record<string, Record<string, string>> = {};
    
    // Group forms by tense
    forms.forEach(form => {
        if (!form.bestimmung) return;
        
        for (const tense of tenses) {
            const matchesAll = tense.patterns.every(pattern => 
                form.bestimmung!.includes(pattern)
            );
            
            if (matchesAll) {
                if (!groupedForms[tense.key]) {
                    groupedForms[tense.key] = {};
                }
                
                // Determine person and number
                for (let i = 1; i <= 3; i++) {
                    if (form.bestimmung.includes(`${i}. Sg.`)) {
                        groupedForms[tense.key][`${i}sg`] = form.form;
                    } else if (form.bestimmung.includes(`${i}. Pl.`)) {
                        groupedForms[tense.key][`${i}pl`] = form.form;
                    }
                }
                break;
            }
        }
    });
    
    // If we have forms grouped by tense, show tabs
    const availableTenses = tenses.filter(t => groupedForms[t.key]);
    
    if (availableTenses.length > 0) {
        return (
            <Tabs defaultValue={availableTenses[0].key} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
                    {availableTenses.map(tense => (
                        <TabsTrigger key={tense.key} value={tense.key}>
                            {tense.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                
                {availableTenses.map(tense => (
                    <TabsContent key={tense.key} value={tense.key}>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold">Person</TableHead>
                                        <TableHead className="font-bold">Singular</TableHead>
                                        <TableHead className="font-bold">Plural</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {persons.map((person, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-semibold text-muted-foreground">
                                                {index + 1}. Person
                                            </TableCell>
                                            <TableCell className="text-primary font-medium">
                                                {groupedForms[tense.key]?.[`${index + 1}sg`] || '—'}
                                            </TableCell>
                                            <TableCell className="text-primary font-medium">
                                                {groupedForms[tense.key]?.[`${index + 1}pl`] || '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        );
    }
    
    // Fallback: Simple list if we can't parse the structure
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {forms.map((form, index) => (
                <div 
                    key={index}
                    className="p-3 rounded-lg border border-border bg-card/50"
                >
                    <div className="font-semibold text-primary">{form.form}</div>
                    {form.bestimmung && (
                        <div className="text-sm text-muted-foreground">{form.bestimmung}</div>
                    )}
                </div>
            ))}
        </div>
    );
}
