import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogPost, Author, TagWithTranslations } from '@/types/blog';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, Globe, X, Hash, Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { upsertPost } from '@/lib/cms-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPost } from '@/lib/api';
import { useAuthors } from '@/hooks/use-authors';
import { MultilingualTagEditor } from '@/components/admin/MultilingualTagEditor';

// Markdown to HTML converter for preview
const markdownToHtml = (markdown: string): string => {
    if (!markdown) return '<p class="text-muted-foreground italic">Noch kein Inhalt...</p>';
    if (markdown.trim().startsWith('<')) return markdown;
    
    return markdown
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/```\n?([\s\S]*?)\n?```/g, '<pre><code>$1</code></pre>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/gs, '<ul>$&</ul>')
        .split('\n\n')
        .map(p => p.trim())
        .filter(p => p && !p.match(/^<[houbp]/))
        .map(p => `<p>${p}</p>`)
        .join('\n');
};

// Helper to insert markdown formatting
const insertMarkdown = (
    textarea: HTMLTextAreaElement | null,
    before: string,
    after: string = ''
) => {
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    
    // Update value and restore selection
    textarea.value = newText;
    textarea.setSelectionRange(start + before.length, end + before.length);
    textarea.focus();
    
    // Trigger change event
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
};

// Formatting toolbar component
const FormattingToolbar = ({ textareaRef }: { textareaRef: React.RefObject<HTMLTextAreaElement> }) => {
    const buttons = [
        { icon: Bold, title: 'Fett', action: () => insertMarkdown(textareaRef.current, '**', '**') },
        { icon: Italic, title: 'Kursiv', action: () => insertMarkdown(textareaRef.current, '*', '*') },
        { icon: Heading1, title: 'Überschrift 1', action: () => insertMarkdown(textareaRef.current, '# ') },
        { icon: Heading2, title: 'Überschrift 2', action: () => insertMarkdown(textareaRef.current, '## ') },
        { icon: Heading3, title: 'Überschrift 3', action: () => insertMarkdown(textareaRef.current, '### ') },
        { icon: List, title: 'Liste', action: () => insertMarkdown(textareaRef.current, '- ') },
        { icon: ListOrdered, title: 'Nummerierung', action: () => insertMarkdown(textareaRef.current, '1. ') },
        { icon: Quote, title: 'Zitat', action: () => insertMarkdown(textareaRef.current, '> ') },
        { icon: Code, title: 'Code', action: () => insertMarkdown(textareaRef.current, '`', '`') },
        { icon: Minus, title: 'Trennlinie', action: () => insertMarkdown(textareaRef.current, '\n---\n') },
    ];

    return (
        <div className="flex items-center gap-1 px-2 py-1.5 bg-muted border-b">
            {buttons.map((btn) => (
                <button
                    key={btn.title}
                    type="button"
                    onClick={btn.action}
                    title={btn.title}
                    className="px-2 py-1 text-xs font-medium rounded hover:bg-accent hover:text-accent-foreground transition-colors min-w-[28px]"
                >
                    <btn.icon className="w-3 h-3" />
                </button>
            ))}
        </div>
    );
};
interface PostFormData {
    title: string;
    diaryTitle: string;
    scientificTitle: string;
    latinTitle: string;
    slug: string;
    author: Author;
    excerpt: string;
    historicalDate: string;
    historicalYear: number;
    tags: string[];
    tagsWithTranslations: TagWithTranslations[];
    coverImage: string;
    readingTime: number;
    quoteText: string;
    quoteTranslationDe: string;
    quoteTranslationEn: string;
    quoteTranslationLa: string;
    quoteAuthor: string;
    quoteDate: string;
    quoteSource: string;
    de: {
        diary: string;
        scientific: string;
    };
    en: {
        title: string;
        excerpt: string;
        diary: string;
        scientific: string;
    };
    la: {
        title: string;
        excerpt: string;
        diary: string;
        scientific: string;
    };
}

