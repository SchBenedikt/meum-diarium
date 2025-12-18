
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
        <div className="flex h-screen bg-background overflow-hidden pt-16">
            {/* Sidebar for context/history - Hidden on mobile */}
            <div className="hidden md:flex w-80 border-r border-border bg-background/60 backdrop-blur-xl flex-col p-6 z-20">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-display font-medium text-lg leading-tight">Historischer<br />Chat</h2>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Beta</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Info</h3>
                        <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 backdrop-blur-sm">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Du sprichst mit einer KI, die auf den Werken von <span className="text-foreground font-medium">{author.name}</span> trainiert wurde. Stelle präzise historische Fragen.
                            </p>
                        </div>
                    </div>

                    {/* Dynamic Context Resources */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Kontext & Ressourcen</h3>
                        {resources.length > 0 ? (
                            resources.map((res, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                >
                                    <Link to={res.link} className="block p-3 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-secondary/40 transition-all group">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            {res.type === 'map' ? <Map className="h-3.5 w-3.5 text-primary" /> : <BookOpen className="h-3.5 w-3.5 text-primary" />}
                                            <span className="text-xs font-medium group-hover:text-primary transition-colors">{res.title}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{res.description}</p>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-6 border border-dashed border-border/40 rounded-xl text-center bg-secondary/10">
                                <Search className="h-5 w-5 text-muted-foreground/30 mx-auto mb-2" />
                                <p className="text-[10px] text-muted-foreground/60">Relevante Karten oder Texte erscheinen hier während des Gesprächs.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-border/30">
                    <Link to={`/${authorId}`} className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-primary/5">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Zurück zur Übersicht
                    </Link>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative">
                <header className="h-16 border-b border-border/50 flex items-center px-6 justify-between bg-background/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-primary/20">
                            <img src={author.heroImage} alt={author.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <h1 className="font-display font-medium text-lg">{author.name}</h1>
                            <span className="flex items-center gap-1.5 text-xs text-primary animate-pulse">
                                <span className="block h-1.5 w-1.5 rounded-full bg-primary" />
                                Online
                            </span>
                        </div>
                    </div>
                </header>

                <ScrollArea className="flex-1 p-4 md:p-8">
                    <div className="max-w-3xl mx-auto space-y-6 pb-4">
                        {messages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={i}
                                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <img src={author.heroImage} className="h-full w-full object-cover rounded-full" />}
                                </div>
                                <div className={`rounded-2xl p-4 max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50'}`}>
                                    <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-md">
                    <div className="max-w-3xl mx-auto relative flex items-center gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Schreibe eine Nachricht an ${author.name.split(' ').pop()}...`}
                            className="pr-12 py-6 text-base bg-secondary/30 border-primary/20 focus-visible:ring-primary/30 rounded-lg"
                        />
                        <Button
                            size="icon"
                            onClick={handleSend}
                            className="absolute right-2 h-8 w-8 rounded-lg"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground mt-2">
                        <Sparkles className="h-3 w-3 inline mr-1 text-primary" />
                        KI-generierte Antworten können historisch ungenau sein.
                    </p>
                </div>
            </div>
        </div>
    );
}
