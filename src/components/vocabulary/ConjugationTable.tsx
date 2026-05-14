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
        { key: 'praes', label: 'Präsens', patterns: ['Präs.'], priority: 1 },
        { key: 'impf', label: 'Imperfekt', patterns: ['Impf.'], priority: 2 },
        { key: 'perf', label: 'Perfekt', patterns: ['Perf.'], priority: 3 },
        { key: 'plusq', label: 'Plusquamperfekt', patterns: ['Plusq.'], priority: 4 },
        { key: 'fut1', label: 'Futur I', patterns: ['Fut.', 'I'], priority: 5 },
        { key: 'fut2', label: 'Futur II', patterns: ['Fut.', 'II'], priority: 6 },
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
        
        // Sort tenses by priority to ensure most specific matches first
        const sortedTenses = [...tenses].sort((a, b) => a.priority - b.priority);
        
        for (const tense of sortedTenses) {
            // Check if this form matches the tense pattern
            const matchesTense = tense.patterns.some(pattern => 
                form.bestimmung!.includes(pattern)
            );
            
            if (matchesTense) {
                if (!groupedForms[tense.key]) {
                    groupedForms[tense.key] = {};
                }
                
                // Determine person and number
                for (let i = 1; i <= 3; i++) {
                    // Check for exact person and number matches
                    const personSgPattern = new RegExp(`${i}\\.?\\s*Pers\\.?\\s*Sg\\.`);
                    const personPlPattern = new RegExp(`${i}\\.?\\s*Pers\\.?\\s*Pl\\.`);
                    
                    if (personSgPattern.test(form.bestimmung!)) {
                        groupedForms[tense.key][`${i}sg`] = form.form;
                        break; // Found right person, stop searching
                    } else if (personPlPattern.test(form.bestimmung!)) {
                        groupedForms[tense.key][`${i}pl`] = form.form;
                        break; // Found right person, stop searching
                    }
                }
                break; // Found matching tense, stop checking other tenses
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
