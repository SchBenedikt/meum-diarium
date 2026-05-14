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
import { BlogPost, Author } from '@/types/blog';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, X, Hash, Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { upsertPost } from '@/lib/cms-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPost } from '@/lib/api';
import { useAuthors } from '@/hooks/use-authors';

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
    coverImage: string;
    readingTime: number;
    quoteText: string;
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
    
    // Fetch post data if editing
    const { data: postData, isLoading: isFetching, error: postError } = useQuery({
        queryKey: ['post', author, slug],
        queryFn: async () => {
            if (!isEditMode || !author || !slug) {
                return null;
            }
            return fetchPost(author, slug);
        },
        enabled: isEditMode,
        staleTime: 0, // Disable caching to always fetch fresh data
        refetchOnWindowFocus: true // Refetch when window gains focus
    });
    
    // State for preview functionality
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
        tags: [] as string[],
        coverImage: '',
        readingTime: 5,
        // Sidebar quote
        quoteText: '',
        quoteAuthor: '',
        quoteDate: '',
        quoteSource: '',
        // German content (main)
        de: {
            diary: '',
            scientific: ''
        },
        // English translation (preserved but not shown in UI)
        en: {
            title: '',
            excerpt: '',
            diary: '',
            scientific: ''
        },
        // Latin translation (preserved but not shown in UI)
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
                coverImage: postData.coverImage || '',
                readingTime: postData.readingTime || 5,
                quoteText: postData.sidebar?.quote?.text || '',
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
                tags: formData.tags,
                coverImage: formData.coverImage,
                readingTime: formData.readingTime,
                date: new Date().toISOString().split('T')[0], // Add current date
                content: {
                    diary: formData.de.diary,
                    scientific: formData.de.scientific
                },
                sidebar: (formData.quoteText || formData.quoteAuthor || formData.quoteDate || formData.quoteSource)
                    ? {
                        facts: postData?.sidebar?.facts || [],
                        quote: {
                            text: formData.quoteText,
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
                                    <Label>Titel</Label>
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
                                <Label>Kurzbeschreibung</Label>
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
                    {/* Tags Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Hash className="h-5 w-5" />
                                Tags
                            </CardTitle>
                            <CardDescription>Schlagwörter für den Beitrag</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
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
                                {formData.tags.length === 0 && (
                                    <span className="text-sm text-muted-foreground italic">Noch keine Tags</span>
                                )}
                            </div>
                            <Input
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Tag eingeben und Enter drücken..."
                            />
                        </CardContent>
                    </Card>
                    {/* Sidebar Quote Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                💬 Zitat für Seitenleiste
                            </CardTitle>
                            <CardDescription>Optionales Zitat in der Seitenleiste des Blog-Eintrags</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Zitat</Label>
                                <Textarea
                                    value={formData.quoteText}
                                    onChange={e => updateField('quoteText', e.target.value)}
                                    placeholder="Das Originalzitat..."
                                    rows={3}
                                />
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
                                <Label>Quelle/Stelle (optional)</Label>
                                <Input
                                    value={formData.quoteSource}
                                    onChange={e => updateField('quoteSource', e.target.value)}
                                    placeholder="z.B. Buch III, Kapitel 5"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* Content Editor - Diary / Scientific Tabs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Inhalte</CardTitle>
                            <CardDescription>Bearbeite Tagebuch- und wissenschaftlichen Artikel mit Vorschau</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="diary" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="diary" className="gap-2">
                                        📔 Tagebuch-Artikel
                                    </TabsTrigger>
                                    <TabsTrigger value="scientific" className="gap-2">
                                        📚 Wissenschaftlicher Artikel
                                    </TabsTrigger>
                                </TabsList>
                                {/* Diary Content */}
                                <TabsContent value="diary">
                                    <div className="flex gap-4 h-[600px]">
                                        {/* Left: Markdown Editor */}
                                        <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
                                            <div className="px-3 py-2 bg-muted border-b text-xs font-medium text-muted-foreground">
                                                Markdown
                                            </div>
                                            <FormattingToolbar textareaRef={diaryTextareaRef} />
                                            <textarea
                                                ref={diaryTextareaRef}
                                                value={formData.de.diary}
                                                onChange={e => updateLanguageField('de', 'diary', e.target.value)}
                                                placeholder={"# Überschrift\n\nHier Markdown eingeben...\n\n**Fett** *Kursiv*\n- Listenpunkt 1\n- Listenpunkt 2"}
                                                className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none bg-white dark:bg-[#1a1a1a]"
                                                spellCheck={false}
                                            />
                                        </div>
                                        {/* Right: Live Preview */}
                                        <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-[#f7f6f3] dark:bg-[#1a1a1a]">
                                            <div className="px-3 py-2 bg-white dark:bg-[#191919] border-b text-xs font-medium text-muted-foreground flex items-center gap-2">
                                                <Eye className="w-3 h-3" />
                                                Vorschau
                                            </div>
                                            <ScrollArea className="flex-1">
                                                <div
                                                    className="prose prose-sm dark:prose-invert max-w-none p-4"
                                                    dangerouslySetInnerHTML={{ __html: markdownToHtml(formData.de.diary || '') }}
                                                />
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </TabsContent>
                                {/* Scientific Content */}
                                <TabsContent value="scientific">
                                    <div className="flex gap-4 h-[600px]">
                                        {/* Left: Markdown Editor */}
                                        <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
                                            <div className="px-3 py-2 bg-muted border-b text-xs font-medium text-muted-foreground">
                                                Markdown
                                            </div>
                                            <FormattingToolbar textareaRef={scientificTextareaRef} />
                                            <textarea
                                                ref={scientificTextareaRef}
                                                value={formData.de.scientific}
                                                onChange={e => updateLanguageField('de', 'scientific', e.target.value)}
                                                placeholder={"# Wissenschaftliche Analyse\n\nHier Markdown eingeben...\n\n**Fett** *Kursiv*\n- Listenpunkt 1\n- Listenpunkt 2"}
                                                className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none bg-white dark:bg-[#1a1a1a]"
                                                spellCheck={false}
                                            />
                                        </div>
                                        {/* Right: Live Preview */}
                                        <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-[#f7f6f3] dark:bg-[#1a1a1a]">
                                            <div className="px-3 py-2 bg-white dark:bg-[#191919] border-b text-xs font-medium text-muted-foreground flex items-center gap-2">
                                                <Eye className="w-3 h-3" />
                                                Vorschau
                                            </div>
                                            <ScrollArea className="flex-1">
                                                <div
                                                    className="prose prose-sm dark:prose-invert max-w-none p-4"
                                                    dangerouslySetInnerHTML={{ __html: markdownToHtml(formData.de.scientific || '') }}
                                                />
                                            </ScrollArea>
                                        </div>
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
