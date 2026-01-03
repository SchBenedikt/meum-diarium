import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Save, X, Languages, Globe, Check, Loader2, Plus, AlertCircle, Filter, Trash2 } from 'lucide-react';
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
    const [filterMissing, setFilterMissing] = useState(false);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{ de: string; en: string; la: string }>({ de: '', en: '', la: '' });
    const [saving, setSaving] = useState(false);

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

    // Get all unique keys from all languages (Transparency overhaul: include EVERYTHING)
    const allKeys = useMemo(() => {
        if (!translations) return [];
        const keys = new Set<string>();
        Object.keys(translations.de || {}).forEach(k => keys.add(k));
        Object.keys(translations.en || {}).forEach(k => keys.add(k));
        Object.keys(translations.la || {}).forEach(k => keys.add(k));

        return Array.from(keys).sort();
    }, [translations]);

    const filteredKeys = useMemo(() => {
        let keys = allKeys;

        if (filterMissing && translations) {
            keys = keys.filter(key => {
                const hasDe = !!translations.de?.[key];
                const hasEn = !!translations.en?.[key];
                const hasLa = !!translations.la?.[key];
                return !hasDe || !hasEn || !hasLa;
            });
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            keys = keys.filter(key => {
                const deVal = translations?.de?.[key] || '';
                const enVal = translations?.en?.[key] || '';
                const laVal = translations?.la?.[key] || '';
                return key.toLowerCase().includes(query) ||
                    deVal.toLowerCase().includes(query) ||
                    enVal.toLowerCase().includes(query) ||
                    laVal.toLowerCase().includes(query);
            });
        }

        return keys;
    }, [allKeys, searchQuery, filterMissing, translations]);

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

    const handleDeleteKey = async (key: string) => {
        if (!window.confirm(`Schlüssel "${key}" wirklich in ALLEN Sprachen löschen?`)) return;

        try {
            const langs = ['de', 'en', 'la'];
            for (const lang of langs) {
                await fetch(`/api/translations/${lang}/${key}`, { method: 'DELETE' });
            }

            setTranslations(prev => {
                if (!prev) return null;
                const newDe = { ...prev.de }; delete newDe[key];
                const newEn = { ...prev.en }; delete newEn[key];
                const newLa = { ...prev.la }; delete newLa[key];
                return { de: newDe, en: newEn, la: newLa };
            });
            toast.success('Schlüssel gelöscht');
        } catch (e) {
            toast.error('Fehler beim Löschen');
        }
    };

    const getStatusColor = (key: string) => {
        if (!translations) return '';
        const missing = [];
        if (!translations.de?.[key]) missing.push('DE');
        if (!translations.en?.[key]) missing.push('EN');
        if (!translations.la?.[key]) missing.push('LA');

        if (missing.length === 0) return 'bg-green-500/10 text-green-600 border-green-500/20';
        if (missing.length === 3) return 'bg-destructive/10 text-destructive border-destructive/20';
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
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
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Languages className="h-6 w-6 text-primary" />
                        Übersetzungen
                    </CardTitle>
                    <CardDescription>
                        {filteredKeys.length} von {allKeys.length} Einträgen verwalten
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={filterMissing ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterMissing(!filterMissing)}
                        className="gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Unvollständig
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="px-0">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Schlüssel oder Text suchen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 bg-card/50"
                    />
                </div>

                <div className="overflow-x-auto rounded-xl border border-border bg-card/30 backdrop-blur-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="w-[200px] font-display">Schlüssel</TableHead>
                                <TableHead className="font-display">Deutsch (DE)</TableHead>
                                <TableHead className="font-display">English (EN)</TableHead>
                                <TableHead className="font-display">Latine (LA)</TableHead>
                                <TableHead className="w-[100px] text-right font-display">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredKeys.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                                        Keine Übersetzungen gefunden
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredKeys.map((key) => (
                                    <TableRow key={key} className="group transition-colors hover:bg-primary/5">
                                        <TableCell>
                                            <div className="flex flex-col gap-1.5">
                                                <code className="text-[10px] px-1.5 py-0.5 rounded bg-muted w-fit text-muted-foreground font-mono">
                                                    {key}
                                                </code>
                                                <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded border w-fit ${getStatusColor(key)}`}>
                                                    {!translations?.de?.[key] || !translations?.en?.[key] || !translations?.la?.[key] ? 'UNVOLLSTÄNDIG' : 'OK'}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {editingKey === key ? (
                                            <>
                                                <TableCell>
                                                    <Input
                                                        value={editValues.de}
                                                        onChange={(e) => setEditValues(prev => ({ ...prev, de: e.target.value }))}
                                                        className="text-sm min-h-[40px]"
                                                        autoFocus
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={editValues.en}
                                                        onChange={(e) => setEditValues(prev => ({ ...prev, en: e.target.value }))}
                                                        className="text-sm min-h-[40px]"
                                                        placeholder="English text..."
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={editValues.la}
                                                        onChange={(e) => setEditValues(prev => ({ ...prev, la: e.target.value }))}
                                                        className="text-sm min-h-[40px]"
                                                        placeholder="Textus Latinus..."
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={handleSave}
                                                            disabled={saving}
                                                            className="h-9 w-9 text-green-600 hover:bg-green-50"
                                                        >
                                                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={handleCancel}
                                                            className="h-9 w-9"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell className="max-w-[200px]">
                                                    <p className={`text-sm line-clamp-2 ${!translations?.de?.[key] ? 'text-destructive italic' : ''}`}>
                                                        {translations?.de?.[key] || '(fehlt)'}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="max-w-[200px]">
                                                    <p className={`text-sm line-clamp-2 ${!translations?.en?.[key] ? 'text-amber-600/60 italic' : ''}`}>
                                                        {translations?.en?.[key] || '(missing)'}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="max-w-[200px]">
                                                    <p className={`text-sm line-clamp-2 ${!translations?.la?.[key] ? 'text-amber-600/60 italic' : ''}`}>
                                                        {translations?.la?.[key] || '(deest)'}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(key)}
                                                            className="h-8 w-8 text-primary"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteKey(key)}
                                                            className="h-8 w-8 text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <h4 className="font-display font-bold text-base mb-3 flex items-center gap-2 text-primary">
                        <AlertCircle className="h-5 w-5" />
                        Optimierung der Arbeitsabläufe
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span><strong>Vollständige Transparenz</strong>: Alle Schlüssel (inkl. Autoren-Biografien) sind jetzt sichtbar und editierbar.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span><strong>Auto-Scavenging</strong>: Fehlende Übersetzungen werden sofort als editierbare Platzhalter angezeigt.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span><strong>Filter-Modus</strong>: Nutze den Filter "Unvollständig" oben rechts, um Lücken gezielt zu schließen.</span>
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
