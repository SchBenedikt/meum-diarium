import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Form {
    form: string;
    bestimmung?: string | null;
}

interface ParticipleTableProps {
    forms: Form[];
}

export function ParticipleTable({ forms }: ParticipleTableProps) {
    // Group forms by participle type and gender/case/number
    // Forms typically have bestimmung like "Part. Fut. Akt. (Dat. Pl. mask.)", etc.
    
    const participleTypes = [
        { 
            key: 'ppa', 
            label: 'PPA (Participium Praesentis Activi)', 
            patterns: ['PPA'], 
            priority: 1
        },
        { 
            key: 'ppp', 
            label: 'PPP (Participium Perfecti Passivi)', 
            patterns: ['PPP'], 
            priority: 2
        },
        { 
            key: 'pdfa', 
            label: 'PDFA (Participium Futuri Activi)', 
            patterns: ['PDFA'], 
            priority: 3
        },
        { 
            key: 'part', 
            label: 'Partizipien (Allgemein)', 
            patterns: ['Part.'], 
            priority: 4
        }
    ];
    
    const genders = ['mask.', 'fem.', 'neutr.'];
    const cases = ['Nom.', 'Gen.', 'Dat.', 'Akk.', 'Abl.'];
    const numbers = ['Sg.', 'Pl.'];
    
    const groupedForms: Record<string, Record<string, Record<string, string>>> = {};
    
    console.log('📊 [ParticipleTable] Received forms:', forms);
    console.log('🔢 [ParticipleTable] Forms count:', forms.length);
    
    // Group forms by participle type, gender, case, and number
    forms.forEach(form => {
        if (!form.bestimmung) return;
        
        const bestimmung = form.bestimmung;
        console.log(`🔍 [ParticipleTable] Processing form: ${form.form} -> ${bestimmung}`);
        
        // Sort participle types by priority to ensure most specific matches first
        const sortedTypes = [...participleTypes].sort((a, b) => {
            // More specific patterns should come first (lower priority number = higher priority)
            return a.priority - b.priority;
        });
        
        for (const participleType of sortedTypes) {
            const matchesAny = participleType.patterns.some(pattern => 
                bestimmung.includes(pattern)
            );
            
            if (matchesAny) {
                if (!groupedForms[participleType.key]) {
                    groupedForms[participleType.key] = {};
                }
                
                console.log(`✅ [ParticipleTable] Form ${form.form} matches type ${participleType.label} (priority ${participleType.priority})`);
                
                // Parse gender, case, and number from description
                // Examples: "PPA (Nom. Sg. mask.)", "PPP (Gen. Pl. fem.)"
                const genderPattern = /(mask\.|fem\.|neutr\.)/;
                const casePattern = /(Nom\.|Gen\.|Dat\.|Akk\.|Abl\.)/;
                const numberPattern = /(Sg\.|Pl\.)/;
                
                const genderMatch = bestimmung.match(genderPattern);
                const caseMatches = bestimmung.match(casePattern);
                const numberMatch = bestimmung.match(numberPattern);
                
                if (genderMatch && caseMatches && numberMatch) {
                    const gender = genderMatch[0];
                    const caseName = caseMatches[0];
                    const number = numberMatch[0];
                    
                    if (!groupedForms[participleType.key][gender]) {
                        groupedForms[participleType.key][gender] = {};
                    }
                    
                    const cellKey = `${caseName}${number === 'Sg.' ? 'sg' : 'pl'}`;
                    groupedForms[participleType.key][gender][cellKey] = form.form;
                    console.log(`✅ [ParticipleTable] Added ${participleType.key} ${gender} ${caseName} ${number}: ${form.form}`);
                }
                break; // Found matching type, stop checking other types
            }
        }
    });
    
    console.log('🗂️ [ParticipleTable] Grouped forms:', groupedForms);
    
    // If we have forms grouped by participle type, show tabs
    const availableTypes = participleTypes.filter(type => groupedForms[type.key]);
    
    if (availableTypes.length > 0) {
        return (
            <Tabs defaultValue={availableTypes[0].key} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    {availableTypes.map(type => (
                        <TabsTrigger key={type.key} value={type.key}>
                            {type.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                
                {availableTypes.map(type => (
                    <TabsContent key={type.key} value={type.key}>
                        <div className="space-y-6">
                            {genders.map(gender => {
                                const genderData = groupedForms[type.key][gender];
                                if (!genderData) return null;
                                
                                return (
                                    <div key={gender}>
                                        <h3 className="text-lg font-semibold mb-3 text-foreground">
                                            {gender === 'mask.' ? 'Maskulinum' : 
                                             gender === 'fem.' ? 'Femininum' : 'Neutrum'}
                                        </h3>
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
                                                        const sgForm = genderData[`${caseName}sg`];
                                                        const plForm = genderData[`${caseName}pl`];
                                                        
                                                        return (
                                                            <TableRow key={caseName}>
                                                                <TableCell className="font-semibold text-muted-foreground">
                                                                    {caseName.replace('.', '')}
                                                                </TableCell>
                                                                <TableCell className="text-primary font-medium">
                                                                    {sgForm || '—'}
                                                                </TableCell>
                                                                <TableCell className="text-primary font-medium">
                                                                    {plForm || '—'}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        );
    }
    
    // Fallback: Simple list if we can't parse structure
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-3">Partizipien</h3>
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
        </div>
    );
}
