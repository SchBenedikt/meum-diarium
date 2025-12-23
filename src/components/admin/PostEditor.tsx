
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlogPost, Author } from '@/types/blog';
import { toast } from 'sonner';

interface PostEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post?: BlogPost; // If provided, edit mode
    onSuccess: () => void;
}

export function PostEditor({ open, onOpenChange, post, onSuccess }: PostEditorProps) {
    const [loading, setLoading] = useState(false);

    // Simple state for form for now
    const [formData, setFormData] = useState({
        title: post?.title || '',
        diaryTitle: post?.diaryTitle || '',
        scientificTitle: post?.scientificTitle || '',
        slug: post?.slug || '',
        author: post?.author || 'caesar',
        excerpt: post?.excerpt || '',
        contentDiary: post?.content.diary || '',
        contentScientific: post?.content.scientific || '',
        quoteText: post?.sidebar?.quote?.text || '',
        quoteTranslation: post?.sidebar?.quote?.translation || '',
        quoteAuthor: post?.sidebar?.quote?.author || '',
        quoteDate: post?.sidebar?.quote?.date || '',
        quoteSource: post?.sidebar?.quote?.source || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                id: post?.id || Date.now().toString(), // simplified ID gen
                slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
                author: formData.author,
                title: formData.title || formData.diaryTitle || formData.scientificTitle || '',
                diaryTitle: formData.diaryTitle,
                scientificTitle: formData.scientificTitle,
                excerpt: formData.excerpt,
                content: {
                    diary: formData.contentDiary,
                    scientific: formData.contentScientific
                },
                // Default values for required fields
                historicalDate: post?.historicalDate || '50 v. Chr.',
                historicalYear: post?.historicalYear || -50,
                tags: post?.tags || [],
                translations: post?.translations || {},
                sidebar: {
                    ...(post?.sidebar || {}),
                    quote: (formData.quoteText || formData.quoteTranslation || formData.quoteAuthor || formData.quoteDate || formData.quoteSource)
                      ? {
                          text: formData.quoteText,
                          translation: formData.quoteTranslation || undefined,
                          author: formData.quoteAuthor || undefined,
                          date: formData.quoteDate || undefined,
                          source: formData.quoteSource || undefined,
                        }
                      : undefined,
                },
            };

            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(post ? 'Post updated' : 'Post created');
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error('Failed to save post');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{post ? 'Edit Post' : 'Create New Post'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Legacy Title (Fallback)</Label>
                            <Input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Optional: Falls beide Titel leer sind"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="Auto-generated from title"
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
                                onChange={e => setFormData({ ...formData, diaryTitle: e.target.value })}
                                placeholder="Titel für Tagebuch-Perspektive"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-primary flex items-center gap-2">
                                📚 Wissenschaftlicher Titel
                            </Label>
                            <Input
                                value={formData.scientificTitle}
                                onChange={e => setFormData({ ...formData, scientificTitle: e.target.value })}
                                placeholder="Titel für wissenschaftliche Perspektive"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Author</Label>
                        <Select
                            value={formData.author}
                            onValueChange={value => setFormData({ ...formData, author: value })}
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
                        <Label>Excerpt</Label>
                        <Textarea
                            value={formData.excerpt}
                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Kurze Zusammenfassung des Beitrags"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">📔 Content (Tagebuch)</Label>
                        <Textarea
                            className="min-h-[200px] font-mono"
                            value={formData.contentDiary}
                            onChange={e => setFormData({ ...formData, contentDiary: e.target.value })}
                            placeholder="Persönlicher Tagebuch-Inhalt..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">📚 Content (Wissenschaftlich)</Label>
                        <Textarea
                            className="min-h-[200px] font-mono"
                            value={formData.contentScientific}
                            onChange={e => setFormData({ ...formData, contentScientific: e.target.value })}
                            placeholder="Wissenschaftlicher Inhalt..."
                        />
                    </div>

                    <div className="space-y-3 p-4 border border-border/60 rounded-lg bg-secondary/30">
                        <Label className="font-semibold">Zitat in der Seitenleiste</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label>Zitat (Original)</Label>
                                <Textarea
                                    value={formData.quoteText}
                                    onChange={e => setFormData({ ...formData, quoteText: e.target.value })}
                                    placeholder="Originalzitat..."
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Übersetzung (optional)</Label>
                                <Textarea
                                    value={formData.quoteTranslation}
                                    onChange={e => setFormData({ ...formData, quoteTranslation: e.target.value })}
                                    placeholder="Übersetzung des Zitats..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Autor/Quelle</Label>
                                <Input
                                    value={formData.quoteAuthor}
                                    onChange={e => setFormData({ ...formData, quoteAuthor: e.target.value })}
                                    placeholder="z. B. Cicero, De Officiis"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Datum (optional)</Label>
                                <Input
                                    value={formData.quoteDate}
                                    onChange={e => setFormData({ ...formData, quoteDate: e.target.value })}
                                    placeholder="z. B. 45 v. Chr."
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Quelle (optional)</Label>
                                <Input
                                    value={formData.quoteSource}
                                    onChange={e => setFormData({ ...formData, quoteSource: e.target.value })}
                                    placeholder="z. B. Buch/Redetitel, Kapitel, Abschnitt"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Post'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
