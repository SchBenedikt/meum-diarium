
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePosts } from '@/hooks/use-posts';
import { useAuthors } from '@/hooks/use-authors';
import { useLexicon } from '@/hooks/use-lexicon';
import { usePages } from '@/hooks/use-pages';
import { deletePost as removePost, deleteAuthor as removeAuthor, deleteLexiconEntry as removeLexiconEntry } from '@/lib/api';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Edit, Trash2, Plus, Users, BookOpenText, LibraryBig, FileText, Eye, Settings, LayoutDashboard, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { BlogPost, LexiconEntry } from '@/types/blog';
import { QuickStats } from '@/components/QuickStats';
import { SearchFilter } from '@/components/SearchFilter';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminPage() {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const { posts } = usePosts();
    const { authors: authorEntries } = useAuthors();
    const { lexicon: lexiconEntries } = useLexicon();
    const { pages } = usePages();

    // Derived state for filtering
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [filteredLexicon, setFilteredLexicon] = useState<LexiconEntry[]>([]);

    // Initialize filtered lists when data loads
    useEffect(() => {
        if (posts) setFilteredPosts(posts);
    }, [posts]);

    useEffect(() => {
        if (lexiconEntries) setFilteredLexicon(lexiconEntries);
    }, [lexiconEntries]);

    // Used for table display - derived from posts directly now
    const postRows = posts || [];

    const quickLinks = [
        {
            title: 'Beiträge',
            description: 'Artikel verfassen, editieren und veröffentlichen',
            href: '/admin/post/new',
            icon: BookOpenText,
        },
        {
            title: 'Lexikon',
            description: 'Begriffe pflegen, Varianten und Übersetzungen',
            href: '/admin/lexicon/new',
            icon: LibraryBig,
        },
        {
            title: 'Seiten',
            description: 'Statische Seiten wie /about gestalten',
            href: '/admin/pages/new',
            icon: FileText,
        },
        {
            title: 'Autoren',
            description: 'Profile, Farben und Biografien verwalten',
            href: '/admin/author/new',
            icon: Users,
        },
        {
            title: 'Medien',
            description: 'Bilderbibliothek öffnen und Assets wiederverwenden',
            href: '/admin/post/new',
            icon: ImageIcon,
        },
        {
            title: 'Einstellungen',
            description: 'Branding, Sprache und PWA konfigurieren',
            href: '/admin/settings',
            icon: Settings,
        },
    ];

    const handlePostSearch = (query: string) => {
        if (!query) {
            setFilteredPosts(postRows);
            return;
        }
        const filtered = postRows.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            post.author.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPosts(filtered);
    };

    const handlePostFilter = (filter: string) => {
        if (filter === 'all') {
            setFilteredPosts(postRows);
            return;
        }
        const filtered = postRows.filter(post => post.author === filter);
        setFilteredPosts(filtered);
    };

    const handleLexiconSearch = (query: string) => {
        if (!query) {
            setFilteredLexicon(lexiconEntries);
            return;
        }
        const filtered = lexiconEntries.filter(entry =>
            entry.term.toLowerCase().includes(query.toLowerCase()) ||
            entry.category.toLowerCase().includes(query.toLowerCase()) ||
            entry.definition.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredLexicon(filtered);
    };

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

    const recentContent = useMemo(() => {
        const postItems = (postRows || []).map(post => ({
            id: post.id,
            title: post.title,
            type: 'Beitrag',
            meta: post.author,
            viewPath: `/${post.author}/post/${post.slug}`,
            editPath: `/admin/post/${post.author}/${post.slug}`,
            date: post.historicalDate || '—',
        }));

        const pageItems = (pages || []).map(page => ({
            id: page.slug,
            title: page.title,
            type: 'Seite',
            meta: page.path,
            viewPath: page.path,
            editPath: `/admin/pages/${page.slug}`,
            date: 'Statisch',
        }));

        return [...postItems, ...pageItems].slice(0, 6);
    }, [pages, postRows]);

    const handleDeletePost = async (id: string) => {
        if (!window.confirm('Beitrag wirklich löschen?')) return;
        const post = postRows.find(p => p.id === id);
        if (!post) return;

        try {
            await removePost(post.author, post.slug);
            toast.success('Beitrag gelöscht');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        } catch (e) {
            toast.error('Fehler beim Löschen');
        }
    };

    const handleDeleteAuthor = async (authorId: string) => {
        if (!window.confirm('Autor wirklich löschen? Alle Beiträge bleiben erhalten.')) return;

        try {
            await removeAuthor(authorId);
            toast.success('Autor gelöscht');
            queryClient.invalidateQueries({ queryKey: ['authors'] });
        } catch (e) {
            toast.error('Fehler beim Löschen');
        }
    };

    const handleDeleteLexicon = async (slug: string) => {
        if (!window.confirm('Lexikon-Eintrag wirklich löschen?')) return;

        try {
            await removeLexiconEntry(slug);
            toast.success('Eintrag gelöscht');
            queryClient.invalidateQueries({ queryKey: ['lexicon'] });
        } catch (e) {
            toast.error('Fehler beim Löschen');
        }
    };

    return (
        <div className="container mx-auto py-24 min-h-screen px-4">
            <div className="grid gap-6 mb-8">
                <Card className="border-border/70 bg-gradient-to-r from-background to-background/40">
                    <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <LayoutDashboard className="h-4 w-4" />
                                CMS Control Center
                            </div>
                            <CardTitle className="text-3xl font-display">Alle Inhalte an einem Ort steuern</CardTitle>
                            <CardDescription>Beiträge, Seiten, Lexikon, Autoren und System-Settings – zentral verwalten.</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link to="/admin/settings">
                                    <Settings className="mr-2 h-4 w-4" /> Einstellungen
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link to="/admin/post/new">
                                    <Plus className="mr-2 h-4 w-4" /> Neuer Beitrag
                                </Link>
                            </Button>
                            <Button variant="secondary" size="sm" asChild>
                                <Link to="/admin/lexicon/new">
                                    <Plus className="mr-2 h-4 w-4" /> Lexikon-Eintrag
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <QuickStats stats={stats} />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {quickLinks.map(link => (
                        <Card key={link.title} className="hover:border-primary/40 transition-colors">
                            <CardHeader className="flex flex-row items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <link.icon className="h-4 w-4 text-primary" />
                                        {link.title}
                                    </CardTitle>
                                    <CardDescription>{link.description}</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" asChild aria-label={`${link.title} öffnen`}>
                                    <Link to={link.href}>
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Zuletzt bearbeitet</CardTitle>
                            <CardDescription>Schnell zurück in Beiträge, Seiten oder Lexikon-Einträge.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/admin/post/new">
                                <Plus className="mr-2 h-4 w-4" /> Neuer Inhalt
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titel</TableHead>
                                    <TableHead>Typ</TableHead>
                                    <TableHead>Info</TableHead>
                                    <TableHead className="text-right">Aktionen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentContent.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                            Noch keine Inhalte vorhanden.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentContent.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{item.meta}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link to={item.viewPath} target="_blank" aria-label="Ansehen">
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link to={item.editPath} aria-label="Bearbeiten">
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

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
                                <CardDescription>{filteredPosts.length} von {postRows.length} Beiträgen</CardDescription>
                            </div>
                            <Button asChild>
                                <Link to="/admin/post/new">
                                    <Plus className="mr-2 h-4 w-4" /> Neuer Beitrag
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <SearchFilter
                                onSearch={handlePostSearch}
                                onFilter={handlePostFilter}
                                placeholder="Beiträge durchsuchen..."
                                filters={[
                                    { value: 'all', label: 'Alle Autoren' },
                                    { value: 'caesar', label: 'Caesar' },
                                    { value: 'cicero', label: 'Cicero' },
                                    { value: 'augustus', label: 'Augustus' },
                                    { value: 'seneca', label: 'Seneca' },
                                ]}
                            />
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
                                        {filteredPosts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                    Keine Beiträge gefunden
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredPosts.map((post) => (
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
                                            ))
                                        )}
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
                                {Object.entries(authorEntries).map(([key, authorValue]) => {
                                    const author = authorValue as import('@/types/blog').AuthorInfo;
                                    return (
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
                                    )
                                })}
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
                                <CardDescription>{filteredLexicon.length} von {lexiconEntries.length} Einträgen</CardDescription>
                            </div>
                            <Button asChild>
                                <Link to="/admin/lexicon/new">
                                    <Plus className="mr-2 h-4 w-4" /> Neuer Eintrag
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <SearchFilter
                                onSearch={handleLexiconSearch}
                                placeholder="Lexikon durchsuchen..."
                            />
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
                                        {filteredLexicon.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                    Keine Einträge gefunden
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredLexicon.map((entry) => (
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
                                            ))
                                        )}
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
