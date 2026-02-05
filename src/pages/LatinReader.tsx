import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    ArrowLeft,
    ChevronRight,
    Search,
    XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import metamorphoses from '@/data/latin/ovid-metamorphoses.json';
import deBelloGallico from '@/data/latin/caesar-de-bello-gallico.json';
type LineBook = {
    id: number;
    title?: string;
    lines: string[];
};
type Chapter = {
    id: number;
    title?: string;
    lines: string[];
};
type ChapterBook = {
    id: number;
    title?: string;
    chapters: Chapter[];
};
type LinesWork = {
    id: string;
    title: string;
    author: string;
    type: 'lines';
    defaultRef: string;
    books: LineBook[];
};
type ChaptersWork = {
    id: string;
    title: string;
    author: string;
    type: 'chapters';
    defaultRef: string;
    books: ChapterBook[];
};
type LatinWork = LinesWork | ChaptersWork;
const CLASSICAL_WORKS: LatinWork[] = [
    metamorphoses as LinesWork,
    deBelloGallico as ChaptersWork
];
type AppliedReference = {
    bookId: number;
    start: number;
    end: number;
};
const parseReference = (work: LatinWork, input: string): AppliedReference | null => {
    const cleaned = input.trim();
    const match = cleaned.match(/^(\d+)(?:\.(\d+))?(?:-(\d+))?$/);
    if (!match) return null;
    const bookId = Number(match[1]);
    const primary = match[2] ? Number(match[2]) : null;
    const end = match[3] ? Number(match[3]) : null;
    if (Number.isNaN(bookId)) return null;
    if (work.type === 'lines') {
        const book = work.books.find((entry) => entry.id === bookId);
        if (!book) return null;
        const startLine = primary ?? 1;
        const endLine = end ?? (primary ? startLine : Math.min(20, book.lines.length));
        if (startLine < 1 || startLine > book.lines.length || endLine < startLine) return null;
        return {
            bookId,
            start: startLine,
            end: Math.min(endLine, book.lines.length)
        };
    }
    const book = work.books.find((entry) => entry.id === bookId);
    if (!book) return null;
    const startChapter = primary ?? 1;
    const endChapter = end ?? startChapter;
    if (startChapter < 1 || startChapter > book.chapters.length || endChapter < startChapter) return null;
    return {
        bookId,
        start: startChapter,
        end: Math.min(endChapter, book.chapters.length)
    };
};
const getDefaultReference = (work: LatinWork): AppliedReference | null => {
    return parseReference(work, work.defaultRef);
};
export default function LatinReader() {
    const [selectedWorkId, setSelectedWorkId] = useState(CLASSICAL_WORKS[0].id);
    const [referenceInput, setReferenceInput] = useState(CLASSICAL_WORKS[0].defaultRef);
    const [appliedReference, setAppliedReference] = useState<AppliedReference | null>(getDefaultReference(CLASSICAL_WORKS[0]));
    const [error, setError] = useState<string | null>(null);
    const selectedWork = useMemo(
        () => CLASSICAL_WORKS.find((work) => work.id === selectedWorkId) ?? CLASSICAL_WORKS[0],
        [selectedWorkId]
    );
    const selectedBook = useMemo(() => {
        return selectedWork.books.find((book) => book.id === appliedReference?.bookId) ?? selectedWork.books[0];
    }, [selectedWork, appliedReference]);
    const applyReference = () => {
        const parsed = parseReference(selectedWork, referenceInput);
        if (!parsed) {
            setError('Ungültige Referenz. Bitte ein korrektes Format eingeben.');
            return;
        }
        setError(null);
        setAppliedReference(parsed);
    };
    const handleSelectWork = (work: LatinWork) => {
        setSelectedWorkId(work.id);
        setReferenceInput(work.defaultRef);
        setAppliedReference(getDefaultReference(work));
        setError(null);
    };
    const handleSelectBook = (bookId: number) => {
        const refBase = `${bookId}.${selectedWork.type === 'lines' ? '1-20' : '1'}`;
        setReferenceInput(refBase);
        const parsed = parseReference(selectedWork, refBase);
        setAppliedReference(parsed);
        setError(null);
    };
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                            <div className="w-8 h-[1px] bg-primary/30" />
                            LATEINISCHER TEXT-READER
                        </div>
                        <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
                            Klassiker <span className="text-primary italic">einbetten</span>
                        </h1>
                        <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
                            Wähle ein Werk und eine Referenz. Der Originaltext wird direkt eingebettet angezeigt.
                        </p>
                    </motion.div>
                    <Link to="/latin" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2">
                        <ArrowLeft className="h-3.5 w-3.5" /> Zurück zu Tools
                    </Link>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-[300px_1fr] gap-8 items-start"
                >
                    <div className="space-y-6 lg:sticky lg:top-24">
                        <Card className="card-modern p-6 space-y-6 border-border/40 bg-card/30 backdrop-blur-xl">
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Werk auswählen</p>
                                <div className="space-y-2">
                                    {CLASSICAL_WORKS.map((work) => (
                                        <button
                                            key={work.id}
                                            onClick={() => handleSelectWork(work)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${selectedWork.id === work.id
                                                ? 'bg-primary/10 border-primary/30 text-primary font-medium shadow-inner'
                                                : 'bg-secondary/10 border-transparent hover:border-border/60 text-muted-foreground'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{work.title}</span>
                                                {selectedWork.id === work.id && <ChevronRight className="h-4 w-4" />}
                                            </div>
                                            <span className="text-[10px] opacity-60 uppercase tracking-wider">{work.author}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-border/50">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Buch auswählen</p>
                                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                    {selectedWork.books.map((book) => (
                                        <button
                                            key={book.id}
                                            onClick={() => handleSelectBook(book.id)}
                                            className={`w-full text-left px-4 py-2 rounded-xl text-xs transition-all border ${selectedBook?.id === book.id
                                                ? 'bg-primary/10 border-primary/30 text-primary font-medium shadow-inner'
                                                : 'bg-secondary/10 border-transparent hover:border-border/60 text-muted-foreground'
                                                }`}
                                        >
                                            {book.title || `Buch ${book.id}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-border/50">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Navigation</p>
                                <div className="flex gap-2">
                                    <Input
                                        value={referenceInput}
                                        onChange={(e) => setReferenceInput(e.target.value)}
                                        placeholder={selectedWork.type === 'lines' ? "Buch.Vers (z.B. 1.1-20)" : "Buch.Kapitel (z.B. 1.1)"}
                                        className="bg-secondary/40 border-primary/10 focus-visible:ring-primary/30 rounded-xl"
                                        onKeyDown={(e) => e.key === 'Enter' && applyReference()}
                                    />
                                    <Button onClick={applyReference} className="rounded-xl aspect-square p-0 w-12 shrink-0 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20">
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-[10px] text-muted-foreground/60 italic leading-relaxed">
                                        Beispiel: {selectedWork.type === 'lines' ? '1.1-20' : '1.1'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="space-y-6 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {error ? (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="card-modern p-16 text-center border-destructive/20 bg-destructive/5"
                                >
                                    <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <XCircle className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-display text-2xl mb-2 font-bold">Unerwartetes Problem</h3>
                                    <p className="text-sm text-muted-foreground/60 mb-8 max-w-sm mx-auto">{error}</p>
                                    <Button onClick={applyReference} variant="outline" className="rounded-xl px-8 border-destructive/20 text-destructive hover:bg-destructive/10">Erneut versuchen</Button>
                                </motion.div>
                            ) : appliedReference ? (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <Card className="card-modern overflow-hidden border-border/40 bg-card/30 backdrop-blur-2xl shadow-2xl">
                                        <div className="px-8 py-4 border-b border-white/5 bg-primary/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">LATINUS TEXTUS</span>
                                            </div>
                                            <span className="text-[10px] font-mono tracking-wider opacity-40">{selectedWork.title} • {referenceInput}</span>
                                        </div>
                                        <div className="p-10 sm:p-16 space-y-8">
                                            {selectedWork.type === 'lines' && selectedBook && 'lines' in selectedBook && (
                                                <div className="space-y-6">
                                                    <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                                                        {selectedBook.title || `Buch ${selectedBook.id}`}
                                                    </div>
                                                    <div className="space-y-4">
                                                        {selectedBook.lines
                                                            .slice(appliedReference.start - 1, appliedReference.end)
                                                            .map((line, index) => (
                                                                <div key={`${appliedReference.start}-${index}`} className="flex gap-4">
                                                                    <span className="text-xs font-mono text-primary/70 w-10 text-right pt-1">
                                                                        {appliedReference.start + index}
                                                                    </span>
                                                                    <p className="text-lg sm:text-2xl font-display leading-relaxed text-foreground/90 selection:bg-primary/30">
                                                                        {line}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedWork.type === 'chapters' && selectedBook && 'chapters' in selectedBook && (
                                                <div className="space-y-8">
                                                    {selectedBook.chapters
                                                        .filter((chapter) => chapter.id >= appliedReference.start && chapter.id <= appliedReference.end)
                                                        .map((chapter) => (
                                                            <div key={chapter.id} className="space-y-4">
                                                                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                                                                    Buch {selectedBook.id}, Kapitel {chapter.id}
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {chapter.lines.map((line, index) => (
                                                                        <div key={`${chapter.id}-${index}`} className="flex gap-4">
                                                                            <span className="text-xs font-mono text-primary/70 w-10 text-right pt-1">
                                                                                {index + 1}
                                                                            </span>
                                                                            <p className="text-lg sm:text-2xl font-display leading-relaxed text-foreground/90 selection:bg-primary/30">
                                                                                {line}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            ) : (
                                <div className="card-modern p-20 text-center text-muted-foreground/30 border-dashed border-2 border-border/20 bg-transparent flex flex-col items-center justify-center">
                                    <Search className="h-16 w-16 mb-6 opacity-10" />
                                    <p className="text-lg font-light italic tracking-tight">Gib eine Stelle ein, um in die Geschichte einzutauchen.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
