
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
                translations: post?.translations || {}
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
                    <div className=Legacy Title (Fallback)</Label>
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
                                placeholder="Titel für wissenschaftliche Perspektiv
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="Auto-generated from title"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Author</Label>
                        <Select
                            value={formData.author}
                            onV📔 Content (Tagebuch)</Label>
                        <Textarea
                            className="min-h-[200px] font-mono"
                            value={formData.contentDiary}
                            onChange={e => setFormData({ ...formData, contentDiary: e.target.value })}
                            placeholder="Persönlicher Tagebuch-Inhalt..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>📚 Content (Wissenschaftlich)</Label>
                        <Textarea
                            className="min-h-[200px] font-mono"
                            value={formData.contentScientific}
                            onChange={e => setFormData({ ...formData, contentScientific: e.target.value })}
                            placeholder="Wissenschaftlicher Inhalt..."
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
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Content (Diary)</Label>
                        <Textarea
                            className="min-h-[200px] font-mono"
                            value={formData.contentDiary}
                            onChange={e => setFormData({ ...formData, contentDiary: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Post'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
