import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, X, Eye, Bold, Italic, List, Quote, Code } from 'lucide-react';
import { upsertLexiconEntry } from '@/lib/cms-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLexiconEntry } from '@/lib/api';

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

const insertMarkdown = (textarea: HTMLTextAreaElement | null, before: string, after = '') => {
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    textarea.value = newText;
    textarea.setSelectionRange(start + before.length, end + before.length);
    textarea.focus();
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
};

interface LexiconFormData {
    term: string;
    slug: string;
    category: string;
    definition: string;
    etymology: string;
    variants: string[];
    relatedTerms: string[];
}

export default function LexiconEditorPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditMode = !!slug && slug !== 'new';
    const [loading, setLoading] = useState(false);
    const definitionRef = useRef<HTMLTextAreaElement>(null);

    // Fetch entry
    const { data: existingEntry, isLoading } = useQuery({
        queryKey: ['lexicon', slug],
        queryFn: () => {
            if (!isEditMode || !slug) return null;
            return fetchLexiconEntry(slug);
        },
        enabled: isEditMode
    });
    const [formData, setFormData] = useState<LexiconFormData>({
        term: '',
        slug: '',
        category: 'Politik',
        definition: '',
        etymology: '',
        variants: [],
        relatedTerms: [],
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
                variants: Array.isArray(existingEntry.variants) ? existingEntry.variants : [],
                relatedTerms: Array.isArray(existingEntry.relatedTerms) ? existingEntry.relatedTerms : [],
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
                translations: {}
            };
            await upsertLexiconEntry(payload);
            queryClient.invalidateQueries({ queryKey: ['lexicon'] });
            if (isEditMode) {
                queryClient.invalidateQueries({ queryKey: ['lexicon', payload.slug] });
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

    const updateField = <K extends keyof LexiconFormData>(field: K, value: LexiconFormData[K]) => {
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

    if (isLoading && isEditMode) {
        return <div className="min-h-screen pt-20 text-center">Lade Eintrag...</div>;
    }

    return (
        <div className="bg-background">
            {/* Header – flush to top (same as PostEditorPage) */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
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

            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basisdaten */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basisdaten</CardTitle>
                            <CardDescription>Begriff, Kategorie und Slug</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Begriff</Label>
                                    <Input
                                        value={formData.term}
                                        onChange={e => updateField('term', e.target.value)}
                                        placeholder="Konsul"
                                        required
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
                                <div className="space-y-2">
                                    <Label>Slug (URL)</Label>
                                    <Input
                                        value={formData.slug}
                                        onChange={e => updateField('slug', e.target.value)}
                                        placeholder="auto-generated"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Definition mit Markdown-Editor + Vorschau */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Definition</CardTitle>
                            <CardDescription>Markdown-Formatierung möglich – Vorschau rechts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 h-[400px]">
                                {/* Left: Markdown editor */}
                                <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
                                    <div className="px-3 py-1.5 bg-muted border-b text-xs font-medium text-muted-foreground">
                                        Markdown
                                    </div>
                                    {/* Toolbar */}
                                    <div className="flex items-center gap-1 px-2 py-1.5 bg-muted border-b">
                                        {[
                                            { icon: Bold,   title: 'Fett',    before: '**', after: '**' },
                                            { icon: Italic, title: 'Kursiv',  before: '*',  after: '*'  },
                                            { icon: List,   title: 'Liste',   before: '- ', after: ''   },
                                            { icon: Quote,  title: 'Zitat',   before: '> ', after: ''   },
                                            { icon: Code,   title: 'Code',    before: '`',  after: '`'  },
                                        ].map(btn => (
                                            <button
                                                key={btn.title}
                                                type="button"
                                                onClick={() => insertMarkdown(definitionRef.current, btn.before, btn.after)}
                                                title={btn.title}
                                                className="px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                <btn.icon className="w-3 h-3" />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        ref={definitionRef}
                                        value={formData.definition}
                                        onChange={e => updateField('definition', e.target.value)}
                                        placeholder={"**Konsul** war das höchste Amt in der römischen Republik...\n\n- Amtszeit: 1 Jahr\n- Immer zwei Konsuln gleichzeitig"}
                                        className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none bg-white dark:bg-[#1a1a1a]"
                                        spellCheck={false}
                                    />
                                </div>
                                {/* Right: Live preview */}
                                <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-[#f7f6f3] dark:bg-[#1a1a1a]">
                                    <div className="px-3 py-1.5 bg-white dark:bg-[#191919] border-b text-xs font-medium text-muted-foreground flex items-center gap-2">
                                        <Eye className="w-3 h-3" />
                                        Vorschau
                                    </div>
                                    <ScrollArea className="flex-1">
                                        <div
                                            className="prose prose-sm dark:prose-invert max-w-none p-4"
                                            dangerouslySetInnerHTML={{ __html: markdownToHtml(formData.definition || '') }}
                                        />
                                    </ScrollArea>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Etymologie */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Etymologie &amp; Hintergrund</CardTitle>
                            <CardDescription>Herkunft des Wortes und historischer Kontext</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                value={formData.etymology}
                                onChange={e => updateField('etymology', e.target.value)}
                                placeholder="Herkunft des Wortes..."
                                rows={4}
                                className="w-full p-3 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-white dark:bg-[#1a1a1a]"
                            />
                        </CardContent>
                    </Card>

                    {/* Varianten & Verwandte Begriffe */}
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
                </form>
            </div>
        </div>
    );
}
