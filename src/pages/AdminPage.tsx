
import { useEffect, useMemo, useState } from 'react';
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
import { Edit, Trash2, Plus, Users, BookOpenText, LibraryBig, FileText, Eye, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, defaultTransition } from '@/lib/motion';
import { BlogPost } from '@/types/blog';

export default function AdminPage() {
    const { t } = useLanguage();
    const { posts } = usePosts();
    const [postRows, setPostRows] = useState<BlogPost[]>([]);
    const [authorEntries, setAuthorEntries] = useState(() => ({ ...authors }));
    const [lexiconEntries, setLexiconEntries] = useState(() => [...lexicon]);

    useEffect(() => {
        if (posts && posts.length) {
            setPostRows(posts);
        }
    }, [posts]);

    const stats = useMemo(() => ([
        {
            icon: BookOpenText,
            label: 'Beiträge',
            value: postRows.length,
        },
        {
            icon: Users,
            label: 'Autoren',
            value: Object.keys(authorEntries).length,
        },
        {
            icon: LibraryBig,
            label: 'Lexikon',
            value: lexiconEntries.length,
        },
        {
            icon: FileText,
            label: 'Seiten',
            value: pages.length,
        },
    ]), [authorEntries, lexiconEntries.length, postRows.length, pages.length]);

    const [pages, setPages] = useState<Array<{ slug: string; title: string; path: string }>>([]);

    useEffect(() => {
        async function fetchPages() {
            try {
                const res = await fetch('/api/pages');
                if (res.ok) {
                    const data = await res.json();
                    setPages(data);
                } else {
                    // Fallback to default if API fails
                    setPages([
                        {
                            slug: 'about',
                            title: 'About / Projektvorstellung',
                            path: '/about',
                        }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch pages', error);
                // Fallback to default
                setPages([
                    {
                        slug: 'about',
                        title: 'About / Projektvorstellung',
                        path: '/about',
                    }
                ]);
            }
        }
        fetchPages();
    }, []);

    const handleDeletePost = async (id: string) => {
        if (!window.confirm('Beitrag wirklich löschen?')) return;
        const post = postRows.find(p => p.id === id);
        if (!post) return;

        try {
            const res = await fetch(`/api/posts/${post.author}/${post.slug}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Beitrag gelöscht');
                setPostRows(prev => prev.filter(p => p.id !== id));
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
                setAuthorEntries(prev => {
                    const updated = { ...prev };
                    delete updated[authorId];
                    return updated;
                });
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
                setLexiconEntries(prev => prev.filter(entry => entry.slug !== slug));
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
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/settings">
                            <Settings className="mr-2 h-4 w-4" /> Einstellungen
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="/admin/post/new">
                            <Plus className="mr-2 h-4 w-4" /> Neuer Beitrag
                        </Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link to="/admin/lexicon/new">
                            <Plus className="mr-2 h-4 w-4" /> Lexikon-Eintrag
                        </Link>
                    </Button>
                </div>
            </div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
                variants={staggerContainer(0.08)}
                initial="hidden"
                animate="visible"
                transition={defaultTransition}
            >
                {stats.map(stat => (
                    <motion.div key={stat.label} variants={fadeUp()}>
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">Aktuelle Inhalte im System</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8">
                    <TabsTrigger value="posts">Beiträge</TabsTrigger>
                    <TabsTrigger value="authors">Autoren</TabsTrigger>
                    <TabsTrigger value="lexicon">Lexikon</TabsTrigger>
                    <TabsTrigger value="pages">Seiten</TabsTrigger>
                </TabsList>

                {/* Posts Tab */}
                <TabsContent value="posts">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Blog-Beiträge</CardTitle>
                                <CardDescription>{postRows.length} Beiträge verfügbar</CardDescription>
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
                                        {postRows.map((post) => (
                                            <TableRow key={post.id}>
                                                <TableCell className="font-medium">{post.title}</TableCell>
                                                <TableCell className="capitalize">{post.author}</TableCell>
                                                <TableCell>{post.historicalDate}</TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link to={`/admin/post/${post.author}/${post.slug}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive"
                                                        onClick={() => handleDeletePost(post.id)}
                                                        aria-label="Beitrag löschen"
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

                {/* Authors Tab */}
                <TabsContent value="authors">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Autoren</CardTitle>
                                <CardDescription>{Object.keys(authorEntries).length} Autoren verfügbar</CardDescription>
                            </div>
                            <Button asChild>
                                <Link to="/admin/author/new">
                                    <Plus className="mr-2 h-4 w-4" /> Neuer Autor
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(authorEntries).map(([key, author]) => (
                                    <Card key={key} className="overflow-hidden border-border/60">
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
                                                    aria-label="Autor löschen"
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
                                <CardDescription>{lexiconEntries.length} Einträge verfügbar</CardDescription>
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
                                        {lexiconEntries.map((entry) => (
                                            <TableRow key={entry.slug}>
                                                <TableCell className="font-medium">{entry.term}</TableCell>
                                                <TableCell>{entry.category}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                                                    {entry.variants?.join(', ')}
                                                </TableCell>
                                                <TableCell className="text-right space-x-1">
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
                                                        aria-label="Lexikon-Eintrag löschen"
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

                <TabsContent value="pages">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Seiten</CardTitle>
                                <CardDescription>Statische Seiten wie /about bearbeiten</CardDescription>
                            </div>
                            <Button asChild>
                                <Link to="/admin/pages/new">
                                    <Plus className="mr-2 h-4 w-4" /> Neue Seite
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Seite</TableHead>
                                            <TableHead>Pfad</TableHead>
                                            <TableHead className="text-right">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pages.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                                    Noch keine Seiten vorhanden. Erstelle deine erste Seite!
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            pages.map((page) => (
                                                <TableRow key={page.slug}>
                                                    <TableCell className="font-medium">{page.title}</TableCell>
                                                    <TableCell>{page.path}</TableCell>
                                                    <TableCell className="text-right space-x-1">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link to={page.path} target="_blank" aria-label="Seite ansehen">
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link to={`/admin/pages/${page.slug}`} aria-label="Seite bearbeiten">
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
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


