import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Form {
    form: string;
    bestimmung: string | null;
}

interface DeclinationTableProps {
    forms: Form[];
}

export function DeclinationTable({ forms }: DeclinationTableProps) {
    // Parse declension forms into a structured table
    // Forms typically have bestimmung like "Nom. Sg.", "Gen. Sg.", "Dat. Sg.", etc.
    
    const cases = ['Nom.', 'Gen.', 'Dat.', 'Akk.', 'Abl.', 'Vok.'];
    const numbers = ['Sg.', 'Pl.'];
    
    const formsByCase: Record<string, { sg?: string; pl?: string }> = {};
    
    forms.forEach(form => {
        if (!form.bestimmung) return;
        
        const bestimmung = form.bestimmung;
        
        // Check each case
        for (const caseName of cases) {
            if (bestimmung.includes(caseName)) {
                if (!formsByCase[caseName]) {
                    formsByCase[caseName] = {};
                }
                
                // Handle both singular and plural
                if (bestimmung.includes('Sg.')) {
                    formsByCase[caseName].sg = form.form;
                } 
                // Handle combined descriptions like "Nom. Pl., Akk. Pl."
                else if (bestimmung.includes('Pl.')) {
                    formsByCase[caseName].pl = form.form;
                }
                break;
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
                        // Show row even if no data to indicate the case exists
                        return (
                            <TableRow key={caseName}>
                                <TableCell className="font-semibold text-muted-foreground">
                                    {caseName.replace('.', '')}
                                </TableCell>
                                <TableCell className="text-primary font-medium">
                                    {caseData?.sg || '—'}
                                </TableCell>
                                <TableCell className="text-primary font-medium">
                                    {caseData?.pl || '—'}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
