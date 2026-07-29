import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    ArrowLeft, 
    BookOpen, 
    Languages,
    Loader2,
    ExternalLink,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { VocabularyDetail } from '@/components/vocabulary/VocabularyDetail';
import { SEO } from '@/components/SEO';

interface VocEntry {
    id: number;
    vokId: string;
    latin: string | null;
    desc: string | null;
    html: string | null;
    key: string;
    grammar: string | null;
    typnr: number | null;
}

interface SearchResults {
    results: VocEntry[];
    count: number;
    limit: number;
    offset: number;
    source?: {
        name: string;
        url: string;
        license: string;
        entries: number;
    };
}

export default function VocabularyPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedVokId = searchParams.get('id');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState<VocEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<VocEntry | null>(null);
    const [source, setSource] = useState<SearchResults['source']>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    
    const fetchVocabulary = useCallback(async (query: string) => {
        if (!query.trim()) {
            setResults([]);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/vocab?q=${encodeURIComponent(query)}&limit=20`);
            if (!response.ok) {
                throw new Error('Failed to fetch vocabulary');
            }
            const data: SearchResults = await response.json();
            setResults(data.results);
            // Set source info from the first search response
            if (data.source && !source) {
                setSource(data.source);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error('Error fetching vocabulary:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback((query: string) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        
        debounceTimeoutRef.current = setTimeout(() => {
            fetchVocabulary(query);
        }, 300); // 300ms delay
    }, [fetchVocabulary]);

    useEffect(() => {
        if (!selectedVokId) {
            debouncedSearch(searchQuery);
        }
    }, [searchQuery, selectedVokId, debouncedSearch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery });
        } else {
            setSearchParams({});
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        // Update URL params immediately for live search
        if (value.trim()) {
            setSearchParams({ q: value });
        } else {
            setSearchParams({});
        }
    };

    const handleSelectEntry = (entry: VocEntry) => {
        setSelectedEntry(entry);
        setSearchParams({ id: entry.vokId, q: searchQuery });
    };

    const handleClearSelection = () => {
        setSelectedEntry(null);
        if (searchQuery) {
            setSearchParams({ q: searchQuery });
        } else {
            setSearchParams({});
        }
    };

    // Initialize selected entry from URL params
    useEffect(() => {
        if (selectedVokId && results.length > 0) {
            const entry = results.find(e => e.vokId === selectedVokId);
            setSelectedEntry(entry || null);
        } else {
            setSelectedEntry(null);
        }
    }, [selectedVokId, results]);

    if (selectedVokId && !selectedEntry) {
        // Show loading state while we find the entry
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const baseUrl = 'https://meum-diarium.xn--schchner-2za.de';
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <SEO
                title="Latein Vokabeltrainer – 36.000+ Vokabeln"
                description="Durchsuche über 36.000 lateinische Vokabeln mit Übersetzungen, Grammatik-Informationen und Kontextbeispielen aus originalen lateinischen Texten."
                image={`${baseUrl}/images/cicero-hero.png`}
            />
            <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 px-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                            <div className="w-8 h-[1px] bg-primary/30" />
                            WÖRTERBUCH
                            <span className="ml-2 inline-flex items-center rounded-md border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-amber-400">
                                Beta
                            </span>
                        </div>
                        <h1 className="font-display text-4xl sm:text-7xl font-bold tracking-tight">
                            Latein-<span className="text-primary italic">Deutsch</span>
                        </h1>
                        <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed text-sm sm:text-base">
                            Durchsuche über 36.000 lateinische Vokabeln mit Deklinationen und Konjugationen.
                        </p>
                    </motion.div>
                    <Link 
                        to="/learn" 
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Lernen
                    </Link>
                </div>

                {/* Search */}
                <div className="mb-8 max-w-3xl mx-auto">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Suche nach lateinischen oder deutschen Wörtern..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            className="pl-12 pr-4 py-6 text-lg"
                        />
                    </form>
                </div>

                {/* Source Attribution - Always Show */}
                {source && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Card className="p-4 bg-secondary/20 border-border/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Info className="h-4 w-4 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Datenquelle: <span className="font-medium text-foreground">{source.name}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {source.entries.toLocaleString()} Einträge • Lizenz: {source.license}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    GitHub
                                </a>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {/* Left Column - Vocabulary List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">
                                Vokabeln {results.length > 0 && `(${results.length})`}
                            </h2>
                            {selectedEntry && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearSelection}
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Auswahl aufheben
                                </Button>
                            )}
                        </div>
                        
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : error ? (
                            <Card className="p-8 text-center">
                                <p className="text-red-500">{error}</p>
                            </Card>
                        ) : results.length === 0 ? (
                            <Card className="p-12 text-center">
                                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-lg text-muted-foreground">
                                    {searchQuery 
                                        ? `Keine Ergebnisse für "${searchQuery}"`
                                        : 'Suche nach einem Wort, um zu beginnen'}
                                </p>
                            </Card>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                <AnimatePresence mode="popLayout">
                                    {results.map((entry, index) => (
                                        <motion.div
                                            key={entry.vokId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card
                                                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                                                    selectedEntry?.vokId === entry.vokId 
                                                        ? 'border-primary bg-primary/5' 
                                                        : 'hover:border-primary/50'
                                                }`}
                                                onClick={() => handleSelectEntry(entry)}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-primary">
                                                                {entry.latin || entry.key}
                                                            </h3>
                                                            {entry.grammar && (
                                                                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                                                    {entry.grammar}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {entry.desc || 'Keine Beschreibung verfügbar'}
                                                        </p>
                                                    </div>
                                                    <Languages className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Selected Word Details */}
                    <div className="lg:sticky lg:top-32 lg:h-fit">
                        {selectedEntry ? (
                            <VocabularyDetail vokId={selectedEntry.vokId} />
                        ) : (
                            <Card className="p-8 text-center">
                                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-lg text-muted-foreground">
                                    Wähle eine Vokabel aus der Liste aus, um Details zu sehen
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
