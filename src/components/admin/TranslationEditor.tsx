import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Edit, Save, X, Languages, Globe, Check, Loader2, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TranslationData {
    de: Record<string, string>;
    en: Record<string, string>;
    la: Record<string, string>;
}

export function TranslationEditor() {
    const [translations, setTranslations] = useState<TranslationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{ de: string; en: string; la: string }>({ de: '', en: '', la: '' });
    const [saving, setSaving] = useState(false);
    const [activeLang, setActiveLang] = useState<'de' | 'en' | 'la'>('de');

    // Fetch translations from API
    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const res = await fetch('/api/translations');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setTranslations(data);
            } catch (error) {
                toast.error('Übersetzungen konnten nicht geladen werden');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTranslations();
    }, []);

    // Get all unique keys from all languages
    const allKeys = useMemo(() => {
        if (!translations) return [];
        const keys = new Set<string>();
        Object.keys(translations.de || {}).forEach(k => keys.add(k));
        Object.keys(translations.en || {}).forEach(k => keys.add(k));
        Object.keys(translations.la || {}).forEach(k => keys.add(k));
        // Exclude author-specific keys (to be handled under Autoren-Editor)
        const excludePattern = /^(caesar|cicero|augustus|seneca)_/i;
        return Array.from(keys)
            .filter(k => !excludePattern.test(k))
            .sort();
    }, [translations]);

    const filteredKeys = useMemo(() => {
        if (!searchQuery) return allKeys;
        const query = searchQuery.toLowerCase();
        return allKeys.filter(key => {
            const deVal = translations?.de?.[key] || '';
            const enVal = translations?.en?.[key] || '';
            const laVal = translations?.la?.[key] || '';
            return key.toLowerCase().includes(query) ||
                deVal.toLowerCase().includes(query) ||
                enVal.toLowerCase().includes(query) ||
                laVal.toLowerCase().includes(query);
        });
    }, [allKeys, searchQuery, translations]);

    const handleEdit = (key: string) => {
        setEditingKey(key);
        setEditValues({
            de: translations?.de?.[key] || '',
            en: translations?.en?.[key] || '',
            la: translations?.la?.[key] || '',
        });
    };

    const handleSave = async () => {
        if (!editingKey) return;
        setSaving(true);

        try {
            // Save to each language that has changes
            const updates = [
                { lang: 'de', value: editValues.de },
                { lang: 'en', value: editValues.en },
                { lang: 'la', value: editValues.la },
            ];

            for (const { lang, value } of updates) {
                const res = await fetch(`/api/translations/${lang}/${editingKey}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ value }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Failed to save');
                }
            }

            // Update local state
            setTranslations(prev => prev ? {
                de: { ...prev.de, [editingKey]: editValues.de },
                en: { ...prev.en, [editingKey]: editValues.en },
                la: { ...prev.la, [editingKey]: editValues.la },
            } : null);

            toast.success(`"${editingKey}" gespeichert`);
            setEditingKey(null);
        } catch (error: any) {
            toast.error(error.message || 'Fehler beim Speichern');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditingKey(null);
        setEditValues({ de: '', en: '', la: '' });
    };

    const getMissingCount = (lang: 'de' | 'en' | 'la') => {
        if (!translations) return 0;
        const deKeys = Object.keys(translations.de || {});
        const langKeys = Object.keys(translations[lang] || {});
        return deKeys.filter(k => !langKeys.includes(k)).length;
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="py-12 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Languages className="h-5 w-5 text-primary" />
                        Übersetzungen verwalten
                    </CardTitle>
                    <CardDescription>
                        {filteredKeys.length} von {allKeys.length} Einträgen
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-600 border border-green-500/20">
                        DE: {Object.keys(translations?.de || {}).length}
                    </span>
                    <span className={`px-2 py-1 rounded border ${getMissingCount('en') > 0 ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
                        EN: {Object.keys(translations?.en || {}).length}
                        {getMissingCount('en') > 0 && ` (-${getMissingCount('en')})`}
                    </span>
                    <span className={`px-2 py-1 rounded border ${getMissingCount('la') > 0 ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
                        LA: {Object.keys(translations?.la || {}).length}
                        {getMissingCount('la') > 0 && ` (-${getMissingCount('la')})`}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Schlüssel oder Text suchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[200px]">Schlüssel</TableHead>
                                <TableHead>DE</TableHead>
                                <TableHead>EN</TableHead>
                                <TableHead>LA</TableHead>
                                <TableHead className="w-[80px] text-right">Aktion</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredKeys.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        Keine Übersetzungen gefunden
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredKeys.map((key) => (
                                    <TableRow key={key}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {key}
                                        </TableCell>
                                        {editingKey === key ? (
                                            <>
                                                <TableCell>
                                                    <Input
                                                        value={editValues.de}
                                                        onChange={(e) => setEditValues(prev => ({ ...prev, de: e.target.value }))}
                                                        className="text-xs h-8"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={editValues.en}
                                                        onChange={(e) => setEditValues(prev => ({ ...prev, en: e.target.value }))}
                                                        className="text-xs h-8"
                                                        placeholder="(leer)"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={editValues.la}
                                                        onChange={(e) => setEditValues(prev => ({ ...prev, la: e.target.value }))}
                                                        className="text-xs h-8"
                                                        placeholder="(leer)"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={handleSave}
                                                            disabled={saving}
                                                            className="h-7 w-7 text-green-600"
                                                        >
                                                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={handleCancel}
                                                            className="h-7 w-7"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>
                                                    <span className="text-xs line-clamp-1">{translations?.de?.[key] || ''}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`text-xs line-clamp-1 ${!translations?.en?.[key] ? 'text-muted-foreground/50 italic' : ''}`}>
                                                        {translations?.en?.[key] || '—'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`text-xs line-clamp-1 ${!translations?.la?.[key] ? 'text-muted-foreground/50 italic' : ''}`}>
                                                        {translations?.la?.[key] || '—'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(key)}
                                                        className="h-7 w-7"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>



                <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        Hinweise
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Änderungen werden direkt in de.ts, en.ts, la.ts gespeichert</li>
                        <li>• Nach dem Speichern: Hot-Reload aktualisiert die App automatisch</li>
                        <li>• Variablen wie {"{{variable}}"} müssen in allen Sprachen beibehalten werden</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
