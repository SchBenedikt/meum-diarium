
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { authors } from '@/data/authors';
import { Author } from '@/types/blog';
import { Send, User, Bot, Sparkles, MessageCircle, ArrowLeft, Map, BookOpen, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/layout/PageHero';

export default function ChatPage() {
    const { authorId } = useParams<{ authorId: string }>();
    const { setCurrentAuthor } = useAuthor();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Salve! Ich bin Gaius Julius Caesar. Frage mich etwas über meine Feldzüge in Gallien oder meine Pläne für Rom.' }
    ]);
    const [input, setInput] = useState('');

    const [resources, setResources] = useState<{ title: string; type: 'map' | 'text'; description: string; link: string }[]>([]);

    const author = authorId ? authors[authorId as Author] : null;

    useEffect(() => {
        if (authorId) {
            setCurrentAuthor(authorId as Author);
        }
    }, [authorId, setCurrentAuthor]);

    if (!author) return null;

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setInput('');

        // Mock response and resource suggestion
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Dies ist eine Demonstration der Chat-Funktion. In Kürze werde ich dir basierend auf meinen historischen Schriften antworten können.' }]);

            // Simulating a context trigger for Caesar
            if (authorId === 'caesar' && resources.length === 0) {
                setResources(prev => [...prev, {
                    title: 'Gallien Feldzug Karte',
                    type: 'map',
                    description: 'Übersichtskarte der Feldzüge 58 v. Chr.',
                    link: '/caesar/works/de-bello-gallico'
                }]);
            }
        }, 1000);
    };

    return (
        <div className="relative min-h-screen bg-background">
            <PageHero
                eyebrow="Historischer Chat"
                title="Sprich mit"
                highlight={author.name}
                description={`Stelle gezielte Fragen an ${author.name.split(' ')[0]} und erhalte kontextreiche, KI-gestützte Antworten.`}
                backgroundImage={author.heroImage}
                kicker={
                    <Link to={`/${authorId}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" /> Zurück zur Übersicht
                    </Link>
                }
            />

            <section className="section-shell -mt-8 pb-16 relative z-10">
                <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
                    <div className="glass-card space-y-6 lg:sticky lg:top-24">
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
                                        <Link to={res.link} className="block p-4 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                                            <div className="flex items-center gap-2 mb-2">
                                                {res.type === 'map' ? <Map className="h-4 w-4 text-primary" /> : <BookOpen className="h-4 w-4 text-primary" />}
                                                <span className="text-sm font-medium group-hover:text-primary transition-colors">{res.title}</span>
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

                        <div className="pt-4 border-t border-border/50">
                            <Link to={`/${authorId}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                <ArrowLeft className="h-4 w-4" /> Zurück zur Übersicht
                            </Link>
                        </div>
                    </div>

                    <div className="glass-panel p-0 overflow-hidden">
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
                            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                                <Bot className="h-4 w-4" />
                                <span>KI-gestützt</span>
                            </div>
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
                                        <div className={`rounded-3xl p-4 max-w-[80%] text-sm sm:text-base leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card/70 border border-border/60'}`}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="border-t border-border/50 bg-background/80 backdrop-blur-xl px-4 sm:px-5 py-4">
                            <div className="max-w-3xl mx-auto relative flex items-center gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Schreibe eine Nachricht an ${author.name.split(' ').pop()}...`}
                                    className="pr-12 py-5 text-base bg-secondary/40 border-primary/10 focus-visible:ring-primary/30 rounded-xl"
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
            </section>
        </div>
    );
}
