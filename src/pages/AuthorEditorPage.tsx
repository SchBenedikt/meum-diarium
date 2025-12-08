import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Save, Globe } from 'lucide-react';
import { authors } from '@/data/authors';

export default function AuthorEditorPage() {
    const { authorId } = useParams<{ authorId: string }>();
    const navigate = useNavigate();
    const isEditMode = !!authorId;

    const [loading, setLoading] = useState(false);
    const existingAuthor = isEditMode ? authors[authorId] : null;

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        latinName: '',
        title: '',
        years: '',
        birthYear: 0,
        deathYear: 0,
        description: '',
        heroImage: '',
        theme: 'theme-caesar',
        color: 'hsl(25, 95%, 53%)',
        // Translations
        en: {
            title: '',
            description: ''
        },
        la: {
            title: '',
            description: ''
        }
    });

    useEffect(() => {
        if (existingAuthor) {
            setFormData({
                id: existingAuthor.id,
                name: existingAuthor.name,
                latinName: existingAuthor.latinName || '',
                title: existingAuthor.title,
                years: existingAuthor.years,
                birthYear: existingAuthor.birthYear,
                deathYear: existingAuthor.deathYear,
                description: existingAuthor.description,
                heroImage: existingAuthor.heroImage || '',
                theme: existingAuthor.theme || 'theme-caesar',
                color: existingAuthor.color || 'hsl(25, 95%, 53%)',
                en: {
                    title: (existingAuthor as any).translations?.en?.title || '',
                    description: (existingAuthor as any).translations?.en?.description || ''
                },
                la: {
                    title: (existingAuthor as any).translations?.la?.title || '',
                    description: (existingAuthor as any).translations?.la?.description || ''
                }
            });
        }
    }, [existingAuthor]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setLoading(true);

        try {
            const payload = {
                id: formData.id || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                name: formData.name,
                latinName: formData.latinName,
                title: formData.title,
                years: formData.years,
                birthYear: formData.birthYear,
                deathYear: formData.deathYear,
                description: formData.description,
                heroImage: formData.heroImage,
                theme: formData.theme,
                color: formData.color,
                translations: {
                    en: formData.en,
                    la: formData.la
                }
            };

            const res = await fetch('/api/authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(isEditMode ? 'Autor aktualisiert' : 'Autor erstellt');
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
                            {isEditMode ? 'Autor bearbeiten' : 'Neuer Autor'}
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
                            <CardDescription>Name, Titel und Lebensdaten des Autors</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Name (Deutsch)</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => updateField('name', e.target.value)}
                                        placeholder="Gaius Julius Caesar"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Lateinischer Name</Label>
                                    <Input
                                        value={formData.latinName}
                                        onChange={e => updateField('latinName', e.target.value)}
                                        placeholder="Gaius Iulius Caesar"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>ID (URL)</Label>
                                    <Input
                                        value={formData.id}
                                        onChange={e => updateField('id', e.target.value)}
                                        placeholder="Auto-generiert"
                                        disabled={isEditMode}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Titel</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={e => updateField('title', e.target.value)}
                                        placeholder="Dictator Perpetuo"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Lebensjahre (Text)</Label>
                                    <Input
                                        value={formData.years}
                                        onChange={e => updateField('years', e.target.value)}
                                        placeholder="100 – 44 v. Chr."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Geburtsjahr</Label>
                                    <Input
                                        type="number"
                                        value={formData.birthYear}
                                        onChange={e => updateField('birthYear', parseInt(e.target.value) || 0)}
                                        placeholder="-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Todesjahr</Label>
                                    <Input
                                        type="number"
                                        value={formData.deathYear}
                                        onChange={e => updateField('deathYear', parseInt(e.target.value) || 0)}
                                        placeholder="-44"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Beschreibung (Deutsch)</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => updateField('description', e.target.value)}
                                    placeholder="Kurze Biografie des Autors..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appearance */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Erscheinungsbild</CardTitle>
                            <CardDescription>Farben und Bilder für die Autorenseite</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Theme-Klasse</Label>
                                    <Input
                                        value={formData.theme}
                                        onChange={e => updateField('theme', e.target.value)}
                                        placeholder="theme-caesar"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Akzentfarbe (HSL)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={formData.color}
                                            onChange={e => updateField('color', e.target.value)}
                                            placeholder="hsl(25, 95%, 53%)"
                                        />
                                        <div
                                            className="w-10 h-10 rounded-lg border"
                                            style={{ backgroundColor: formData.color }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Hero-Bild URL</Label>
                                <Input
                                    value={formData.heroImage}
                                    onChange={e => updateField('heroImage', e.target.value)}
                                    placeholder="/images/caesar-hero.jpg"
                                />
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
                                    <div className="space-y-2">
                                        <Label>Title (English)</Label>
                                        <Input
                                            value={formData.en.title}
                                            onChange={e => setFormData(prev => ({ ...prev, en: { ...prev.en, title: e.target.value } }))}
                                            placeholder="Dictator for Life"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description (English)</Label>
                                        <Textarea
                                            value={formData.en.description}
                                            onChange={e => setFormData(prev => ({ ...prev, en: { ...prev.en, description: e.target.value } }))}
                                            placeholder="Short biography in English..."
                                            rows={3}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="la" className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Titulus (Latine)</Label>
                                        <Input
                                            value={formData.la.title}
                                            onChange={e => setFormData(prev => ({ ...prev, la: { ...prev.la, title: e.target.value } }))}
                                            placeholder="Dictator Perpetuus"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Descriptio (Latine)</Label>
                                        <Textarea
                                            value={formData.la.description}
                                            onChange={e => setFormData(prev => ({ ...prev, la: { ...prev.la, description: e.target.value } }))}
                                            placeholder="Brevis vita Latine..."
                                            rows={3}
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
