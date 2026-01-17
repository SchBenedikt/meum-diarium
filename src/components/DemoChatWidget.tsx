import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MoreVertical, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { askAI } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Uses Cloudflare Worker via Pages proxy to fetch real AI responses
const DEFAULT_PERSONA = 'caesar';

export function DemoChatWidget() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Salve! Ich bin Gaius Julius Caesar. Frage mich etwas über den Rubikon, meine Feldzüge in Gallien oder meine Zeit als Diktator.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            const { text } = await askAI(DEFAULT_PERSONA, userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        } catch (err: any) {
            const msg = err?.message || 'Fehler beim Abruf der KI-Antwort.';
            setMessages(prev => [...prev, { role: 'assistant', content: `Entschuldige, es ist ein Fehler aufgetreten: ${msg}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 blur-[100px] rounded-full" />

            <div className="relative bg-card/70 backdrop-blur-2xl border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-background/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                                C
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Gaius Julius Caesar</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                Aktiv
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg">
                            <Sparkles className="h-3 w-3" /> Demo
                        </span>
                        <button className="p-2 rounded-lg transition-colors">
                            <MoreVertical className="h-5 w-5 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div ref={scrollRef} className="space-y-4 p-6 h-[380px] overflow-y-auto">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-muted to-muted/60 border border-border/40'
                                    : 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                                    }`}>
                                    {msg.role === 'user' ? 'Du' : 'C'}
                                </div>
                                <div className={`rounded-2xl px-5 py-3 max-w-[85%] ${msg.role === 'user'
                                    ? 'bg-primary/10 border border-primary/30'
                                    : 'bg-card/70 border border-border/60'
                                    }`}>
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-sm max-w-none">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ children }) => <h1 className="text-xl sm:text-2xl font-bold mb-2">{children}</h1>,
                                                    h2: ({ children }) => <h2 className="text-lg sm:text-xl font-bold mb-2">{children}</h2>,
                                                    h3: ({ children }) => <h3 className="text-base sm:text-lg font-semibold mb-2">{children}</h3>,
                                                    p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-3"
                            >
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shrink-0 text-white font-bold text-sm">
                                    C
                                </div>
                                <div className="rounded-2xl bg-card/70 border border-border/60 px-5 py-3">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                                        <span className="ml-1">Caesar tippt...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Chat Input */}
                <div className="border-t border-border/50 px-6 py-4 bg-background/30 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Stelle Caesar eine Frage..."
                            className="flex-1 bg-muted/40 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="p-3 bg-primary text-primary-foreground rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3" />
                            Interaktive Demo • Probiere es aus!
                        </p>
                        <Button variant="ghost" size="sm" asChild className="text-xs">
                            <Link to="/caesar/chat">
                                Zum vollständigen Chat <ArrowRight className="h-3.5 w-3.5 ml-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
