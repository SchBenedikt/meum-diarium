import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trash2, AlertCircle, MessageSquare, Send, ArrowUpNarrowWide, ArrowDownNarrowWide, Reply } from 'lucide-react';

interface Comment {
  id: string;
  postId: string;
  userId?: string;
  authorName?: string;
  authorEmail?: string;
  content: string;
  parentId?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  postId: string;
  onCommentAdded?: () => void;
}

type SortOrder = 'newest' | 'oldest';

export function CommentSection({ postId, onCommentAdded }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
  const [deleteInputEmail, setDeleteInputEmail] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
        const data = await res.json();
        setComments(data.comments || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load comments';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const { topLevel, replies } = useMemo(() => {
    const map = new Map<string, Comment[]>();
    const top: Comment[] = [];
    for (const c of comments) {
      if (c.parentId) {
        const existing = map.get(c.parentId) || [];
        existing.push(c);
        map.set(c.parentId, existing);
      } else {
        top.push(c);
      }
    }
    const sorted = [...top].sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    for (const [, reps] of map) {
      reps.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return { topLevel: sorted, replies: map };
  }, [comments, sortOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      setError('Bitte alle Felder ausfüllen.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          postId,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: content.trim(),
          parentId: replyTo?.id || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to create comment: ${res.status}`);
      }
      const data = await res.json();
      setComments((prev) => [data.comment, ...prev]);
      setAuthorName('');
      setAuthorEmail('');
      setContent('');
      setReplyTo(null);
      if (onCommentAdded) onCommentAdded();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create comment';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string, email: string) => {
    if (!email) { setError('E-Mail erforderlich'); return; }
    setDeletingId(commentId);
    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: commentId, email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to delete: ${res.status}`);
      }
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setDeleteDialogId(null);
      setDeleteInputEmail('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'gerade eben';
    if (minutes < 60) return `vor ${minutes} Minute${minutes !== 1 ? 'n' : ''}`;
    if (hours < 24) return `vor ${hours} Stunde${hours !== 1 ? 'n' : ''}`;
    if (days < 7) return `vor ${days} Tag${days !== 1 ? 'en' : ''}`;
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500',
      'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const CommentCard = ({ comment, isReply }: { comment: Comment; isReply?: boolean }) => {
    const avatarColor = getAvatarColor(comment.authorName || 'A');
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        <div className="relative flex gap-3">
          <div className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-sm mt-0.5`}>
            {getInitials(comment.authorName || 'A')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="rounded-xl rounded-tl-sm border bg-card/50 px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                  <span className="font-semibold text-foreground text-sm truncate">{comment.authorName}</span>
                  <span className="text-muted-foreground/30 shrink-0 text-xs">·</span>
                  <span className="text-xs text-muted-foreground/60 whitespace-nowrap">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setDeleteDialogId(comment.id); setDeleteInputEmail(''); }}
                  disabled={deletingId === comment.id}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 max-sm:opacity-100 transition-opacity text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-md"
                  title="Löschen"
                >
                  {deletingId === comment.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                </Button>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              {!isReply && (
                <button
                  onClick={() => {
                    setReplyTo(replyTo?.id === comment.id ? null : comment);
                    setContent('');
                  }}
                  className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-primary transition-colors"
                >
                  <Reply className="h-3 w-3" />
                  Antworten
                </button>
              )}
            </div>
            {deleteDialogId === comment.id && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-3 border border-destructive/20 rounded-xl bg-destructive/5 space-y-2"
              >
                <p className="text-xs font-semibold text-foreground">Kommentar löschen?</p>
                <p className="text-[11px] text-muted-foreground">Gib deine E-Mail zur Bestätigung ein.</p>
                <Input
                  type="email"
                  placeholder="E-Mail-Adresse"
                  value={deleteInputEmail}
                  onChange={(e) => setDeleteInputEmail(e.target.value)}
                  disabled={deletingId === comment.id}
                  className="text-sm rounded-lg h-8"
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive" className="rounded-lg h-7 text-xs"
                    onClick={() => handleDelete(comment.id, deleteInputEmail)}
                    disabled={deletingId === comment.id || !deleteInputEmail.trim()}
                  >
                    {deletingId === comment.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Löschen
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-lg h-7 text-xs"
                    onClick={() => { setDeleteDialogId(null); setDeleteInputEmail(''); }}
                  >
                    Abbrechen
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-border/30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">Kommentare</h3>
            <p className="text-sm text-muted-foreground">{comments.length} {comments.length === 1 ? 'Kommentar' : 'Kommentare'}</p>
          </div>
        </div>
        {comments.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg h-8"
          >
            {sortOrder === 'newest' ? <ArrowDownNarrowWide className="h-3.5 w-3.5" /> : <ArrowUpNarrowWide className="h-3.5 w-3.5" />}
            {sortOrder === 'newest' ? 'Neueste' : 'Älteste'}
          </Button>
        )}
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden">
        <CardContent className="p-5 sm:p-7">
          <p className="text-sm font-semibold text-foreground mb-4">
            {replyTo ? `Antwort an ${replyTo.authorName}` : 'Kommentar schreiben'}
            {replyTo && (
              <button onClick={() => setReplyTo(null)} className="ml-2 text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                (abbrechen)
              </button>
            )}
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="flex gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {replyTo && (
              <div className="text-xs text-muted-foreground/60 bg-muted/30 p-2.5 rounded-lg border border-border/30 italic">
                Antwort auf „{replyTo.content.slice(0, 100)}{replyTo.content.length > 100 ? '…' : ''}“
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="author-name" className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold">Name</Label>
                <Input id="author-name" type="text" placeholder="Dein Name"
                  value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                  disabled={isSubmitting} maxLength={100}
                  className="rounded-xl border-border/60 bg-background focus-visible:border-primary/60 h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="author-email" className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold">E-Mail <span className="text-muted-foreground/60 normal-case tracking-normal">(nicht öffentlich)</span></Label>
                <Input id="author-email" type="email" placeholder="E-Mail-Adresse"
                  value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-xl border-border/60 bg-background focus-visible:border-primary/60 h-9 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="comment-content" className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold">Kommentar</Label>
              <Textarea id="comment-content" placeholder="Teile deine Gedanken..."
                value={content} onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting} rows={3} maxLength={5000}
                className="min-h-[100px] resize-y rounded-xl border-border/60 bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus-visible:border-primary/60"
              />
              <p className="text-[11px] text-muted-foreground/60 text-right">{content.length}/5000</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" size="sm" disabled={isSubmitting || !authorName.trim() || !authorEmail.trim() || !content.trim()} className="rounded-xl gap-1.5 h-9 text-sm">
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {isSubmitting ? 'Wird veröffentlicht…' : replyTo ? 'Antworten' : 'Absenden'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-14">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Kommentare werden geladen…</p>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-14">
          <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="font-semibold text-foreground">Noch keine Kommentare</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Sei der Erste und teile deine Gedanken!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {topLevel.map((comment) => (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-2"
              >
                <CommentCard comment={comment} />

                {replyTo?.id === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-10 sm:ml-11"
                  >
                    <div className="text-xs text-muted-foreground/50 mb-1 flex items-center gap-2">
                      <span className="h-px flex-1 bg-border/40" />
                      <Reply className="h-3 w-3" />
                      Antwort an {comment.authorName}
                    </div>
                  </motion.div>
                )}

                {replies.has(comment.id) && (
                  <div className="ml-8 sm:ml-9 pl-3 sm:pl-4 border-l-2 border-border/40 space-y-2">
                    {replies.get(comment.id)!.map((reply) => (
                      <CommentCard key={reply.id} comment={reply} isReply />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
