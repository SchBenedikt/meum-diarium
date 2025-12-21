import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePosts } from '@/hooks/use-posts';
import { useAuthors } from '@/hooks/use-authors';
import { useLexicon } from '@/hooks/use-lexicon';
import { deletePost as removePost, deleteAuthor as removeAuthor, deleteLexiconEntry as removeLexiconEntry, renameTag, deleteTag } from '@/lib/api';
import { fetchWorks, deleteWork } from '@/lib/api';
import { useTags } from '@/hooks/use-tags';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Edit, Trash2, Plus, Users, BookOpenText, LibraryBig, Settings, LayoutDashboard, ArrowUpRight, Tags, Hash, Eye, BookMarked } from 'lucide-react';
import { toast } from 'sonner';
import { BlogPost, LexiconEntry } from '@/types/blog';
import { QuickStats } from '@/components/QuickStats';
import { SearchFilter } from '@/components/SearchFilter';
import { TranslationEditor } from '@/components/admin/TranslationEditor';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminPage() {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const { posts } = usePosts();
    const { authors: authorEntries } = useAuthors();
    const { lexicon: lexiconEntries } = useLexicon();
    const { tags } = useTags();
    const [works, setWorks] = useState<any[]>([]);

    // Derived state for filtering
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [filteredLexicon, setFilteredLexicon] = useState<LexiconEntry[]>([]);
    const [filteredTags, setFilteredTags] = useState<string[]>([]);

    useEffect(() => {
        if (posts) setFilteredPosts(posts);
    }, [posts]);

    useEffect(() => {
        if (lexiconEntries) setFilteredLexicon(lexiconEntries);
    }, [lexiconEntries]);

    useEffect(() => {
        if (tags) setFilteredTags(tags);
    }, [tags]);

    useEffect(() => {
        async function loadWorks() {
            try {
                const data = await fetchWorks();
                setWorks(data || []);
            } catch {}
        }
        loadWorks();
    }, []);

    const postRows = posts || [];

    const quickLinks = [
        {
            title: 'Beiträge',
            description: 'Artikel verfassen und editieren',
            href: '/admin/post/new',
            icon: BookOpenText,
        },
        {
            title: 'Lexikon',
            description: 'Begriffe und Übersetzungen',
            href: '/admin/lexicon/new',
            icon: LibraryBig,
        },
        {
            title: 'Autoren',
            description: 'Profile und Biografien',
            href: '/admin/author/new',
            icon: Users,
        },
        {
            title: 'Werke',
            description: 'Schriften und Bücher',
            href: '/admin/work/new',
            icon: BookMarked,
        },
        {
            title: 'Einstellungen',
            description: 'Branding und PWA',
            href: '/admin/settings',
            icon: Settings,
        },
    ];

    const handlePostSearch = (query: string) => {
        if (!query) {
            setFilteredPosts(posts);
            return;
        }
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.author.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPosts(filtered);
    };

    const handleDeleteWork = async (slug: string) => {
        if (!window.confirm('Werk wirklich löschen?')) return;
        try {
            await deleteWork(slug);
            toast.success('Werk gelöscht');
            const data = await fetchWorks();
            setWorks(data || []);
        } catch (e) {
            toast.error('Fehler beim Löschen');
        }
    };

    const handlePostFilter = (author: string) => {
        if (author === 'all') {
            setFilteredPosts(posts);
            return;
        }
        const filtered = posts.filter(post => post.author === author);
        setFilteredPosts(filtered);
    };

    const handleLexiconSearch = (query: string) => {
        if (!query) {
            setFilteredLexicon(lexiconEntries);
            return;
        }
        const filtered = lexiconEntries.filter(entry =>
            entry.term.toLowerCase().includes(query.toLowerCase()) ||
            entry.category.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredLexicon(filtered);
    };

    const handleDeletePost = async (postId: string) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        if (!window.confirm(`Beitrag "${post.title}" wirklich löschen?`)) return;

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

    const handleTagSearch = (query: string) => {
        if (!query) {
            setFilteredTags(tags);
            return;
        }
        const filtered = tags.filter(tag =>
            tag.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTags(filtered);
    };

    const handleRenameTag = async (oldTag: string) => {
        const newTag = window.prompt(`Tag "${oldTag}" umbenennen in:`, oldTag);
        if (!newTag || newTag === oldTag) return;

        try {
            await renameTag(oldTag, newTag);
            toast.success(`Tag umbenannt: ${oldTag} -> ${newTag}`);
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        } catch (e) {
            toast.error('Fehler beim Umbenennen');
        }
    };

    const handleDeleteTag = async (tag: string) => {
        if (!window.confirm(`Tag "${tag}" wirklich aus allen Beiträgen löschen?`)) return;

        try {
            await deleteTag(tag);
            toast.success('Tag gelöscht');
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        } catch (e) {
            toast.error('Fehler beim Löschen');
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl pt-24 sm:pt-28">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                    </div>
                    <h1 className="font-display text-3xl font-bold">Admin</h1>
                </div>
                <p className="text-muted-foreground">Beiträge, Lexikon, Autoren und Übersetzungen verwalten</p>
            </div>

            {/* Stats */}
            <QuickStats stats={[
                { icon: BookOpenText, label: 'Beiträge', value: postRows.length },
                { icon: Users, label: 'Autoren', value: Object.keys(authorEntries).length },
                { icon: LibraryBig, label: 'Lexikon', value: lexiconEntries?.length || 0 },
                { icon: Tags, label: 'Tags', value: tags?.length || 0 },
            ]} />

            {/* Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 my-8">
                {quickLinks.map((link) => (
                    <Card key={link.title} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <link.icon className="h-4 w-4 text-primary" />
                                </div>
                                <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                    <Link to={link.href}>
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <CardTitle className="text-sm mt-3">{link.title}</CardTitle>
                            <CardDescription className="text-xs">{link.description}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-8">
                    <TabsTrigger value="posts">Beiträge</TabsTrigger>
                    <TabsTrigger value="authors">Autoren</TabsTrigger>
                    <TabsTrigger value="works">Werke</TabsTrigger>
                    <TabsTrigger value="lexicon">Lexikon</TabsTrigger>
                    <TabsTrigger value="tags">Tags</TabsTrigger>
                    <TabsTrigger value="translations">i18n</TabsTrigger>
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
                                                            <Link to={`/${post.author}/${post.slug}`} target="_blank">
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(authorEntries).map(([key, authorValue]) => {
                                    const author = authorValue as import('@/types/blog').AuthorInfo;
                                    const authorPosts = postRows.filter(p => p.author === key).length;
                                    return (
                                        <Card key={key} className="overflow-hidden">
                                            <div className="h-1.5 w-full" style={{ backgroundColor: author.color }} />
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <CardTitle className="text-lg">{author.name}</CardTitle>
                                                        <CardDescription>{author.title} • {author.years}</CardDescription>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                                        {authorPosts} Beiträge
                                                    </span>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                    {author.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link to={`/admin/author/${key}`}>
                                                            <Edit className="mr-1.5 h-3.5 w-3.5" /> Profil
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link to={`/${key}`} target="_blank">
                                                            <Eye className="mr-1.5 h-3.5 w-3.5" /> Seite
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link to={`/${key}/about`} target="_blank">
                                                            Über
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link to={`/admin/pages/author-about-${key}`}>
                                                            Über bearbeiten
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive h-8 w-8"
                                                        onClick={() => handleDeleteAuthor(key)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Works Tab */}
                <TabsContent value="works">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Werke</CardTitle>
                                <CardDescription>{works.length} Werke verfügbar</CardDescription>
                            </div>
                            <Button asChild>
                                <Link to="/admin/work/new">
                                    <Plus className="mr-2 h-4 w-4" /> Neues Werk
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
                                            <TableHead>Jahr(e)</TableHead>
                                            <TableHead className="text-right">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {works.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                    Keine Werke gefunden
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            works.map((work) => (
                                                <TableRow key={work.slug}>
                                                    <TableCell className="font-medium">{work.title}</TableCell>
                                                    <TableCell className="capitalize">{work.author}</TableCell>
                                                    <TableCell>{work.year || '—'}</TableCell>
                                                    <TableCell className="text-right space-x-1">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link to={`/admin/work/${work.slug}`}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive"
                                                            onClick={() => handleDeleteWork(work.slug)}
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

                {/* Lexicon Tab */}
                <TabsContent value="lexicon">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Lexikon-Einträge</CardTitle>
                                <CardDescription>{filteredLexicon.length} von {lexiconEntries?.length || 0} Einträgen</CardDescription>
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
                                                    <TableCell className="text-muted-foreground">
                                                        {entry.variants?.slice(0, 2).join(', ') || '—'}
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

                {/* Tags Tab */}
                <TabsContent value="tags">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags verwalten</CardTitle>
                            <CardDescription>{filteredTags.length} Tags in Verwendung</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SearchFilter
                                onSearch={handleTagSearch}
                                placeholder="Tags durchsuchen..."
                            />
                            <div className="flex flex-wrap gap-2 mt-4">
                                {filteredTags.map((tag) => {
                                    const count = postRows.filter(p => p.tags?.includes(tag)).length;
                                    return (
                                        <div
                                            key={tag}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card"
                                        >
                                            <Hash className="h-3.5 w-3.5 text-primary" />
                                            <span className="text-sm font-medium">{tag}</span>
                                            <span className="text-xs text-muted-foreground">({count})</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => handleRenameTag(tag)}
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-destructive"
                                                onClick={() => handleDeleteTag(tag)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Translations Tab */}
                <TabsContent value="translations">
                    <TranslationEditor />
                </TabsContent>
            </Tabs>
        </div>
    );
}
