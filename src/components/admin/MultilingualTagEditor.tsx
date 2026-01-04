import { useState } from 'react';
import { TagWithTranslations } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Edit, Check, Globe, Hash, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MultilingualTagEditorProps {
    tags: TagWithTranslations[];
    onChange: (tags: TagWithTranslations[]) => void;
}

export function MultilingualTagEditor({ tags, onChange }: MultilingualTagEditorProps) {
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [editingTagId, setEditingTagId] = useState<string | null>(null);
    const [newTag, setNewTag] = useState({
        de: '',
        en: '',
        la: ''
    });

    const handleAddTag = () => {
        if (!newTag.de.trim()) {
            return;
        }

        const tagId = newTag.de.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
        
        const newTagData: TagWithTranslations = {
            id: tagId,
            translations: {
                de: newTag.de.trim(),
                en: newTag.en.trim() || newTag.de.trim(),
                la: newTag.la.trim() || newTag.de.trim()
            }
        };

        onChange([...tags, newTagData]);
        setNewTag({ de: '', en: '', la: '' });
        setIsAddingTag(false);
    };

    const handleUpdateTag = (tagId: string) => {
        const updatedTags = tags.map(tag => {
            if (tag.id === tagId) {
                return {
                    ...tag,
                    translations: {
                        de: newTag.de.trim() || tag.translations.de,
                        en: newTag.en.trim() || tag.translations.en,
                        la: newTag.la.trim() || tag.translations.la
                    }
                };
            }
            return tag;
        });
        
        onChange(updatedTags);
        setEditingTagId(null);
        setNewTag({ de: '', en: '', la: '' });
    };

    const handleRemoveTag = (tagId: string) => {
        onChange(tags.filter(tag => tag.id !== tagId));
    };

    const startEditing = (tag: TagWithTranslations) => {
        setEditingTagId(tag.id);
        setNewTag({
            de: tag.translations.de,
            en: tag.translations.en,
            la: tag.translations.la
        });
    };

    const cancelEditing = () => {
        setEditingTagId(null);
        setIsAddingTag(false);
        setNewTag({ de: '', en: '', la: '' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    Mehrsprachige Tags
                </CardTitle>
                <CardDescription>
                    Verwalte Tags in Deutsch, Englisch und Latein
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Existing Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map(tag => (
                        <div key={tag.id} className="group relative">
                            {editingTagId === tag.id ? (
                                <div className="inline-flex items-center gap-1 bg-primary/10 border border-primary/30 rounded-md px-2 py-1">
                                    <span className="text-xs text-primary">Bearbeiten...</span>
                                </div>
                            ) : (
                                <Badge 
                                    variant="secondary" 
                                    className="gap-2 px-3 py-1.5 hover:bg-secondary/80 transition-colors cursor-default"
                                >
                                    <Globe className="h-3 w-3 text-muted-foreground" />
                                    <div className="flex flex-col gap-0.5 items-start">
                                        <span className="text-xs font-semibold">{tag.translations.de}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            EN: {tag.translations.en} • LA: {tag.translations.la}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 ml-2">
                                        <button
                                            type="button"
                                            onClick={() => startEditing(tag)}
                                            className="hover:text-primary transition-colors"
                                        >
                                            <Edit className="h-3 w-3" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag.id)}
                                            className="hover:text-destructive transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>

                {/* Edit Form */}
                {(isAddingTag || editingTagId) && (
                    <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" />
                                {editingTagId ? 'Tag bearbeiten' : 'Neues Tag hinzufügen'}
                            </h4>
                        </div>

                        <Tabs defaultValue="de" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="de">🇩🇪 Deutsch</TabsTrigger>
                                <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                                <TabsTrigger value="la">🏛️ Latinum</TabsTrigger>
                            </TabsList>

                            <TabsContent value="de" className="space-y-2">
                                <Label className="text-xs">Deutscher Tag-Name</Label>
                                <Input
                                    value={newTag.de}
                                    onChange={e => setNewTag({ ...newTag, de: e.target.value })}
                                    placeholder="z.B. Kriegsführung, Politik, Philosophie"
                                    autoFocus
                                />
                                {!editingTagId && (
                                    <p className="text-xs text-muted-foreground">
                                        Falls EN/LA leer bleiben, wird der deutsche Name verwendet
                                    </p>
                                )}
                            </TabsContent>

                            <TabsContent value="en" className="space-y-2">
                                <Label className="text-xs">English Tag Name</Label>
                                <Input
                                    value={newTag.en}
                                    onChange={e => setNewTag({ ...newTag, en: e.target.value })}
                                    placeholder="e.g. Warfare, Politics, Philosophy"
                                />
                            </TabsContent>

                            <TabsContent value="la" className="space-y-2">
                                <Label className="text-xs">Nomen Latinum</Label>
                                <Input
                                    value={newTag.la}
                                    onChange={e => setNewTag({ ...newTag, la: e.target.value })}
                                    placeholder="e.g. Bellum, Politica, Philosophia"
                                />
                            </TabsContent>
                        </Tabs>

                        <div className="flex gap-2 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={cancelEditing}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Abbrechen
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => editingTagId ? handleUpdateTag(editingTagId) : handleAddTag()}
                                disabled={!newTag.de.trim()}
                            >
                                <Check className="h-4 w-4 mr-2" />
                                {editingTagId ? 'Speichern' : 'Hinzufügen'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Add Button */}
                {!isAddingTag && !editingTagId && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingTag(true)}
                        className="w-full"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Neues Tag hinzufügen
                    </Button>
                )}

                {/* Info Box */}
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
                    <div className="flex gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                            <p className="font-semibold text-blue-600">Mehrsprachige Tags</p>
                            <p className="text-xs text-blue-900/70 dark:text-blue-100/70">
                                Tags werden automatisch in der aktuellen Sprache des Benutzers angezeigt. 
                                Stelle sicher, dass wichtige Tags in allen Sprachen vorhanden sind.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