export default function PostEditorPage() {
    const { author, slug } = useParams<{ author: string; slug: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditMode = !!slug;
    const { authors } = useAuthors();
    const [loading, setLoading] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState<'de' | 'en' | 'la'>('de');
    
    console.log('🔍 [PostEditorPage] Params:', { author, slug, isEditMode });
    
    // Fetch post data if editing
    const { data: postData, isLoading: isFetching, error: postError } = useQuery({
        queryKey: ['post', author, slug],
        queryFn: async () => {
            console.log('🔄 [PostEditorPage] Fetching post data...');
            if (!isEditMode || !author || !slug) {
                console.log('⚠️ [PostEditorPage] Missing params for edit mode');
                return null;
            }
            
            try {
                const result = await fetchPost(author, slug);
                console.log('✅ [PostEditorPage] Successfully fetched post data:', result);
                return result;
            } catch (error) {
                console.error('❌ [PostEditorPage] Error fetching post:', error);
                
                // Check if error is a JSON parsing error
                if (error instanceof SyntaxError && error.message.includes('JSON')) {
                    console.error('🚨 [PostEditorPage] JSON parsing error - likely received HTML instead of JSON');
                    console.error('🔍 [PostEditorPage] This usually indicates a service worker caching issue');
                    console.error('💡 [PostEditorPage] Try clearing caches with: clearApiCaches() in console');
                }
                
                throw error;
            }
        },
        enabled: isEditMode,
        staleTime: 0, // Disable caching to always fetch fresh data
        refetchOnWindowFocus: true // Refetch when window gains focus
    });
    
    console.log('📊 [PostEditorPage] Post data:', { postData, isFetching, postError });
    
    // State for preview functionality
    const [showPreview, setShowPreview] = useState(true);
    const diaryTextareaRef = useRef<HTMLTextAreaElement>(null);
    const scientificTextareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Form state definition
    const [formData, setFormData] = useState({
        // Basic info
        title: '',
        diaryTitle: '',
        scientificTitle: '',
        latinTitle: '',
        slug: '',
        author: 'caesar' as Author,
        excerpt: '',
        historicalDate: '',
        historicalYear: -50,
        tags: [] as string[], // Legacy tags
        tagsWithTranslations: [] as TagWithTranslations[], // New multilingual tags
        coverImage: '',
        readingTime: 5,
        // Sidebar quote
        quoteText: '',
        quoteTranslationDe: '',
        quoteTranslationEn: '',
        quoteTranslationLa: '',
        quoteAuthor: '',
        quoteDate: '',
        quoteSource: '',
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
    const [tagInput, setTagInput] = useState('');
    // Populate form when data arrives
    useEffect(() => {
        if (postData) {
            setFormData({
                title: postData.title,
                diaryTitle: postData.diaryTitle || '',
                scientificTitle: postData.scientificTitle || '',
                latinTitle: postData.latinTitle || '',
                slug: postData.slug,
                author: postData.author,
                excerpt: postData.excerpt,
                historicalDate: postData.historicalDate,
                historicalYear: postData.historicalYear,
                tags: postData.tags || [],
                tagsWithTranslations: postData.tagsWithTranslations || [],
                coverImage: postData.coverImage || '',
                readingTime: postData.readingTime || 5,
                quoteText: postData.sidebar?.quote?.text || '',
                quoteTranslationDe: postData.sidebar?.quote?.translations?.de || '',
                quoteTranslationEn: postData.sidebar?.quote?.translations?.en || '',
                quoteTranslationLa: postData.sidebar?.quote?.translations?.la || '',
                quoteAuthor: postData.sidebar?.quote?.author || '',
                quoteDate: postData.sidebar?.quote?.date || '',
                quoteSource: postData.sidebar?.quote?.source || '',
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
            // Generate legacy tags from multilingual tags for backward compatibility
            const legacyTags = formData.tagsWithTranslations.length > 0
                ? formData.tagsWithTranslations.map(t => t.translations.de)
                : formData.tags;
            const payload: BlogPost = {
                id: postData?.id || Date.now().toString(),
                slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                author: formData.author,
                title: formData.title,
                diaryTitle: formData.diaryTitle,
                scientificTitle: formData.scientificTitle,
                latinTitle: formData.latinTitle,
                excerpt: formData.excerpt,
                historicalDate: formData.historicalDate || '50 v. Chr.',
                historicalYear: formData.historicalYear,
                tags: legacyTags, // Legacy format
                tagsWithTranslations: formData.tagsWithTranslations, // New multilingual format
                coverImage: formData.coverImage,
                readingTime: formData.readingTime,
                date: new Date().toISOString().split('T')[0], // Add current date
                content: {
                    diary: formData.de.diary,
                    scientific: formData.de.scientific
                },
                sidebar: (formData.quoteText || formData.quoteTranslationDe || formData.quoteTranslationEn || formData.quoteTranslationLa || formData.quoteAuthor || formData.quoteDate || formData.quoteSource)
                    ? {
                        facts: postData?.sidebar?.facts || [],
                        quote: {
                            text: formData.quoteText,
                            translations: {
                                de: formData.quoteTranslationDe || undefined,
                                en: formData.quoteTranslationEn || undefined,
                                la: formData.quoteTranslationLa || undefined,
                            },
                            author: formData.quoteAuthor || undefined,
                            date: formData.quoteDate || undefined,
                            source: formData.quoteSource || undefined,
                        }
                    }
                    : postData?.sidebar,
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
    const updateField = (field: keyof PostFormData, value: PostFormData[keyof PostFormData]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const updateLanguageField = (lang: 'de' | 'en' | 'la', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [lang]: { ...prev[lang], [field]: value }
        }));
    };
    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = tagInput.trim();
            if (tag && !formData.tags.includes(tag)) {
                updateField('tags', [...formData.tags, tag]);
            }
            setTagInput('');
        }
    };
    const removeTag = (tagToRemove: string) => {
        updateField('tags', formData.tags.filter(t => t !== tagToRemove));
    };
    if (isFetching && isEditMode) {
        return <div className="min-h-screen pt-20 text-center">Lade Beitrag...</div>;
    }
    if (postError) {
        return <div className="min-h-screen pt-20 text-center">
            <div className="text-destructive mb-4">Fehler beim Laden: {postError.message}</div>
            {postError instanceof SyntaxError && postError.message.includes('JSON') && (
                <div className="max-w-md mx-auto space-y-4 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                    <div className="text-amber-800">
                        <p className="font-semibold">🔍 Dies ist ein Caching-Problem:</p>
                        <div className="text-sm mt-2 space-y-2">
                            <p><strong>Option 1 (Empfohlen):</strong></p>
                            <ul className="ml-4 space-y-1">
                                <li>• Öffne die Browser-Konsole (F12)</li>
                                <li>• Gib ein: <code className="bg-amber-100 px-1 rounded">unregisterSW()</code></li>
                                <li>• Seite wird automatisch neu geladen</li>
                            </ul>
                            <p><strong>Option 2 (Manuell):</strong></p>
                            <ul className="ml-4 space-y-1">
                                <li>• Browser schließen und neu öffnen</li>
                                <li>• Oder: Hard-Refresh mit Ctrl+Shift+R (Cmd+Shift+R)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            <Button onClick={() => navigate('/admin')} className="mt-4">
                Zurück zum Admin
            </Button>
        </div>;
    }
    return (
        <div className="bg-background">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
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
                        {/* Preview Toggle Button */}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            className="ml-auto"
                        >
                            <Eye className="w-3 h-3" />
                            <span className="hidden sm:inline ml-1">
                                {showPreview ? 'Editor' : 'Vorschau'}
                            </span>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
                                <div className="space-y-2">
                                    <Label className="text-primary flex items-center gap-2">
                                        📔 Tagebuch-Titel
                                    </Label>
                                    <Input
                                        value={formData.diaryTitle}
                                        onChange={e => updateField('diaryTitle', e.target.value)}
                                        placeholder="Titel für Tagebuch-Perspektive"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-primary flex items-center gap-2">
                                        📚 Wissenschaftlicher Titel
                                    </Label>
                                    <Input
                                        value={formData.scientificTitle}
                                        onChange={e => updateField('scientificTitle', e.target.value)}
                                        placeholder="Titel für wissenschaftliche Perspektive"
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
                                            {Object.entries(authors || {}).map(([id, a]) => (
                                                <SelectItem key={id} value={id as Author}>
                                                    {a.name || id}
                                                </SelectItem>
                                            ))}
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
                    {/* Multilingual Tags Section */}
                    <MultilingualTagEditor
                        tags={formData.tagsWithTranslations}
                        onChange={(tags) => updateField('tagsWithTranslations', tags)}
                    />
                    {/* Legacy Tags Section (for backward compatibility) */}
                    {formData.tags.length > 0 && formData.tagsWithTranslations.length === 0 && (
                        <Card className="border-amber-500/30 bg-amber-500/5">
                            <CardHeader>
                                <CardTitle className="text-amber-600 flex items-center gap-2">
                                    <Hash className="h-5 w-5" />
                                    Legacy Tags (Alte Formatierung)
                                </CardTitle>
                                <CardDescription>
                                    Diese Tags sind im alten Format. Bitte migriere sie zu mehrsprachigen Tags.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1">
                                                <Hash className="h-3 w-3" />
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1 hover:text-destructive transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <Input
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Tag eingeben und Enter drücken..."
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            // Migrate legacy tags to multilingual format
                                            const migratedTags = formData.tags.map(tag => ({
                                                id: tag.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                                                translations: {
                                                    de: tag,
                                                    en: tag,
                                                    la: tag
                                                }
                                            }));
                                            updateField('tagsWithTranslations', migratedTags);
                                            updateField('tags', []);
                                            toast.success('Tags wurden migriert');
                                        }}
                                        className="w-full"
                                    >
                                        Zu mehrsprachigen Tags migrieren
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {/* Sidebar Quote Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                💬 Zitat für Seitenleiste
                            </CardTitle>
                            <CardDescription>Füge ein optionales Zitat hinzu, das in der Seitenleiste des Blog-Eintrags angezeigt wird</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Zitat (Original)</Label>
                                <Textarea
                                    value={formData.quoteText}
                                    onChange={e => updateField('quoteText', e.target.value)}
                                    placeholder="Das Originalzitat in seiner ursprünglichen Sprache..."
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-3 p-4 border border-border/60 rounded-lg bg-secondary/20">
                                <Label className="font-semibold">Übersetzungen (optional)</Label>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label className="text-sm flex items-center gap-2">
                                            🇩🇪 Deutsche Übersetzung
                                        </Label>
                                        <Textarea
                                            value={formData.quoteTranslationDe}
                                            onChange={e => updateField('quoteTranslationDe', e.target.value)}
                                            placeholder="Deutsche Übersetzung des Zitats..."
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm flex items-center gap-2">
                                            🇬🇧 Englische Übersetzung
                                        </Label>
                                        <Textarea
                                            value={formData.quoteTranslationEn}
                                            onChange={e => updateField('quoteTranslationEn', e.target.value)}
                                            placeholder="English translation of the quote..."
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm flex items-center gap-2">
                                            🏛️ Lateinische Übersetzung
                                        </Label>
                                        <Textarea
                                            value={formData.quoteTranslationLa}
                                            onChange={e => updateField('quoteTranslationLa', e.target.value)}
                                            placeholder="Translatio Latina citationis..."
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Autor/Quelle</Label>
                                    <Input
                                        value={formData.quoteAuthor}
                                        onChange={e => updateField('quoteAuthor', e.target.value)}
                                        placeholder="z.B. Cicero, De Officiis"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Datum (optional)</Label>
                                    <Input
                                        value={formData.quoteDate}
                                        onChange={e => updateField('quoteDate', e.target.value)}
                                        placeholder="z.B. 45 v. Chr."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Zusätzliche Quelle (optional)</Label>
                                <Input
                                    value={formData.quoteSource}
                                    onChange={e => updateField('quoteSource', e.target.value)}
                                    placeholder="z.B. Buch III, Kapitel 5, Abschnitt 21"
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
                            <Tabs value={activeLanguage} onValueChange={(v: 'de' | 'en' | 'la') => setActiveLanguage(v)}>
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
                                    <div className="flex gap-4 h-[600px]">
                                        {/* Left: Raw Markdown Editor */}
                                        <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
                                            <div className="px-3 py-2 bg-muted border-b text-xs font-medium text-muted-foreground flex items-center gap-2">
                                                Markdown
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowPreview(!showPreview)}
                                                    className="ml-auto"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <FormattingToolbar textareaRef={diaryTextareaRef} />
                                            <Textarea
                                                ref={diaryTextareaRef}
                                                onChange={e => updateLanguageField('de', 'diary', e.target.value)}
                                                placeholder="# Überschrift\n\nHier Markdown eingeben...\n\n**Fett** *Kursiv*\n- Listenpunkt 1\n- Listenpunkt 2"
                                                className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none bg-white dark:bg-[#1a1a1a]"
                                                spellCheck={false}
                                            />
                                        </div>
                                        {/* Right: Live Preview */}
                                        <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-[#f7f6f3] dark:bg-[#1a1a1a]">
                                            <div className="px-3 py-2 bg-white dark:bg-[#191919] border-b text-xs font-medium text-muted-foreground flex items-center gap-2">
                                                <Eye className="w-3 h-3" />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowPreview(!showPreview)}
                                                    className="ml-auto"
                                                >
                                                    Markdown
                                                </Button>
                                            </div>
                                            <ScrollArea className="flex-1">
                                                <div 
                                                    className="prose prose-sm dark:prose-invert max-w-none p-4"
                                                    dangerouslySetInnerHTML={{ __html: markdownToHtml(formData.de.diary || '') }}
                                                />
                                            </ScrollArea>
                                        </div>
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
