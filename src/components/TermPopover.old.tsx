import { useState, useEffect, useRef } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Send, Loader2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TermPopoverProps {
  term: string;
  children: React.ReactNode;
  type: 'lexicon' | 'author';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

async function explainTerm(term: string, question?: string, history?: Message[]): Promise<string> {
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? 'https://caesar.schaechner.workers.dev' : '/api';

  const params = new URLSearchParams();
  params.set('term', term);
  if (question) params.set('question', question);
  if (history && history.length > 0) params.set('history', JSON.stringify(history));

  const res = await fetch(`${baseUrl}/explain?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to explain term: ${res.status}`);

  const data = await res.json();
  return data.response?.response || data.response || 'Keine Antwort verfügbar.';
}

export function TermPopover({ term, children, type }: TermPopoverProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !summary && !loading) {
      setLoading(true);
      explainTerm(term)
        .then(text => setSummary(text))
        .catch(err => {
          console.error('Failed to load summary', err);
          setSummary('Zusammenfassung konnte nicht geladen werden.');
        })
        .finally(() => setLoading(false));
    }
  }, [open, term, summary, loading]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const question = input.trim();
    setInput('');
    setSending(true);

    const newMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);

    try {
      const response = await explainTerm(term, question, newMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error('Failed to send question', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Fehler beim Abrufen der Antwort.' }]);
    } finally {
      setSending(false);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <span onMouseEnter={() => setOpen(true)}>
            {children}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-2rem)] sm:w-96 max-w-md p-0" align="start">
          <div className="p-3 sm:p-4 border-b border-border/50 bg-secondary/30">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h4 className="font-display font-semibold text-sm sm:text-base">{term}</h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => {
                  setDialogOpen(true);
                  setOpen(false);
                }}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {type === 'author' ? 'Historische Persönlichkeit' : 'Lexikon-Eintrag'}
            </p>
          </div>

          <ScrollArea className="h-56 sm:h-64 p-3 sm:p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {summary && (
                  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {summary}
                    </ReactMarkdown>
                  </div>
                )}

                {messages.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-border/50">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        ref={i === messages.length - 1 ? scrollRef : null}
                        className={`text-xs sm:text-sm ${msg.role === 'user' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                      >
                        {msg.role === 'user' ? (
                          <p className="italic">→ {msg.content}</p>
                        ) : (
                          <div className="prose prose-xs prose-slate dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-2 sm:p-3 border-t border-border/50 bg-secondary/20">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Frage zur Erläuterung..."
                className="text-xs sm:text-sm h-8 sm:h-9"
                disabled={sending}
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
              >
                {sending ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : <Send className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            </div>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1.5 sm:mt-2 text-center">
              KI-generierte Erklärungen – können ungenau sein
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-2xl w-[95vw] sm:w-[85vw] md:w-full max-h-[85vh] p-0 flex flex-col overflow-hidden translate-x-[-50%] translate-y-[-50%]"
        >
          <DialogHeader className="p-5 sm:p-6 border-b border-border/10 bg-muted/20 shrink-0">
            <DialogTitle className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-display text-lg sm:text-xl block truncate">{term}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mt-0.5">
                  {type === 'author' ? 'Historische Persönlichkeit' : 'Lexikon-Eintrag'}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 px-5 sm:px-8 py-6">
            {loading ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                {summary && (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {summary}
                    </ReactMarkdown>
                  </div>
                )}

                {messages.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        ref={i === messages.length - 1 ? scrollRef : null}
                        className={`text-sm ${msg.role === 'user' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                      >
                        {msg.role === 'user' ? (
                          <p className="italic text-base">→ {msg.content}</p>
                        ) : (
                          <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 sm:p-6 border-t border-border/50 bg-secondary/20">
            <div className="flex items-center gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Frage zur Erläuterung..."
                className="text-sm h-10"
                disabled={sending}
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="h-10 w-10 p-0 flex-shrink-0"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              KI-generierte Erklärungen – können ungenau sein
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
