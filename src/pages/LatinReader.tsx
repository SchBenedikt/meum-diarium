import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    ArrowLeft,
    ChevronRight,
    Search,
    XCircle,
    BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import deBelloGallico from '@/data/latin-texts/de-bello-gallico.json';

type Sentence = {
    text: string;
    index: number;
};

type Chapter = {
    number: number;
    latin: string;
    sentences: string[];
};

type Book = {
    number: number;
    title: string;
    chapters: Chapter[] | number;
    description?: string;
    year?: string;
    keyEvents?: string[];
    tags?: string[];
    searchTerms?: string[];
};

type GrammaticalAnalysis = {
    word: string;
    grammaticalInfo: {
        case?: string;
        gender?: string;
        number?: string;
        person?: string;
        tense?: string;
        mood?: string;
        voice?: string;
        role?: string; // Subjekt, Objekt, etc.
    };
    highlighted: boolean;
};

export default function LatinReader() {
    const [selectedBook, setSelectedBook] = useState<Book>(deBelloGallico.books[0]);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedSentence, setSelectedSentence] = useState<Sentence | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [bookSearchQuery, setBookSearchQuery] = useState('');

    // Filter chapters based on search
    const filteredChapters = useMemo(() => {
        if (!searchQuery) return Array.isArray(selectedBook.chapters) ? selectedBook.chapters : [];
        
        const chapters = Array.isArray(selectedBook.chapters) ? selectedBook.chapters : [];
        return chapters.filter(chapter => 
            chapter.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chapter.sentences.some(sentence => 
                sentence.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [selectedBook, searchQuery]);

    // Filter books based on search
    const filteredBooks = useMemo(() => {
        if (!bookSearchQuery) return deBelloGallico.books;
        
        return deBelloGallico.books.filter(book => 
            book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
            (book.tags && book.tags.some(tag => tag.toLowerCase().includes(bookSearchQuery.toLowerCase()))) ||
            (book.searchTerms && book.searchTerms.some(term => term.toLowerCase().includes(bookSearchQuery.toLowerCase())))
        );
    }, [bookSearchQuery]);

    const handleBookSelect = (book: Book) => {
        setSelectedBook(book);
        setSelectedChapter(null);
        setSelectedSentence(null);
        setBookSearchQuery(''); // Clear book search when book is selected
    };

    const handleSentenceSelect = (sentence: string, index: number) => {
        setSelectedSentence({ text: sentence, index });
    };



    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                            <div className="w-8 h-[1px] bg-primary/30" />
                            LATEIN-READER
                        </div>
                        <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
                            De Bello <span className="text-primary italic">Gallico</span>
                        </h1>
                        <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
                            Wähle einen Satz zum Lesen und Analysieren.
                        </p>
                    </motion.div>
                    <Link to="/latin" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2">
                        <ArrowLeft className="h-3.5 w-3.5" /> Zurück zu Tools
                    </Link>
                </div>

                <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
                    {/* Sidebar */}
                    <div className="space-y-6 lg:sticky lg:top-24">
                        <Card className="card-modern p-6 space-y-6 border-border/40 bg-card/30 backdrop-blur-xl">
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Bücher durchsuchen</p>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Bücher suchen..."
                                        value={bookSearchQuery}
                                        onChange={(e) => setBookSearchQuery(e.target.value)}
                                        className="mb-3 bg-secondary/40 border-primary/10 focus-visible:ring-primary/30 rounded-xl"
                                    />
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {filteredBooks.map((book) => (
                                            <button
                                                key={book.number}
                                                onClick={() => handleBookSelect(book)}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                                                    selectedBook.number === book.number
                                                        ? 'bg-primary/10 border-primary/30 text-primary font-medium shadow-inner'
                                                        : 'bg-secondary/10 border-transparent hover:border-border/60 text-muted-foreground'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="block font-medium">{book.title}</span>
                                                        <span className="text-xs text-muted-foreground/60 block mt-1">
                                                            {typeof book.chapters === 'number' ? book.chapters : (book.chapters as Chapter[])?.length || 0} Kapitel • {book.year || ''}
                                                        </span>
                                                    </div>
                                                    {selectedBook.number === book.number && <ChevronRight className="h-4 w-4" />}
                                                </div>
                                                {book.tags && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {book.tags.slice(0, 3).map((tag) => (
                                                            <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Aktuelles Buch</p>
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-primary">{selectedBook.title}</span>
                                        <span className="text-xs text-primary/70">Buch {selectedBook.number}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {selectedBook.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground/60">
                                        <span>{typeof selectedBook.chapters === 'number' ? selectedBook.chapters : (selectedBook.chapters as Chapter[])?.length || 0} Kapitel</span>
                                        <span>•</span>
                                        <span>{selectedBook.year || ''}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Kapitel auswählen</p>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    <Input
                                        placeholder="Kapitel suchen..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="mb-3 bg-secondary/40 border-primary/10 focus-visible:ring-primary/30 rounded-xl"
                                    />
                                    {filteredChapters.map((chapter) => (
                                        <button
                                            key={chapter.number}
                                            onClick={() => {
                                                setSelectedChapter(chapter);
                                                setSelectedSentence(null);
                                            }}
                                            className={`w-full text-left px-4 py-2 rounded-xl text-xs transition-all border ${
                                                selectedChapter?.number === chapter.number
                                                    ? 'bg-primary/10 border-primary/30 text-primary font-medium shadow-inner'
                                                    : 'bg-secondary/10 border-transparent hover:border-border/60 text-muted-foreground'
                                            }`}
                                        >
                                            Kapitel {chapter.number}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Sentence */}
                            {selectedSentence && (
                                <div className="space-y-4 pt-4 border-t border-border/50">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Ausgewählter Satz</p>
                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                        <p className="text-sm italic text-primary mb-2">
                                            Satz {selectedSentence.index + 1}
                                        </p>
                                        <p className="text-sm leading-relaxed">
                                            {selectedSentence.text}
                                        </p>
                                    </div>
                                    
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {selectedChapter ? (
                                <motion.div
                                    key={selectedChapter.number}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <Card className="card-modern overflow-hidden border-border/40 bg-card/30 backdrop-blur-2xl shadow-2xl">
                                        <div className="px-8 py-4 border-b border-white/5 bg-primary/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">LATEINISCHER TEXT</span>
                                            </div>
                                            <span className="text-[10px] font-mono tracking-wider opacity-40">
                                                Buch {selectedBook.number}, Kapitel {selectedChapter.number}
                                            </span>
                                        </div>
                                        <div className="p-10 sm:p-16 space-y-6">
                                            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60 font-bold mb-4">
                                                Buch {selectedBook.number}, Kapitel {selectedChapter.number}
                                            </div>
                                            
                                            {/* Sentences with click functionality */}
                                            <div className="space-y-4">
                                                {selectedChapter.sentences.map((sentence, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleSentenceSelect(sentence, index)}
                                                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                                            selectedSentence?.index === index
                                                                ? 'bg-primary/10 border-primary/30 shadow-inner'
                                                                : 'bg-secondary/20 border-border/40 hover:border-primary/50 hover:bg-primary/5'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-xs font-mono text-primary/70 w-8 text-right pt-1 opacity-60">
                                                                {index + 1}
                                                            </span>
                                                            <p className="text-lg sm:text-xl font-display leading-relaxed text-foreground/90 selection:bg-primary/30 flex-1">
                                                                {sentence}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>


                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="card-modern p-20 text-center text-muted-foreground/30 border-dashed border-2 border-border/20 bg-transparent flex flex-col items-center justify-center"
                                >
                                    <BookOpen className="h-16 w-16 mb-6 opacity-10" />
                                    <p className="text-lg font-light italic tracking-tight">
                                        Wähle ein Kapitel, um mit dem Lesen zu beginnen.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
