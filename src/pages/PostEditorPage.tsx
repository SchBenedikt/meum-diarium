
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPost, Author } from '@/types/blog';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, Globe } from 'lucide-react';
import { upsertPost } from '@/lib/cms-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPost } from '@/lib/api';

export default function PostEditorPage() {
    const { author, slug } = useParams<{ author: string; slug: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditMode = !!slug;

    const [loading, setLoading] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState<'de' | 'en' | 'la'>('de');

    // Fetch post data if editing
    const { data: postData, isLoading: isFetching } = useQuery({
        queryKey: ['post', author, slug],
        queryFn: () => {
            if (!isEditMode || !author || !slug) return null;
            return fetchPost(author, slug);
        },
        enabled: isEditMode
    });

    // Form state definition
    const [formData, setFormData] = useState({
        // Basic info
        title: '',
        latinTitle: '',
        slug: '',
        author: 'caesar' as Author,
        excerpt: '',
        historicalDate: '',
        historicalYear: -50,
        tags: [] as string[],
        coverImage: '',
        readingTime: 5,
        // German content (main)
        de: {
            diary: '',
            scientific: ''
        },
        // English translation
        en: {
            title: '',
            excerpt: '',
            diary: '',
            scientific: ''
        },
        // Latin translation
        la: {
            title: '',
            excerpt: '',
            diary: '',
            scientific: ''
        }
    });

    // Populate form when data arrives
    useEffect(() => {
        if (postData) {
            setFormData({
                title: postData.title,
                latinTitle: postData.latinTitle || '',
                slug: postData.slug,
                author: postData.author,
                excerpt: postData.excerpt,
                historicalDate: postData.historicalDate,
                historicalYear: postData.historicalYear,
                tags: postData.tags || [],
                coverImage: postData.coverImage || '',
                readingTime: postData.readingTime || 5,
                de: {
                    diary: postData.content?.diary || '',
                    scientific: postData.content?.scientific || ''
                },
                en: {
                    title: postData.translations?.en?.title || '',
                    excerpt: postData.translations?.en?.excerpt || '',
                    diary: postData.translations?.en?.content?.diary || '',
                    scientific: postData.translations?.en?.content?.scientific || ''
                },
                la: {
                    title: postData.translations?.la?.title || '',
                    excerpt: postData.translations?.la?.excerpt || '',
                    diary: postData.translations?.la?.content?.diary || '',
                    scientific: postData.translations?.la?.content?.scientific || ''
                }
            });
        }
    }, [postData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: BlogPost = {
                id: postData?.id || Date.now().toString(),
                slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                author: formData.author,
                title: formData.title,
                latinTitle: formData.latinTitle,
                excerpt: formData.excerpt,
                historicalDate: formData.historicalDate || '50 v. Chr.',
                historicalYear: formData.historicalYear,
                tags: formData.tags,
                coverImage: formData.coverImage,
                readingTime: formData.readingTime,
                date: new Date().toISOString().split('T')[0], // Add current date
                content: {
                    diary: formData.de.diary,
                    scientific: formData.de.scientific
                },
                translations: {
                    en: {
                        title: formData.en.title,
                        excerpt: formData.en.excerpt,
                        content: {
                            diary: formData.en.diary,
                            scientific: formData.en.scientific
                        }
                    },
                    la: {
                        title: formData.la.title,
                        excerpt: formData.la.excerpt,
                        content: {
                            diary: formData.la.diary,
                            scientific: formData.la.scientific
                        }
                    }
                }
            };

            await upsertPost(payload);
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            if (isEditMode) {
                queryClient.invalidateQueries({ queryKey: ['post', payload.author, payload.slug] });
            }
            toast.success(isEditMode ? 'Beitrag aktualisiert' : 'Beitrag erstellt');
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

    const updateLanguageField = (lang: 'de' | 'en' | 'la', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [lang]: { ...prev[lang], [field]: value }
        }));
    };

    if (isFetching && isEditMode) {
        return <div className="min-h-screen pt-20 text-center">Lade Beitrag...</div>;
    }

    return (
        <div className="min-h-screen bg-background pt-16">
            {/* Header */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Zurück zur Übersicht</span>
                        </Link>
                        <div className="h-6 w-px bg-border hidden sm:block" />
                        <h1 className="font-display text-lg sm:text-xl font-medium">
                            {isEditMode ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {isEditMode && postData && (
                            <Button variant="outline" size="sm" asChild>
                                <Link to={`/${postData.author}/post/${postData.slug}`} target="_blank">
                                    <Eye className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Vorschau</span>
                                </Link>
                            </Button>
                        )}
                        <Button onClick={handleSubmit} disabled={loading} size="sm">
                            <Save className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">{loading ? 'Speichern...' : 'Speichern'}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Grundinformationen</CardTitle>
                            <CardDescription>Titel, Autor und Metadaten des Beitrags</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Titel (Deutsch)</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={e => updateField('title', e.target.value)}
                                        placeholder="Mein erster Beitrag"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Lateinischer Titel (optional)</Label>
                                    <Input
                                        value={formData.latinTitle}
                                        onChange={e => updateField('latinTitle', e.target.value)}
                                        placeholder="Commentarii mei"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>Slug (URL)</Label>
                                    <Input
                                        value={formData.slug}
                                        onChange={e => updateField('slug', e.target.value)}
                                        placeholder="Auto-generiert aus Titel"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Autor</Label>
                                    <Select
                                        value={formData.author}
                                        onValueChange={(val: Author) => updateField('author', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="caesar">Caesar</SelectItem>
                                            <SelectItem value="cicero">Cicero</SelectItem>
                                            <SelectItem value="augustus">Augustus</SelectItem>
                                            <SelectItem value="seneca">Seneca</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Historisches Datum</Label>
                                    <Input
                                        value={formData.historicalDate}
                                        onChange={e => updateField('historicalDate', e.target.value)}
                                        placeholder="z.B. 49 v. Chr."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Kurzbeschreibung (Deutsch)</Label>
                                <Textarea
                                    value={formData.excerpt}
                                    onChange={e => updateField('excerpt', e.target.value)}
                                    placeholder="Kurze Zusammenfassung des Beitrags..."
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Cover-Bild URL</Label>
                                <Input
                                    value={formData.coverImage}
                                    onChange={e => updateField('coverImage', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Tabs for Languages */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Inhalte
                            </CardTitle>
                            <CardDescription>Bearbeite den Inhalt in allen verfügbaren Sprachen</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as any)}>
                                <TabsList className="grid w-full grid-cols-3 mb-6">
                                    <TabsTrigger value="de" className="gap-2">
                                        🇩🇪 Deutsch
                                    </TabsTrigger>
                                    <TabsTrigger value="en" className="gap-2">
                                        🇬🇧 English
                                    </TabsTrigger>
                                    <TabsTrigger value="la" className="gap-2">
                                        🏛️ Latinum
                                    </TabsTrigger>
                                </TabsList>

                                {/* German Content */}
                                <TabsContent value="de" className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Tagebuch-Inhalt</Label>
                                        <Textarea
                                            className="min-h-[300px] font-mono text-sm"
                                            value={formData.de.diary}
                                            onChange={e => updateLanguageField('de', 'diary', e.target.value)}
                                            placeholder="Der persönliche Tagebucheintrag aus Sicht des Autors..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Wissenschaftlicher Kommentar</Label>
                                        <Textarea
                                            className="min-h-[200px] font-mono text-sm"
                                            value={formData.de.scientific}
                                            onChange={e => updateLanguageField('de', 'scientific', e.target.value)}
                                            placeholder="Historische Einordnung und wissenschaftliche Analyse..."
                                        />
                                    </div>
                                </TabsContent>

                                {/* English Content */}
                                <TabsContent value="en" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title (English)</Label>
                                            <Input
                                                value={formData.en.title}
                                                onChange={e => updateLanguageField('en', 'title', e.target.value)}
                                                placeholder="English title..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Excerpt (English)</Label>
                                            <Input
                                                value={formData.en.excerpt}
                                                onChange={e => updateLanguageField('en', 'excerpt', e.target.value)}
                                                placeholder="Short description..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Diary Content</Label>
                                        <Textarea
                                            className="min-h-[300px] font-mono text-sm"
                                            value={formData.en.diary}
                                            onChange={e => updateLanguageField('en', 'diary', e.target.value)}
                                            placeholder="Personal diary entry from the author's perspective..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Scientific Commentary</Label>
                                        <Textarea
                                            className="min-h-[200px] font-mono text-sm"
                                            value={formData.en.scientific}
                                            onChange={e => updateLanguageField('en', 'scientific', e.target.value)}
                                            placeholder="Historical context and scholarly analysis..."
                                        />
                                    </div>
                                </TabsContent>

                                {/* Latin Content */}
                                <TabsContent value="la" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Titulus (Latine)</Label>
                                            <Input
                                                value={formData.la.title}
                                                onChange={e => updateLanguageField('la', 'title', e.target.value)}
                                                placeholder="Titulus Latinus..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Summa (Latine)</Label>
                                            <Input
                                                value={formData.la.excerpt}
                                                onChange={e => updateLanguageField('la', 'excerpt', e.target.value)}
                                                placeholder="Brevis descriptio..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Commentarii</Label>
                                        <Textarea
                                            className="min-h-[300px] font-mono text-sm"
                                            value={formData.la.diary}
                                            onChange={e => updateLanguageField('la', 'diary', e.target.value)}
                                            placeholder="Commentarii scriptoris..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Annotatio Doctorum</Label>
                                        <Textarea
                                            className="min-h-[200px] font-mono text-sm"
                                            value={formData.la.scientific}
                                            onChange={e => updateLanguageField('la', 'scientific', e.target.value)}
                                            placeholder="Contextus historicus et analysis doctorum..."
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
