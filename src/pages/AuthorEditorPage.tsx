
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { upsertAuthor } from '@/lib/cms-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAuthors } from '@/lib/api';

export default function AuthorEditorPage() {
    const { authorId } = useParams<{ authorId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditMode = !!authorId && authorId !== 'new';

    const [loading, setLoading] = useState(false);

    // Fetch authors from API
    const { data: authorsMap, isLoading } = useQuery({
        queryKey: ['authors'],
        queryFn: fetchAuthors
    });

    const existingAuthor = (isEditMode && authorsMap) ? authorsMap[authorId!] : null;

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

            await upsertAuthor(payload);
            queryClient.invalidateQueries({ queryKey: ['authors'] });
            toast.success(isEditMode ? 'Autor aktualisiert' : 'Autor erstellt');
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

    const updateTranslation = (lang: 'en' | 'la', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [lang]: { ...prev[lang], [field]: value }
        }));
    };

    if (isLoading && isEditMode) {
        return <div className="min-h-screen pt-20 text-center">Lade Autor...</div>;
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
                                    <Label>Name (ID)</Label>
                                    <Input
                                        value={formData.id}
                                        onChange={e => updateField('id', e.target.value)}
                                        placeholder="caesar"
                                        disabled={isEditMode}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Anzeigename</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => updateField('name', e.target.value)}
                                        placeholder="Gaius Julius Caesar"
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
                                <div className="space-y-2">
                                    <Label>Titel / Rolle</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={e => updateField('title', e.target.value)}
                                        placeholder="Staatsmann & Feldherr"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Zeitraum (Text)</Label>
                                    <Input
                                        value={formData.years}
                                        onChange={e => updateField('years', e.target.value)}
                                        placeholder="100 v. Chr. - 44 v. Chr."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Geburtsjahr</Label>
                                    <Input
                                        type="number"
                                        value={formData.birthYear}
                                        onChange={e => updateField('birthYear', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Todesjahr</Label>
                                    <Input
                                        type="number"
                                        value={formData.deathYear}
                                        onChange={e => updateField('deathYear', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Kurzbeschreibung (DE)</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => updateField('description', e.target.value)}
                                    placeholder="Kurze Biografie..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Styling */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Erscheinungsbild</CardTitle>
                            <CardDescription>Farbschema und Bilder</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Farbe (HSL od. Hex)</Label>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded border" style={{ backgroundColor: formData.color }} />
                                        <Input
                                            value={formData.color}
                                            onChange={e => updateField('color', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Theme Class</Label>
                                    <Select value={formData.theme} onValueChange={(val) => updateField('theme', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="theme-caesar">Caesar (Orange)</SelectItem>
                                            <SelectItem value="theme-cicero">Cicero (Blau)</SelectItem>
                                            <SelectItem value="theme-augustus">Augustus (Lila)</SelectItem>
                                            <SelectItem value="theme-seneca">Seneca (Rot)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Hero Image URL</Label>
                                <Input
                                    value={formData.heroImage}
                                    onChange={e => updateField('heroImage', e.target.value)}
                                    placeholder="/authors/caesar.jpg"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Translations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Übersetzungen</CardTitle>
                            <CardDescription>Titel und Beschreibung in anderen Sprachen</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-medium text-sm text-muted-foreground border-b pb-1">English</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title (EN)</Label>
                                        <Input
                                            value={formData.en.title}
                                            onChange={e => updateTranslation('en', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description (EN)</Label>
                                        <Textarea
                                            value={formData.en.description}
                                            onChange={e => updateTranslation('en', 'description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium text-sm text-muted-foreground border-b pb-1">Latinum</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label>Titulus (LA)</Label>
                                        <Input
                                            value={formData.la.title}
                                            onChange={e => updateTranslation('la', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Descriptio (LA)</Label>
                                        <Textarea
                                            value={formData.la.description}
                                            onChange={e => updateTranslation('la', 'description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
