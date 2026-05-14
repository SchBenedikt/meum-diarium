import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Form {
    form: string;
    bestimmung: string | null;
    nr?: string | null;
}

interface DeclinationTableProps {
    forms: Form[];
}

export function DeclinationTable({ forms }: DeclinationTableProps) {
    // Parse declension forms into a structured table
    // Forms typically have bestimmung like "Nom. Sg.", "Gen. Sg.", "Dat. Sg.", etc.
    // For adjectives, they may also have gender indicators like "mask.", "fem.", "neut."
    
    const cases = ['Nom.', 'Gen.', 'Dat.', 'Akk.', 'Abl.', 'Vok.'];
    const genders = ['mask.', 'fem.', 'neut.'];
    
    // Check if we have forms with gender indicators
    const hasGenderForms = forms.some(f => 
        f.bestimmung && genders.some(g => f.bestimmung!.includes(g))
    );
    if (hasGenderForms) {
        // Multi-gender declension table (for adjectives)
        const formsByGender: Record<string, Record<string, { sg?: string[]; pl?: string[] }>> = {};
        
        forms.forEach(form => {
            if (!form.bestimmung) return;
            
            const bestimmung = form.bestimmung;
            // Determine gender
            let gender = 'mask.'; // default
            for (const g of genders) {
                if (bestimmung.includes(g)) {
                    gender = g;
                    break;
                }
            }
            
            if (!formsByGender[gender]) {
                formsByGender[gender] = {};
            }
            
            // Check each case
            for (const caseName of cases) {
                if (bestimmung.includes(caseName)) {
                    if (!formsByGender[gender][caseName]) {
                        formsByGender[gender][caseName] = {};
                    }
                    
                    // Handle both singular and plural - support multiple forms
                    if (bestimmung.includes('Sg.')) {
                        if (!formsByGender[gender][caseName].sg) {
                            formsByGender[gender][caseName].sg = [];
                        }
                        formsByGender[gender][caseName].sg!.push(form.form);
                    } 
                    // Handle combined descriptions like "Nom. Pl., Akk. Pl."
                    if (bestimmung.includes('Pl.')) {
                        if (!formsByGender[gender][caseName].pl) {
                            formsByGender[gender][caseName].pl = [];
                        }
                        formsByGender[gender][caseName].pl!.push(form.form);
                    }
                    // Don't break here - continue checking for other cases in same description
                }
            }
        });
        
        const availableGenders = Object.keys(formsByGender);
        
        if (availableGenders.length === 0) {
            return <div className="text-muted-foreground">Keine Deklinationsformen verfügbar</div>;
        }
        
        const genderLabels: Record<string, string> = {
            'mask.': 'Maskulinum',
            'fem.': 'Femininum',
            'neut.': 'Neutrum'
        };
        
        // Determine grid columns based on number of genders
        const gridColsClass = availableGenders.length === 1 ? 'grid-cols-1' :
                              availableGenders.length === 2 ? 'grid-cols-2' :
                              'grid-cols-3';
        
        return (
            <Tabs defaultValue={availableGenders[0]} className="w-full">
                <TabsList className={`grid w-full ${gridColsClass} mb-6`}>
                    {availableGenders.map(gender => (
                        <TabsTrigger key={gender} value={gender}>
                            {genderLabels[gender] || gender}
                        </TabsTrigger>
                    ))}
                </TabsList>
                
                {availableGenders.map(gender => (
                    <TabsContent key={gender} value={gender}>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold">Kasus</TableHead>
                                        <TableHead className="font-bold">Singular</TableHead>
                                        <TableHead className="font-bold">Plural</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cases.map(caseName => {
                                        const caseData = formsByGender[gender][caseName];
                                        return (
                                            <TableRow key={caseName}>
                                                <TableCell className="font-semibold text-muted-foreground">
                                                    {caseName.replace('.', '')}
                                                </TableCell>
                                                <TableCell className="text-primary font-medium">
                                                    {caseData?.sg && caseData.sg.length > 0 
                                                        ? <div className="space-y-1">
                                                            {caseData.sg.map((form, index) => (
                                                                <div key={index} className="flex items-center gap-2">
                                                                    <span>{form}</span>
                                                                    {index < caseData.sg.length - 1 && <span className="text-xs text-muted-foreground">/</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        : '—'
                                                    }
                                                </TableCell>
                                                <TableCell className="text-primary font-medium">
                                                    {caseData?.pl && caseData.pl.length > 0 
                                                        ? <div className="space-y-1">
                                                            {caseData.pl.map((form, index) => (
                                                                <div key={index} className="flex items-center gap-2">
                                                                    <span>{form}</span>
                                                                    {index < caseData.pl.length - 1 && <span className="text-xs text-muted-foreground">/</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        : '—'
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        );
    }
    
    // Single-gender declension table (for nouns)
    const formsByCase: Record<string, { sg?: string[]; pl?: string[] }> = {};
    
    forms.forEach(form => {
        if (!form.bestimmung) return;
        
        const bestimmung = form.bestimmung;
        // Check each case
        for (const caseName of cases) {
            if (bestimmung.includes(caseName)) {
                if (!formsByCase[caseName]) {
                    formsByCase[caseName] = {};
                }
                
                // Handle both singular and plural - support multiple forms
                if (bestimmung.includes('Sg.')) {
                    if (!formsByCase[caseName].sg) {
                        formsByCase[caseName].sg = [];
                    }
                    formsByCase[caseName].sg!.push(form.form);
                } 
                // Handle combined descriptions like "Nom. Pl., Akk. Pl."
                if (bestimmung.includes('Pl.')) {
                    if (!formsByCase[caseName].pl) {
                        formsByCase[caseName].pl = [];
                    }
                    formsByCase[caseName].pl!.push(form.form);
                }
                // Don't break here - continue checking for other cases in the same description
            }
        }
    });

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Kasus</TableHead>
                        <TableHead className="font-bold">Singular</TableHead>
                        <TableHead className="font-bold">Plural</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cases.map(caseName => {
                        const caseData = formsByCase[caseName];
                        // Show row even if no data to indicate case exists
                        return (
                            <TableRow key={caseName}>
                                <TableCell className="font-semibold text-muted-foreground">
                                    {caseName.replace('.', '')}
                                </TableCell>
                                <TableCell className="text-primary font-medium">
                                    {caseData?.sg && caseData.sg.length > 0 
                                        ? <div className="space-y-1">
                                            {caseData.sg.map((form, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span>{form}</span>
                                                    {index < caseData.sg.length - 1 && <span className="text-xs text-muted-foreground">/</span>}
                                                </div>
                                            ))}
                                        </div>
                                        : '—'
                                    }
                                </TableCell>
                                <TableCell className="text-primary font-medium">
                                    {caseData?.pl && caseData.pl.length > 0 
                                        ? <div className="space-y-1">
                                            {caseData.pl.map((form, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span>{form}</span>
                                                    {index < caseData.pl.length - 1 && <span className="text-xs text-muted-foreground">/</span>}
                                                </div>
                                            ))}
                                        </div>
                                        : '—'
                                    }
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
