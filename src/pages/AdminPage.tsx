
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePosts } from '@/hooks/use-posts';
import { lexicon } from '@/data/lexicon';
import { authors } from '@/data/authors';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
    const { t } = useLanguage();
    const { posts } = usePosts();

    const handleDeletePost = async (id: string) => {
        if (!window.confirm('Beitrag wirklich löschen?')) return;
        const post = posts.find(p => p.id === id);
        if (!post) return;

        try {
            const res = await fetch(`/api/posts/${post.author}/${post.slug}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Beitrag gelöscht');
                window.location.reload();
            } else {
                toast.error('Fehler beim Löschen');
            }
        } catch (e) {
            toast.error('Fehler beim Löschen');
        }
    };

    const handleDeleteAuthor = async (authorId: string) => {
        if (!window.confirm('Autor wirklich löschen? Alle Beiträge bleiben erhalten.')) return;

        try {
            const res = await fetch(`/api/authors/${authorId}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Autor gelöscht');
                window.location.reload();
            } else {
                toast.error('Fehler beim Löschen');
            }
        } catch (e) {
            toast.error('Fehler beim Löschen');
        }
    };

    const handleDeleteLexicon = async (slug: string) => {
        if (!window.confirm('Lexikon-Eintrag wirklich löschen?')) return;

        try {
            const res = await fetch(`/api/lexicon/${slug}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Eintrag gelöscht');
                window.location.reload();
            } else {
                toast.error('Fehler beim Löschen');
            }
        } catch (e) {
            toast.error('Fehler beim Löschen');
        }
    };

    return (
        <div className="container mx-auto py-24 min-h-screen px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Inhalte in allen Sprachen verwalten.</p>
                </div>
            </div>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="posts">Beiträge</TabsTrigger>
                    <TabsTrigger value="authors">Autoren</TabsTrigger>
                    <TabsTrigger value="lexicon">Lexikon</TabsTrigger>
                </TabsList>

                {/* Posts Tab */}
                <TabsContent value="posts">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Blog-Beiträge</CardTitle>
                                <CardDescription>{posts.length} Beiträge verfügbar</CardDescription>
                            </div>
                            <Button asChild>
                                <Link to="/admin/post/new">
                                    <Plus className="mr-2 h-4 w-4" /> Neuer Beitrag
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Titel</TableHead>
                                            <TableHead>Autor</TableHead>
                                            <TableHead>Datum</TableHead>
                                            <TableHead className="text-right">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {posts.map((post) => (
                                            <TableRow key={post.id}>
                                                <TableCell className="font-medium">{post.title}</TableCell>
                                                <TableCell className="capitalize">{post.author}</TableCell>
                                                <TableCell>{post.historicalDate}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link to={`/admin/post/${post.author}/${post.slug}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeletePost(post.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Authors Tab */}
                <TabsContent value="authors">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Autoren</CardTitle>
                                <CardDescription>{Object.keys(authors).length} Autoren verfügbar</CardDescription>
                            </div>
                            <Button asChild>
                                <Link to="/admin/author/new">
                                    <Plus className="mr-2 h-4 w-4" /> Neuer Autor
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(authors).map(([key, author]) => (
                                    <Card key={key} className="overflow-hidden">
                                        <div className="h-2 w-full" style={{ backgroundColor: author.color }} />
                                        <CardHeader>
                                            <CardTitle>{author.name}</CardTitle>
                                            <CardDescription>{author.title}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                                    <Link to={`/admin/author/${key}`}>
                                                        <Edit className="mr-2 h-4 w-4" /> Bearbeiten
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteAuthor(key)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Lexicon Tab */}
                <TabsContent value="lexicon">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Lexikon</CardTitle>
                                <CardDescription>{lexicon.length} Einträge verfügbar</CardDescription>
                            </div>
                            <Button asChild>
                                <Link to="/admin/lexicon/new">
                                    <Plus className="mr-2 h-4 w-4" /> Neuer Eintrag
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Begriff</TableHead>
                                            <TableHead>Kategorie</TableHead>
                                            <TableHead>Varianten</TableHead>
                                            <TableHead className="text-right">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lexicon.map((entry) => (
                                            <TableRow key={entry.slug}>
                                                <TableCell className="font-medium">{entry.term}</TableCell>
                                                <TableCell>{entry.category}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                                                    {entry.variants?.join(', ')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link to={`/admin/lexicon/${entry.slug}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive"
                                                        onClick={() => handleDeleteLexicon(entry.slug)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}


