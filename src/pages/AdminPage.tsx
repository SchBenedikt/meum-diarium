
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePosts } from '@/hooks/use-posts';
import { lexicon } from '@/data/lexicon';
import { authors } from '@/data/authors';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Edit, Trash2, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { PostEditor } from '@/components/admin/PostEditor';

export default function AdminPage() {
    const { t } = useLanguage();
    const { posts } = usePosts();
    const [theme, setTheme] = useState('light');
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);

    // Mocks for edit actions - since we don't have a backend
    const handleEdit = (id: string, type: 'post' | 'author' | 'lexicon') => {
        toast.info(`Edit feature coming in next step for ${type}`);
    };

    const handleDelete = async (id: string, type: 'post' | 'author' | 'lexicon') => {
        if (!window.confirm('Are you sure you want to delete this?')) return;

        if (type === 'post') {
            // Find post to get author and slug
            const post = posts.find(p => p.id === id);
            if (!post) return;

            try {
                const res = await fetch(`/api/posts/${post.author}/${post.slug}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    toast.success('Post deleted successfully');
                    // Reload window to reflect changes (simple refresh since usePosts is static)
                    window.location.reload();
                } else {
                    toast.error('Failed to delete post');
                }
            } catch (e) {
                toast.error('Error deleting post');
            }
        } else {
            toast.info(`Delete ${type} - Backend implementation required for this type`);
        }
    };

    const handleCreate = (type: 'post' | 'author' | 'lexicon') => {
        if (type === 'post') {
            setEditingPost(undefined);
            setEditorOpen(true);
        } else {
            toast.info(`Create ${type} coming soon`);
        }
    }

    return (
        <div className="container mx-auto py-24 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage content across all languages.</p>
                </div>
            </div>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="posts">Blog Posts</TabsTrigger>
                    <TabsTrigger value="authors">Authors</TabsTrigger>
                    <TabsTrigger value="lexicon">Lexicon</TabsTrigger>
                </TabsList>

                <TabsContent value="posts">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Blog Posts</CardTitle>
                                <CardDescription>Manage your blog articles.</CardDescription>
                            </div>
                            <Button onClick={() => handleCreate('post')}><Plus className="mr-2 h-4 w-4" /> New Post</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>History Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell className="font-medium">{post.title}</TableCell>
                                            <TableCell className="capitalize">{post.author}</TableCell>
                                            <TableCell>{post.historicalDate}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(post.id, 'post')}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(post.id, 'post')}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="authors">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Authors</CardTitle>
                                <CardDescription>Manage authors and their styling.</CardDescription>
                            </div>
                            <Button onClick={() => handleCreate('author')}><Plus className="mr-2 h-4 w-4" /> New Author</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(authors).map(([key, author]) => (
                                    <Card key={key} className="overflow-hidden">
                                        <div className={`h-2 w-full bg-${author.color}-500`} style={{ backgroundColor: `var(--${author.color})` }} />
                                        <CardHeader>
                                            <CardTitle>{author.name}</CardTitle>
                                            <CardDescription>{author.title}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(key, 'author')} className="w-full">
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="lexicon">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Lexicon</CardTitle>
                                <CardDescription>Manage definitions and multilingual terms.</CardDescription>
                            </div>
                            <Button onClick={() => handleCreate('lexicon')}><Plus className="mr-2 h-4 w-4" /> New Entry</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Term</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Variants</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lexicon.map((entry) => (
                                        <TableRow key={entry.slug}>
                                            <TableCell className="font-medium">{entry.term}</TableCell>
                                            <TableCell>{entry.category}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{entry.variants?.join(', ')}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(entry.slug, 'lexicon')}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(entry.slug, 'lexicon')}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <PostEditor
                open={editorOpen}
                onOpenChange={setEditorOpen}
                post={editingPost}
                onSuccess={() => {
                    window.location.reload();
                }}
            />
        </div>
    );
}

