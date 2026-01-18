
import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { authors } from '@/data/authors';
import { Author } from '@/types/blog';
import { Send, User, Bot, Sparkles, MessageCircle, ArrowLeft, Map, BookOpen, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askAI } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function ChatPage() {
    const { authorId } = useParams<{ authorId: string }>();
    const [searchParams] = useSearchParams();
    const { setCurrentAuthor } = useAuthor();
    const { t } = useLanguage();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Salve! Ich bin Gaius Julius Caesar. Frage mich etwas über meine Feldzüge in Gallien oder meine Pläne für Rom.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [resources, setResources] = useState<{ title: string; type: 'map' | 'text' | 'lexicon'; description?: string; link: string }[]>([]);

    const author = authorId ? authors[authorId as Author] : null;

    useEffect(() => {
        if (authorId) {
            setCurrentAuthor(authorId as Author);
        }
    }, [authorId, setCurrentAuthor]);

    if (!author) return null;

    const sendQuestion = async (question: string) => {
        if (!question.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        setIsTyping(true);

        try {
            const { text, resources: suggested } = await askAI(authorId || 'caesar', question, { sitemapUrl: `${window.location.origin}/sitemap.xml` });
            setMessages(prev => [...prev, { role: 'assistant', content: text }]);
            if (suggested && suggested.length) {
                setResources(prev => {
                    const existingLinks = new Set(prev.map(r => r.link));
                    const merged = [...prev];
                    for (const s of suggested) {
                        if (!existingLinks.has(s.link)) merged.push(s);
                    }
                    return merged;
                });
            }
        } catch (err: any) {
            const msg = err?.message || 'Fehler beim Abruf der KI-Antwort.';
            setMessages(prev => [...prev, { role: 'assistant', content: `Entschuldige, es ist ein Fehler aufgetreten: ${msg}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = async () => {
        const question = input.trim();
        if (!question) return;
        setInput('');
        await sendQuestion(question);
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        const q = searchParams.get('q');
        if (q && messages.length === 1 && !isTyping) {
            sendQuestion(q);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);


    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
                {/* Minimalist Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                            <div className="w-8 h-[1px] bg-primary/30" />
                            HISTORISCHER CHAT
                        </div>
                        <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
                            Sprich mit <span className="text-primary italic">{author.name.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
                            Stelle gezielte Fragen an {author.name.split(' ')[0]} und erhalte kontextreiche, KI-gestützte Antworten.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4 items-end"
                    >
                        <Link to={`/${authorId}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="h-3.5 w-3.5" /> Zurück
                        </Link>
                    </motion.div>
                </div>

                {/* Chat Content */}
                <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
                    <div className="card-modern card-padding-md space-y-6 lg:sticky lg:top-24">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <MessageCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Beta</p>
                                <h2 className="font-display text-xl font-semibold">Historischer Dialog</h2>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Du sprichst mit einer KI, die auf den Werken von <span className="text-foreground font-medium">{author.name}</span> trainiert wurde. Stelle präzise historische Fragen.
                        </p>

                        <div className="space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Kontext & Ressourcen</p>
                            {resources.length > 0 ? (
                                resources.map((res, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={i}
                                    >
                                        <Link to={res.link} className="block p-4 rounded-2xl bg-secondary/30 border border-border/60 group">
                                            <div className="flex items-center gap-2 mb-2">
                                                {res.type === 'map' ? <Map className="h-4 w-4 text-primary" /> : <BookOpen className="h-4 w-4 text-primary" />}
                                                <span className="text-sm font-medium">{res.title}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{res.description}</p>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-6 border border-dashed border-border/50 rounded-2xl text-center bg-secondary/20">
                                    <Search className="h-5 w-5 text-muted-foreground/40 mx-auto mb-2" />
                                    <p className="text-[11px] text-muted-foreground">Relevante Karten oder Texte erscheinen hier während des Gesprächs.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card-modern p-0 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-border/50 px-4 sm:px-5 py-4 bg-background/70 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                                    <img src={author.heroImage} alt={author.name} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <h1 className="font-display font-semibold text-lg leading-tight">{author.name}</h1>
                                    <span className="flex items-center gap-1.5 text-xs text-primary animate-pulse">
                                        <span className="block h-1.5 w-1.5 rounded-full bg-primary" /> Online
                                    </span>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Bot className="h-4 w-4" />
                                    <span>KI-gestützt</span>
                                </div>
                                <span className="px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">BETA</span>
                            </div>
                        </div>

                        <div className="px-4 sm:px-5 py-2 bg-amber-500/10 border-b border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Experimenteller KI-Chat (Beta) – Antworten können ungenau sein.</span>
                        </div>

                        <ScrollArea className="h-[55vh] sm:h-[60vh] p-4 sm:p-6">
                            <div className="max-w-3xl mx-auto space-y-5 pb-2">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={i}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''}`}
                                    >
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground overflow-hidden'}`}>
                                            {msg.role === 'user' ? <User className="h-5 w-5" /> : <img src={author.heroImage} className="h-full w-full object-cover" />}
                                        </div>
                                        <div className={`rounded-3xl p-4 max-w-[80%] text-sm sm:text-base leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card/70 border border-border/60'}`}>
                                            {msg.role === 'assistant' ? (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h1: ({ children }) => <h1 className="text-2xl sm:text-3xl font-bold mb-3">{children}</h1>,
                                                        h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-bold mb-2">{children}</h2>,
                                                        h3: ({ children }) => <h3 className="text-lg sm:text-xl font-semibold mb-2">{children}</h3>,
                                                        p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                                                        ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
                                                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                                        blockquote: ({ children }) => <blockquote className="border-l-2 border-primary/50 pl-3 italic text-muted-foreground">{children}</blockquote>,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                <AnimatePresence>
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex gap-3"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                                <Bot className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div className="rounded-3xl bg-card/70 border border-border/60 px-4 py-3">
                                                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                                                    <span className="ml-1">KI antwortet…</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div ref={bottomRef} />
                            </div>
                        </ScrollArea>

                        <div className="border-t border-border/50 bg-background/80 backdrop-blur-xl px-4 sm:px-5 py-4">
                            <div className="max-w-3xl mx-auto relative flex items-center gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Schreibe eine Nachricht an ${author.name.split(' ').pop()}...`}
                                    className="pr-12 py-2 text-base bg-secondary/40 border-primary/10 focus-visible:ring-primary/30 rounded-xl"
                                />
                                <Button
                                    size="icon"
                                    onClick={handleSend}
                                    className="absolute right-2 h-10 w-10 rounded-xl"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-center text-[11px] text-muted-foreground mt-3">
                                <Sparkles className="h-3 w-3 inline mr-1 text-primary" /> KI-generierte Antworten können historisch ungenau sein.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
