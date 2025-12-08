import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Globe, Plus, X } from 'lucide-react';
import { lexicon } from '@/data/lexicon';
import { Badge } from '@/components/ui/badge';

export default function LexiconEditorPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const isEditMode = !!slug;

    const [loading, setLoading] = useState(false);
    const existingEntry = isEditMode ? lexicon.find(e => e.slug === slug) : null;

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

            const res = await fetch('/api/lexicon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(isEditMode ? 'Eintrag aktualisiert' : 'Eintrag erstellt');
                navigate('/admin');
            } else {
                toast.error('Fehler beim Speichern');
            }
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

    const categories = ['Politik', 'Militär', 'Religion', 'Gesellschaft', 'Philosophie', 'Recht'];

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
                            {isEditMode ? 'Lexikon-Eintrag bearbeiten' : 'Neuer Lexikon-Eintrag'}
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
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Grundinformationen</CardTitle>
                            <CardDescription>Begriff, Definition und Kategorie</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Begriff (Deutsch)</Label>
                                    <Input
                                        value={formData.term}
                                        onChange={e => updateField('term', e.target.value)}
                                        placeholder="Cursus honorum"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slug (URL)</Label>
                                    <Input
                                        value={formData.slug}
                                        onChange={e => updateField('slug', e.target.value)}
                                        placeholder="Auto-generiert"
                                        disabled={isEditMode}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Kategorie</Label>
                                <Select value={formData.category} onValueChange={v => updateField('category', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Definition (Deutsch)</Label>
                                <Textarea
                                    value={formData.definition}
                                    onChange={e => updateField('definition', e.target.value)}
                                    placeholder="Ausführliche Definition des Begriffs..."
                                    rows={5}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Etymologie</Label>
                                <Textarea
                                    value={formData.etymology}
                                    onChange={e => updateField('etymology', e.target.value)}
                                    placeholder="Herkunft und Bedeutung des Wortes..."
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Variants & Related */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Varianten & Verknüpfungen</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Varianten / Synonyme</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newVariant}
                                        onChange={e => setNewVariant(e.target.value)}
                                        placeholder="Neue Variante hinzufügen..."
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVariant())}
                                    />
                                    <Button type="button" variant="outline" onClick={addVariant}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.variants.map((v, i) => (
                                        <Badge key={i} variant="secondary" className="gap-1">
                                            {v}
                                            <button type="button" onClick={() => removeVariant(i)} className="ml-1 hover:text-destructive">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Verwandte Begriffe (Slugs)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newRelated}
                                        onChange={e => setNewRelated(e.target.value)}
                                        placeholder="z.B. konsul, senat"
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRelatedTerm())}
                                    />
                                    <Button type="button" variant="outline" onClick={addRelatedTerm}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.relatedTerms.map((t, i) => (
                                        <Badge key={i} variant="outline" className="gap-1">
                                            {t}
                                            <button type="button" onClick={() => removeRelatedTerm(i)} className="ml-1 hover:text-destructive">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Translations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Übersetzungen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="en">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                                    <TabsTrigger value="la">🏛️ Latinum</TabsTrigger>
                                </TabsList>

                                <TabsContent value="en" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Term (English)</Label>
                                            <Input
                                                value={formData.en.term}
                                                onChange={e => setFormData(prev => ({ ...prev, en: { ...prev.en, term: e.target.value } }))}
                                                placeholder="Cursus honorum"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Category (English)</Label>
                                            <Input
                                                value={formData.en.category}
                                                onChange={e => setFormData(prev => ({ ...prev, en: { ...prev.en, category: e.target.value } }))}
                                                placeholder="Politics"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Definition (English)</Label>
                                        <Textarea
                                            value={formData.en.definition}
                                            onChange={e => setFormData(prev => ({ ...prev, en: { ...prev.en, definition: e.target.value } }))}
                                            placeholder="Full definition in English..."
                                            rows={5}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Etymology (English)</Label>
                                        <Textarea
                                            value={formData.en.etymology}
                                            onChange={e => setFormData(prev => ({ ...prev, en: { ...prev.en, etymology: e.target.value } }))}
                                            placeholder="Word origin..."
                                            rows={2}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="la" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Vocabulum (Latine)</Label>
                                            <Input
                                                value={formData.la.term}
                                                onChange={e => setFormData(prev => ({ ...prev, la: { ...prev.la, term: e.target.value } }))}
                                                placeholder="Cursus honorum"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Categoria (Latine)</Label>
                                            <Input
                                                value={formData.la.category}
                                                onChange={e => setFormData(prev => ({ ...prev, la: { ...prev.la, category: e.target.value } }))}
                                                placeholder="Res Publica"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Definitio (Latine)</Label>
                                        <Textarea
                                            value={formData.la.definition}
                                            onChange={e => setFormData(prev => ({ ...prev, la: { ...prev.la, definition: e.target.value } }))}
                                            placeholder="Definitio plena Latine..."
                                            rows={5}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Etymologia (Latine)</Label>
                                        <Textarea
                                            value={formData.la.etymology}
                                            onChange={e => setFormData(prev => ({ ...prev, la: { ...prev.la, etymology: e.target.value } }))}
                                            placeholder="Origo vocabuli..."
                                            rows={2}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
