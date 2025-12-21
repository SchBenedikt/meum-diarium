
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { upsertLexiconEntry } from '@/lib/cms-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLexiconEntry } from '@/lib/api';

export default function LexiconEditorPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditMode = !!slug && slug !== 'new';

    const [loading, setLoading] = useState(false);

    // Fetch entry
    const { data: existingEntry, isLoading } = useQuery({
        queryKey: ['lexicon', slug],
        queryFn: () => {
            if (!isEditMode || !slug) return null;
            return fetchLexiconEntry(slug);
        },
        enabled: isEditMode
    });

    const [formData, setFormData] = useState({
        term: '',
        slug: '',
        category: 'Politik',
        definition: '',
        etymology: '',
        variants: [] as string[],
        relatedTerms: [] as string[],
        // English
        en: {
            term: '',
            definition: '',
            etymology: '',
            category: '',
            variants: [] as string[]
        },
        // Latin
        la: {
            term: '',
            definition: '',
            etymology: '',
            category: '',
            variants: [] as string[]
        }
    });

    const [newVariant, setNewVariant] = useState('');
    const [newRelated, setNewRelated] = useState('');
    const [newEnVariant, setNewEnVariant] = useState('');
    const [newLaVariant, setNewLaVariant] = useState('');

    useEffect(() => {
        if (existingEntry) {
            setFormData({
                term: existingEntry.term,
                slug: existingEntry.slug,
                category: existingEntry.category,
                definition: existingEntry.definition,
                etymology: existingEntry.etymology || '',
                variants: existingEntry.variants || [],
                relatedTerms: existingEntry.relatedTerms || [],
                en: {
                    term: existingEntry.translations?.en?.term || '',
                    definition: existingEntry.translations?.en?.definition || '',
                    etymology: existingEntry.translations?.en?.etymology || '',
                    category: existingEntry.translations?.en?.category || '',
                    variants: existingEntry.translations?.en?.variants || []
                },
                la: {
                    term: existingEntry.translations?.la?.term || '',
                    definition: existingEntry.translations?.la?.definition || '',
                    etymology: existingEntry.translations?.la?.etymology || '',
                    category: existingEntry.translations?.la?.category || '',
                    variants: existingEntry.translations?.la?.variants || []
                }
            });
        }
    }, [existingEntry]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setLoading(true);

        try {
            const payload = {
                term: formData.term,
                slug: formData.slug || formData.term.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                category: formData.category,
                definition: formData.definition,
                etymology: formData.etymology,
                variants: formData.variants,
                relatedTerms: formData.relatedTerms,
                translations: {
                    en: formData.en,
                    la: formData.la
                }
            };

            await upsertLexiconEntry(payload);
            queryClient.invalidateQueries({ queryKey: ['lexicon'] }); // List view
            if (isEditMode) {
                queryClient.invalidateQueries({ queryKey: ['lexicon', payload.slug] }); // Detail view
            }
            toast.success(isEditMode ? 'Eintrag aktualisiert' : 'Eintrag erstellt');
            navigate('/admin');
        } catch (error) {
            console.error(error);
            toast.error('Fehler beim Speichern');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addVariant = () => {
        if (newVariant.trim()) {
            setFormData(prev => ({ ...prev, variants: [...prev.variants, newVariant.trim()] }));
            setNewVariant('');
        }
    };

    const removeVariant = (index: number) => {
        setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
    };

    const addRelatedTerm = () => {
        if (newRelated.trim()) {
            setFormData(prev => ({ ...prev, relatedTerms: [...prev.relatedTerms, newRelated.trim()] }));
            setNewRelated('');
        }
    };

    const removeRelatedTerm = (index: number) => {
        setFormData(prev => ({ ...prev, relatedTerms: prev.relatedTerms.filter((_, i) => i !== index) }));
    };

    const updateLangField = (lang: 'en' | 'la', field: string, value: any) => {
        setFormData(prev => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));
    };

    const addLangVariant = (lang: 'en' | 'la') => {
        const val = lang === 'en' ? newEnVariant.trim() : newLaVariant.trim();
        if (!val) return;
        setFormData(prev => ({ ...prev, [lang]: { ...prev[lang], variants: [...(prev[lang].variants || []), val] } }));
        if (lang === 'en') setNewEnVariant(''); else setNewLaVariant('');
    };

    const removeLangVariant = (lang: 'en' | 'la', index: number) => {
        setFormData(prev => ({ ...prev, [lang]: { ...prev[lang], variants: (prev[lang].variants || []).filter((_, i) => i !== index) } }));
    };

    const categories = ['Politik', 'Militär', 'Religion', 'Gesellschaft', 'Philosophie', 'Recht'];

    if (isLoading && isEditMode) {
        return <div className="min-h-screen pt-20 text-center">Lade Eintrag...</div>;
    }

    return (
        <div className="min-h-screen bg-background pt-16">
            {/* Header */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Zurück</span>
                        </Link>
                        <div className="h-6 w-px bg-border hidden sm:block" />
                        <h1 className="font-display text-lg sm:text-xl font-medium">
                            {isEditMode ? 'Lexikon-Eintrag bearbeiten' : 'Neuer Eintrag'}
                        </h1>
                    </div>
                    <Button onClick={() => handleSubmit()} disabled={loading} size="sm">
                        <Save className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">{loading ? 'Speichern...' : 'Speichern'}</span>
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basisdaten</CardTitle>
                            <CardDescription>Hauptbegriff und Definition</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Begriff</Label>
                                    <Input
                                        value={formData.term}
                                        onChange={e => updateField('term', e.target.value)}
                                        placeholder="Konsul"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kategorie</Label>
                                    <Select value={formData.category} onValueChange={(val) => updateField('category', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Slug (URL)</Label>
                                <Input
                                    value={formData.slug}
                                    onChange={e => updateField('slug', e.target.value)}
                                    placeholder="auto-generated"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Definition</Label>
                                <Textarea
                                    value={formData.definition}
                                    onChange={e => updateField('definition', e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Etymologie & Hintergrund</Label>
                                <Textarea
                                    value={formData.etymology}
                                    onChange={e => updateField('etymology', e.target.value)}
                                    placeholder="Herkunft des Wortes..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Variants & Relations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Varianten</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newVariant}
                                        onChange={e => setNewVariant(e.target.value)}
                                        placeholder="Neue Variante..."
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVariant())}
                                    />
                                    <Button type="button" onClick={addVariant} size="icon" variant="secondary">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.variants.map((variant, i) => (
                                        <div key={i} className="bg-secondary px-2 py-1 rounded text-sm flex items-center gap-2">
                                            {variant}
                                            <button type="button" onClick={() => removeVariant(i)} className="text-muted-foreground hover:text-destructive">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Verwandte Begriffe</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newRelated}
                                        onChange={e => setNewRelated(e.target.value)}
                                        placeholder="Begriff..."
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRelatedTerm())}
                                    />
                                    <Button type="button" onClick={addRelatedTerm} size="icon" variant="secondary">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.relatedTerms.map((term, i) => (
                                        <div key={i} className="bg-secondary px-2 py-1 rounded text-sm flex items-center gap-2">
                                            {term}
                                            <button type="button" onClick={() => removeRelatedTerm(i)} className="text-muted-foreground hover:text-destructive">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Translations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Englisch</CardTitle>
                            <CardDescription>Übersetzung des Begriffs</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Term</Label>
                                    <Input
                                        value={formData.en.term}
                                        onChange={e => updateLangField('en', 'term', e.target.value)}
                                        placeholder="Consul"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kategorie (optional)</Label>
                                    <Input
                                        value={formData.en.category}
                                        onChange={e => updateLangField('en', 'category', e.target.value)}
                                        placeholder="Politics"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Definition</Label>
                                <Textarea
                                    value={formData.en.definition}
                                    onChange={e => updateLangField('en', 'definition', e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Etymology</Label>
                                <Textarea
                                    value={formData.en.etymology}
                                    onChange={e => updateLangField('en', 'etymology', e.target.value)}
                                    placeholder="Word origin..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Varianten</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newEnVariant}
                                        onChange={e => setNewEnVariant(e.target.value)}
                                        placeholder="Neue Variante..."
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLangVariant('en'))}
                                    />
                                    <Button type="button" onClick={() => addLangVariant('en')} size="icon" variant="secondary">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(formData.en.variants || []).map((variant, i) => (
                                        <div key={`en-${i}`} className="bg-secondary px-2 py-1 rounded text-sm flex items-center gap-2">
                                            {variant}
                                            <button type="button" onClick={() => removeLangVariant('en', i)} className="text-muted-foreground hover:text-destructive">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Latein</CardTitle>
                            <CardDescription>Übersetzung (Latein)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Term</Label>
                                    <Input
                                        value={formData.la.term}
                                        onChange={e => updateLangField('la', 'term', e.target.value)}
                                        placeholder="Consul"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kategorie (optional)</Label>
                                    <Input
                                        value={formData.la.category}
                                        onChange={e => updateLangField('la', 'category', e.target.value)}
                                        placeholder="Politica"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Definition</Label>
                                <Textarea
                                    value={formData.la.definition}
                                    onChange={e => updateLangField('la', 'definition', e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Etymologia</Label>
                                <Textarea
                                    value={formData.la.etymology}
                                    onChange={e => updateLangField('la', 'etymology', e.target.value)}
                                    placeholder="Origo verbi..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Varianten</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newLaVariant}
                                        onChange={e => setNewLaVariant(e.target.value)}
                                        placeholder="Neue Variante..."
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLangVariant('la'))}
                                    />
                                    <Button type="button" onClick={() => addLangVariant('la')} size="icon" variant="secondary">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(formData.la.variants || []).map((variant, i) => (
                                        <div key={`la-${i}`} className="bg-secondary px-2 py-1 rounded text-sm flex items-center gap-2">
                                            {variant}
                                            <button type="button" onClick={() => removeLangVariant('la', i)} className="text-muted-foreground hover:text-destructive">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
